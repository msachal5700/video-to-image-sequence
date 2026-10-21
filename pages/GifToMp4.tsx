import React from 'react';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import GifToMp4Tool from '../components/GifToMp4Tool';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I convert a GIF to MP4?',
    a: 'Drop your GIF onto the box above (or click to browse for it). The tool decodes every frame of the animation in your browser, re-encodes them as H.264 video, and hands you a real .mp4 file to download. Pick your framerate and quality first if you like, or just hit convert with the defaults — the whole thing takes seconds.'
  },
  {
    q: 'Is this GIF to MP4 converter free? Do I need an account?',
    a: 'Completely free, no account, no signup, no watermark. Everything runs locally in your browser tab using your own device’s processor, so there are no servers to pay for and no usage quotas to enforce.'
  },
  {
    q: 'Why is the MP4 so much smaller than my GIF?',
    a: 'GIF is a 1987 format: it stores every frame as a full 256-color image with almost no compression between frames. H.264 video — the codec inside an MP4 — only stores what changes from frame to frame, and it can use millions of colors. For typical animations that means 5–10× smaller files at the same visual quality. Your 8 MB reaction GIF often becomes a 1 MB video.'
  },
  {
    q: 'Will converting to MP4 reduce the quality of my GIF?',
    a: 'Technically yes — H.264 is a lossy codec while GIF is lossless — but at the default Balanced setting the difference is invisible for normal animations. GIFs only have 256 colors per frame anyway, so there isn’t much fine detail to lose. If you’re converting pixel art or text-heavy GIFs, choose “Higher quality” for extra safety margin.'
  },
  {
    q: 'What happens to transparency in my GIF?',
    a: 'MP4 video has no alpha channel, so transparency can’t survive the trip — this is true of every GIF to MP4 converter, not just this one. Transparent pixels are composited onto a background color, which you choose before converting: white or black. Pick whichever matches where the video will be shown.'
  },
  {
    q: 'Which browsers can convert GIF to MP4 here?',
    a: 'Any recent Chromium browser (Chrome, Edge, Opera, Brave) encodes true H.264 MP4 via the WebCodecs API. Safari can also produce MP4 through its built-in recorder. Firefox can’t write MP4 in a web page, so there you’ll get a WebM file instead — the tool tells you honestly which encoder it’s using before you convert, never silently.'
  },
  {
    q: 'Do you upload my GIF to a server?',
    a: 'No. The file never leaves your device. Decoding, encoding, and packaging all happen locally in your browser tab. Close the tab and nothing remains — there is nothing to delete because nothing was ever stored.'
  },
  {
    q: 'What’s the difference between this and your GIF to Frames tool?',
    a: 'They’re a two-way workflow. GIF to Frames pulls an animation apart into individual still images. This page does the reverse trip for video: it packs an animation into a proper video file. Extracted frames you want to share? Convert the GIF to MP4. Have an MP4 you want stills from? Use the frame tools.'
  }
];

const GifToMp4: React.FC = () => {
  const { t } = useTranslation();

  const webAppSchema = {
    '@type': 'WebApplication',
    name: 'GIF to MP4 — Free Online Converter',
    url: 'https://www.videotoimagesequence.online/gif-to-mp4',
    image: 'https://www.videotoimagesequence.online/og-image.png',
    description: 'Convert animated GIF and WebP files to MP4 video free in your browser. Smaller files, smoother playback, no upload, no signup.',
    applicationCategory: 'MultimediaApplication',
    applicationSubCategory: 'GIF to MP4 Converter',
    operatingSystem: 'All — Browser-based (Chrome, Edge, Safari, Firefox)',
    browserRequirements: 'Requires HTML5 and Javascript support',
    featureList: [
      'Convert animated GIF to MP4 (H.264) in the browser',
      'Animated WebP to MP4 supported too',
      'Manual framerate, quality, and transparency-background controls',
      'Original vs converted file-size comparison',
      'Honest browser-support labeling (WebM fallback where MP4 is unavailable)',
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
    name: 'How to Convert a GIF to MP4',
    description: 'Turn an animated GIF or WebP into a smaller, smoother MP4 video file, free in your browser.',
    totalTime: 'PT1M',
    step: [
      { '@type': 'HowToStep', name: 'Drop in your GIF', text: 'Drag the animated file onto the upload box, or click to browse. Files up to 50 MB are accepted.' },
      { '@type': 'HowToStep', name: 'Tune the manual settings', text: 'Pick a framerate, quality level, and background color for transparent pixels — or leave the defaults.' },
      { '@type': 'HowToStep', name: 'Convert and download', text: 'The animation is re-encoded as H.264 video on your device. Download the MP4 and compare the file size.' }
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
        title={t('gifToMp4.title')}
        description={t('gifToMp4.description')}
        canonical="https://www.videotoimagesequence.online/gif-to-mp4"
        ogTitle={t('gifToMp4.title')}
        ogDescription={t('gifToMp4.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('gifToMp4.keywords')}
      />

      <Breadcrumb items={[{ label: 'GIF to MP4', path: '/gif-to-mp4' }]} />

      {/* ── HERO ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('gifToMp4.h1')}<br />
          <span className="text-cyan-400">{t('gifToMp4.h1Sub')}</span>
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('gifToMp4.hero')}
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
        <GifToMp4Tool />
      </section>

      {/* ── HOW TO ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Convert GIF to MP4 in 3 Steps
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Drop in your GIF or animated WebP', desc: 'Drag the file onto the upload box above, or click to browse. Files up to 50 MB are accepted, and every frame is decoded on your device — not on a server.' },
              { num: '2', title: 'Tune the manual settings (optional)', desc: 'Pick a framerate, a quality level, and the background color that transparent pixels get flattened onto. Defaults are tuned for the typical reaction GIF and work fine untouched.' },
              { num: '3', title: 'Convert and download the MP4', desc: 'The animation is re-encoded as H.264 video right in your tab. You get an original-vs-converted size comparison, a playable preview, and a one-click download.' },
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

      {/* ── WHY MP4 ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Why MP4 Beats GIF for Sharing Animation
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          The GIF format dates to 1987, and it shows. Every frame is stored as its own little 256-color picture, and the format barely compresses the redundancy <em>between</em> frames — which is most of what an animation is. The result: a ten-second reaction clip that should weigh a megabyte weighs eight. Every messaging app, social feed, and forum that accepts your GIF pays that tax in load time, data usage, and stuttery playback.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          MP4 with H.264 video works the way modern compression should. It stores one full frame, then only records what <em>changes</em> in the frames after it. It also speaks millions of colors instead of 256, so gradients stop looking banded and dithered. For the same animation, expect a file 5–10× smaller that starts playing instantly and scrubs smoothly — on phones, where most GIFs are actually watched, the difference is night and day.
        </p>
        <p className="text-gray-400 leading-relaxed">
          There’s a compatibility angle too. Platforms increasingly treat GIF uploads as second-class citizens: some recompress them badly, some cap their length, and a few quietly convert them to video on their own servers — with quality settings you don’t control. Handing them an MP4 you encoded yourself means your animation arrives exactly as you made it.
        </p>
      </section>

      {/* ── WHAT CHANGES ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          What Actually Changes When You Convert
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Honest version first: conversion is not magic, and a trustworthy tool should tell you what it can’t do. H.264 is a <strong className="text-gray-200">lossy</strong> codec while GIF is lossless, so in strict technical terms some information is discarded. In practice, at the Balanced setting, the difference is invisible on normal animations — GIFs only carry 256 colors per frame, so there’s very little fine detail for the codec to lose. Pixel art and sharp text are the edge cases; that’s what the Higher quality setting is for.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          The one hard limitation is <strong className="text-gray-200">transparency</strong>. The MP4 container has no alpha channel, full stop — no converter on earth can keep it. Transparent pixels get composited onto a solid background, which is why the tool asks you to pick white or black before encoding. Choose whichever matches the page, chat bubble, or slide the video will live on, and the seam disappears.
        </p>
        <p className="text-gray-400 leading-relaxed">
          What <em>doesn’t</em> change: timing, dimensions, and loop behavior. Frame delays are carried over exactly, so a 2.4-second GIF becomes a 2.4-second video. The resolution stays pixel-identical (padded by one pixel only if a dimension is odd, which H.264 requires). And MP4s loop in every major player and browser, so your endlessly-repeating meme keeps repeating.
        </p>
      </section>

      {/* ── MANUAL CONTROLS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Manual Controls: Framerate, Quality, Background
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Most converters give you a button and a prayer. This one gives you the three knobs that actually matter — and explains what each does, so you’re choosing rather than guessing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Framerate</h3>
            <p className="text-gray-400 text-sm leading-relaxed"><strong className="text-gray-200">Auto</strong> keeps your GIF’s original timing frame-for-frame. <strong className="text-gray-200">15 fps</strong> is the sweet spot for memes and reactions — smaller files, still smooth. <strong className="text-gray-200">24/30 fps</strong> suit screen recordings and smooth motion, at the cost of larger files.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Quality</h3>
            <p className="text-gray-400 text-sm leading-relaxed"><strong className="text-gray-200">Smaller file</strong> squeezes the bitrate for sharing in chats with size limits. <strong className="text-gray-200">Balanced</strong> is the default: visually transparent for typical GIFs. <strong className="text-gray-200">Higher quality</strong> doubles the bitrate headroom for pixel art, text, and flat colors that show compression first.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Transparency background</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Because MP4 can’t store transparency, see-through pixels land on <strong className="text-gray-200">white</strong> or <strong className="text-gray-200">black</strong> — your choice. Match it to where the video will be displayed and nobody will ever know the GIF had transparency at all.</p>
          </div>
        </div>
      </section>

      {/* ── BROWSER SUPPORT ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Browser Support, Stated Plainly
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Encoding real H.264 video inside a web page needs the <strong className="text-gray-200">WebCodecs API</strong>, and today that means Chromium browsers: Chrome, Edge, Brave, and Opera all encode genuine .mp4 files here. Safari can’t use WebCodecs for this, but its built-in media recorder still produces MP4 — slightly less efficient, fully playable everywhere.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Firefox is the honest exception: it can’t write MP4 from a web page at all. Rather than failing mysteriously, the tool detects this up front and offers a <strong className="text-gray-200">WebM</strong> file instead — same animation, same quality controls, a format Firefox, Chrome, and most players handle fine. The encoder badge above the Convert button always tells you which path you’re on before you commit.
        </p>
      </section>

      {/* ── TROUBLESHOOTING ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Troubleshooting Common Issues
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">“Doesn’t look like a GIF or WebP” error</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The file’s contents didn’t match either format — it may have the wrong extension, or be a video file renamed to .gif (common with downloads from social apps). Actual video files belong in the <Link to="/video-to-frames" className="text-cyan-400 hover:underline">video frame extractor</Link>.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">The MP4 came out larger than the GIF</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Happens with tiny, already-efficient GIFs: H.264 has container overhead that can outweigh the savings below ~100 KB. Switch quality to “Smaller file” or drop the framerate to 15 fps — or just keep the GIF, since at that size there’s nothing to gain.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">I got a WebM instead of an MP4</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              You’re on Firefox, which can’t mux MP4 in a web page. The WebM plays in all major browsers and most editors; if you specifically need .mp4, re-run the same file in Chrome or Edge.
            </p>
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Animation Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/gif-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">GIF to Frames</h3>
            <p className="text-gray-500 text-xs">The two-way workflow: pull any GIF apart into individual frames.</p>
          </Link>
          <Link to="/video-to-gif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to GIF</h3>
            <p className="text-gray-500 text-xs">The reverse trip: turn video clips into animated GIFs.</p>
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

export default GifToMp4;
