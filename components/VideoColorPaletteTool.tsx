import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Loader2, Download, Palette, Copy, Check, Lock } from 'lucide-react';
import Dropzone from './Dropzone';
import { extractPalette, paletteToPngStrip, paletteToCssVars, paletteToTextList, PaletteColor } from '../utils/colorPalette';
import { useToast } from './Toast';

const SAMPLE_OPTIONS = [8, 12, 16, 24];
const COLOR_OPTIONS = [6, 8, 10];

const VideoColorPaletteTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoMeta, setVideoMeta] = useState<{ name: string; duration: number; width: number; height: number } | null>(null);
  const [frameSamples, setFrameSamples] = useState(12);
  const [colorCount, setColorCount] = useState(8);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [palette, setPalette] = useState<PaletteColor[] | null>(null);
  const [baseName, setBaseName] = useState('video');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const cancelRef = useRef(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (copiedIdx === null) return;
    const t = setTimeout(() => setCopiedIdx(null), 1500);
    return () => clearTimeout(t);
  }, [copiedIdx]);

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
      setPalette(null);
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
    if (!file || processing) return;
    setProcessing(true);
    setError(null);
    setPalette(null);
    cancelRef.current = false;
    try {
      const result = await extractPalette({
        file,
        frameSamples,
        colorCount,
        onProgress: (done, total) => {
          if (cancelRef.current) throw new Error('Cancelled');
          setProgress({ done, total });
        },
      });
      setPalette(result.colors);
      setBaseName(result.baseName);
      showToast(`Palette ready — ${result.colors.length} dominant colors extracted.`, 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong while extracting the palette.';
      if (msg !== 'Cancelled') setError(msg);
    } finally {
      setProcessing(false);
      setProgress({ done: 0, total: 0 });
    }
  }, [file, processing, frameSamples, colorCount]);

  const handleReset = useCallback(() => {
    cancelRef.current = true;
    setFile(null);
    setVideoMeta(null);
    setPalette(null);
    setError(null);
    setProcessing(false);
    setProgress({ done: 0, total: 0 });
  }, []);

  const copyText = useCallback(async (text: string, label: string, idx?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (typeof idx === 'number') setCopiedIdx(idx);
      showToast(`${label} copied to clipboard.`, 'success');
    } catch {
      showToast('Copy failed — your browser blocked clipboard access.', 'error');
    }
  }, [showToast]);

  const handleDownloadStrip = useCallback(async () => {
    if (!palette) return;
    try {
      const blob = await paletteToPngStrip(palette);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}_palette.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showToast('Palette strip downloaded.', 'success');
    } catch {
      showToast('Could not render the palette strip.', 'error');
    }
  }, [palette, baseName, showToast]);

  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl shadow-black/50 p-1">
        <div className="p-4 sm:p-8 bg-gray-900/50 rounded-2xl">
          {!file ? (
            <>
              <Dropzone onFileSelect={handleFileSelect} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 mb-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900 rounded-full flex items-center justify-center mx-auto text-cyan-400">
                    <Palette className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white">Dominant Colors</h3>
                  <p className="text-sm text-gray-500">Median-cut quantization finds the colors that define your footage.</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900 rounded-full flex items-center justify-center mx-auto text-cyan-400">
                    <Copy className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white">Click to Copy</h3>
                  <p className="text-sm text-gray-500">Every swatch copies its HEX code — plus CSS variables export.</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900 rounded-full flex items-center justify-center mx-auto text-cyan-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white">100% Private</h3>
                  <p className="text-sm text-gray-500">Runs entirely in your browser — your video is never uploaded.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* File info */}
              <div className="mb-6 flex items-center justify-between bg-gray-950/60 border border-gray-800 p-4 rounded-xl">
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{videoMeta?.name}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {videoMeta && `${videoMeta.width}×${videoMeta.height} • ${Math.round(videoMeta.duration)}s`}
                  </p>
                </div>
                <button onClick={handleReset} className="text-gray-400 hover:text-white text-sm shrink-0 ml-4">
                  Change video
                </button>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div>
                  <p className="text-gray-300 text-sm font-semibold mb-2">Frames sampled</p>
                  <div className="flex gap-2 flex-wrap">
                    {SAMPLE_OPTIONS.map(n => (
                      <button
                        key={n}
                        onClick={() => setFrameSamples(n)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${frameSamples === n ? 'bg-cyan-500 text-gray-950 border-cyan-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs mt-2">Evenly spaced across the full duration.</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-semibold mb-2">Palette colors</p>
                  <div className="flex gap-2 flex-wrap">
                    {COLOR_OPTIONS.map(n => (
                      <button
                        key={n}
                        onClick={() => setColorCount(n)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${colorCount === n ? 'bg-cyan-500 text-gray-950 border-cyan-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs mt-2">More colors = finer shades, less dominance.</p>
                </div>
              </div>

              {/* Extract button */}
              {!palette && (
                <button
                  onClick={handleExtract}
                  disabled={processing}
                  className="w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-wait text-gray-950 font-bold text-lg transition-colors flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sampling frames… {pct}%
                    </>
                  ) : (
                    <>
                      <Palette className="w-5 h-5" />
                      Extract Color Palette
                    </>
                  )}
                </button>
              )}

              {processing && progress.total > 0 && (
                <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-950/40 border border-red-900 rounded-xl text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Result */}
              {palette && (
                <div className="mt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {palette.map((c, i) => (
                      <button
                        key={c.hex + i}
                        onClick={() => copyText(c.hex, c.hex, i)}
                        className="group rounded-2xl overflow-hidden border border-gray-800 hover:border-cyan-500 transition text-left"
                        title={`Copy ${c.hex}`}
                      >
                        <div className="h-24 w-full flex items-end justify-end p-2" style={{ backgroundColor: c.hex }}>
                          <span className="opacity-0 group-hover:opacity-100 transition bg-black/50 rounded-lg p-1.5 text-white">
                            {copiedIdx === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-950/60">
                          <p className="text-white font-mono text-sm font-semibold">{c.hex}</p>
                          <p className="text-gray-500 font-mono text-xs mt-0.5">{c.rgb}</p>
                          <p className="text-gray-600 text-xs mt-1">{Math.round(c.share * 100)}% of sampled pixels</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      onClick={() => copyText(paletteToCssVars(palette), 'CSS variables')}
                      className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-semibold transition-colors"
                    >
                      Copy as CSS variables
                    </button>
                    <button
                      onClick={() => copyText(paletteToTextList(palette), 'Palette list')}
                      className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm font-semibold transition-colors"
                    >
                      Copy as text list
                    </button>
                    <button
                      onClick={handleDownloadStrip}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-sm font-bold transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PNG strip
                    </button>
                    <button
                      onClick={handleExtract}
                      className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      Re-extract
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoColorPaletteTool;
