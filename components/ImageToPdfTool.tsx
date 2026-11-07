import React, { useState, useCallback, useEffect, useRef } from 'react';
import { UploadCloud, Download, AlertTriangle, FileImage, ArrowUp, ArrowDown, X } from 'lucide-react';
import { AppState } from '../types';
import { useToast } from './Toast';

/**
 * Images → PDF, fully in the browser with jsPDF (already a project
 * dependency, dynamically imported so it only loads on this page).
 * PNG images are embedded losslessly; JPG images are embedded as-is;
 * WebP images are first decoded to PNG via canvas (jsPDF cannot embed
 * WebP) — still lossless. Page modes: "fit" sizes each PDF page to its
 * image; "a4"/"letter" place the image inside a standard page with
 * margins, aspect ratio preserved.
 */
const MAX_FILES = 30;

type PageMode = 'fit' | 'a4' | 'letter';

interface PdfImageItem {
  id: number;
  file: File;
  thumbUrl: string;
  width?: number;
  height?: number;
}

function isAccepted(f: File): boolean {
  const name = f.name.toLowerCase();
  return (
    name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.webp') ||
    f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/webp'
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error('could not read the file'));
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('could not decode the image'));
    img.src = src;
  });
}

const ImageToPdfTool: React.FC = () => {
  const [items, setItems] = useState<PdfImageItem[]>([]);
  const [pageMode, setPageMode] = useState<PageMode>('fit');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [isDragging, setIsDragging] = useState(false);
  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      items.forEach((it) => URL.revokeObjectURL(it.thumbUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const incoming = Array.from(files);
      const ok = incoming.filter(isAccepted);
      const skipped = incoming.length - ok.length;
      if (skipped > 0) {
        showToast(`${skipped} file${skipped > 1 ? 's were' : ' was'} skipped — only JPG, PNG, or WebP images are accepted here.`, 'error');
      }
      if (ok.length === 0) return;
      setItems((prev) => {
        const room = Math.max(0, MAX_FILES - prev.length);
        const accepted = ok.slice(0, room);
        if (ok.length > room) {
          showToast(`Document limit is ${MAX_FILES} images — ${ok.length - room} file(s) were not added.`, 'error');
        }
        return [
          ...prev,
          ...accepted.map((file) => ({ id: ++idRef.current, file, thumbUrl: URL.createObjectURL(file) })),
        ];
      });
    },
    [showToast],
  );

  const move = (idx: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  };

  const remove = (id: number) => {
    setItems((prev) => {
      const it = prev.find((x) => x.id === id);
      if (it) URL.revokeObjectURL(it.thumbUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  const convert = useCallback(async () => {
    if (items.length === 0) return;
    setAppState(AppState.PROCESSING);
    try {
      const { jsPDF } = await import('jspdf');
      let doc: InstanceType<typeof jsPDF> | null = null;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const dataUrl = await readAsDataUrl(item.file);
        const img = await loadImage(dataUrl);
        const w = img.naturalWidth;
        const h = img.naturalHeight;

        // jsPDF embeds JPEG and PNG directly. WebP must be re-encoded
        // to PNG through a canvas first (lossless).
        let imgData = dataUrl;
        let format: 'JPEG' | 'PNG' = item.file.type === 'image/png' || item.file.name.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
        if (item.file.type === 'image/webp' || item.file.name.toLowerCase().endsWith('.webp')) {
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas 2D context is not available in this browser.');
          ctx.drawImage(img, 0, 0);
          imgData = canvas.toDataURL('image/png');
          format = 'PNG';
        }

        if (pageMode === 'fit') {
          // Page sized to the image at 96 dpi (px -> mm).
          const pw = (w * 25.4) / 96;
          const ph = (h * 25.4) / 96;
          const orientation = pw > ph ? 'landscape' : 'portrait';
          if (i === 0) {
            doc = new jsPDF({ unit: 'mm', format: [pw, ph], orientation });
          } else {
            doc!.addPage([pw, ph], orientation);
          }
          doc!.addImage(imgData, format, 0, 0, pw, ph);
        } else {
          const size = pageMode === 'a4' ? { w: 210, h: 297 } : { w: 216, h: 279 };
          const orientation = w > h ? 'landscape' : 'portrait';
          const pageW = orientation === 'landscape' ? size.h : size.w;
          const pageH = orientation === 'landscape' ? size.w : size.h;
          if (i === 0) {
            doc = new jsPDF({ unit: 'mm', format: pageMode, orientation });
          } else {
            doc!.addPage(pageMode, orientation);
          }
          const margin = 10;
          const availW = pageW - margin * 2;
          const availH = pageH - margin * 2;
          const scale = Math.min(availW / w, availH / h);
          const dw = w * scale;
          const dh = h * scale;
          doc!.addImage(imgData, format, (pageW - dw) / 2, (pageH - dh) / 2, dw, dh);
        }
      }

      if (!doc) throw new Error('nothing to export');
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'images.pdf';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setAppState(AppState.COMPLETED);
      showToast(`PDF created with ${items.length} page${items.length > 1 ? 's' : ''} — check your downloads.`, 'success');
    } catch (err) {
      setAppState(AppState.ERROR);
      showToast(
        `Could not build the PDF (${err instanceof Error ? err.message : String(err)}). Your images are untouched — try fewer or smaller images.`,
        'error',
      );
    }
  }, [items, pageMode, showToast]);

  const reset = () => {
    items.forEach((it) => URL.revokeObjectURL(it.thumbUrl));
    setItems([]);
    setAppState(AppState.IDLE);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload images"
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
        <p className="text-white font-display font-bold text-lg">Drop your images here</p>
        <p className="text-gray-400 text-sm mt-2">
          JPG, PNG, or WebP — up to {MAX_FILES} images, in the order you add them. Nothing is uploaded;
          the PDF is built in your browser.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {items.length > 0 && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <span className="text-gray-400 text-sm">Page size:</span>
            {(
              [
                ['fit', 'Fit to image'],
                ['a4', 'A4'],
                ['letter', 'Letter'],
              ] as [PageMode, string][]
            ).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => setPageMode(mode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  pageMode === mode
                    ? 'bg-cyan-400 text-gray-950 border-cyan-400 font-bold'
                    : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-cyan-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {items.map((it, idx) => (
              <div key={it.id} className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3">
                <span className="text-cyan-400 font-mono text-sm w-8 text-center">{idx + 1}</span>
                <img src={it.thumbUrl} alt={it.file.name} className="w-14 h-14 object-cover rounded-lg border border-gray-800" />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-white text-sm font-medium truncate">{it.file.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{(it.file.size / 1024).toFixed(1)} KB</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white" title="Move up">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 text-white" title="Move down">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => remove(it.id)} className="p-2 rounded-lg bg-gray-800 hover:bg-red-900/60 text-white" title="Remove">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-6 justify-center">
            <button
              onClick={convert}
              disabled={appState === AppState.PROCESSING}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-gray-950 font-bold font-display text-sm transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              {appState === AppState.PROCESSING ? 'Building PDF…' : `Create PDF (${items.length} page${items.length > 1 ? 's' : ''})`}
            </button>
            <button
              onClick={reset}
              className="px-8 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 font-medium text-sm border border-gray-800 transition-colors"
            >
              Clear
            </button>
          </div>
          <p className="text-gray-500 text-xs text-center mt-4 flex items-center justify-center gap-1.5">
            <FileImage className="w-3.5 h-3.5" /> Page order follows the list — reorder with the arrows before creating the PDF.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageToPdfTool;
