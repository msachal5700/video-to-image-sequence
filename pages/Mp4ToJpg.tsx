import React from 'react';
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
  // Construct Application & FAQ JSON-LD schemas
  const schemas = [
    {
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
    },
    {
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
    }
  ];

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
      
      {/* Schemas */}
      <script type="application/ld+json">
        {JSON.stringify(schemas)}
      </script>

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

      {/* ── SUPPORTED FORMATS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Supported Video Formats
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          While this page is optimized for MP4 files, our processing worker supports the standard containers decoded by modern browsers:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">MP4 (.mp4)</h3>
            <p className="text-gray-500 text-xs leading-relaxed">The best format for frame extraction. Highly optimized browser decoding ensures fast performance.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">WEBM (.webm)</h3>
            <p className="text-gray-500 text-xs leading-relaxed">Fully supported container commonly used for screen recordings and web assets.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">MOV (.mov)</h3>
            <p className="text-gray-500 text-xs leading-relaxed">Supported video file type from Apple devices. Great for design and editing footage.</p>
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
            No server upload limit. Processing happens in your browser, so very large files may depend on your device memory, browser performance, and video length. Extracting high FPS (e.g., 60 FPS) from a long 4K video consumes significant RAM. If the browser tab crashes, try selecting a lower FPS or converting shorter video segments.
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
