import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Loader2, CheckCircle2, Download, AlertTriangle, LayoutGrid, Scissors, FileJson, ImagePlus, Wand2, FileUp } from 'lucide-react';
import JSZip from 'jszip';
import { useToast } from './Toast';
import { downloadBlob } from '../services/frameExportService';
import { detectFrames, parseTexturePackerJson, parseSparrowXml } from '../services/spriteSheetDetect';
import type { DetectedRect } from '../services/spriteSheetDetect';

interface FrameRect { index: number; x: number; y: number; w: number; h: number; url: string; blob: Blob }

type SliceMode = 'grid' | 'auto' | 'atlas';

const pad = (n: number) => String(n).padStart(4, '0');

const SpriteSheetSlicerTool: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('sprite-sheet');
  const [mode, setMode] = useState<SliceMode>('grid');
  const [columns, setColumns] = useState(4);
  const [rows, setRows] = useState(4);
  const [margin, setMargin] = useState(0);
  const [spacing, setSpacing] = useState(0);
  const [trimEmpty, setTrimEmpty] = useState(true);
  const [atlasRects, setAtlasRects] = useState<DetectedRect[] | null>(null);
  const [atlasName, setAtlasName] = useState<string | null>(null);
  const [frames, setFrames] = useState<FrameRect[]>([]);
  const [slicing, setSlicing] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const atlasInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const cellW = image ? Math.floor((image.naturalWidth - margin * 2 - spacing * (columns - 1)) / columns) : 0;
  const cellH = image ? Math.floor((image.naturalHeight - margin * 2 - spacing * (rows - 1)) / rows) : 0;
  const gridValid = !!image && columns >= 1 && rows >= 1 && cellW >= 1 && cellH >= 1;

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      frames.forEach(f => URL.revokeObjectURL(f.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file (PNG, JPG, or WebP sprite sheet).', 'error');
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setImageUrl(url);
      setFileName(file.name.replace(/\.[^.]+$/, '') || 'sprite-sheet');
      setFrames([]);
      setError(null);
      setAtlasRects(null);
      setAtlasName(null);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      showToast('That image could not be decoded by your browser.', 'error');
    };
    img.src = url;
  }, [showToast]);

  /** Rectangles the auto-detector finds in the current sheet (preview + slicing share this). */
  const detectedRects = useMemo<DetectedRect[] | null>(() => {
    if (mode !== 'auto' || !image) return null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return null;
      ctx.drawImage(image, 0, 0);
      return detectFrames(ctx.getImageData(0, 0, canvas.width, canvas.height));
    } catch {
      return null;
    }
  }, [mode, image]);

  /** Rectangles to draw in the preview overlay for the active mode (grid mode draws lines instead). */
  const overlayRects: DetectedRect[] | null =
    mode === 'auto' ? detectedRects : mode === 'atlas' ? atlasRects : null;

  const handleAtlasFile = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const rects = /\.json$/i.test(file.name) || file.type === 'application/json'
        ? parseTexturePackerJson(text)
        : parseSparrowXml(text);
      setAtlasRects(rects);
      setAtlasName(file.name);
      setMode('atlas');
      setFrames([]);
      setError(null);
      showToast(`Atlas loaded: ${rects.length} frames from ${file.name}.`, 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'That atlas file could not be parsed.', 'error');
    }
  }, [showToast]);

  const isFullyTransparent = (ctx: CanvasRenderingContext2D, w: number, h: number): boolean => {
    try {
      const data = ctx.getImageData(0, 0, w, h).data;
      for (let i = 3; i < data.length; i += 16) {
        if (data[i] > 4) return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  /** Cut an explicit rectangle list out of the sheet. `skipEmpty` applies the fully-transparent check per rect. */
  const sliceRects = useCallback(async (rects: DetectedRect[], skipEmpty: boolean): Promise<FrameRect[]> => {
    if (!image) return [];
    const out: FrameRect[] = [];
    const cell = document.createElement('canvas');
    const cctx = cell.getContext('2d', { willReadFrequently: true });
    if (!cctx) throw new Error('Canvas is not available in this browser.');
    for (const rect of rects) {
      const x = Math.max(0, Math.min(rect.x, image.naturalWidth - 1));
      const y = Math.max(0, Math.min(rect.y, image.naturalHeight - 1));
      const w = Math.max(1, Math.min(rect.w, image.naturalWidth - x));
      const h = Math.max(1, Math.min(rect.h, image.naturalHeight - y));
      cell.width = w;
      cell.height = h;
      cctx.clearRect(0, 0, w, h);
      cctx.drawImage(image, x, y, w, h, 0, 0, w, h);
      if (skipEmpty && isFullyTransparent(cctx, w, h)) continue;
      const blob = await new Promise<Blob | null>(res => cell.toBlob(res, 'image/png'));
      if (!blob) continue;
      out.push({ index: out.length, x, y, w, h, url: URL.createObjectURL(blob), blob });
    }
    return out;
  }, [image]);

  const handleSlice = useCallback(async () => {
    if (!image) return;
    setSlicing(true);
    setError(null);
    frames.forEach(f => URL.revokeObjectURL(f.url));
    try {
      let out: FrameRect[] = [];
      if (mode === 'grid') {
        if (!gridValid) return;
        const rects: DetectedRect[] = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < columns; c++) {
            rects.push({ x: margin + c * (cellW + spacing), y: margin + r * (cellH + spacing), w: cellW, h: cellH });
          }
        }
        out = await sliceRects(rects, trimEmpty);
        if (out.length === 0) throw new Error('No frames found — every cell looks empty. Try turning off "skip empty frames" or check the grid.');
      } else if (mode === 'auto') {
        const rects = detectedRects ?? [];
        if (rects.length === 0) {
          throw new Error('No separated sprites detected. Auto-detect needs sprites divided by transparent or flat-colour gutters — try Grid mode, or import the sheet\'s atlas file instead.');
        }
        out = await sliceRects(rects, false);
        if (out.length === 0) throw new Error('Detection found regions but none could be sliced. Try Grid mode instead.');
      } else {
        if (!atlasRects || atlasRects.length === 0) {
          throw new Error('Load the sheet\'s atlas file first (TexturePacker JSON or Sparrow XML).');
        }
        out = await sliceRects(atlasRects, false);
        if (out.length === 0) throw new Error('None of the atlas rectangles landed inside this sheet. Make sure the atlas belongs to this image.');
      }
      setFrames(out);
      showToast(`Sliced into ${out.length} frames.`, 'success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Slicing failed. Try a different mode.');
    } finally {
      setSlicing(false);
    }
  }, [image, mode, gridValid, columns, rows, margin, spacing, cellW, cellH, trimEmpty, detectedRects, atlasRects, sliceRects, frames, showToast]);

  const canSlice = !!image && (mode === 'grid' ? gridValid : mode === 'auto' ? (detectedRects?.length ?? 0) > 0 : (atlasRects?.length ?? 0) > 0);

  const atlasJson = useCallback(() => {
    const uniform = frames.length > 0 && frames.every(f => f.w === frames[0].w && f.h === frames[0].h);
    const data: Record<string, unknown> = {
      image: `${fileName}.png`,
      mode,
      frames: frames.map(f => ({ name: `frame_${pad(f.index)}`, x: f.x, y: f.y, w: f.w, h: f.h })),
      notes: [
        'Unity: import the PNG as Sprite (2D and UI), Sprite Mode = Multiple, slice by grid cell size.',
        'Godot: AnimatedSprite2D + SpriteFrames — set hframes/vframes to columns/rows, or use these rectangles.',
        'Phaser: this.load.spritesheet(key, image, { frameWidth, frameHeight }) matches frameWidth/frameHeight above.'
      ]
    };
    if (uniform) {
      data.frameWidth = frames[0].w;
      data.frameHeight = frames[0].h;
    }
    if (mode === 'grid') {
      data.columns = columns;
      data.rows = rows;
    }
    return JSON.stringify(data, null, 2);
  }, [fileName, mode, columns, rows, frames]);

  const handleDownloadZip = useCallback(async () => {
    if (frames.length === 0) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      frames.forEach(f => zip.file(`frame_${pad(f.index)}.png`, f.blob));
      zip.file(`${fileName}-atlas.json`, atlasJson());
      const blob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(blob, `${fileName}-frames.zip`);
    } catch {
      showToast('ZIP creation failed in this browser. Download frames individually instead.', 'error');
    } finally {
      setZipping(false);
    }
  }, [frames, fileName, atlasJson, showToast]);

  const handleDownloadJson = useCallback(() => {
    downloadBlob(new Blob([atlasJson()], { type: 'application/json' }), `${fileName}-atlas.json`);
  }, [atlasJson, fileName]);

  const numField = (label: string, value: number, set: (n: number) => void, min: number, max: number) => (
    <label className="block">
      <span className="block text-xs font-medium text-gray-400 mb-1.5">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={e => set(Math.max(min, Math.min(max, parseInt(e.target.value || '0', 10) || 0)))}
        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none"
      />
    </label>
  );

  const modeButton = (value: SliceMode, label: string, icon: React.ReactNode) => (
    <button
      key={value}
      type="button"
      onClick={() => { setMode(value); setError(null); }}
      aria-pressed={mode === value}
      className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${mode === value ? 'bg-cyan-500 text-gray-950' : 'bg-gray-950 text-gray-300 border border-gray-800 hover:border-gray-600'}`}
    >
      {icon}{label}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a sprite sheet image"
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) loadFile(f); }}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${dragOver ? 'border-cyan-400 bg-cyan-400/5' : 'border-gray-700 hover:border-gray-500 bg-gray-900/50'}`}
      >
        <ImagePlus className="w-10 h-10 mx-auto mb-3 text-cyan-400" />
        <p className="text-white font-medium mb-1">{image ? 'Drop a different sprite sheet, or click to browse' : 'Drop your sprite sheet here, or click to browse'}</p>
        <p className="text-sm text-gray-500">PNG, JPG, or WebP — processed 100% in your browser, never uploaded</p>
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ''; }} />
      </div>

      {image && imageUrl && (
        <div className="mt-8 grid md:grid-cols-[1fr_260px] gap-6 items-start">
          {/* Preview with overlay */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="relative inline-block max-w-full">
              <img src={imageUrl} alt="Sprite sheet preview with slicing overlay" className="max-w-full h-auto rounded" />
              {mode === 'grid' && gridValid && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${image.naturalWidth} ${image.naturalHeight}`} preserveAspectRatio="none" aria-hidden="true">
                  {Array.from({ length: columns + 1 }, (_, i) => {
                    const x = margin + i * (cellW + spacing) - (i > 0 ? spacing : 0);
                    return <line key={`v${i}`} x1={x} y1={0} x2={x} y2={image.naturalHeight} stroke="#22d3ee" strokeWidth={Math.max(1, image.naturalWidth / 400)} opacity={0.8} />;
                  })}
                  {Array.from({ length: rows + 1 }, (_, i) => {
                    const y = margin + i * (cellH + spacing) - (i > 0 ? spacing : 0);
                    return <line key={`h${i}`} x1={0} y1={y} x2={image.naturalWidth} y2={y} stroke="#22d3ee" strokeWidth={Math.max(1, image.naturalHeight / 400)} opacity={0.8} />;
                  })}
                </svg>
              )}
              {mode !== 'grid' && overlayRects && overlayRects.length > 0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${image.naturalWidth} ${image.naturalHeight}`} preserveAspectRatio="none" aria-hidden="true">
                  {overlayRects.map((r, i) => (
                    <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="none" stroke="#22d3ee" strokeWidth={Math.max(1, image.naturalWidth / 400)} opacity={0.85} />
                  ))}
                </svg>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {image.naturalWidth}×{image.naturalHeight}px sheet
              {mode === 'grid' && (gridValid
                ? <> → {columns * rows} cells of {cellW}×{cellH}px</>
                : <> — grid does not fit this sheet; lower the columns/rows or margin.</>)}
              {mode === 'auto' && (detectedRects
                ? <> → {detectedRects.length} sprite{detectedRects.length === 1 ? '' : 's'} detected</>
                : <> — detecting…</>)}
              {mode === 'atlas' && (atlasRects
                ? <> → {atlasRects.length} frames from {atlasName}</>
                : <> — load the atlas file for this sheet to see its frames.</>)}
            </p>
          </div>

          {/* Controls */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <div>
              <span className="block text-xs font-medium text-gray-400 mb-1.5">How is the sheet packed?</span>
              <div className="flex gap-2">
                {modeButton('grid', 'Grid', <LayoutGrid className="w-3.5 h-3.5" />)}
                {modeButton('auto', 'Auto-detect', <Wand2 className="w-3.5 h-3.5" />)}
                {modeButton('atlas', 'Atlas file', <FileUp className="w-3.5 h-3.5" />)}
              </div>
            </div>

            {mode === 'grid' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {numField('Columns', columns, setColumns, 1, 64)}
                  {numField('Rows', rows, setRows, 1, 64)}
                  {numField('Margin (px)', margin, setMargin, 0, 512)}
                  {numField('Spacing (px)', spacing, setSpacing, 0, 256)}
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={trimEmpty} onChange={e => setTrimEmpty(e.target.checked)} className="accent-cyan-400" />
                  Skip fully-empty frames
                </label>
              </>
            )}

            {mode === 'auto' && (
              <p className="text-sm text-gray-400 leading-relaxed">
                Finds each sprite's real boundaries — no grid needed. Works when sprites are separated by
                transparent or flat-colour gutters, whatever their sizes or spacing.
                {detectedRects && detectedRects.length === 0 && (
                  <span className="block mt-2 text-amber-300">No separated sprites found in this sheet. Grid mode or an atlas file will work better here.</span>
                )}
              </p>
            )}

            {mode === 'atlas' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-400 leading-relaxed">
                  Packed with TexturePacker or a Sparrow/Starling exporter? Load the atlas that belongs to
                  this sheet and slice by its exact rectangles.
                </p>
                <button
                  type="button"
                  onClick={() => atlasInputRef.current?.click()}
                  className="w-full bg-gray-950 border border-gray-800 hover:border-gray-600 text-white text-sm font-medium rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors"
                >
                  <FileUp className="w-4 h-4" /> {atlasRects ? `Replace ${atlasName}` : 'Load atlas (.json / .xml)'}
                </button>
                <input ref={atlasInputRef} type="file" accept=".json,.xml,application/json,text/xml" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleAtlasFile(f); e.target.value = ''; }} />
                {atlasRects && <p className="text-xs text-green-400">{atlasRects.length} frames ready from {atlasName}.</p>}
              </div>
            )}

            <button
              onClick={handleSlice}
              disabled={!canSlice || slicing}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-gray-950 font-semibold rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors"
            >
              {slicing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scissors className="w-4 h-4" />}
              {slicing ? 'Slicing…' : 'Slice Sprite Sheet'}
            </button>
            {error && (
              <p className="text-sm text-red-400 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{error}</p>
            )}
          </div>
        </div>
      )}

      {frames.length > 0 && (
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" /> {frames.length} frames sliced
            </h3>
            <div className="flex gap-2">
              <button onClick={handleDownloadJson} className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg px-4 py-2 flex items-center gap-2 transition-colors">
                <FileJson className="w-4 h-4" /> Atlas JSON
              </button>
              <button onClick={handleDownloadZip} disabled={zipping} className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-gray-950 text-sm font-semibold rounded-lg px-4 py-2 flex items-center gap-2 transition-colors">
                {zipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Download all (ZIP)
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {frames.map(f => (
              <a key={f.index} href={f.url} download={`frame_${pad(f.index)}.png`} className="group relative bg-gray-950 border border-gray-800 rounded-lg overflow-hidden" title={`Download frame ${f.index}`}>
                <img src={f.url} alt={`Frame ${f.index}`} className="w-full h-auto block" loading="lazy" />
                <span className="absolute inset-x-0 bottom-0 text-[10px] text-center text-gray-400 bg-gray-950/80 py-0.5 group-hover:text-cyan-300">{f.index}</span>
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 flex items-center gap-1.5"><LayoutGrid className="w-3.5 h-3.5" /> Click any frame to download it alone, or grab the ZIP with every frame plus the atlas JSON for Unity, Godot, and Phaser.</p>
        </div>
      )}
    </div>
  );
};

export default SpriteSheetSlicerTool;
