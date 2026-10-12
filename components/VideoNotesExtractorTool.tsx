import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Loader2, CheckCircle2, Download, AlertTriangle, FileText, Archive, CheckSquare, Square, RefreshCw } from 'lucide-react';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import Dropzone from './Dropzone';
import { useToast } from './Toast';

interface NoteFrame {
  index: number;
  timestamp: number; // seconds
  blob: Blob;
  dataUrl: string;
  name: string;
}

const INTERVAL_OPTIONS = [
  { value: 10, label: 'Every 10 seconds' },
  { value: 30, label: 'Every 30 seconds' },
  { value: 60, label: 'Every 1 minute' },
  { value: 120, label: 'Every 2 minutes' },
  { value: 300, label: 'Every 5 minutes' },
];

const MAX_FRAMES = 200;
const MAX_DIM = 960; // capture width cap for memory safety

const formatTimestamp = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const VideoNotesExtractorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoMeta, setVideoMeta] = useState<{ name: string; duration: number; width: number; height: number } | null>(null);
  const [intervalSec, setIntervalSec] = useState(30);
  const [format, setFormat] = useState<'jpg' | 'png'>('jpg');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [frames, setFrames] = useState<NoteFrame[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<'zip' | 'pdf' | null>(null);
  const cancelRef = useRef(false);
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      frames.forEach(f => URL.revokeObjectURL(f.dataUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith('video/')) {
      showToast('Invalid file type. Please select an MP4, MOV, or WEBM video file.', 'error');
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      setVideoMeta({
        name: selectedFile.name,
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      });
      setFile(selectedFile);
      setFrames([]);
      setSelected(new Set());
      setError(null);
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      showToast('Could not read video metadata. The file may be corrupted or unsupported.', 'error');
    };
    video.src = url;
  }, [showToast]);

  const handleExtract = useCallback(async () => {
    if (!file || !videoMeta || processing) return;
    setProcessing(true);
    setError(null);
    setFrames([]);
    setSelected(new Set());
    cancelRef.current = false;

    const duration = videoMeta.duration;
    const totalFrames = Math.min(MAX_FRAMES, Math.max(1, Math.floor(duration / intervalSec) + 1));

    try {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not initialize canvas. Try closing other browser tabs to free memory.');

      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(file);
      video.src = url;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error('Could not load video for frame extraction.'));
        setTimeout(() => reject(new Error('Video load timed out.')), 20000);
      });

      let targetW = video.videoWidth;
      let targetH = video.videoHeight;
      if (targetW > MAX_DIM) {
        const ratio = MAX_DIM / targetW;
        targetW = Math.round(targetW * ratio);
        targetH = Math.round(targetH * ratio);
      }
      canvas.width = targetW;
      canvas.height = targetH;

      const base = file.name.replace(/\.[^.]+$/, '');
      const ext = format === 'jpg' ? 'jpg' : 'png';
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const extracted: NoteFrame[] = [];

      for (let i = 0; i < totalFrames; i++) {
        if (cancelRef.current) throw new Error('Cancelled');
        const seekTime = Math.min(i * intervalSec, Math.max(0, duration - 0.05));

        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Seeking timed out — the file may be too large for your device.')), 15000);
          const onSeeked = () => {
            clearTimeout(timeout);
            video.removeEventListener('seeked', onSeeked);
            resolve();
          };
          video.addEventListener('seeked', onSeeked);
          video.currentTime = seekTime;
        });

        ctx.drawImage(video, 0, 0, targetW, targetH);
        const blob: Blob | null = await new Promise(res =>
          canvas.toBlob(res, mimeType, 0.88)
        );
        if (!blob) throw new Error('Frame capture failed on this device.');

        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Could not read captured frame.'));
          reader.readAsDataURL(blob);
        });

        extracted.push({
          index: i,
          timestamp: seekTime,
          blob,
          dataUrl,
          name: `${base}_notes_${String(i + 1).padStart(3, '0')}_${formatTimestamp(seekTime).replace(':', '-')}.${ext}`,
        });
        setProgress({ done: i + 1, total: totalFrames });
        // Yield to UI so the progress bar updates
        await new Promise(r => setTimeout(r, 0));
      }

      URL.revokeObjectURL(url);
      video.removeAttribute('src');
      video.load();

      setFrames(extracted);
      setSelected(new Set(extracted.map(f => f.index)));
      showToast(`${extracted.length} frames extracted — pick the ones for your notes.`, 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong during extraction.';
      if (msg !== 'Cancelled') setError(msg);
    } finally {
      setProcessing(false);
      setProgress({ done: 0, total: 0 });
    }
  }, [file, videoMeta, processing, intervalSec, format, showToast]);

  const handleReset = useCallback(() => {
    cancelRef.current = true;
    setFile(null);
    setVideoMeta(null);
    setFrames([]);
    setSelected(new Set());
    setError(null);
    setProcessing(false);
    setProgress({ done: 0, total: 0 });
  }, []);

  const toggleSelect = useCallback((index: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => setSelected(new Set(frames.map(f => f.index))), [frames]);
  const deselectAll = useCallback(() => setSelected(new Set()), []);
  const invertSelection = useCallback(() => {
    setSelected(new Set(frames.filter(f => !selected.has(f.index)).map(f => f.index)));
  }, [frames, selected]);

  const selectedFrames = frames.filter(f => selected.has(f.index));

  const downloadBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const handleDownloadZip = useCallback(async () => {
    if (selectedFrames.length === 0 || exporting) return;
    setExporting('zip');
    try {
      const zip = new JSZip();
      for (const f of selectedFrames) {
        zip.file(f.name, f.blob);
      }
      const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
      const base = (file?.name || 'video').replace(/\.[^.]+$/, '');
      downloadBlob(blob, `${base}_study_notes.zip`);
      showToast(`ZIP downloaded with ${selectedFrames.length} frames.`, 'success');
    } catch {
      setError('Could not create the ZIP file — your device may be low on memory.');
    } finally {
      setExporting(null);
    }
  }, [selectedFrames, exporting, file, showToast]);

  const handleDownloadPdf = useCallback(async () => {
    if (selectedFrames.length === 0 || exporting) return;
    setExporting('pdf');
    try {
      // Landscape for wide frames, portrait for tall ones
      const firstImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Could not prepare frames for PDF.'));
        img.src = selectedFrames[0].dataUrl;
      });
      const landscape = firstImg.width >= firstImg.height;
      const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: landscape ? 'landscape' : 'portrait' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 36;

      for (let i = 0; i < selectedFrames.length; i++) {
        const f = selectedFrames[i];
        if (i > 0) pdf.addPage();
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const im = new Image();
          im.onload = () => resolve(im);
          im.onerror = () => reject(new Error('Could not prepare a frame for PDF.'));
          im.src = f.dataUrl;
        });
        const availW = pageW - margin * 2;
        const availH = pageH - margin * 2 - 30; // room for caption
        const scale = Math.min(availW / img.width, availH / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (pageW - w) / 2;
        const y = margin + (availH - h) / 2;
        pdf.addImage(f.dataUrl, 'JPEG', x, y, w, h);
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(`${f.name} — ${formatTimestamp(f.timestamp)}`, margin, pageH - margin + 8);
      }

      const base = (file?.name || 'video').replace(/\.[^.]+$/, '');
      pdf.save(`${base}_study_notes.pdf`);
      showToast(`PDF downloaded with ${selectedFrames.length} pages.`, 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the PDF.');
    } finally {
      setExporting(null);
    }
  }, [selectedFrames, exporting, file, showToast]);

  return (
    <div className="max-w-6xl mx-auto">
      {!file ? (
        <Dropzone onFileSelect={handleFileSelect} />
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
          {/* File info + settings */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-white font-semibold truncate max-w-xs md:max-w-md">{videoMeta?.name}</p>
              <p className="text-gray-500 text-sm">
                {videoMeta ? `${formatTimestamp(videoMeta.duration)} long · ${videoMeta.width}×${videoMeta.height}` : ''}
              </p>
            </div>
            <button onClick={handleReset} className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-4 py-2 transition">
              <RefreshCw className="inline w-4 h-4 mr-1.5 -mt-0.5" /> New video
            </button>
          </div>

          {frames.length === 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Extract a frame every</label>
                  <div className="flex flex-wrap gap-2">
                    {INTERVAL_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setIntervalSec(opt.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${intervalSec === opt.value
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    ≈ {videoMeta ? Math.min(MAX_FRAMES, Math.max(1, Math.floor(videoMeta.duration / intervalSec) + 1)) : 0} frames from this video (max {MAX_FRAMES})
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="notes-custom-sec" className="block text-xs font-semibold text-gray-400 mb-1.5">Custom seconds</label>
                      <input
                        id="notes-custom-sec"
                        type="number"
                        min="0.1"
                        max="3600"
                        step="any"
                        placeholder="e.g. 7.5"
                        onBlur={(e) => {
                          const v = Number(e.target.value);
                          if (Number.isFinite(v) && v >= 0.1 && v <= 3600) setIntervalSec(v);
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                        className="w-full bg-gray-950 border border-gray-700 text-white font-mono text-sm rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="notes-custom-min" className="block text-xs font-semibold text-gray-400 mb-1.5">Custom minutes</label>
                      <input
                        id="notes-custom-min"
                        type="number"
                        min="0.1"
                        max="600"
                        step="any"
                        placeholder="e.g. 1.5"
                        onBlur={(e) => {
                          const v = Number(e.target.value);
                          if (Number.isFinite(v) && v >= 0.1 && v <= 600) setIntervalSec(v * 60);
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                        className="w-full bg-gray-950 border border-gray-700 text-white font-mono text-sm rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <p className="text-gray-600 text-[11px] mt-1.5">Type your own interval — decimals allowed.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Image format</label>
                  <div className="flex gap-2">
                    {(['jpg', 'png'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition uppercase ${format === f
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-2">JPG is smaller — best for study PDFs.</p>
                </div>
              </div>

              <button
                onClick={handleExtract}
                disabled={processing}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-950 disabled:text-gray-400 font-bold py-4 rounded-xl text-lg transition flex items-center justify-center gap-2"
              >
                {processing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Extracting {progress.done}/{progress.total}…</>
                ) : (
                  <><FileText className="w-5 h-5" /> Extract frames for my notes</>
                )}
              </button>

              {processing && progress.total > 0 && (
                <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full transition-all"
                    style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selection toolbar */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-gray-950/60 border border-gray-800 rounded-xl p-3">
                <span className="text-sm text-gray-300 font-semibold px-1">
                  <CheckCircle2 className="inline w-4 h-4 mr-1.5 text-cyan-400 -mt-0.5" />
                  {selected.size} of {frames.length} selected
                </span>
                <div className="flex flex-wrap gap-2 ml-auto">
                  <button onClick={selectAll} className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:border-cyan-500 hover:text-cyan-300 transition flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5" /> Select all
                  </button>
                  <button onClick={deselectAll} className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:border-cyan-500 hover:text-cyan-300 transition flex items-center gap-1.5">
                    <Square className="w-3.5 h-3.5" /> Deselect all
                  </button>
                  <button onClick={invertSelection} className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:border-cyan-500 hover:text-cyan-300 transition">
                    Invert selection
                  </button>
                </div>
              </div>

              {/* Scrollable gallery */}
              <div className="max-h-[560px] overflow-y-auto rounded-xl border border-gray-800 bg-gray-950/40 p-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {frames.map(f => {
                    const isSel = selected.has(f.index);
                    return (
                      <button
                        key={f.index}
                        onClick={() => toggleSelect(f.index)}
                        className={`relative group rounded-lg overflow-hidden border-2 transition text-left ${isSel ? 'border-cyan-500' : 'border-transparent hover:border-gray-600'}`}
                        aria-pressed={isSel}
                      >
                        <img src={f.dataUrl} alt={`Frame at ${formatTimestamp(f.timestamp)}`} className="w-full aspect-video object-cover" loading="lazy" />
                        <div className={`absolute top-2 left-2 w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${isSel ? 'bg-cyan-500 border-cyan-500' : 'bg-black/50 border-white/60'}`}>
                          {isSel && <CheckCircle2 className="w-4 h-4 text-gray-950" />}
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-black/70 px-2 py-1">
                          <p className="text-[11px] text-gray-200 font-mono">{formatTimestamp(f.timestamp)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Export actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadZip}
                  disabled={selected.size === 0 || exporting !== null}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-950 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {exporting === 'zip' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Archive className="w-5 h-5" />}
                  Download {selected.size} as ZIP
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={selected.size === 0 || exporting !== null}
                  className="bg-gray-100 hover:bg-white disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-950 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {exporting === 'pdf' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                  Download {selected.size} as PDF
                </button>
              </div>
              <p className="text-gray-500 text-xs text-center">
                The PDF puts one selected frame per page with its timestamp — ready to print or keep with your study notes.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-950/40 border border-red-800 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoNotesExtractorTool;
