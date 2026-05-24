import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';

const faqs = [
  {
    q: 'How do I convert an MP4 video to JPG images for free?',
    a: 'Simply drag and drop your MP4 file into the tool, select JPG format, choose your FPS, and click Extract. All frames are processed locally in your browser and will download as a ZIP file. No account or server upload needed.'
  },
  {
    q: 'Is there a file size limit for MP4 to JPG conversion?',
    a: 'No server upload limit. Processing happens in your browser, so very large files may depend on your device memory, browser performance, and video length.'
  },
  {
    q: 'How many JPG frames will I get from my MP4?',
    a: 'It depends on your video duration and chosen FPS (Frames Per Second) setting. For example, a 10-second video converted at 10 FPS will extract approximately 100 JPG images.'
  },
  {
    q: 'Can I convert MP4 to PNG instead of JPG?',
    a: 'Yes. Use the format selector inside the tool to switch to PNG output if you need lossless quality frames.'
  },
  {
    q: 'Does MP4 to JPG conversion work on mobile devices?',
    a: 'Yes. Our tool runs directly in modern mobile web browsers like Safari on iOS and Chrome on Android, though performance depends on the device\'s hardware capability.'
  }
];

const Mp4ToJpg: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'mp4-to-jpg-schemas';
    
    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "MP4 to JPG Converter",
      "url": "https://www.videotoimagesequence.online/mp4-to-jpg",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Convert MP4 video to JPG images online for free. Extract every frame as a high-quality JPG instantly in your browser.",
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
      const el = document.getElementById('mp4-to-jpg-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="MP4 to JPG Converter Online Free — Extract JPG Frames from MP4"
        description="Convert MP4 video to JPG images online for free. Extract every frame as a high-quality JPG instantly in your browser. No server upload required."
        canonical="https://www.videotoimagesequence.online/mp4-to-jpg"
        ogTitle="MP4 to JPG Converter — Free, No Upload"
        ogDescription="Extract JPG frames from any MP4 video instantly in your browser. Free forever, no account needed."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Tools' }, { label: 'MP4 to JPG', path: '/mp4-to-jpg' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          MP4 to JPG Converter<br />
          <span className="text-cyan-400">Online Free — Local Browser Processing</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          Convert MP4 video to JPG images online for free. Extract every frame as a high-quality JPG sequence instantly in your browser. Since files are processed locally, your video data never leaves your device.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {[
            '🔒 100% Private (Local)',
            '⚡ Instant Conversion',
            '📦 ZIP Download',
            '🎨 Custom FPS Control',
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
        <VideoToImages />
      </div>

      {/* ── BROWSER SECURITY & PRIVACY ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          100% Private Browser-Based Frame Extraction
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Unlike online tools that upload your video files to a remote cloud server, our MP4 to JPG converter leverages HTML5 Web APIs to decode videos directly inside your web browser. Your video is parsed locally and the images are saved in your browser environment. Your files are never transmitted across the network, keeping your sensitive or proprietary footage completely secure.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Convert MP4 to JPG Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="list-decimal pl-6 space-y-4 text-gray-300 marker:text-cyan-500 marker:font-bold">
            <li>
              <strong className="text-white">Choose Your MP4:</strong> Drag and drop your MP4 file into the upload zone above.
            </li>
            <li>
              <strong className="text-white">Configure Output Frame Rate (FPS):</strong> Choose your extraction frequency. Select 30 FPS to grab 30 frames per second of video, or choose 1 FPS to extract one frame per second.
            </li>
            <li>
              <strong className="text-white">Select Format:</strong> Ensure "JPG" is selected as the output format.
            </li>
            <li>
              <strong className="text-white">Extract Frames:</strong> Click "Extract Frames Now" to decode the video frame sequence.
            </li>
            <li>
              <strong className="text-white">Save Output:</strong> Download individual frames from the preview grid or click "Download All (ZIP)" to save the entire sequence in a single ZIP.
            </li>
          </ol>
        </div>
      </section>

      {/* ── SETTINGS GUIDELINES TABLE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display text-left">
          Recommended Settings for Frame Extraction
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          Depending on your specific project goals, use the following configurations to optimize processing speed and export quality:
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-800 mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Use Case</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium">Recommended Format</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium">Recommended FPS</th>
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Why This Setting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Machine Learning / AI datasets</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">JPG</td>
                <td className="px-5 py-3 text-center">1 to 5 FPS</td>
                <td className="px-5 py-3 text-gray-400">Keeps dataset size manageable while providing sufficient visual variations for model training.</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">High-end VFX Compositing</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG</td>
                <td className="px-5 py-3 text-center">All Frames</td>
                <td className="px-5 py-3 text-gray-400">Preserves raw pixel colors and lossless visual quality required for chroma-keying and tracking.</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">YouTube Thumbnails</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">JPG</td>
                <td className="px-5 py-3 text-center">Custom / Single frame</td>
                <td className="px-5 py-3 text-gray-400">Smaller file size ready to upload directly to Google console without hitting size limits.</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Web / Social Media Previews</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">JPG</td>
                <td className="px-5 py-3 text-center">1 FPS</td>
                <td className="px-5 py-3 text-gray-400">Fast downloads and extremely light weight zip packages for rapid reviews.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── CODEC & FORMAT LIMITATIONS GUIDE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Codec Support & Browser Compatibility Guide
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          Because this converter runs entirely in your local browser, it uses your operating system and web browser's native codecs. Here is how different encoders behave:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">H.264 / AVC (Standard MP4)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">
              Universal support. Works perfectly on Chrome, Safari, Firefox, and Edge across Windows, macOS, Android, and iOS.
            </p>
            <span className="inline-block bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-semibold">
              Highly Recommended
            </span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">HEVC / H.265 (iPhone/Action Cams)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">
              Supported natively on Apple devices (Safari macOS/iOS) and Windows browsers if hardware acceleration/HEVC extensions are configured.
            </p>
            <span className="inline-block bg-yellow-950 border border-yellow-800 text-yellow-500 text-xs px-2.5 py-1 rounded-full font-semibold">
              Compatibility Varies
            </span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">ProRes / DNxHD (Professional)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">
              Not natively decodable by standard web browsers. We recommend transcoding ProRes clips to H.264 using FFmpeg before processing.
            </p>
            <span className="inline-block bg-red-950 border border-red-800 text-red-500 text-xs px-2.5 py-1 rounded-full font-semibold">
              Pre-transcode Recommended
            </span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">AV1 / VP9 (Modern Web Videos)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">
              Excellent support in Chrome, Firefox, and Edge. Provides super fast decoding for modern web-optimized MP4/WebM files.
            </p>
            <span className="inline-block bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-semibold">
              Supported
            </span>
          </div>
        </div>
      </section>

      {/* ── COMPARATIVE GUIDE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How We Compare to Desktop Tools & Ezgif
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Feature / Limit</th>
                <th className="px-5 py-4 text-center font-bold text-cyan-400">Our Local Converter</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium">Ezgif / Cloud Tools</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium">FFmpeg (CLI)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">File Size Limits</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">No Server Limit</td>
                <td className="px-5 py-3 text-center text-gray-500">Max 100MB - 200MB</td>
                <td className="px-5 py-3 text-center text-gray-400">Unlimited</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Privacy & Security</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">100% Private (Local)</td>
                <td className="px-5 py-3 text-center text-gray-500">Uploads to cloud server</td>
                <td className="px-5 py-3 text-center text-gray-400">Offline / Secure</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Ease of Use</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">Simple UI (Drag-n-Drop)</td>
                <td className="px-5 py-3 text-center text-gray-500">Simple UI</td>
                <td className="px-5 py-3 text-center text-gray-400">Steep CLI Command curve</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Installation</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">None (Open website)</td>
                <td className="px-5 py-3 text-center text-gray-500">None</td>
                <td className="px-5 py-3 text-center text-gray-400">Requires download/compile</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── LIMITATIONS & MEMORY WARNING ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">
            ⚠️ Browser Processing & RAM Limits
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Because processing is client-side, extracting thousands of high-resolution JPG images requires substantial device RAM. If you are converting a long video (e.g. 5+ minutes) at a high frame rate (e.g. 30 FPS), your browser tab may run out of memory and crash. To prevent this, process your videos in shorter chunks or lower the extraction FPS (e.g. 5 FPS).
          </p>
        </div>
      </section>

      {/* ── BEST USE CASES ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          Best Use Cases for MP4 to JPG Sequences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Thumbnails & Previews</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Quickly extract single frames to select the most engaging cover image for YouTube, TikTok, or web videos.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">AI Dataset Collection</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Extract frames at regular intervals (e.g., 2 FPS) to build high-quality visual training data for computer vision models.</p>
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
            <h3 className="text-white font-semibold mb-2">Tab Crashed / Out of Memory</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              If your browser runs out of memory, it may force-close the tab. Fix this by closing other application tabs or decreasing the FPS setting (e.g. use 10 FPS instead of 30 FPS) to reduce the number of generated images.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Unsupported Video Format Message</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              If your video contains a codec that the browser cannot decode natively, the converter falls back to legacy canvas rendering. For best results, use standard H.264-encoded MP4 files.
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

export default Mp4ToJpg;
