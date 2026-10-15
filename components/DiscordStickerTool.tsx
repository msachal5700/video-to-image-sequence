import React, { useState, useCallback, useEffect, useRef } from 'react';
import { UploadCloud, Download, Play, Pause, Trash2, Sparkles, Film } from 'lucide-react';
import { AppState } from '../types';
import { useToast } from './Toast';

/* ------------------------------------------------------------------ */
/* Platform presets                                                    */
/* ------------------------------------------------------------------ */

type PresetKey = 'discord' | 'telegram' | 'whatsapp';

interface Preset {
  key: PresetKey;
  label: string;
  format: string;
  ext: string;
  maxBytes: number;
  targetSize: number; // square output, px
  fpsSteps: number[];
  scaleSteps: number[];
  qualitySteps: number[]; // for lossy encoders; ignored for APNG
  hint: string;
}

const PRESETS: Record<PresetKey, Preset> = {
  discord: {
    key: 'discord',
    label: 'Discord',
    format: 'APNG',
    ext: 'png',
    maxBytes: 512 * 1024,
    targetSize: 320,
    fpsSteps: [15, 12, 10, 8],
    scaleSteps: [1, 0.8, 0.65, 0.5],
    qualitySteps: [1],
    hint: 'APNG · 320×320 · under 512 KB',
  },
  telegram: {
    key: 'telegram',
    label: 'Telegram',
    format: 'WebM',
    ext: 'webm',
    maxBytes: 256 * 1024,
    targetSize: 320,
    fpsSteps: [15, 12, 10],
    scaleSteps: [1, 0.8, 0.65],
    qualitySteps: [1, 0.8, 0.65],
    hint: 'VP9 WebM · under 256 KB',
  },
  whatsapp: {
    key: 'whatsapp',
    label: 'WhatsApp',
    format: 'Animated WebP',
    ext: 'webp',
    maxBytes: 500 * 1024,
    targetSize: 512,
    fpsSteps: [15, 12, 10, 8],
    scaleSteps: [1, 0.8, 0.65, 0.5],
    qualitySteps: [0.85, 0.7, 0.55, 0.4],
    hint: 'Animated WebP · 512×512 · under 500 KB',
  },
};

const MAX_FILE_BYTES = 50 * 1024 * 1024;
const MAX_FRAMES = 48;

/* ------------------------------------------------------------------ */
/* Binary helpers                                                      */
/* ------------------------------------------------------------------ */

function writeU32BE(out: Uint8Array, off: number, v: number): void {
  out[off] = (v >>> 24) & 0xff;
  out[off + 1] = (v >>> 16) & 0xff;
  out[off + 2] = (v >>> 8) & 0xff;
  out[off + 3] = v & 0xff;
}

function readU32BE(buf: Uint8Array, off: number): number {
  return ((buf[off] << 24) | (buf[off + 1] << 16) | (buf[off + 2] << 8) | buf[off + 3]) >>> 0;
}

function writeU32LE(out: Uint8Array, off: number, v: number): void {
  out[off] = v & 0xff;
  out[off + 1] = (v >>> 8) & 0xff;
  out[off + 2] = (v >>> 16) & 0xff;
  out[off + 3] = (v >>> 24) & 0xff;
}

function writeU24LE(out: Uint8Array, off: number, v: number): void {
  out[off] = v & 0xff;
  out[off + 1] = (v >>> 8) & 0xff;
  out[off + 2] = (v >>> 16) & 0xff;
}

const CRC_TABLE: Uint32Array = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  writeU32BE(out, 0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  writeU32BE(out, 8 + data.length, crc32(out.slice(4, 8 + data.length)));
  return out;
}

function webpChunk(fourcc: string, data: Uint8Array): Uint8Array {
  const padded = data.length + (data.length % 2);
  const out = new Uint8Array(8 + padded);
  for (let i = 0; i < 4; i++) out[i] = fourcc.charCodeAt(i);
  writeU32LE(out, 4, data.length);
  out.set(data, 8);
  return out;
}

/* ------------------------------------------------------------------ */
/* APNG encoder (lossless, for Discord)                                */
/* ------------------------------------------------------------------ */

interface ParsedPng {
  width: number;
  height: number;
  idat: Uint8Array[];
}

async function parsePng(blob: Blob): Promise<ParsedPng> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  // Verify PNG signature
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  for (let i = 0; i < 8; i++) {
    if (buf[i] !== sig[i]) throw new Error('Not a PNG frame');
  }
  let off = 8;
  let width = 0;
  let height = 0;
  const idat: Uint8Array[] = [];
  while (off + 12 <= buf.length) {
    const len = readU32BE(buf, off);
    const type = String.fromCharCode(buf[off + 4], buf[off + 5], buf[off + 6], buf[off + 7]);
    const data = buf.slice(off + 8, off + 8 + len);
    if (type === 'IHDR') {
      width = readU32BE(data, 0);
      height = readU32BE(data, 4);
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    off += 12 + len;
  }
  if (!width || !idat.length) throw new Error('Invalid PNG frame');
  return { width, height, idat };
}

function fcTl(seq: number, w: number, h: number, delayNum: number, delayDen: number): Uint8Array {
  const d = new Uint8Array(26);
  writeU32BE(d, 0, seq);
  writeU32BE(d, 4, w);
  writeU32BE(d, 8, h);
  writeU32BE(d, 12, 0); // x_offset
  writeU32BE(d, 16, 0); // y_offset
  d[20] = (delayNum >>> 8) & 0xff;
  d[21] = delayNum & 0xff;
  d[22] = (delayDen >>> 8) & 0xff;
  d[23] = delayDen & 0xff;
  d[24] = 0; // dispose_op: none
  d[25] = 0; // blend_op: source
  return pngChunk('fcTL', d);
}

function fdAt(seq: number, frameData: Uint8Array): Uint8Array {
  const d = new Uint8Array(4 + frameData.length);
  writeU32BE(d, 0, seq);
  d.set(frameData, 4);
  return pngChunk('fdAT', d);
}

async function encodeApng(frameBlobs: Blob[], fps: number): Promise<Blob> {
  const frames = await Promise.all(frameBlobs.map(parsePng));
  const w = frames[0].width;
  const h = frames[0].height;

  const parts: Uint8Array[] = [];
  const sig = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  parts.push(sig);

  // IHDR: 8-bit RGBA
  const ihdr = new Uint8Array(13);
  writeU32BE(ihdr, 0, w);
  writeU32BE(ihdr, 4, h);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  parts.push(pngChunk('IHDR', ihdr));

  // acTL: frame count, infinite loop
  const actl = new Uint8Array(8);
  writeU32BE(actl, 0, frames.length);
  writeU32BE(actl, 4, 0);
  parts.push(pngChunk('acTL', actl));

  let seq = 0;
  frames.forEach((fr, idx) => {
    parts.push(fcTl(seq++, w, h, 1, fps));
    fr.idat.forEach((idatData) => {
      if (idx === 0) {
        parts.push(pngChunk('IDAT', idatData));
      } else {
        parts.push(fdAt(seq++, idatData));
      }
    });
  });

  parts.push(pngChunk('IEND', new Uint8Array(0)));
  return new Blob(parts as BlobPart[], { type: 'image/apng' });
}

/* ------------------------------------------------------------------ */
/* Animated WebP encoder (for WhatsApp)                                */
/* ------------------------------------------------------------------ */

async function encodeAnimatedWebp(
  frameBlobs: Blob[],
  width: number,
  height: number,
  fps: number
): Promise<Blob> {
  const delayMs = Math.round(1000 / fps);

  // VP8X: animation flag + canvas size
  const vp8x = new Uint8Array(10);
  vp8x[0] = 0x02; // animation bit
  writeU24LE(vp8x, 4, width - 1);
  writeU24LE(vp8x, 7, height - 1);

  // ANIM: background color + infinite loop
  const anim = new Uint8Array(6);
  writeU32LE(anim, 0, 0xffffffff);
  anim[4] = 0;
  anim[5] = 0;

  const chunks: Uint8Array[] = [webpChunk('VP8X', vp8x), webpChunk('ANIM', anim)];

  for (const blob of frameBlobs) {
    const buf = new Uint8Array(await blob.arrayBuffer());
    // canvas WebP output is a full RIFF file; frame payload starts at offset 12
    if (buf.length < 20 || buf[0] !== 0x52 /* R */) throw new Error('Invalid WebP frame');
    const payload = buf.slice(12);
    const anmf = new Uint8Array(16 + payload.length);
    writeU24LE(anmf, 0, 0); // frame x
    writeU24LE(anmf, 3, 0); // frame y
    writeU24LE(anmf, 6, width - 1);
    writeU24LE(anmf, 9, height - 1);
    writeU24LE(anmf, 12, delayMs);
    anmf[15] = 0; // flags
    anmf.set(payload, 16);
    chunks.push(webpChunk('ANMF', anmf));
  }

  const bodySize = 4 + chunks.reduce((s, c) => s + c.length, 0);
  const out = new Uint8Array(8 + bodySize);
  out[0] = 0x52; out[1] = 0x49; out[2] = 0x46; out[3] = 0x46; // RIFF
  writeU32LE(out, 4, bodySize);
  out[8] = 0x57; out[9] = 0x45; out[10] = 0x42; out[11] = 0x50; // WEBP
  let off = 12;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return new Blob([out], { type: 'image/webp' });
}

/* ------------------------------------------------------------------ */
/* Frame extraction helpers                                            */
/* ------------------------------------------------------------------ */

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Frame encoding failed'))),
      type,
      quality
    );
  });
}

function seekTo(video: HTMLVideoElement, t: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
    };
    const onSeeked = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error('Video seek failed')); };
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    video.currentTime = Math.max(0, Math.min(t, Math.max(0, video.duration - 0.05)));
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface EncodeResult {
  blob: Blob;
  fps: number;
  sizePx: number;
  quality: number | null;
  attempts: number;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const DiscordStickerTool: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(3);
  const [presetKey, setPresetKey] = useState<PresetKey>('discord');
  const [autoFit, setAutoFit] = useState(true);
  const [manualFps, setManualFps] = useState(12);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [resultMime, setResultMime] = useState('');
  const [usedSettings, setUsedSettings] = useState('');
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(true);
  const { showToast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cancelledRef = useRef(false);

  const preset = PRESETS[presetKey];

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('video/')) {
      showToast('Please choose a video file (MP4, MOV, WebM).', 'error');
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      showToast('Video is larger than 50 MB — please use a shorter clip.', 'error');
      return;
    }
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setVideoFile(f);
    const url = URL.createObjectURL(f);
    setVideoUrl(url);
    setAppState(AppState.IDLE);
  };

  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const d = v.duration || 0;
    setDuration(d);
    setTrimStart(0);
    setTrimEnd(Math.min(3, d));
  }, []);

  const clearAll = () => {
    cancelledRef.current = true;
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setVideoFile(null);
    setVideoUrl(null);
    setResultUrl(null);
    setDuration(0);
    setAppState(AppState.IDLE);
    setProgress(0);
  };

  /** Extract square center-cropped frames at target size. */
  const extractFrames = useCallback(
    async (video: HTMLVideoElement, start: number, end: number, fps: number, sizePx: number): Promise<HTMLCanvasElement[]> => {
      const count = Math.min(MAX_FRAMES, Math.max(2, Math.round((end - start) * fps)));
      const canvas = document.createElement('canvas');
      canvas.width = sizePx;
      canvas.height = sizePx;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D not available');

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const side = Math.min(vw, vh);
      const sx = (vw - side) / 2;
      const sy = (vh - side) / 2;

      const frames: HTMLCanvasElement[] = [];
      for (let i = 0; i < count; i++) {
        if (cancelledRef.current) throw new Error('cancelled');
        const t = start + (i / fps);
        await seekTo(video, Math.min(t, end - 0.02));
        ctx.drawImage(video, sx, sy, side, side, 0, 0, sizePx, sizePx);
        const copy = document.createElement('canvas');
        copy.width = sizePx;
        copy.height = sizePx;
        const cctx = copy.getContext('2d');
        if (!cctx) throw new Error('Canvas 2D not available');
        cctx.drawImage(canvas, 0, 0);
        frames.push(copy);
      }
      return frames;
    },
    []
  );

  const encodeFrames = useCallback(
    async (
      frames: HTMLCanvasElement[],
      fps: number,
      sizePx: number,
      quality: number,
      key: PresetKey
    ): Promise<Blob> => {
      if (key === 'discord') {
        const blobs = await Promise.all(frames.map((c) => canvasToBlob(c, 'image/png')));
        return encodeApng(blobs, fps);
      }
      if (key === 'whatsapp') {
        const blobs = await Promise.all(frames.map((c) => canvasToBlob(c, 'image/webp', quality)));
        return encodeAnimatedWebp(blobs, sizePx, sizePx, fps);
      }
      // telegram: VP9 WebM via MediaRecorder with manual frame pacing
      const canvas = frames[0];
      const stream = canvas.captureStream(0);
      const MR = (window as unknown as { MediaRecorder?: typeof MediaRecorder }).MediaRecorder;
      if (!MR) throw new Error('MediaRecorder is not available in this browser.');
      const mime = 'video/webm;codecs=vp9';
      if (!MR.isTypeSupported(mime)) throw new Error('VP9 WebM encoding is not supported in this browser.');
      const rec = new MR(stream, { mimeType: mime, videoBitsPerSecond: Math.round(quality * 1_200_000) });
      const chunks: Blob[] = [];
      const done = new Promise<Blob>((resolve, reject) => {
        rec.ondataavailable = (ev: BlobEvent) => { if (ev.data && ev.data.size) chunks.push(ev.data); };
        rec.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
        rec.onerror = () => reject(new Error('WebM recording failed'));
      });
      rec.start();
      const track = stream.getVideoTracks()[0] as CanvasCaptureMediaStreamTrack;
      const frameInterval = 1000 / fps;
      for (const fr of frames) {
        if (cancelledRef.current) { rec.stop(); throw new Error('cancelled'); }
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.drawImage(fr, 0, 0);
        track.requestFrame();
        await new Promise((r) => setTimeout(r, frameInterval));
      }
      // hold the last frame briefly, then stop
      await new Promise((r) => setTimeout(r, frameInterval));
      rec.stop();
      return done;
    },
    []
  );

  const createSticker = useCallback(async () => {
    if (!videoFile || !videoUrl) return;
    cancelledRef.current = false;
    setAppState(AppState.PROCESSING);
    setProgress(0);
    setResultUrl(null);

    try {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.src = videoUrl;
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error('Could not load video'));
      });
      await seekTo(video, trimStart);

      const start = Math.max(0, trimStart);
      const end = Math.max(start + 0.5, Math.min(trimEnd, video.duration || trimEnd));
      const clipLen = end - start;

      // Build ordered attempt list: best quality first
      interface Attempt { fps: number; scale: number; quality: number }
      const attempts: Attempt[] = [];
      if (autoFit) {
        for (const fps of preset.fpsSteps) {
          for (const scale of preset.scaleSteps) {
            for (const quality of preset.qualitySteps) {
              attempts.push({ fps, scale, quality });
            }
          }
        }
      } else {
        attempts.push({ fps: manualFps, scale: 1, quality: preset.qualitySteps[0] });
      }

      let best: EncodeResult | null = null;
      let doneCount = 0;
      for (const a of attempts) {
        if (cancelledRef.current) throw new Error('cancelled');
        const sizePx = Math.max(64, Math.round(preset.targetSize * a.scale));
        setProgressLabel(`Trying ${a.fps} FPS · ${sizePx}px${presetKey === 'whatsapp' ? ` · quality ${Math.round(a.quality * 100)}%` : ''}…`);
        const frames = await extractFrames(video, start, end, a.fps, sizePx);
        const blob = await encodeFrames(frames, a.fps, sizePx, a.quality, presetKey);
        doneCount++;
        setProgress(Math.round((doneCount / attempts.length) * 100));
        const res: EncodeResult = { blob, fps: a.fps, sizePx, quality: presetKey === 'discord' ? null : a.quality, attempts: doneCount };
        if (blob.size <= preset.maxBytes) {
          best = res;
          break;
        }
        best = res; // keep smallest-so-far as fallback
      }

      if (!best) throw new Error('Encoding failed');
      if (cancelledRef.current) throw new Error('cancelled');

      const url = URL.createObjectURL(best.blob);
      setResultUrl(url);
      setResultSize(best.blob.size);
      setResultMime(best.blob.type || (presetKey === 'discord' ? 'image/apng' : presetKey === 'whatsapp' ? 'image/webp' : 'video/webm'));
      const q = best.quality !== null ? ` · quality ${Math.round(best.quality * 100)}%` : '';
      setUsedSettings(`${best.fps} FPS · ${best.sizePx}×${best.sizePx}px${q} · ${clipLen.toFixed(1)}s clip`);
      setAppState(AppState.COMPLETED);
      if (best.blob.size <= preset.maxBytes) {
        showToast(`Sticker ready — ${formatBytes(best.blob.size)} (under ${formatBytes(preset.maxBytes)} limit)`, 'success');
      } else {
        showToast(`Smallest possible is ${formatBytes(best.blob.size)} — still over the ${formatBytes(preset.maxBytes)} limit. Try a shorter clip.`, 'warning');
      }
      URL.revokeObjectURL(video.src);
    } catch (err) {
      if ((err as Error).message === 'cancelled') {
        setAppState(AppState.IDLE);
      } else {
        console.error('Sticker creation failed:', err);
        showToast('Failed to create sticker. Try a shorter clip or a different video.', 'error');
        setAppState(AppState.ERROR);
      }
    }
  }, [videoFile, videoUrl, trimStart, trimEnd, preset, presetKey, autoFit, manualFps, extractFrames, encodeFrames, showToast]);

  const processing = appState === AppState.PROCESSING;
  const clipLen = Math.max(0, trimEnd - trimStart);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Upload */}
      {!videoFile && (
        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-700 border-dashed rounded-2xl cursor-pointer bg-gray-950/50 hover:bg-gray-900 hover:border-cyan-500 transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
              <UploadCloud className="w-8 h-8 mb-2 text-gray-500 group-hover:text-cyan-400 transition-colors" />
              <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-white">Click to upload a video</span> or drag and drop</p>
              <p className="text-xs text-gray-500">MP4, MOV, WebM · up to 50 MB · short clips work best</p>
            </div>
            <input type="file" className="hidden" accept="video/*" onChange={handleUpload} />
          </label>
        </div>
      )}

      {/* Configurator */}
      {videoFile && videoUrl && (
        <div className="space-y-6 animate-fade-in">
          <video ref={videoRef} src={videoUrl} className="hidden" muted playsInline preload="auto" onLoadedMetadata={handleLoadedMetadata} />

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400 truncate">
              <Film className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              <span className="text-white font-medium">{videoFile.name}</span>
              {duration > 0 && <span className="ml-2 font-mono">{duration.toFixed(1)}s</span>}
            </div>
            <button onClick={clearAll} className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm font-medium transition-colors">
              <Trash2 className="w-4 h-4" /> New video
            </button>
          </div>

          {/* Trim */}
          <div className="bg-gray-950/60 border border-gray-800 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-semibold">Clip range</h3>
              <span className="text-cyan-400 font-mono text-sm">{clipLen.toFixed(1)}s sticker</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs text-gray-500">Start (s)</span>
                <input
                  type="number" min={0} max={Math.max(0, duration - 0.5)} step={0.1}
                  value={trimStart}
                  onChange={(e) => setTrimStart(Math.min(parseFloat(e.target.value) || 0, trimEnd - 0.5))}
                  className="mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 outline-none"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">End (s)</span>
                <input
                  type="number" min={0.5} max={duration || 60} step={0.1}
                  value={trimEnd}
                  onChange={(e) => setTrimEnd(Math.max(parseFloat(e.target.value) || 0.5, trimStart + 0.5))}
                  className="mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-cyan-500 outline-none"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">Tip: stickers loop best at 1–3 seconds. Longer clips are harder to fit under platform size limits.</p>
          </div>

          {/* Presets */}
          <div className="bg-gray-950/60 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-3">Target platform</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(PRESETS) as PresetKey[]).map((key) => {
                const p = PRESETS[key];
                const active = key === presetKey;
                return (
                  <button
                    key={key}
                    onClick={() => { setPresetKey(key); setResultUrl(null); setAppState(AppState.IDLE); }}
                    className={`rounded-xl border p-4 text-left transition-all ${active ? 'border-cyan-500 bg-cyan-950/30' : 'border-gray-800 bg-gray-900/40 hover:border-gray-600'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${active ? 'text-cyan-300' : 'text-white'}`}>{p.label}</span>
                      <span className="text-[10px] font-mono bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded">{p.format}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">{p.hint}</p>
                  </button>
                );
              })}
            </div>

            {/* Auto-fit toggle */}
            <label className="flex items-center gap-3 mt-4 cursor-pointer select-none">
              <button
                role="switch"
                aria-checked={autoFit}
                onClick={() => setAutoFit(!autoFit)}
                className={`w-11 h-6 rounded-full transition-colors relative ${autoFit ? 'bg-cyan-500' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${autoFit ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
              <span className="text-sm text-gray-300">
                <Sparkles className="w-4 h-4 inline mr-1.5 -mt-0.5 text-cyan-400" />
                <strong className="text-white">Auto-fit file size</strong> — automatically tune FPS, resolution and quality to stay under the limit
              </span>
            </label>

            {!autoFit && (
              <div className="mt-4">
                <label className="block text-xs text-gray-500 mb-1.5">Frame rate: <span className="text-white font-mono">{manualFps} FPS</span></label>
                <input
                  type="range" min={5} max={20} step={1} value={manualFps}
                  onChange={(e) => setManualFps(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500"
                />
              </div>
            )}
          </div>

          {/* Action */}
          <button
            onClick={createSticker}
            disabled={processing || clipLen <= 0}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {processing ? (
              <>Creating sticker… <span className="font-mono">{progress}%</span></>
            ) : (
              <><Sparkles className="w-5 h-5" /> Create {preset.label} Sticker</>
            )}
          </button>

          {processing && (
            <div className="bg-gray-950/60 border border-gray-800 rounded-2xl p-4">
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-2 font-mono">{progressLabel}</p>
            </div>
          )}

          {/* Result */}
          {resultUrl && appState === AppState.COMPLETED && (
            <div className="bg-gray-950/60 border border-gray-800 rounded-2xl p-5 animate-fade-in">
              <h3 className="text-white font-semibold mb-1">
                Sticker ready! <span className="text-sm font-mono text-gray-400">({formatBytes(resultSize)})</span>
              </h3>
              <p className="text-xs text-gray-500 font-mono mb-4">{usedSettings} · {resultMime || preset.format}</p>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="bg-gray-900 rounded-xl p-3 flex items-center justify-center min-w-[180px]">
                  {presetKey === 'telegram' ? (
                    <video src={resultUrl} autoPlay loop muted playsInline className="max-h-[220px] rounded-lg" />
                  ) : (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <img src={resultUrl} alt={`${preset.label} sticker result`} className="max-h-[220px] rounded-lg" />
                  )}
                </div>
                <div className="flex-1 w-full">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsPreviewPlaying(!isPreviewPlaying)}
                      className="px-3 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:border-cyan-500 transition-colors"
                      aria-label={isPreviewPlaying ? 'Pause preview' : 'Play preview'}
                    >
                      {isPreviewPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <a
                      href={resultUrl}
                      download={`sticker-${presetKey}.${preset.ext}`}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" /> Download {preset.format}
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    {resultSize <= preset.maxBytes
                      ? `✓ Under the ${preset.label} ${formatBytes(preset.maxBytes)} limit — ready to upload.`
                      : `⚠ Over the ${preset.label} limit — try a shorter clip.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscordStickerTool;
