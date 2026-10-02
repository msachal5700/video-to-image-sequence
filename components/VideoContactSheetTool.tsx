import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Loader2, CheckCircle2, Download, AlertTriangle, LayoutGrid } from 'lucide-react';
import Dropzone from './Dropzone';
import { buildContactSheet } from '../utils/contactSheet';
import { useToast } from './Toast';
import { openFeedbackWidget } from './FeedbackWidget';

const FRAME_OPTIONS = [9, 16, 25, 36];
const COLUMN_OPTIONS = [2, 3, 4, 5, 6];

const VideoContactSheetTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoMeta, setVideoMeta] = useState<{ name: string; duration: number; width: number; height: number } | null>(null);
  const [frameCount, setFrameCount] = useState(16);
  const [columns, setColumns] = useState(4);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [format, setFormat] = useState<'jpg' | 'png'>('jpg');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; name: string; width: number; height: number } | null>(null);
  const [downloaded, setDownloaded] = useState(false);
  const cancelRef = useRef(false);
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith('video/')) {
      showToast('Invalid file type. Please select an MP4, MOV, or WEBM video file.', 'error');
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      setVideoMeta({
        name: selectedFile.name,
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      });
      setFile(selectedFile);
      setResult(null);
      setError(null);
      setDownloaded(false);
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      showToast('Could not read video metadata. The file may be corrupted or unsupported.', 'error');
    };
    video.src = url;
  }, [showToast]);

  const handleGenerate = useCallback(async () => {
    if (!file || processing) return;
    setProcessing(true);
    setError(null);
    setDownloaded(false);
    cancelRef.current = false;
    if (result) {
      URL.revokeObjectURL(result.url);
      setResult(null);
    }

    try {
      const sheet = await buildContactSheet({
        file,
        frameCount,
        columns: Math.min(columns, frameCount),
        showTimestamps,
        showHeader,
        format,
        quality: 0.92,
        thumbWidth: 320,
        onProgress: (done, total) => {
          if (cancelRef.current) throw new Error('Cancelled');
          setProgress({ done, total });
        },
      });
      const url = URL.createObjectURL(sheet.blob);
      const ext = format === 'jpg' ? 'jpg' : 'png';
      const base = file.name.replace(/\.[^.]+$/, '');
      setResult({
        url,
        name: `${base}_contact_sheet.${ext}`,
        width: sheet.width,
        height: sheet.height,
      });
      showToast('Contact sheet ready — download it below.', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong while building the sheet.';
      if (msg !== 'Cancelled') {
        setError(msg);
      }
    } finally {
      setProcessing(false);
      setProgress({ done: 0, total: 0 });
    }
  }, [file, processing, frameCount, columns, showTimestamps, showHeader, format, result, showToast]);

  const handleReset = useCallback(() => {
    cancelRef.current = true;
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setVideoMeta(null);
    setResult(null);
    setError(null);
    setProcessing(false);
    setDownloaded(false);
    setProgress({ done: 0, total: 0 });
  }, [result]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.name;
    a.click();
    setDownloaded(true);
    showToast('Download started — check your downloads folder.', 'success');
  }, [result, showToast]);

  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl shadow-black/50 p-1">
        <div className="p-4 sm:p-8 bg-gray-900/50 rounded-2xl">
          {!file ? (
            <>
              <Dropzone onFileSelect={handleFileSelect} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 mb-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900 rounded-full flex items-center justify-center mx-auto text-cyan-400">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white">One-Image Overview</h3>
                  <p className="text-sm text-gray-500">9–36 evenly-spaced frames tiled into a single grid image.</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900 rounded-full flex items-center justify-center mx-auto text-cyan-400 font-bold text-xl">🔒</div>
                  <h3 className="font-semibold text-white">100% Private</h3>
                  <p className="text-sm text-gray-500">Built in your browser — your video is never uploaded.</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900 rounded-full flex items-center justify-center mx-auto text-cyan-400 font-bold text-xl">↓</div>
                  <h3 className="font-semibold text-white">JPG or PNG</h3>
                  <p className="text-sm text-gray-500">Download the finished sheet as a shareable image.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* File info */}
              <div className="mb-6 flex items-center justify-between bg-gray-950/60 border border-gray-800 p-4 rounded-xl">
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{videoMeta?.name}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {videoMeta && `${videoMeta.width}×${videoMeta.height} • ${Math.round(videoMeta.duration)}s`}
                  </p>
                </div>
                <button onClick={handleReset} className="text-gray-400 hover:text-white text-sm shrink-0 ml-4">
                  Change video
                </button>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div>
                  <p className="text-gray-300 text-sm font-semibold mb-2">Frames in sheet</p>
                  <div className="flex gap-2 flex-wrap">
                    {FRAME_OPTIONS.map(n => (
                      <button
                        key={n}
                        onClick={() => setFrameCount(n)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${frameCount === n ? 'bg-cyan-500 text-gray-950 border-cyan-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-semibold mb-2">Grid columns</p>
                  <div className="flex gap-2 flex-wrap">
                    {COLUMN_OPTIONS.map(n => (
                      <button
                        key={n}
                        onClick={() => setColumns(n)}
                        disabled={n > frameCount}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${columns === n ? 'bg-cyan-500 text-gray-950 border-cyan-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700'} ${n > frameCount ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-semibold mb-2">Output format</p>
                  <div className="flex gap-2">
                    {(['jpg', 'png'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border uppercase transition-colors ${format === f ? 'bg-cyan-500 text-gray-950 border-cyan-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-semibold mb-2">Labels</p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setShowTimestamps(v => !v)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${showTimestamps ? 'bg-cyan-500/15 text-cyan-300 border-cyan-700' : 'bg-gray-800 text-gray-400 border-gray-700'}`}
                    >
                      {showTimestamps ? '✓' : ''} Timestamps
                    </button>
                    <button
                      onClick={() => setShowHeader(v => !v)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${showHeader ? 'bg-cyan-500/15 text-cyan-300 border-cyan-700' : 'bg-gray-800 text-gray-400 border-gray-700'}`}
                    >
                      {showHeader ? '✓' : ''} Header strip
                    </button>
                  </div>
                </div>
              </div>

              {/* Generate */}
              {!processing && !result && (
                <button
                  onClick={handleGenerate}
                  className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-950 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] shadow-lg shadow-cyan-500/20"
                >
                  Generate Contact Sheet
                </button>
              )}

              {/* Progress */}
              {processing && (
                <div className="space-y-4 py-4">
                  <h3 className="text-lg font-bold text-white flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                    Building your sheet…
                  </h3>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
                    <div className="bg-cyan-400 h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }}></div>
                  </div>
                  <p className="text-center text-sm text-gray-400 font-mono">
                    {progress.done} / {progress.total} frames
                  </p>
                  <div className="flex justify-center">
                    <button onClick={() => { cancelRef.current = true; }} className="text-xs text-gray-500 hover:text-red-400 underline underline-offset-4">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="text-center space-y-4 py-6">
                  <div className="mx-auto w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-red-500" />
                  </div>
                  <p className="text-gray-400 text-sm max-w-lg mx-auto">{error}</p>
                  <button onClick={() => setError(null)} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors">
                    Try again
                  </button>
                </div>
              )}

              {/* Result */}
              {result && !processing && (
                <div className="space-y-6 animate-fade-in text-center pt-2">
                  <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-7 h-7 text-cyan-400" />
                    Sheet ready
                  </h3>
                  <div className="max-w-2xl mx-auto border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
                    <img src={result.url} alt="Video contact sheet preview" className="w-full h-auto" />
                  </div>
                  <p className="text-gray-500 text-xs font-mono">
                    {result.width} × {result.height}px
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
                    <button
                      onClick={handleDownload}
                      className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg text-lg ${downloaded ? 'bg-green-500 text-gray-950 shadow-green-500/20' : 'bg-cyan-500 hover:bg-cyan-400 text-gray-950 shadow-cyan-500/20'}`}
                    >
                      {downloaded ? (
                        <><CheckCircle2 className="w-5 h-5" /> Download started — check your downloads</>
                      ) : (
                        <><Download className="w-5 h-5" /> Download Contact Sheet</>
                      )}
                    </button>
                    <button onClick={handleReset} className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-all border border-gray-700">
                      Make another
                    </button>
                  </div>
                  <button
                    onClick={openFeedbackWidget}
                    className="mt-2 text-sm text-gray-500 hover:text-cyan-400 underline underline-offset-4 transition-colors"
                  >
                    Something not working? Report a problem
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoContactSheetTool;
