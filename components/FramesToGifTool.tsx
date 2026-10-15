import React, { useState, useCallback, useEffect, useRef } from 'react';
import { UploadCloud, Trash2, Download, Play, Pause, ArrowLeft, ArrowRight, Film } from 'lucide-react';
import GIF from 'gif.js';
import gifWorkerUrl from 'gif.js/dist/gif.worker.js?url';
import { AppState } from '../types';
import { useToast } from './Toast';

interface FrameItem {
  id: string;
  file: File;
  url: string;
  delayMs: number;
}

const FPS_OPTIONS = [1, 2, 4, 5, 8, 10, 12, 15, 20, 24, 30];
const QUALITY_OPTIONS = [
  { value: 1, label: 'Best' },
  { value: 5, label: 'High' },
  { value: 10, label: 'Medium' },
  { value: 20, label: 'Fast' },
];

let idCounter = 0;
const nextId = () => `frame-${Date.now()}-${idCounter++}`;

const FramesToGifTool: React.FC = () => {
  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [fps, setFps] = useState<number>(10);
  const [useCustomDelay, setUseCustomDelay] = useState(false);
  const [loopForever, setLoopForever] = useState(true);
  const [loopCount, setLoopCount] = useState(3);
  const [quality, setQuality] = useState(10);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState<number>(0);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const { showToast } = useToast();
  const previewTimer = useRef<number | null>(null);

  // Cleanup object URLs on unmount / frames change
  useEffect(() => {
    return () => {
      frames.forEach(f => URL.revokeObjectURL(f.url));
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      if (previewTimer.current) window.clearInterval(previewTimer.current);
    };
  }, []);

  const stopPreview = useCallback(() => {
    if (previewTimer.current) {
      window.clearInterval(previewTimer.current);
      previewTimer.current = null;
    }
    setIsPreviewPlaying(false);
  }, []);

  // Preview playback
  useEffect(() => {
    if (isPreviewPlaying && frames.length > 0) {
      const delay = useCustomDelay ? frames[previewIndex % frames.length].delayMs : Math.round(1000 / fps);
      previewTimer.current = window.setTimeout(() => {
        setPreviewIndex(i => (i + 1) % frames.length);
      }, Math.max(20, delay));
      return () => {
        if (previewTimer.current) window.clearTimeout(previewTimer.current);
      };
    }
  }, [isPreviewPlaying, previewIndex, frames, fps, useCustomDelay]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter((f: File) =>
        f.type.startsWith('image/')
      );
      const defaultDelay = Math.round(1000 / fps);
      const sorted = [...newFiles].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
      );
      const newFrames: FrameItem[] = sorted.map(f => ({
        id: nextId(),
        file: f,
        url: URL.createObjectURL(f),
        delayMs: defaultDelay,
      }));
      setFrames(prev => [...prev, ...newFrames]);
      setPreviewIndex(0);
      showToast(`${newFrames.length} image${newFrames.length > 1 ? 's' : ''} added`, 'success');
    }
    e.target.value = '';
  };

  const removeFrame = (id: string) => {
    setFrames(prev => {
      const target = prev.find(f => f.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter(f => f.id !== id);
    });
  };

  const clearAll = () => {
    frames.forEach(f => URL.revokeObjectURL(f.url));
    setFrames([]);
    setDownloadUrl(null);
    setAppState(AppState.IDLE);
    stopPreview();
    setPreviewIndex(0);
  };

  const moveFrame = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= frames.length) return;
    setFrames(prev => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const setFrameDelay = (id: string, delayMs: number) => {
    const clamped = Math.max(20, Math.min(10000, delayMs || 20));
    setFrames(prev => prev.map(f => (f.id === id ? { ...f, delayMs: clamped } : f)));
  };

  const applyFpsToAll = (newFps: number) => {
    setFps(newFps);
    const delay = Math.round(1000 / newFps);
    setFrames(prev => prev.map(f => ({ ...f, delayMs: delay })));
  };

  const startExport = async () => {
    if (frames.length === 0) return;
    stopPreview();
    setAppState(AppState.PROCESSING);
    setProgress(0);

    try {
      // Load all images to determine canvas size (use first frame's dimensions)
      const bitmaps: ImageBitmap[] = [];
      let w = 0;
      let h = 0;
      for (let i = 0; i < frames.length; i++) {
        const bmp = await createImageBitmap(frames[i].file);
        if (i === 0) {
          w = bmp.width;
          h = bmp.height;
        }
        bitmaps.push(bmp);
        setProgress(Math.round(((i + 1) / frames.length) * 30));
      }

      const gif = new GIF({
        workers: 2,
        quality,
        width: w,
        height: h,
        workerScript: gifWorkerUrl,
        repeat: loopForever ? 0 : loopCount,
      });

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context is not available in this browser.');

      for (let i = 0; i < bitmaps.length; i++) {
        const bmp = bitmaps[i];
        ctx.clearRect(0, 0, w, h);
        // Contain-fit: preserve aspect ratio, center on transparent/black bg
        const scale = Math.min(w / bmp.width, h / bmp.height);
        const dw = Math.round(bmp.width * scale);
        const dh = Math.round(bmp.height * scale);
        ctx.drawImage(bmp, Math.round((w - dw) / 2), Math.round((h - dh) / 2), dw, dh);
        bmp.close();
        gif.addFrame(ctx, { copy: true, delay: frames[i].delayMs });
        setProgress(Math.round(30 + ((i + 1) / bitmaps.length) * 30));
      }

      gif.on('progress', (p: number) => setProgress(Math.round(60 + p * 40)));
      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        if (downloadUrl) URL.revokeObjectURL(downloadUrl);
        setDownloadUrl(url);
        setGifSize(blob.size);
        setProgress(100);
        setAppState(AppState.COMPLETED);
        showToast('Your GIF is ready to download!', 'success');
      });
      gif.render();
    } catch (err) {
      console.error('GIF export failed:', err);
      setAppState(AppState.ERROR);
      showToast('Failed to create GIF. Please ensure your images are valid.', 'error');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const totalDuration = frames.reduce((sum, f) => sum + f.delayMs, 0) / 1000;

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      <div className="text-center space-y-4 max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
          Images to <span className="text-cyan-400">Animated GIF</span>
        </h2>
        <p className="text-gray-400 text-lg">
          Turn a sequence of images into a looping animated GIF. Perfect for memes, demos, and animations.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-6">
        {/* Upload Area */}
        <div className="mb-8">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-2xl cursor-pointer bg-gray-950/50 hover:bg-gray-900 hover:border-cyan-500 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
              <UploadCloud className="w-8 h-8 mb-2 text-gray-500 group-hover:text-cyan-400 transition-colors" />
              <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-white">Click to upload frames</span> or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, WebP — sorted by filename</p>
            </div>
            <input type="file" className="hidden" multiple accept="image/*" onChange={handleUpload} />
          </label>
        </div>

        {/* Frame Grid */}
        {frames.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span><strong className="text-white">{frames.length}</strong> frames · <span className="text-cyan-400 font-mono">{totalDuration.toFixed(1)}s</span> total</span>
              <button onClick={clearAll} className="text-red-400 hover:text-red-300 flex items-center gap-1 font-medium transition-colors">
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-72 overflow-y-auto p-3 bg-gray-950/50 rounded-xl border border-gray-800 custom-scrollbar">
              {frames.map((frame, idx) => (
                <div key={frame.id} className="relative group aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  <img src={frame.url} alt={`frame ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute top-0 left-0 text-[10px] font-mono bg-gray-950/80 text-cyan-400 px-1.5 py-0.5 rounded-br">{idx + 1}</span>
                  <button
                    onClick={() => removeFrame(frame.id)}
                    className="absolute top-0 right-0 bg-gray-950/60 opacity-0 group-hover:opacity-100 p-1 text-red-500 transition-opacity"
                    title="Remove frame"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-gray-950/70">
                    <button onClick={() => moveFrame(idx, -1)} disabled={idx === 0} className="p-1 text-gray-300 hover:text-cyan-400 disabled:opacity-30" title="Move left">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveFrame(idx, 1)} disabled={idx === frames.length - 1} className="p-1 text-gray-300 hover:text-cyan-400 disabled:opacity-30" title="Move right">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="p-5 bg-gray-950 rounded-2xl border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-300">Animation Preview</span>
                <button
                  onClick={() => { setPreviewIndex(0); setIsPreviewPlaying(!isPreviewPlaying); }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  {isPreviewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPreviewPlaying ? 'Pause' : 'Play'}
                </button>
              </div>
              <div className="bg-black/50 rounded-xl border border-gray-800 max-w-xs mx-auto aspect-video flex items-center justify-center overflow-hidden">
                {frames.length > 0 ? (
                  <img src={frames[previewIndex % frames.length].url} alt="preview" className="max-w-full max-h-full object-contain" />
                ) : (
                  <Film className="w-10 h-10 text-gray-700" />
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-gray-950 rounded-2xl border border-gray-800">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Frame Rate</label>
                <select
                  value={fps}
                  onChange={(e) => applyFpsToAll(Number(e.target.value))}
                  disabled={useCustomDelay}
                  className="bg-gray-900 border border-gray-700 text-white text-sm rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 outline-none font-medium disabled:opacity-50"
                >
                  {FPS_OPTIONS.map(f => <option key={f} value={f}>{f} FPS</option>)}
                </select>
                <label className="flex items-center gap-2 mt-3 text-sm text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCustomDelay}
                    onChange={(e) => setUseCustomDelay(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500"
                  />
                  Custom delay per frame
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Looping</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      checked={loopForever}
                      onChange={() => setLoopForever(true)}
                      className="w-4 h-4 accent-cyan-500"
                    />
                    Loop forever
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      checked={!loopForever}
                      onChange={() => setLoopForever(false)}
                      className="w-4 h-4 accent-cyan-500"
                    />
                    Play
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={loopCount}
                      disabled={loopForever}
                      onChange={(e) => setLoopCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                      className="w-16 bg-gray-900 border border-gray-700 text-white text-sm rounded-lg p-1.5 outline-none disabled:opacity-50"
                    />
                    ×
                  </label>
                </div>
                <label className="block text-xs font-medium text-gray-400 mb-2 mt-4 uppercase tracking-wider">Quality</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="bg-gray-900 border border-gray-700 text-white text-sm rounded-xl focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 outline-none font-medium"
                >
                  {QUALITY_OPTIONS.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
                </select>
              </div>
            </div>

            {/* Per-frame delays */}
            {useCustomDelay && (
              <div className="p-5 bg-gray-950 rounded-2xl border border-gray-800">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Per-frame delay (ms)</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3 max-h-48 overflow-y-auto custom-scrollbar">
                  {frames.map((frame, idx) => (
                    <div key={frame.id} className="flex items-center gap-2 bg-gray-900 rounded-lg px-2 py-1.5 border border-gray-800">
                      <span className="text-xs font-mono text-cyan-400 w-8">#{idx + 1}</span>
                      <input
                        type="number"
                        min={20}
                        max={10000}
                        value={frame.delayMs}
                        onChange={(e) => setFrameDelay(frame.id, Number(e.target.value))}
                        className="w-full bg-transparent text-white text-sm outline-none"
                      />
                      <span className="text-[10px] text-gray-500">ms</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export button */}
            <button
              onClick={startExport}
              disabled={appState === AppState.PROCESSING || frames.length === 0}
              className="w-full px-6 py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
            >
              {appState === AppState.PROCESSING ? 'Rendering GIF...' : (<><Film className="w-5 h-5" /> Create Animated GIF</>)}
            </button>
          </div>
        )}

        {/* Processing / Result */}
        {(appState === AppState.PROCESSING || appState === AppState.COMPLETED) && (
          <div className="mt-8 p-8 bg-gray-950 rounded-2xl border border-gray-800 text-center">
            {appState === AppState.PROCESSING && (
              <div className="space-y-5">
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-gray-400 font-mono">Rendering GIF... <span className="text-white">{progress}%</span></p>
              </div>
            )}
            {appState === AppState.COMPLETED && downloadUrl && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-3 font-display">
                  <div className="bg-cyan-950/50 p-2 rounded-full border border-cyan-800"><div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse"></div></div>
                  GIF Ready! <span className="text-sm font-mono text-gray-400">({formatBytes(gifSize)})</span>
                </h3>
                <div className="bg-black/50 p-2 rounded-xl border border-gray-800 max-w-sm mx-auto">
                  <img src={downloadUrl} alt="Animated GIF result" className="w-full max-h-[300px] object-contain rounded-lg" />
                </div>
                <a
                  href={downloadUrl}
                  download="animation.gif"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-950 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20"
                >
                  <Download className="w-5 h-5" /> Download GIF
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FramesToGifTool;
