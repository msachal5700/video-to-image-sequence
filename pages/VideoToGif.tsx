import React, { useEffect, useState, useCallback, useRef } from 'react';
import GIF from 'gif.js';
import gifWorkerUrl from 'gif.js/dist/gif.worker.js?url';
import { Loader2, CheckCircle2, Download, AlertTriangle, Film } from 'lucide-react';
import Dropzone from '../components/Dropzone';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { extractFramesAndZip, formatBytes } from '../utils/videoProcessor';
import { useToast } from '../components/Toast';

const MAX_FRAMES = 150;
const FPS_OPTIONS = [5, 8, 10, 12, 15];
const WIDTH_OPTIONS = [
  { label: '320 px', value: 320 },
  { label: '480 px', value: 480 },
  { label: '640 px', value: 640 },
  { label: 'Original', value: 0 },
];
const QUALITY_OPTIONS = [
  { label: 'Smaller file', value: 20, hint: 'faster sharing' },
  { label: 'Balanced', value: 10, hint: 'recommended' },
  { label: 'Best quality', value: 1, hint: 'larger file' },
];

type ToolState = 'idle' | 'extracting' | 'encoding' | 'done' | 'error';

interface VideoMeta {
  name: string;
  duration: number;
  width: number;
  height: number;
}

const faqs = [
  {
    q: 'How do I convert a video to GIF online?',
    a: 'Upload your video above, pick a frame rate (FPS) and output width, then click "Convert to GIF". Your video is decoded frame-by-frame right in your browser and encoded into an animated GIF you can download — no upload, no watermark.'
  },
  {
    q: 'Is this video to GIF converter really free? Is there a watermark?',
    a: 'Yes — completely free with no watermark, no sign-up, and no usage limits. Everything runs locally in your browser, so there is nothing to pay for and no branding added to your GIF.'
  },
  {
    q: 'Which video formats can I convert to GIF?',
    a: 'MP4, MOV, and WEBM work best. Other formats like AVI or MKV may work if your browser can decode them, since all processing happens with your browser\u2019s built-in video decoder.'
  },
  {
    q: 'How long can my GIF be?',
    a: 'GIFs are capped at 150 frames to keep file sizes reasonable. At 10 FPS that is about 15 seconds of video. For longer clips, lower the FPS or convert a shorter section — GIFs are meant to be short, looping moments.'
  },
  {
    q: 'How do I make the GIF file smaller?',
    a: 'Choose a smaller output width (320 px), a lower frame rate (5–8 FPS), and the "Smaller file" quality setting. Each of these reduces the GIF size dramatically — most shareable GIFs are under 5 MB.'
  },
  {
    q: 'Is my video uploaded to a server?',
    a: 'No. Your video never leaves your device. Frames are extracted and the GIF is encoded entirely in your browser using local processing, so your footage stays 100% private.'
  }
];

const VideoToGifTool: React.FC = () => {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [fps, setFps] = useState(10);
  const [outWidth, setOutWidth] = useState(480);
  const [quality, setQuality] = useState(10);
  const [loop, setLoop] = useState(true);
  const [toolState, setToolState] = useState<ToolState>('idle');
  const [progress, setProgress] = useState(0);
  const [phaseLabel, setPhaseLabel] = useState('');
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const gifRef = useRef<GIF | null>(null);

  useEffect(() => {
    return () => {
      if (gifUrl) URL.revokeObjectURL(gifUrl);
      if (gifRef.current) { try { gifRef.current.abort(); } catch { /* noop */ } }
    };
  }, [gifUrl]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith('video/')) {
      showToast('Invalid file type. Please select an MP4, MOV, or WEBM video file.', 'error');
      return;
    }
    setFile(selectedFile);
    setGifUrl(null);
    setToolState('idle');
    setErrorMsg(null);
    const video = document.createElement('video');
    video.preload = 'metadata';
    const objectUrl = URL.createObjectURL(selectedFile);
    video.src = objectUrl;
    video.onloadedmetadata = () => {
      setMeta({ name: selectedFile.name, duration: video.duration, width: video.videoWidth, height: video.videoHeight });
      URL.revokeObjectURL(objectUrl);
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      showToast('Could not read video metadata. The file may be corrupted or unsupported.', 'error');
    };
  }, [showToast]);

  const handleReset = useCallback(() => {
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setFile(null);
    setMeta(null);
    setGifUrl(null);
    setGifSize(0);
    setFrameCount(0);
    setProgress(0);
    setToolState('idle');
    setErrorMsg(null);
  }, [gifUrl]);

  const estimatedFrames = meta ? Math.min(Math.floor(meta.duration * fps), MAX_FRAMES) : 0;

  const handleConvert = useCallback(async () => {
    if (!file) return;
    setToolState('extracting');
    setProgress(0);
    setPhaseLabel('Extracting frames…');
    setErrorMsg(null);

    const blobs: Blob[] = [];
    try {
      await extractFramesAndZip({
        file,
        fps,
        format: 'jpg',
        quality: 0.85,
        maxFrames: MAX_FRAMES,
        onProgress: (stats) => setProgress(Math.round(stats.progress * 0.6)),
        onFrame: (blob) => { blobs.push(blob); },
      });

      if (blobs.length === 0) throw new Error('No frames could be extracted from this video.');

      setToolState('encoding');
      setPhaseLabel('Encoding GIF…');

      // Decode frames and encode with gif.js
      const firstBitmap = await createImageBitmap(blobs[0]);
      const scale = outWidth === 0 ? 1 : Math.min(1, outWidth / firstBitmap.width);
      const w = Math.round(firstBitmap.width * scale);
      const h = Math.round(firstBitmap.height * scale);
      firstBitmap.close();

      const gif = new GIF({
        workers: 2,
        quality,
        width: w,
        height: h,
        workerScript: gifWorkerUrl,
        repeat: loop ? 0 : -1,
      });
      gifRef.current = gif;

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context is not available in this browser.');

      const delay = Math.round(1000 / fps);
      for (const blob of blobs) {
        const bitmap = await createImageBitmap(blob);
        ctx.drawImage(bitmap, 0, 0, w, h);
        bitmap.close();
        gif.addFrame(ctx, { copy: true, delay });
      }
      setFrameCount(blobs.length);

      gif.on('progress', (p: number) => setProgress(Math.round(60 + p * 40)));
      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setGifUrl(url);
        setGifSize(blob.size);
        setProgress(100);
        setToolState('done');
        showToast('Your GIF is ready to download!', 'success');
      });
      gif.render();
    } catch (err) {
      console.error('GIF conversion failed:', err);
      const msg = err instanceof Error ? err.message : 'Conversion failed.';
      setErrorMsg(msg.includes(':') ? msg.split(':').slice(1).join(':').trim() : 'We could not convert this video. The format may be unsupported by your browser.');
      setToolState('error');
    }
  }, [file, fps, outWidth, quality, loop, showToast]);

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl shadow-black/50 p-1">
        {!file ? (
          <div className="p-8 bg-gray-900/50 rounded-2xl">
            <Dropzone onFileSelect={handleFileSelect} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 mb-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900 rounded-full flex items-center justify-center mx-auto text-cyan-400 font-bold text-xl">🔒</div>
                <h3 className="font-semibold text-white">No Server Uploads</h3>
                <p className="text-sm text-gray-500">Your video never leaves your device. Everything runs in your browser.</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900 rounded-full flex items-center justify-center mx-auto text-cyan-400 font-bold text-xl">🎞️</div>
                <h3 className="font-semibold text-white">Real Animated GIFs</h3>
                <p className="text-sm text-gray-500">Proper frame timing, loop control, and quality settings.</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-900 rounded-full flex items-center justify-center mx-auto text-cyan-400 font-bold text-xl">🚫</div>
                <h3 className="font-semibold text-white">No Watermark</h3>
                <p className="text-sm text-gray-500">Free forever. No sign-up, no branding on your GIFs.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-8 bg-gray-900/50 rounded-2xl">
            {toolState === 'idle' && meta && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-3">
                  <span className="text-gray-300 font-medium flex items-center gap-2 truncate">
                    <Film className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span className="truncate">{meta.name}</span>
                  </span>
                  <button onClick={handleReset} className="text-gray-400 hover:text-white text-sm shrink-0 ml-3">Remove</button>
                </div>
                <p className="text-gray-500 text-sm">
                  {meta.width}×{meta.height} • {meta.duration.toFixed(1)}s • ≈ {estimatedFrames} frames{estimatedFrames >= MAX_FRAMES ? ` (capped at ${MAX_FRAMES})` : ''}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Frame rate</label>
                    <div className="flex flex-wrap gap-2">
                      {FPS_OPTIONS.map(v => (
                        <button key={v} onClick={() => setFps(v)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${fps === v ? 'bg-cyan-500 text-gray-950 border-cyan-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700'}`}>
                          {v} FPS
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Higher FPS = smoother, larger GIF.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">GIF width</label>
                    <div className="flex flex-wrap gap-2">
                      {WIDTH_OPTIONS.map(o => (
                        <button key={o.label} onClick={() => setOutWidth(o.value)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${outWidth === o.value ? 'bg-cyan-500 text-gray-950 border-cyan-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700'}`}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Smaller width = much smaller file.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Quality</label>
                    <div className="flex flex-wrap gap-2">
                      {QUALITY_OPTIONS.map(o => (
                        <button key={o.label} onClick={() => setQuality(o.value)} title={o.hint}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${quality === o.value ? 'bg-cyan-500 text-gray-950 border-cyan-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700'}`}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Playback</label>
                    <button onClick={() => setLoop(!loop)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${loop ? 'bg-cyan-500 text-gray-950 border-cyan-500' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-cyan-700'}`}>
                      {loop ? '🔁 Loop forever' : '▶️ Play once'}
                    </button>
                  </div>
                </div>

                <button onClick={handleConvert}
                  className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-950 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.01] shadow-lg shadow-cyan-500/20">
                  Convert to GIF
                </button>
              </div>
            )}

            {(toolState === 'extracting' || toolState === 'encoding') && (
              <div className="py-10 px-4 text-center space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display flex items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                  {phaseLabel}
                </h3>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700 max-w-xl mx-auto">
                  <div className="bg-cyan-400 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-gray-400 font-mono text-sm">{progress}%</p>
                <p className="text-gray-500 text-xs max-w-md mx-auto">Encoding happens locally in your browser — larger GIFs take a little longer.</p>
              </div>
            )}

            {toolState === 'error' && (
              <div className="text-center space-y-4 py-8">
                <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">Conversion failed</h3>
                <p className="text-gray-400 text-sm max-w-lg mx-auto">{errorMsg}</p>
                <div className="flex justify-center gap-3">
                  <button onClick={handleReset} className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors">Start over</button>
                  <button onClick={handleConvert} className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 rounded-xl font-bold transition-colors">Try again</button>
                </div>
              </div>
            )}

            {toolState === 'done' && gifUrl && (
              <div className="space-y-6 animate-fade-in text-center py-4">
                <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-3 font-display">
                  <CheckCircle2 className="w-7 h-7 text-cyan-400" />
                  Your GIF is ready
                </h3>
                <div className="flex justify-center">
                  <img src={gifUrl} alt="Converted GIF preview" className="max-h-80 rounded-2xl border border-gray-700 shadow-2xl" />
                </div>
                <p className="text-gray-400 text-sm">{frameCount} frames • {formatBytes(gifSize)} • {loop ? 'loops forever' : 'plays once'}</p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <a href={gifUrl} download={`${(meta?.name || 'video').replace(/\.[^.]+$/, '')}.gif`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-950 rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20 text-lg">
                    <Download className="w-5 h-5" /> Download GIF
                  </a>
                  <button onClick={handleReset} className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-all border border-gray-700">
                    Convert another
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


const VideoToGif: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('video-to-gif-schemas');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-to-gif-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Video to GIF Converter — Free Online GIF Maker",
      "url": "https://www.videotoimagesequence.online/video-to-gif",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Convert video to GIF free in your browser. Turn MP4, MOV, WEBM clips into high-quality animated GIFs online. No upload, no watermark, 100% private.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video Converter",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5, WebAssembly and Javascript support",
      "featureList": [
        "Convert MP4, MOV, WEBM videos to animated GIFs",
        "Adjustable frame rate (5–15 FPS) and GIF width",
        "Loop forever or play-once playback control",
        "Quality presets to balance size and fidelity",
        "Process videos entirely in your browser (100% private)",
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
      "name": "How to Convert Video to GIF",
      "description": "Step-by-step instructions for turning a video clip into an animated GIF locally inside your web browser.",
      "totalTime": "PT1M",
      "step": [
        { "@type": "HowToStep", "name": "Load Your Video File", "text": "Drag and drop your MP4, MOV, or WEBM video file into the browser-based upload zone." },
        { "@type": "HowToStep", "name": "Choose Frame Rate and Size", "text": "Pick an FPS (5–15) and GIF width. Lower values make smaller, more shareable GIFs." },
        { "@type": "HowToStep", "name": "Set Loop Playback", "text": "Choose loop-forever for classic GIF behavior or play-once for a single pass." },
        { "@type": "HowToStep", "name": "Convert to GIF", "text": "Click Convert to GIF — frames are extracted and encoded locally in your browser." },
        { "@type": "HowToStep", "name": "Download Your GIF", "text": "Preview the animated result and download it with no watermark." }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => { const el = document.getElementById('video-to-gif-schemas'); if (el) el.remove(); };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('videoToGif.title')}
        description={t('videoToGif.description')}
        canonical="https://www.videotoimagesequence.online/video-to-gif"
        ogTitle={t('videoToGif.title')}
        ogDescription={t('videoToGif.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoToGif.keywords')}
      />

      <Breadcrumb items={[{ label: 'Video to GIF', path: '/video-to-gif' }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoToGif.h1')}<br />
          <span className="text-cyan-400">{t('videoToGif.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoToGif.hero')}
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['🔒 100% Private', '⚡ Local Processing', '🎞️ Animated GIF', '🔁 Loop Control', '🚫 No Watermark', '🆓 Free Forever'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">{badge}</span>
          ))}
        </div>
      </section>

      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToGifTool />
      </div>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Why Convert Video to GIF?</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 leading-relaxed">
            GIFs remain the universal language of the internet — they autoplay everywhere, need no player, and loop perfectly. Turning a video moment into a GIF makes it instantly shareable:
          </p>
          <ul className="space-y-3 text-gray-300 list-disc pl-6">
            <li><strong className="text-white">Shareable anywhere</strong> — GIFs work in chats, comments, emails, and forums where video uploads are blocked or heavy.</li>
            <li><strong className="text-white">No player needed</strong> — they animate inline on every device and platform, from Discord to Slack to X.</li>
            <li><strong className="text-white">Perfect loops</strong> — reactions, memes, and demos land harder when they repeat seamlessly.</li>
            <li><strong className="text-white">Lightweight</strong> — a trimmed, well-compressed GIF is a fraction of the original video's size.</li>
            <li><strong className="text-white">Private by design here</strong> — unlike server-side converters, your clip never leaves your device.</li>
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">How to Make a GIF from Video Online</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload your video file', desc: 'Drag and drop or click to select your MP4, MOV, or WEBM video.' },
              { num: '2', title: 'Choose frame rate and size', desc: 'Pick 5–15 FPS and a GIF width. Lower values = smaller, more shareable files.' },
              { num: '3', title: 'Set loop playback', desc: 'Loop forever for classic GIF behavior, or play once for a single pass.' },
              { num: '4', title: 'Convert to GIF', desc: 'Click "Convert to GIF" — frames are extracted and encoded locally in your browser.' },
              { num: '5', title: 'Download your GIF', desc: 'Preview the animation and download it instantly. No watermark, ever.' },
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
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Supported Video Formats</h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          Best supported: MP4, MOV, and WEBM. Other formats such as AVI or MKV may work only when your browser supports the video codec.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['MP4', 'MOV', 'WEBM'].map(format => (
            <div key={format} className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
              <p className="text-cyan-400 font-bold text-lg">{format}</p>
              <p className="text-gray-500 text-xs mt-1">Best Supported</p>
            </div>
          ))}
          {['AVI', 'MKV'].map(format => (
            <div key={format} className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center opacity-60">
              <p className="text-gray-400 font-bold text-lg">{format}</p>
              <p className="text-gray-500 text-xs mt-1">Codec Dependent</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">⚠️ Browser Processing Notice</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support. GIFs are capped at 150 frames to keep encoding fast and file sizes shareable — for longer clips, use a lower frame rate.
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
          <Link to="/mp4-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">MP4 to JPG</h3>
            <p className="text-gray-500 text-xs">Convert MP4 videos into high-quality JPGs.</p>
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

export default VideoToGif;
