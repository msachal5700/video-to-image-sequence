import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I convert an MP4 video to PNG images for free?',
    a: 'Drag and drop your MP4 file into the tool above, select "PNG" as the output format, choose your FPS setting, and click Extract Frames Now. All frames are extracted locally in your browser as lossless PNG images with transparency support, then downloaded as a ZIP.'
  },
  {
    q: 'Why choose PNG over JPG for MP4 frame extraction?',
    a: 'PNG is lossless and preserves the alpha channel (transparency). This is essential for VFX compositing, game development sprite sheets, and ML datasets where pixel-perfect accuracy matters. JPG introduces compression artifacts; PNG does not.'
  },
  {
    q: 'Does PNG output support transparency from video?',
    a: 'Yes. If your source video has an alpha channel (e.g., WebM with VP8/VP9 alpha, or ProRes 4444 in MOV), the extracted PNG frames will preserve transparency. Standard H.264 MP4 does not carry alpha, so frames will be opaque.'
  },
  {
    q: 'Is there a file size limit for MP4 to PNG conversion?',
    a: 'No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support. PNG files are larger than JPG — expect 3–5× the ZIP size.'
  },
  {
    q: 'Can I convert MP4 to WebP instead of PNG?',
    a: 'Yes. Use the format selector to choose WebP — it offers lossless compression with transparency, typically 25–35% smaller than PNG. Best for web delivery and modern pipelines.'
  },
  {
    q: 'What FPS should I use for VFX/ML datasets with PNG?',
    a: 'For VFX compositing, extract all frames (native FPS) to preserve motion fidelity. For ML datasets, 1–5 FPS keeps dataset size manageable while providing sufficient variation. Use the FPS slider to dial in your exact rate.'
  }
];

const Mp4ToPng: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('mp4-to-png-schemas');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'mp4-to-png-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "MP4 to PNG Converter — Extract Lossless PNG Frames Free",
      "url": "https://www.videotoimagesequence.online/mp4-to-png",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Convert MP4 to PNG frames online for free. Extract lossless, transparent PNG image sequences from MP4 videos in your browser. No server upload, custom FPS, ZIP download. Perfect for VFX, game dev, and ML datasets.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video Converter",
      "operatingSystem": "All — Browser-based",
      "browserRequirements": "Requires HTML5 and Javascript support",
      "featureList": [
        "Lossless PNG extraction with alpha channel support",
        "Custom FPS control (1, 5, 10, 12, 15, 24, 25, 30, 60 FPS)",
        "Process MP4 videos entirely in your browser (100% private)",
        "Batch processing of multiple MP4 files",
        "ZIP download of extracted PNG frames",
        "Supports H.264, H.265, AV1 MP4 codecs"
      ],
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": { "@type": "Answer", "text": faq.a }
      }))
    };

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert MP4 to PNG Frames",
      "description": "Step-by-step guide to extracting lossless PNG frames from MP4 video locally in your browser.",
      "totalTime": "PT1M",
      "step": [
        { "@type": "HowToStep", "name": "Load Your MP4", "text": "Drag and drop your MP4 file into the upload zone." },
        { "@type": "HowToStep", "name": "Select PNG Format", "text": "Choose PNG from the output format options for lossless quality." },
        { "@type": "HowToStep", "name": "Configure Frame Rate", "text": "Set your desired FPS (1–60) or select every frame." },
        { "@type": "HowToStep", "name": "Extract PNG Sequence", "text": "Click Extract Frames Now to decode locally in your browser." },
        { "@type": "HowToStep", "name": "Download PNG Frames", "text": "Download individual frames or get all as a ZIP archive." }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => { const el = document.getElementById('mp4-to-png-schemas'); if (el) el.remove(); };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="MP4 to PNG Converter — Extract Lossless PNG Frames Free"
        description="Convert MP4 to PNG frames online for free. Extract lossless, transparent PNG image sequences from MP4 videos in your browser. No server upload, custom FPS, ZIP download. Perfect for VFX, game dev, and ML datasets."
        canonical="https://www.videotoimagesequence.online/mp4-to-png"
        ogTitle="MP4 to PNG Converter — Extract Lossless PNG Frames Free"
        ogDescription="Convert MP4 to PNG frames online for free. Extract lossless, transparent PNG image sequences from MP4 videos in your browser. No server upload."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords="mp4 to png, mp4 to png converter, extract png frames from mp4, lossless frame extractor, video to png sequence"
      />

      <Breadcrumb items={[{ label: 'MP4 to PNG', path: '/mp4-to-png' }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          MP4 to PNG Converter<br />
          <span className="text-cyan-400">Extract Lossless PNG Frames Free</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Convert MP4 video to lossless PNG images online for free. Extract every frame with transparency support, custom FPS control, and ZIP download. 100% private — no server upload.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['🔒 100% Private', '🎨 Lossless PNG', '🌈 Alpha Channel', '📦 ZIP Download', '🎯 Custom FPS 1–60', '🆓 Free Forever'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">{badge}</span>
          ))}
        </div>
      </section>

      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToImages />
      </div>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Why PNG for MP4 Frame Extraction?</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 leading-relaxed">
            PNG is the professional choice when quality and transparency matter:
          </p>
          <ul className="space-y-3 text-gray-300 list-disc pl-6">
            <li><strong className="text-white">Lossless compression</strong> — zero generation loss, pixel-perfect frames for VFX plates and ML ground truth.</li>
            <li><strong className="text-white">Alpha channel support</strong> — preserves transparency from WebM/ProRes sources; critical for compositing and game sprites.</li>
            <li><strong className="text-white">Universal pipeline compatibility</strong> — Blender, Nuke, After Effects, DaVinci, Unity, Godot, Unreal all ingest PNG sequences natively.</li>
            <li><strong className="text-white">WebP alternative</strong> — Need smaller files with transparency? <Link to="/video-to-webp" className="text-cyan-400 hover:underline">Switch to WebP</Link> for 25–35% size reduction.</li>
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">How to Convert MP4 to PNG Online</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload your MP4 file', desc: 'Drag and drop or click to select your MP4 video.' },
              { num: '2', title: 'Select PNG format', desc: 'Choose PNG from the output format options for lossless quality with transparency.' },
              { num: '3', title: 'Configure frame rate (FPS)', desc: 'Select how many frames per second to extract (1–60 FPS or every frame).' },
              { num: '4', title: 'Start the conversion', desc: 'Click "Extract Frames Now" to decode the video locally in your browser.' },
              { num: '5', title: 'Download your PNG frames', desc: 'Download individual frames or get all frames as a single ZIP file.' },
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

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Recommended Settings by Use Case</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-800 mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Use Case</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium">Format</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium">Recommended FPS</th>
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">VFX Compositing (Nuke, After Effects)</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG</td>
                <td className="px-5 py-3 text-center">All frames (native FPS)</td>
                <td className="px-5 py-3 text-gray-400">Preserves every pixel for keying, tracking, roto</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Blender Image Sequences</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG</td>
                <td className="px-5 py-3 text-center">Match source FPS</td>
                <td className="px-5 py-3 text-gray-400">Blender expects sequential PNG naming</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Game Dev Sprites/Atlases</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG / WebP</td>
                <td className="px-5 py-3 text-center">Every frame</td>
                <td className="px-5 py-3 text-gray-400">Transparency for UI, characters, particles</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">ML/CV Training Data</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG</td>
                <td className="px-5 py-3 text-center">1–5 FPS</td>
                <td className="px-5 py-3 text-gray-400">Lossless labels; manageable dataset size</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Web Delivery / Social</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">WebP</td>
                <td className="px-5 py-3 text-center">1–10 FPS</td>
                <td className="px-5 py-3 text-gray-400"><Link to="/video-to-webp" className="text-cyan-400 hover:underline">WebP</Link> smaller, transparency support</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Codec Support for MP4 → PNG</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">H.264 / AVC (Standard MP4)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Universal support. Works perfectly on all browsers and platforms.</p>
            <span className="inline-block bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-semibold">Highly Recommended</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">HEVC / H.265 (iPhone, Action Cams)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Native on Apple Safari; Windows needs HEVC extensions. Transcode to H.264 if issues.</p>
            <span className="inline-block bg-yellow-950 border border-yellow-800 text-yellow-500 text-xs px-2.5 py-1 rounded-full font-semibold">Compatibility Varies</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">ProRes / DNxHD (Professional)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Not browser-decodable. Use FFmpeg/HandBrake to transcode to H.264 first.</p>
            <span className="inline-block bg-red-950 border border-red-800 text-red-500 text-xs px-2.5 py-1 rounded-full font-semibold">Pre-transcode Required</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">AV1 (Modern Web)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Excellent in Chrome, Firefox, Edge. Fast hardware decoding on modern GPUs.</p>
            <span className="inline-block bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-semibold">Supported</span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">MP4 → PNG vs MP4 → JPG vs MP4 → WebP</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Factor</th>
                <th className="px-5 py-4 text-center font-bold text-cyan-400">PNG (This Page)</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium"><Link to="/mp4-to-jpg" className="hover:text-cyan-400">JPG</Link></th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium"><Link to="/video-to-webp" className="hover:text-cyan-400">WebP</Link></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Quality</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">Lossless</td>
                <td className="px-5 py-3 text-center text-gray-500">Lossy (92% quality)</td>
                <td className="px-5 py-3 text-center text-gray-400">Lossless option</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Transparency</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">✅ Full alpha</td>
                <td className="px-5 py-3 text-center text-gray-500">❌ None</td>
                <td className="px-5 py-3 text-center text-gray-400">✅ Full alpha</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">File Size</td>
                <td className="px-5 py-3 text-center text-gray-400">Largest</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">Smallest</td>
                <td className="px-5 py-3 text-center text-gray-400">25\u201335% smaller than JPG</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Best For</td>
                <td className="px-5 py-3 text-center text-gray-400">VFX, Game Dev, ML</td>
                <td className="px-5 py-3 text-center text-gray-400">Thumbnails, Social</td>
                <td className="px-5 py-3 text-center text-gray-400">Web, Modern Pipelines</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">⚠️ Browser RAM Notice for PNG</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            PNG files are 3–5× larger than JPG. Extracting thousands of PNG frames at high FPS can exceed browser memory. For long videos, use lower FPS (1–5) or process in chunks. Close other tabs to free RAM.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Related Frame Extractors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/mp4-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">MP4 to JPG</h3>
            <p className="text-gray-500 text-xs">Smallest files, universal compatibility.</p>
          </Link>
          <Link to="/video-to-webp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to WebP</h3>
            <p className="text-gray-500 text-xs">25–35% smaller than JPG, supports transparency.</p>
          </Link>
          <Link to="/video-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to PNG (All Formats)</h3>
            <p className="text-gray-500 text-xs">MOV, WEBM, AVI, MKV → PNG.</p>
          </Link>
          <Link to="/extract-frame-at-timestamp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Exact Timestamp</h3>
            <p className="text-gray-500 text-xs">Capture one precise PNG frame.</p>
          </Link>
        </div>
      </section>

      <section id="faq" className="max-w-3xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-display">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="border border-gray-800 bg-gray-900/50 rounded-2xl p-5 cursor-pointer group hover:border-cyan-800 transition-colors">
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

export default Mp4ToPng;