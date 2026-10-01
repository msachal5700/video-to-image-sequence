import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I convert a video to JPG images?',
    a: 'Load your video in the converter above, choose JPG as the output format, set how many frames per second you want, and click convert. Each extracted frame is saved as a JPG image you can download individually or as a ZIP archive.'
  },
  {
    q: 'What is the difference between Video to JPG and MP4 to JPG?',
    a: 'Video to JPG accepts any supported video format — MP4, MOV, WEBM — and converts frames to JPG. MP4 to JPG is the specialized variant for MP4 files only, with MP4-specific guidance. If your source is MP4, either works; for MOV or WEBM sources, use this page.'
  },
  {
    q: 'Will the JPG images be full resolution?',
    a: 'Yes. Frames are captured at the video\u2019s native resolution — a 1920×1080 video produces 1920×1080 JPGs. Nothing is downscaled unless you choose to resize, so thumbnails and stills keep every pixel of the source.'
  },
  {
    q: 'Should I convert video frames to JPG or PNG?',
    a: 'Choose JPG when file size matters: JPGs are typically 5–10× smaller than PNGs, which makes them ideal for thumbnails, web uploads, datasets, and sharing. Choose PNG only when you need pixel-perfect lossless quality or transparency, such as VFX compositing.'
  },
  {
    q: 'How do I control JPG quality and file size?',
    a: 'JPG quality is a trade-off between sharpness and file size. Use the highest quality setting for print or archival stills, and a medium setting for web thumbnails where smaller files load faster. If JPGs still look blocky, your source video may be heavily compressed — extraction cannot add detail the video does not have.'
  },
  {
    q: 'Can I convert MOV or WEBM videos to JPG as well?',
    a: 'Yes. This converter handles MP4, MOV, and WEBM inputs and outputs JPG images from all of them. The output is identical regardless of input format — a JPG is a JPG — so mixed-format footage converts consistently.'
  },
  {
    q: 'How do I get only the best JPG stills instead of every frame?',
    a: 'Extract at a low rate — 1 frame per second — then scan the preview grid and download just the sharp, well-composed stills. For a single perfect moment, our screenshot-from-video tool captures one exact frame instead of a sequence.'
  },
  {
    q: 'Are my videos uploaded to a server during conversion?',
    a: 'No. Conversion runs entirely in your browser using local video decoding. Your video never leaves your device, which also means there are no upload waits, no file-size caps from servers, and no privacy concerns.'
  }
];

const VideoToJpg: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('video-to-jpg-schemas');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-to-jpg-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Video to JPG — Convert Video to JPG Images Online Free",
      "url": "https://www.videotoimagesequence.online/video-to-jpg",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Convert video to JPG images online for free. Extract full-resolution JPG stills from MP4, MOV, and WEBM videos in your browser. No upload, no watermark.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video to JPG Converter",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5, WebAssembly and Javascript support",
      "featureList": [
        "Convert MP4, MOV, and WEBM videos to JPG images",
        "Full native resolution — no downscaling",
        "Adjustable frame extraction rate",
        "Compact JPG output ideal for web and sharing",
        "Download stills individually or as a ZIP",
        "100% browser-based — videos never leave your device"
      ],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    const faqSchema = {
      "@context": "https://schema.org",
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
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Video to JPG Online",
      "description": "Extract full-resolution JPG still images from any MP4, MOV, or WEBM video, free in your browser. No uploads, no watermarks.",
      "totalTime": "PT2M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Load your video",
          "text": "Drag and drop an MP4, MOV, or WEBM file into the converter. It stays on your device."
        },
        {
          "@type": "HowToStep",
          "name": "Select JPG output",
          "text": "Choose JPG for compact, shareable still images at full video resolution."
        },
        {
          "@type": "HowToStep",
          "name": "Set the extraction rate",
          "text": "Pick frames per second: 1 fps for browsing stills, higher when you need dense coverage."
        },
        {
          "@type": "HowToStep",
          "name": "Convert and review",
          "text": "Run the conversion, then scan the preview grid for the sharpest stills."
        },
        {
          "@type": "HowToStep",
          "name": "Download your JPGs",
          "text": "Save the keepers individually or download every extracted JPG as a ZIP archive."
        }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('video-to-jpg-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('videoToJpg.title')}
        description={t('videoToJpg.description')}
        canonical="https://www.videotoimagesequence.online/video-to-jpg"
        ogTitle={t('videoToJpg.title')}
        ogDescription={t('videoToJpg.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoToJpg.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Video to JPG', path: '/video-to-jpg' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoToJpg.h1')}<br />
          <span className="text-cyan-400">{t('videoToJpg.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoToJpg.hero')}
        </p>

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

      {/* Main Tool Content */}
      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToImages />
      </div>

      {/* ── WHY JPG ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Why Convert Video to JPG?
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          JPG is the universal still-image format: every phone, browser, editor, and social platform opens it, and its compression keeps files small enough to share instantly. When you convert video to JPG, you get full-resolution stills — a 4K video yields 3840×2160 JPGs — at a fraction of the size PNG would need.
        </p>
        <p className="text-gray-400 leading-relaxed">
          That combination makes JPG the right default for thumbnails, documentation stills, dataset images, product photos pulled from product videos, and any workflow where you need <strong className="text-white">many good-looking images fast</strong>. Only reach for PNG when you need mathematically lossless pixels or transparency.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Convert Video to JPG Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Load your video', desc: 'Drag and drop an MP4, MOV, or WEBM file. Decoding happens locally in your browser.' },
              { num: '2', title: 'Select JPG output', desc: 'Choose JPG for compact stills at full native video resolution.' },
              { num: '3', title: 'Set the extraction rate', desc: '1 frame per second for browsing stills, higher rates for dense coverage.' },
              { num: '4', title: 'Convert and review', desc: 'Run the conversion and scan the preview grid for your best shots.' },
              { num: '5', title: 'Download your JPGs', desc: 'Save individual keepers or download every extracted JPG as a ZIP.' },
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

      {/* Google AdSense ad — Post How-To */}
      <div className="max-w-5xl mx-auto px-4">
        <GoogleAdUnit />
      </div>

      {/* ── JPG QUALITY GUIDE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Getting Sharp JPGs from Video
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Start with a good source</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Extraction cannot invent detail. A crisp 1080p source produces crisp JPGs; a heavily compressed 480p clip produces soft ones. When quality matters, use the highest-resolution original you have.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Pause on low-motion moments</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Fast motion blurs individual frames. The sharpest stills come from moments where the subject is relatively still — scan the preview grid and pick frames with clean edges.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Match quality to the destination</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Thumbnails and social posts are fine at medium quality and small file sizes. Product photos, print work, and archival stills deserve maximum quality — storage is cheap, re-shoots are not.
            </p>
          </div>
        </div>
      </section>

      {/* ── SUPPORTED VIDEO FORMATS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Supported Input Formats
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          Convert MP4, MOV, and WEBM videos to JPG. Output is always JPG, regardless of input format.
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

      {/* ── BROWSER NOTICE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">
            Browser Processing Notice
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No server upload required. Your video is decoded on your own device, so conversion speed depends on your hardware and the video length. Very long videos at high frame rates produce thousands of JPGs — use a lower rate or shorter clip if the browser slows down.
          </p>
        </div>
      </section>

      {/* ── TROUBLESHOOTING ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Troubleshooting Common Issues
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">JPGs Look Blocky or Pixelated</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Blockiness comes from compression — either in the source video or the JPG output. Raise the JPG quality setting, and check whether the source itself is low-bitrate. Extraction preserves what is there; it cannot restore what compression removed.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">ZIP Download Fails on Large Batches</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Thousands of full-resolution JPGs can exceed browser memory when zipped. Download in smaller batches, lower the extraction rate, or save only the frames you actually need.
            </p>
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS (INTERNAL LINKING) ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Conversion Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/video-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to Frames</h3>
            <p className="text-gray-500 text-xs">Turn video into a numbered frame sequence.</p>
          </Link>
          <Link to="/video-frame-extractor" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video Frame Extractor</h3>
            <p className="text-gray-500 text-xs">Frame extraction methods compared.</p>
          </Link>
          <Link to="/mp4-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">MP4 to JPG</h3>
            <p className="text-gray-500 text-xs">The MP4-specific JPG converter.</p>
          </Link>
          <Link to="/video-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to PNG</h3>
            <p className="text-gray-500 text-xs">Lossless PNG frames when quality is critical.</p>
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

export default VideoToJpg;
