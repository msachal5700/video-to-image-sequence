import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';

const faqs = [
  {
    q: 'How do I extract PNG frames from a video for free?',
    a: 'Load your video into the tool above, select PNG as the output format, choose your FPS frame rate, and click Extract. Your lossless PNG frames will decode locally in your browser and download as a ZIP file.'
  },
  {
    q: 'Why choose PNG over JPG for video frames?',
    a: 'PNG is a lossless format, preserving every pixel exactly as it was recorded. JPG is a lossy format that discards visual detail to save space, creating artifacts around edges. PNG is best for VFX editing, game design, and machine learning.'
  },
  {
    q: 'Do PNG frames support transparent backgrounds?',
    a: 'Yes. If your source video has transparent pixels (like MOV alpha channels), our tool retains that transparency data in the exported PNG frames.'
  },
  {
    q: 'Is there a file size limit for video to PNG conversion?',
    a: 'No server upload limit. Processing happens in your browser, so very large files may depend on your device memory, browser performance, and video length.'
  },
  {
    q: 'How large will the extracted PNG frames be?',
    a: 'PNG images are much larger than JPGs. A 1080p PNG frame is typically between 500KB and 2MB, meaning a sequence of hundreds of frames will generate a large ZIP file.'
  }
];

const VideoToPng: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-to-png-schemas';
    
    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Video to PNG Converter",
      "url": "https://www.videotoimagesequence.online/video-to-png",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Convert video to PNG images online for free. Extract lossless PNG frames from MP4, MOV, and WEBM videos in your browser.",
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
      const el = document.getElementById('video-to-png-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="Video to PNG Converter Online Free — Extract PNG Frames Locally"
        description="Convert video to PNG images online for free. Extract lossless PNG frames from MP4, MOV, and WEBM videos in your browser. No server upload required."
        canonical="https://www.videotoimagesequence.online/video-to-png"
        ogTitle="Video to PNG Converter — Free, Lossless, No Upload"
        ogDescription="Extract lossless PNG frames from MP4, MOV, and WEBM videos locally in your browser. Perfect for VFX, game dev, and ML datasets."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Tools' }, { label: 'Video to PNG', path: '/video-to-png' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          Video to PNG Converter<br />
          <span className="text-cyan-400">Extract Lossless PNG Frames Online — Free</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          Convert video to PNG images online for free. Extract pixel-perfect, lossless PNG sequences from MP4, MOV, or WEBM videos. Keep transparency info intact, all without files leaving your computer.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {[
            '🎨 Lossless Quality',
            '🔒 100% Private (Local)',
            '🌈 Preserves Alpha Channel',
            '📦 ZIP Download',
            '🆓 Free'
          ].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Main Tool Content */}
      <div className="animate-fade-in min-h-[400px] px-4 max-w-5xl mx-auto text-center">
        <div className="mb-4 inline-block bg-cyan-950/40 border border-cyan-800 text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium">
          💡 Tip: Select PNG in the format selector below for lossless output
        </div>
        <VideoToImages />
      </div>

      {/* ── BROWSER SECURITY & PRIVACY ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Client-Side Lossless Frame Processing
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Security matters, especially when dealing with proprietary visual designs, motion assets, or client presentations. Our Video to PNG Converter decodes and extracts frames entirely inside your local web browser. Your video is parsed locally and the images are saved in your browser environment. Your files are never transmitted across the network, keeping your sensitive or proprietary footage completely secure.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Extract Lossless PNG Frames from Video
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="list-decimal pl-6 space-y-4 text-gray-300 marker:text-cyan-500 marker:font-bold">
            <li>
              <strong className="text-white">Load Video File:</strong> Drag and drop your MP4, MOV, or WEBM video file into the tool above.
            </li>
            <li>
              <strong className="text-white">Choose PNG:</strong> Switch the Output Format selector to "PNG".
            </li>
            <li>
              <strong className="text-white">Set Extraction Freq (FPS):</strong> Choose the frames-per-second setting (e.g. 24 FPS to grab standard video frame-rate or 5 FPS for snapshots).
            </li>
            <li>
              <strong className="text-white">Run Extraction:</strong> Click "Extract Frames Now" to begin parsing frames in the browser background.
            </li>
            <li>
              <strong className="text-white">Download Sequences:</strong> Download individual frames or click "Download All (ZIP)" to save the entire ZIP folder of PNG images.
            </li>
          </ol>
        </div>
      </section>

      {/* ── JPG VS PNG COMPARISON ── */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-display">
          JPG vs PNG for Video Frame Sequences
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-5 py-4 text-left text-gray-400 font-medium whitespace-nowrap">Property</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium whitespace-nowrap">JPG</th>
                <th className="px-5 py-4 text-center font-bold text-cyan-400 whitespace-nowrap">PNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium whitespace-nowrap">Compression</td>
                <td className="px-5 py-3 text-center text-gray-400">Lossy (Compromises detail)</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-medium">Lossless (Preserves details)</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium whitespace-nowrap">File Size</td>
                <td className="px-5 py-3 text-center text-gray-400">Smaller (~50-200KB)</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-medium">Larger (~200KB-2MB)</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium whitespace-nowrap">Halos / Artifacts</td>
                <td className="px-5 py-3 text-center text-gray-400">Yes (visible compression blocks)</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-medium">None (pixel-perfect)</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium whitespace-nowrap">Transparency</td>
                <td className="px-5 py-3 text-center text-gray-400">Not supported</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-medium">Preserves transparent background</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── LIMITATIONS & MEMORY WARNING ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">
            ⚠️ Browser Processing Notice
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No server upload limit. Processing happens in your browser, so very large files may depend on your device memory, browser performance, and video length. Because PNG files utilize lossless encoding, they consume much more RAM than JPG files during rendering. If you experience performance issues, consider lowering the FPS setting or dividing large videos into smaller segments before converting.
          </p>
        </div>
      </section>

      {/* ── BEST USE CASES ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          When to Choose PNG Frame Extraction
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">VFX Compositing</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Essential for roto work, overlays, and color correction pipelines that demand zero compression noise.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Game Design</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Stitch animated video clips into transparent PNG spritesheets for direct importing into 2D game engines.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Machine Learning</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Provide pixel-accurate images to train high-level object detection and image segmentation neural networks.</p>
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
            <h3 className="text-white font-semibold mb-2">Slow Processing / Latency</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Writing lossless PNG data is computationally intensive. Close memory-heavy background applications, use Chrome or Edge for the fastest V8 WebAssembly decoding speeds, and reduce the output FPS setting.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Transparent Backgrounds are Black</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ensure that your video file contains a true alpha channel (e.g. video files encoded using QuickTime Animation or ProRes 4444). Standard video files from screen recorders usually merge transparency onto a solid color during compression.
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

export default VideoToPng;
