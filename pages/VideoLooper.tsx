import React, { useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import VideoLooperTool from '../components/VideoLooperTool';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I loop a video online for free?',
    a: 'Drop your video onto the box above (or click to browse). Trim the segment you want to repeat with the start/end controls — or hit “Auto-detect seamless loop points” and let the tool find the smoothest cut for you. Pick how many times to repeat it (2× to 10×), preview the loop, then export. Everything runs in your browser: no upload, no account, no watermark.'
  },
  {
    q: 'What is seamless loop-point detection, and how does it work?',
    a: 'A loop looks seamless when its last frame flows invisibly into its first. The auto-detect button samples dozens of frames across your video, builds a compact color signature for each one, and searches every valid start/end pair for the two frames that look most alike — with a minimum gap so you get a real loop, not a stutter. You get a “seamlessness score”: above 70% the cut is usually invisible; below 40% the tool tells you honestly that no clean loop exists in that footage.'
  },
  {
    q: 'Is this video looper really free? Do you upload my video?',
    a: 'Completely free, no account, no signup, no watermark. Your video never leaves your device — the analysis, preview, and rendering all happen locally in your browser tab using your own processor. Close the tab and nothing remains.'
  },
  {
    q: 'What format does the looped video export as?',
    a: 'The tool exports WebM video (VP9 where your browser supports it), which plays in Chrome, Edge, Firefox, and Safari 14.1+. MP4 export isn’t possible from a plain web page in most browsers, so the tool labels the format honestly before you render instead of failing silently. If you need MP4, any free editor — or our GIF to MP4 pipeline — can convert the WebM in seconds.'
  },
  {
    q: 'How many times can I repeat the loop?',
    a: 'Between 2× and 10× per export. The cap exists because each repetition multiplies the render work: a 10-second segment looped 10× is a 100-second video. For endless playback (a social post, an ambient background), export once and set your player or platform to loop the file — every major player supports it.'
  },
  {
    q: 'Why does my loop have a visible jump when it restarts?',
    a: 'Three usual causes. First, the start and end frames genuinely differ — camera moved, lighting changed, or a subject crossed the frame. The auto-detect score warns you about this; trust it. Second, audio: this tool loops the picture, and a hard audio cut is often what your eye “hears” as a jump — mute or fade the audio in an editor. Third, motion direction: a loop works best when movement at the end heads the same way it starts. Nudge the sliders a few frames either side of the suggestion; often the perfect cut is one or two frames away.'
  },
  {
    q: 'What’s the difference between looping and just making a GIF?',
    a: 'A GIF is a specific (and heavyweight) file format capped at 256 colors per frame. Looping is the behavior — repeating footage — and a looped WebM or MP4 looks dramatically better and weighs far less than the same loop as a GIF. If you specifically want the GIF format for compatibility, loop the video here first, then run it through the Video to GIF tool.'
  }
];

const VideoLooper: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const existing = document.getElementById('video-looper-schemas');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-looper-schemas';
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Video Looper — Free Online Seamless Loop Maker',
      url: 'https://www.videotoimagesequence.online/video-looper',
      image: 'https://www.videotoimagesequence.online/og-image.png',
      description: 'Repeat any video 2–10× free in your browser, with automatic seamless loop-point detection. No upload, no signup, no watermark.',
      applicationCategory: 'MultimediaApplication',
      applicationSubCategory: 'Video Looper',
      operatingSystem: 'All — Browser-based (Chrome, Edge, Safari, Firefox)',
      browserRequirements: 'Requires HTML5 and Javascript support',
      featureList: [
        'Repeat any video 2× to 10× in the browser',
        'Automatic seamless loop-point detection via frame-similarity analysis',
        'Seamlessness score tells you honestly how clean the loop will be',
        'Manual start/end trim with visual timeline',
        'Loop preview with infinite-playback option',
        'WebM export with honest format labeling',
        '100% browser-based — nothing uploaded or stored',
        'Free forever, no account, no watermark'
      ],
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    };
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a }
      }))
    };
    const howToSchema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Loop a Video Online',
      description: 'Repeat a video segment seamlessly, free in your browser, with automatic loop-point detection.',
      totalTime: 'PT2M',
      step: [
        { '@type': 'HowToStep', name: 'Drop in your video', text: 'Drag the video onto the upload box, or click to browse. Files up to 100 MB are accepted and never leave your device.' },
        { '@type': 'HowToStep', name: 'Find the seamless cut', text: 'Hit auto-detect to let frame-similarity analysis suggest the smoothest start/end points, or trim manually with the sliders.' },
        { '@type': 'HowToStep', name: 'Preview and export', text: 'Preview the loop (finite or infinite), pick 2–10 repetitions, and export a WebM you can post anywhere.' }
      ]
    };
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.videotoimagesequence.online/' },
        { '@type': 'ListItem', position: 2, name: 'Video Looper', item: 'https://www.videotoimagesequence.online/video-looper' }
      ]
    };
    script.textContent = JSON.stringify([webAppSchema, faqSchema, howToSchema, breadcrumbSchema]);
    document.head.appendChild(script);
    return () => { const el = document.getElementById('video-looper-schemas'); if (el) el.remove(); };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('videoLooper.title')}
        description={t('videoLooper.description')}
        canonical="https://www.videotoimagesequence.online/video-looper"
        ogTitle={t('videoLooper.title')}
        ogDescription={t('videoLooper.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoLooper.keywords')}
      />

      <Breadcrumb items={[{ label: 'Video Looper', path: '/video-looper' }]} />

      {/* ── HERO ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoLooper.h1')}<br />
          <span className="text-cyan-400">{t('videoLooper.h1Sub')}</span>
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoLooper.hero')}
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
        <VideoLooperTool />
      </section>

      {/* ── HOW TO ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Loop a Video in 3 Steps
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Drop in your video', desc: 'Drag the file onto the upload box above, or click to browse. Up to 100 MB, and it never leaves your device — the analysis and rendering happen in your tab.' },
              { num: '2', title: 'Find the seamless cut', desc: 'Hit “Auto-detect seamless loop points” and let frame-similarity analysis suggest the start/end pair that looks most alike — or trim manually with the sliders and the visual timeline.' },
              { num: '3', title: 'Preview and export', desc: 'Preview the loop finitely or infinitely, pick 2×–10× repetitions, and export a WebM file ready to post, embed, or play on loop anywhere.' },
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

      {/* ── WHY SEAMLESS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Why Most Loops Have an Ugly Jump — and How to Avoid It
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Every video looper on the internet does the same thing: it takes your clip and plays it N times back to back. The problem is the <em>seam</em> — the moment the last frame hands off to the first. If those two frames don’t look nearly identical, your eye catches the cut instantly: a person teleports a few pixels, the light shifts, the background stutters. The loop feels broken, and no amount of repetition fixes it.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          Professional loop makers solve this by hunting for the cut manually — scrubbing frame by frame until they find two frames that match. It’s tedious, skilled work. That’s exactly what the auto-detect button automates: it samples dozens of frames, builds a compact visual signature for each, and searches every valid start/end combination for the pair with the smallest visual difference. What took ten minutes of scrubbing now takes one click.
        </p>
        <p className="text-gray-400 leading-relaxed">
          The honesty matters as much as the automation. Some footage simply has no clean loop — a camera pan, a walk across frame, changing light. Most tools would hand you a jumpy file and shrug. This one shows you a <strong className="text-gray-200">seamlessness score</strong> and tells you plainly when the footage won’t loop cleanly, so you can pick a different segment instead of exporting garbage.
        </p>
      </section>

      {/* ── USE CASES ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          What People Actually Use Video Loops For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Social media loops</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Short looping clips outperform static posts on every major feed. A 3-second perfect loop of coffee pouring, waves breaking, or a product rotating holds attention far longer than the same footage played once — the seamlessness is what makes people watch it five times instead of once.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Ambient backgrounds</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Websites, streams, and digital signage run video on infinite repeat for hours. A visible jump every few seconds ruins the effect; a seamless loop disappears into the atmosphere. Export once, set your player to repeat, done.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Loop-ready GIFs and stickers</h3>
            <p className="text-gray-400 text-sm leading-relaxed">The best reaction GIFs are perfect loops — that’s what makes them hypnotic. Find your seamless segment here first, export it, then run it through the <Link to="/video-to-gif" className="text-cyan-400 hover:underline">Video to GIF tool</Link> for a loop that actually loops.</p>
          </div>
        </div>
      </section>

      {/* ── TIPS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Tips for Loops Nobody Can See
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-gray-200">Shoot for the loop.</strong> The easiest seamless loops come from footage designed for them: a locked-off tripod shot of something cyclical — water, fire, crowds, machinery. If the camera never moves and the action repeats naturally, auto-detect will find a near-perfect cut almost every time.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-gray-200">Match motion direction.</strong> A loop feels seamless when movement flows continuously across the seam. If your subject moves left-to-right at the end of the segment, it should be moving left-to-right at the start too. When the score is mediocre, nudge the sliders a few frames — the perfect cut is often one or two frames from the suggestion.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-gray-200">Mind the audio.</strong> This tool loops the picture; a hard audio cut is the most common reason an otherwise perfect loop “feels” jumpy. Mute the export, or fade the audio in an editor. Many loop posts run silent anyway.
        </p>
        <p className="text-gray-400 leading-relaxed">
          <strong className="text-gray-200">Shorter is smoother.</strong> A 2–4 second loop has far more candidate cut points that match than a 20-second one, and short loops read better on social feeds. When in doubt, trim tighter.
        </p>
      </section>

      {/* ── BROWSER SUPPORT ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Export Format, Stated Plainly
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          The tool exports <strong className="text-gray-200">WebM</strong> video (VP9 codec where your browser supports it). WebM plays natively in Chrome, Edge, Firefox, and Safari 14.1+, and every major social platform accepts it as an upload. It’s also dramatically smaller than the GIF equivalent of the same loop.
        </p>
        <p className="text-gray-400 leading-relaxed">
          What it doesn’t do is MP4 — a plain web page can’t mux MP4 reliably across browsers, and a tool that promises otherwise is lying to you. If your destination demands .mp4, convert the WebM in any free editor, or ask in the <Link to="/contact" className="text-cyan-400 hover:underline">contact page</Link> and we’ll point you at the fastest route.
        </p>
      </section>

      {/* ── RELATED TOOLS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Video Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/video-to-gif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to GIF</h3>
            <p className="text-gray-500 text-xs">Turn your perfect loop into a shareable animated GIF.</p>
          </Link>
          <Link to="/gif-to-mp4" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">GIF to MP4</h3>
            <p className="text-gray-500 text-xs">Convert heavy GIFs into small, smooth MP4 video.</p>
          </Link>
          <Link to="/stop-motion-capture" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Stop Motion Capture</h3>
            <p className="text-gray-500 text-xs">Frame-by-frame animation with onion-skin ghosting.</p>
          </Link>
          <Link to="/video-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to Frames</h3>
            <p className="text-gray-500 text-xs">Extract stills from any video as JPG, PNG, or WebP.</p>
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

export default VideoLooper;
