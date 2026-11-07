import React, { useState, useCallback, useEffect, useRef } from 'react';
import { UploadCloud, Download, RefreshCw, AlertTriangle, FileImage, Archive } from 'lucide-react';
import JSZip from 'jszip';
import { AppState } from '../types';
import { useToast } from './Toast';

/**
 * WebP decoding strategy — native browser decode only, no WASM, no new
 * dependency. Every current browser (Chrome, Edge, Firefox, Safari)
 * decodes WebP natively, so createImageBitmap handles it directly; an
 * <img> element loading an object URL is the fallback. PNG encoding is
 * lossless and keeps the alpha channel, so — unlike JPG — transparent
 * WebP pixels stay transparent in the output.
 */
const MAX_FILES = 20;

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

type FileStatus = 'queued' | 'decoding' | 'done' | 'error';

interface WebpFileItem {
  id: number;
  file: File;
  status: FileStatus;
  error?: string;
  url?: string;
  outName?: string;
  outSize?: number;
  width?: number;
  height?: number;
  blob?: Blob;
}

function isWebpFile(f: File): boolean {
  const name = f.name.toLowerCase();
  return name.endsWith('.webp') || f.type === 'image/webp';
}

function friendlyError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  return `This browser could not decode this WebP file (${msg}). Current versions of Chrome, Edge, Firefox, and Safari all decode WebP — try updating your browser, or re-export the image from its source app. The original file is untouched.`;
}

/** Decode a WebP file and re-encode it as a lossless PNG at the
 * original dimensions. Transparency is preserved (PNG has an alpha
 * channel), so no background colour is needed. */
async function decodeWebpToPng(
  file: File,
): Promise<{ blob: Blob; outW: number; outH: number }> {
  let bitmap: ImageBitmap | null = null;
  let objectUrl: string | null = null;
  try {
    let source: ImageBitmap | HTMLImageElement;
    try {
      bitmap = await createImageBitmap(file);
      source = bitmap;
    } catch {
      objectUrl = URL.createObjectURL(file);
      source = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('image element failed to load the WebP file'));
        img.src = objectUrl!;
      });
    }
    const srcW = source.width;
    const srcH = source.height;
    if (!srcW || !srcH) throw new Error('the decoded image has no dimensions');
    const canvas = document.createElement('canvas');
    canvas.width = srcW;
    canvas.height = srcH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context is not available in this browser.');
    ctx.drawImage(source, 0, 0);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('the browser could not encode the PNG'))),
        'image/png',
      );
    });
    return { blob, outW: srcW, outH: srcH };
  } finally {
    if (bitmap) bitmap.close();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

const WebpToPngTool: React.FC = () => {
  const [items, setItems] = useState<WebpFileItem[]>([]);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [isDragging, setIsDragging] = useState(false);
  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      items.forEach((it) => {
        if (it.url) URL.revokeObjectURL(it.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const incoming = Array.from(files);
      const webp = incoming.filter(isWebpFile);
      const skipped = incoming.length - webp.length;
      if (skipped > 0) {
        showToast(`${skipped} file${skipped > 1 ? 's were' : ' was'} skipped — only .webp images are accepted here.`, 'error');
      }
      if (webp.length === 0) return;
      setItems((prev) => {
        const room = Math.max(0, MAX_FILES - prev.length);
        const accepted = webp.slice(0, room);
        if (webp.length > room) {
          showToast(`Batch limit is ${MAX_FILES} files — ${webp.length - room} file(s) were not added.`, 'error');
        }
        return [
          ...prev,
          ...accepted.map((file) => ({ id: ++idRef.current, file, status: 'queued' as FileStatus })),
        ];
      });
    },
    [showToast],
  );

  const convertAll = useCallback(async () => {
    setAppState(AppState.PROCESSING);
    const queue = items.filter((it) => it.status === 'queued' || it.status === 'error');
    for (const item of queue) {
      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: 'decoding', error: undefined } : it)));
      try {
        const { blob, outW, outH } = await decodeWebpToPng(item.file);
        const url = URL.createObjectURL(blob);
        const outName = item.file.name.replace(/\.webp$/i, '') + '.png';
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? { ...it, status: 'done', url, outName, outSize: blob.size, width: outW, height: outH, blob }
              : it,
          ),
        );
      } catch (err) {
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, status: 'error', error: friendlyError(err) } : it)),
        );
      }
    }
    setAppState(AppState.COMPLETED);
  }, [items]);

  const downloadAll = async () => {
    const done = items.filter((it) => it.status === 'done' && it.blob);
    if (done.length === 0) return;
    if (done.length === 1) {
      const a = document.createElement('a');
      a.href = done[0].url!;
      a.download = done[0].outName!;
      a.click();
      return;
    }
    const zip = new JSZip();
    done.forEach((it) => zip.file(it.outName!, it.blob!));
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webp-to-png.zip';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const reset = () => {
    items.forEach((it) => {
      if (it.url) URL.revokeObjectURL(it.url);
    });
    setItems([]);
    setAppState(AppState.IDLE);
  };

  const doneCount = items.filter((it) => it.status === 'done').length;
  const queuedCount = items.filter((it) => it.status === 'queued' || it.status === 'error').length;

  return (
    <div className="max-w-4xl mx-auto">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload WebP images"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-cyan-400 bg-cyan-950/30' : 'border-gray-700 bg-gray-900/50 hover:border-cyan-800'
        }`}
      >
        <UploadCloud className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
        <p className="text-white font-display font-bold text-lg">Drop your WebP images here</p>
        <p className="text-gray-400 text-sm mt-2">
          or click to browse — up to {MAX_FILES} files. Nothing is uploaded; conversion happens in your browser.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".webp,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {items.length > 0 && (
        <div className="mt-8 space-y-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4"
            >
              <FileImage className="w-6 h-6 text-cyan-400 shrink-0" />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-white text-sm font-medium truncate">{it.file.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {formatBytes(it.file.size)}
                  {it.status === 'done' && it.width && it.height
                    ? ` → PNG ${formatBytes(it.outSize || 0)} · ${it.width}×${it.height}`
                    : ''}
                </p>
                {it.status === 'error' && (
                  <p className="text-red-400 text-xs mt-1 flex items-start gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {it.error}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                {it.status === 'queued' && <span className="text-gray-500 text-xs font-mono">QUEUED</span>}
                {it.status === 'decoding' && (
                  <span className="text-cyan-400 text-xs font-mono flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> CONVERTING
                  </span>
                )}
                {it.status === 'done' && it.url && (
                  <a
                    href={it.url}
                    download={it.outName}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> PNG
                  </a>
                )}
                {it.status === 'error' && <span className="text-red-400 text-xs font-mono">FAILED</span>}
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-3 pt-4 justify-center">
            {queuedCount > 0 && (
              <button
                onClick={convertAll}
                disabled={appState === AppState.PROCESSING}
                className="px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-gray-950 font-bold font-display text-sm transition-colors shadow-lg shadow-cyan-500/20"
              >
                {appState === AppState.PROCESSING ? 'Converting…' : `Convert ${queuedCount} to PNG`}
              </button>
            )}
            {doneCount > 0 && (
              <button
                onClick={downloadAll}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold font-display text-sm border border-gray-700 transition-colors"
              >
                <Archive className="w-4 h-4" /> Download all ({doneCount}){doneCount > 1 ? ' as ZIP' : ''}
              </button>
            )}
            <button
              onClick={reset}
              className="px-8 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 font-medium text-sm border border-gray-800 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebpToPngTool;
