import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I convert a WebM video to JPG images for free?',
    a: 'Drag and drop your WebM file into the tool, select "JPG" format, choose FPS, and click Extract. Frames are processed locally in your browser as high-quality JPG, downloaded as ZIP. No server upload.'
  },
  {
    q: 'Does this work with VP8, VP9, and AV1 WebM files?',
    a: 'Yes. WebM with VP8, VP9, and AV1 codecs are natively supported in Chrome, Firefox, Edge, and Safari (AV1 support varies). The tool uses browser-native decoding for all three.'
  },
  {
    q: 'Can I extract JPG from WebM screen recordings?',
    a: 'Absolutely. WebM is the standard format for screen recordings (Chrome, OBS, Loom). Extract frames at 1 FPS for slide capture or 30 FPS for smooth motion review.'
  },
  {
    q: 'Is there a file size limit for WebM to JPG conversion?',
    a: 'No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support.'
  },
  {
    q: 'Can I convert WebM to PNG or WebP instead?',
    a: 'Yes. Use the format selector: PNG for lossless quality, WebP for modern format with transparency and 25–35% smaller than JPG.'
  },
  {
    q: 'What FPS for WebM screen recordings?',
    a: 'Slide/lecture capture: 1 FPS. Software demos: 5–10 FPS. Smooth motion: 30 FPS. High-speed UI analysis: 60 FPS. Adjust via the FPS slider.'
  }
];

const WebmToJpg: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('webm-to-jpg-schemas');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'webm-to-jpg-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "WebM to JPG Converter — Extract JPG Frames from WebM Free",
      "url": "https://www.videotoimagesequence.online/webm-to-jpg",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Convert WebM to JPG frames online for free. Extract JPG image sequences from WebM videos (VP8, VP9, AV1) in your browser. Perfect for screen recordings. No server upload, custom FPS, ZIP download.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video Converter",
      "operatingSystem": "All — Browser-based",
      "browserRequirements": "Requires HTML5 and Javascript support",
      "featureList": [
        "Extract JPG frames from WebM (VP8, VP9, AV1)",
        "Custom FPS control (1–60 FPS)",
        "Process WebM entirely in your browser (100% private)",
        "Batch processing of multiple WebM files",
        "ZIP download of extracted JPG frames",
        "Ideal for screen recordings and web captures"
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
      "name": "How to Convert WebM to JPG Frames",
      "description": "Step-by-step guide to extracting JPG frames from WebM video locally in your browser.",
      "totalTime": "PT1M",
      "step": [
        { "@type": "HowToStep", "name": "Load Your WebM", "text": "Drag and drop your WebM file into the upload zone." },
        { "@type": "HowToStep", "name": "Select JPG Format", "text": "Choose JPG from the output format options." },
        { "@type": "HowToStep", "name": "Configure Frame Rate", "text": "Set your desired FPS (1–60) or select every frame." },
        { "@type": "HowToStep", "name": "Extract JPG Sequence", "text": "Click Extract Frames Now to decode locally." },
        { "@type": "HowToStep", "name": "Download JPG Frames", "text": "Download individual frames or get all as a ZIP archive." }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => { const el = document.getElementById('webm-to-jpg-schemas'); if (el) el.remove(); };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="WebM to JPG Converter — Extract JPG Frames from WebM Free"
        description="Convert WebM to JPG images online for free. Extract JPG frames from WebM videos (VP8, VP9, AV1) in your browser. Perfect for screen recordings. No server upload, custom FPS, ZIP download."
        canonical="https://www.videotoimagesequence.online/webm-to-jpg"
        ogTitle="WebM to JPG Converter — Extract JPG Frames from WebM Free"
        ogDescription="Convert WebM to JPG frames online for free. Extract JPG image sequences from WebM videos in your browser. No server upload, custom FPS, ZIP download."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords="webm to jpg, webm to jpeg converter, extract jpg from webm, webm frame extractor, screen recording to jpg"
      />

      <Breadcrumb items={[{ label: 'WebM to JPG', path: '/webm-to-jpg' }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          WebM to JPG Converter<br />
          <span className="text-cyan-400">Extract JPG Frames from WebM Free</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Convert WebM video to JPG images online for free. Supports VP8, VP9, AV1 codecs. Perfect for screen recordings, browser captures, web videos. 100% private — no server upload.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['🔒 100% Private', '🎬 VP8/VP9/AV1 Support', '📦 ZIP Download', '🎯 Custom FPS 1–60', '🆓 Free Forever'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">{badge}</span>
          ))}
        </div>
      </section>

      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToImages />
      </div>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">WebM Codec Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">VP8 (Legacy WebM)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Universal support. Works on all browsers including older versions.</p>
            <span className="inline-block bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-semibold">Fully Supported</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">VP9 (Modern WebM)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Excellent support in Chrome, Firefox, Edge, Safari 14+. Hardware decode on most devices.</p>
            <span className="inline-block bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-semibold">Fully Supported</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">AV1 (Next-Gen WebM)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Best compression efficiency. Chrome, Firefox, Edge support. Safari 16.4+ partial support.</p>
            <span className="inline-block bg-yellow-950 border border-yellow-800 text-yellow-500 text-xs px-2.5 py-1 rounded-full font-semibold">Varies by Browser</span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">How to Convert WebM to JPG Online</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload your WebM file', desc: 'Drag and drop or click to select your WebM video (screen recording, browser capture).' },
              { num: '2', title: 'Select JPG format', desc: 'Choose JPG for smallest file sizes and universal compatibility.' },
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
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">WebM → JPG vs WebM → PNG vs WebM → WebP</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Factor</th>
                <th className="px-5 py-4 text-center font-bold text-cyan-400">JPG (This Page)</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium"><Link to="/webm-to-png" className="hover:text-cyan-400">PNG</Link></th>
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
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">✅ Alpha (if source has it)</td>
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
                <td className="px-5 py-3 text-center text-gray-400">Screen Recordings, Thumbnails, Quick Review</td>
                <td className="px-5 py-3 text-center text-gray-400">VFX, Archival, ML</td>
                <td className="px-5 py-3 text-center text-gray-400">Web Delivery, Modern Pipelines</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">⚡ Ideal for Screen Recordings</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            WebM is the native format for Chrome tab recording, OBS, Loom, and many screen capture tools. Extract frames at 1 FPS for slide decks, 5–10 FPS for software demos, or 30 FPS for smooth motion analysis.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">⚠️ Browser Processing Notice</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No server upload — processing uses your device RAM. For long screen recordings at high FPS, lower FPS or process in chunks to avoid memory issues.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Related Frame Extractors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/webm-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">WebM to PNG</h3>
            <p className="text-gray-500 text-xs">Lossless PNG with transparency from WebM.</p>
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
            <p className="text-gray-500 text-xs">Capture one precise frame from WebM.</p>
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

export default WebmToJpg;