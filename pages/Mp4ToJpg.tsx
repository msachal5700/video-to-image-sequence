import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';

const faqs = [
  {
    q: 'How do I convert an MP4 video to JPG images for free?',
    a: 'Drop your MP4 file into our tool above, select JPG format, choose your FPS, and click Extract. All frames download as a ZIP. No account or upload needed.'
  },
  {
    q: 'Is there a file size limit for MP4 to JPG conversion?',
    a: 'No. Our tool processes everything locally in your browser so there is no upload and no file size limit. Convert 4K videos, hour-long recordings, or anything else.'
  },
  {
    q: 'How many JPG frames will I get from my MP4?',
    a: 'It depends on your video length and the FPS setting. A 60-second video at 30 FPS gives 1800 frames. At 1 FPS it gives 60 frames.'
  },
  {
    q: 'Can I convert MP4 to PNG instead of JPG?',
    a: 'Yes. Use the format selector in the tool to switch to PNG output for lossless quality frames.'
  },
  {
    q: 'Does MP4 to JPG conversion work on iPhone and Android?',
    a: 'Yes. The tool works in any modern mobile browser including Safari on iPhone and Chrome on Android.'
  }
];

const Mp4ToJpg: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to convert MP4 to JPG online",
        "description": "Convert MP4 video to JPG images online for free. Extract every frame as a high-quality JPG instantly in your browser.",
        "step": [
          { "@type": "HowToStep", "name": "Open the tool", "text": "Open videotoimagesequence.online/mp4-to-jpg" },
          { "@type": "HowToStep", "name": "Upload MP4", "text": "Drag and drop your MP4 file into the tool above" },
          { "@type": "HowToStep", "name": "Choose JPG format", "text": "Select JPG as output format and choose your FPS" },
          { "@type": "HowToStep", "name": "Extract frames", "text": "Click Extract Frames and wait for processing" },
          { "@type": "HowToStep", "name": "Download JPGs", "text": "Download all JPG frames as a ZIP archive" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", ".hero-description"]
        },
        "url": "https://videotoimagesequence.online/mp4-to-jpg"
      }
    ]);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="MP4 to JPG Converter Online Free — Extract JPG Frames from MP4"
        description="Convert MP4 video to JPG images online for free. Extract every frame as a high-quality JPG instantly in your browser. No upload, no file size limit, 100% private."
        canonical="https://videotoimagesequence.online/mp4-to-jpg"
        ogTitle="MP4 to JPG Converter — Free, No Upload, No Limits"
        ogDescription="Extract JPG frames from any MP4 video instantly in your browser. Free forever, no account needed."
        ogImage="https://videotoimagesequence.online/og-image.png"
        ogType="website"
      />
      
      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-16 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          MP4 to JPG Converter<br />
          <span className="text-cyan-400">Online Free — No Upload Required</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          Converting MP4 to JPG means extracting individual video frames as JPEG images — useful for thumbnails, ML datasets, animation, and content creation.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {[
            '✅ Free Forever',
            '🔒 No Upload',
            '⚡ Instant',
            '📦 ZIP Download',
            '🎨 Custom FPS'
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

      {/* What is MP4 to JPG conversion? */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 font-display">
          What is MP4 to JPG conversion?
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-4 text-gray-300">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-white">MP4</strong> is a video container format.</li>
            <li><strong className="text-white">JPG (JPEG)</strong> is the most common image format.</li>
            <li>Converting means extracting each video frame as a separate JPG file.</li>
            <li><strong className="text-white">Use cases:</strong> YouTube thumbnails, AI training data, animation frames, motion analysis.</li>
          </ul>
        </div>
      </section>

      {/* Why use our MP4 to JPG converter? */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-display">
          Why use our MP4 to JPG converter?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">No File Size Limit</h3>
            <p className="text-gray-400 text-sm">Process 4K videos, long recordings, full movies.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">No Upload Required</h3>
            <p className="text-gray-400 text-sm">Your MP4 never leaves your device, instant processing.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Bulk JPG Download</h3>
            <p className="text-gray-400 text-sm">All frames packed in a single ZIP file with one click.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Custom FPS Control</h3>
            <p className="text-gray-400 text-sm">Extract 1, 5, 10, 24, or 30 frames per second.</p>
          </div>
        </div>
      </section>

      {/* How to convert MP4 to JPG online */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-display">
          How to convert MP4 to JPG online
        </h2>
        <div className="max-w-2xl mx-auto space-y-4">
          <ol className="list-decimal pl-6 space-y-4 text-gray-300 marker:text-cyan-500 marker:font-bold">
            <li>Open videotoimagesequence.online/mp4-to-jpg</li>
            <li>Drag and drop your MP4 file into the tool above</li>
            <li>Select JPG as output format and choose your FPS</li>
            <li>Click Extract Frames and wait for processing</li>
            <li>Download all JPG frames as a ZIP archive</li>
          </ol>
        </div>
      </section>

      {/* MP4 to JPG FAQ */}
      <section id="faq" className="max-w-3xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-display">
          MP4 to JPG FAQ
        </h2>
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

export default Mp4ToJpg;
