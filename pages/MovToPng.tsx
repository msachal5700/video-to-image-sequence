import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I convert a MOV video to PNG images for free?',
    a: 'Drag and drop your MOV file, select "PNG" format, choose FPS, and click Extract. Frames are extracted locally as lossless PNG with transparency support, downloaded as ZIP. No server upload.'
  },
  {
    q: 'Does MOV to PNG preserve transparency from ProRes 4444?',
    a: 'Yes, if your browser can decode the source. ProRes 4444 MOV carries alpha, but browsers cannot decode ProRes natively. Transcode to a WebM VP9 with alpha or H.264 first, then extract PNG to preserve transparency.'
  },
  {
    q: 'Can I extract PNG frames from iPhone HEVC MOV files?',
    a: 'Yes, on Safari (macOS/iOS) and browsers with HEVC hardware decode. The extracted PNG frames will be opaque (HEVC doesn\'t carry alpha). For transparency, record in a format that supports it or use a different source.'
  },
  {
    q: 'Is there a file size limit for MOV to PNG conversion?',
    a: 'No server upload required. Processing happens in your browser. PNG files are 3–5× larger than JPG — expect larger ZIP downloads. Ensure sufficient RAM for long/high-FPS extractions.'
  },
  {
    q: 'Should I use PNG or WebP for MOV frame extraction?',
    a: 'PNG for maximum compatibility with VFX/game engines (Blender, Unity, Unreal, After Effects). WebP for web delivery — 25–35% smaller with transparency. Both are lossless.'
  },
  {
    q: 'What FPS for VFX/ML datasets from MOV?',
    a: 'VFX: all frames (native FPS) for motion fidelity. ML datasets: 1–5 FPS for manageable size. Use the FPS slider to set your exact rate.'
  }
];

const MovToPng: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('mov-to-png-schemas');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'mov-to-png-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "MOV to PNG Converter — Extract Lossless PNG Frames from MOV Free",
      "url": "https://www.videotoimagesequence.online/mov-to-png",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Convert MOV to PNG frames online for free. Extract lossless, transparent PNG image sequences from MOV videos (H.264, HEVC, ProRes*) in your browser. No server upload, custom FPS, ZIP download. Perfect for VFX, game dev, and ML datasets.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video Converter",
      "operatingSystem": "All — Browser-based",
      "browserRequirements": "Requires HTML5 and Javascript support",
      "featureList": [
        "Lossless PNG extraction with alpha channel support",
        "Custom FPS control (1–60 FPS)",
        "Process MOV entirely in your browser (100% private)",
        "Batch processing of multiple MOV files",
        "ZIP download of extracted PNG frames",
        "*ProRes requires pre-transcode to H.264"
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
      "name": "How to Convert MOV to PNG Frames",
      "description": "Step-by-step guide to extracting lossless PNG frames from MOV video locally in your browser.",
      "totalTime": "PT1M",
      "step": [
        { "@type": "HowToStep", "name": "Load Your MOV", "text": "Drag and drop your MOV file into the upload zone." },
        { "@type": "HowToStep", "name": "Select PNG Format", "text": "Choose PNG for lossless quality with transparency." },
        { "@type": "HowToStep", "name": "Configure Frame Rate", "text": "Set your desired FPS (1–60) or select every frame." },
        { "@type": "HowToStep", "name": "Extract PNG Sequence", "text": "Click Extract Frames Now to decode locally." },
        { "@type": "HowToStep", "name": "Download PNG Frames", "text": "Download individual frames or get all as a ZIP archive." }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => { const el = document.getElementById('mov-to-png-schemas'); if (el) el.remove(); };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="MOV to PNG Converter — Extract Lossless PNG Frames from MOV Free"
        description="Convert MOV to PNG frames online for free. Extract lossless, transparent PNG image sequences from MOV videos in your browser. No server upload, custom FPS, ZIP download. Perfect for VFX, game dev, and ML datasets."
        canonical="https://www.videotoimagesequence.online/mov-to-png"
        ogTitle="MOV to PNG Converter — Extract Lossless PNG Frames from MOV Free"
        ogDescription="Convert MOV to PNG frames online for free. Extract lossless, transparent PNG image sequences from MOV videos in your browser. No server upload."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords="mov to png, mov to png converter, extract png frames from mov, lossless frame extractor, video to png sequence"
      />

      <Breadcrumb items={[{ label: 'MOV to PNG', path: '/mov-to-png' }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          MOV to PNG Converter<br />
          <span className="text-cyan-400">Extract Lossless PNG Frames Free</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Convert MOV video to lossless PNG images online for free. Extract frames with transparency support, custom FPS, ZIP download. 100% private — no server upload.
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
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">MOV Codec Support for PNG Extraction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">H.264 / AVC (Standard MOV)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Universal support. Works perfectly on all browsers.</p>
            <span className="inline-block bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-semibold">Highly Recommended</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">HEVC / H.265 (iPhone MOV)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Native on Safari. Chrome/Edge/Firefox need hardware HEVC decode. Frames will be opaque (no alpha in HEVC).</p>
            <span className="inline-block bg-yellow-950 border border-yellow-800 text-yellow-500 text-xs px-2.5 py-1 rounded-full font-semibold">Varies by Browser</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">ProRes 4444 (With Alpha)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Carries alpha but not browser-decodable. Transcode to WebM VP9 with alpha or H.264 first, then extract PNG.</p>
            <span className="inline-block bg-red-950 border border-red-800 text-red-500 text-xs px-2.5 py-1 rounded-full font-semibold">Pre-transcode Required</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">DNxHD / DNxHR</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Not browser-decodable. Transcode to H.264 for extraction.</p>
            <span className="inline-block bg-red-950 border border-red-800 text-red-500 text-xs px-2.5 py-1 rounded-full font-semibold">Pre-transcode Required</span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">How to Convert MOV to PNG Online</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload your MOV file', desc: 'Drag and drop or click to select your MOV video.' },
              { num: '2', title: 'Select PNG format', desc: 'Choose PNG for lossless quality with transparency support.' },
              { num: '3', title: 'Configure frame rate (FPS)', desc: 'Select how many frames per second to extract (1–60 FPS or every frame).' },
              { num: '4', title: 'Start the conversion', desc: 'Click "Extract Frames Now" to decode the video locally.' },
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
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">MOV → PNG vs MOV → JPG vs MOV → WebP</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Factor</th>
                <th className="px-5 py-4 text-center font-bold text-cyan-400">PNG (This Page)</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium"><Link to="/mov-to-jpg" className="hover:text-cyan-400">JPG</Link></th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium"><Link to="/video-to-webp" className="hover:text-cyan-400">WebP</Link></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Quality</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">Lossless</td>
                <td className="px-5 py-3 text-center text-gray-500">Lossy (92%)</td>
                <td className="px-5 py-3 text-center text-gray-400">Lossless option</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Transparency</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">✅ Full alpha</td>
                <td className="px-5 py-3 text-center text-gray-500">❌ None</td>
                <td className="px-5 py-3 text-center text-gray-400">✅ Alpha</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">File Size</td>
                <td className="px-5 py-3 text-center text-gray-400">Largest</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">Smallest</td>
                <td className="px-5 py-3 text-center text-gray-400">25\u201335% smaller than JPG</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Best For</td>
                <td className="px-5 py-3 text-center text-gray-400">VFX, Game Dev, ML, Archival</td>
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
            PNG files are 3–5× larger than JPG. MOV files (especially ProRes) can be large. Use lower FPS (1–5), process in chunks, or close other tabs to free RAM.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Related Frame Extractors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/mov-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">MOV to JPG</h3>
            <p className="text-gray-500 text-xs">Smallest files, universal compatibility.</p>
          </Link>
          <Link to="/mp4-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">MP4 to PNG</h3>
            <p className="text-gray-500 text-xs">Standard MP4 H.264 → lossless PNG.</p>
          </Link>
          <Link to="/video-to-webp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to WebP</h3>
            <p className="text-gray-500 text-xs">Modern format, 25–35% smaller than JPG, with alpha.</p>
          </Link>
          <Link to="/extract-frame-at-timestamp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Exact Timestamp</h3>
            <p className="text-gray-500 text-xs">Capture one precise PNG frame from MOV.</p>
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

export default MovToPng;