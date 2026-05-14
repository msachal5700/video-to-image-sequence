import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImagesToVideo from './ImagesToVideo';
import SEOHead from '../components/SEOHead';

const faqs = [
  { q: 'Is there a file size limit for images?',
    a: 'No. All processing happens in your browser. You can load hundreds of high-resolution PNG or JPG frames with no limit.' },
  { q: 'What video format does the Images to Video tool output?',
    a: 'The tool outputs WebM format, which is supported by all modern browsers, YouTube, and most video editors.' },
  { q: 'How do I control the video speed?',
    a: 'Use the FPS selector. Higher FPS means faster playback. 24 FPS is standard for film, 30 FPS for web video.' },
  { q: 'Can I use PNG images with transparency?',
    a: 'Yes. Upload PNG files with alpha transparency and they will be composited onto a black background in the output video.' }
];

const ImagesToVideoPage: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Convert Images to Video Online",
        "description": "Stitch a sequence of JPG or PNG images into a WebM video for free in your browser.",
        "step": [
          { "@type": "HowToStep", "name": "Upload Images", "text": "Drag and drop your JPG or PNG image sequence files into the upload zone." },
          { "@type": "HowToStep", "name": "Set FPS", "text": "Choose your frame rate — 24 FPS for film, 30 FPS for web video." },
          { "@type": "HowToStep", "name": "Download Video", "text": "Click Convert and download your WebM video file instantly." }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is there a file size limit for images?",
            "acceptedAnswer": { "@type": "Answer", "text": "No. All processing happens in your browser. You can load hundreds of high-resolution PNG or JPG frames with no limit." }
          },
          {
            "@type": "Question",
            "name": "What video format does the Images to Video tool output?",
            "acceptedAnswer": { "@type": "Answer", "text": "The tool outputs WebM format, which is supported by all modern browsers, YouTube, and most video editors." }
          },
          {
            "@type": "Question",
            "name": "How do I control the video speed?",
            "acceptedAnswer": { "@type": "Answer", "text": "Use the FPS selector. Higher FPS means faster playback. 24 FPS is standard for film, 30 FPS for web video." }
          },
          {
            "@type": "Question",
            "name": "Can I use PNG images with transparency?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes. Upload PNG files with alpha transparency and they will be composited onto a black background in the output video." }
          }
        ]
      }
    ]);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="Images to Video Converter — Free Online Tool | No Upload Needed"
        description="Convert a sequence of JPG or PNG images into a video online for free. No upload required. Browser-based, private, and instant. Supports custom FPS."
        canonical="https://videotoimagesequence.online/images-to-video"
        ogTitle="Images to Video Converter — Free & Private"
        ogDescription="Turn your image sequence into a video instantly in your browser. No upload, no account, no file size limit."
        ogImage="https://videotoimagesequence.online/og-image.png"
        ogType="website"
      />
      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-16 pb-10 px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-cyan-950/50 border border-cyan-800 text-cyan-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          100% Free · No Upload · No Limits
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          Convert Images to Video<br />
          <span className="text-cyan-400">Online Converter</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          <strong className="text-white">Images to Video Converter</strong> is a free,
          browser-based tool that stitches a sequence of <strong className="text-white">JPG or PNG frames</strong> into a smooth <strong className="text-white">WebM video</strong>.
          Unlike other tools, it requires <strong className="text-white">no file upload</strong>,
          has <strong className="text-white">no file size limit</strong>, and offers custom FPS control —
          all completely free and <strong className="text-white">100% private</strong>.
        </p>
      </section>

      {/* Tool Switcher Tabs */}
      <div className="flex justify-center mb-10 px-4">
        <div className="bg-gray-900 p-1.5 rounded-xl border border-gray-800 flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 text-gray-400 hover:text-white hover:bg-gray-800/80"
          >
            Video to Images
          </Link>
          <Link
            to="/images-to-video"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 bg-cyan-500 text-gray-950 shadow-lg shadow-cyan-500/20"
          >
            Images to Video
          </Link>
        </div>
      </div>

      {/* Main Tool Content */}
      <div className="animate-fade-in min-h-[400px] px-4">
        <ImagesToVideo />
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
          How It Works
        </h2>
        <p className="text-gray-500 text-center text-sm mb-12">
          3 simple steps — no signup, no install, no upload
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-5xl font-black text-cyan-950 mb-4">01</div>
            <h3 className="text-white font-semibold text-lg mb-2">Select Images</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Drag and drop your sequence of JPG or PNG images. They will be sorted alphabetically.</p>
          </div>
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-5xl font-black text-cyan-950 mb-4">02</div>
            <h3 className="text-white font-semibold text-lg mb-2">Set Framerate</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Choose your desired FPS (frames per second) to control the speed of your video.</p>
          </div>
          <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
            <div className="text-5xl font-black text-cyan-950 mb-4">03</div>
            <h3 className="text-white font-semibold text-lg mb-2">Render Video</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Click to combine your images into a single video file, ready for download instantly.</p>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="max-w-3xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10">
          Everything you need to know about Images to Video
        </p>
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

export default ImagesToVideoPage;
