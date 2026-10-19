import React from 'react';
import FramesToGifTool from '../components/FramesToGifTool';
import SEOHead from '../components/SEOHead';
import { localizedUrl } from '../utils/localizedRoutes';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageLang } from '../hooks/usePageLang';

const faqs = [
  {
    q: 'Is the animated GIF maker really free? Are there watermarks?',
    a: 'Yes — completely free, with no watermarks, no sign-up, and no usage limits. Your GIF downloads exactly as rendered, clean and ready to share anywhere.'
  },
  {
    q: 'What image formats can I upload as frames?',
    a: 'PNG, JPG/JPEG, WebP, and any other image format your browser can decode. Mixed formats in one sequence are fine — every frame is drawn onto a shared canvas at export time.'
  },
  {
    q: 'How many frames can I turn into a GIF?',
    a: 'There is no hard cap, but GIF encoding happens in your browser memory. A dozen 1080p frames encode in seconds; several hundred 4K PNGs may strain RAM and take minutes. For long sequences, resize frames to your target output size first.'
  },
  {
    q: 'GIF vs WebP — which animated format should I choose?',
    a: 'GIF wins on universal compatibility: it plays everywhere, from ancient forum software to every messaging app. Animated WebP files are smaller and support richer color, but some older platforms still mishandle them. This tool exports GIF, the format guaranteed to play wherever you post it.'
  },
  {
    q: 'Can I make individual frames last longer than others?',
    a: 'Yes. Enable "Custom delay per frame" and set each frame\'s hold time in milliseconds — for example, a 2000ms pause on the final frame so viewers can read a punchline before the loop restarts.'
  },
  {
    q: 'Are my images uploaded to a server?',
    a: 'No. Everything — decoding, frame ordering, GIF encoding — runs locally in your browser via JavaScript. Your images never leave your device, which also means the tool works offline once the page has loaded.'
  }
];

const FramesToGif: React.FC = () => {
  const { t } = useTranslation();
  const pageLang = usePageLang();
  const webAppSchema = {
    "@type": "WebApplication",
    "name": "Images to GIF Maker",
    "url": "https://www.videotoimagesequence.online/frames-to-gif",
    "image": "https://www.videotoimagesequence.online/og-image.png",
    "description": "Turn JPG, PNG, or WebP image sequences into animated GIFs online for free. Reorder frames, set timing, preview, and download — 100% in your browser.",
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
    "name": "How to Make an Animated GIF from Images Online",
    "description": "Combine a sequence of images into a looping animated GIF directly in your browser.",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload Your Frames",
        "text": "Drop your JPG, PNG, or WebP images into the upload zone. They are sorted by filename automatically."
      },
      {
        "@type": "HowToStep",
        "name": "Arrange the Order",
        "text": "Reorder frames with the arrow buttons until the sequence plays the way you want."
      },
      {
        "@type": "HowToStep",
        "name": "Set Timing and Looping",
        "text": "Pick a frame rate or set per-frame delays in milliseconds, then choose loop-forever or a fixed play count."
      },
      {
        "@type": "HowToStep",
        "name": "Preview and Export",
        "text": "Watch the animation preview, then render and download your animated GIF."
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
        title={t('framesToGif.title')}
        description={t('framesToGif.description')}
        canonical={localizedUrl('/frames-to-gif', pageLang)}
        ogTitle={t('framesToGif.title')}
        ogDescription={t('framesToGif.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('framesToGif.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Frames to GIF', path: '/frames-to-gif' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('framesToGif.h1')}<br />
          <span className="text-cyan-400">{t('framesToGif.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          {t('framesToGif.hero')}
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
        <FramesToGifTool />
      </div>

      {/* ── BROWSER SECURITY & PRIVACY ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Private, In-Browser GIF Rendering
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Your frames are decoded, ordered, and encoded into an animated GIF entirely inside your web browser. Nothing is uploaded to any server — your source images stay on your device from start to finish, and the tool keeps working even if your connection drops after the page loads.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Turn Images into an Animated GIF Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="list-decimal pl-6 space-y-4 text-gray-300 marker:text-cyan-500 marker:font-bold">
            <li>
              <strong className="text-white">Upload frames:</strong> Drag and drop your JPG, PNG, or WebP images into the upload zone above. Files sort automatically by filename — use zero-padded names like frame-001, frame-002 for correct order.
            </li>
            <li>
              <strong className="text-white">Arrange the sequence:</strong> Hover any thumbnail to move it earlier or later in the timeline, or delete frames you don't need.
            </li>
            <li>
              <strong className="text-white">Set timing:</strong> Pick a global frame rate (10–12 FPS is the classic GIF feel), or enable per-frame delays to hold key frames longer — great for punchlines and call-to-action end cards.
            </li>
            <li>
              <strong className="text-white">Preview and export:</strong> Watch the animation preview, choose loop-forever or a fixed play count, then render and download your GIF.
            </li>
          </ol>
        </div>
      </section>

      {/* Google AdSense ad — Post How-To */}
      <div className="max-w-5xl mx-auto px-4">
        <GoogleAdUnit />
      </div>

      {/* ── GIF VS WEBP ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          GIF vs Animated WebP: Which Should You Use?
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 text-gray-400 leading-relaxed">
          <p>
            Animated GIF is the lingua franca of short looping animation: it plays in every browser, every chat app, every forum, and every email client built in the last thirty years. Its 256-color palette keeps photographic gradients slightly banded, but for memes, UI demos, and reaction clips, compatibility beats fidelity.
          </p>
          <p>
            Animated WebP is the modern challenger — smaller files, 24-bit color, and alpha transparency. The catch is spotty support: some older messaging apps and content management systems still render only the first frame or refuse the file entirely. If your GIF must play <em className="text-gray-300">everywhere</em>, GIF remains the safe choice. This tool exports GIF for exactly that reason: maximum compatibility, zero surprises.
          </p>
        </div>
      </section>

      {/* ── BEST USE CASES ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          Best Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Product Demos</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Capture 8–12 screenshots of a feature walkthrough, set 500ms per frame, and embed the looping GIF in docs or a changelog where video players feel heavy.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Memes & Reactions</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Pull frames from a clip with our <Link to="/gif-to-frames" className="text-cyan-400 hover:underline">GIF to Frames</Link> tool, keep the best six, and re-export a tighter loop at 12 FPS.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Tutorial Highlights</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Turn a 30-second screen recording into a 6-frame looping GIF that shows the exact clicks — readers grasp it faster than a paragraph of instructions.</p>
          </div>
        </div>
      </section>

      {/* ── PRACTICAL TIPS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          Practical Tips for Clean GIFs
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Match your frame dimensions</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The GIF canvas locks to your first frame's size; differently-sized frames are centered and scaled to fit. For pixel-perfect loops, resize all frames to identical dimensions before uploading.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Fewer frames, smaller files</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              GIF file size scales with frame count × dimensions. A 12-frame 480px GIF often looks identical to a 24-frame version at half the bytes — critical for chat apps with upload limits.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Use per-frame delays deliberately</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A uniform 100ms delay feels snappy; holding the last frame for 1500–2000ms gives viewers time to read text before the loop restarts. This single trick separates amateur GIFs from polished ones.
            </p>
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
            <h3 className="text-white font-semibold mb-2">Frames play out of order</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Files sort by name, not by creation time. Rename with zero-padded numbers (frame-001, frame-002, … frame-010) — without padding, "frame-10" sorts before "frame-2". Then fine-tune with the arrow buttons on each thumbnail.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">GIF is too large to share</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Drop the quality setting to Medium, reduce frame dimensions before uploading, or cut the frame count. As a rule of thumb, halving each dimension quarters the file size.
            </p>
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS (INTERNAL LINKING) ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Animation Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/images-to-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Images to Video</h3>
            <p className="text-gray-500 text-xs">Stitch image sequences into WebM video.</p>
          </Link>
          <Link to="/video-to-gif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to GIF</h3>
            <p className="text-gray-500 text-xs">Convert video clips directly to GIF.</p>
          </Link>
          <Link to="/gif-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">GIF to Frames</h3>
            <p className="text-gray-500 text-xs">Extract every frame from an animated GIF.</p>
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

export default FramesToGif;
