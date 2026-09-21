import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ExtractFrameEveryNSecondsProps {
  seconds: 1 | 5 | 10 | 30;
}

const slugFor = (s: number): string =>
  s === 1 ? 'extract-frame-every-1-second' : `extract-frame-every-${s}-seconds`;

/** Cadence-specific talking points so each landing page reads uniquely. */
const cadenceDetail = (s: number): { perMinute: number; useCase: string; example: string } => {
  switch (s) {
    case 1:
      return {
        perMinute: 60,
        useCase: 'dense, near-frame-by-frame sampling — great for slow-motion analysis, sports form checks, and building compact AI training sets without the bloat of full-FPS extraction',
        example: 'a 60-second clip gives you about 60 evenly spaced stills',
      };
    case 5:
      return {
        perMinute: 12,
        useCase: 'thumbnail hunting, storyboard creation, and quick visual summaries — you see every important moment without scrolling through hundreds of near-identical frames',
        example: 'a 60-second clip gives you about 12 evenly spaced stills',
      };
    case 10:
      return {
        perMinute: 6,
        useCase: 'timelapse previews, contact sheets, and lecture or webinar summarization — one glance tells you what happened across minutes of footage',
        example: 'a 60-second clip gives you about 6 evenly spaced stills',
      };
    default:
      return {
        perMinute: 2,
        useCase: 'long recordings, surveillance-style sampling, and progress documentation — distill hours of footage into a handful of representative frames',
        example: 'a 60-second clip gives you about 2 evenly spaced stills',
      };
  }
};

const OTHER_CADENCES: Array<1 | 5 | 10 | 30> = [1, 5, 10, 30];

const ExtractFrameEveryNSeconds: React.FC<ExtractFrameEveryNSecondsProps> = ({ seconds }) => {
  const { t } = useTranslation();
  const plural = seconds === 1 ? '' : 's';
  const slug = slugFor(seconds);
  const url = `https://www.videotoimagesequence.online/${slug}`;
  const detail = cadenceDetail(seconds);
  const interp = { n: seconds, plural };

  const faqs = [
    {
      q: `How do I extract a frame every ${seconds} second${plural} from a video?`,
      a: `Upload your video above — the “Every N Seconds” extraction mode is already selected with a ${seconds}-second interval. Pick JPG, PNG, or WebP output and click “Extract Frames Now”. Your video is decoded frame-by-frame right in your browser and the stills download as a ZIP — no upload, no watermark.`
    },
    {
      q: `How many frames will I get with a ${seconds}-second interval?`,
      a: `Roughly one frame per ${seconds} seconds of footage, so ${detail.example} (${detail.perMinute} frames per minute of video). If the interval is longer than the clip itself you still get the opening frame, never an empty result.`
    },
    {
      q: `When should I use every-${seconds}-seconds instead of FPS extraction?`,
      a: `Use a fixed time interval when you want predictable, evenly spaced samples: ${detail.useCase}. Use FPS mode instead when you need smooth motion or every single frame of a short clip.`
    },
    {
      q: 'Which video formats work with interval frame extraction?',
      a: 'MP4, MOV, and WEBM work best. Other formats like AVI or MKV may work if your browser can decode them, since all processing happens with your browser’s built-in video decoder.'
    },
    {
      q: 'Can I change the interval or set a custom number of seconds?',
      a: 'Yes. The extractor offers presets for every 1, 5, 10, and 30 seconds, plus a custom field where you can type any interval from 1 to 3600 seconds. Switch between “Every N Seconds” and “By FPS” modes at any time before extracting.'
    },
    {
      q: 'Is my video uploaded to a server?',
      a: 'No. Your video never leaves your device. Frames are extracted entirely in your browser using local decoding, so your footage stays 100% private.'
    }
  ];

  useEffect(() => {
    const scriptId = `extract-every-${seconds}s-schemas`;
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": t('extractEveryN.title', interp),
      "url": url,
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": t('extractEveryN.description', interp),
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video Frame Extractor",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5, WebAssembly and Javascript support",
      "featureList": [
        `Extract one frame every ${seconds} second${plural} from any video`,
        "Presets for 1, 5, 10, and 30 second intervals plus custom 1–3600s input",
        "JPG, PNG, and WebP output with ZIP download",
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
      "name": `How to Extract a Frame Every ${seconds} Second${plural}`,
      "description": `Step-by-step instructions for pulling one still image every ${seconds} second${plural} from a video locally inside your web browser.`,
      "totalTime": "PT1M",
      "step": [
        { "@type": "HowToStep", "name": "Upload Your Video", "text": "Drag and drop your MP4, MOV, or WEBM video file into the browser-based upload zone." },
        { "@type": "HowToStep", "name": "Confirm the Interval", "text": `The “Every N Seconds” mode comes preselected at every ${seconds} second${plural}. Adjust it or type a custom interval (1–3600 seconds) if you like.` },
        { "@type": "HowToStep", "name": "Choose an Output Format", "text": "Pick JPG for small files, PNG for lossless quality, or WebP for efficient web-ready images." },
        { "@type": "HowToStep", "name": "Extract the Frames", "text": "Click “Extract Frames Now” — one frame per interval is captured locally in your browser." },
        { "@type": "HowToStep", "name": "Download the ZIP", "text": "Preview the evenly spaced stills and download them all as a single ZIP archive." }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => { const el = document.getElementById(scriptId); if (el) el.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('extractEveryN.title', interp)}
        description={t('extractEveryN.description', interp)}
        canonical={url}
        ogTitle={t('extractEveryN.title', interp)}
        ogDescription={t('extractEveryN.description', interp)}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('extractEveryN.keywords', interp)}
      />

      <Breadcrumb items={[{ label: `Every ${seconds} Second${plural}`, path: `/${slug}` }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('extractEveryN.h1', interp)}<br />
          <span className="text-cyan-400">{t('extractEveryN.h1Sub', interp)}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('extractEveryN.hero', interp)}
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['🔒 100% Private', '⏱️ Fixed Time Interval', '🖼️ JPG / PNG / WebP', '📦 ZIP Download', '🚫 No Watermark', '🆓 Free Forever'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">{badge}</span>
          ))}
        </div>
      </section>

      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToImages initialIntervalSeconds={seconds} />
      </div>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Why Extract One Frame Every {seconds} Second{plural}?</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 leading-relaxed">
            Fixed-interval extraction gives you predictable, evenly spaced stills instead of thousands of near-duplicate frames. A {seconds}-second cadence is ideal for {detail.useCase}:
          </p>
          <ul className="space-y-3 text-gray-300 list-disc pl-6">
            <li><strong className="text-white">Predictable output</strong> — {detail.example}; you always know exactly how many images you will get.</li>
            <li><strong className="text-white">Tiny, manageable sets</strong> — minutes of footage collapse into a handful of representative frames instead of a bloated ZIP.</li>
            <li><strong className="text-white">Perfect for scanning</strong> — scrub years of footage, lectures, or gameplay visually in seconds.</li>
            <li><strong className="text-white">AI-ready sampling</strong> — evenly spaced frames make clean, unbiased training samples for computer-vision datasets.</li>
            <li><strong className="text-white">Private by design here</strong> — unlike server-side converters, your video never leaves your device.</li>
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">How to Extract a Frame Every {seconds} Second{plural} Online</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload your video file', desc: 'Drag and drop or click to select your MP4, MOV, or WEBM video.' },
              { num: '2', title: 'Confirm the interval', desc: `“Every N Seconds” mode is preselected at every ${seconds} second${plural} — or pick 1, 5, 10, 30 seconds, or type a custom value up to 3600.` },
              { num: '3', title: 'Choose JPG, PNG, or WebP', desc: 'JPG for small files, PNG for lossless quality, WebP for efficient web images.' },
              { num: '4', title: 'Extract the frames', desc: 'Click “Extract Frames Now” — one frame per interval is captured locally in your browser.' },
              { num: '5', title: 'Download your stills', desc: 'Preview the evenly spaced frames and download them all as a single ZIP file.' },
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
            No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support. Interval extraction keeps output small by design — even hour-long videos produce only a few hundred frames at most.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Other Extraction Intervals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {OTHER_CADENCES.filter(s => s !== seconds).map(s => (
            <Link key={s} to={`/${slugFor(s)}`} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
              <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Every {s} Second{s === 1 ? '' : 's'}</h3>
              <p className="text-gray-500 text-xs">Extract one frame every {s} second{s === 1 ? '' : 's'} from video.</p>
            </Link>
          ))}
          <Link to="/extract-frames-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">FPS Extraction</h3>
            <p className="text-gray-500 text-xs">Extract frames by frames-per-second instead.</p>
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

export default ExtractFrameEveryNSeconds;
