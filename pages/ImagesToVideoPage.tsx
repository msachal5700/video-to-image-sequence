import React, { useEffect } from 'react';
import ImagesToVideo from './ImagesToVideo';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';

const faqs = [
  {
    q: 'Is there a file size limit for images?',
    a: 'No server upload limit. Processing happens in your browser, so very large files may depend on your device memory, browser performance, and video length.'
  },
  {
    q: 'What video format does the Images to Video tool output?',
    a: 'The tool outputs WebM format (.webm), which is supported by all modern browsers, YouTube, and major editing software packages.'
  },
  {
    q: 'How do I control the video speed?',
    a: 'Use the FPS selector to configure your speed. A higher FPS (like 24 or 30 FPS) makes the frames cycle faster; a lower FPS (like 1 or 5 FPS) makes it play like a slideshow.'
  },
  {
    q: 'Can I use PNG images with transparency?',
    a: 'Yes. You can upload PNG files with alpha transparency. They will be composited onto a black background in the output video file.'
  }
];

const ImagesToVideoPage: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'images-to-video-schemas';
    
    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Images to Video Converter",
      "url": "https://www.videotoimagesequence.online/images-to-video",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Convert a sequence of JPG or PNG images into a video online for free. No upload required. Browser-based, private, and instant.",
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

    script.text = JSON.stringify([webAppSchema, faqSchema]);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('images-to-video-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="Images to Video Converter Online Free — Stitch Images to Video"
        description="Convert a sequence of JPG or PNG images into a video online for free. No server upload required. Browser-based, private, and local. Supports custom FPS."
        canonical="https://www.videotoimagesequence.online/images-to-video"
        ogTitle="Images to Video Converter — Free & Private"
        ogDescription="Turn your image sequence into a video locally in your browser. No server upload, no account, processed on device."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
      />
      

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Tools' }, { label: 'Images to Video', path: '/images-to-video' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          Convert Images to Video<br />
          <span className="text-cyan-400">Online Converter — No Server Uploads</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          Convert a sequence of JPG or PNG images into a smooth WebM video online for free. Stitch your frames locally in your browser environment without uploading files to any external servers.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {[
            '🔒 100% Private (Local)',
            '⚡ Instant Stitching',
            '🎨 JPG, PNG, WebP Input',
            '🎬 WebM Output',
            '🆓 Free Forever'
          ].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Main Tool Content */}
      <div className="animate-fade-in min-h-[400px] px-4">
        <ImagesToVideo />
      </div>

      {/* ── BROWSER SECURITY & PRIVACY ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Private, In-Browser Video Rendering
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Keep your image datasets, animation frames, and private sequences completely confidential. Our tool decodes and compiles your source JPG/PNG sequence directly inside your local web browser. Your images are never uploaded to any remote server, keeping your data entirely in your own hands.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Convert an Image Sequence to Video Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="list-decimal pl-6 space-y-4 text-gray-300 marker:text-cyan-500 marker:font-bold">
            <li>
              <strong className="text-white">Load Images:</strong> Drag and drop your JPG or PNG image files into the upload zone above. Files are automatically sorted numerically by name.
            </li>
            <li>
              <strong className="text-white">Configure Frame Rate (FPS):</strong> Choose your desired speed. Standard web video is typically 30 FPS.
            </li>
            <li>
              <strong className="text-white">Stitch:</strong> Click "Generate Video" to render your images into a single video file.
            </li>
            <li>
              <strong className="text-white">Download:</strong> Preview the output in the player and click the download button to save it as a WebM file.
            </li>
          </ol>
        </div>
      </section>

      {/* ── SUPPORTED FORMATS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Supported Format Specifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-cyan-400 font-semibold mb-2">Input Formats</h3>
            <ul className="text-gray-400 text-xs space-y-1 list-disc pl-4">
              <li>PNG (.png) - preserves lossless transparency</li>
              <li>JPEG / JPG (.jpg, .jpeg) - standard web-friendly compressed images</li>
              <li>WebP (.webp) - modern efficient browser formats</li>
            </ul>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-cyan-400 font-semibold mb-2">Output Formats</h3>
            <ul className="text-gray-400 text-xs space-y-1 list-disc pl-4">
              <li>WebM Video (.webm) - fully compatible HTML5 format supported by all modern video platforms</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── LIMITATIONS & MEMORY WARNING ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">
            ⚠️ Browser Processing Notice
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No server upload limit. Processing happens in your browser, so very large files may depend on your device memory, browser performance, and video length. Stitching hundreds of ultra-high-resolution images (such as 4K PNGs) can stress browser RAM. For large sequences, close extra tabs or stitch frames in smaller segments.
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
            <h3 className="text-white font-semibold text-lg mb-2">Stop-Motion & Timelapses</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Combine individual photo captures or timed camera frames into a smooth, playable animation clip.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">VFX Previewing</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Stitch rendered 3D render output layers into a preview video file to check visual timing and masking flow.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Slideshow Presentations</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Stitch static slide images at a low framerate (e.g. 1 FPS) to create a simple video presentation sequence.</p>
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
            <h3 className="text-white font-semibold mb-2">Images Out of Order</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our tool sorts files alphabetically. To ensure correct sequencing, name your images with leading zeroes (e.g., `frame_0001.jpg`, `frame_0002.jpg`, etc.) rather than simple numbers (`frame_1.jpg`, `frame_10.jpg`), as standard computer sorts place `frame_10` before `frame_2`.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Video Fails to Play</h3>
            <p className="text-gray-405 text-sm leading-relaxed">
              The output format is WebM. If your media player does not support WebM natively, you can open it directly in Google Chrome or Mozilla Firefox to view the video, or import it into modern video editing software.
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
          <Link to="/screenshot-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Capture Screenshot</h3>
            <p className="text-gray-500 text-xs">Grab exact full-resolution frames.</p>
          </Link>
          <Link to="/extract-frames-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Frame Extractor</h3>
            <p className="text-gray-500 text-xs">Supports MP4, MOV, WEBM and more.</p>
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

export default ImagesToVideoPage;
