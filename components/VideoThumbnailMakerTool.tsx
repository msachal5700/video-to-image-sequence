import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Loader2, Download, Type, Square, Circle as CircleIcon, MoveUpRight, Trash2, ArrowLeft, Check, Play, Pause, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Dropzone from './Dropzone';
import { useToast } from './Toast';

const CANVAS_W = 1280;
const CANVAS_H = 720;
const FRAME_STEP = 1 / 30;

type TextOverlay = {
  id: string; kind: 'text';
  x: number; y: number;
  text: string; fontSize: number; color: string; font: string;
  bold: boolean; outline: boolean;
};
type ShapeOverlay = {
  id: string; kind: 'rect' | 'circle' | 'arrow';
  x: number; y: number; w: number; h: number;
  color: string; thickness: number;
};
type Overlay = TextOverlay | ShapeOverlay;

const FONTS = ['Impact', 'Arial Black', 'Verdana', 'Trebuchet MS', 'Georgia', 'Courier New'];
const SWATCHES = ['#ffffff', '#000000', '#facc15', '#ef4444', '#22d3ee', '#22c55e', '#f97316', '#a855f7'];

let overlaySeq = 0;
const nextId = () => `ov-${Date.now()}-${overlaySeq++}`;

function isLight(hex: string): boolean {
  const h = hex.replace('#', '');
  if (h.length < 6) return true;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.6;
}

function fontOf(o: TextOverlay): string {
  return `${o.bold ? '900' : '400'} ${o.fontSize}px "${o.font}", sans-serif`;
}

/** Draw the captured frame cover-filling a 1280x720 ctx. */
function drawCover(ctx: CanvasRenderingContext2D, frame: HTMLCanvasElement) {
  const scale = Math.max(CANVAS_W / frame.width, CANVAS_H / frame.height);
  const dw = frame.width * scale;
  const dh = frame.height * scale;
  ctx.drawImage(frame, (CANVAS_W - dw) / 2, (CANVAS_H - dh) / 2, dw, dh);
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, thickness: number) {
  const headLen = Math.max(18, thickness * 2.2);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = thickness;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 7), y2 - headLen * Math.sin(angle - Math.PI / 7));
  ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 7), y2 - headLen * Math.sin(angle + Math.PI / 7));
  ctx.closePath();
  ctx.fill();
}

function drawOverlay(ctx: CanvasRenderingContext2D, o: Overlay, selected: boolean) {
  if (o.kind === 'text') {
    ctx.font = fontOf(o);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (o.outline) {
      ctx.lineWidth = Math.max(2, o.fontSize / 12);
      ctx.strokeStyle = isLight(o.color) ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)';
      ctx.strokeText(o.text, o.x, o.y);
    }
    ctx.fillStyle = o.color;
    ctx.fillText(o.text, o.x, o.y);
  } else if (o.kind === 'rect') {
    ctx.strokeStyle = o.color;
    ctx.lineWidth = o.thickness;
    ctx.strokeRect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h);
  } else if (o.kind === 'circle') {
    ctx.strokeStyle = o.color;
    ctx.lineWidth = o.thickness;
    ctx.beginPath();
    ctx.ellipse(o.x, o.y, o.w / 2, o.h / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    drawArrow(ctx, o.x, o.y, o.x + o.w, o.y + o.h, o.color, o.thickness);
  }
  if (selected) {
    const b = overlayBounds(ctx, o);
    ctx.save();
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(b.x - 6, b.y - 6, b.w + 12, b.h + 12);
    ctx.restore();
  }
}

function overlayBounds(ctx: CanvasRenderingContext2D, o: Overlay): { x: number; y: number; w: number; h: number } {
  if (o.kind === 'text') {
    ctx.font = fontOf(o);
    const w = Math.max(20, ctx.measureText(o.text || ' ').width);
    const h = o.fontSize * 1.25;
    return { x: o.x - w / 2, y: o.y - h / 2, w, h };
  }
  if (o.kind === 'arrow') {
    const x = Math.min(o.x, o.x + o.w);
    const y = Math.min(o.y, o.y + o.h);
    return { x, y, w: Math.abs(o.w), h: Math.max(Math.abs(o.h), o.thickness * 2) };
  }
  return { x: o.x - o.w / 2, y: o.y - o.h / 2, w: o.w, h: o.h };
}

function renderComposition(ctx: CanvasRenderingContext2D, frame: HTMLCanvasElement, overlays: Overlay[], selectedId: string | null) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  drawCover(ctx, frame);
  overlays.forEach((o) => drawOverlay(ctx, o, o.id === selectedId));
}

function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onSeeked = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error('Could not seek to that moment.')); };
    const cleanup = () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
    };
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    video.currentTime = Math.min(Math.max(time, 0), Math.max(video.duration - 0.05, 0));
  });
}

const TEMPLATES: { name: string; desc: string; make: () => Overlay[] }[] = [
  {
    name: 'Bold Title',
    desc: 'Big headline + subtitle',
    make: () => [
      { id: nextId(), kind: 'text', x: 640, y: 150, text: 'YOUR TITLE', fontSize: 110, color: '#ffffff', font: 'Impact', bold: true, outline: true },
      { id: nextId(), kind: 'text', x: 640, y: 590, text: 'SUBTITLE HERE', fontSize: 52, color: '#facc15', font: 'Arial Black', bold: true, outline: true },
    ],
  },
  {
    name: 'Arrow + Circle',
    desc: 'Highlight the key detail',
    make: () => [
      { id: nextId(), kind: 'circle', x: 900, y: 340, w: 300, h: 300, color: '#ef4444', thickness: 14 },
      { id: nextId(), kind: 'arrow', x: 400, y: 540, w: 330, h: -120, color: '#ef4444', thickness: 16 },
    ],
  },
  {
    name: 'Lower Third',
    desc: 'Clean caption bar text',
    make: () => [
      { id: nextId(), kind: 'text', x: 320, y: 620, text: 'YOUR TEXT HERE', fontSize: 60, color: '#ffffff', font: 'Verdana', bold: true, outline: true },
    ],
  },
];

const VideoThumbnailMakerTool: React.FC = () => {
  const { showToast } = useToast();
  const [step, setStep] = useState<'upload' | 'pick' | 'edit'>('upload');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [videoW, setVideoW] = useState(0);
  const [videoH, setVideoH] = useState(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState<HTMLCanvasElement | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [format, setFormat] = useState<'jpg' | 'png'>('jpg');
  const [exporting, setExporting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const overlaysRef = useRef<Overlay[]>([]);
  overlaysRef.current = overlays;

  useEffect(() => {
    return () => { if (videoUrl) URL.revokeObjectURL(videoUrl); };
  }, [videoUrl]);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) {
      showToast('Please choose a video file (MP4, MOV, or WEBM).', 'error');
      return;
    }
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setOverlays([]);
    setSelectedId(null);
    setFrame(null);
    setTime(0);
    setStep('pick');
  }, [showToast, videoUrl]);

  const onVideoMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration || 0);
    setVideoW(v.videoWidth || 0);
    setVideoH(v.videoHeight || 0);
  }, []);

  const onTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (v && !v.paused) setTime(v.currentTime);
  }, []);

  const stepFrame = useCallback((dir: 1 | -1) => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setPlaying(false);
    const nt = Math.min(Math.max(v.currentTime + dir * FRAME_STEP, 0), Math.max(v.duration - 0.05, 0));
    v.currentTime = nt;
    setTime(nt);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => undefined); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }, []);

  const handleUseFrame = useCallback(async () => {
    const v = videoRef.current;
    if (!v || capturing) return;
    setCapturing(true);
    try {
      v.pause();
      setPlaying(false);
      await seekVideo(v, time);
      const c = document.createElement('canvas');
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      const ctx = c.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported in this browser.');
      ctx.drawImage(v, 0, 0);
      setFrame(c);
      setStep('edit');
      showToast('Frame captured — now design your thumbnail.', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Could not capture that frame.', 'error');
    } finally {
      setCapturing(false);
    }
  }, [time, capturing, showToast]);

  // Redraw editor canvas whenever frame/overlays/selection change
  useEffect(() => {
    const canvas = canvasRef.current;
    const fr = frame;
    if (!canvas || !fr || step !== 'edit') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    renderComposition(ctx, fr, overlaysRef.current, selectedId);
  });

  const canvasPos = (e: React.PointerEvent): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_H,
    };
  };

  const hitTest = (x: number, y: number): Overlay | null => {
    const canvas = canvasRef.current;
    const fr = frame;
    if (!canvas || !fr) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    for (let i = overlaysRef.current.length - 1; i >= 0; i--) {
      const o = overlaysRef.current[i];
      const b = overlayBounds(ctx, o);
      if (x >= b.x - 8 && x <= b.x + b.w + 8 && y >= b.y - 8 && y <= b.y + b.h + 8) return o;
    }
    return null;
  };

  const onCanvasPointerDown = (e: React.PointerEvent) => {
    const p = canvasPos(e);
    const hit = hitTest(p.x, p.y);
    if (hit) {
      setSelectedId(hit.id);
      dragRef.current = { id: hit.id, dx: p.x - hit.x, dy: p.y - hit.y };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } else {
      setSelectedId(null);
    }
  };

  const onCanvasPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const p = canvasPos(e);
    setOverlays((prev) => prev.map((o) =>
      o.id === drag.id ? { ...o, x: Math.round(p.x - drag.dx), y: Math.round(p.y - drag.dy) } : o
    ));
  };

  const onCanvasPointerUp = () => { dragRef.current = null; };

  const addText = useCallback(() => {
    const o: TextOverlay = {
      id: nextId(), kind: 'text', x: 640, y: 360,
      text: 'YOUR TEXT', fontSize: 84, color: '#ffffff',
      font: 'Impact', bold: true, outline: true,
    };
    setOverlays((p) => [...p, o]);
    setSelectedId(o.id);
  }, []);

  const addShape = useCallback((kind: 'rect' | 'circle' | 'arrow') => {
    const o: ShapeOverlay = kind === 'arrow'
      ? { id: nextId(), kind, x: 440, y: 480, w: 320, h: -140, color: '#ef4444', thickness: 16 }
      : { id: nextId(), kind, x: 640, y: 360, w: 340, h: 220, color: '#ef4444', thickness: 12 };
    setOverlays((p) => [...p, o]);
    setSelectedId(o.id);
  }, []);

  const applyTemplate = useCallback((idx: number) => {
    const made = TEMPLATES[idx].make();
    setOverlays(made);
    setSelectedId(made[0]?.id ?? null);
    showToast(`"${TEMPLATES[idx].name}" template applied — drag elements to position them.`, 'success');
  }, [showToast]);

  const updateSelected = useCallback((patch: Partial<TextOverlay> & Partial<ShapeOverlay>) => {
    setOverlays((prev) => prev.map((o) => (o.id === selectedId ? { ...o, ...patch } : o)));
  }, [selectedId]);

  const deleteSelected = useCallback(() => {
    setOverlays((prev) => prev.filter((o) => o.id !== selectedId));
    setSelectedId(null);
  }, [selectedId]);

  const handleExport = useCallback(() => {
    if (!frame || exporting) return;
    setExporting(true);
    try {
      const c = document.createElement('canvas');
      c.width = CANVAS_W;
      c.height = CANVAS_H;
      const ctx = c.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported in this browser.');
      renderComposition(ctx, frame, overlaysRef.current, null);
      const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
      c.toBlob((blob) => {
        setExporting(false);
        if (!blob) { showToast('Export failed — please try again.', 'error'); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `youtube-thumbnail-1280x720.${format === 'jpg' ? 'jpg' : 'png'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        showToast('Thumbnail exported at 1280×720.', 'success');
      }, mime, 0.92);
    } catch (e) {
      setExporting(false);
      showToast(e instanceof Error ? e.message : 'Export failed.', 'error');
    }
  }, [frame, format, exporting, showToast]);

  const selected = overlays.find((o) => o.id === selectedId) ?? null;
  const fmtTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    const ms = Math.floor((t % 1) * 100);
    return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 text-xs sm:text-sm">
        {['Upload video', 'Pick a frame', 'Design & export'].map((label, i) => {
          const idx = ['upload', 'pick', 'edit'][i];
          const active = step === idx;
          const done = ['upload', 'pick', 'edit'].indexOf(step) > i;
          return (
            <div key={label} className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${active ? 'bg-cyan-500 text-gray-950' : done ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500' : 'bg-gray-900 text-gray-600 border border-gray-800'}`}>
                {done ? <Check size={14} /> : i + 1}
              </span>
              <span className={active ? 'text-white font-semibold' : 'text-gray-500'}>{label}</span>
              {i < 2 && <span className="w-6 sm:w-10 h-px bg-gray-800" />}
            </div>
          );
        })}
      </div>

      {step === 'upload' && (
        <div className="max-w-2xl mx-auto">
          <Dropzone onFileSelect={handleFileSelect} />
          <p className="text-center text-gray-600 text-xs mt-4">
            MP4, MOV, or WEBM. Your video never leaves your device — everything runs in your browser.
          </p>
        </div>
      )}

      {step === 'pick' && videoUrl && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 md:p-6">
            <div className="rounded-xl overflow-hidden bg-black mb-4">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full max-h-[420px]"
                preload="auto"
                playsInline
                onLoadedMetadata={onVideoMetadata}
                onTimeUpdate={onTimeUpdate}
                onEnded={() => setPlaying(false)}
              />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-cyan-500/15 border border-cyan-500/60 text-cyan-300 flex items-center justify-center hover:bg-cyan-500/30 transition" aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button onClick={() => stepFrame(-1)} className="w-9 h-9 rounded-full bg-gray-800 text-gray-300 flex items-center justify-center hover:bg-gray-700 transition" aria-label="Previous frame" title="Previous frame">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => stepFrame(1)} className="w-9 h-9 rounded-full bg-gray-800 text-gray-300 flex items-center justify-center hover:bg-gray-700 transition" aria-label="Next frame" title="Next frame">
                <ChevronRight size={16} />
              </button>
              <input
                type="range"
                min={0}
                max={Math.max(duration, 0.01)}
                step={0.01}
                value={Math.min(time, duration)}
                onChange={(e) => {
                  const v = videoRef.current;
                  const nt = parseFloat(e.target.value);
                  if (v) { v.pause(); setPlaying(false); v.currentTime = nt; }
                  setTime(nt);
                }}
                className="flex-1 accent-cyan-500"
                aria-label="Scrub video"
              />
              <span className="text-gray-400 text-xs font-mono whitespace-nowrap">{fmtTime(time)} / {fmtTime(duration)}</span>
            </div>
            <p className="text-gray-600 text-xs mb-5">
              {videoW > 0 && `${videoW}×${videoH} · `}Scrub or step frame-by-frame to the exact moment, then capture it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { setStep('upload'); }}
                className="px-5 py-3 rounded-xl border border-gray-700 text-gray-300 font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Choose different video
              </button>
              <button
                onClick={handleUseFrame}
                disabled={capturing}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-gray-950 font-bold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {capturing ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {capturing ? 'Capturing…' : 'Use this frame'}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'edit' && frame && (
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_320px] gap-5">
            {/* Canvas */}
            <div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 md:p-5">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_W}
                  height={CANVAS_H}
                  onPointerDown={onCanvasPointerDown}
                  onPointerMove={onCanvasPointerMove}
                  onPointerUp={onCanvasPointerUp}
                  onPointerLeave={onCanvasPointerUp}
                  className="w-full rounded-xl cursor-move bg-black"
                  style={{ touchAction: 'none', aspectRatio: '16 / 9' }}
                />
                <p className="text-gray-600 text-xs mt-3 text-center">
                  Click an element to select it, then drag to move. Canvas is exactly 1280 × 720 — YouTube thumbnail size.
                </p>
              </div>
              {/* Export bar */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 md:p-5 mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex rounded-xl overflow-hidden border border-gray-700">
                  {(['jpg', 'png'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`px-5 py-2.5 text-sm font-bold uppercase ${format === f ? 'bg-cyan-500 text-gray-950' : 'bg-gray-950 text-gray-400 hover:text-white'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setStep('pick')}
                  className="px-5 py-3 rounded-xl border border-gray-700 text-gray-300 font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} /> Pick another frame
                </button>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-gray-950 font-bold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  {exporting ? 'Exporting…' : 'Download 1280 × 720 thumbnail'}
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Add elements */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-3 text-sm">Add elements</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={addText} className="flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium px-3 py-2.5 rounded-xl transition">
                    <Type size={15} /> Text
                  </button>
                  <button onClick={() => addShape('rect')} className="flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium px-3 py-2.5 rounded-xl transition">
                    <Square size={15} /> Box
                  </button>
                  <button onClick={() => addShape('circle')} className="flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium px-3 py-2.5 rounded-xl transition">
                    <CircleIcon size={15} /> Circle
                  </button>
                  <button onClick={() => addShape('arrow')} className="flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium px-3 py-2.5 rounded-xl transition">
                    <MoveUpRight size={15} /> Arrow
                  </button>
                </div>
              </div>

              {/* Templates */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-1.5">
                  <Sparkles size={14} className="text-cyan-400" /> Starter templates
                </h3>
                <div className="space-y-2">
                  {TEMPLATES.map((t, i) => (
                    <button key={t.name} onClick={() => applyTemplate(i)} className="w-full text-left bg-gray-800 hover:bg-gray-700 rounded-xl px-4 py-2.5 transition">
                      <span className="text-gray-100 text-sm font-semibold block">{t.name}</span>
                      <span className="text-gray-500 text-xs">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected element editor */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-3 text-sm">Selected element</h3>
                {!selected && <p className="text-gray-600 text-xs">Click any text or shape on the canvas to edit it here.</p>}
                {selected && selected.kind === 'text' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={selected.text}
                      onChange={(e) => updateSelected({ text: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                      placeholder="Text"
                    />
                    <div>
                      <label className="text-gray-500 text-xs block mb-1">Size: {selected.fontSize}px</label>
                      <input type="range" min={24} max={170} value={selected.fontSize} onChange={(e) => updateSelected({ fontSize: parseInt(e.target.value, 10) })} className="w-full accent-cyan-500" />
                    </div>
                    <div>
                      <label className="text-gray-500 text-xs block mb-1">Font</label>
                      <select value={selected.font} onChange={(e) => updateSelected({ font: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500">
                        {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-500 text-xs block mb-1">Color</label>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {SWATCHES.map((c) => (
                          <button key={c} onClick={() => updateSelected({ color: c })} className={`w-7 h-7 rounded-full border-2 ${selected.color === c ? 'border-cyan-400' : 'border-gray-700'}`} style={{ backgroundColor: c }} aria-label={c} />
                        ))}
                        <input type="color" value={selected.color} onChange={(e) => updateSelected({ color: e.target.value })} className="w-7 h-7 rounded-full bg-transparent cursor-pointer" aria-label="Custom color" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updateSelected({ bold: !selected.bold })} className={`flex-1 text-xs font-bold px-3 py-2 rounded-xl border transition ${selected.bold ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'border-gray-700 text-gray-400'}`}>Bold</button>
                      <button onClick={() => updateSelected({ outline: !selected.outline })} className={`flex-1 text-xs font-bold px-3 py-2 rounded-xl border transition ${selected.outline ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'border-gray-700 text-gray-400'}`}>Outline</button>
                    </div>
                    <button onClick={deleteSelected} className="w-full flex items-center justify-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-semibold px-3 py-2 rounded-xl border border-red-900/60 hover:border-red-700 transition">
                      <Trash2 size={13} /> Delete element
                    </button>
                  </div>
                )}
                {selected && selected.kind !== 'text' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-500 text-xs block mb-1">Color</label>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {SWATCHES.map((c) => (
                          <button key={c} onClick={() => updateSelected({ color: c })} className={`w-7 h-7 rounded-full border-2 ${selected.color === c ? 'border-cyan-400' : 'border-gray-700'}`} style={{ backgroundColor: c }} aria-label={c} />
                        ))}
                        <input type="color" value={selected.color} onChange={(e) => updateSelected({ color: e.target.value })} className="w-7 h-7 rounded-full bg-transparent cursor-pointer" aria-label="Custom color" />
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-500 text-xs block mb-1">Thickness: {selected.thickness}px</label>
                      <input type="range" min={4} max={40} value={selected.thickness} onChange={(e) => updateSelected({ thickness: parseInt(e.target.value, 10) })} className="w-full accent-cyan-500" />
                    </div>
                    <div>
                      <label className="text-gray-500 text-xs block mb-1">Width: {Math.abs(selected.w)}px</label>
                      <input type="range" min={40} max={900} value={Math.abs(selected.w)} onChange={(e) => updateSelected({ w: selected.w < 0 ? -parseInt(e.target.value, 10) : parseInt(e.target.value, 10) })} className="w-full accent-cyan-500" />
                    </div>
                    <div>
                      <label className="text-gray-500 text-xs block mb-1">Height: {Math.abs(selected.h)}px</label>
                      <input type="range" min={40} max={600} value={Math.abs(selected.h)} onChange={(e) => updateSelected({ h: selected.h < 0 ? -parseInt(e.target.value, 10) : parseInt(e.target.value, 10) })} className="w-full accent-cyan-500" />
                    </div>
                    <button onClick={deleteSelected} className="w-full flex items-center justify-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-semibold px-3 py-2 rounded-xl border border-red-900/60 hover:border-red-700 transition">
                      <Trash2 size={13} /> Delete element
                    </button>
                  </div>
                )}
              </div>

              {overlays.length > 0 && (
                <button onClick={() => { setOverlays([]); setSelectedId(null); }} className="w-full text-gray-500 hover:text-gray-300 text-xs font-medium py-2 transition">
                  Clear all elements
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoThumbnailMakerTool;
