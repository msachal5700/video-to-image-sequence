import React, { useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VideoThumbnailMakerTool from '../components/VideoThumbnailMakerTool';

const faqs = [
  {
    q: 'How do I make a YouTube thumbnail from a video?',
    a: 'Upload your video to the tool above, scrub to the exact frame you want — the peak emotion, the action shot, the money moment — and click "Use this frame". Add bold text, arrows, or circles to guide the eye, then download the finished thumbnail at 1280×720. The whole thing takes under a minute and runs entirely in your browser.'
  },
  {
    q: 'What size should a YouTube thumbnail be?',
    a: 'YouTube recommends 1280×720 pixels (16:9 aspect ratio), minimum width 640 pixels, under 2MB file size, in JPG, PNG, or WebP format. This tool exports at exactly 1280×720, so your thumbnail is always the right size — no guessing, no resizing in another app.'
  },
  {
    q: 'Is this video thumbnail maker really free? Do I need an account?',
    a: 'Completely free, no account, no signup, no watermark, nothing to install. It runs 100% in your browser — your video is never uploaded to any server. That is the core difference from editors like Canva, which require an account before you can save anything.'
  },
  {
    q: 'Can I add text and arrows to my thumbnail?',
    a: 'Yes. Click Text to add a headline (with size, font, color, bold, and outline controls), or add boxes, circles, and arrows to highlight part of the frame. Every element can be dragged into position with your mouse or finger. Three starter templates — Bold Title, Arrow + Circle, and Lower Third — give you a professional layout in one click.'
  },
  {
    q: 'Will my video be uploaded or stored anywhere?',
    a: 'No. The video file stays on your device the entire time: it is decoded by your browser, the frame is captured locally, and the thumbnail is composited on a canvas in the page. Nothing is sent to our servers, so there is nothing to leak, nothing to wait for, and no privacy policy fine print to worry about.'
  },
  {
    q: 'How is this different from making a thumbnail in Canva or Photoshop?',
    a: 'Those are general design tools: you start from a blank canvas or a screenshot, and Canva requires an account. This tool starts from your actual video footage — scrub to the perfect frame, which is usually sharper and more authentic than a screenshot — then adds the text and graphics. For creators who want a thumbnail from their video in under a minute, it skips five steps.'
  },
  {
    q: 'Can I use a frame from someone else\u2019s video as my thumbnail?',
    a: 'Technically the tool will process any video file you upload, but you should only make thumbnails from footage you own or have rights to use. Using someone else\u2019s video frames or artwork as your thumbnail can be a copyright problem — and YouTube can penalize misleading thumbnails regardless of where the image came from.'
  }
];

const VideoThumbnailMaker: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const existing = document.getElementById('video-thumbnail-maker-schemas');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-thumbnail-maker-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Video Thumbnail Maker — Make Thumbnails from Video Frames",
      "url": "https://www.videotoimagesequence.online/video-thumbnail-maker",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Make a YouTube thumbnail from any video frame free — pick the moment, add text and arrows, export 1280×720. No signup, no watermark, 100% in-browser.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video Thumbnail Maker",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5 and Javascript support",
      "featureList": [
        "Pick any frame from your video with frame-accurate scrubbing",
        "Add text overlays with fonts, colors, and outlines",
        "Add arrows, circles, and boxes to highlight details",
        "One-click starter templates for pro layouts",
        "Export at exactly 1280×720 — YouTube's recommended size",
        "100% browser-based — nothing uploaded or stored",
        "Free forever, no account, no watermark"
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
      "name": "How to Make a YouTube Thumbnail from a Video",
      "description": "Turn any video frame into a click-worthy 1280×720 thumbnail with text and graphics, free in your browser.",
      "totalTime": "PT2M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your video and pick a frame",
          "text": "Drop in your MP4, MOV, or WEBM file, scrub to the exact moment — peak emotion or action — and capture the frame."
        },
        {
          "@type": "HowToStep",
          "name": "Add text and highlights",
          "text": "Add a bold headline, draw arrows or circles around the key detail, or start from a one-click template."
        },
        {
          "@type": "HowToStep",
          "name": "Export at 1280×720",
          "text": "Download your finished thumbnail as JPG or PNG at YouTube's recommended size — ready to upload."
        }
      ]
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.videotoimagesequence.online/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Video Thumbnail Maker",
          "item": "https://www.videotoimagesequence.online/video-thumbnail-maker"
        }
      ]
    };

    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Video to Image Sequence Online",
      "url": "https://www.videotoimagesequence.online",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.videotoimagesequence.online/favicon.svg",
        "width": 32,
        "height": 32
      },
      "description": "Free online video frame extraction tool. Convert MP4, MOV, and WEBM videos to image sequences in your browser.",
      "sameAs": [
        "https://x.com/videotoimage"
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema, breadcrumbSchema, orgSchema]);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('video-thumbnail-maker-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('videoThumbnailMaker.title')}
        description={t('videoThumbnailMaker.description')}
        canonical="https://www.videotoimagesequence.online/video-thumbnail-maker"
        ogTitle={t('videoThumbnailMaker.title')}
        ogDescription={t('videoThumbnailMaker.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoThumbnailMaker.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Video Thumbnail Maker', path: '/video-thumbnail-maker' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoThumbnailMaker.h1')}<br />
          <span className="text-cyan-400">{t('videoThumbnailMaker.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoThumbnailMaker.hero')}
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

      {/* ── TOOL WIDGET ── */}
      <section className="max-w-6xl mx-auto px-4 mb-4">
        <VideoThumbnailMakerTool />
      </section>

      {/* ── TWO-STEP WORKFLOW CROSS-LINK ── */}
      <section className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-cyan-950/20 border border-cyan-900/60 rounded-2xl p-6 text-center">
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-white">The two-step thumbnail workflow:</strong> studying a competitor&rsquo;s thumbnail first?{' '}
            <Link to="/youtube-thumbnail-downloader" className="text-cyan-400 hover:underline font-medium">
              Download any YouTube thumbnail
            </Link>{' '}
            for reference — then come back here and build your own, better one from your footage.
          </p>
        </div>
      </section>

      {/* ── WHY THUMBNAILS DECIDE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Your Thumbnail Decides Whether the Video Gets Watched
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          On YouTube, the thumbnail does most of the persuasion before a single second of video plays. Viewers scrolling through search results, the homepage, or suggested videos make a split-second decision based on two things: the title and the thumbnail image. A blurry auto-generated frame — the three random stills YouTube picks for you — quietly costs you viewers every single day, because it was never designed to sell the click.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          The thumbnails that win share a formula: one clear focal point, big readable text (three to five words), high contrast, and an emotional hook — a face mid-reaction, an arrow pointing at the surprising detail, a circle around the thing you have to see. None of that requires design software. It requires the right frame and about sixty seconds.
        </p>
        <p className="text-gray-400 leading-relaxed">
          That is exactly what this page does. Your video already contains the perfect thumbnail — the peak laugh, the finished dish, the before-and-after moment. Instead of screenshotting your player (complete with play button and timeline bar) or rebuilding the scene in an editor, you scrub to the frame, capture it at full quality, add the text and graphics, and export at YouTube&rsquo;s exact recommended size.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          Make a Thumbnail from Your Video in 3 Steps
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload and pick the frame', desc: 'Drop in your MP4, MOV, or WEBM. Scrub the timeline or step frame-by-frame to the exact moment — the emotion, the action, the reveal — then capture it. The frame is grabbed at your video\u2019s full native resolution.' },
              { num: '2', title: 'Add text and highlights', desc: 'Drop in a bold headline, draw an arrow at the key detail, or circle the thing viewers must notice. Drag everything into place, or start from a one-click template like Bold Title or Arrow + Circle.' },
              { num: '3', title: 'Export at 1280×720', desc: 'Download your finished thumbnail as JPG or PNG at exactly 1280×720 — YouTube\u2019s recommended size. Upload it in YouTube Studio under your video\u2019s details. No watermark, no account, no waiting.' },
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

      {/* ── WHAT GETS CLICKS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          What Makes a Thumbnail Get Clicked
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          You don&rsquo;t need design training — you need to follow what consistently works. These five rules cover the vast majority of high-performing thumbnails:
        </p>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">1. One focal point, not five</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Thumbnails are viewed tiny — often under 200 pixels wide on mobile. A single face, object, or moment reads instantly; a collage of four things reads as noise. Pick the one frame that tells the story and let everything else go.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">2. Three to five big words, maximum</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Thumbnail text is a billboard, not a paragraph. Short, high-contrast words in a heavy font (Impact and Arial Black exist for exactly this reason) stay readable at any size. Put the detail in the title; put the hook in the thumbnail.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">3. Faces and emotion beat everything</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A face mid-reaction — surprise, delight, disbelief — is the oldest click magnet on the platform. Scrub to the frame where the emotion peaks, not the frame where everyone looks posed. That&rsquo;s precisely why picking from your footage beats a stock photo.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">4. Arrows and circles direct the eye</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Viewers&rsquo; eyes follow pointers. A red arrow aimed at the surprising detail, or a circle around the before-and-after difference, tells the viewer where to look in under a second. Use them sparingly — one highlight per thumbnail.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">5. Contrast is non-negotiable</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              White text with a dark outline survives any background — that&rsquo;s why it&rsquo;s the default here. Test your thumbnail at small size: shrink the preview in your mind to a postage stamp. If you can still read the text and spot the focal point, it works.
            </p>
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Start from a Template, Not a Blank Canvas
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          Blank canvases slow everyone down. The tool ships with three starter layouts modeled on what actually performs — apply one, swap in your own words, drag things where you want them:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Bold Title</h3>
            <p className="text-gray-500 text-xs leading-relaxed">Big outlined headline up top, yellow subtitle along the bottom. The classic high-CTR layout for tutorials, reviews, and commentary.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Arrow + Circle</h3>
            <p className="text-gray-500 text-xs leading-relaxed">A red circle around the key detail with an arrow pointing straight at it. Perfect for reveals, transformations, and &ldquo;you won&rsquo;t believe this&rdquo; moments.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Lower Third</h3>
            <p className="text-gray-500 text-xs leading-relaxed">A clean caption-style line along the bottom that stays out of the action. Ideal for vlogs, interviews, and talking-head videos.</p>
          </div>
        </div>
      </section>

      {/* ── SIZE GUIDE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          YouTube Thumbnail Size Guide
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          Get the size wrong and YouTube rejects the upload or displays it soft. Here are the official numbers — and this tool exports exactly the recommended size, so you never have to think about them:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Spec</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Value</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              <tr className="border-b border-gray-800/60">
                <td className="py-3 px-4 text-white font-medium">Recommended size</td>
                <td className="py-3 px-4">1280 × 720</td>
                <td className="py-3 px-4">What this tool exports, every time</td>
              </tr>
              <tr className="border-b border-gray-800/60">
                <td className="py-3 px-4 text-white font-medium">Minimum width</td>
                <td className="py-3 px-4">640 px</td>
                <td className="py-3 px-4">Anything smaller gets rejected</td>
              </tr>
              <tr className="border-b border-gray-800/60">
                <td className="py-3 px-4 text-white font-medium">Aspect ratio</td>
                <td className="py-3 px-4">16:9</td>
                <td className="py-3 px-4">The canvas here is locked to 16:9</td>
              </tr>
              <tr className="border-b border-gray-800/60">
                <td className="py-3 px-4 text-white font-medium">Max file size</td>
                <td className="py-3 px-4">2 MB</td>
                <td className="py-3 px-4">JPG export keeps you comfortably under</td>
              </tr>
              <tr className="border-b border-gray-800/60">
                <td className="py-3 px-4 text-white font-medium">Formats</td>
                <td className="py-3 px-4">JPG, PNG, WebP</td>
                <td className="py-3 px-4">JPG for photos, PNG for text-heavy designs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── WHY NOT CANVA ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">
            Why not just use Canva?
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            Canva is a fine design tool, but it starts from a blank canvas and it requires an account before you can save anything. This tool starts from your actual footage: the frame you pick is sharper and more authentic than a screenshot, and you go from upload to finished 1280×720 thumbnail in about a minute — no signup, no subscription upsell, no learning a design app.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            If you need layered PSD-style editing with dozens of assets, use an editor. If you need a thumbnail from your video, fast, this is the shorter path.
          </p>
        </div>
      </section>

      {/* ── RELATED TOOLS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Video Tools for Creators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/youtube-thumbnail-downloader" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">YouTube Thumbnail Downloader</h3>
            <p className="text-gray-500 text-xs">Grab any video&rsquo;s thumbnail for reference first.</p>
          </Link>
          <Link to="/video-to-photo" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to Photo</h3>
            <p className="text-gray-500 text-xs">Save any frame as a full-quality photo.</p>
          </Link>
          <Link to="/video-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to Frames</h3>
            <p className="text-gray-500 text-xs">Extract every frame to browse candidates.</p>
          </Link>
          <Link to="/video-frame-for-youtube-thumbnail" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Frame for YouTube Thumbnail</h3>
            <p className="text-gray-500 text-xs">Frame-picking guide for thumbnail hunters.</p>
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

export default VideoThumbnailMaker;
