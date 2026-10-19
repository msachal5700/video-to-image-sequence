import React from 'react';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import LastFrameExtractorTool from '../components/LastFrameExtractorTool';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I extract the last frame from a video for free?',
    a: 'Drop your video onto the box above (or click to browse). Hit "Extract last frame" and the tool seeks to the end of your video, captures the true final frame, then scans the last second for the sharpest frame — because the literal last frame often has fade-to-black or motion blur. You get both side by side and can download either as PNG, JPG, or WebP. Everything runs in your browser: no upload, no account, no watermark.'
  },
  {
    q: 'Why would I want the last frame instead of any other frame?',
    a: 'The biggest reason right now is AI video chaining. Tools like Kling, Runway, Sora, and Veo generate only 5–10 seconds of video per clip. To extend a scene seamlessly, creators extract the exact final frame of clip 1 and feed it back in as the "start frame" for clip 2. Beyond AI video, the last frame is useful for video thumbnails (end cards), verifying what a recording captured before it cut off, and grabbing the final state of a screen recording or demo.'
  },
  {
    q: 'What is the "sharpest frame" and why is it better than the last frame?',
    a: 'Video encoders and cameras don\'t treat the final millisecond kindly — the last frame of a clip is frequently blurred by motion, darkened by a fade-out, or compressed more aggressively. The tool samples 30 frames across the final second, scores each one with Laplacian variance (a standard computer-vision sharpness metric that measures edge strength), and picks the crispest. When you feed a frame back into an AI video generator 3–4 times in a row, starting from a sharp frame instead of a blurry one visibly reduces generation loss and color drift.'
  },
  {
    q: 'Is this last frame extractor really free? Do you upload my video?',
    a: 'Completely free, no account, no signup, no watermark. Your video never leaves your device — the seeking, frame capture, and sharpness analysis all happen locally in your browser tab using your own processor. Close the tab and nothing remains.'
  },
  {
    q: 'What formats can I download the frame in?',
    a: 'PNG (lossless, best quality), JPG (smallest file), or WebP (modern, great quality-to-size ratio). Pick the format before downloading. For AI video start frames, PNG or high-quality WebP give the generator the most detail to work with; for thumbnails and sharing, JPG keeps the file light.'
  },
  {
    q: 'Can I also get the first frame of a video?',
    a: 'The first frame is the easiest frame to grab — pause any video at 0:00 and screenshot it. If you need a clean, full-resolution first frame (not a screenshot), use the Screenshot from Video tool, which captures any timestamp at native resolution. This page is specialized for the harder problem: the final frame, where timing precision and sharpness actually matter.'
  }
];

const LastFrameExtractor: React.FC = () => {
  const { t } = useTranslation();

  const webAppSchema = {
    '@type': 'WebApplication',
    name: 'Last Frame Extractor — Free Online Video Final Frame Capture',
    url: 'https://www.videotoimagesequence.online/last-frame-extractor',
    image: 'https://www.videotoimagesequence.online/og-image.png',
    description: 'Extract the last frame of any video free in your browser, with automatic sharpest-frame detection in the final second. No upload, no signup, no watermark.',
    applicationCategory: 'MultimediaApplication',
    applicationSubCategory: 'Video Frame Extractor',
    operatingSystem: 'All — Browser-based (Chrome, Edge, Safari, Firefox)',
    browserRequirements: 'Requires HTML5 and Javascript support',
    featureList: [
      'Extract the exact final frame of any video',
      'Automatic sharpest-frame detection across the final second',
      'Laplacian-variance sharpness scoring shown side by side',
      'Download as PNG, JPG, or WebP at native resolution',
      'Built for AI video chaining (Kling, Runway, Sora, Veo)',
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
    name: 'How to Extract the Last Frame from a Video',
    description: 'Capture the final frame of any video free in your browser, with automatic sharpest-frame detection.',
    totalTime: 'PT1M',
    step: [
      { '@type': 'HowToStep', name: 'Drop in your video', text: 'Drag the video onto the upload box, or click to browse. Files up to 100 MB are accepted and never leave your device.' },
      { '@type': 'HowToStep', name: 'Extract the last frame', text: 'Hit the extract button. The tool captures the true final frame, then scans the last second with Laplacian-variance sharpness scoring to find the crispest frame.' },
      { '@type': 'HowToStep', name: 'Download your frame', text: 'Compare both frames side by side, pick your format (PNG, JPG, WebP), and download at native resolution.' }
    ]
  };

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.videotoimagesequence.online/' },
      { '@type': 'ListItem', position: 2, name: 'Last Frame Extractor', item: 'https://www.videotoimagesequence.online/last-frame-extractor' }
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
    "@graph": [webAppSchema, faqSchema, howToSchema, breadcrumbSchema, organizationSchema]
  };

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <script type="application/ld+json">
        {JSON.stringify(pageSchemas)}
      </script>
      <SEOHead
        title={t('lastFrameExtractor.title')}
        description={t('lastFrameExtractor.description')}
        canonical="https://www.videotoimagesequence.online/last-frame-extractor"
        ogTitle={t('lastFrameExtractor.title')}
        ogDescription={t('lastFrameExtractor.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('lastFrameExtractor.keywords')}
      />

      <Breadcrumb items={[{ label: 'Last Frame Extractor', path: '/last-frame-extractor' }]} />

      {/* ── HERO ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('lastFrameExtractor.h1')}<br />
          <span className="text-cyan-400">{t('lastFrameExtractor.h1Sub')}</span>
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('lastFrameExtractor.hero')}
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
        <LastFrameExtractorTool />
      </section>

      {/* ── HOW TO ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Extract the Last Frame in 3 Steps
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Drop in your video', desc: 'Drag the file onto the upload box above, or click to browse. Up to 100 MB, and it never leaves your device — all analysis happens in your tab.' },
              { num: '2', title: 'Extract the last frame', desc: 'Hit the extract button. The tool captures the true final frame, then samples 30 frames across the last second and scores each with Laplacian-variance sharpness analysis to find the crispest one.' },
              { num: '3', title: 'Compare and download', desc: 'Both frames appear side by side with timestamps. Pick PNG, JPG, or WebP and download at your video\u2019s native resolution.' },
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

      {/* ── WHY SHARPEST ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Why the Literal Last Frame Is Usually the Wrong One
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Grabbing the final frame of a video sounds trivial — seek to the end, screenshot, done. But the last few milliseconds of real footage are where cameras and encoders misbehave: motion blur from a final camera move, a fade-to-black that starts a quarter second early, or aggressive compression on the closing frames. The frame you get is technically "the last one" and practically useless.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          That\u2019s why this tool doesn\u2019t stop at the last frame. It samples 30 frames across the final second and scores each with <strong className="text-gray-200">Laplacian variance</strong> — the same sharpness metric computer-vision pipelines use to reject blurry photos. Blurry frames have smooth gradients (low variance); sharp frames have strong edges (high variance). The winner is almost always a cleaner, more usable image than the literal final frame.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Both frames are shown side by side with their exact timestamps, so you can judge with your own eyes. Most of the time the sharpest frame wins — but the choice stays yours.
        </p>
      </section>

      {/* ── AI VIDEO CHAINING ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          The AI Video Use Case: Chaining Clips Seamlessly
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Here\u2019s why "last frame extractor" searches are exploding. AI video generators — Kling, Runway, Sora, Veo, Luma — produce only 5 to 10 seconds per generation. To make a longer video, creators chain clips: extract the exact final frame of clip 1 and feed it in as the <em>start frame</em> for clip 2. Kling 4.0 even advertises dedicated first-and-last-frame controls for exactly this workflow.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          The catch is <strong className="text-gray-200">generation loss</strong>. Every time you feed an extracted frame back into a generator, quality degrades slightly — edges soften, colors drift. Feed a blurry last frame through 3 or 4 generations and the drift compounds visibly. Starting each generation from the <em>sharpest</em> available frame instead of the literal last one measurably slows that degradation. It\u2019s a small choice that compounds across a whole project.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Kling &amp; Runway chaining</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Extract the sharpest final frame, upload it as the start frame for your next generation, and extend scenes indefinitely without visible seams.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">End-card thumbnails</h3>
            <p className="text-gray-400 text-sm leading-relaxed">The final frame of a tutorial, demo, or screen recording often shows the finished result — perfect for thumbnails and documentation.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Verifying recordings</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Check what a recording actually captured before it cut off — the last frame tells you whether the ending landed or got clipped.</p>
          </div>
        </div>
      </section>

      {/* ── TIPS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Tips for Clean Final Frames
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-gray-200">Prefer PNG for AI start frames.</strong> Generators work from pixel detail — PNG or high-quality WebP preserves edges that JPG compression would smear. File size doesn\u2019t matter for a single start frame.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-gray-200">Check the timestamps.</strong> If the sharpest frame sits 0.8 seconds before the end and your video has an outro fade, that\u2019s the frame you want — the fade is exactly what sharpness detection is saving you from.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-gray-200">Mind the aspect ratio.</strong> AI video tools expect specific dimensions for start frames. If your source video doesn\u2019t match, crop or resize the extracted frame first — a stretched start frame produces stretched generations.
        </p>
        <p className="text-gray-400 leading-relaxed">
          <strong className="text-gray-200">Need more than the last frame?</strong> If you\u2019re storyboarding or hunting for the perfect moment anywhere in the clip, the <Link to="/video-to-frames" className="text-cyan-400 hover:underline">Video to Frames tool</Link> extracts the whole sequence. For a single frame at any timestamp, <Link to="/screenshot-from-video" className="text-cyan-400 hover:underline">Screenshot from Video</Link> captures at native resolution.
        </p>
      </section>

      {/* ── RELATED TOOLS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Video Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/video-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to Frames</h3>
            <p className="text-gray-500 text-xs">Extract every frame as JPG, PNG, or WebP.</p>
          </Link>
          <Link to="/video-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to JPG</h3>
            <p className="text-gray-500 text-xs">Convert video frames to JPG images.</p>
          </Link>
          <Link to="/screenshot-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Screenshot from Video</h3>
            <p className="text-gray-500 text-xs">Capture any timestamp at full resolution.</p>
          </Link>
          <Link to="/video-looper" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video Looper</h3>
            <p className="text-gray-500 text-xs">Repeat video with seamless loop detection.</p>
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

export default LastFrameExtractor;
