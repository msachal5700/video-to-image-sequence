import React, { useRef, useState, useEffect, useCallback } from 'react';
import Dropzone from './Dropzone';

const MAX_FILE_BYTES = 100 * 1024 * 1024;
const SAMPLE_COUNT = 30;       // frames sampled from the final second
const SAMPLE_WINDOW = 1.0;     // seconds before the end to search
const SAMPLE_W = 160;          // analysis resolution (kept small for speed)

type Status = 'idle' | 'loaded' | 'analyzing' | 'done' | 'error';
type Format = 'png' | 'jpeg' | 'webp';

interface FrameResult {
  url: string;
  time: number;
  sharpness: number;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function formatTime(s: number): string {
  return `${s.toFixed(3)}s`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Seek a video element and resolve when the seek completes (with timeout). */
function seekTo(video: HTMLVideoElement, t: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const target = Math.min(Math.max(0, t), Math.max(0, video.duration - 0.05));
    const timer = window.setTimeout(() => {
      video.removeEventListener('seeked', onSeeked);
      reject(new Error('Seek timed out. Try a shorter video.'));
    }, 8000);
    const onSeeked = () => {
      window.clearTimeout(timer);
      video.removeEventListener('seeked', onSeeked);
      resolve();
    };
    video.addEventListener('seeked', onSeeked);
    video.currentTime = target;
  });
}

/**
 * Laplacian variance — a standard no-reference sharpness metric.
 * Blurry frames have low variance (smooth gradients), sharp frames
 * have high variance (strong edges). Runs on a small grayscale copy.
 */
function laplacianVariance(data: Uint8ClampedArray, w: number, h: number): number {
  const gray = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
  }
  let sum = 0, sumSq = 0, n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const lap = gray[i - w] + gray[i - 1] - 4 * gray[i] + gray[i + 1] + gray[i + w];
      sum += lap; sumSq += lap * lap; n++;
    }
  }
  if (n === 0) return 0;
  const mean = sum / n;
  return sumSq / n - mean * mean;
}

const LastFrameExtractorTool: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [duration, setDuration] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [lastFrame, setLastFrame] = useState<FrameResult | null>(null);
  const [sharpestFrame, setSharpestFrame] = useState<FrameResult | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [format, setFormat] = useState<Format>('png');

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (lastFrame) URL.revokeObjectURL(lastFrame.url);
      if (sharpestFrame) URL.revokeObjectURL(sharpestFrame.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = useCallback((f: File) => {
    if (f.size > MAX_FILE_BYTES) {
      setError(`That file is ${formatBytes(f.size)} — the limit here is ${formatBytes(MAX_FILE_BYTES)} so your tab doesn't run out of memory.`);
      return;
    }
    setError('');
    setLastFrame(null);
    setSharpestFrame(null);
    setProgress(0);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(f);
    setFile(f);
    setVideoUrl(url);
    setStatus('loaded');
  }, [videoUrl]);

  const onMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration || 0);
    setDims({ w: v.videoWidth, h: v.videoHeight });
  }, []);

  /** Capture a frame from the hidden video at full resolution. */
  const captureFullFrame = useCallback(async (t: number): Promise<{ url: string; sharpness: number }> => {
    const hv = hiddenVideoRef.current;
    if (!hv) throw new Error('Video not ready.');
    await seekTo(hv, t);
    const w = hv.videoWidth, h = hv.videoHeight;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(hv, 0, 0, w, h);
    // Sharpness on a downscaled copy for speed
    const sc = document.createElement('canvas');
    const scale = SAMPLE_W / w;
    sc.width = SAMPLE_W; sc.height = Math.max(1, Math.round(h * scale));
    const sctx = sc.getContext('2d', { willReadFrequently: true })!;
    sctx.drawImage(c, 0, 0, sc.width, sc.height);
    const sharpness = laplacianVariance(
      sctx.getImageData(0, 0, sc.width, sc.height).data, sc.width, sc.height
    );
    return { url: c.toDataURL('image/png'), sharpness };
  }, []);

  /** Extract the true last frame + the sharpest frame in the final second. */
  const analyze = useCallback(async () => {
    const hv = hiddenVideoRef.current;
    if (!hv || !duration) return;
    setStatus('analyzing');
    setProgress(0);
    setError('');
    setLastFrame(null);
    setSharpestFrame(null);
    try {
      // 1. True last frame (full resolution)
      setProgress(5);
      const lastT = Math.max(0, duration - 0.05);
      const last = await captureFullFrame(lastT);

      // 2. Scan the final second for the sharpest frame
      const windowStart = Math.max(0, duration - SAMPLE_WINDOW);
      let bestSharpness = -1;
      let bestTime = lastT;
      for (let i = 0; i < SAMPLE_COUNT; i++) {
        const t = windowStart + (i / (SAMPLE_COUNT - 1)) * Math.min(SAMPLE_WINDOW, duration);
        await seekTo(hv, t);
        const c = document.createElement('canvas');
        const aspect = hv.videoHeight / Math.max(1, hv.videoWidth);
        c.width = SAMPLE_W; c.height = Math.max(1, Math.round(SAMPLE_W * aspect));
        const ctx = c.getContext('2d', { willReadFrequently: true })!;
        ctx.drawImage(hv, 0, 0, c.width, c.height);
        const s = laplacianVariance(ctx.getImageData(0, 0, c.width, c.height).data, c.width, c.height);
        if (s > bestSharpness) { bestSharpness = s; bestTime = t; }
        setProgress(5 + Math.round(((i + 1) / SAMPLE_COUNT) * 80));
        if (i % 5 === 0) await sleep(0);
      }

      // 3. Capture the sharpest frame at full resolution
      setProgress(90);
      const sharp = await captureFullFrame(bestTime);

      setLastFrame({ url: last.url, time: lastT, sharpness: last.sharpness });
      setSharpestFrame({ url: sharp.url, time: bestTime, sharpness: sharp.sharpness });
      setProgress(100);
      setStatus('done');
    } catch (e) {
      setStatus('loaded');
      setProgress(0);
      setError(e instanceof Error ? e.message : 'Frame analysis failed. Try a different video.');
    }
  }, [duration, captureFullFrame]);

  const downloadFrame = (frame: FrameResult, label: string) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const mime = format === 'png' ? 'image/png' : format === 'jpeg' ? 'image/jpeg' : 'image/webp';
      const quality = format === 'png' ? undefined : 0.92;
      c.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const base = (file?.name || 'video').replace(/\.[^.]+$/, '');
        a.download = `${base}-${label}.${format === 'jpeg' ? 'jpg' : format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }, mime, quality as number);
    };
    img.src = frame.url;
  };

  const reset = () => {
    setFile(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (lastFrame) URL.revokeObjectURL(lastFrame.url);
    if (sharpestFrame) URL.revokeObjectURL(sharpestFrame.url);
    setVideoUrl('');
    setDuration(0);
    setLastFrame(null);
    setSharpestFrame(null);
    setError('');
    setProgress(0);
    setStatus('idle');
  };

  const busy = status === 'analyzing';
  const sharpnessGain = lastFrame && sharpestFrame && lastFrame.sharpness > 0
    ? Math.round((sharpestFrame.sharpness / lastFrame.sharpness - 1) * 100)
    : 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
      {!videoUrl ? (
        <Dropzone onFileSelect={handleFile} />
      ) : (
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-black rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full max-h-[320px] mx-auto"
              playsInline
              muted
              preload="auto"
              controls
              onLoadedMetadata={onMetadata}
            />
          </div>
          <video ref={hiddenVideoRef} src={videoUrl} className="hidden" muted preload="auto" playsInline />

          {file && (
            <p className="text-sm text-gray-500">
              {file.name} · {formatBytes(file.size)} · {dims.w}×{dims.h} · {duration.toFixed(2)}s
            </p>
          )}

          {/* Analyze button */}
          {status !== 'done' && (
            <button
              onClick={analyze}
              disabled={busy || !duration}
              className="w-full bg-cyan-500 text-gray-950 font-bold px-6 py-3 rounded-xl hover:bg-cyan-400 transition disabled:opacity-40"
            >
              {busy ? `Analyzing final second… ${progress}%` : '🎯 Extract last frame'}
            </button>
          )}

          {busy && (
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}

          {/* Results */}
          {status === 'done' && lastFrame && sharpestFrame && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-300 mb-1">True last frame</p>
                  <p className="text-xs text-gray-500 mb-3">Exactly {formatTime(lastFrame.time)} — the literal final frame</p>
                  <img src={lastFrame.url} alt="True last frame of the video" className="w-full rounded-lg border border-gray-800" />
                  <button
                    onClick={() => downloadFrame(lastFrame, 'last-frame')}
                    className="mt-3 w-full bg-gray-800 border border-gray-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    ⬇ Download
                  </button>
                </div>
                <div className="bg-gray-950 border border-cyan-800/60 rounded-xl p-4">
                  <p className="text-sm font-semibold text-cyan-300 mb-1">✨ Sharpest frame (final second)</p>
                  <p className="text-xs text-gray-500 mb-3">
                    {formatTime(sharpestFrame.time)}
                    {sharpnessGain > 5 && (
                      <span className="text-green-400"> · {sharpnessGain}% sharper than the last frame</span>
                    )}
                  </p>
                  <img src={sharpestFrame.url} alt="Sharpest frame found in the final second of the video" className="w-full rounded-lg border border-cyan-800/60" />
                  <button
                    onClick={() => downloadFrame(sharpestFrame, 'sharpest-last-frame')}
                    className="mt-3 w-full bg-cyan-500 text-gray-950 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 transition"
                  >
                    ⬇ Download
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  Format
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as Format)}
                    className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="png">PNG (lossless)</option>
                    <option value="jpeg">JPG (small)</option>
                    <option value="webp">WebP (modern)</option>
                  </select>
                </label>
                <p className="text-xs text-gray-500">
                  Tip: AI video tools (Kling, Runway, Sora) accept the sharpest frame as a start frame to continue your clip seamlessly.
                </p>
              </div>

              <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-300 underline">
                Extract from another video
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-950/40 border border-red-800 rounded-xl p-4 text-red-300 text-sm">{error}</div>
          )}

          {status === 'loaded' && (
            <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-300 underline">
              Start over
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default LastFrameExtractorTool;
