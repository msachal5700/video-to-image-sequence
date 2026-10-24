import React from 'react';
import CompressGifTool from '../components/CompressGifTool';
import SEOHead from '../components/SEOHead';
import { localizedUrl } from '../utils/localizedRoutes';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageLang } from '../hooks/usePageLang';

const faqs = [
  {
    q: 'What are Discord’s GIF size limits?',
    a: 'For message uploads on a free account, Discord’s limit is 20 MB per file — raised from 10 MB in August 2026 (Discord’s own File Attachments FAQ confirms the change). Custom emoji are stricter: they must be 256 KB or less, per Discord’s custom-emoji guide. That’s why this page ships one-click presets for both: “Discord upload (20 MB)” and “Discord emoji (256 KB)”.'
  },
  {
    q: 'Will compressing my GIF ruin its quality?',
    a: 'Not necessarily — it depends on how much slack there is to recover. Shrinking a GIF from 40 MB to under 20 MB usually just removes bloat: excess frames and full-size dimensions you can’t see in chat anyway. The tool tries your settings first and only applies stronger reductions (lower quality, smaller dimensions, fewer frames) when a target size demands it. A side-by-side before/after preview is always shown, so you decide whether the trade-off is worth it before downloading.'
  },
  {
    q: 'Is my GIF uploaded to a server?',
    a: 'No. Everything — decoding, resizing, frame dropping, and GIF re-encoding — runs locally in your browser with JavaScript. Your GIF never leaves your device, there’s no queue, and nothing is stored anywhere. The page keeps working even if your connection drops after it loads.'
  },
  {
    q: 'Does it work on animated GIFs and static GIFs?',
    a: 'Both. Animated GIFs are decoded frame by frame (honoring disposal methods so the re-encode matches the original playback), then compressed. Static single-frame GIFs also work — downscaling and re-encoding still shrink them. Note that GIF’s 256-color palette means photographic images will always look slightly banded; if your file isn’t animated, a PNG or WebP is usually smaller and cleaner.'
  },
  {
    q: 'What if my GIF is still too big after compressing?',
    a: 'The tool tries up to seven progressively stronger strategies (lower quality, 75% then 50% dimensions, dropping every 2nd or 3rd frame) before giving up, and it tells you when even the strongest settings couldn’t reach the target. Practical next steps: trim the clip shorter with a video editor first, reduce the frame rate, or accept a smaller dimension — GIF file size scales with frames × pixels, so halving each dimension cuts the file to roughly a quarter.'
  },
  {
    q: 'Is the GIF compressor free? Do I need an account?',
    a: 'Completely free — no account, no signup, no watermark, no daily limit. The compressed file downloads exactly as rendered, ready to post anywhere.'
  }
];

const CompressGif: React.FC = () => {
  const { t } = useTranslation();
  const pageLang = usePageLang();
  const webAppSchema = {
    "@type": "WebApplication",
    "name": "Compress GIF — Reduce GIF File Size",
    "url": "https://www.videotoimagesequence.online/compress-gif",
    "image": "https://www.videotoimagesequence.online/og-image.png",
    "description": "Shrink animated GIFs in your browser: Discord 20 MB and 256 KB emoji presets, downscale, frame-skip, and quality controls. No upload, no signup, free.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5 and Javascript support",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const howToSchema = {
    "@type": "HowTo",
    "name": "How to Compress a GIF Online",
    "description": "Shrink an animated GIF to fit Discord’s 20 MB upload limit or the 256 KB custom emoji limit, entirely in your browser.",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload Your GIF",
        "text": "Drag and drop your animated GIF into the upload zone. It is decoded locally — nothing is sent to a server."
      },
      {
        "@type": "HowToStep",
        "name": "Pick a Target Preset",
        "text": "Choose Discord upload (20 MB), Discord emoji (256 KB), original-quality passthrough, or a custom max size."
      },
      {
        "@type": "HowToStep",
        "name": "Tune the Options",
        "text": "Set a max dimension, frame reduction, and encoding quality. These trade fidelity for file size."
      },
      {
        "@type": "HowToStep",
        "name": "Compress and Download",
        "text": "Compress your GIF, compare before/after sizes, and download the smaller file."
      }
    ]
  };

  const organizationSchema = {
    "@type": "Organization",
    "name": "Video to Image Sequence Online",
    "url": "https://www.videotoimagesequence.online",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.videotoimagesequence.online/og-image.png"
    }
  };

  const pageSchemas = {
    "@context": "https://schema.org",
    "@graph": [webAppSchema, faqSchema, howToSchema, organizationSchema]
  };

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <script type="application/ld+json">
        {JSON.stringify(pageSchemas)}
      </script>
      <SEOHead
        title={t('compressGif.title')}
        description={t('compressGif.description')}
        canonical={localizedUrl('/compress-gif', pageLang)}
        ogTitle={t('compressGif.title')}
        ogDescription={t('compressGif.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('compressGif.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Compress GIF', path: '/compress-gif' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('compressGif.h1')}<br />
          <span className="text-cyan-400">{t('compressGif.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          {t('compressGif.hero')}
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {[
            t('badges.private'),
            t('badges.fast'),
            t('badges.free')
          ].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Google AdSense ad — Pre-Tool */}
      <div className="max-w-5xl mx-auto px-4">
        <GoogleAdUnit />
      </div>

      {/* Main Tool Content */}
      <div className="animate-fade-in min-h-[400px] px-4">
        <CompressGifTool />
      </div>

      {/* ── BROWSER SECURITY & PRIVACY ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Private, In-Browser GIF Compression
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Your GIF is decoded, resized, and re-encoded entirely inside your web browser. Nothing is uploaded to any server — your files stay on your device from start to finish, and the tool keeps working even if your connection drops after the page loads.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Compress a GIF Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="list-decimal pl-6 space-y-4 text-gray-300 marker:text-cyan-500 marker:font-bold">
            <li>
              <strong className="text-white">Upload your GIF:</strong> Drag and drop an animated GIF into the upload zone above. It’s decoded locally in your browser — no upload, no queue, no waiting room.
            </li>
            <li>
              <strong className="text-white">Pick a target preset:</strong> Use the <em className="text-gray-300">Discord upload (20 MB)</em> preset for chat attachments, <em className="text-gray-300">Discord emoji (256 KB)</em> for custom emoji, or set your own max size with the custom option.
            </li>
            <li>
              <strong className="text-white">Tune the compression:</strong> Set a max dimension to downscale the GIF, reduce frames (“keep every 2nd frame” is the fastest way to halve a file), and choose encoding quality. Lower quality means fewer colors and smaller files.
            </li>
            <li>
              <strong className="text-white">Compress and download:</strong> Watch the before/after sizes and the percentage saved, compare the previews side by side, then download the compressed GIF.
            </li>
          </ol>
        </div>
      </section>

      {/* Google AdSense ad — Post How-To */}
      <div className="max-w-5xl mx-auto px-4">
        <GoogleAdUnit />
      </div>

      {/* ── DISCORD LIMITS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Discord’s GIF Limits in 2026
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 text-gray-400 leading-relaxed">
          <p>
            Discord <strong className="text-white">raised the free upload limit from 10 MB to 20 MB in August 2026</strong>, confirmed in its <a href="https://support.discord.com/hc/en-us/articles/25444343291031-File-Attachments-FAQ" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">File Attachments FAQ</a> and <a href="https://games.gg/news/discord-free-upload-limit-20mb/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">reported by games.gg</a>. That change finally retired the old 10 MB ceiling (and the even older 8 MB one) — but a big HD GIF still clears 20 MB easily, so compression remains the practical route.
          </p>
          <p>
            Custom emoji are a different game entirely: Discord caps them at <strong className="text-white">256 KB</strong>, static or animated, per its <a href="https://discord.com/blog/beginners-guide-to-custom-emojis" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">custom-emoji guide</a>. Emoji are tiny on screen, so the emoji preset starts at 128 px and uses aggressive-but-invisible settings — a preset built around that hard cap, not guesswork.
          </p>
        </div>
      </section>

      {/* ── WHAT AFFECTS GIF FILE SIZE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          What Actually Makes a GIF Big
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Frames × pixels</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              GIF file size scales with frame count times dimensions. Halving each dimension cuts the file to roughly a quarter; dropping every second frame halves it again. Most oversized GIFs are simply too big or too long for where they’re being posted.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">The 256-color ceiling</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              GIF supports only 256 colors per frame. Fewer colors compress better, so the encoding-quality slider is really a color-reduction dial. Flat illustrations survive aggressive settings; photographic footage starts banding sooner — the preview shows exactly where your GIF lands.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Target-size strategy</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              When you pick a target size, the tool tries your settings first and only escalates — lower quality, then 75% dimensions, then 50% dimensions with frame drops — if the file is still over the limit. It reports how many attempts it needed, so nothing happens behind your back.
            </p>
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS (INTERNAL LINKING) ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free GIF Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/gif-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">GIF Splitter</h3>
            <p className="text-gray-500 text-xs">Extract every frame from an animated GIF.</p>
          </Link>
          <Link to="/frames-to-gif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Frames to GIF</h3>
            <p className="text-gray-500 text-xs">Turn image sequences into animated GIFs.</p>
          </Link>
          <Link to="/video-to-gif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to GIF</h3>
            <p className="text-gray-500 text-xs">Convert video clips directly to GIF.</p>
          </Link>
          <Link to="/gif-to-mp4" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">GIF to MP4</h3>
            <p className="text-gray-500 text-xs">Convert GIFs to smaller MP4 video.</p>
          </Link>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="max-w-3xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-display">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="border border-gray-800 bg-gray-900/50 rounded-2xl p-5 cursor-pointer group hover:border-cyan-800 transition-colors">
              <summary className="font-medium text-white text-sm md:text-base list-none flex justify-between items-center group-open:text-cyan-400">
                {faq.q}
                <span className="text-cyan-400 transition-transform group-open:rotate-180">
                   ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CompressGif;
