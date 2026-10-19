import React, { useEffect, useRef, useState } from 'react';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import JSZip from 'jszip';

const faqs = [
  {
    q: 'How do I extract frames from a GIF?',
    a: 'Drop your GIF file onto the box above (or click to browse for it). The tool decodes every frame of the animation right in your browser and shows them in a grid. Download any single frame as JPG, PNG, or WebP — or hit "Download all as ZIP" to grab the whole sequence at once. Nothing is uploaded anywhere.'
  },
  {
    q: 'Is this GIF to frames converter free? Do I need an account?',
    a: 'Completely free, no account, no signup, no watermark. It runs entirely in your browser using your own device\u2019s processing power, so there are no servers involved and no usage quotas to hit.'
  },
  {
    q: 'Does it work with animated WebP files too?',
    a: 'Yes. Drop an animated WebP and each of its frames is decoded and listed the same way as a GIF, including per-frame timing and transparency. If your WebP is a still image (not animated), you\u2019ll simply get its one frame to download or convert.'
  },
  {
    q: 'What image formats can I download the frames in?',
    a: 'PNG (lossless, keeps transparency), JPG (smaller files, great for photos and sharing), or WebP (modern, compact). Pick the format before downloading — single frames and the ZIP both use whatever you selected.'
  },
  {
    q: 'Is there a limit on GIF size or frame count?',
    a: 'Files up to 50 MB are accepted and up to 400 frames are extracted per file, which covers virtually every GIF and animated WebP in the wild — most are under 100 frames. Because decoding happens on your device, a very large file just takes a few extra seconds; it never hits a server-side timeout.'
  },
  {
    q: 'Do you upload my GIF to a server?',
    a: 'No. The file never leaves your device. Decoding, compositing, and ZIP creation all happen locally in your browser tab. Close the tab and nothing remains — there is nothing to delete because nothing was ever stored.'
  },
  {
    q: 'Can I extract frames from a GIF URL instead of a file?',
    a: 'Not directly — browsers block web pages from fetching arbitrary image URLs, so paste-a-link isn\u2019t possible here. Download the GIF to your device first (right-click → "Save image as…"), then drop the file into the tool. It takes five seconds.'
  },
  {
    q: 'What\u2019s the difference between this and your Video to GIF tool?',
    a: 'They\u2019re opposites. Video to GIF turns a video file into an animated GIF. This page does the reverse: it takes an existing GIF or animated WebP and pulls it apart into its individual still frames as downloadable images.'
  }
];

type ExtractedFrame = {
  blob: Blob;          // PNG master blob (lossless)
  previewUrl: string;  // object URL for the grid thumbnail
  delayMs: number;
  width: number;
  height: number;
};

type OutputFormat = 'png' | 'jpeg' | 'webp';

const MAX_FILE_BYTES = 50 * 1024 * 1024;
const MAX_FRAMES = 400;

function detectKind(bytes: Uint8Array): 'gif' | 'webp' | 'unknown' {
  if (bytes.length > 3 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'gif';
  if (
    bytes.length > 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) return 'webp';
  return 'unknown';
}

function isAnimatedWebp(bytes: Uint8Array): boolean {
  for (let i = 12; i + 4 <= bytes.length; i++) {
    if (bytes[i] === 0x41 && bytes[i + 1] === 0x4e && bytes[i + 2] === 0x49 && bytes[i + 3] === 0x4d) return true;
  }
  return false;
}

function clearRect(data: Uint8ClampedArray, canvasW: number, left: number, top: number, w: number, h: number, canvasH: number) {
  const x0 = Math.max(0, left), y0 = Math.max(0, top);
  const x1 = Math.min(canvasW, left + w), y1 = Math.min(canvasH, top + h);
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * canvasW + x) * 4;
      data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 0;
    }
  }
}

/** Composite GIF frames honoring disposal methods. Returns full-canvas RGBA snapshots. */
async function decodeGifFrames(arrayBuffer: ArrayBuffer): Promise<{ width: number; height: number; frames: { data: ImageData; delayMs: number }[] }> {
  const { parseGIF, decompressFrames } = await import('gifuct-js');
  const gif = parseGIF(arrayBuffer);
  const w = gif.lsd.width, h = gif.lsd.height;
  if (!w || !h) throw new Error('Could not read GIF dimensions.');
  const parsed = decompressFrames(gif, true);
  const canvas = new Uint8ClampedArray(w * h * 4); // transparent
  const out: { data: ImageData; delayMs: number }[] = [];
  let prevDisposal = 1;
  let prevDims = { left: 0, top: 0, width: w, height: h };
  for (const f of parsed) {
    if (out.length > 0 && (prevDisposal === 2 || prevDisposal === 3)) {
      clearRect(canvas, w, prevDims.left, prevDims.top, prevDims.width, prevDims.height, h);
    }
    const { left, top, width, height } = f.dims;
    const patch = f.patch;
    for (let y = 0; y < height; y++) {
      const dy = top + y;
      if (dy < 0 || dy >= h) continue;
      for (let x = 0; x < width; x++) {
        const dx = left + x;
        if (dx < 0 || dx >= w) continue;
        const si = (y * width + x) * 4;
        if (patch[si + 3] === 0) continue; // transparent pixel: keep what's underneath
        const di = (dy * w + dx) * 4;
        canvas[di] = patch[si];
        canvas[di + 1] = patch[si + 1];
        canvas[di + 2] = patch[si + 2];
        canvas[di + 3] = patch[si + 3];
      }
    }
    out.push({ data: new ImageData(new Uint8ClampedArray(canvas), w, h), delayMs: f.delay });
    if (out.length >= MAX_FRAMES) break;
    prevDisposal = f.disposalType;
    prevDims = f.dims;
  }
  if (out.length === 0) throw new Error('No frames found in this GIF.');
  return { width: w, height: h, frames: out };
}

/** Composite animated WebP frames honoring blend/dispose. Returns full-canvas RGBA snapshots. */
async function decodeAnimatedWebp(arrayBuffer: ArrayBuffer): Promise<{ width: number; height: number; frames: { data: ImageData; delayMs: number }[] }> {
  const { decodeAnimation } = await import('@stacksjs/ts-webp');
  const anim = decodeAnimation(new Uint8Array(arrayBuffer));
  const w = anim.width, h = anim.height;
  const canvas = new Uint8ClampedArray(w * h * 4);
  const out: { data: ImageData; delayMs: number }[] = [];
  let prev: { x: number; y: number; w: number; h: number; dispose: string } | null = null;
  for (const f of anim.frames) {
    if (prev && prev.dispose === 'background') {
      clearRect(canvas, w, prev.x, prev.y, prev.w, prev.h, h);
    }
    const fw = f.image.width, fh = f.image.height;
    const src = f.image.data; // RGBA
    if (f.blend === 'replace') {
      clearRect(canvas, w, f.x, f.y, fw, fh, h);
    }
    for (let y = 0; y < fh; y++) {
      const dy = f.y + y;
      if (dy < 0 || dy >= h) continue;
      for (let x = 0; x < fw; x++) {
        const dx = f.x + x;
        if (dx < 0 || dx >= w) continue;
        const si = (y * fw + x) * 4;
        const di = (dy * w + dx) * 4;
        if (f.blend === 'replace') {
          canvas[di] = src[si]; canvas[di + 1] = src[si + 1];
          canvas[di + 2] = src[si + 2]; canvas[di + 3] = src[si + 3];
        } else {
          const sa = src[si + 3] / 255;
          if (sa === 0) continue;
          const da = canvas[di + 3] / 255;
          const outA = sa + da * (1 - sa);
          if (outA === 0) continue;
          canvas[di] = Math.round((src[si] * sa + canvas[di] * da * (1 - sa)) / outA);
          canvas[di + 1] = Math.round((src[si + 1] * sa + canvas[di + 1] * da * (1 - sa)) / outA);
          canvas[di + 2] = Math.round((src[si + 2] * sa + canvas[di + 2] * da * (1 - sa)) / outA);
          canvas[di + 3] = Math.round(outA * 255);
        }
      }
    }
    out.push({ data: new ImageData(new Uint8ClampedArray(canvas), w, h), delayMs: f.duration });
    if (out.length >= MAX_FRAMES) break;
    prev = { x: f.x, y: f.y, w: fw, h: fh, dispose: f.dispose };
  }
  if (out.length === 0) throw new Error('No frames found in this WebP.');
  return { width: w, height: h, frames: out };
}

/** Fallback for still (non-animated) images: single frame via native decode. */
async function decodeStillImage(arrayBuffer: ArrayBuffer, mime: string): Promise<{ width: number; height: number; frames: { data: ImageData; delayMs: number }[] }> {
  const bmp = await createImageBitmap(new Blob([arrayBuffer], { type: mime }));
  const c = document.createElement('canvas');
  c.width = bmp.width; c.height = bmp.height;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(bmp, 0, 0);
  const data = ctx.getImageData(0, 0, bmp.width, bmp.height);
  bmp.close();
  return { width: bmp.width, height: bmp.height, frames: [{ data, delayMs: 0 }] };
}

async function imageDataToPngBlob(data: ImageData): Promise<Blob> {
  const c = document.createElement('canvas');
  c.width = data.width; c.height = data.height;
  c.getContext('2d')!.putImageData(data, 0, 0);
  return new Promise((res, rej) => c.toBlob(b => (b ? res(b) : rej(new Error('PNG encode failed'))), 'image/png'));
}

async function blobToImageData(blob: Blob): Promise<ImageData> {
  const bmp = await createImageBitmap(blob);
  const c = document.createElement('canvas');
  c.width = bmp.width; c.height = bmp.height;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(bmp, 0, 0);
  const data = ctx.getImageData(0, 0, bmp.width, bmp.height);
  bmp.close();
  return data;
}

async function convertBlob(blob: Blob, format: OutputFormat): Promise<Blob> {
  if (format === 'png') return blob;
  const data = await blobToImageData(blob);
  const c = document.createElement('canvas');
  c.width = data.width; c.height = data.height;
  const ctx = c.getContext('2d')!;
  if (format === 'jpeg') {
    // JPEG has no alpha: composite over white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
  }
  ctx.putImageData(data, 0, 0);
  const mime = format === 'jpeg' ? 'image/jpeg' : 'image/webp';
  return new Promise((res, rej) =>
    c.toBlob(b => (b ? res(b) : rej(new Error('Encode failed'))), mime, 0.92)
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 8000);
}

const extFor = (f: OutputFormat) => (f === 'png' ? 'png' : f === 'jpeg' ? 'jpg' : 'webp');
const pad3 = (n: number) => String(n).padStart(3, '0');

const GifToFrames: React.FC = () => {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'decoding' | 'ready' | 'error'>('idle');
  const [error, setError] = useState('');
  const [frames, setFrames] = useState<ExtractedFrame[]>([]);
  const [fileName, setFileName] = useState('');
  const [format, setFormat] = useState<OutputFormat>('png');
  const [zipping, setZipping] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [capped, setCapped] = useState(false);

  useEffect(() => {
    return () => {
      frames.forEach(f => URL.revokeObjectURL(f.previewUrl));
    };
  }, [frames]);

  const webAppSchema = {
    '@type': 'WebApplication',
    name: 'GIF to Frames — Free Online Extractor',
    url: 'https://www.videotoimagesequence.online/gif-to-frames',
    image: 'https://www.videotoimagesequence.online/og-image.png',
    description: 'Extract every frame from any GIF or animated WebP free in your browser. Download frames as JPG, PNG, or WebP, or all at once as a ZIP.',
    applicationCategory: 'MultimediaApplication',
    applicationSubCategory: 'GIF to Frames Converter',
    operatingSystem: 'All — Browser-based (Chrome, Firefox, Safari, Edge)',
    browserRequirements: 'Requires HTML5 and Javascript support',
    featureList: [
      'Extract every frame from animated GIF and WebP files',
      'Download frames as PNG, JPG, or WebP',
      'One-click ZIP download of the full sequence',
      'Honest frame timing and transparency handling',
      '100% browser-based — nothing uploaded or stored',
      'Free forever, no account, no watermark'
    ],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };

  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a }
    }))
  };

  const howToSchema = {
    '@type': 'HowTo',
    name: 'How to Extract Frames from a GIF',
    description: 'Pull every frame out of an animated GIF or WebP as downloadable images, free in your browser.',
    totalTime: 'PT1M',
    step: [
      { '@type': 'HowToStep', name: 'Drop in your GIF or WebP', text: 'Drag the animated file onto the upload box, or click to browse. Files up to 50 MB are accepted.' },
      { '@type': 'HowToStep', name: 'Review the extracted frames', text: 'Every frame is decoded locally and shown in a grid with its timing, ready to preview.' },
      { '@type': 'HowToStep', name: 'Download frames or the ZIP', text: 'Save any single frame as PNG, JPG, or WebP — or download the entire sequence as one ZIP file.' }
    ]
  };

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.videotoimagesequence.online/' },
      { '@type': 'ListItem', position: 2, name: 'GIF to Frames', item: 'https://www.videotoimagesequence.online/gif-to-frames' }
    ]
  };

  const orgSchema = {
    '@type': 'Organization',
    name: 'Video to Image Sequence Online',
    url: 'https://www.videotoimagesequence.online',
    logo: { '@type': 'ImageObject', url: 'https://www.videotoimagesequence.online/favicon.svg', width: 32, height: 32 },
    description: 'Free online video frame extraction tool. Convert MP4, MOV, and WEBM videos to image sequences in your browser.',
    sameAs: ['https://x.com/videotoimage']
  };

  const pageSchemas = {
    "@context": "https://schema.org",
    "@graph": [webAppSchema, faqSchema, howToSchema, breadcrumbSchema, orgSchema]
  };

  const handleFile = async (file: File) => {
    setError('');
    setCapped(false);
    frames.forEach(f => URL.revokeObjectURL(f.previewUrl));
    setFrames([]);
    if (file.size > MAX_FILE_BYTES) {
      setStatus('error');
      setError('That file is over the 50 MB limit. Try a smaller GIF or WebP.');
      return;
    }
    setStatus('decoding');
    setFileName(file.name);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const kind = detectKind(bytes);
      let decoded: { width: number; height: number; frames: { data: ImageData; delayMs: number }[] };
      if (kind === 'gif') {
        decoded = await decodeGifFrames(arrayBuffer);
      } else if (kind === 'webp') {
        if (isAnimatedWebp(bytes)) {
          decoded = await decodeAnimatedWebp(arrayBuffer);
        } else {
          decoded = await decodeStillImage(arrayBuffer, 'image/webp');
        }
      } else {
        throw new Error('That doesn\u2019t look like a GIF or WebP file. Please drop an animated .gif or .webp.');
      }
      const wasCapped = decoded.frames.length >= MAX_FRAMES;
      setCapped(wasCapped);
      const extracted: ExtractedFrame[] = [];
      for (const fr of decoded.frames) {
        const blob = await imageDataToPngBlob(fr.data);
        extracted.push({
          blob,
          previewUrl: URL.createObjectURL(blob),
          delayMs: fr.delayMs,
          width: fr.data.width,
          height: fr.data.height
        });
      }
      setFrames(extracted);
      setStatus('ready');
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Could not decode that file. Try a different GIF or WebP.');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void handleFile(f);
  };

  const downloadOne = async (idx: number) => {
    const fr = frames[idx];
    const blob = await convertBlob(fr.blob, format);
    const base = fileName.replace(/\.(gif|webp)$/i, '') || 'frames';
    downloadBlob(blob, `${base}-frame-${pad3(idx + 1)}.${extFor(format)}`);
  };

  const downloadZip = async () => {
    if (frames.length === 0 || zipping) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      const base = fileName.replace(/\.(gif|webp)$/i, '') || 'frames';
      for (let i = 0; i < frames.length; i++) {
        const blob = await convertBlob(frames[i].blob, format);
        zip.file(`${base}-frame-${pad3(i + 1)}.${extFor(format)}`, blob);
      }
      const out = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
      downloadBlob(out, `${base}-frames.zip`);
    } finally {
      setZipping(false);
    }
  };

  const totalMs = frames.reduce((s, f) => s + f.delayMs, 0);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <script type="application/ld+json">
        {JSON.stringify(pageSchemas)}
      </script>
      <SEOHead
        title={t('gifToFrames.title')}
        description={t('gifToFrames.description')}
        canonical="https://www.videotoimagesequence.online/gif-to-frames"
        ogTitle={t('gifToFrames.title')}
        ogDescription={t('gifToFrames.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('gifToFrames.keywords')}
      />

      <Breadcrumb items={[{ label: 'GIF to Frames', path: '/gif-to-frames' }]} />

      {/* ── HERO ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('gifToFrames.h1')}<br />
          <span className="text-cyan-400">{t('gifToFrames.h1Sub')}</span>
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('gifToFrames.hero')}
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {[t('badges.private'), t('badges.fast'), t('badges.free')].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* ── TOOL WIDGET ── */}
      <section className="max-w-5xl mx-auto px-4 mb-4">
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition ${dragOver ? 'border-cyan-400 bg-cyan-950/20' : 'border-gray-700 bg-gray-900/50 hover:border-cyan-600'}`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".gif,.webp,image/gif,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); e.target.value = ''; }}
          />
          <p className="text-white font-semibold text-lg mb-2">
            {status === 'decoding' ? 'Decoding frames…' : 'Drop your GIF or animated WebP here'}
          </p>
          <p className="text-gray-500 text-sm">
            or click to browse — files stay on your device, up to 50&nbsp;MB
          </p>
          {status === 'decoding' && (
            <div className="mt-6 mx-auto w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full animate-pulse w-full" />
            </div>
          )}
        </div>
        {status === 'error' && (
          <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
        )}

        {status === 'ready' && frames.length > 0 && (
          <div className="mt-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div>
                <p className="text-white font-semibold">{fileName}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {frames.length} frame{frames.length === 1 ? '' : 's'} · {frames[0].width}×{frames[0].height}px
                  {totalMs > 0 && <> · {(totalMs / 1000).toFixed(1)}s animation</>}
                </p>
                {capped && (
                  <p className="text-amber-400/90 text-xs mt-1">
                    Showing the first {MAX_FRAMES} frames (file had more).
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-gray-400 text-sm" htmlFor="gtf-format">Format</label>
                <select
                  id="gtf-format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as OutputFormat)}
                  className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="png">PNG (lossless)</option>
                  <option value="jpeg">JPG (smaller)</option>
                  <option value="webp">WebP (modern)</option>
                </select>
                <button
                  onClick={downloadZip}
                  disabled={zipping}
                  className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold px-5 py-2.5 rounded-xl transition disabled:opacity-50 text-sm"
                >
                  {zipping ? 'Zipping…' : `Download all as ZIP (${frames.length})`}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {frames.map((fr, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-3 hover:border-cyan-700 transition">
                  <div
                    className="rounded-xl overflow-hidden mb-2 flex items-center justify-center bg-gray-950"
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(-45deg, #1f2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f2937 75%), linear-gradient(-45deg, transparent 75%, #1f2937 75%)',
                      backgroundSize: '16px 16px',
                      backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0'
                    }}
                  >
                    <img src={fr.previewUrl} alt={`GIF frame ${i + 1}`} className="w-full h-28 object-contain" loading="lazy" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">
                      #{pad3(i + 1)}{fr.delayMs > 0 && <> · {fr.delayMs}ms</>}
                    </span>
                    <button
                      onClick={() => void downloadOne(i)}
                      className="text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-cyan-500/40 hover:bg-cyan-500/10 px-3 py-1.5 rounded-lg transition"
                    >
                      {extFor(format).toUpperCase()}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── WHY EXTRACT FRAMES FROM A GIF ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Why Pull Frames Out of a GIF?
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          A GIF looks like one moving picture, but it&rsquo;s really a flipbook: dozens or hundreds of still images played in quick succession. Sometimes you don&rsquo;t want the flipbook — you want one perfect page from it. Meme makers grab the exact reaction frame. Designers harvest a clean still for a thumbnail or slide. Developers pull frames to build sprite sheets for games. Researchers and ML folks turn GIFs into labeled frame sets for datasets. In every case, the job is the same: open the animation, pick the frames, save them as real images.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          Doing that by hand is miserable — screenshotting a moving GIF frame-by-frame, trying to pause at the right millisecond. Dedicated desktop software can do it, but it means installing something, and most online &ldquo;GIF to frames&rdquo; tools make you upload your file to a stranger&rsquo;s server first and wait in a queue.
        </p>
        <p className="text-gray-400 leading-relaxed">
          This page takes the direct route: your GIF is decoded frame-by-frame inside your own browser tab. You see every frame laid out in a grid with its timing, download the ones you want as PNG, JPG, or WebP — or take the whole sequence home as a single ZIP. No upload, no account, no watermark, no waiting room.
        </p>
      </section>

      {/* ── HOW TO ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Extract Frames from a GIF in 3 Steps
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Drop in your GIF or animated WebP', desc: 'Drag the file onto the upload box above, or click to browse. Files up to 50 MB are accepted, and decoding starts instantly — on your device, not a server.' },
              { num: '2', title: 'Browse every frame', desc: 'Each frame is decoded with its original timing and transparency intact, then laid out in a grid. Hover the checkerboard previews to see exactly what each frame holds.' },
              { num: '3', title: 'Download frames or the ZIP', desc: 'Pick PNG for lossless quality, JPG for small files, or WebP for the modern middle ground. Save frames one by one, or download the entire sequence as a single ZIP.' },
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

      <div className="max-w-5xl mx-auto px-4">
        <GoogleAdUnit />
      </div>

      {/* ── GIF VS WEBP ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          GIF vs Animated WebP: What You&rsquo;re Actually Opening
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          GIF is the 1987 classic: at most 256 colors per frame, but with real transparency and near-universal support. That limited palette is why GIFs get that crunchy, dithered look on gradients — and why their frames compress so well as PNGs. Animated WebP is the modern successor: full 24-bit color, better compression, and proper alpha transparency, which is why messaging apps and modern sites increasingly ship WebP instead of GIF.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          Under the hood they store animation very differently. GIF frames are often tiny &ldquo;patches&rdquo; — only the pixels that changed since the last frame — plus instructions about what to do with the old pixels (keep them, clear them, or restore what was there before). WebP frames carry their own blend and dispose rules per frame. This tool honors all of that during decoding, so frame 37 looks exactly like frame 37 did in the original animation — not a smeared composite of everything before it. Cheaper tools that just screenshot a playing GIF can&rsquo;t promise that.
        </p>
        <p className="text-gray-400 leading-relaxed">
          One practical note: if you download frames as JPG, transparency is flattened onto white (JPG has no alpha channel). Keep PNG or WebP if you need the transparent background intact for compositing work.
        </p>
      </section>

      {/* ── USE CASES ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          What People Use GIF Frames For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Memes &amp; reaction images</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Grab the single perfect frame — the eye-roll, the slow clap — and caption it. One clean still beats a blurry screen recording every time.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Design assets &amp; thumbnails</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Pull a crisp still for a video thumbnail, slide deck, or article header without re-rendering anything.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Game sprite sheets</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Developers extract animation frames as numbered PNGs — the raw material for sprite sheets in Unity, Godot, or GameMaker.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">AI &amp; ML datasets</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Turn animated samples into labeled frame sets for training data, with consistent naming (frame-001, frame-002…) that pipelines expect.</p>
          </div>
        </div>
      </section>

      {/* ── TROUBLESHOOTING ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Troubleshooting Common Issues
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">&ldquo;Doesn&rsquo;t look like a GIF or WebP&rdquo; error</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The file&rsquo;s contents didn&rsquo;t match either format — it may have the wrong extension, or be a video file renamed to .gif (common with downloads from social apps). Try our <Link to="/video-to-frames" className="text-cyan-400 hover:underline">video frame extractor</Link> for actual video files.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Frames look wrong or smeared</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Some GIFs use exotic disposal methods or corrupted frame headers. The decoder follows the spec&rsquo;s keep/clear/restore rules, which handles the overwhelming majority of files — but a hand-crafted or damaged GIF can still confuse any decoder. Re-exporting it from any image editor usually fixes the file itself.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Only the first frame appeared</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your &ldquo;animated&rdquo; file probably isn&rsquo;t animated — many .webp files are single still images. That&rsquo;s fine: you still get the one frame to download or convert to another format.
            </p>
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Frame Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/video-to-gif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to GIF</h3>
            <p className="text-gray-500 text-xs">The reverse trip: turn video clips into animated GIFs.</p>
          </Link>
          <Link to="/video-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to Frames</h3>
            <p className="text-gray-500 text-xs">Extract still frames from MP4, MOV, and WebM video.</p>
          </Link>
          <Link to="/images-to-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Images to Video</h3>
            <p className="text-gray-500 text-xs">Stitch extracted frames back into a video file.</p>
          </Link>
          <Link to="/video-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to PNG</h3>
            <p className="text-gray-500 text-xs">Lossless PNG frames with transparency support.</p>
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-display">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="border border-gray-800 bg-gray-900/50 rounded-xl p-5 cursor-pointer group hover:border-cyan-800 transition-colors">
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

export default GifToFrames;
