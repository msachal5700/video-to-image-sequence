import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Upload, Image as ImageIcon, RotateCcw, RotateCw, ZoomIn, ZoomOut,
  Undo2, Redo2, Trash2, Check, X, Download, RefreshCw, Scissors, MousePointerClick
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { useToast } from '../components/Toast';

interface Pt { x: number; y: number; }
interface HistEntry { points: Pt[]; closed: boolean; rotation: number; }
type Phase = 'idle' | 'edit' | 'done';
type ExportFormat = 'png' | 'webp' | 'jpg';

const NODE_R = 7;          // node radius, display px
const HIT_NODE = 16;       // node hit radius, display px
const HIT_EDGE = 10;       // edge hit distance, display px
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;

const faqs = [
  {
    q: 'How do I crop an image into a custom shape?',
    a: 'Upload your image, then click anywhere on it to place points around the area you want to keep. Each click adds a draggable node; drag the nodes to reshape the boundary, click the first node (or press Enter) to close the shape, then hit "Apply Crop". Everything outside your shape is removed.'
  },
  {
    q: 'Is this freeform crop tool really free? Is there a watermark?',
    a: 'Yes — completely free, no watermark, no sign-up, and no usage limits. Your image is processed entirely in your browser, so there is nothing to pay for and no branding added to your cropped image.'
  },
  {
    q: 'Which image formats can I upload?',
    a: 'JPG, PNG, WebP, GIF, BMP, and AVIF all work as long as your browser can decode them — which covers every modern browser. The crop is always rendered at your image\u2019s original resolution.'
  },
  {
    q: 'How do I keep the background transparent after cropping?',
    a: 'Choose PNG or WebP when you export. Both formats preserve the transparent background outside your freeform shape. If you pick JPG, the area outside the shape is filled white instead, because JPG does not support transparency.'
  },
  {
    q: 'What is the difference between freeform crop and a normal crop?',
    a: 'A normal crop cuts a rectangle. Freeform crop lets you draw any polygon — circles, stars, silhouettes, product outlines — by placing and dragging points. The result keeps the exact irregular shape instead of forcing it into a box.'
  },
  {
    q: 'Is my image uploaded to a server?',
    a: 'No. Your image never leaves your device. The polygon editor, rotation, and export all run locally in your browser, so your photos stay 100% private.'
  }
];

function distToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax, dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

function pointInPolygon(x: number, y: number, pts: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i].x, yi = pts[i].y, xj = pts[j].x, yj = pts[j].y;
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/* ------------------------------------------------------------------ */
/*  The interactive freeform polygon crop tool                         */
/* ------------------------------------------------------------------ */
const ImageCropTool: React.FC = () => {
  const { showToast } = useToast();
  const [phase, setPhase] = useState<Phase>('idle');
  const [baseImg, setBaseImg] = useState<HTMLImageElement | null>(null);
  const [imgName, setImgName] = useState('cropped-image');
  const [rotation, setRotation] = useState(0);
  const [points, setPoints] = useState<Pt[]>([]);
  const [closed, setClosed] = useState(false);
  const [hist, setHist] = useState<{ entries: HistEntry[]; idx: number }>({ entries: [], idx: -1 });
  const [zoom, setZoom] = useState(1);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultDims, setResultDims] = useState<{ w: number; h: number } | null>(null);
  const [exporting, setExporting] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // transient interaction state (refs to avoid re-render churn)
  const dragRef = useRef<{ mode: 'node' | 'move' | null; idx: number; start: Pt; orig: Pt[] }>({ mode: null, idx: -1, start: { x: 0, y: 0 }, orig: [] });
  const mouseRef = useRef<Pt | null>(null);
  const hoverRef = useRef<'node' | 'edge' | 'inside' | 'new' | null>(null);
  const hoverNodeRef = useRef<number>(-1);

  /* Rotated bitmap derived from the original + rotation state */
  const workCanvas = useMemo(() => {
    if (!baseImg) return null;
    const r = ((rotation % 360) + 360) % 360;
    const c = document.createElement('canvas');
    if (r === 90 || r === 270) { c.width = baseImg.naturalHeight; c.height = baseImg.naturalWidth; }
    else { c.width = baseImg.naturalWidth; c.height = baseImg.naturalHeight; }
    const ctx = c.getContext('2d');
    if (!ctx) return null;
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate((r * Math.PI) / 180);
    ctx.drawImage(baseImg, -baseImg.naturalWidth / 2, -baseImg.naturalHeight / 2);
    return c;
  }, [baseImg, rotation]);

  const imgW = workCanvas?.width ?? 0;
  const imgH = workCanvas?.height ?? 0;

  const fitScale = (): number => {
    const wrapW = wrapRef.current?.clientWidth ?? 800;
    const maxH = Math.min(typeof window !== 'undefined' ? window.innerHeight * 0.72 : 700, 720);
    if (!imgW || !imgH) return 1;
    return Math.min(wrapW / imgW, maxH / imgH);
  };
  const scale = fitScale() * zoom;

  /* ---------------- history ---------------- */
  const pushHist = (pts: Pt[], cl: boolean, rot: number) => {
    setHist(s => {
      const entries = s.entries.slice(0, s.idx + 1);
      entries.push({ points: pts.map(p => ({ ...p })), closed: cl, rotation: rot });
      return { entries, idx: entries.length - 1 };
    });
  };
  const undo = () => {
    if (hist.idx <= 0) return;
    const e = hist.entries[hist.idx - 1];
    setPoints(e.points.map(p => ({ ...p })));
    setClosed(e.closed);
    setRotation(e.rotation);
    setHist({ ...hist, idx: hist.idx - 1 });
  };
  const redo = () => {
    if (hist.idx >= hist.entries.length - 1) return;
    const e = hist.entries[hist.idx + 1];
    setPoints(e.points.map(p => ({ ...p })));
    setClosed(e.closed);
    setRotation(e.rotation);
    setHist({ ...hist, idx: hist.idx + 1 });
  };

  /* ---------------- image loading ---------------- */
  const loadImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file (JPG, PNG, WebP, GIF, …).', 'error');
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setBaseImg(img);
      setImgName(file.name.replace(/\.[^.]+$/, '') || 'cropped-image');
      setPoints([]); setClosed(false); setRotation(0); setZoom(1);
      setHist({ entries: [{ points: [], closed: false, rotation: 0 }], idx: 0 });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(null); setResultDims(null);
      setPhase('edit');
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      showToast('Could not read that image. The file may be corrupted or unsupported.', 'error');
    };
    img.src = url;
  };

  const loadSample = async () => {
    try {
      const res = await fetch('/og-image.png');
      if (!res.ok) throw new Error('sample fetch failed');
      const blob = await res.blob();
      loadImageFile(new File([blob], 'sample-image.png', { type: 'image/png' }));
    } catch {
      showToast('Could not load the sample image. Please upload your own instead.', 'error');
    }
  };

  const resetAll = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null); setResultDims(null);
    setBaseImg(null); setPoints([]); setClosed(false);
    setRotation(0); setZoom(1);
    setHist({ entries: [], idx: -1 });
    setPhase('idle');
  };

  /* ---------------- canvas helpers ---------------- */
  const toImageCoords = (clientX: number, clientY: number): Pt => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: (clientX - rect.left) / scale, y: (clientY - rect.top) / scale };
  };

  type Hit = { kind: 'node'; idx: number } | { kind: 'close' } | { kind: 'edge'; idx: number } | { kind: 'inside' } | { kind: 'new' };
  const hitTest = (p: Pt): Hit => {
    const n = points.length;
    for (let i = 0; i < n; i++) {
      if (Math.hypot(p.x - points[i].x, p.y - points[i].y) * scale < HIT_NODE) {
        if (!closed && i === 0 && n >= 3) return { kind: 'close' };
        return { kind: 'node', idx: i };
      }
    }
    if (closed && n >= 3) {
      for (let i = 0; i < n; i++) {
        const a = points[i], b = points[(i + 1) % n];
        if (distToSegment(p.x, p.y, a.x, a.y, b.x, b.y) * scale < HIT_EDGE) return { kind: 'edge', idx: i };
      }
      if (pointInPolygon(p.x, p.y, points)) return { kind: 'inside' };
    }
    return { kind: 'new' };
  };

  const tracePath = (ctx: CanvasRenderingContext2D, pts: Pt[], s: number, closeIt: boolean) => {
    pts.forEach((p, i) => { const X = p.x * s, Y = p.y * s; if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); });
    if (closeIt && pts.length > 2) ctx.closePath();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const wc = workCanvas;
    if (!canvas || !wc) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const s = fitScale() * zoom;
    canvas.width = Math.max(1, Math.round(imgW * s));
    canvas.height = Math.max(1, Math.round(imgH * s));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(wc, 0, 0, canvas.width, canvas.height);

    if (points.length > 0) {
      // dim everything outside the polygon
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, canvas.height);
      tracePath(ctx, points, s, true);
      ctx.fillStyle = 'rgba(2,6,23,0.62)';
      ctx.fill('evenodd');
      ctx.restore();

      // subtle fill inside the selection
      ctx.save();
      ctx.beginPath();
      tracePath(ctx, points, s, true);
      ctx.fillStyle = 'rgba(34,211,238,0.07)';
      ctx.fill();
      ctx.restore();

      // outline: white base + cyan dashes
      ctx.save();
      ctx.beginPath();
      tracePath(ctx, points, s, closed);
      // rubber band to cursor while drawing
      if (!closed && mouseRef.current && points.length > 0) {
        ctx.moveTo(points[points.length - 1].x * s, points[points.length - 1].y * s);
        ctx.lineTo(mouseRef.current.x * s, mouseRef.current.y * s);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.95)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.setLineDash([7, 5]);
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // nodes
      points.forEach((p, i) => {
        const X = p.x * s, Y = p.y * s;
        const isFirst = i === 0 && !closed && points.length >= 3;
        const isHover = hoverNodeRef.current === i;
        ctx.beginPath();
        ctx.arc(X, Y, NODE_R + (isFirst ? 3 : 0) + (isHover ? 1.5 : 0), 0, Math.PI * 2);
        ctx.fillStyle = isFirst ? '#22d3ee' : '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = isFirst ? '#ffffff' : '#22d3ee';
        ctx.stroke();
      });
    }
  };

  useEffect(() => { draw(); });

  /* ---------------- pointer interaction ---------------- */
  const clampPt = (p: Pt): Pt => ({ x: Math.max(0, Math.min(imgW, p.x)), y: Math.max(0, Math.min(imgH, p.y)) });

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== 'edit' || !imgW) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = clampPt(toImageCoords(e.clientX, e.clientY));
    const hit = hitTest(p);
    const d = dragRef.current;

    if (!closed) {
      if (hit.kind === 'close') {
        const np = [...points];
        setPoints(np); setClosed(true);
        pushHist(np, true, rotation);
        showToast('Shape closed — drag nodes to refine, or Apply Crop.', 'success');
        return;
      }
      if (hit.kind === 'node') {
        d.mode = 'node'; d.idx = hit.idx; d.start = p; d.orig = points.map(q => ({ ...q }));
        hoverNodeRef.current = hit.idx;
        return;
      }
      // add a point and immediately let the user drag it into place
      const np = [...points, p];
      setPoints(np);
      d.mode = 'node'; d.idx = np.length - 1; d.start = p; d.orig = np.map(q => ({ ...q }));
      hoverNodeRef.current = np.length - 1;
      return;
    }

    // closed shape
    if (hit.kind === 'node') {
      d.mode = 'node'; d.idx = hit.idx; d.start = p; d.orig = points.map(q => ({ ...q }));
      hoverNodeRef.current = hit.idx;
    } else if (hit.kind === 'edge') {
      const np = [...points];
      np.splice(hit.idx + 1, 0, p);
      setPoints(np);
      d.mode = 'node'; d.idx = hit.idx + 1; d.start = p; d.orig = np.map(q => ({ ...q }));
      hoverNodeRef.current = hit.idx + 1;
    } else if (hit.kind === 'inside') {
      d.mode = 'move'; d.idx = -1; d.start = p; d.orig = points.map(q => ({ ...q }));
    } else {
      // start a brand-new shape (undo can bring the old one back)
      const np = [p];
      setPoints(np); setClosed(false);
      d.mode = 'node'; d.idx = 0; d.start = p; d.orig = np.map(q => ({ ...q }));
      hoverNodeRef.current = 0;
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== 'edit' || !imgW) return;
    const p = clampPt(toImageCoords(e.clientX, e.clientY));
    mouseRef.current = p;
    const d = dragRef.current;

    if (d.mode === 'node' && d.idx >= 0) {
      const np = d.orig.map(q => ({ ...q }));
      np[d.idx] = p;
      setPoints(np);
    } else if (d.mode === 'move') {
      let dx = p.x - d.start.x, dy = p.y - d.start.y;
      const xs = d.orig.map(q => q.x), ys = d.orig.map(q => q.y);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minY = Math.min(...ys), maxY = Math.max(...ys);
      dx = Math.max(-minX, Math.min(imgW - maxX, dx));
      dy = Math.max(-minY, Math.min(imgH - maxY, dy));
      setPoints(d.orig.map(q => ({ x: q.x + dx, y: q.y + dy })));
    } else {
      // hover cursor feedback
      const hit = hitTest(p);
      hoverRef.current = hit.kind === 'node' || hit.kind === 'close' ? 'node'
        : hit.kind === 'edge' ? 'edge'
        : hit.kind === 'inside' ? 'inside' : 'new';
      hoverNodeRef.current = hit.kind === 'node' ? hit.idx : -1;
      const cv = canvasRef.current;
      if (cv) cv.style.cursor = hoverRef.current === 'node' ? 'pointer'
        : hoverRef.current === 'edge' ? 'crosshair'
        : hoverRef.current === 'inside' ? 'move' : 'crosshair';
    }
    draw();
  };

  const endPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const d = dragRef.current;
    if (d.mode) {
      pushHist(points, closed, rotation);
      d.mode = null; d.idx = -1;
    }
    mouseRef.current = null;
    draw();
    void e;
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phase !== 'edit' || !closed || points.length === 0) return;
    const p = clampPt(toImageCoords(e.clientX, e.clientY));
    const hit = hitTest(p);
    if (hit.kind === 'node') {
      const np = points.filter((_, i) => i !== hit.idx);
      if (np.length < 3) {
        setPoints(np); setClosed(false);
        pushHist(np, false, rotation);
        showToast('Point removed — shape reopened. Add points to close it again.', 'success');
      } else {
        setPoints(np);
        pushHist(np, true, rotation);
      }
      hoverNodeRef.current = -1;
    }
  };

  /* ---------------- keyboard ---------------- */
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (phase !== 'edit') return;
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!closed && points.length >= 3) {
        setClosed(true); pushHist(points, true, rotation);
      } else if (closed) {
        void applyCrop('png');
      }
    } else if (e.key === 'Escape') {
      setPoints([]); setClosed(false);
      pushHist([], false, rotation);
      showToast('Crop cleared — click on the image to draw a new shape.', 'success');
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && hoverNodeRef.current >= 0 && points.length > 0) {
      e.preventDefault();
      const np = points.filter((_, i) => i !== hoverNodeRef.current);
      const stillClosed = closed && np.length >= 3;
      setPoints(np); setClosed(stillClosed);
      pushHist(np, stillClosed, rotation);
      hoverNodeRef.current = -1;
    } else if (e.key.startsWith('Arrow') && points.length > 0) {
      e.preventDefault();
      const step = e.shiftKey ? 10 : 2;
      const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
      const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
      const np = points.map((q, i) =>
        hoverNodeRef.current === i || hoverNodeRef.current < 0
          ? { x: Math.max(0, Math.min(imgW, q.x + dx)), y: Math.max(0, Math.min(imgH, q.y + dy)) }
          : q
      );
      setPoints(np);
      // commit nudge on keyup-ish: debounce via timeout is overkill; commit on blur/Enter instead —
      // simpler: commit immediately (each nudge is its own undo step feels noisy, so only commit
      // when the shape was previously untouched this keystroke burst — we accept per-press commits).
      pushHist(np, closed, rotation);
    }
  };

  /* ---------------- toolbar actions ---------------- */
  const rotateImg = (cw: boolean) => {
    if (!workCanvas) return;
    const w = workCanvas.width, h = workCanvas.height;
    const newRot = (rotation + (cw ? 90 : -90) + 360) % 360;
    const newPts = points.map(pt => cw ? { x: h - pt.y, y: pt.x } : { x: pt.y, y: w - pt.x });
    setRotation(newRot);
    setPoints(newPts);
    pushHist(newPts, closed, newRot);
  };

  const clearCrop = () => {
    setPoints([]); setClosed(false);
    pushHist([], false, rotation);
  };

  const closeShape = () => {
    if (points.length >= 3 && !closed) {
      setClosed(true);
      pushHist(points, true, rotation);
    }
  };

  /* ---------------- export ---------------- */
  const applyCrop = async (format: ExportFormat): Promise<void> => {
    if (!workCanvas || points.length < 3 || !closed) {
      showToast('Draw and close a shape first (at least 3 points).', 'error');
      return;
    }
    setExporting(true);
    try {
      const xs = points.map(p => p.x), ys = points.map(p => p.y);
      const minX = Math.max(0, Math.floor(Math.min(...xs)));
      const minY = Math.max(0, Math.floor(Math.min(...ys)));
      const maxX = Math.min(imgW, Math.ceil(Math.max(...xs)));
      const maxY = Math.min(imgH, Math.ceil(Math.max(...ys)));
      const w = maxX - minX, h = maxY - minY;
      if (w < 1 || h < 1) throw new Error('Crop area is too small.');

      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      if (!ctx) throw new Error('Canvas is not available in this browser.');
      if (format === 'jpg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h); }
      ctx.save();
      ctx.beginPath();
      points.forEach((p, i) => {
        const X = p.x - minX, Y = p.y - minY;
        if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      });
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(workCanvas, -minX, -minY);
      ctx.restore();

      const mime = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
      const blob = await new Promise<Blob | null>(res => c.toBlob(res, mime, 0.92));
      if (!blob) throw new Error('Export failed.');
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setResultDims({ w, h });
      setPhase('done');
      showToast('Cropped! Download it below.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not export the crop.', 'error');
    } finally {
      setExporting(false);
    }
  };

  const toolBarBtn =
    'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="w-full max-w-5xl mx-auto font-sans">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl shadow-black/50 p-1">
        {phase === 'idle' && (
          <div className="p-6 sm:p-10 bg-gray-900/50 rounded-2xl">
            <div
              role="button" tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={e => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) loadImageFile(f); }}
              className="border-2 border-dashed border-gray-700 hover:border-cyan-500 rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition bg-gray-950/40"
            >
              <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <p className="text-white text-lg font-semibold mb-2">Drop an image here or click to upload</p>
              <p className="text-gray-500 text-sm mb-6">JPG, PNG, WebP, GIF, BMP — processed 100% in your browser</p>
              <span className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-950 rounded-xl font-bold transition">Choose Image</span>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) loadImageFile(f); e.target.value = ''; }} />
            </div>
            <div className="text-center mt-6">
              <button onClick={loadSample}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-semibold border border-gray-700 transition">
                <ImageIcon className="w-4 h-4 text-cyan-400" /> Try with a sample image
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 mb-2">
              {[
                { icon: '✏️', t: 'Draw Any Shape', d: 'Click to place points anywhere — no rectangles, no boxes, no fixed ratios.' },
                { icon: '🔒', t: 'No Server Uploads', d: 'Your image never leaves your device. Everything runs in your browser.' },
                { icon: '🖼️', t: 'Transparent Export', d: 'Download the exact cutout as PNG or WebP with transparency.' },
              ].map(({ icon, t, d }) => (
                <div key={t} className="text-center space-y-2">
                  <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900 rounded-full flex items-center justify-center mx-auto text-xl">{icon}</div>
                  <h3 className="font-semibold text-white">{t}</h3>
                  <p className="text-sm text-gray-500">{d}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === 'edit' && (
          <div className="p-3 sm:p-6 bg-gray-900/50 rounded-2xl">
            {/* toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <button onClick={undo} disabled={hist.idx <= 0} title="Undo"
                className={`${toolBarBtn} bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700`}><Undo2 className="w-4 h-4" /></button>
              <button onClick={redo} disabled={hist.idx >= hist.entries.length - 1} title="Redo"
                className={`${toolBarBtn} bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700`}><Redo2 className="w-4 h-4" /></button>
              <span className="w-px h-6 bg-gray-800 mx-1" />
              <button onClick={() => rotateImg(false)} title="Rotate 90° left"
                className={`${toolBarBtn} bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700`}><RotateCcw className="w-4 h-4" /></button>
              <button onClick={() => rotateImg(true)} title="Rotate 90° right"
                className={`${toolBarBtn} bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700`}><RotateCw className="w-4 h-4" /></button>
              <span className="w-px h-6 bg-gray-800 mx-1" />
              <button onClick={() => setZoom(z => Math.max(MIN_ZOOM, +(z - 0.25).toFixed(2)))} disabled={zoom <= MIN_ZOOM} title="Zoom out"
                className={`${toolBarBtn} bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700`}><ZoomOut className="w-4 h-4" /></button>
              <span className="text-gray-500 text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(MAX_ZOOM, +(z + 0.25).toFixed(2)))} disabled={zoom >= MAX_ZOOM} title="Zoom in"
                className={`${toolBarBtn} bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700`}><ZoomIn className="w-4 h-4" /></button>
              <span className="w-px h-6 bg-gray-800 mx-1" />
              <button onClick={clearCrop} disabled={points.length === 0} title="Clear crop shape"
                className={`${toolBarBtn} bg-gray-800 text-gray-300 border-gray-700 hover:border-red-700`}><Trash2 className="w-4 h-4" /> Clear</button>
              <button onClick={resetAll} title="Remove image and start over"
                className={`${toolBarBtn} bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700`}><RefreshCw className="w-4 h-4" /> New image</button>
              <div className="flex-grow" />
              {!closed ? (
                <button onClick={closeShape} disabled={points.length < 3}
                  className={`${toolBarBtn} bg-cyan-950/60 text-cyan-300 border-cyan-800 hover:bg-cyan-900/60`}>
                  <Check className="w-4 h-4" /> Close shape {points.length > 0 && `(${points.length})`}
                </button>
              ) : (
                <button onClick={() => void applyCrop('png')} disabled={exporting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 rounded-xl font-bold transition disabled:opacity-50">
                  <Scissors className="w-4 h-4" /> {exporting ? 'Cropping…' : 'Apply Crop'}
                </button>
              )}
            </div>

            {/* canvas */}
            <div ref={wrapRef}
              className="relative bg-gray-950/60 border border-gray-800 rounded-2xl overflow-auto flex justify-center p-2 sm:p-4"
              style={{ maxHeight: '76vh' }}
              tabIndex={0} onKeyDown={onKeyDown}
              onContextMenu={e => e.preventDefault()}
            >
              <canvas
                ref={canvasRef}
                className="rounded-lg shadow-2xl"
                style={{ touchAction: 'none', cursor: 'crosshair' }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endPointer}
                onPointerCancel={endPointer}
                onPointerLeave={() => { mouseRef.current = null; draw(); }}
                onDoubleClick={onDoubleClick}
              />
            </div>

            <div className="flex items-start gap-2 mt-3 text-xs text-gray-500 px-1">
              <MousePointerClick className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {!closed ? (
                  <>Click anywhere to place points and trace your shape — drag a point to position it precisely. Click the <span className="text-cyan-400 font-semibold">first (cyan) node</span> or press <kbd className="bg-gray-800 px-1.5 py-0.5 rounded font-mono">Enter</kbd> to close the shape. <kbd className="bg-gray-800 px-1.5 py-0.5 rounded font-mono">Esc</kbd> clears it.</>
                ) : (
                  <>Drag any node to reshape • drag an edge to add a point • double-click a node to delete it • drag inside to move the whole shape • arrow keys nudge the selected node.</>
                )}
              </p>
            </div>
          </div>
        )}

        {phase === 'done' && resultUrl && (
          <div className="p-6 sm:p-10 bg-gray-900/50 rounded-2xl text-center space-y-6">
            <h3 className="text-2xl font-bold text-white font-display flex items-center justify-center gap-3">
              <Check className="w-7 h-7 text-cyan-400" /> Your cropped image is ready
            </h3>
            <div className="flex justify-center">
              <div className="rounded-2xl border border-gray-700 p-4 bg-[repeating-conic-gradient(#1f2937_0%_25%,#111827_0%_50%)] bg-[length:24px_24px]">
                <img src={resultUrl} alt="Freeform cropped result preview" className="max-h-80 max-w-full rounded-lg" />
              </div>
            </div>
            {resultDims && <p className="text-gray-400 text-sm font-mono">{resultDims.w} × {resultDims.h} px • exact freeform shape</p>}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              {(['png', 'webp', 'jpg'] as ExportFormat[]).map(f => (
                <button key={f}
                  onClick={() => void applyCrop(f)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-950 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-lg shadow-cyan-500/20">
                  <Download className="w-4 h-4" /> Download {f.toUpperCase()}
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-xs">PNG &amp; WebP keep the background transparent • JPG fills it white</p>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => { if (resultUrl) URL.revokeObjectURL(resultUrl); setResultUrl(null); setResultDims(null); setPhase('edit'); }}
                className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-semibold border border-gray-700 transition">
                Edit shape again
              </button>
              <button onClick={resetAll}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-semibold border border-gray-700 transition">
                <X className="w-4 h-4" /> Crop another image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Page: SEO wrapper around the tool                                   */
/* ------------------------------------------------------------------ */
const ImageCrop: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const existing = document.getElementById('image-crop-schemas');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'image-crop-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Freeform Image Crop Tool — Crop Any Shape Online Free",
      "url": "https://www.videotoimagesequence.online/image-crop",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Draw any crop shape with editable points, rotate and zoom, then export the exact cutout as transparent PNG/WebP or JPG. Free, private, no signup, no watermark.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Image Editor",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5 Canvas and Javascript support",
      "featureList": [
        "Draw a freeform polygon crop with clickable, draggable points",
        "Drag nodes, edges and the whole selection to reshape freely",
        "Rotate the image 90° left/right with the crop staying aligned",
        "Zoom, undo/redo, and one-click reset",
        "Export the exact irregular shape as transparent PNG or WebP",
        "JPG export with white background fill",
        "Process images entirely in your browser (100% private)",
        "No watermark, no sign-up, free forever"
      ],
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": { "@type": "Answer", "text": faq.a }
      }))
    };

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Crop an Image Into Any Shape",
      "description": "Step-by-step instructions for freeform cropping an image with an editable polygon, locally inside your web browser.",
      "totalTime": "PT2M",
      "step": [
        { "@type": "HowToStep", "name": "Upload your image", "text": "Drag and drop or click to select a JPG, PNG, WebP or GIF file — or try the sample image." },
        { "@type": "HowToStep", "name": "Trace your shape", "text": "Click anywhere on the image to place points around the area you want to keep." },
        { "@type": "HowToStep", "name": "Close the shape", "text": "Click the first (cyan) node or press Enter to close the polygon." },
        { "@type": "HowToStep", "name": "Refine the boundary", "text": "Drag nodes to reshape, drag an edge to add a point, double-click a node to delete it." },
        { "@type": "HowToStep", "name": "Apply and download", "text": "Click Apply Crop and download the exact cutout as transparent PNG/WebP or JPG." }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => { const el = document.getElementById('image-crop-schemas'); if (el) el.remove(); };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('imageCrop.title')}
        description={t('imageCrop.description')}
        canonical="https://www.videotoimagesequence.online/image-crop"
        ogTitle={t('imageCrop.title')}
        ogDescription={t('imageCrop.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('imageCrop.keywords')}
      />

      <Breadcrumb items={[{ label: 'Freeform Image Crop', path: '/image-crop' }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('imageCrop.h1')}<br />
          <span className="text-cyan-400">{t('imageCrop.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('imageCrop.hero')}
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['✏️ Any Shape', '🔒 100% Private', '🖼️ Transparent PNG', '🔄 Rotate & Zoom', '🚫 No Watermark', '🆓 Free Forever'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">{badge}</span>
          ))}
        </div>
      </section>

      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <ImageCropTool />
      </div>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">What Is Freeform Cropping?</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 leading-relaxed">
            Every built-in crop tool cuts a rectangle. <strong className="text-white">Freeform cropping</strong> removes that limit: you draw an editable polygon with as many points as you need, in any arrangement — curves approximated with many points, sharp corners, silhouettes, stars, product outlines. The crop is stored as a list of points (a true vector path), not as x/y/width/height, so the exported image keeps your exact irregular shape.
          </p>
          <ul className="space-y-3 text-gray-300 list-disc pl-6">
            <li><strong className="text-white">Cut out subjects</strong> — isolate a person, product, or logo from its background without a rectangle of leftover scenery.</li>
            <li><strong className="text-white">Make stickers &amp; overlays</strong> — export transparent PNGs shaped exactly like your subject for thumbnails, memes, and stream graphics.</li>
            <li><strong className="text-white">Design mockups</strong> — crop interface elements, labels, and textures into the precise shapes a layout needs.</li>
            <li><strong className="text-white">No quality loss</strong> — the crop is rendered at your image&rsquo;s original resolution; nothing is upscaled or recompressed beyond your chosen export format.</li>
            <li><strong className="text-white">Private by design</strong> — unlike server-side editors, your photo never leaves your device.</li>
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Freeform Crop vs. Regular Box Crop</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900 text-white uppercase text-xs font-mono">
              <tr>
                <th className="px-4 py-3">Capability</th>
                <th className="px-4 py-3 text-center">Box crop</th>
                <th className="px-4 py-3 text-center">Freeform crop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Crop shape</td><td className="px-4 py-3 text-center">Rectangle only</td><td className="px-4 py-3 text-center text-cyan-400">Any polygon you draw</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Control points</td><td className="px-4 py-3 text-center">4–8 handles</td><td className="px-4 py-3 text-center text-cyan-400">Unlimited draggable nodes</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Transparent cutout</td><td className="px-4 py-3 text-center text-red-400">No</td><td className="px-4 py-3 text-center text-green-400">Yes (PNG / WebP)</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Move whole selection</td><td className="px-4 py-3 text-center">Yes</td><td className="px-4 py-3 text-center text-green-400">Yes</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Rotate image</td><td className="px-4 py-3 text-center">Sometimes</td><td className="px-4 py-3 text-center text-green-400">90° steps, crop stays aligned</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Best for</td><td className="px-4 py-3 text-center">Aspect-ratio framing</td><td className="px-4 py-3 text-center text-cyan-400">Cutouts, stickers, subjects</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">How to Freeform Crop an Image Online</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload your image', desc: 'Drag and drop or click to select a JPG, PNG, WebP, or GIF — or try the sample image to test instantly.' },
              { num: '2', title: 'Trace your shape', desc: 'Click anywhere on the image to place points around the area you want to keep. Drag while clicking to position each point precisely.' },
              { num: '3', title: 'Close the shape', desc: 'Click the first (cyan) node, press Enter, or hit "Close shape" once you have at least 3 points.' },
              { num: '4', title: 'Refine the boundary', desc: 'Drag any node to reshape, drag an edge to insert a new point, double-click a node to delete it, or drag inside to move the whole selection.' },
              { num: '5', title: 'Apply and download', desc: 'Click "Apply Crop" and download the exact cutout — transparent PNG/WebP, or JPG with a white background.' },
            ].map(({ num, title, desc }) => (
              <li key={num} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 border border-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-cyan-400 font-bold text-sm">{num}</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{title}</p>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Export Formats</h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          Your freeform crop is rendered at the original image resolution, clipped to the exact polygon path. Pick the format that fits your next step:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { f: 'PNG', d: 'Lossless with full transparency. Best for stickers, overlays, and design work.', tag: 'Transparent' },
            { f: 'WebP', d: 'Smaller files with transparency. Best for web use and sharing.', tag: 'Transparent' },
            { f: 'JPG', d: 'Universal compatibility. The area outside your shape is filled white.', tag: 'White background' },
          ].map(({ f, d, tag }) => (
            <div key={f} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-cyan-400 font-bold text-lg">{f}</p>
              <p className="text-gray-500 text-xs mt-1 mb-2 font-mono uppercase tracking-wider">{tag}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-sm mt-6">
          Not sure which format to pick? Read our <Link to="/blog/jpg-vs-png-vs-webp-video-frames" className="text-cyan-400 hover:text-cyan-300 underline">JPG vs PNG vs WebP comparison guide</Link>.
        </p>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">⚠️ Browser Processing Notice</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No server upload required. Everything — the polygon editor, rotation, and export — runs locally in your browser, so very large images depend on your device memory. Your crop is always rendered at the original image resolution for maximum quality.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">More Free Online Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/extract-frames-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Frame Extractor</h3>
            <p className="text-gray-500 text-xs">Extract JPG/PNG/WebP frames from video.</p>
          </Link>
          <Link to="/video-to-gif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to GIF</h3>
            <p className="text-gray-500 text-xs">Turn video clips into animated GIFs.</p>
          </Link>
          <Link to="/video-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to PNG</h3>
            <p className="text-gray-500 text-xs">Extract lossless transparent PNG frames.</p>
          </Link>
          <Link to="/images-to-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Images to Video</h3>
            <p className="text-gray-500 text-xs">Turn image sequences back into video.</p>
          </Link>
        </div>
      </section>

      <section id="faq" className="max-w-3xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-display">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="border border-gray-800 bg-gray-900/50 rounded-2xl p-5 cursor-pointer group hover:border-cyan-800 transition-colors">
              <summary className="font-medium text-white text-sm md:text-base list-none flex justify-between items-center group-open:text-cyan-400">
                {faq.q}
                <span className="text-cyan-400 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ImageCrop;
