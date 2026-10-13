import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Loader2, Download, AlertTriangle, FileDown, RefreshCw, Trash2, ArrowLeft, ArrowRight, Camera } from 'lucide-react';
import { jsPDF } from 'jspdf';
import Dropzone from './Dropzone';
import { useToast } from './Toast';

interface PdfFrame {
  id: number;
  timestamp: number; // seconds
  dataUrl: string;
  width: number;
  height: number;
}

type ExtractMode = 'interval' | 'even' | 'manual';

const MAX_FRAMES = 500; // sensible cap for browser memory
const MAX_DIM = 1280; // capture width cap — sharp enough for A4 print, kind to memory

const formatTimestamp = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const VideoToPdfTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoMeta, setVideoMeta] = useState<{ name: string; duration: number; width: number; height: number } | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<ExtractMode>('interval');
  const [intervalSec, setIntervalSec] = useState(10);
  const [evenCount, setEvenCount] = useState(12);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [frames, setFrames] = useState<PdfFrame[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // PDF options
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [orientation, setOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [framesPerPage, setFramesPerPage] = useState<1 | 2 | 4>(1);
  const [quality, setQuality] = useState(0.85);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [docTitle, setDocTitle] = useState('');
  const [docAuthor, setDocAuthor] = useState('');
  const [titlePage, setTitlePage] = useState(true);

  const cancelRef = useRef(false);
  const idRef = useRef(0);
  const manualVideoRef = useRef<HTMLVideoElement | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
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
      setVideoUrl(url);
      setVideoMeta({
        name: selectedFile.name,
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      });
      setFile(selectedFile);
      setFrames([]);
      setError(null);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      showToast('Could not read video metadata. The file may be corrupted or unsupported.', 'error');
    };
    video.src = url;
  }, [showToast]);

  // Capture one frame from a video element at a given time.
  // Handles the case where seekTime already equals currentTime (setting
  // currentTime to its current value fires no 'seeked' event) by capturing
  // directly once frame data is available.
  const captureAt = useCallback((video: HTMLVideoElement, canvas: HTMLCanvasElement, seekTime: number): Promise<{ dataUrl: string; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timeout);
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('canplay', onCanPlay);
      };
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Seeking timed out — the file may be too large for your device.'));
      }, 15000);

      const doCapture = () => {
        cleanup();
        let targetW = video.videoWidth;
        let targetH = video.videoHeight;
        if (targetW > MAX_DIM) {
          const ratio = MAX_DIM / targetW;
          targetW = Math.round(targetW * ratio);
          targetH = Math.round(targetH * ratio);
        }
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not initialize canvas. Try closing other browser tabs to free memory.'));
          return;
        }
        ctx.drawImage(video, 0, 0, targetW, targetH);
        canvas.toBlob(blob => {
          if (!blob) {
            reject(new Error('Frame capture failed on this device.'));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => resolve({ dataUrl: reader.result as string, width: targetW, height: targetH });
          reader.onerror = () => reject(new Error('Could not read captured frame.'));
          reader.readAsDataURL(blob);
        }, 'image/jpeg', quality);
      };

      const onSeeked = () => doCapture();
      const onCanPlay = () => doCapture();

      const sameTime = Math.abs(video.currentTime - seekTime) < 0.04;
      if (sameTime) {
        // Setting currentTime to its current value fires no 'seeked' event.
        if (video.readyState >= 2) doCapture();
        else video.addEventListener('canplay', onCanPlay);
      } else {
        video.addEventListener('seeked', onSeeked);
        video.currentTime = seekTime;
      }
    });
  }, [quality]);

  const buildTimes = useCallback((): number[] => {
    if (!videoMeta) return [];
    const duration = videoMeta.duration;
    if (mode === 'interval') {
      const count = Math.min(MAX_FRAMES, Math.max(1, Math.floor(duration / intervalSec) + 1));
      return Array.from({ length: count }, (_, i) => Math.min(i * intervalSec, Math.max(0, duration - 0.05)));
    }
    // 'even': N evenly spaced across the whole video
    const count = Math.min(MAX_FRAMES, Math.max(1, Math.round(evenCount)));
    if (count === 1) return [Math.min(0.05, Math.max(0, duration - 0.05))];
    return Array.from({ length: count }, (_, i) => Math.min((i / (count - 1)) * duration, Math.max(0, duration - 0.05)));
  }, [videoMeta, mode, intervalSec, evenCount]);

  const estimatedFrames = videoMeta ? buildTimes().length : 0;

  const handleExtract = useCallback(async () => {
    if (!file || !videoMeta || processing) return;
    const times = buildTimes();
    if (times.length === 0) return;
    setProcessing(true);
    setError(null);
    setFrames([]);
    cancelRef.current = false;

    try {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(file);
      video.src = url;
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error('Could not load video for frame extraction.'));
        setTimeout(() => reject(new Error('Video load timed out.')), 20000);
      });

      const extracted: PdfFrame[] = [];
      for (let i = 0; i < times.length; i++) {
        if (cancelRef.current) throw new Error('Cancelled');
        const { dataUrl, width, height } = await captureAt(video, canvas, times[i]);
        extracted.push({ id: idRef.current++, timestamp: times[i], dataUrl, width, height });
        setProgress({ done: i + 1, total: times.length });
        await new Promise(r => setTimeout(r, 0));
      }
      URL.revokeObjectURL(url);
      video.removeAttribute('src');
      video.load();
      setFrames(extracted);
      showToast(`${extracted.length} frames extracted — arrange them, then generate your PDF.`, 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong during extraction.';
      if (msg !== 'Cancelled') setError(msg);
    } finally {
      setProcessing(false);
      setProgress({ done: 0, total: 0 });
    }
  }, [file, videoMeta, processing, buildTimes, captureAt, showToast]);

  const handleManualCapture = useCallback(async () => {
    const video = manualVideoRef.current;
    if (!video || video.readyState < 2) {
      showToast('Video is still loading — wait a moment and try again.', 'error');
      return;
    }
    if (frames.length >= MAX_FRAMES) {
      showToast(`Frame cap reached (${MAX_FRAMES}). Delete a frame to capture another.`, 'error');
      return;
    }
    try {
      const canvas = document.createElement('canvas');
      const { dataUrl, width, height } = await captureAt(video, canvas, video.currentTime);
      setFrames(prev => [...prev, { id: idRef.current++, timestamp: video.currentTime, dataUrl, width, height }]);
      showToast(`Frame captured at ${formatTimestamp(video.currentTime)}.`, 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Frame capture failed.');
    }
  }, [frames.length, captureAt, showToast]);

  const handleReset = useCallback(() => {
    cancelRef.current = true;
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setFile(null);
    setVideoMeta(null);
    setFrames([]);
    setError(null);
    setProcessing(false);
    setProgress({ done: 0, total: 0 });
  }, [videoUrl]);

  const deleteFrame = useCallback((id: number) => {
    setFrames(prev => prev.filter(f => f.id !== id));
  }, []);

  const moveFrame = useCallback((id: number, dir: -1 | 1) => {
    setFrames(prev => {
      const idx = prev.findIndex(f => f.id === id);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  const estimatedPages = frames.length === 0 ? 0 : Math.ceil(frames.length / framesPerPage) + (titlePage ? 1 : 0);

  const handleDownloadPdf = useCallback(async () => {
    if (frames.length === 0 || exporting) return;
    setExporting(true);
    setError(null);
    try {
      const firstLandscape = frames[0].width >= frames[0].height;
      const orient: 'portrait' | 'landscape' = orientation === 'auto'
        ? (firstLandscape ? 'landscape' : 'portrait')
        : orientation;
      const pdf = new jsPDF({ unit: 'pt', format: pageSize, orientation: orient });
      const title = docTitle.trim() || 'Video Frames Report';
      pdf.setProperties({
        title,
        author: docAuthor.trim() || undefined,
        subject: `Frames extracted from ${videoMeta?.name || 'video'}`,
        creator: 'videotoimagesequence.online — Video to PDF',
      });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 40;
      const captionH = showTimestamps ? 18 : 0;

      if (titlePage) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(26);
        pdf.setTextColor(30);
        const wrapped = pdf.splitTextToSize(title, pageW - margin * 2);
        pdf.text(wrapped, pageW / 2, pageH / 2 - 60, { align: 'center' });
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        pdf.setTextColor(110);
        const metaLines = [
          `Source: ${videoMeta?.name || 'video'}`,
          `Video length: ${videoMeta ? formatTimestamp(videoMeta.duration) : '—'}`,
          `Frames in this document: ${frames.length}`,
          `Generated: ${new Date().toLocaleDateString()}`,
        ];
        if (docAuthor.trim()) metaLines.unshift(`By ${docAuthor.trim()}`);
        metaLines.forEach((line, i) => {
          pdf.text(line, pageW / 2, pageH / 2 + i * 22, { align: 'center' });
        });
      }

      // Grid layout: cols/rows per page
      const cols = framesPerPage === 1 ? 1 : 2;
      const rows = framesPerPage === 4 ? 2 : framesPerPage === 2 ? 2 : 1;
      const gap = 16;
      const cellW = (pageW - margin * 2 - gap * (cols - 1)) / cols;
      const cellH = (pageH - margin * 2 - gap * (rows - 1)) / rows;

      // jsPDF starts with one blank page: use it for the first batch unless the
      // title page already occupies it.
      let currentPageFresh = !titlePage;
      for (let i = 0; i < frames.length; i += framesPerPage) {
        if (!currentPageFresh) pdf.addPage();
        currentPageFresh = false;
        const pageFrames = frames.slice(i, i + framesPerPage);
        pageFrames.forEach((f, j) => {
          const col = j % cols;
          const row = Math.floor(j / cols);
          const cellX = margin + col * (cellW + gap);
          const cellY = margin + row * (cellH + gap);
          const availH = cellH - captionH;
          const scale = Math.min(cellW / f.width, availH / f.height);
          const w = f.width * scale;
          const h = f.height * scale;
          const x = cellX + (cellW - w) / 2;
          const y = cellY + (availH - h) / 2;
          pdf.addImage(f.dataUrl, 'JPEG', x, y, w, h);
          if (showTimestamps) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(100);
            pdf.text(`Frame ${i + j + 1} — ${formatTimestamp(f.timestamp)}`, cellX, cellY + cellH - 4);
          }
        });
        // Page footer
        pdf.setFontSize(9);
        pdf.setTextColor(150);
        pdf.text(`${title} — page ${i / framesPerPage + (titlePage ? 2 : 1)}`, pageW / 2, pageH - 18, { align: 'center' });
      }

      const base = (file?.name || 'video').replace(/\.[^.]+$/, '');
      pdf.save(`${base}_to_pdf.pdf`);
      showToast(`PDF downloaded — ${frames.length} frames across ${estimatedPages} pages.`, 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the PDF. Very long documents can run out of browser memory — try fewer frames.');
    } finally {
      setExporting(false);
    }
  }, [frames, exporting, orientation, pageSize, docTitle, docAuthor, titlePage, showTimestamps, framesPerPage, videoMeta, file, estimatedPages, showToast]);

  const downloadName = (file?.name || 'video').replace(/\.[^.]+$/, '');

  return (
    <div className="max-w-6xl mx-auto">
      {!file ? (
        <Dropzone onFileSelect={handleFileSelect} />
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
          {/* File info */}
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
              {/* Mode tabs */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">How to pick frames</label>
                <div className="flex flex-wrap gap-2">
                  {([
                    { key: 'interval', label: 'Every N seconds' },
                    { key: 'even', label: 'N evenly-spaced frames' },
                    { key: 'manual', label: 'Capture manually' },
                  ] as { key: ExtractMode; label: string }[]).map(m => (
                    <button
                      key={m.key}
                      onClick={() => setMode(m.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${mode === m.key
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {mode === 'interval' && (
                <div>
                  <label htmlFor="pdf-interval" className="block text-xs font-semibold text-gray-400 mb-1.5">Extract a frame every (seconds, decimals allowed)</label>
                  <input
                    id="pdf-interval"
                    type="number"
                    min="0.1"
                    max="3600"
                    step="any"
                    value={intervalSec}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (Number.isFinite(v) && v >= 0.1 && v <= 3600) setIntervalSec(v);
                    }}
                    className="w-full max-w-xs bg-gray-950 border border-gray-700 text-white font-mono text-sm rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {mode === 'even' && (
                <div>
                  <label htmlFor="pdf-even" className="block text-xs font-semibold text-gray-400 mb-1.5">Number of frames (1–{MAX_FRAMES})</label>
                  <input
                    id="pdf-even"
                    type="number"
                    min="1"
                    max={MAX_FRAMES}
                    step="1"
                    value={evenCount}
                    onChange={(e) => {
                      const v = Math.round(Number(e.target.value));
                      if (Number.isFinite(v)) setEvenCount(Math.min(MAX_FRAMES, Math.max(1, v)));
                    }}
                    className="w-full max-w-xs bg-gray-950 border border-gray-700 text-white font-mono text-sm rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {mode !== 'manual' && (
                <>
                  <p className="text-gray-500 text-xs">≈ {estimatedFrames} frames from this video (max {MAX_FRAMES})</p>
                  <button
                    onClick={handleExtract}
                    disabled={processing}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-950 disabled:text-gray-400 font-bold py-4 rounded-xl text-lg transition flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Extracting {progress.done}/{progress.total}…</>
                    ) : (
                      <><FileDown className="w-5 h-5" /> Extract frames for my PDF</>
                    )}
                  </button>
                  {processing && progress.total > 0 && (
                    <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-cyan-500 h-full transition-all" style={{ width: `${Math.round((progress.done / progress.total) * 100)}%` }} />
                    </div>
                  )}
                </>
              )}

              {mode === 'manual' && (
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm">Scrub to a moment and capture it. Preview below — your video never leaves this browser.</p>
                  {videoUrl && (
                    <video ref={manualVideoRef} src={videoUrl} controls preload="metadata" className="w-full max-h-[420px] rounded-xl bg-black" playsInline />
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleManualCapture}
                      className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold py-3 px-6 rounded-xl transition flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" /> Capture this frame
                    </button>
                    <span className="text-gray-500 text-sm">{frames.length} captured (max {MAX_FRAMES})</span>
                  </div>
                  {frames.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {frames.map(f => (
                        <div key={f.id} className="relative rounded-lg overflow-hidden border border-gray-800">
                          <img src={f.dataUrl} alt={`Frame at ${formatTimestamp(f.timestamp)}`} className="w-full aspect-video object-cover" />
                          <button onClick={() => deleteFrame(f.id)} aria-label="Delete frame" className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded p-1 transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="absolute bottom-0 inset-x-0 bg-black/70 px-1 py-0.5">
                            <p className="text-[10px] text-gray-200 font-mono">{formatTimestamp(f.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Frame strip with reorder/delete */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-300">{frames.length} frames — drag-free order controls, hover to move or remove</p>
                  <p className="text-xs text-gray-500">PDF preview: {estimatedPages} pages</p>
                </div>
                <div id="pdf-strip" className="max-h-[480px] overflow-y-auto rounded-xl border border-gray-800 bg-gray-950/40 p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {frames.map((f, idx) => (
                      <div key={f.id} className="relative group rounded-lg overflow-hidden border border-gray-800 bg-black">
                        <img src={f.dataUrl} alt={`Frame ${idx + 1} at ${formatTimestamp(f.timestamp)}`} className="w-full aspect-video object-cover" loading="lazy" />
                        <div className="absolute top-1.5 left-1.5 bg-black/70 text-gray-200 text-[11px] font-mono px-1.5 py-0.5 rounded">{idx + 1}</div>
                        <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => moveFrame(f.id, -1)} disabled={idx === 0} aria-label="Move earlier" className="bg-black/70 hover:bg-cyan-600 disabled:opacity-30 text-white rounded p-1">
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => moveFrame(f.id, 1)} disabled={idx === frames.length - 1} aria-label="Move later" className="bg-black/70 hover:bg-cyan-600 disabled:opacity-30 text-white rounded p-1">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteFrame(f.id)} aria-label="Delete frame" className="bg-black/70 hover:bg-red-600 text-white rounded p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-black/70 px-2 py-1">
                          <p className="text-[11px] text-gray-200 font-mono">{formatTimestamp(f.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PDF options */}
              <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-5 space-y-5">
                <p className="text-sm font-semibold text-gray-300">PDF settings</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Document title</label>
                    <input
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder={`e.g. ${downloadName} — key frames`}
                      className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Author (optional)</label>
                    <input
                      value={docAuthor}
                      onChange={(e) => setDocAuthor(e.target.value)}
                      placeholder="Your name or team"
                      className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Page size</label>
                    <div className="flex gap-2">
                      {(['a4', 'letter'] as const).map(s => (
                        <button key={s} onClick={() => setPageSize(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition uppercase ${pageSize === s ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Orientation</label>
                    <div className="flex gap-2">
                      {(['auto', 'portrait', 'landscape'] as const).map(o => (
                        <button key={o} onClick={() => setOrientation(o)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition capitalize ${orientation === o ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}`}>{o}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Frames per page</label>
                    <div className="flex gap-2">
                      {([1, 2, 4] as const).map(n => (
                        <button key={n} onClick={() => setFramesPerPage(n)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${framesPerPage === n ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'}`}>{n}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">JPEG quality: {Math.round(quality * 100)}%</label>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={Math.round(quality * 100)}
                      onChange={(e) => setQuality(Number(e.target.value) / 100)}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={showTimestamps} onChange={(e) => setShowTimestamps(e.target.checked)} className="w-4 h-4 accent-cyan-500" />
                    Timestamp captions on each frame
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={titlePage} onChange={(e) => setTitlePage(e.target.checked)} className="w-4 h-4 accent-cyan-500" />
                    Add a title page
                  </label>
                </div>
                <p className="text-gray-500 text-xs">
                  {estimatedPages} pages estimated ({frames.length} frames). Higher quality makes a bigger file — 80–90% is the sweet spot for print.
                </p>
              </div>

              <button
                onClick={handleDownloadPdf}
                disabled={exporting}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-950 disabled:text-gray-400 font-bold py-4 rounded-xl text-lg transition flex items-center justify-center gap-2"
              >
                {exporting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Building your PDF…</>
                ) : (
                  <><Download className="w-5 h-5" /> Download PDF ({estimatedPages} pages)</>
                )}
              </button>
              <p className="text-gray-500 text-xs text-center">
                100% in-browser — no upload, no signup, no watermark. Very long documents can run out of browser memory; split large videos into sections if that happens.
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

export default VideoToPdfTool;
