import React, { useState, useCallback, useEffect, useRef } from 'react';
import { UploadCloud, Download, RefreshCw, AlertTriangle, FileImage, Archive } from 'lucide-react';
import JSZip from 'jszip';
import { AppState } from '../types';
import { useToast } from './Toast';

/**
 * HEIC/HEIF decoding strategy:
 * The decoder (heic-decode, a libheif WASM build) is lazy-loaded with a
 * dynamic import ONLY after the user clicks Convert — never at page load,
 * so the ~1 MB WASM payload is not fetched by visitors who never convert.
 * There is no native-browser fast path: Safari's createImageBitmap HEIC
 * support varies by version and would give different results per browser,
 * so the WASM path is the single decode path on every browser.
 * heic-decode has no TypeScript types; see the `declare module` in vite-env.d.ts.
 */
type HeicDecodeFn = (opts: { buffer: Uint8Array }) => Promise<{
  width: number;
  height: number;
  data: Uint8ClampedArray;
}>;

let cachedDecoder: HeicDecodeFn | null = null;

async function loadDecoder(): Promise<HeicDecodeFn> {
  if (cachedDecoder) return cachedDecoder;
  const mod = await import('heic-decode') as unknown as
    | HeicDecodeFn
    | { default: HeicDecodeFn };
  const fn = typeof mod === 'function' ? mod : mod.default;
  if (typeof fn !== 'function') {
    throw new Error('The HEIC decoder failed to load. Please reload the page and try again.');
  }
  cachedDecoder = fn;
  return fn;
}

const MAX_FILES = 20;

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

type FileStatus = 'queued' | 'decoding' | 'done' | 'error';

interface HeicFileItem {
  id: number;
  file: File;
  status: FileStatus;
  error?: string;
  /** Object URL of the converted JPG (only when done). */
  url?: string;
  outName?: string;
  outSize?: number;
  width?: number;
  height?: number;
  blob?: Blob;
}

function isHeicFile(f: File): boolean {
  const name = f.name.toLowerCase();
  return (
    name.endsWith('.heic') ||
    name.endsWith('.heif') ||
    f.type === 'image/heic' ||
    f.type === 'image/heif'
  );
}

/** Map raw decoder failures to messages a non-technical user can act on. */
function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/not a HEIC/i.test(msg)) {
    return 'This file does not look like a HEIC photo. It may be renamed, corrupted, or a different format — try the original file from your phone.';
  }
  if (/HEIF processing error/i.test(msg)) {
    return 'This HEIC file could not be decoded. Some portrait-mode files with depth maps or multi-image containers are not supported — try exporting the photo from your phone app first.';
  }
  return `Could not convert this file (${msg}). The original file is untouched.`;
}

function canvasToJpegBlob(
  width: number,
  height: number,
  data: Uint8ClampedArray,
  quality: number,
  maxDim: number,
): Promise<{ blob: Blob; outW: number; outH: number }> {
  return new Promise((resolve, reject) => {
    try {
      const scale = maxDim > 0 ? Math.min(1, maxDim / Math.max(width, height)) : 1;
      const outW = Math.max(1, Math.round(width * scale));
      const outH = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context is not available in this browser.'));
        return;
      }
      // JPEG has no alpha channel: composite onto white so transparent
      // pixels (if any) do not turn black.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outW, outH);
      const imageData = new ImageData(new Uint8ClampedArray(data), width, height);
      if (scale === 1) {
        ctx.putImageData(imageData, 0, 0);
      } else {
        const tmp = document.createElement('canvas');
        tmp.width = width;
        tmp.height = height;
        const tctx = tmp.getContext('2d');
        if (!tctx) {
          reject(new Error('Canvas 2D context is not available in this browser.'));
          return;
        }
        tctx.putImageData(imageData, 0, 0);
        ctx.drawImage(tmp, 0, 0, outW, outH);
      }
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('The browser could not encode the JPG.'));
            return;
          }
          resolve({ blob, outW, outH });
        },
        'image/jpeg',
        quality,
      );
    } catch (err) {
      reject(err);
    }
  });
}

const HeicToJpgTool: React.FC = () => {
  const [items, setItems] = useState<HeicFileItem[]>([]);
  const [quality, setQuality] = useState(92);
  const [maxDim, setMaxDim] = useState(0);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [zipping, setZipping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.url) URL.revokeObjectURL(item.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files);
    const valid = list.filter(isHeicFile);
    const rejected = list.length - valid.length;
    if (rejected > 0) {
      showToast(
        `${rejected} file${rejected > 1 ? 's were' : ' was'} skipped — only .heic and .heif files are accepted.`,
        'error',
      );
    }
    if (valid.length === 0) return;
    setItems((prev) => {
      const room = MAX_FILES - prev.length;
      if (room <= 0) {
        showToast(`You can convert up to ${MAX_FILES} files at a time.`, 'error');
        return prev;
      }
      const taken = valid.slice(0, room);
      if (taken.length < valid.length) {
        showToast(`Only the first ${room} file${room > 1 ? 's' : ''} were added — the limit is ${MAX_FILES} per run.`, 'error');
      }
      return [
        ...prev,
        ...taken.map((file) => ({
          id: idRef.current++,
          file,
          status: 'queued' as FileStatus,
        })),
      ];
    });
  }, [showToast]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const resetAll = useCallback(() => {
    items.forEach((item) => {
      if (item.url) URL.revokeObjectURL(item.url);
    });
    setItems([]);
    setAppState(AppState.IDLE);
    setProgress(0);
    setProgressLabel('');
  }, [items]);

  const convert = async () => {
    if (items.length === 0 || appState === AppState.PROCESSING) return;
    setAppState(AppState.PROCESSING);
    setProgress(0);
    setProgressLabel('Loading the HEIC decoder…');
    let decoder: HeicDecodeFn;
    try {
      decoder = await loadDecoder();
    } catch (err) {
      setProgressLabel('');
      setAppState(AppState.ERROR);
      showToast(err instanceof Error ? err.message : 'The HEIC decoder failed to load.', 'error');
      return;
    }

    // Sequential decode: one file at a time, so a 20-file batch cannot
    // spike memory with several multi-megapixel buffers at once.
    // A failure on one file is recorded on that file only; the batch continues.
    let doneCount = 0;
    let errorCount = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // Skip files that already converted successfully in a previous run.
      if (item.status === 'done') {
        doneCount++;
        continue;
      }
      setItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: 'decoding' as FileStatus, error: undefined } : p)),
      );
      setProgressLabel(`Converting ${i + 1} of ${items.length}: ${item.file.name}`);
      try {
        const buffer = new Uint8Array(await item.file.arrayBuffer());
        const decoded = await decoder({ buffer });
        const { blob, outW, outH } = await canvasToJpegBlob(
          decoded.width,
          decoded.height,
          decoded.data,
          quality / 100,
          maxDim,
        );
        const outName = item.file.name.replace(/\.(heic|heif)$/i, '') + '.jpg';
        const url = URL.createObjectURL(blob);
        setItems((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? {
                  ...p,
                  status: 'done' as FileStatus,
                  url,
                  blob,
                  outName,
                  outSize: blob.size,
                  width: outW,
                  height: outH,
                }
              : p,
          ),
        );
        doneCount++;
      } catch (err) {
        console.error(`HEIC conversion failed for ${item.file.name}:`, err);
        setItems((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, status: 'error' as FileStatus, error: friendlyError(err) } : p,
          ),
        );
        errorCount++;
      }
      setProgress(Math.round(((i + 1) / items.length) * 100));
    }

    setProgressLabel('');
    setAppState(AppState.COMPLETED);
    if (errorCount === 0) {
      showToast(`${doneCount} photo${doneCount > 1 ? 's' : ''} converted to JPG!`, 'success');
    } else {
      showToast(
        `${doneCount} converted, ${errorCount} failed — see the per-file messages below.`,
        'error',
      );
    }
  };

  const downloadAll = async () => {
    const done = items.filter((item) => item.status === 'done' && item.blob && item.outName);
    if (done.length === 0) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      done.forEach((item) => {
        zip.file(item.outName!, item.blob!);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'heic-to-jpg.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } finally {
      setZipping(false);
    }
  };

  const doneItems = items.filter((item) => item.status === 'done');
  const anyDone = doneItems.length > 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
        {/* ── Dropzone ── */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="border-2 border-dashed border-gray-700 hover:border-cyan-500 rounded-2xl p-10 md:p-14 text-center cursor-pointer transition-colors bg-gray-950/50"
        >
          <UploadCloud className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <p className="text-white font-semibold text-lg mb-2">Drop your HEIC photos here</p>
          <p className="text-gray-500 text-sm">
            or click to browse — up to {MAX_FILES} files, converted entirely on your device
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".heic,.heif,image/heic,image/heif"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {/* ── Options ── */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-6">
            <div>
              <label className="text-white font-semibold text-sm block mb-2">
                JPG quality: <span className="text-cyan-400">{quality}%</span>
              </label>
              <input
                type="range"
                min={60}
                max={100}
                step={1}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <p className="text-gray-500 text-xs mt-1">
                92% is a good balance of quality and file size. JPG is a lossy format — even 100% is not identical to the original.
              </p>
            </div>
            <div>
              <label className="text-white font-semibold text-sm block mb-2">
                Max dimension: <span className="text-cyan-400">{maxDim === 0 ? 'Original size' : `${maxDim}px`}</span>
              </label>
              <input
                type="range"
                min={0}
                max={4096}
                step={256}
                value={maxDim}
                onChange={(e) => setMaxDim(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <p className="text-gray-500 text-xs mt-1">
                Leave at original size to keep full resolution, or shrink the longest side for smaller files.
              </p>
            </div>
          </div>
        )}

        {/* ── Convert button / progress ── */}
        {items.length > 0 && appState !== AppState.COMPLETED && (
          <button
            onClick={convert}
            disabled={appState === AppState.PROCESSING}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-2xl transition-colors text-lg flex items-center justify-center gap-2"
          >
            {appState === AppState.PROCESSING ? (
              <><RefreshCw className="w-5 h-5 animate-spin" /> {progressLabel || 'Converting…'} ({progress}%)</>
            ) : (
              'Convert to JPG'
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

        {/* ── File list ── */}
        {items.length > 0 && (
          <div className="mt-8 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-gray-950/60 border border-gray-800 rounded-2xl p-4">
                <div className="flex items-start gap-4">
                  {item.url ? (
                    <img src={item.url} alt={item.outName ?? item.file.name} className="w-20 h-20 object-cover rounded-xl border border-gray-800 shrink-0" />
                  ) : (
                    <FileImage className="w-10 h-10 text-cyan-400 shrink-0 mt-1" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold truncate">{item.file.name}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Original: <span className="text-gray-300 font-medium">{formatBytes(item.file.size)}</span>
                      {item.status === 'done' && item.outSize !== undefined && (
                        <>
                          {' → '}JPG: <span className="text-gray-300 font-medium">{formatBytes(item.outSize)}</span>
                          {item.width && item.height && (
                            <span className="text-gray-500"> · {item.width}×{item.height}px</span>
                          )}
                        </>
                      )}
                    </p>
                    <p className="text-sm mt-1">
                      {item.status === 'queued' && <span className="text-gray-500">Waiting to convert…</span>}
                      {item.status === 'decoding' && <span className="text-cyan-400">Converting…</span>}
                      {item.status === 'done' && <span className="text-emerald-400 font-medium">Done</span>}
                      {item.status === 'error' && <span className="text-red-300">{item.error}</span>}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {item.status === 'done' && item.url && item.outName && (
                      <a
                        href={item.url}
                        download={item.outName}
                        className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-4 py-2 rounded-xl text-sm text-center flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4" /> JPG
                      </a>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-gray-500 hover:text-red-400 underline underline-offset-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Result actions ── */}
        {appState === AppState.COMPLETED && items.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {anyDone && (
              <button
                onClick={downloadAll}
                disabled={zipping}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold py-3.5 rounded-2xl transition-colors text-center flex items-center justify-center gap-2"
              >
                <Archive className="w-5 h-5" />
                {zipping ? 'Preparing ZIP…' : `Download all as ZIP (${doneItems.length})`}
              </button>
            )}
            <button
              onClick={convert}
              className="px-6 py-3.5 border border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-white font-semibold rounded-2xl transition-colors"
            >
              Convert remaining files
            </button>
            <button
              onClick={resetAll}
              className="px-6 py-3.5 border border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-white font-semibold rounded-2xl transition-colors"
            >
              Start over
            </button>
          </div>
        )}

        {appState === AppState.COMPLETED && items.some((item) => item.status === 'error') && (
          <div className="mt-4 flex items-start gap-3 bg-amber-950/40 border border-amber-800 rounded-2xl p-4">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-300/90 text-sm">
              Some files could not be converted — each failure is explained on its own file above.
              Your original files were never modified. Files that failed are usually renamed files,
              corrupted downloads, or portrait-mode variants with depth maps that this decoder cannot read.
            </p>
          </div>
        )}

        <p className="text-gray-500 text-xs mt-6 leading-relaxed">
          Your photos never leave this device: decoding and JPG encoding run entirely in your browser.
          Converted JPGs do not carry over the original photo metadata (such as location) — that is
          intentional, and it is also why this tool is safe for sharing photos you do not want tracked.
        </p>
      </div>
    </div>
  );
};

export default HeicToJpgTool;
