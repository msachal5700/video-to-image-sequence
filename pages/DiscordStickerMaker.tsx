import React from 'react';
import DiscordStickerTool from '../components/DiscordStickerTool';
import SEOHead from '../components/SEOHead';
import { localizedUrl } from '../utils/localizedRoutes';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageLang } from '../hooks/usePageLang';

const faqs = [
  {
    q: 'What are the file size limits for Discord stickers?',
    a: 'Discord requires animated stickers to be APNG files under 512 KB at 320×320 pixels. Regular custom emoji have their own limits (256 KB), but server stickers — the animated ones — must be APNG format. Our auto-fit optimizer tunes frame rate and resolution automatically so your export lands under the 512 KB cap.'
  },
  {
    q: 'What format do Telegram animated stickers use?',
    a: 'Telegram animated stickers must be WebM video files (VP9 codec) under 256 KB, with one side exactly 512 pixels and the other 512 or smaller, at 30 FPS or less, and no longer than 3 seconds with no audio. Our Telegram preset encodes VP9 WebM and auto-adjusts the bitrate to fit the 256 KB limit.'
  },
  {
    q: 'How do I make a WhatsApp animated sticker?',
    a: 'WhatsApp animated stickers must be animated WebP files under 500 KB at 512×512 pixels. Upload a short video clip, pick the WhatsApp preset, and the tool encodes an animated WebP that fits the limit. You can then import it with any sticker-maker app that accepts WebP files.'
  },
  {
    q: 'Why does my sticker get rejected for being too large?',
    a: 'Animated formats store every frame, so file size grows with frame count × dimensions × quality. The two biggest levers are clip length (keep it under 3 seconds) and frame rate (10–12 FPS looks smooth for stickers). Our auto-fit mode searches combinations of FPS, resolution, and quality until the output fits your platform\'s limit.'
  },
  {
    q: 'APNG vs animated WebP vs GIF — which should I use for stickers?',
    a: 'Use whatever your platform demands: Discord wants APNG, WhatsApp wants animated WebP, Telegram wants WebM. APNG gives the sharpest quality with full alpha transparency but larger files; animated WebP is smaller with good color; GIF is universal but capped at 256 colors and usually rejected by sticker uploaders. This tool exports the exact format each platform requires.'
  },
  {
    q: 'Are my videos uploaded to a server?',
    a: 'No. Video decoding, frame extraction, and sticker encoding all run locally in your browser. Your clips never leave your device, and the tool keeps working offline once the page has loaded.'
  }
];

// Animated sticker maker page: Discord (APNG), Telegram (WebM), WhatsApp (animated WebP)
const DiscordStickerMaker: React.FC = () => {
  const { t } = useTranslation();
  const pageLang = usePageLang();
  const webAppSchema = {
    "@type": "WebApplication",
    "name": "Video to Discord Sticker Maker",
    "url": "https://www.videotoimagesequence.online/discord-sticker-maker",
    "image": "https://www.videotoimagesequence.online/og-image.png",
    "description": "Turn video clips into animated stickers for Discord, Telegram, and WhatsApp. Auto-fit file size optimizer hits each platform's limits — 100% in your browser.",
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
    "name": "How to Make an Animated Discord Sticker from Video",
    "description": "Convert a short video clip into an animated sticker that fits Discord's 512 KB APNG limit.",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload Your Clip",
        "text": "Drop a short MP4, MOV, or WebM video into the upload zone. Clips under 3 seconds work best for stickers."
      },
      {
        "@type": "HowToStep",
        "name": "Pick Your Platform",
        "text": "Choose Discord (APNG, 512 KB limit), Telegram (WebM, 256 KB limit), or WhatsApp (animated WebP, 500 KB limit)."
      },
      {
        "@type": "HowToStep",
        "name": "Trim the Clip",
        "text": "Set the start and end points — 1 to 3 second loops make the snappiest stickers and smallest files."
      },
      {
        "@type": "HowToStep",
        "name": "Auto-Fit and Download",
        "text": "Leave auto-fit on: the tool tunes frame rate, resolution, and quality until the sticker fits your platform's size limit, then download it."
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
        title={t('discordStickerMaker.title')}
        description={t('discordStickerMaker.description')}
        canonical={localizedUrl('/discord-sticker-maker', pageLang)}
        ogTitle={t('discordStickerMaker.title')}
        ogDescription={t('discordStickerMaker.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('discordStickerMaker.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Discord Sticker Maker', path: '/discord-sticker-maker' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('discordStickerMaker.h1')}<br />
          <span className="text-cyan-400">{t('discordStickerMaker.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          {t('discordStickerMaker.hero')}
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
        <DiscordStickerTool />
      </div>

      {/* ── PLATFORM REQUIREMENTS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          Animated Sticker Requirements by Platform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Discord</h3>
            <ul className="text-gray-400 text-sm leading-relaxed space-y-1.5">
              <li><strong className="text-gray-200">Format:</strong> APNG</li>
              <li><strong className="text-gray-200">Max size:</strong> 512 KB</li>
              <li><strong className="text-gray-200">Dimensions:</strong> 320 × 320 px</li>
              <li><strong className="text-gray-200">Notes:</strong> Server stickers only; regular emoji use a separate 256 KB limit.</li>
            </ul>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Telegram</h3>
            <ul className="text-gray-400 text-sm leading-relaxed space-y-1.5">
              <li><strong className="text-gray-200">Format:</strong> WebM (VP9)</li>
              <li><strong className="text-gray-200">Max size:</strong> 256 KB</li>
              <li><strong className="text-gray-200">Dimensions:</strong> one side 512 px</li>
              <li><strong className="text-gray-200">Notes:</strong> Max 3 seconds, 30 FPS, no audio stream.</li>
            </ul>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">WhatsApp</h3>
            <ul className="text-gray-400 text-sm leading-relaxed space-y-1.5">
              <li><strong className="text-gray-200">Format:</strong> Animated WebP</li>
              <li><strong className="text-gray-200">Max size:</strong> 500 KB</li>
              <li><strong className="text-gray-200">Dimensions:</strong> 512 × 512 px</li>
              <li><strong className="text-gray-200">Notes:</strong> Import via a sticker-maker app that accepts WebP.</li>
            </ul>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-6 leading-relaxed">
          Platform rules change occasionally — if an upload is rejected after a rule update, re-export with a slightly smaller clip and the tool's auto-fit will find a combination that passes.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Turn a Video into an Animated Sticker
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="list-decimal pl-6 space-y-4 text-gray-300 marker:text-cyan-500 marker:font-bold">
            <li>
              <strong className="text-white">Upload a short clip:</strong> Drag an MP4, MOV, or WebM video into the upload zone above. The best sticker sources are 1–3 second moments — a reaction, a punchline, a loopable gesture.
            </li>
            <li>
              <strong className="text-white">Choose your platform:</strong> Pick Discord, Telegram, or WhatsApp. Each preset locks in the correct format, dimensions, and size limit automatically.
            </li>
            <li>
              <strong className="text-white">Trim the moment:</strong> Set start and end points around the exact action. Shorter clips encode smaller and loop more snappily in chat.
            </li>
            <li>
              <strong className="text-white">Auto-fit and download:</strong> With auto-fit enabled, the tool tries frame rate, resolution, and quality combinations from best to smallest until the sticker fits under your platform's limit — then shows you exactly which settings it used.
            </li>
          </ol>
        </div>
      </section>

      {/* Google AdSense ad — Post How-To */}
      <div className="max-w-5xl mx-auto px-4">
        <GoogleAdUnit />
      </div>

      {/* ── HOW AUTO-FIT WORKS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          How the Auto-Fit File Size Optimizer Works
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 text-gray-400 leading-relaxed">
          <p>
            Animated sticker formats store every frame, so file size is roughly <em className="text-gray-300">frames × pixels per frame × bytes per pixel</em>. Manually balancing those three variables against a hard 256 KB or 512 KB cap is exactly the tedious tweaking people do on desktop converters — and the reason uploads get rejected.
          </p>
          <p>
            Auto-fit automates it: starting from the best-looking combination (highest frame rate, full platform resolution, top quality), it encodes, measures, and steps down through progressively smaller combinations until the output fits under the limit. The first combination that fits wins, so you always get the highest quality your platform allows. Every attempt runs locally in your browser — no uploads, no waiting on a server queue.
          </p>
        </div>
      </section>

      {/* ── TIPS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          Tips for Tiny, Punchy Stickers
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Keep it under 3 seconds</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Clip length is the single biggest file-size lever. A 2-second loop at 12 FPS is 24 frames; a 5-second clip at the same rate is 60. Trim ruthlessly — stickers read best as single gestures anyway.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">10–12 FPS is the sticker sweet spot</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Chat stickers don't need cinematic frame rates. 10–12 FPS looks smooth at small sizes and roughly halves the file versus 24 FPS. Auto-fit starts at 15 FPS and steps down only if needed.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Center your subject</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The tool center-crops your video to a square before encoding. Frame your subject in the middle of the shot so nothing important gets cropped at the edges.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Simple backgrounds compress better</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Busy, high-detail backgrounds inflate every frame. Clips with clean backgrounds fit under limits at noticeably higher quality settings.
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
          <Link to="/video-to-gif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to GIF</h3>
            <p className="text-gray-500 text-xs">Convert video clips directly to GIF.</p>
          </Link>
          <Link to="/frames-to-gif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Frames to GIF</h3>
            <p className="text-gray-500 text-xs">Build animated GIFs from image frames.</p>
          </Link>
          <Link to="/video-looper" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video Looper</h3>
            <p className="text-gray-500 text-xs">Repeat video with seamless loop detection.</p>
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
              <p className="text-gray-400 text-sm leading-relaxed mt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DiscordStickerMaker;
