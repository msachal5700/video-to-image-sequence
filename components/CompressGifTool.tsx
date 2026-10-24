import React, { useState, useCallback, useEffect, useRef } from 'react';
import { UploadCloud, Download, RefreshCw, AlertTriangle, FileImage } from 'lucide-react';
import GIF from 'gif.js';
import gifWorkerUrl from 'gif.js/dist/gif.worker.js?url';
import { AppState } from '../types';
import { useToast } from './Toast';

/** Guard against runaway memory use on very long GIFs. */
const MAX_FRAMES = 400;

interface DecodedFrame {
  imageData: ImageData;
  delayMs: number;
}

interface DecodedGif {
  width: number;
  height: number;
  frames: DecodedFrame[];
  truncated: boolean;
}

type PresetId = 'discord-upload' | 'discord-emoji' | 'original-quality' | 'custom';

interface Preset {
  id: PresetId;
  label: string;
  desc: string;
  /** null = no target size; encode once at the chosen quality. */
  targetBytes: number | null;
  maxDim: number;
  quality: number;
  keepEvery: number;
}

const PRESETS: Preset[] = [
  {
    id: 'discord-upload',
    label: 'Discord upload (20 MB)',
    desc: 'Fit Discord’s current free upload limit',
    targetBytes: 20 * 1024 * 1024,
    maxDim: 1024,
    quality: 10,
    keepEvery: 1,
  },
  {
    id: 'discord-emoji',
    label: 'Discord emoji (256 KB)',
    desc: 'Fit the custom emoji limit',
    targetBytes: 256 * 1024,
    maxDim: 128,
    quality: 10,
    keepEvery: 1,
  },
  {
    id: 'original-quality',
    label: 'Original quality passthrough',
    desc: 'Re-encode only, no shrinking',
    targetBytes: null,
    maxDim: 2048,
    quality: 5,
    keepEvery: 1,
  },
  {
    id: 'custom',
    label: 'Custom max size',
    desc: 'Set your own target size',
    targetBytes: 5 * 1024 * 1024,
    maxDim: 1024,
    quality: 10,
    keepEvery: 1,
  },
];

const QUALITY_OPTIONS = [
  { value: 5, label: 'High — larger files' },
  { value: 10, label: 'Medium — balanced' },
  { value: 15, label: 'Low — smaller files' },
  { value: 20, label: 'Lowest — smallest files' },
];

const KEEP_EVERY_OPTIONS = [
  { value: 1, label: 'Keep all frames' },
  { value: 2, label: 'Keep every 2nd frame' },
  { value: 3, label: 'Keep every 3rd frame' },
  { value: 4, label: 'Keep every 4th frame' },
];

function clearRect(data: Uint8ClampedArray, canvasW: number, left: number, top: number, w: number, h: number, canvasH: number) {
  const x0 = Math.max(0, left), y0 = Math.max(0, top);
  const x1 = Math.min(canvasW, left + w), y1 = Math.min(canvasH, top + h);
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * canvasW + x) * 4;
      data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 0;
    }
  }
}

/** Decode an animated GIF into full-canvas RGBA snapshots, honoring disposal methods. */
async function decodeGifFrames(arrayBuffer: ArrayBuffer): Promise<DecodedGif> {
  let gif: { lsd: { width: number; height: number } };
  try {
    const { parseGIF } = await import('gifuct-js');
    gif = parseGIF(arrayBuffer);
  } catch (err) {
    throw new Error(`Could not read the GIF header${err instanceof Error ? `: ${err.message}` : ''}`);
  }
  const w = gif.lsd.width, h = gif.lsd.height;
  if (!w || !h) throw new Error('Could not read the GIF dimensions.');

  let parsed: { dims: { left: number; top: number; width: number; height: number }; patch: Uint8ClampedArray; disposalType: number; delay: number }[];
  try {
    const { decompressFrames } = await import('gifuct-js');
    parsed = decompressFrames(gif as never, true);
  } catch (err) {
    throw new Error(`Failed to decode GIF frames${err instanceof Error ? `: ${err.message}` : ''}`);
  }

  const canvas = new Uint8ClampedArray(w * h * 4);
  const frames: DecodedFrame[] = [];
  let prevDisposal = 1;
  let prevDims = { left: 0, top: 0, width: w, height: h };
  let truncated = false;
  for (let fi = 0; fi < parsed.length; fi++) {
    if (frames.length >= MAX_FRAMES) { truncated = true; break; }
    try {
      const f = parsed[fi];
      if (frames.length > 0 && (prevDisposal === 2 || prevDisposal === 3)) {
        clearRect(canvas, w, prevDims.left, prevDims.top, prevDims.width, prevDims.height, h);
      }
      const { left, top, width, height } = f.dims;
      const patch = f.patch;
      for (let y = 0; y < height; y++) {
        const dy = top + y;
        if (dy < 0 || dy >= h) continue;
        for (let x = 0; x < width; x++) {
          const dx = left + x;
          if (dx < 0 || dx >= w) continue;
          const si = (y * width + x) * 4;
          if (patch[si + 3] === 0) continue;
          const di = (dy * w + dx) * 4;
          canvas[di] = patch[si];
          canvas[di + 1] = patch[si + 1];
          canvas[di + 2] = patch[si + 2];
          canvas[di + 3] = patch[si + 3];
        }
      }
      frames.push({ imageData: new ImageData(new Uint8ClampedArray(canvas), w, h), delayMs: f.delay });
      prevDisposal = f.disposalType;
      prevDims = f.dims;
    } catch (err) {
      throw new Error(`Failed while compositing frame ${fi + 1}${err instanceof Error ? `: ${err.message}` : ''}`);
    }
  }
  if (frames.length === 0) throw new Error('No frames found in this GIF.');
  return { width: w, height: h, frames, truncated };
}

function drawScaled(ctx: CanvasRenderingContext2D, frame: ImageData, outW: number, outH: number) {
  const tmp = document.createElement('canvas');
  tmp.width = frame.width;
  tmp.height = frame.height;
  const tctx = tmp.getContext('2d');
  if (!tctx) throw new Error('Canvas 2D context is not available in this browser.');
  tctx.putImageData(frame, 0, 0);
  ctx.clearRect(0, 0, outW, outH);
  ctx.drawImage(tmp, 0, 0, outW, outH);
}

interface EncodeAttempt {
  quality: number;
  outW: number;
  outH: number;
  keepEvery: number;
  label: string;
}

/** Build the attempt ladder: gentlest first, most aggressive last. */
function buildAttempts(base: { quality: number; outW: number; outH: number; keepEvery: number }, target: number | null): EncodeAttempt[] {
  const attempts: EncodeAttempt[] = [
    { ...base, label: 'your settings' },
  ];
  if (target === null) return attempts;
  const { outW, outH } = base;
  const shrink = (f: number) => ({ w: Math.max(32, Math.round((outW * f) / 2) * 2), h: Math.max(32, Math.round((outH * f) / 2) * 2) });
  const s75 = shrink(0.75);
  const s50 = shrink(0.5);
  attempts.push(
    { quality: 15, outW, outH, keepEvery: base.keepEvery, label: 'reduced encoding quality' },
    { quality: 20, outW, outH, keepEvery: base.keepEvery, label: 'lowest encoding quality' },
    { quality: 20, outW: s75.w, outH: s75.h, keepEvery: base.keepEvery, label: '75% dimensions' },
    { quality: 20, outW: s75.w, outH: s75.h, keepEvery: Math.max(base.keepEvery, 2), label: '75% dimensions, half the frames' },
    { quality: 20, outW: s50.w, outH: s50.h, keepEvery: Math.max(base.keepEvery, 2), label: '50% dimensions, half the frames' },
    { quality: 20, outW: s50.w, outH: s50.h, keepEvery: Math.max(base.keepEvery, 3), label: '50% dimensions, a third of the frames' },
  );
  return attempts;
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

interface Result {
  url: string;
  size: number;
  width: number;
  height: number;
  frameCount: number;
  attemptsUsed: number;
  metTarget: boolean;
}

const CompressGifTool: React.FC = () => {
  const [presetId, setPresetId] = useState<PresetId>('discord-upload');
  const [maxDim, setMaxDim] = useState(1024);
  const [quality, setQuality] = useState(10);
  const [keepEvery, setKeepEvery] = useState(1);
  const [customSizeMB, setCustomSizeMB] = useState('5');
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [truncateWarning, setTruncateWarning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      if (result) URL.revokeObjectURL(result.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyPreset = (p: Preset) => {
    setPresetId(p.id);
    setMaxDim(p.maxDim);
    setQuality(p.quality);
    setKeepEvery(p.keepEvery);
  };

  const resetAll = () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    if (result) URL.revokeObjectURL(result.url);
    setFile(null);
    setFileUrl(null);
    setResult(null);
    setError(null);
    setTruncateWarning(false);
    setProgress(0);
    setProgressLabel('');
    setAppState(AppState.IDLE);
  };

  const handleFile = useCallback((f: File) => {
    const isGif = f.type === 'image/gif' || f.name.toLowerCase().endsWith('.gif');
    if (!isGif) {
      showToast('Please choose an animated GIF file (.gif).', 'error');
      return;
    }
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);
    setTruncateWarning(false);
    setFile(f);
    setFileUrl(URL.createObjectURL(f));
    setAppState(AppState.IDLE);
    setProgress(0);
    setProgressLabel('');
  }, [fileUrl, result, showToast]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const encodeFrames = useCallback((decoded: DecodedGif, attempt: EncodeAttempt, target: number | null, progressBase: number): Promise<{ blob: Blob; size: number }> => {
    return new Promise((resolve, reject) => {
      try {
        const gif = new GIF({
          workers: 2,
          quality: attempt.quality,
          width: attempt.outW,
          height: attempt.outH,
          workerScript: gifWorkerUrl,
          repeat: 0,
        });
        const canvas = document.createElement('canvas');
        canvas.width = attempt.outW;
        canvas.height = attempt.outH;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas 2D context is not available in this browser.');
        for (let i = 0; i < decoded.frames.length; i += attempt.keepEvery) {
          drawScaled(ctx, decoded.frames[i].imageData, attempt.outW, attempt.outH);
          gif.addFrame(ctx, { copy: true, delay: decoded.frames[i].delayMs });
        }
        gif.on('progress', (p: number) => setProgress(Math.round(progressBase + p * (100 - progressBase))));
        gif.on('finished', (blob: Blob) => {
          const margin = target === null ? 0 : 0.01;
          if (target !== null && blob.size > target * (1 + margin)) {
            reject(new Error('over-target'));
          } else {
            resolve({ blob, size: blob.size });
          }
        });
        gif.render();
      } catch (err) {
        reject(err);
      }
    });
  }, []);

  const compress = async () => {
    if (!file) return;
    setError(null);
    setResult(null);
    setAppState(AppState.PROCESSING);
    setProgress(0);
    try {
      setProgressLabel('Reading GIF…');
      setProgress(4);
      const arrayBuffer = await file.arrayBuffer();

      setProgressLabel('Decoding frames…');
      const decoded = await decodeGifFrames(arrayBuffer);
      setTruncateWarning(decoded.truncated);
      if (decoded.truncated) {
        showToast(`Very long GIF — only the first ${MAX_FRAMES} frames were processed.`, 'error');
      }
      setProgress(18);

      const preset = PRESETS.find(p => p.id === presetId)!;
      const customBytes = (() => {
        const mb = parseFloat(customSizeMB);
        if (presetId === 'custom' && (!isFinite(mb) || mb <= 0)) return null;
        return Math.round(mb * 1024 * 1024);
      })();
      if (presetId === 'custom' && customBytes === null) {
        throw new Error('Enter a valid custom target size in MB (e.g. 5).');
      }
      const target = presetId === 'custom' ? customBytes : preset.targetBytes;

      const scale = Math.min(1, maxDim / Math.max(decoded.width, decoded.height));
      const baseW = Math.max(2, Math.round((decoded.width * scale) / 2) * 2);
      const baseH = Math.max(2, Math.round((decoded.height * scale) / 2) * 2);

      const attempts = buildAttempts({ quality, outW: baseW, outH: baseH, keepEvery }, target);
      let blob: Blob | null = null;
      let attemptsUsed = 0;
      let lastSize = 0;
      let lastDims = { w: baseW, h: baseH };
      let lastCount = Math.ceil(decoded.frames.length / keepEvery);

      for (let ai = 0; ai < attempts.length; ai++) {
        const attempt = attempts[ai];
        attemptsUsed = ai + 1;
        setProgressLabel(`Encoding${attempts.length > 1 ? ` — trying ${attempt.label}…` : '…'}`);
        setProgress(Math.round(18 + (ai / attempts.length) * 10));
        try {
          const out = await encodeFrames(decoded, attempt, target, 28 + (ai / attempts.length) * 20);
          blob = out.blob;
          lastSize = out.size;
          lastDims = { w: attempt.outW, h: attempt.outH };
          lastCount = Math.ceil(decoded.frames.length / attempt.keepEvery);
          break;
        } catch (err) {
          if (err instanceof Error && err.message === 'over-target') {
            // Estimate: keep this attempt's size for the warning, try a stronger one.
            lastDims = { w: attempt.outW, h: attempt.outH };
            lastCount = Math.ceil(decoded.frames.length / attempt.keepEvery);
            if (ai === attempts.length - 1) {
              // Re-encode the last attempt without the size check so the user still gets a file.
              const out = await encodeFrames(decoded, attempt, null, 28 + (ai / attempts.length) * 20);
              blob = out.blob;
              lastSize = out.size;
            }
            continue;
          }
          throw new Error(`Failed while encoding (${attempt.label}): ${err instanceof Error ? err.message : String(err)}`);
        }
      }

      if (!blob) throw new Error('Encoding produced no output.');

      const url = URL.createObjectURL(blob);
      const metTarget = target === null || lastSize <= target * 1.01;
      setResult({ url, size: lastSize, width: lastDims.w, height: lastDims.h, frameCount: lastCount, attemptsUsed, metTarget });
      setProgress(100);
      setProgressLabel('');
      setAppState(AppState.COMPLETED);
      showToast('Your compressed GIF is ready!', 'success');
    } catch (err) {
      console.error('GIF compression failed:', err);
      setError(err instanceof Error ? err.message : 'Compression failed.');
      setProgressLabel('');
      setAppState(AppState.ERROR);
      showToast('Compression failed — see the message above.', 'error');
    }
  };

  const percentSaved = result && file ? Math.round((1 - result.size / file.size) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
        {/* ── Dropzone ── */}
        {!file && (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={onDrop}
            className="border-2 border-dashed border-gray-700 hover:border-cyan-500 rounded-2xl p-10 md:p-14 text-center cursor-pointer transition-colors bg-gray-950/50"
          >
            <UploadCloud className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <p className="text-white font-semibold text-lg mb-2">Drop your animated GIF here</p>
            <p className="text-gray-500 text-sm">or click to browse — it never leaves your device</p>
            <input
              ref={inputRef}
              type="file"
              accept=".gif,image/gif"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = '';
              }}
            />
          </div>
        )}

        {/* ── File loaded: preview + options ── */}
        {file && (
          <div>
            <div className="flex items-start gap-4 mb-6">
              {fileUrl && (
                <img src={fileUrl} alt="Original GIF" className="w-24 h-24 object-contain rounded-xl border border-gray-800 bg-black shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-white font-semibold truncate flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-cyan-400 shrink-0" />
                  {file.name}
                </p>
                <p className="text-gray-500 text-sm mt-1">Original size: <span className="text-gray-300 font-medium">{formatBytes(file.size)}</span></p>
                <button onClick={resetAll} className="text-xs text-gray-500 hover:text-cyan-400 mt-2 underline underline-offset-2">
                  Choose a different GIF
                </button>
              </div>
            </div>

            {/* ── Presets ── */}
            <h3 className="text-white font-semibold mb-3">Target preset</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  className={`text-left rounded-2xl border p-4 transition-colors ${presetId === p.id ? 'border-cyan-500 bg-cyan-950/30' : 'border-gray-800 bg-gray-950/50 hover:border-gray-600'}`}
                >
                  <p className={`font-semibold text-sm ${presetId === p.id ? 'text-cyan-300' : 'text-white'}`}>{p.label}</p>
                  <p className="text-gray-500 text-xs mt-1">{p.desc}</p>
                </button>
              ))}
            </div>

            {presetId === 'custom' && (
              <div className="mb-6">
                <label className="text-white font-semibold text-sm block mb-2">Custom target size (MB)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={customSizeMB}
                  onChange={e => setCustomSizeMB(e.target.value)}
                  className="w-40 bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 outline-none"
                />
              </div>
            )}

            {/* ── Options ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-white font-semibold text-sm block mb-2">
                  Max dimension: <span className="text-cyan-400">{maxDim}px</span>
                </label>
                <input
                  type="range"
                  min={128}
                  max={2048}
                  step={64}
                  value={maxDim}
                  onChange={e => setMaxDim(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <p className="text-gray-500 text-xs mt-1">Downscales the GIF to fit this width or height.</p>
              </div>
              <div>
                <label className="text-white font-semibold text-sm block mb-2">Frame reduction</label>
                <select
                  value={keepEvery}
                  onChange={e => setKeepEvery(Number(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 outline-none"
                >
                  {KEEP_EVERY_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <p className="text-gray-500 text-xs mt-1">Dropping frames is the fastest way to shrink a GIF.</p>
              </div>
              <div>
                <label className="text-white font-semibold text-sm block mb-2">Encoding quality</label>
                <select
                  value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-cyan-500 outline-none"
                >
                  {QUALITY_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <p className="text-gray-500 text-xs mt-1">Lower quality means fewer colors, smaller files.</p>
              </div>
            </div>

            {/* ── Compress button / progress ── */}
            {appState !== AppState.COMPLETED && (
              <button
                onClick={compress}
                disabled={appState === AppState.PROCESSING}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-2xl transition-colors text-lg flex items-center justify-center gap-2"
              >
                {appState === AppState.PROCESSING ? (
                  <><RefreshCw className="w-5 h-5 animate-spin" /> {progressLabel || 'Compressing…'} ({progress}%)</>
                ) : (
                  'Compress GIF'
                )}
              </button>
            )}

            {appState === AppState.PROCESSING && (
              <div className="mt-4">
                <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-start gap-3 bg-red-950/40 border border-red-800 rounded-2xl p-4">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 font-semibold text-sm">Compression failed</p>
                  <p className="text-red-400/80 text-sm mt-1">{error}</p>
                  <p className="text-gray-500 text-xs mt-2">No corrupted file was produced — the original GIF is untouched. Try a different GIF or simpler settings.</p>
                </div>
              </div>
            )}

            {truncateWarning && (
              <div className="mt-4 flex items-start gap-3 bg-amber-950/40 border border-amber-800 rounded-2xl p-4">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-amber-300/90 text-sm">This GIF has more than {MAX_FRAMES} frames — only the first {MAX_FRAMES} were compressed.</p>
              </div>
            )}

            {/* ── Result ── */}
            {result && (
              <div className="mt-6 bg-gray-950/60 border border-gray-800 rounded-2xl p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Before</p>
                    {fileUrl && <img src={fileUrl} alt="Original GIF" className="w-full max-h-64 object-contain rounded-xl border border-gray-800 bg-black mb-2" />}
                    <p className="text-white font-semibold">{file ? formatBytes(file.size) : ''}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">After</p>
                    <img src={result.url} alt="Compressed GIF" className="w-full max-h-64 object-contain rounded-xl border border-cyan-900 bg-black mb-2" />
                    <p className="text-white font-semibold">{formatBytes(result.size)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-5">
                  <p className="text-gray-400">
                    Saved: <span className="text-cyan-400 font-bold">{percentSaved}%</span>
                    <span className="text-gray-500"> ({formatBytes((file?.size ?? 0) - result.size)})</span>
                  </p>
                  <p className="text-gray-500 text-xs">{result.width}×{result.height}px · {result.frameCount} frames</p>
                  {result.attemptsUsed > 1 && (
                    <p className="text-gray-500 text-xs">tried {result.attemptsUsed} quality levels to hit your target</p>
                  )}
                </div>
                {!result.metTarget && (
                  <p className="text-amber-300/90 text-sm mb-4">
                    Even the strongest settings couldn't fit your target size. Try a shorter clip, fewer frames, or a smaller custom size.
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={result.url}
                    download={file ? file.name.replace(/\.gif$/i, '-compressed.gif') : 'compressed.gif'}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3.5 rounded-2xl transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" /> Download Compressed GIF
                  </a>
                  <button
                    onClick={compress}
                    disabled={appState === AppState.PROCESSING}
                    className="px-6 py-3.5 border border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-white font-semibold rounded-2xl transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompressGifTool;
