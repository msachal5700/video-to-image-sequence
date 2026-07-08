import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import AdsterraAd from '../components/AdsterraAd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I take a screenshot from a video online?',
    a: 'Upload your video above, let the tool extract frames at your chosen interval, browse the grid, and click the download button on your desired frame to save it as a JPG or PNG.'
  },
  {
    q: 'What resolution will my video screenshot be?',
    a: 'The screenshot will match the native resolution of your source video file (e.g. 1080p or 4K) — far sharper than a standard monitor screenshot which is capped by screen resolution.'
  },
  {
    q: 'Can I capture a specific frame or timestamp?',
    a: 'Yes. Choose a high FPS setting (like 30 FPS) to extract consecutive frames around the time you want, and then download the exact image.'
  },
  {
    q: 'Is there a file size limit for video screenshots?',
    a: 'No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support.'
  },
  {
    q: 'Does it work for MP4, MOV, and WEBM videos?',
    a: 'Yes. It supports the three most common video formats used by screen recorders, cameras, and mobile devices.'
  }
];

const ScreenshotFromVideo: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('screenshot-from-video-schemas');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'screenshot-from-video-schemas';
    
    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Screenshot from Video",
      "url": "https://www.videotoimagesequence.online/screenshot-from-video",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Take a screenshot from MP4, MOV, and WEBM videos online for free. Capture the exact frame you need locally in your browser.",
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
      "name": "How to Take a Screenshot from Video Online",
      "description": "Learn how to capture high-resolution screenshots from MP4, MOV, or WEBM video frames locally.",
      "totalTime": "PT1M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Load Your Video",
          "text": "Select your video file from your local computer or phone."
        },
        {
          "@type": "HowToStep",
          "name": "Seek to Target Frame",
          "text": "Use the video scrubber or frame-stepping controls to locate the exact moment."
        },
        {
          "@type": "HowToStep",
          "name": "Capture Screenshot",
          "text": "Click the Capture Screenshot button to draw the frame at full resolution onto a canvas."
        },
        {
          "@type": "HowToStep",
          "name": "Download Still Image",
          "text": "Download the captured frame as a PNG or JPG still image locally."
        }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('screenshot-from-video-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="Screenshot from Video Online Free — Capture Video Frames Locally"
        description="Take a screenshot from MP4, MOV, and WEBM videos online for free. Capture the exact frame you need locally in your browser. No server upload required."
        canonical="https://www.videotoimagesequence.online/screenshot-from-video"
        ogTitle="Screenshot from Video — Free Online Frame Capture Tool"
        ogDescription="Capture any frame from your video as a JPG or PNG screenshot. Free, local browser processing, no server upload."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords="screenshot from video, video frame grabber, extract still from video, video frame capture"
      />
      
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Screenshot from Video', path: '/screenshot-from-video' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          Screenshot from Video<br />
          <span className="text-cyan-400">Capture Video Frames Online — Free & Local</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          Take a screenshot from MP4, MOV, and WEBM videos online for free. Extract the exact frame you need in full native resolution. No server uploads, no watermarks, completely private.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {[
            '🎯 Native Resolution Capture',
            '🔒 100% Private (Local)',
            '⚡ Fast Local Processing',
            '📷 JPG & PNG Output',
            '🆓 Free Forever'
          ].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Adsterra Ad — Pre-Tool */}
      <div className="max-w-5xl mx-auto px-4">
        <AdsterraAd label="Advertisement" />
      </div>

      {/* Main Tool Content */}
      <div className="animate-fade-in min-h-[400px] px-4">
        <VideoToImages />
      </div>

      {/* ── BROWSER SECURITY & PRIVACY ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Secure, Client-Side Frame Capturing
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Avoid sending private video content, screen recordings, or camera uploads to third-party cloud servers. Our browser-based extraction engine uses modern web video decoders to process files locally. Because no files are uploaded, your frames stay safe on your computer, making this tool perfect for private media and security footage.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Capture a Full-Resolution Screenshot from Video
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="list-decimal pl-6 space-y-4 text-gray-300 marker:text-cyan-500 marker:font-bold">
            <li>
              <strong className="text-white">Load Video File:</strong> Drag and drop your MP4, MOV, or WEBM video file into the tool above.
            </li>
            <li>
              <strong className="text-white">Select Format:</strong> Choose between JPG (smaller files) or PNG (lossless format).
            </li>
            <li>
              <strong className="text-white">Set Freq (FPS):</strong> Choose the extraction frequency. Set a high value (like 30 FPS) to get consecutive frames of a fast-moving scene.
            </li>
            <li>
              <strong className="text-white">Extract:</strong> Click "Extract Frames Now" to load the frame grid.
            </li>
            <li>
              <strong className="text-white">Download Screenshot:</strong> Hover over the target frame in the grid and click the download button to save it locally.
            </li>
          </ol>
        </div>
      </section>

      {/* Adsterra Ad — Post How-To */}
      <div className="max-w-5xl mx-auto px-4">
        <AdsterraAd label="Advertisement" />
      </div>

      {/* ── HOW IS THIS DIFFERENT ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          How is this different from Print Screen?
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-4 text-gray-300">
          <ul className="list-disc pl-5 space-y-4 marker:text-cyan-500">
            <li>
              <strong className="text-white">Full Native Quality:</strong> Print Screen (or CMD+Shift+4) only grabs the resolution of your display monitor. Our tool exports at the video\'s native resolution (e.g. 1920x1080 or 4K), even if your screen is low-res.
            </li>
            <li>
              <strong className="text-white">Zero UI Elements:</strong> Captures clean video frames without player interfaces, cursor marks, or browser toolbars.
            </li>
            <li>
              <strong className="text-white">Frame Accuracy:</strong> Lets you parse consecutive frames to capture split-second moments that are hard to capture by pausing a normal player.
            </li>
          </ul>
        </div>
      </section>

      {/* ── LIMITATIONS & MEMORY WARNING ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">
            ⚠️ Browser Processing Notice
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support. Extracting a very long sequence of images can consume significant RAM. If the browser tab feels sluggish or crashes, decrease the FPS setting to output fewer frames.
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
            <h3 className="text-white font-semibold mb-2">Unable to find the exact frame</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              If the moment you want to capture lies between extracted frames, increase your FPS setting (e.g. up to 30 or 60 FPS) to decrease the gap between the previewed images.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Black Frames Extracted</h3>
            <p className="text-gray-405 text-sm leading-relaxed">
              Some videos contain black frames at the very beginning (fade-in). Let the parser extract further into the video or check your video codec parameters.
            </p>
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS (INTERNAL LINKING) ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Online Frame Extractors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/mp4-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">MP4 to JPG</h3>
            <p className="text-gray-500 text-xs">Convert MP4 videos into high-quality JPGs.</p>
          </Link>
          <Link to="/video-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to PNG</h3>
            <p className="text-gray-500 text-xs">Extract lossless transparent PNG frames.</p>
          </Link>
          <Link to="/extract-frames-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Frame Extractor</h3>
            <p className="text-gray-500 text-xs">Supports MP4, MOV, WEBM and more.</p>
          </Link>
          <Link to="/images-to-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Images to Video</h3>
            <p className="text-gray-500 text-xs">Stitch frame sequences into a WebM video.</p>
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
            <details key={i} className="border border-gray-800 bg-gray-900/50 rounded-2xl p-5 cursor-pointer group hover:border-cyan-850 transition-colors">
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

export default ScreenshotFromVideo;
