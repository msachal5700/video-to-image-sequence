import React, { useRef, useState, useEffect, useCallback } from 'react';
import Dropzone from './Dropzone';

const MAX_FILE_BYTES = 100 * 1024 * 1024;
const EXPORT_FPS = 30;
const MAX_EXPORT_FRAMES = 1800; // 60s at 30fps
const SAMPLE_W = 48;
const SAMPLE_H = 27;
const HIST_BINS = 4; // 4x4x4 = 64 bins

type Status = 'idle' | 'loaded' | 'analyzing' | 'exporting' | 'done' | 'error';

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(1);
  return `${m}:${sec.padStart(4, '0')}`;
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

/** Normalized 4x4x4 RGB histogram — compact, lighting-tolerant frame signature. */
function frameHistogram(data: Uint8ClampedArray): number[] {
  const bins = new Array(HIST_BINS * HIST_BINS * HIST_BINS).fill(0);
  const total = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    const r = Math.min(HIST_BINS - 1, (data[i] / 256) * HIST_BINS) | 0;
    const g = Math.min(HIST_BINS - 1, (data[i + 1] / 256) * HIST_BINS) | 0;
    const b = Math.min(HIST_BINS - 1, (data[i + 2] / 256) * HIST_BINS) | 0;
    bins[(r * HIST_BINS + g) * HIST_BINS + b]++;
  }
  for (let i = 0; i < bins.length; i++) bins[i] /= total;
  return bins;
}

function histDistance(a: number[], b: number[]): number {
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i];
    d += diff * diff;
  }
  return Math.sqrt(d);
}

export interface LoopSuggestion {
  start: number;
  end: number;
  /** 0..1 — higher means the two frames look more alike */
  matchScore: number;
}

const VideoLooperTool: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [duration, setDuration] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(0);
  const [loopCount, setLoopCount] = useState(3);
  const [infinitePreview, setInfinitePreview] = useState(false);
  const [suggestion, setSuggestion] = useState<LoopSuggestion | null>(null);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [outUrl, setOutUrl] = useState('');
  const [outExt, setOutExt] = useState('webm');
  const [outBytes, setOutBytes] = useState(0);
  const [encoderNote, setEncoderNote] = useState('');
  const [previewing, setPreviewing] = useState(false);
  const loopsDoneRef = useRef(0);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (outUrl) URL.revokeObjectURL(outUrl);
    };
  }, [videoUrl, outUrl]);

  const handleFile = useCallback((f: File) => {
    if (f.size > MAX_FILE_BYTES) {
      setError(`That file is ${formatBytes(f.size)} — the limit here is ${formatBytes(MAX_FILE_BYTES)} so your tab doesn't run out of memory.`);
      return;
    }
    setError('');
    setSuggestion(null);
    setThumbs([]);
    setOutUrl('');
    setPreviewing(false);
    setLoopCount(3);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(f);
    setFile(f);
    setVideoUrl(url);
    setStatus('loaded');
  }, [videoUrl]);

  const onMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const d = v.duration || 0;
    setDuration(d);
    setDims({ w: v.videoWidth, h: v.videoHeight });
    setLoopStart(0);
    setLoopEnd(d);
    // Build thumbnail strip (10 thumbs)
    const build = async () => {
      const hv = hiddenVideoRef.current;
      if (!hv || !d) return;
      const c = document.createElement('canvas');
      c.width = 120; c.height = 68;
      const ctx = c.getContext('2d')!;
      const urls: string[] = [];
      for (let i = 0; i < 10; i++) {
        try {
          await seekTo(hv, (i / 9) * d * 0.98);
          ctx.drawImage(hv, 0, 0, 120, 68);
          urls.push(c.toDataURL('image/jpeg', 0.6));
        } catch {
          break;
        }
      }
      setThumbs(urls);
    };
    build();
  }, []);

  /** Auto-detect the most seamless loop points via frame-similarity search. */
  const autoDetect = useCallback(async () => {
    const hv = hiddenVideoRef.current;
    if (!hv || !duration) return;
    setStatus('analyzing');
    setProgress(0);
    setError('');
    setSuggestion(null);
    try {
      const M = 48;
      const c = document.createElement('canvas');
      c.width = SAMPLE_W; c.height = SAMPLE_H;
      const ctx = c.getContext('2d', { willReadFrequently: true })!;
      const hists: number[][] = [];
      for (let i = 0; i < M; i++) {
        await seekTo(hv, (i / (M - 1)) * duration * 0.985);
        ctx.drawImage(hv, 0, 0, SAMPLE_W, SAMPLE_H);
        hists.push(frameHistogram(ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data));
        setProgress(Math.round(((i + 1) / M) * 70));
        if (i % 6 === 0) await sleep(0);
      }
      // Need at least ~1s (or 12% of video) between start and end for a real loop
      const minGap = Math.max(3, Math.round(M * 0.12));
      let bestI = 0, bestJ = M - 1, bestScore = Infinity;
      for (let i = 0; i < M; i++) {
        for (let j = i + minGap; j < M; j++) {
          const dist = histDistance(hists[i], hists[j]);
          // Small bonus for longer loops so we don't always pick the shortest
          const score = dist - 0.0008 * (j - i);
          if (score < bestScore) { bestScore = score; bestI = i; bestJ = j; }
        }
        if (i % 8 === 0) { setProgress(70 + Math.round((i / M) * 30)); await sleep(0); }
      }
      const start = (bestI / (M - 1)) * duration;
      const end = (bestJ / (M - 1)) * duration;
      // matchScore: 1 = identical, map typical distances (0..~0.5) to 0..1
      const rawDist = histDistance(hists[bestI], hists[bestJ]);
      const matchScore = Math.max(0, Math.min(1, 1 - rawDist * 2.2));
      setSuggestion({ start, end, matchScore });
      setStatus('loaded');
      setProgress(0);
    } catch (e) {
      setStatus('loaded');
      setProgress(0);
      setError(e instanceof Error ? e.message : 'Loop analysis failed. Try the manual sliders instead.');
    }
  }, [duration]);

  const applySuggestion = useCallback(() => {
    if (!suggestion) return;
    setLoopStart(suggestion.start);
    setLoopEnd(suggestion.end);
  }, [suggestion]);

  // Loop playback preview
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      if (!previewing || loopEnd <= loopStart) return;
      if (v.currentTime >= loopEnd - 0.03) {
        if (infinitePreview) {
          v.currentTime = loopStart;
        } else {
          loopsDoneRef.current += 1;
          if (loopsDoneRef.current >= loopCount) {
            v.pause();
            setPreviewing(false);
          } else {
            v.currentTime = loopStart;
          }
        }
      }
    };
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
  }, [previewing, loopStart, loopEnd, loopCount, infinitePreview]);

  const togglePreview = useCallback(async () => {
    const v = videoRef.current;
    if (!v || !duration) return;
    if (previewing) {
      v.pause();
      setPreviewing(false);
      return;
    }
    loopsDoneRef.current = 0;
    v.currentTime = Math.min(loopStart, duration - 0.1);
    setPreviewing(true);
    try { await v.play(); } catch { setPreviewing(false); }
  }, [previewing, loopStart, duration]);

  const pickMime = (): { mime: string; ext: string; note: string } => {
    const MR = (window as unknown as { MediaRecorder?: typeof MediaRecorder }).MediaRecorder;
    if (!MR) return { mime: '', ext: '', note: '' };
    if (MR.isTypeSupported('video/webm;codecs=vp9')) {
      return { mime: 'video/webm;codecs=vp9', ext: 'webm', note: 'Exporting WebM (VP9) — plays in Chrome, Edge, Firefox. For MP4, convert with the GIF to MP4 tool flow or any editor.' };
    }
    if (MR.isTypeSupported('video/webm')) {
      return { mime: 'video/webm', ext: 'webm', note: 'Exporting WebM — plays in Chrome, Edge, Firefox. Safari 14.1+ can play WebM too.' };
    }
    if (MR.isTypeSupported('video/mp4')) {
      return { mime: 'video/mp4', ext: 'mp4', note: 'Exporting MP4 via your browser\u2019s recorder.' };
    }
    return { mime: '', ext: '', note: '' };
  };

  /** Render the looped segment offline: seek + draw each frame, requestFrame pacing. */
  const handleExport = useCallback(async () => {
    const hv = hiddenVideoRef.current;
    if (!hv || !duration || loopEnd <= loopStart) return;
    setStatus('exporting');
    setProgress(0);
    setError('');
    try {
      const segDur = loopEnd - loopStart;
      const perLoop = Math.min(
        MAX_EXPORT_FRAMES / loopCount,
        Math.max(2, Math.round(segDur * EXPORT_FPS))
      ) | 0;
      const totalFrames = perLoop * loopCount;
      if (totalFrames < 2) throw new Error('Loop segment is too short to export.');

      const encW = dims.w + (dims.w % 2);
      const encH = dims.h + (dims.h % 2);
      const { mime, ext, note } = pickMime();
      if (!mime) throw new Error('Your browser can\u2019t encode video (no MediaRecorder). Try a recent Chrome or Edge.');
      setEncoderNote(note);
      setOutExt(ext);

      const canvas = document.createElement('canvas');
      canvas.width = encW; canvas.height = encH;
      const ctx = canvas.getContext('2d')!;
      // captureStream(0) = manual pacing: one requestFrame() per drawn frame,
      // so output duration is exact regardless of how slow seeking is.
      const stream = canvas.captureStream(0);
      const track = stream.getVideoTracks()[0] as CanvasCaptureMediaStreamTrack;
      const MR = (window as unknown as { MediaRecorder: typeof MediaRecorder }).MediaRecorder;
      const rec = new MR(stream, { mimeType: mime, videoBitsPerSecond: Math.min(12_000_000, Math.max(2_500_000, encW * encH * EXPORT_FPS * 0.12)) });
      const chunks: Blob[] = [];
      const done = new Promise<void>((res, rej) => {
        rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
        rec.onerror = () => rej(new Error('Export failed mid-encode. Try fewer loops or a shorter segment.'));
        rec.onstop = () => res();
      });
      rec.start();
      let doneFrames = 0;
      for (let l = 0; l < loopCount; l++) {
        for (let k = 0; k < perLoop; k++) {
          const t = loopStart + (k / perLoop) * segDur;
          await seekTo(hv, t);
          ctx.drawImage(hv, 0, 0, encW, encH);
          track.requestFrame();
          doneFrames++;
          setProgress(Math.round((doneFrames / totalFrames) * 100));
          await sleep(0);
        }
      }
      await sleep(250);
      rec.stop();
      await done;
      stream.getTracks().forEach((tr) => tr.stop());
      const blob = new Blob(chunks, { type: mime.split(';')[0] });
      if (outUrl) URL.revokeObjectURL(outUrl);
      setOutUrl(URL.createObjectURL(blob));
      setOutBytes(blob.size);
      setStatus('done');
    } catch (e) {
      setStatus('loaded');
      setProgress(0);
      setError(e instanceof Error ? e.message : 'Export failed. Try fewer loops or a shorter video.');
    }
  }, [duration, loopStart, loopEnd, loopCount, dims, outUrl]);

  const download = () => {
    if (!outUrl) return;
    const a = document.createElement('a');
    a.href = outUrl;
    const base = (file?.name || 'video').replace(/\.[^.]+$/, '');
    a.download = `${base}-looped-x${loopCount}.${outExt}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const reset = () => {
    setFile(null);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl('');
    setDuration(0);
    setSuggestion(null);
    setThumbs([]);
    setOutUrl('');
    setError('');
    setPreviewing(false);
    setStatus('idle');
  };

  const segDur = Math.max(0, loopEnd - loopStart);
  const busy = status === 'analyzing' || status === 'exporting';

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
              className="w-full max-h-[420px] mx-auto"
              playsInline
              muted
              preload="auto"
              onLoadedMetadata={onMetadata}
            />
          </div>
          {/* Hidden video used for frame-accurate seeking (thumbs, analysis, export) */}
          <video ref={hiddenVideoRef} src={videoUrl} className="hidden" muted preload="auto" playsInline />

          {file && (
            <p className="text-sm text-gray-500">
              {file.name} · {formatBytes(file.size)} · {dims.w}×{dims.h} · {formatTime(duration)}
            </p>
          )}

          {/* Thumbnail strip */}
          {thumbs.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Video overview</p>
              <div className="flex gap-1 overflow-hidden rounded-lg">
                {thumbs.map((t, i) => (
                  <img key={i} src={t} alt="" className="flex-1 h-12 object-cover rounded" />
                ))}
              </div>
            </div>
          )}

          {/* Loop range */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-400">Loop start (sec)</span>
              <input
                type="number" min={0} max={duration} step={0.1} value={loopStart.toFixed(1)}
                onChange={(e) => setLoopStart(Math.min(Math.max(0, parseFloat(e.target.value) || 0), loopEnd))}
                disabled={busy}
                className="mt-1 w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-400">Loop end (sec)</span>
              <input
                type="number" min={0} max={duration} step={0.1} value={loopEnd.toFixed(1)}
                onChange={(e) => setLoopEnd(Math.max(Math.min(duration, parseFloat(e.target.value) || 0), loopStart))}
                disabled={busy}
                className="mt-1 w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
            </label>
          </div>

          {/* Segment bar */}
          {duration > 0 && (
            <div>
              <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 bg-cyan-500/70 rounded-full"
                  style={{ left: `${(loopStart / duration) * 100}%`, width: `${(segDur / duration) * 100}%` }}
                />
                {suggestion && (
                  <div
                    className="absolute top-0 bottom-0 border-2 border-dashed border-amber-400 rounded-full pointer-events-none"
                    style={{ left: `${(suggestion.start / duration) * 100}%`, width: `${((suggestion.end - suggestion.start) / duration) * 100}%` }}
                    title="Suggested loop"
                  />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Looping {formatTime(loopStart)} → {formatTime(loopEnd)} ({formatTime(segDur)} segment)
                {suggestion && <span className="text-amber-400"> · dashed = suggested</span>}
              </p>
            </div>
          )}

          {/* Auto-detect */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={autoDetect}
                disabled={busy || !duration}
                className="bg-amber-500/15 border border-amber-500/60 text-amber-300 font-semibold px-4 py-2 rounded-lg hover:bg-amber-500/25 transition disabled:opacity-40"
              >
                {status === 'analyzing' ? `Analyzing… ${progress}%` : '✨ Auto-detect seamless loop points'}
              </button>
              {suggestion && (
                <button
                  onClick={applySuggestion}
                  disabled={busy}
                  className="bg-cyan-500/15 border border-cyan-500/60 text-cyan-300 font-semibold px-4 py-2 rounded-lg hover:bg-cyan-500/25 transition disabled:opacity-40"
                >
                  Use {formatTime(suggestion.start)} → {formatTime(suggestion.end)}
                </button>
              )}
            </div>
            {suggestion ? (
              <p className="text-sm text-gray-400 mt-2">
                Best match: <strong className="text-gray-200">{formatTime(suggestion.start)} → {formatTime(suggestion.end)}</strong> ·
                seamlessness score <strong className={suggestion.matchScore > 0.7 ? 'text-green-400' : suggestion.matchScore > 0.4 ? 'text-amber-400' : 'text-red-400'}>
                  {Math.round(suggestion.matchScore * 100)}%
                </strong> ·
                {suggestion.matchScore > 0.7
                  ? ' these frames look nearly identical — the loop should be invisible.'
                  : suggestion.matchScore > 0.4
                    ? ' decent match — preview it and nudge the sliders if you see a jump.'
                    : ' no great match found in this video — a visible cut is likely; try a shorter segment or manual trim.'}
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-2">
                Compares frames across your video and finds the start/end pair that look most alike — the key to an invisible loop. No other browser tool does this.
              </p>
            )}
          </div>

          {/* Loop count + preview */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-400">
              Repeat
              <select
                value={loopCount}
                onChange={(e) => setLoopCount(parseInt(e.target.value, 10))}
                disabled={busy}
                className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white"
              >
                {[2, 3, 4, 5, 6, 8, 10].map((n) => (
                  <option key={n} value={n}>{n}×</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox" checked={infinitePreview}
                onChange={(e) => setInfinitePreview(e.target.checked)}
                disabled={busy}
                className="accent-cyan-500"
              />
              Infinite preview
            </label>
            <button
              onClick={togglePreview}
              disabled={busy || segDur <= 0}
              className="bg-gray-800 border border-gray-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-40"
            >
              {previewing ? '⏸ Pause preview' : '▶ Preview loop'}
            </button>
          </div>

          {/* Export */}
          <div>
            <button
              onClick={handleExport}
              disabled={busy || segDur <= 0}
              className="w-full bg-cyan-500 text-gray-950 font-bold px-6 py-3 rounded-xl hover:bg-cyan-400 transition disabled:opacity-40"
            >
              {status === 'exporting' ? `Rendering… ${progress}%` : `Export looped video (${loopCount}×, ~${formatTime(segDur * loopCount)})`}
            </button>
            {encoderNote && <p className="text-xs text-gray-500 mt-2">{encoderNote}</p>}
          </div>

          {status === 'done' && outUrl && (
            <div className="bg-green-950/40 border border-green-800 rounded-xl p-4 text-center">
              <p className="text-green-300 font-semibold mb-1">Done — {formatBytes(outBytes)} {outExt.toUpperCase()}</p>
              <p className="text-xs text-gray-500 mb-3">Original {formatTime(segDur)} segment × {loopCount} loops</p>
              <div className="flex gap-3 justify-center">
                <button onClick={download} className="bg-green-500 text-gray-950 font-bold px-5 py-2 rounded-lg hover:bg-green-400 transition">
                  ⬇ Download
                </button>
                <button onClick={reset} className="bg-gray-800 border border-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition">
                  Loop another video
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-950/40 border border-red-800 rounded-xl p-4 text-red-300 text-sm">{error}</div>
          )}

          <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-300 underline">
            Start over
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoLooperTool;
