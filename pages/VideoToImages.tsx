import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, Download, AlertTriangle, Eye, X, Film, Copy } from 'lucide-react';
import Dropzone from '../components/Dropzone';
import Controls from '../components/Controls';
import InterstitialAd from '../components/InterstitialAd';
import { AppState, FrameRate, VideoMetadata, ProcessingStats, OutputFormat } from '../types';
import { extractFramesAndZip, formatTime } from '../utils/videoProcessor';
import { useToast } from '../components/Toast';
import { useTranslation } from 'react-i18next';

interface ExtractedFrame {
  url: string;
  blob: Blob;
  index: number;
}

const VideoToImages: React.FC = () => {
  const { t } = useTranslation();
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  
  // Batch queue state
  const [queue, setQueue] = useState<File[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [completedZips, setCompletedZips] = useState<{ url: string; name: string }[]>([]);
  const cancelRef = useRef(false);
  const activeWorkerRef = useRef<Worker | null>(null);

  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const [selectedFps, setSelectedFps] = useState<FrameRate>(30);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpg');
  const [processingStats, setProcessingStats] = useState<ProcessingStats | null>(null);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [extractedFrames, setExtractedFrames] = useState<ExtractedFrame[]>([]);
  const [visibleFrames, setVisibleFrames] = useState(30);
  
  const frameUrlsRef = useRef<string[]>([]);
  const { showToast } = useToast();

  const cleanupFrameUrls = useCallback(() => {
    frameUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    frameUrlsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup all object URLs when component unmounts
      setCompletedZips(prev => {
        prev.forEach(zip => URL.revokeObjectURL(zip.url));
        return [];
      });
      cleanupFrameUrls();
      if (activeWorkerRef.current) {
        activeWorkerRef.current.terminate();
        activeWorkerRef.current = null;
      }
    };
  }, [cleanupFrameUrls]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith('video/')) {
      showToast('Invalid file type. Please select an MP4, MOV, or WEBM video file.', 'error');
      return; 
    }

    setQueue(prev => {
      const isFirst = prev.length === 0;
      if (isFirst) {
        try {
          const video = document.createElement('video');
          video.preload = 'metadata';
          const objectUrl = URL.createObjectURL(selectedFile);
          video.src = objectUrl;
          
          video.onloadedmetadata = () => {
            setVideoMetadata({
              name: selectedFile.name,
              duration: video.duration,
              width: video.videoWidth,
              height: video.videoHeight,
              originalSize: selectedFile.size,
              type: selectedFile.type,
            });
            URL.revokeObjectURL(objectUrl);
          };

          video.onerror = () => {
            console.error('Error parsing video metadata');
            URL.revokeObjectURL(objectUrl);
            showToast('Could not read video metadata. The file may be corrupted or unsupported.', 'error');
          };
        } catch (err) {
          console.error("Error handling file selection:", err);
          showToast('An unexpected error occurred while selecting the file.', 'error');
        }
      }
      return [...prev, selectedFile];
    });
  }, [showToast]);

  const initiateProcess = useCallback(() => {
    if (queue.length === 0) return;
    setShowInterstitial(true);
  }, [queue]);

  const handleFrame = useCallback((blob: Blob, index: number) => {
    const url = URL.createObjectURL(blob);
    frameUrlsRef.current.push(url);
    if (index < 200) {
      setExtractedFrames(prev => [...prev, { url, blob, index }]);
    }
  }, []);

  const executeConversion = useCallback(async () => {
    if (queue.length === 0) return;

    setShowInterstitial(false);
    cancelRef.current = false;
    let currentZips = [...completedZips];

    setAppState(AppState.PROCESSING);

    for (let i = currentQueueIndex; i < queue.length; i++) {
        if (cancelRef.current) break;

        setCurrentQueueIndex(i);
        setAppState(AppState.PROCESSING);
        
        // Clean up previous frames to save memory if part of a batch
        cleanupFrameUrls();
        setExtractedFrames([]);
        setVisibleFrames(30);
        setPreviewImage(null);
        setErrorMessage(null);
        setRawError(null);
        setProcessingStats({
          totalFrames: 0,
          processedFrames: 0,
          progress: 0,
          startTime: Date.now(),
          estimatedTimeRemaining: null,
        });

        try {
          const zipBlob = await extractFramesAndZip({
            file: queue[i],
            fps: selectedFps,
            format: outputFormat,
            maxFrames: 5000,
            onProgress: (stats) => {
              setProcessingStats(stats);
              if (stats.progress === 100) {
                 setAppState(AppState.ZIPPING);
              }
            },
            onFrame: handleFrame,
            workerRef: activeWorkerRef
          });

          const url = URL.createObjectURL(zipBlob);
          currentZips.push({ url, name: `frames_${queue[i].name}_${selectedFps}fps_${outputFormat}.zip` });
          setCompletedZips([...currentZips]);
        } catch (error) {
          console.error('Processing failed for', queue[i].name, error);
          
          if (queue.length === 1) {
             const errorMessageValue = error instanceof Error ? error.message : 'Unknown error';
             setRawError(errorMessageValue);
             const friendlyMessage = errorMessageValue.includes(':') 
               ? errorMessageValue.split(':').slice(1).join(':').trim() 
               : 'We could not process this video. The format may be unsupported by your browser.';
             
             setErrorMessage(friendlyMessage);
             setAppState(AppState.ERROR);
             return; // Stop entirely if it's the only file
          }
          // Continue to next file in batch mode
        }
    }

    if (!cancelRef.current) {
        setAppState(AppState.COMPLETED);
        if (queue.length > 1) {
          showToast(`All ${queue.length} videos processed successfully!`, 'success');
        } else {
          showToast('Frames extracted successfully! Your ZIP is ready to download.', 'success');
        }
    }
  }, [queue, currentQueueIndex, selectedFps, outputFormat, completedZips, handleFrame, cleanupFrameUrls, showToast]);

  const handleCancelQueue = () => {
    cancelRef.current = true;
    if (activeWorkerRef.current) {
      activeWorkerRef.current.terminate();
      activeWorkerRef.current = null;
    }
    setAppState(AppState.COMPLETED); // Treat as done with what we have
  };

  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setQueue([]);
    setCurrentQueueIndex(0);
    setVideoMetadata(null);
    setProcessingStats(null);
    setShowInterstitial(false);
    setPreviewImage(null);
    setErrorMessage(null);
    setRawError(null);
    
    cleanupFrameUrls();
    setExtractedFrames([]);
    setVisibleFrames(30);
    
    if (activeWorkerRef.current) {
      activeWorkerRef.current.terminate();
      activeWorkerRef.current = null;
    }
    
    setCompletedZips(prev => {
      prev.forEach(zip => URL.revokeObjectURL(zip.url));
      return [];
    });
  }, [cleanupFrameUrls]);

  const handleLoadMore = () => {
    setVisibleFrames(prev => prev + 30);
  };

  const handleDownloadAllZips = async () => {
      for (let i = 0; i < completedZips.length; i++) {
         const zip = completedZips[i];
         const a = document.createElement('a');
         a.href = zip.url;
         a.download = zip.name;
         a.click();
         if (i < completedZips.length - 1) {
            await new Promise(r => setTimeout(r, 500));
         }
      }
  };

  const isBatch = queue.length > 1;

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      {showInterstitial && <InterstitialAd onSkip={executeConversion} />}

      <div className="text-center space-y-4 max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
          {t('common.convertTitle')}
        </h2>
        <p className="text-gray-400 text-lg">
          {t('common.convertSub')}
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl shadow-black/50 p-1">
        {queue.length === 0 ? (
          <div className="p-8 bg-gray-900/50 rounded-2xl">
            <Dropzone onFileSelect={handleFileSelect} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 mb-4">
               <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900 rounded-full flex items-center justify-center mx-auto text-cyan-400 font-bold text-xl">🔒</div>
                  <h3 className="font-semibold text-white">{t('common.noServerUploads')}</h3>
                  <p className="text-sm text-gray-500">{t('common.noServerUploadsDesc')}</p>
               </div>
               <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900 rounded-full flex items-center justify-center mx-auto text-cyan-400 font-bold text-xl">ZIP</div>
                  <h3 className="font-semibold text-white">{t('common.downloadZipTitle')}</h3>
                  <p className="text-sm text-gray-500">{t('common.downloadZipDesc')}</p>
               </div>
               <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900 rounded-full flex items-center justify-center mx-auto text-cyan-400 font-bold text-xl">🔒</div>
                  <h3 className="font-semibold text-white">{t('common.secureTitle')}</h3>
                  <p className="text-sm text-gray-500">{t('common.secureDesc')}</p>
               </div>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-8 bg-gray-900/50 rounded-2xl">
            
            {/* Controls only show before processing starts */}
            {videoMetadata && appState === AppState.IDLE && (
              <>
                {isBatch && (
                  <div className="mb-4 flex items-center justify-between bg-cyan-950/40 border border-cyan-900/50 p-4 rounded-xl">
                    <span className="text-cyan-400 font-semibold flex items-center gap-2">
                      <Film className="w-5 h-5" /> {t('common.queue', { count: queue.length })}
                    </span>
                    <button onClick={handleReset} className="text-gray-400 hover:text-white text-sm">{t('common.clear')}</button>
                  </div>
                )}
                <Controls
                  videoMetadata={videoMetadata}
                  selectedFps={selectedFps}
                  onFpsChange={setSelectedFps}
                  outputFormat={outputFormat}
                  onFormatChange={setOutputFormat}
                  onProcess={initiateProcess}
                  onReset={handleReset}
                  appState={appState}
                />
              </>
            )}

            {/* Inline Processing & Results */}
            {(appState === AppState.PROCESSING || appState === AppState.ZIPPING || appState === AppState.COMPLETED || appState === AppState.ERROR) && (
              <div className="mt-8 p-6 sm:p-8 bg-gray-950/80 rounded-3xl border border-gray-800 animate-fade-in shadow-inner">
                
                {appState === AppState.ERROR ? (
                   <div className="text-center space-y-4 py-8">
                     <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                       <AlertTriangle className="w-8 h-8 text-red-500" />
                     </div>
                     <h3 className="text-xl font-bold text-white font-display">{t('common.failed')}</h3>
                     <p className="text-gray-400 text-sm max-w-lg mx-auto">{errorMessage || "We couldn't process this video. The format may be unsupported."}</p>
                     {rawError && (
                       <button
                         onClick={() => {
                           navigator.clipboard.writeText(rawError);
                           showToast('Error copied to clipboard', 'info');
                         }}
                         className="flex items-center gap-1.5 mx-auto px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg text-xs transition-colors"
                       >
                         <Copy className="w-3.5 h-3.5" /> {t('common.copyRawError')}
                       </button>
                     )}
                     <button onClick={handleReset} className="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors">
                       {t('common.startOver')}
                     </button>
                   </div>
                ) : appState !== AppState.COMPLETED ? (
                  <div className="space-y-6 mb-10">
                    
                    {isBatch && (
                      <div className="flex justify-between items-center bg-gray-900 px-4 py-3 rounded-xl border border-gray-800 mb-2">
                        <span className="text-gray-300 font-medium">{t('common.videoQueueProgress', { index: currentQueueIndex + 1, count: queue.length })}</span>
                        <div className="flex items-center gap-3">
                           <span className="text-gray-500 text-sm truncate max-w-[200px]">{queue[currentQueueIndex].name}</span>
                           <button onClick={handleCancelQueue} className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg transition-colors font-semibold">
                              {t('common.cancelQueue')}
                           </button>
                        </div>
                      </div>
                    )}

                    <h3 className="text-xl sm:text-2xl font-bold text-white font-display flex items-center justify-center gap-3">
                       <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                       {appState === AppState.ZIPPING ? t('common.zipping') : t('common.processing')}
                    </h3>
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
                       <div className="bg-cyan-400 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_2px_rgba(34,211,238,0.4)]" style={{ width: `${processingStats?.progress || 0}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-sm font-mono tracking-wide">
                       <p className="text-gray-400">
                         {t('common.processedFramesText', { processed: processingStats?.processedFrames || 0, total: processingStats?.totalFrames || 0 })}
                       </p>
                       {appState === AppState.PROCESSING && processingStats?.estimatedTimeRemaining !== undefined && (
                         <p className="text-cyan-400 font-semibold bg-cyan-950/40 px-3 py-1 rounded-md border border-cyan-900/50">
                            EST: {formatTime(processingStats.estimatedTimeRemaining || 0)}
                         </p>
                       )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-fade-in mb-10 text-center">
                    <h3 className="text-3xl font-bold text-white flex items-center justify-center gap-4 font-display">
                      <div className="bg-cyan-950/80 p-2.5 rounded-full border border-cyan-800 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                      </div>
                      {t('common.complete')}
                    </h3>
                    {!isBatch ? (
                      <p className="text-gray-400 text-lg">{t('common.framesExtracted', { count: extractedFrames.length })}</p>
                    ) : (
                      <p className="text-gray-400 text-lg">{t('common.framesExtracted', { count: completedZips.length })}</p>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
                       
                       {completedZips.length > 0 && (
                         <button 
                           onClick={handleDownloadAllZips} 
                           className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-950 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20 text-lg"
                         >
                           <Download className="w-5 h-5" /> 
                           {isBatch ? t('common.downloadAllZips') : t('common.downloadAll')}
                         </button>
                       )}

                       <button onClick={handleReset} className="px-8 py-4 bg-gray-800 hover:bg-gray-700 hover:text-white text-gray-300 rounded-xl font-medium transition-all border border-gray-700 shadow-md">
                         {t('common.convertAnother')}
                       </button>
                    </div>
                  </div>
                )}

                {/* Frame Grid - Shows frames for the most recently processed video */}
                {extractedFrames.length > 0 && (
                  <div className="mt-8 border-t border-gray-800 pt-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                       <h4 className="text-xl font-bold text-white font-display">
                         {isBatch ? `Preview: ${queue[currentQueueIndex]?.name}` : t('common.processed')}
                       </h4>
                       <span className="text-sm font-mono text-cyan-400 bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-900/50">
                         {t('common.showingFrames', { showing: Math.min(visibleFrames, extractedFrames.length), total: Math.min(extractedFrames.length, 200) })}
                       </span>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {extractedFrames.slice(0, visibleFrames).map((frame, idx) => (
                          <div key={idx} className="relative group aspect-square bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                             <img src={frame.url} alt={`frame ${frame.index}`} className="w-full h-full object-cover" width={160} height={90} loading="lazy" decoding="async" />
                             
                             {/* Make it mobile friendly: Use a visible linear gradient at bottom with buttons on touch devices */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent sm:bg-gray-950/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center transition-all sm:backdrop-blur-[2px]">
                               <div className="hidden sm:flex gap-2">
                                 <button onClick={() => setPreviewImage(frame.url)} className="bg-gray-800 hover:bg-gray-700 text-white p-2.5 rounded-full transform hover:scale-110 transition-transform shadow-lg" title="Preview Frame">
                                   <Eye className="w-4 h-4" />
                                 </button>
                                 <a href={frame.url} download={`frame_${frame.index.toString().padStart(6, '0')}.${outputFormat}`} className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 p-2.5 rounded-full transform hover:scale-110 transition-transform shadow-lg" title="Download Frame">
                                   <Download className="w-4 h-4" />
                                 </a>
                               </div>
                               <div className="absolute bottom-2 right-2 flex sm:hidden gap-1.5 pointer-events-auto">
                                 <button onClick={() => setPreviewImage(frame.url)} className="bg-gray-800/90 text-white p-2 rounded-full shadow-lg backdrop-blur-sm pointer-events-auto" title="Preview Frame">
                                   <Eye className="w-3.5 h-3.5" />
                                 </button>
                                 <a href={frame.url} download={`frame_${frame.index.toString().padStart(6, '0')}.${outputFormat}`} className="bg-cyan-500/90 text-gray-950 p-2 rounded-full shadow-lg backdrop-blur-sm pointer-events-auto" title="Download Frame">
                                   <Download className="w-3.5 h-3.5" />
                                 </a>
                               </div>
                            </div>
                            <span className="absolute top-0 left-0 sm:top-auto sm:bottom-0 bg-gray-950/90 text-cyan-400 text-[10px] px-2 py-1 rounded-br-lg sm:rounded-br-none sm:rounded-tr-lg font-mono border-b sm:border-b-0 sm:border-t border-r border-gray-800 point-events-none">
                              #{frame.index.toString().padStart(4, '0')}
                            </span>
                         </div>
                      ))}
                    </div>
                    
                    {processingStats && processingStats.totalFrames > 200 && (
                      <p className="text-gray-400 text-sm mt-8 text-center bg-gray-900 border border-gray-800 py-3 rounded-xl shadow-inner max-w-lg mx-auto">
                        {t('common.showOnly200', { count: processingStats.totalFrames })}
                      </p>
                    )}
                    
                    {visibleFrames < extractedFrames.length && (
                       <div className="mt-10 flex justify-center">
                         <button onClick={handleLoadMore} className="group px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-cyan-400 rounded-xl text-sm font-bold border border-gray-700 hover:border-cyan-800 transition-all shadow-md flex items-center gap-2">
                           {t('common.loadMore')}
                           <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
                         </button>
                       </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Screen Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/95 backdrop-blur-sm animate-fade-in" 
          onClick={() => setPreviewImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 bg-gray-800/80 hover:bg-red-500/80 text-white rounded-full transition-colors"
            onClick={() => setPreviewImage(null)}
            title="Close Preview"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={previewImage} 
            alt="Frame preview maximized" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
};

export default VideoToImages;