import React, { useCallback, useEffect, useRef, useState } from 'react';
import JSZip from 'jszip';
import gifWorkerUrl from 'gif.js/dist/gif.worker.js?url';

type CamState = 'idle' | 'starting' | 'ready' | 'denied' | 'error';

interface Frame {
  id: number;
  url: string; // PNG data URL
}

const RESOLUTIONS = [
  { label: 'SD 640 × 480', w: 640, h: 480 },
  { label: 'HD 1280 × 720', w: 1280, h: 720 },
];

const StopMotionCaptureTool: React.FC = () => {
  const [camState, setCamState] = useState<CamState>('idle');
  const [frames, setFrames] = useState<Frame[]>([]);
  const [onionOpacity, setOnionOpacity] = useState(40);
  const [onionCount, setOnionCount] = useState(1); // 1 or 2 ghost frames
  const [showOnion, setShowOnion] = useState(true);
  const [resIndex, setResIndex] = useState(0);
  const [fps, setFps] = useState(8);
  const [playing, setPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);
  const [busy, setBusy] = useState<string | null>(null); // export label
  const [progress, setProgress] = useState(0);
  const [camError, setCamError] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const viewRef = useRef<HTMLCanvasElement>(null);
  const playRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const framesRef = useRef<Frame[]>([]);
  const ghostImgs = useRef<HTMLImageElement[]>([]);
  const idCounter = useRef(0);

  framesRef.current = frames;

  // ── Camera ──────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCamState('starting');
    setCamError('');
    try {
      const res = RESOLUTIONS[resIndex];
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: res.w }, height: { ideal: res.h }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamState('ready');
    } catch (e) {
      console.error('Camera failed:', e);
      const denied = e instanceof Error && (e.name === 'NotAllowedError' || e.name === 'SecurityError');
      setCamState(denied ? 'denied' : 'error');
      setCamError(denied
        ? 'Camera access was denied. Allow camera permission in your browser address bar and try again.'
        : 'Could not access a camera on this device. Check that a webcam is connected and no other app is using it.');
    }
  }, [resIndex]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamState('idle');
  }, []);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  // ── Live preview + onion skin render loop ───────────────
  useEffect(() => {
    if (camState !== 'ready') return;
    let raf = 0;
    const render = () => {
      const video = videoRef.current;
      const canvas = viewRef.current;
      if (video && canvas && video.readyState >= 2) {
        const res = RESOLUTIONS[resIndex];
        if (canvas.width !== res.w) { canvas.width = res.w; canvas.height = res.h; }
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.globalAlpha = 1;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (showOnion && framesRef.current.length > 0) {
            const n = Math.min(onionCount, framesRef.current.length);
            for (let i = 0; i < n; i++) {
              const f = framesRef.current[framesRef.current.length - 1 - i];
              const img = ghostImgs.current.find(g => g.dataset.fid === String(f.id));
              if (img && img.complete && img.naturalWidth > 0) {
                ctx.globalAlpha = onionOpacity / 100 / (i + 1);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              }
            }
            ctx.globalAlpha = 1;
          }
        }
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [camState, resIndex, showOnion, onionOpacity, onionCount]);

  // Keep ghost image cache in sync with frames
  useEffect(() => {
    const ids = new Set(frames.map(f => String(f.id)));
    ghostImgs.current = ghostImgs.current.filter(g => ids.has(g.dataset.fid || ''));
    for (const f of frames) {
      if (!ghostImgs.current.some(g => g.dataset.fid === String(f.id))) {
        const img = new Image();
        img.dataset.fid = String(f.id);
        img.src = f.url;
        ghostImgs.current.push(img);
      }
    }
  }, [frames]);

  // ── Capture ─────────────────────────────────────────────
  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;
    const res = RESOLUTIONS[resIndex];
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || res.w;
    canvas.height = video.videoHeight || res.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL('image/png');
    idCounter.current += 1;
    setFrames(prev => [...prev, { id: idCounter.current, url }]);
  }, [resIndex]);

  // Spacebar shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && camState === 'ready') {
        const tag = (document.activeElement?.tagName || '').toLowerCase();
        if (tag !== 'input' && tag !== 'textarea' && tag !== 'button') {
          e.preventDefault();
          captureFrame();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [camState, captureFrame]);

  const deleteFrame = (id: number) => setFrames(prev => prev.filter(f => f.id !== id));
  const moveFrame = (id: number, dir: -1 | 1) => {
    setFrames(prev => {
      const i = prev.findIndex(f => f.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };
  const clearAll = () => { setFrames([]); setPlaying(false); };

  // ── Playback preview ────────────────────────────────────
  useEffect(() => {
    if (!playing || frames.length === 0) return;
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % frames.length;
      setPlayIndex(idx);
      const canvas = playRef.current;
      const img = ghostImgs.current.find(g => g.dataset.fid === String(frames[idx].id));
      if (canvas && img && img.complete) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (canvas.width !== img.naturalWidth) { canvas.width = img.naturalWidth; canvas.height = img.naturalHeight; }
          ctx.drawImage(img, 0, 0);
        }
      }
    }, Math.round(1000 / fps));
    return () => clearInterval(timer);
  }, [playing, frames, fps]);

  // Draw first frame when not playing
  useEffect(() => {
    if (playing || frames.length === 0) return;
    const canvas = playRef.current;
    const img = ghostImgs.current.find(g => g.dataset.fid === String(frames[0].id));
    if (canvas && img) {
      const draw = () => {
        if (!img.complete || img.naturalWidth === 0) return;
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        ctx?.drawImage(img, 0, 0);
      };
      if (img.complete) draw(); else img.onload = draw;
    }
    setPlayIndex(0);
  }, [frames, playing]);

  const dataUrlToBitmap = async (url: string): Promise<ImageBitmap> => {
    const blob = await (await fetch(url)).blob();
    return createImageBitmap(blob);
  };

  const download = (blob: Blob, name: string) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
  };

  // ── Export: GIF ─────────────────────────────────────────
  const exportGif = async () => {
    if (frames.length === 0) return;
    setBusy('Encoding GIF…'); setProgress(0);
    try {
      const { default: GIF } = await import('gif.js');
      const first = await dataUrlToBitmap(frames[0].url);
      const w = first.width, h = first.height;
      const gif = new GIF({ workers: 2, quality: 10, width: w, height: h, workerScript: gifWorkerUrl, repeat: 0 });
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      for (const f of frames) {
        const bm = await dataUrlToBitmap(f.url);
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(bm, 0, 0, w, h);
        bm.close();
        gif.addFrame(ctx, { copy: true, delay: Math.round(1000 / fps) });
      }
      first.close();
      gif.on('progress', (p: number) => setProgress(Math.round(p * 100)));
      const blob: Blob = await new Promise((resolve, reject) => {
        gif.on('finished', resolve);
        try { gif.render(); } catch (e) { reject(e); }
      });
      download(blob, 'stop-motion.gif');
    } catch (e) {
      console.error(e);
      alert('GIF export failed. Try fewer frames or a smaller resolution.');
    } finally {
      setBusy(null); setProgress(0);
    }
  };

  // ── Export: WebM ────────────────────────────────────────
  const exportWebm = async () => {
    if (frames.length === 0) return;
    setBusy('Recording WebM…'); setProgress(0);
    try {
      const first = await dataUrlToBitmap(frames[0].url);
      const w = first.width, h = first.height; first.close();
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      const stream = canvas.captureStream(fps);
      const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(m => {
        try { return MediaRecorder.isTypeSupported(m); } catch { return false; }
      }) || '';
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 5_000_000 } : undefined);
      const chunks: Blob[] = [];
      rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      const done = new Promise<Blob>(resolve => { rec.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' })); });
      rec.start();
      for (let i = 0; i < frames.length; i++) {
        const bm = await dataUrlToBitmap(frames[i].url);
        ctx.drawImage(bm, 0, 0, w, h);
        bm.close();
        setProgress(Math.round(((i + 1) / frames.length) * 100));
        await new Promise(r => setTimeout(r, Math.round(1000 / fps)));
      }
      // hold last frame briefly so the tail isn't cut
      await new Promise(r => setTimeout(r, Math.round(1000 / fps)));
      rec.stop();
      const blob = await done;
      download(blob, 'stop-motion.webm');
    } catch (e) {
      console.error(e);
      alert('WebM export failed in this browser. Try the GIF export instead.');
    } finally {
      setBusy(null); setProgress(0);
    }
  };

  // ── Export: ZIP of PNGs ─────────────────────────────────
  const exportZip = async () => {
    if (frames.length === 0) return;
    setBusy('Building ZIP…');
    try {
      const zip = new JSZip();
      for (let i = 0; i < frames.length; i++) {
        const blob = await (await fetch(frames[i].url)).blob();
        zip.file(`frame-${String(i + 1).padStart(4, '0')}.png`, blob);
      }
      const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
      download(blob, 'stop-motion-frames.zip');
    } catch (e) {
      console.error(e);
      alert('ZIP export failed.');
    } finally {
      setBusy(null);
    }
  };

  const res = RESOLUTIONS[resIndex];

  return (
    <div className="w-full max-w-5xl mx-auto font-sans">
      {/* Privacy note */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3 mb-6 text-sm text-gray-400 flex gap-2 items-start">
        <span className="text-cyan-400 mt-0.5">🔒</span>
        <span><strong className="text-white">100% private:</strong> your camera feed is processed entirely in this browser tab. No video or image ever leaves your device — there is no server upload, no account, and nothing is recorded without you pressing capture.</span>
      </div>

      {/* Hidden video element — always mounted so the camera stream has a target
          the moment permission is granted (it is NOT inside the conditional below). */}
      <video ref={videoRef} playsInline muted className="hidden" aria-hidden="true" />

      {camState === 'idle' || camState === 'starting' || camState === 'denied' || camState === 'error' ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
          <div className="text-5xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-white mb-2 font-display">Start your stop-motion studio</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Allow camera access and capture frame-by-frame animation with onion-skin ghosting — perfect for claymation, LEGO films, and classroom projects.
          </p>
          <div className="flex justify-center gap-3 mb-6">
            {RESOLUTIONS.map((r, i) => (
              <button
                key={r.label}
                onClick={() => setResIndex(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${i === resIndex ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            onClick={startCamera}
            disabled={camState === 'starting'}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-gray-950 font-bold px-8 py-3 rounded-xl transition"
          >
            {camState === 'starting' ? 'Requesting camera…' : '📷 Enable Camera'}
          </button>
          {camError && <p className="text-red-400 text-sm mt-4 max-w-md mx-auto">{camError}</p>}
          {(camState === 'denied' || camState === 'error') && (
            <button onClick={startCamera} className="mt-3 text-cyan-400 text-sm hover:underline">Try again</button>
          )}
          <p className="text-gray-600 text-xs mt-6">Works in Chrome, Edge, Firefox, and Safari on desktop and mobile. Requires HTTPS (this site) and a webcam.</p>
        </div>
      ) : (
        <div>
          {/* Live preview + onion skin */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="text-white font-semibold">Live camera — onion skin {showOnion && frames.length > 0 ? 'ON' : 'OFF'}</h2>
              <button onClick={stopCamera} className="text-xs text-gray-500 hover:text-red-400 transition">Stop camera</button>
            </div>
            <canvas ref={viewRef} className="w-full rounded-xl bg-black" />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={showOnion} onChange={e => setShowOnion(e.target.checked)} className="accent-cyan-500 w-4 h-4" />
                Onion skin
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                Ghost opacity
                <input type="range" min={5} max={80} value={onionOpacity} onChange={e => setOnionOpacity(Number(e.target.value))} className="accent-cyan-500 w-28" disabled={!showOnion} />
                <span className="text-gray-500 w-10">{onionOpacity}%</span>
              </label>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                Ghost frames
                {[1, 2].map(n => (
                  <button key={n} onClick={() => setOnionCount(n)} className={`px-3 py-1 rounded-lg border text-xs font-medium transition ${onionCount === n ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'border-gray-700 text-gray-400'}`}>{n}</button>
                ))}
              </div>
            </div>
            <button
              onClick={captureFrame}
              className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-lg py-4 rounded-xl transition active:scale-[0.99]"
            >
              ⏺ Capture Frame <span className="text-sm font-normal opacity-70">(or press Space)</span>
            </button>
            <p className="text-center text-gray-500 text-xs mt-2">{frames.length} frame{frames.length === 1 ? '' : 's'} captured</p>
          </div>

          {/* Filmstrip */}
          {frames.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold">Filmstrip</h2>
                <button onClick={clearAll} className="text-xs text-gray-500 hover:text-red-400 transition">Clear all</button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {frames.map((f, i) => (
                  <div key={f.id} className="relative shrink-0 w-32 group">
                    <img src={f.url} alt={`Frame ${i + 1}`} className="w-32 h-auto rounded-lg border border-gray-700" />
                    <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">{i + 1}</span>
                    <div className="flex gap-1 mt-1">
                      <button onClick={() => moveFrame(f.id, -1)} disabled={i === 0} className="flex-1 text-[10px] bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-gray-300 rounded py-1" title="Move left">◀</button>
                      <button onClick={() => moveFrame(f.id, 1)} disabled={i === frames.length - 1} className="flex-1 text-[10px] bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-gray-300 rounded py-1" title="Move right">▶</button>
                      <button onClick={() => deleteFrame(f.id)} className="flex-1 text-[10px] bg-gray-800 hover:bg-red-900 text-gray-300 hover:text-red-300 rounded py-1" title="Delete">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playback preview */}
          {frames.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4">
              <h2 className="text-white font-semibold mb-3">Playback preview</h2>
              <canvas ref={playRef} className="w-full max-h-80 object-contain rounded-xl bg-black mx-auto block" />
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4">
                <button
                  onClick={() => setPlaying(p => !p)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold px-6 py-2 rounded-xl transition"
                >
                  {playing ? '⏸ Pause' : '▶ Play'}
                </button>
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  Playback speed
                  <input type="range" min={1} max={24} value={fps} onChange={e => setFps(Number(e.target.value))} className="accent-cyan-500 w-32" />
                  <span className="text-gray-500 w-14">{fps} fps</span>
                </label>
                <span className="text-xs text-gray-500">≈ {(frames.length / fps).toFixed(1)}s at {frames.length} frames</span>
              </div>
            </div>
          )}

          {/* Export */}
          {frames.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <h2 className="text-white font-semibold mb-3">Export your animation</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onClick={exportGif} disabled={!!busy} className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                  🎞 Animated GIF
                </button>
                <button onClick={exportWebm} disabled={!!busy} className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                  🎥 WebM Video
                </button>
                <button onClick={exportZip} disabled={!!busy} className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                  🗜 ZIP of PNG Frames
                </button>
              </div>
              {busy && (
                <div className="mt-4">
                  <p className="text-sm text-cyan-400 mb-2">{busy} {progress > 0 && `${progress}%`}</p>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full transition-all" style={{ width: `${Math.max(progress, 4)}%` }} />
                  </div>
                </div>
              )}
              <p className="text-gray-600 text-xs mt-3">Exports use the playback speed you set above. GIFs stay small enough to share; WebM keeps full quality for YouTube.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StopMotionCaptureTool;
