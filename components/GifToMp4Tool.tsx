import React, { useRef, useState } from 'react';

const MAX_FILE_BYTES = 50 * 1024 * 1024;
const MAX_FRAMES = 400;
const MAX_ENCODE_FRAMES = 300;

type Status = 'idle' | 'decoding' | 'ready' | 'encoding' | 'done' | 'error';
type EncoderKind = 'webcodecs' | 'mediarecorder-mp4' | 'mediarecorder-webm' | 'unsupported';

type DecodedFrame = { data: ImageData; delayMs: number };

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function detectKind(bytes: Uint8Array): 'gif' | 'webp' | 'unknown' {
  if (bytes.length > 3 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'gif';
  if (
    bytes.length > 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return 'webp';
  return 'unknown';
}

function isAnimatedWebp(bytes: Uint8Array): boolean {
  for (let i = 12; i + 4 <= bytes.length; i++) {
    if (bytes[i] === 0x41 && bytes[i + 1] === 0x4e && bytes[i + 2] === 0x49 && bytes[i + 3] === 0x4d) return true;
  }
  return false;
}

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

/** Composite GIF frames honoring disposal methods. Returns full-canvas RGBA snapshots. */
async function decodeGifFrames(arrayBuffer: ArrayBuffer): Promise<{ width: number; height: number; frames: DecodedFrame[] }> {
  const { parseGIF, decompressFrames } = await import('gifuct-js');
  const gif = parseGIF(arrayBuffer);
  const w = gif.lsd.width, h = gif.lsd.height;
  if (!w || !h) throw new Error('Could not read GIF dimensions.');
  const parsed = decompressFrames(gif, true);
  const canvas = new Uint8ClampedArray(w * h * 4);
  const out: DecodedFrame[] = [];
  let prevDisposal = 1;
  let prevDims = { left: 0, top: 0, width: w, height: h };
  for (const f of parsed) {
    if (out.length > 0 && (prevDisposal === 2 || prevDisposal === 3)) {
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
        canvas[di] = patch[si]; canvas[di + 1] = patch[si + 1];
        canvas[di + 2] = patch[si + 2]; canvas[di + 3] = patch[si + 3];
      }
    }
    out.push({ data: new ImageData(new Uint8ClampedArray(canvas), w, h), delayMs: Math.max(20, f.delay) }); // f.delay is already ms
    if (out.length >= MAX_FRAMES) break;
    prevDisposal = f.disposalType;
    prevDims = f.dims;
  }
  if (out.length === 0) throw new Error('No frames found in this GIF.');
  return { width: w, height: h, frames: out };
}

/** Composite animated WebP frames honoring blend/dispose. Returns full-canvas RGBA snapshots. */
async function decodeAnimatedWebp(arrayBuffer: ArrayBuffer): Promise<{ width: number; height: number; frames: DecodedFrame[] }> {
  const { decodeAnimation } = await import('@stacksjs/ts-webp');
  const anim = decodeAnimation(new Uint8Array(arrayBuffer));
  const w = anim.width, h = anim.height;
  const canvas = new Uint8ClampedArray(w * h * 4);
  const out: DecodedFrame[] = [];
  let prev: { x: number; y: number; w: number; h: number; dispose: string } | null = null;
  for (const f of anim.frames) {
    if (prev && prev.dispose === 'background') clearRect(canvas, w, prev.x, prev.y, prev.w, prev.h, h);
    const fw = f.image.width, fh = f.image.height;
    const src = f.image.data;
    if (f.blend === 'replace') clearRect(canvas, w, f.x, f.y, fw, fh, h);
    for (let y = 0; y < fh; y++) {
      const dy = f.y + y;
      if (dy < 0 || dy >= h) continue;
      for (let x = 0; x < fw; x++) {
        const dx = f.x + x;
        if (dx < 0 || dx >= w) continue;
        const si = (y * fw + x) * 4;
        const di = (dy * w + dx) * 4;
        if (f.blend === 'replace') {
          canvas[di] = src[si]; canvas[di + 1] = src[si + 1];
          canvas[di + 2] = src[si + 2]; canvas[di + 3] = src[si + 3];
        } else {
          const sa = src[si + 3] / 255;
          if (sa === 0) continue;
          const da = canvas[di + 3] / 255;
          const outA = sa + da * (1 - sa);
          if (outA === 0) continue;
          canvas[di] = Math.round((src[si] * sa + canvas[di] * da * (1 - sa)) / outA);
          canvas[di + 1] = Math.round((src[si + 1] * sa + canvas[di + 1] * da * (1 - sa)) / outA);
          canvas[di + 2] = Math.round((src[si + 2] * sa + canvas[di + 2] * da * (1 - sa)) / outA);
          canvas[di + 3] = Math.round(outA * 255);
        }
      }
    }
    out.push({ data: new ImageData(new Uint8ClampedArray(canvas), w, h), delayMs: Math.max(20, f.duration) });
    if (out.length >= MAX_FRAMES) break;
    prev = { x: f.x, y: f.y, w: fw, h: fh, dispose: f.dispose };
  }
  if (out.length === 0) throw new Error('No frames found in this WebP.');
  return { width: w, height: h, frames: out };
}

async function probeEncoder(width: number, height: number): Promise<{ kind: EncoderKind; codec?: string }> {
  const VE = (window as unknown as { VideoEncoder?: typeof VideoEncoder }).VideoEncoder;
  const VF = (window as unknown as { VideoFrame?: typeof VideoFrame }).VideoFrame;
  if (VE && VF) {
    for (const codec of ['avc1.640028', 'avc1.42001f']) {
      try {
        const sup = await VE.isConfigSupported({ codec, width, height, bitrate: 1_000_000, framerate: 30 });
        if (sup.supported) return { kind: 'webcodecs', codec };
      } catch { /* try next */ }
    }
  }
  const MR = (window as unknown as { MediaRecorder?: typeof MediaRecorder }).MediaRecorder;
  if (MR && typeof MR.isTypeSupported === 'function') {
    if (MR.isTypeSupported('video/mp4')) return { kind: 'mediarecorder-mp4' };
    if (MR.isTypeSupported('video/webm')) return { kind: 'mediarecorder-webm' };
  }
  return { kind: 'unsupported' };
}

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

const GifToMp4Tool: React.FC = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [origBytes, setOrigBytes] = useState(0);
  const [frames, setFrames] = useState<DecodedFrame[]>([]);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [kind, setKind] = useState<'gif' | 'webp'>('gif');
  const [encoderKind, setEncoderKind] = useState<EncoderKind>('unsupported');
  const [encoderCodec, setEncoderCodec] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  // Manual settings
  const [fpsMode, setFpsMode] = useState<'auto' | '15' | '24' | '30'>('auto');
  const [quality, setQuality] = useState<'small' | 'balanced' | 'high'>('balanced');
  const [bg, setBg] = useState<'white' | 'black'>('white');
  // Encode progress + result
  const [progress, setProgress] = useState(0);
  const [outBytes, setOutBytes] = useState(0);
  const [outUrl, setOutUrl] = useState('');
  const [outExt, setOutExt] = useState('mp4');
  const [outFps, setOutFps] = useState(0);
  const [outDurationMs, setOutDurationMs] = useState(0);
  const [sampled, setSampled] = useState(false);

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (outUrl) URL.revokeObjectURL(outUrl);
    setStatus('idle'); setError(''); setFrames([]); setPreviewUrl(''); setOutUrl('');
    setOutBytes(0); setProgress(0); setSampled(false); setFileName('');
  };

  const handleFile = async (file: File) => {
    reset();
    if (file.size > MAX_FILE_BYTES) { setStatus('error'); setError(`That file is ${formatBytes(file.size)} — the limit is 50 MB.`); return; }
    setStatus('decoding'); setFileName(file.name); setOrigBytes(file.size);
    try {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      const k = detectKind(bytes);
      if (k === 'unknown') throw new Error('That doesn’t look like a GIF or WebP file. If it’s a video renamed to .gif, use the video frame extractor instead.');
      if (k === 'webp' && !isAnimatedWebp(bytes)) throw new Error('That WebP is a still image — there’s no animation to convert. (If you want its frames, try GIF to Frames.)');
      setKind(k);
      const decoded = k === 'gif' ? await decodeGifFrames(buf) : await decodeAnimatedWebp(buf);
      if (decoded.frames.length < 2) throw new Error('Only one frame found — this file isn’t really animated, so there’s nothing to turn into video.');
      setFrames(decoded.frames);
      setDims({ w: decoded.width, h: decoded.height });
      // Preview = middle frame composited on chosen bg
      const mid = decoded.frames[Math.floor(decoded.frames.length / 2)].data;
      const c = document.createElement('canvas');
      c.width = mid.width; c.height = mid.height;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height);
      const fc = document.createElement('canvas');
      fc.width = mid.width; fc.height = mid.height;
      fc.getContext('2d')!.putImageData(mid, 0, 0);
      ctx.drawImage(fc, 0, 0);
      const url = await new Promise<string>((res, rej) => c.toBlob(b => b ? res(URL.createObjectURL(b)) : rej(new Error('Preview failed')), 'image/png'));
      setPreviewUrl(url);
      const encW = decoded.width + (decoded.width % 2);
      const encH = decoded.height + (decoded.height % 2);
      const probe = await probeEncoder(encW, encH);
      setEncoderKind(probe.kind);
      if (probe.codec) setEncoderCodec(probe.codec);
      if (probe.kind === 'unsupported') throw new Error('Your browser can’t encode video (no WebCodecs H.264 and no MediaRecorder). Try a recent Chrome or Edge.');
      setStatus('ready');
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Something went wrong decoding that file.');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void handleFile(f);
  };

  /** Build the timed frame list honoring manual fps override + frame cap. */
  const buildTimeline = (): { image: ImageData; durationUs: number }[] => {
    const totalMs = frames.reduce((s, f) => s + f.delayMs, 0);
    let fps: number;
    if (fpsMode === 'auto') {
      fps = Math.min(30, Math.max(1, Math.round((frames.length / totalMs) * 1000)));
    } else fps = parseInt(fpsMode, 10);
    const targetDurMs = totalMs;
    const tickMs = 1000 / fps;
    // Cumulative boundaries for nearest-frame lookup
    const bounds: number[] = [];
    let acc = 0;
    for (const f of frames) { acc += f.delayMs; bounds.push(acc); }
    const pick = (t: number): ImageData => {
      for (let i = 0; i < bounds.length; i++) if (t < bounds[i]) return frames[i].data;
      return frames[frames.length - 1].data;
    };
    const n = Math.max(1, Math.round(targetDurMs / tickMs));
    const durUs = Math.round(tickMs * 1000);
    let tl = Array.from({ length: n }, (_, i) => ({ image: pick(i * tickMs + tickMs / 2), durationUs: durUs }));
    let wasSampled = false;
    if (tl.length > MAX_ENCODE_FRAMES) {
      const step = tl.length / MAX_ENCODE_FRAMES;
      tl = Array.from({ length: MAX_ENCODE_FRAMES }, (_, i) => tl[Math.floor(i * step)]);
      wasSampled = true;
    }
    setSampled(wasSampled);
    setOutFps(Math.round((tl.length / (tl.reduce((s, x) => s + x.durationUs, 0) / 1e6)) * 10) / 10);
    setOutDurationMs(Math.round(tl.reduce((s, x) => s + x.durationUs, 0) / 1000));
    return tl;
  };

  const bitrateFor = (w: number, h: number, fps: number): number => {
    const bpp = quality === 'small' ? 0.06 : quality === 'high' ? 0.28 : 0.13;
    return Math.min(8_000_000, Math.max(250_000, Math.round(w * h * fps * bpp)));
  };

  const drawFrame = (ctx: CanvasRenderingContext2D, encW: number, encH: number, image: ImageData) => {
    ctx.fillStyle = bg === 'white' ? '#ffffff' : '#000000';
    ctx.fillRect(0, 0, encW, encH);
    const fc = document.createElement('canvas');
    fc.width = image.width; fc.height = image.height;
    fc.getContext('2d')!.putImageData(image, 0, 0);
    ctx.drawImage(fc, (encW - image.width) / 2, (encH - image.height) / 2);
  };

  const encodeWebCodecs = async (timeline: { image: ImageData; durationUs: number }[], encW: number, encH: number, codec: string, fps: number) => {
    const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');
    const muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: { codec: 'avc', width: encW, height: encH },
      fastStart: 'in-memory',
      firstTimestampBehavior: 'offset',
    });
    const VE = (window as unknown as { VideoEncoder: typeof VideoEncoder }).VideoEncoder;
    const VF = (window as unknown as { VideoFrame: typeof VideoFrame }).VideoFrame;
    let encodeError: Error | null = null;
    const encoder = new VE({
      output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
      error: (e) => { encodeError = e instanceof Error ? e : new Error(String(e)); },
    });
    const bitrate = bitrateFor(encW, encH, fps);
    encoder.configure({ codec, width: encW, height: encH, bitrate, framerate: fps });
    const canvas = document.createElement('canvas');
    canvas.width = encW; canvas.height = encH;
    const ctx = canvas.getContext('2d')!;
    let t = 0;
    const keyEvery = Math.max(1, Math.round(fps * 2));
    for (let i = 0; i < timeline.length; i++) {
      drawFrame(ctx, encW, encH, timeline[i].image);
      const vf = new VF(canvas, { timestamp: t, duration: timeline[i].durationUs });
      encoder.encode(vf, { keyFrame: i % keyEvery === 0 });
      vf.close();
      t += timeline[i].durationUs;
      setProgress(Math.round(((i + 1) / timeline.length) * 100));
      if (i % 10 === 0) await sleep(0);
    }
    await encoder.flush();
    encoder.close();
    if (encodeError) throw encodeError;
    muxer.finalize();
    return new Blob([(muxer.target as unknown as { buffer: ArrayBuffer }).buffer], { type: 'video/mp4' });
  };

  const encodeMediaRecorder = async (timeline: { image: ImageData; durationUs: number }[], encW: number, encH: number, fps: number, mime: string): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    canvas.width = encW; canvas.height = encH;
    const ctx = canvas.getContext('2d')!;
    const stream = canvas.captureStream(fps);
    const MR = (window as unknown as { MediaRecorder: typeof MediaRecorder }).MediaRecorder;
    const rec = new MR(stream, { mimeType: mime, videoBitsPerSecond: bitrateFor(encW, encH, fps) });
    const chunks: Blob[] = [];
    const done = new Promise<void>((res, rej) => {
      rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      rec.onerror = () => rej(new Error('MediaRecorder failed mid-encode.'));
      rec.onstop = () => res();
    });
    rec.start(250);
    for (let i = 0; i < timeline.length; i++) {
      drawFrame(ctx, encW, encH, timeline[i].image);
      await sleep(Math.max(1, Math.round(timeline[i].durationUs / 1000)));
      setProgress(Math.round(((i + 1) / timeline.length) * 100));
    }
    // Hold the last frame briefly so the tail isn't cut
    await sleep(300);
    rec.stop();
    await done;
    stream.getTracks().forEach(tr => tr.stop());
    return new Blob(chunks, { type: mime });
  };

  const handleConvert = async () => {
    if (frames.length === 0 || status !== 'ready') return;
    setStatus('encoding'); setProgress(0); setError('');
    try {
      const encW = dims.w + (dims.w % 2);
      const encH = dims.h + (dims.h % 2);
      const timeline = buildTimeline();
      const fps = outFps || 15;
      let blob: Blob; let ext = 'mp4';
      if (encoderKind === 'webcodecs' && encoderCodec) {
        blob = await encodeWebCodecs(timeline, encW, encH, encoderCodec, fps);
      } else if (encoderKind === 'mediarecorder-mp4') {
        blob = await encodeMediaRecorder(timeline, encW, encH, fps, 'video/mp4');
      } else if (encoderKind === 'mediarecorder-webm') {
        blob = await encodeMediaRecorder(timeline, encW, encH, fps, 'video/webm');
        ext = 'webm';
      } else {
        throw new Error('No usable video encoder in this browser.');
      }
      setOutBytes(blob.size);
      setOutExt(ext);
      if (outUrl) URL.revokeObjectURL(outUrl);
      setOutUrl(URL.createObjectURL(blob));
      setStatus('done');
    } catch (e) {
      setStatus('ready');
      setError(e instanceof Error ? e.message : 'Encoding failed. Try a smaller file or a different browser.');
    }
  };

  const download = () => {
    if (!outUrl) return;
    const a = document.createElement('a');
    a.href = outUrl;
    a.download = fileName.replace(/\.(gif|webp)$/i, '') + `-converted.${outExt}`;
    document.body.appendChild(a); a.click(); a.remove();
  };

  const totalMs = frames.reduce((s, f) => s + f.delayMs, 0);
  const savedPct = origBytes > 0 && outBytes > 0 ? Math.round((1 - outBytes / origBytes) * 100) : 0;

  const encoderLabel =
    encoderKind === 'webcodecs' ? 'H.264 encoder — this browser' :
    encoderKind === 'mediarecorder-mp4' ? 'MP4 via MediaRecorder — this browser' :
    encoderKind === 'mediarecorder-webm' ? 'WebM fallback — this browser can’t write MP4, so you get WebM' :
    'No encoder available';

  return (
    <div>
      {(status === 'idle' || status === 'error') && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition ${dragOver ? 'border-cyan-400 bg-cyan-950/20' : 'border-gray-700 bg-gray-900/50 hover:border-cyan-600'}`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".gif,.webp,image/gif,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); e.target.value = ''; }}
          />
          <p className="text-white font-semibold text-lg mb-2">Drop your GIF or animated WebP here</p>
          <p className="text-gray-500 text-sm">or click to browse — files stay on your device, up to 50&nbsp;MB</p>
          {status === 'error' && error && (
            <p className="mt-4 text-red-400 text-sm max-w-md mx-auto">{error}</p>
          )}
        </div>
      )}

      {status === 'decoding' && (
        <div className="border-2 border-dashed border-gray-700 rounded-2xl p-10 text-center bg-gray-900/50">
          <p className="text-white font-semibold text-lg mb-4">Decoding animation…</p>
          <div className="mx-auto w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full animate-pulse w-full" />
          </div>
          <p className="text-gray-500 text-sm mt-4">Reading every frame on your device — nothing uploaded.</p>
        </div>
      )}

      {(status === 'ready' || status === 'encoding') && frames.length > 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8">
          <div className="grid md:grid-cols-[220px_1fr] gap-6">
            {previewUrl && (
              <img src={previewUrl} alt="Middle frame preview" className="w-full rounded-xl border border-gray-800 bg-white" />
            )}
            <div>
              <p className="text-white font-semibold truncate mb-1">{fileName}</p>
              <p className="text-gray-400 text-sm mb-4">
                {formatBytes(origBytes)} · {dims.w}×{dims.h}px · {frames.length} frames · {(totalMs / 1000).toFixed(1)}s
              </p>
              <p className="text-xs mb-4">
                <span className="inline-block bg-cyan-950/60 border border-cyan-800 text-cyan-300 px-2.5 py-1 rounded-full">
                  Encoder: {encoderLabel}
                </span>
              </p>

              {/* Manual settings */}
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <label className="block">
                  <span className="text-gray-400 text-xs font-medium block mb-1.5">Framerate</span>
                  <select value={fpsMode} onChange={(e) => setFpsMode(e.target.value as 'auto' | '15' | '24' | '30')}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none">
                    <option value="auto">Auto (from GIF timing)</option>
                    <option value="15">15 fps</option>
                    <option value="24">24 fps</option>
                    <option value="30">30 fps</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-gray-400 text-xs font-medium block mb-1.5">Quality</span>
                  <select value={quality} onChange={(e) => setQuality(e.target.value as 'small' | 'balanced' | 'high')}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none">
                    <option value="small">Smaller file</option>
                    <option value="balanced">Balanced</option>
                    <option value="high">Higher quality</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-gray-400 text-xs font-medium block mb-1.5">Transparency background</span>
                  <select value={bg} onChange={(e) => setBg(e.target.value as 'white' | 'black')}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none">
                    <option value="white">White (MP4 has no transparency)</option>
                    <option value="black">Black</option>
                  </select>
                </label>
              </div>

              {status === 'encoding' ? (
                <div>
                  <p className="text-white font-semibold mb-2">Encoding video… {progress}%</p>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => void handleConvert()}
                    className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold px-6 py-3 rounded-xl transition">
                    Convert to {encoderKind === 'mediarecorder-webm' ? 'WebM' : 'MP4'}
                  </button>
                  <button onClick={reset} className="border border-gray-700 hover:border-gray-500 text-gray-300 px-6 py-3 rounded-xl transition">
                    Choose another file
                  </button>
                </div>
              )}
              {error && status === 'ready' && <p className="mt-4 text-red-400 text-sm">{error}</p>}
            </div>
          </div>
        </div>
      )}

      {status === 'done' && outUrl && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8">
          <h3 className="text-white font-bold text-xl mb-4">Your {outExt.toUpperCase()} is ready</h3>
          <video src={outUrl} controls loop playsInline className="w-full max-w-md rounded-xl border border-gray-800 mb-6 bg-black" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Original {kind.toUpperCase()}</p>
              <p className="text-white font-bold">{formatBytes(origBytes)}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Converted {outExt.toUpperCase()}</p>
              <p className="text-white font-bold">{formatBytes(outBytes)}</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Size change</p>
              <p className={`font-bold ${savedPct >= 0 ? 'text-green-400' : 'text-amber-400'}`}>
                {savedPct >= 0 ? `−${savedPct}% smaller` : `+${-savedPct}% larger`}
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Video</p>
              <p className="text-white font-bold">{dims.w}×{dims.h} · {outFps} fps · {(outDurationMs / 1000).toFixed(1)}s</p>
            </div>
          </div>
          {sampled && (
            <p className="text-amber-400/90 text-xs mb-4">Note: this animation had more than {MAX_ENCODE_FRAMES} frames, so frames were evenly sampled down for encoding.</p>
          )}
          {savedPct < 0 && (
            <p className="text-gray-500 text-xs mb-4">The output is larger because this {kind.toUpperCase()} was already tiny — try \u201cSmaller file\u201d quality or a lower framerate.</p>
          )}
          <div className="flex flex-wrap gap-3">
            <button onClick={download} className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold px-6 py-3 rounded-xl transition">
              Download .{outExt}
            </button>
            <button onClick={reset} className="border border-gray-700 hover:border-gray-500 text-gray-300 px-6 py-3 rounded-xl transition">
              Convert another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GifToMp4Tool;
