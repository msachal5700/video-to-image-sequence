import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I convert a MOV video to JPG images for free?',
    a: 'Drag and drop your MOV file into the tool above, select "JPG" as the output format, choose your FPS setting, and click Extract. All frames are processed locally in your browser and downloaded as a ZIP. No server upload, no account needed.'
  },
  {
    q: 'Does this work with iPhone MOV files (HEVC/H.265)?',
    a: 'Yes, on Safari (macOS/iOS) and browsers with HEVC support. If your browser cannot decode HEVC, transcode to H.264 MP4 first using HandBrake (free) for universal compatibility.'
  },
  {
    q: 'What about ProRes MOV files from professional cameras?',
    a: 'ProRes is not natively decodable in web browsers. We recommend transcoding ProRes MOV to H.264 MP4 using FFmpeg or HandBrake before extraction. The tool will prompt if the codec is unsupported.'
  },
  {
    q: 'Is there a file size limit for MOV to JPG conversion?',
    a: 'No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support.'
  },
  {
    q: 'Can I convert MOV to PNG or WebP instead?',
    a: 'Yes. Use the format selector to choose PNG (lossless, transparency) or WebP (modern, 25–35% smaller than JPG with transparency).'
  },
  {
    q: 'What FPS should I use for MOV to JPG?',
    a: 'Same as MP4: 1 FPS for slide capture, 5–10 FPS for motion sampling, 24–30 FPS for smooth sequences, 60 FPS for high-speed analysis. Use the FPS slider to dial in your exact rate.'
  }
];

const MovToJpg: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('mov-to-jpg-schemas');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'mov-to-jpg-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "MOV to JPG Converter — Extract JPG Frames from MOV Free",
      "url": "https://www.videotoimagesequence.online/mov-to-jpg",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Convert MOV to JPG frames online for free. Extract JPG image sequences from MOV videos (iPhone, ProRes, H.264, HEVC) in your browser. No server upload, custom FPS, ZIP download.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video Converter",
      "operatingSystem": "All — Browser-based",
      "browserRequirements": "Requires HTML5 and Javascript support",
      "featureList": [
        "Extract JPG frames from MOV (H.264, HEVC, ProRes*)",
        "Custom FPS control (1–60 FPS)",
        "Process MOV entirely in your browser (100% private)",
        "Batch processing of multiple MOV files",
        "ZIP download of extracted JPG frames",
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
      "name": "How to Convert MOV to JPG Frames",
      "description": "Step-by-step guide to extracting JPG frames from MOV video locally in your browser.",
      "totalTime": "PT1M",
      "step": [
        { "@type": "HowToStep", "name": "Load Your MOV", "text": "Drag and drop your MOV file into the upload zone." },
        { "@type": "HowToStep", "name": "Select JPG Format", "text": "Choose JPG from the output format options." },
        { "@type": "HowToStep", "name": "Configure Frame Rate", "text": "Set your desired FPS (1–60) or select every frame." },
        { "@type": "HowToStep", "name": "Extract JPG Sequence", "text": "Click Extract Frames Now to decode locally." },
        { "@type": "HowToStep", "name": "Download JPG Frames", "text": "Download individual frames or get all as a ZIP archive." }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => { const el = document.getElementById('mov-to-jpg-schemas'); if (el) el.remove(); };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="MOV to JPG Converter — Extract JPG Frames from MOV Free"
        description="Convert MOV to JPG images online for free. Extract JPG frames from MOV videos (iPhone HEVC, ProRes, H.264) in your browser. No server upload, custom FPS, ZIP download."
        canonical="https://www.videotoimagesequence.online/mov-to-jpg"
        ogTitle="MOV to JPG Converter — Extract JPG Frames from MOV Free"
        ogDescription="Convert MOV to JPG frames online for free. Extract JPG image sequences from MOV videos in your browser. No server upload, custom FPS, ZIP download."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords="mov to jpg, mov to jpeg converter, extract jpg from mov, mov frame extractor, iphone mov to jpg"
      />

      <Breadcrumb items={[{ label: 'MOV to JPG', path: '/mov-to-jpg' }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          MOV to JPG Converter<br />
          <span className="text-cyan-400">Extract JPG Frames from MOV Free</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Convert MOV video to JPG images online for free. Supports iPhone HEVC, H.264, and ProRes (via transcode). Extract frames with custom FPS, ZIP download, 100% private — no server upload.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['🔒 100% Private', '📱 iPhone HEVC Support', '📦 ZIP Download', '🎯 Custom FPS 1–60', '🆓 Free Forever'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">{badge}</span>
          ))}
        </div>
      </section>

      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToImages />
      </div>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">MOV Codec Support & Compatibility</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">H.264 / AVC (Standard MOV)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Universal support. Works on all browsers and platforms without issues.</p>
            <span className="inline-block bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-semibold">Highly Recommended</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">HEVC / H.265 (iPhone, iPad, Modern Cameras)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Native on Safari (macOS/iOS). Chrome/Edge/Firefox need hardware HEVC support. Transcode to H.264 if decoding fails.</p>
            <span className="inline-block bg-yellow-950 border border-yellow-800 text-yellow-500 text-xs px-2.5 py-1 rounded-full font-semibold">Varies by Browser</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">ProRes 422 / 4444 (Professional)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Not browser-decodable. Transcode to H.264 MP4 using FFmpeg/HandBrake/Shutter Encoder before extraction.</p>
            <span className="inline-block bg-red-950 border border-red-800 text-red-500 text-xs px-2.5 py-1 rounded-full font-semibold">Pre-transcode Required</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">DNxHD / DNxHR (Avid)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Not browser-decodable. Transcode to H.264 first for best results.</p>
            <span className="inline-block bg-red-950 border border-red-800 text-red-500 text-xs px-2.5 py-1 rounded-full font-semibold">Pre-transcode Required</span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">How to Convert MOV to JPG Online</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload your MOV file', desc: 'Drag and drop or click to select your MOV video (iPhone, camera, screen recording).' },
              { num: '2', title: 'Select JPG format', desc: 'Choose JPG from the output format options for smallest file sizes.' },
              { num: '3', title: 'Configure frame rate (FPS)', desc: 'Select how many frames per second to extract (1–60 FPS or every frame).' },
              { num: '4', title: 'Start the conversion', desc: 'Click "Extract Frames Now" to decode the video locally in your browser.' },
              { num: '5', title: 'Download your JPG frames', desc: 'Download individual frames or get all frames as a single ZIP file.' },
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
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Quick Transcode Guide for Unsupported MOV</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 leading-relaxed">
            If your MOV uses ProRes, DNxHD, or HEVC without hardware decode, transcode first:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
              <h4 className="text-cyan-400 font-semibold mb-2">FFmpeg (CLI)</h4>
              <pre className="text-xs text-gray-300 bg-gray-900 p-3 rounded overflow-x-auto"><code>ffmpeg -i input.mov -c:v libx264 -crf 18 -preset fast output.mp4</code></pre>
            </div>
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
              <h4 className="text-cyan-400 font-semibold mb-2">HandBrake (GUI)</h4>
              <ol className="text-sm text-gray-400 list-decimal pl-5 space-y-1">
                <li>Open HandBrake → Load MOV</li>
                <li>Preset: "Fast 1080p30" or "HQ 1080p30"</li>
                <li>Video tab: H.264 (x264), RF 18–20</li>
                <li>Start Encode → Save as MP4</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">MOV → JPG vs MOV → PNG vs MOV → WebP</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Factor</th>
                <th className="px-5 py-4 text-center font-bold text-cyan-400"><Link to="/mov-to-jpg" className="hover:underline">JPG (This Page)</Link></th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium"><Link to="/mov-to-png" className="hover:text-cyan-400">PNG</Link></th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium"><Link to="/video-to-webp" className="hover:text-cyan-400">WebP</Link></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Quality</td>
                <td className="px-5 py-3 text-center text-gray-400">Lossy (92%)</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">Lossless</td>
                <td className="px-5 py-3 text-center text-gray-400">Lossless option</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Transparency</td>
                <td className="px-5 py-3 text-center text-gray-400">❌ None</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">✅ Alpha</td>
                <td className="px-5 py-3 text-center text-gray-400">✅ Alpha</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">File Size</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">Smallest</td>
                <td className="px-5 py-3 text-center text-gray-400">Largest</td>
                <td className="px-5 py-3 text-center text-gray-400">25\u201335% smaller than JPG</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Best For</td>
                <td className="px-5 py-3 text-center text-gray-400">Thumbnails, Social, Quick Review</td>
                <td className="px-5 py-3 text-center text-gray-400">VFX, Game Dev, ML</td>
                <td className="px-5 py-3 text-center text-gray-400">Web Delivery, Modern Pipelines</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">⚠️ Browser Processing Notice</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            MOV files (especially ProRes/HEVC) can be large. No server upload — processing uses your device RAM. If the tab crashes, transcode to H.264 MP4 first, lower FPS, or close other tabs.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Related Frame Extractors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/mov-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">MOV to PNG</h3>
            <p className="text-gray-500 text-xs">Lossless PNG with transparency from MOV.</p>
          </Link>
          <Link to="/mp4-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">MP4 to JPG</h3>
            <p className="text-gray-500 text-xs">Standard MP4 H.264 → JPG sequences.</p>
          </Link>
          <Link to="/video-to-webp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to WebP</h3>
            <p className="text-gray-500 text-xs">Modern format, smaller than JPG, with alpha.</p>
          </Link>
          <Link to="/extract-frame-at-timestamp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Exact Timestamp</h3>
            <p className="text-gray-500 text-xs">Capture one precise frame from MOV.</p>
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

export default MovToJpg;