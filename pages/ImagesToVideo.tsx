import React, { useState, useCallback, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Play, Download, Trash2, Video } from 'lucide-react';
import InterstitialAd from '../components/InterstitialAd';
import { createVideoFromImages } from '../utils/imageProcessor';
import { AppState, FrameRate, SUPPORTED_FPS } from '../types';
import { useToast } from '../components/Toast';

const ImagesToVideo: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [fps, setFps] = useState<FrameRate>(30);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Explicitly type 'f' as File to avoid 'unknown' type error in some TS environments
      // and use Array.from safely
      const newFiles = Array.from(e.target.files).filter((f: any) => f.type.startsWith('image/')) as File[];
      
      // Natural sort for filenames like frame_1.jpg, frame_10.jpg
      const sorted = [...images, ...newFiles].sort((a, b) => 
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
      );
      setImages(sorted);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setImages([]);
    setDownloadUrl(null);
    setAppState(AppState.IDLE);
  };

  const startConversion = () => {
    if (images.length === 0) return;
    setShowInterstitial(true);
  };

  const executeConversion = async () => {
    setShowInterstitial(false);
    setAppState(AppState.PROCESSING);
    setProgress(0);

    try {
      const videoBlob = await createVideoFromImages({
        images,
        fps,
        onProgress: (prog) => setProgress(prog)
      });
      const url = URL.createObjectURL(videoBlob);
      setDownloadUrl(url);
      setAppState(AppState.COMPLETED);
      showToast('Video created successfully!', 'success');
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
      showToast('Failed to create video. Please ensure images are valid.', 'error');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      {showInterstitial && <InterstitialAd onSkip={executeConversion} />}
      
      <div className="text-center space-y-4 max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
          Convert Images to <span className="text-cyan-400">Video</span>
        </h2>
        <p className="text-gray-400 text-lg">
          Turn a sequence of images into a smooth MP4/WebM video. Perfect for stop motion or time-lapses.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-6">
        {/* Upload Area */}
        <div className="mb-8">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-2xl cursor-pointer bg-gray-950/50 hover:bg-gray-900 hover:border-cyan-500 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-8 h-8 mb-2 text-gray-500 group-hover:text-cyan-400 transition-colors" />
              <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-white">Click to upload images</span> or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, WebP supported</p>
            </div>
            <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>

        {/* Image List Preview */}
        {images.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center text-sm text-gray-400">
               <span><strong className="text-white">{images.length}</strong> images loaded</span>
               <button onClick={clearAll} className="text-red-400 hover:text-red-300 flex items-center gap-1 font-medium transition-colors">
                 <Trash2 className="w-4 h-4" /> Clear All
               </button>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto p-3 bg-gray-950/50 rounded-xl border border-gray-800 custom-scrollbar">
              {images.map((img, idx) => (
                <div key={idx} className="relative group aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  <img src={URL.createObjectURL(img)} alt={`frame ${idx}`} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-gray-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 transition-opacity backdrop-blur-sm"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                  <span className="absolute bottom-0 right-0 text-[10px] font-mono bg-gray-950/80 text-cyan-400 px-1.5 py-0.5 rounded-tl">{idx + 1}</span>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-5 bg-gray-950 rounded-2xl border border-gray-800">
               <div className="w-full md:w-auto">
                 <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Frame Rate</label>
                 <select 
                    value={fps} 
                    onChange={(e) => setFps(Number(e.target.value) as FrameRate)}
                    className="bg-gray-900 border border-gray-700 text-white text-sm rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 outline-none font-medium"
                 >
                   {SUPPORTED_FPS.map(f => <option key={f} value={f}>{f} FPS</option>)}
                 </select>
               </div>

               <div className="flex-grow flex flex-col items-center">
                  <div className="text-sm text-gray-500 font-medium">
                    Estimated Duration <br className="sm:hidden" />
                    <span className="text-cyan-400 font-mono sm:ml-2 bg-cyan-950/30 px-2 py-1 rounded text-lg">{Math.round((images.length / fps) * 100) / 100}s</span>
                  </div>
               </div>

               <button
                 onClick={startConversion}
                 disabled={appState === AppState.PROCESSING}
                 className="w-full md:w-auto px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
               >
                 {appState === AppState.PROCESSING ? (
                    'Processing...'
                 ) : (
                    <>
                       <Video className="w-5 h-5" /> Generate Video
                    </>
                 )}
               </button>
            </div>
          </div>
        )}

        {/* Processing/Result State */}
        {(appState === AppState.PROCESSING || appState === AppState.COMPLETED) && (
           <div className="mt-8 p-8 bg-gray-950 rounded-2xl border border-gray-800 text-center">
              {appState === AppState.PROCESSING && (
                 <div className="space-y-5">
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-gray-400 font-mono">Rendering video... <span className="text-white">{progress}%</span></p>
                 </div>
              )}

              {appState === AppState.COMPLETED && downloadUrl && (
                 <div className="space-y-6 animate-fade-in">
                    <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-3 font-display">
                      <div className="bg-cyan-950/50 p-2 rounded-full border border-cyan-800"><div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse"></div></div>
                      Video Ready!
                    </h3>
                    <div className="bg-black/50 p-2 rounded-xl border border-gray-800 max-w-sm mx-auto">
                      <video controls src={downloadUrl} className="w-full max-h-[300px] bg-black rounded-lg" />
                    </div>
                    <a 
                      href={downloadUrl} 
                      download="output_video.webm" 
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-950 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20"
                    >
                      <Download className="w-5 h-5" /> Download Video
                    </a>
                 </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
};

export default ImagesToVideo;