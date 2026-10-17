import React, { useEffect } from 'react';
import StopMotionCaptureTool from '../components/StopMotionCaptureTool';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'What is onion skin in stop motion animation?',
    a: 'Onion skin is a translucent overlay — a "ghost" — of your last captured frame (or two) shown on top of the live camera view. It lets you see exactly where your character or object was in the previous frame so you can nudge it the right distance before capturing the next one. Professional animators call it the single most important feature of any stop motion app, because it is what turns random jitter into smooth, intentional motion.'
  },
  {
    q: 'How do I make a stop motion video with my webcam?',
    a: 'Click "Enable Camera" in the studio above and allow camera access. Position your subject, then capture a frame with the big button (or the Spacebar). Move your object a tiny amount, capture again, and repeat. The onion-skin ghost shows your last frame so every move lands where you want it. When you have enough frames, press Play to preview at adjustable FPS, then export as an animated GIF, a WebM video, or a ZIP of PNG frames.'
  },
  {
    q: 'Is this stop motion maker really free? Do I need an account?',
    a: 'Completely free, no account, no watermark, no frame limit. Everything runs in your browser: the camera feed is drawn to a local canvas and never uploaded to any server. Your animation stays on your device from the first captured frame to the final export.'
  },
  {
    q: 'What frame rate should I use for stop motion?',
    a: 'Start with 8 fps — it is forgiving for beginners and keeps the frame count manageable (80 frames gives you a 10-second clip). 12 fps is the classic "ones on twos" feel used in many professional productions. 24 fps looks buttery smooth but needs three times the frames and patience. The preview player lets you audition any speed before you export, so experiment freely.'
  },
  {
    q: 'Should I export my animation as GIF or WebM?',
    a: 'Export a GIF when you want to share quickly — it plays everywhere, embeds in chats, forums, and social posts, and needs no player. Export WebM when quality matters: it keeps full color fidelity at a fraction of the file size, making it the better choice for YouTube uploads or archiving your project. The ZIP of PNG frames is for editors: import the sequence into Premiere, DaVinci Resolve, or any video editor for sound, titles, and color grading.'
  },
  {
    q: 'Can I use this for classroom projects or with kids?',
    a: 'Yes — that is one of its best uses. There is no signup, so students can open the page and start animating in seconds on a Chromebook or classroom computer. Claymation, paper cut-outs, LEGO builds, and whiteboard drawings all work. The privacy note at the top of the tool explains that the camera feed never leaves the device, which matters for school IT policies. Tip: tape the camera down and use consistent desk-lamp lighting to avoid flicker between frames.'
  }
];

const StopMotionCapture: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('stop-motion-capture-schemas');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'stop-motion-capture-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Free Stop Motion Maker — Onion Skin Animation Studio Online",
      "url": "https://www.videotoimagesequence.online/stop-motion-capture",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Make stop motion animation free in your browser — webcam capture with onion skin ghosting, frame-by-frame preview, and GIF/WebM export. No signup, no app needed.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Stop Motion Animation Tool",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires webcam (getUserMedia) and canvas support",
      "featureList": [
        "Webcam frame-by-frame capture",
        "Onion skin ghost overlay with adjustable opacity (1–2 frames)",
        "Spacebar capture shortcut",
        "Filmstrip with delete and reorder",
        "Playback preview at 1–24 fps",
        "Export as animated GIF, WebM video, or ZIP of PNG frames",
        "100% client-side — camera feed never leaves your browser"
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
      "name": "How to Make a Stop Motion Animation Online",
      "description": "Capture frame-by-frame animation with your webcam using onion-skin ghosting, then export as GIF or WebM — free in your browser.",
      "totalTime": "PT10M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Enable your camera",
          "text": "Click Enable Camera and allow webcam access. The feed is processed locally and never uploaded."
        },
        {
          "@type": "HowToStep",
          "name": "Capture frames one by one",
          "text": "Pose your subject, press the capture button or Spacebar, then move the subject slightly and capture again. The onion-skin ghost of the last frame guides each move."
        },
        {
          "@type": "HowToStep",
          "name": "Preview the animation",
          "text": "Press Play to watch your frames at an adjustable speed from 1 to 24 fps. Delete or reorder frames in the filmstrip."
        },
        {
          "@type": "HowToStep",
          "name": "Export and share",
          "text": "Download your animation as an animated GIF, a WebM video, or a ZIP of PNG frames for editing."
        }
      ]
    };

    script.text = JSON.stringify({ "@context": "https://schema.org", "@graph": [webAppSchema, faqSchema, howToSchema] });
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('stop-motion-capture-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('stopMotionCapture.title')}
        description={t('stopMotionCapture.description')}
        canonical="https://www.videotoimagesequence.online/stop-motion-capture"
        ogTitle={t('stopMotionCapture.title')}
        ogDescription={t('stopMotionCapture.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('stopMotionCapture.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Stop Motion Capture', path: '/stop-motion-capture' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('stopMotionCapture.h1')}<br />
          <span className="text-cyan-400">{t('stopMotionCapture.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('stopMotionCapture.hero')}
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
        <StopMotionCaptureTool />
      </div>

      {/* ── WHAT IS STOP MOTION ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          What Is Stop Motion Animation?
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Stop motion is the oldest animation trick in the book: photograph an object, move it a tiny amount, photograph it again — and when the stills play back in sequence, the object appears to move on its own. From the clay creatures of early cinema to today's LEGO YouTube channels with millions of subscribers, the principle has never changed. What <strong className="text-white">has</strong> changed is the equipment: you no longer need a film camera, a darkroom, or editing software. A webcam and a browser are enough.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          The catch is precision. Move a figure one centimeter between frames and the motion reads as smooth; move it three centimeters and it jumps. Professionals solve this with <strong className="text-white">onion skinning</strong> — a translucent ghost of the previous frame overlaid on the live camera view, named for the see-through layers of an onion. You can literally see where your character was a moment ago, so each nudge lands exactly where the motion needs it. Without onion skin, beginners produce jittery, unpredictable animation; with it, the first attempt already looks intentional.
        </p>
        <p className="text-gray-400 leading-relaxed">
          This studio puts that professional workflow in a web page. Capture frames with your webcam, watch the ghost overlay guide every move, preview the animation at any speed from 1 to 24 frames per second, then export a shareable GIF, a high-quality WebM video, or the raw PNG frame sequence for editing. No app to install, no account to create, no footage uploaded anywhere — the camera feed is drawn to a canvas in your own browser tab and discarded the moment you close it.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Make Stop Motion Animation Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-6">
            {[
              { title: 'Enable your camera', desc: 'Click the camera button and allow webcam access when your browser asks. Choose SD for quick sessions or HD for crisper exports. Your feed is processed locally — nothing is recorded or uploaded.' },
              { title: 'Lock down your setup', desc: 'Tape or clamp the camera so it cannot shift, and light your scene with a steady lamp rather than daylight. A wobbling camera or flickering light is the number-one cause of amateur-looking stop motion.' },
              { title: 'Capture frame by frame', desc: 'Pose your subject and hit the big capture button — or tap the Spacebar for hands-free shooting. Move the object a small, consistent amount, capture again, repeat. The onion-skin ghost shows the previous one or two frames at adjustable opacity so every move is deliberate.' },
              { title: 'Preview and refine', desc: 'Press Play to watch your animation at 1–24 fps. Delete misfires and reorder frames in the filmstrip. Eight frames per second is a forgiving starting point; twelve gives the classic stop-motion feel.' },
              { title: 'Export and share', desc: 'Download an animated GIF for instant sharing, a WebM video for YouTube-quality playback, or a ZIP of PNG frames to edit with sound and titles in a video editor.' },
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
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

      {/* ── USE CASES ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          What People Make with a Free Stop Motion App
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Claymation &amp; LEGO Films</h3>
            <p className="text-gray-500 text-sm leading-relaxed">The classics. Clay figures and brick-built sets are made for incremental posing, and onion skinning keeps walk cycles smooth instead of stuttery.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Classroom Projects</h3>
            <p className="text-gray-500 text-sm leading-relaxed">No signup means a whole class can animate in minutes on Chromebooks. Paper cut-outs, whiteboard drawings, and science demos all work — and the camera feed never leaves the device.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Product &amp; Food Videos</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Small brands animate products assembling themselves or ingredients dancing into a bowl. Stop motion stands out in feeds full of static photos.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Timelapse-Style Sequences</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Capture a drawing, a plant, or a build one frame at a time, then play it back at 12–24 fps for a satisfying compressed-time effect.</p>
          </div>
        </div>
      </section>

      {/* ── TIPS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Tips for Smoother Stop Motion
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-white">Move less than you think.</strong> Beginners almost always move objects too far between frames. A character crossing the screen in 24 frames needs to advance only a few millimeters per shot at typical webcam distances — the onion skin ghost is your ruler; aim for a small, consistent offset each time.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-white">Kill the flicker.</strong> Auto-exposure and auto-white-balance fight you: one frame is bright, the next is dim. If your camera app allows it, lock exposure before you start. Otherwise, keep lighting constant and avoid shooting near windows where clouds change the light mid-session.
        </p>
        <p className="text-gray-400 leading-relaxed">
          <strong className="text-white">Ease in and out.</strong> Real motion accelerates and decelerates. Start a move with tiny nudges, make the middle frames bigger, then shrink them again as the object arrives. This easing is the difference between robotic sliding and motion that feels alive — and the ghost overlay makes it easy to judge each increment.
        </p>
      </section>

      {/* ── RELATED TOOLS (INTERNAL LINKING) ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Animation Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/video-to-gif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to GIF</h3>
            <p className="text-gray-500 text-xs">Turn video clips into shareable animated GIFs.</p>
          </Link>
          <Link to="/images-to-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Images to Video</h3>
            <p className="text-gray-500 text-xs">Assemble image sequences into MP4 video.</p>
          </Link>
          <Link to="/video-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to Frames</h3>
            <p className="text-gray-500 text-xs">Extract frame sequences from any video.</p>
          </Link>
          <Link to="/gif-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">GIF to Frames</h3>
            <p className="text-gray-500 text-xs">Pull individual frames out of animated GIFs.</p>
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

export default StopMotionCapture;
