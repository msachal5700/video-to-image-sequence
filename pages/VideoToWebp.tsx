import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I convert a video to WebP frames?',
    a: 'Upload your video above, select "WebP" as the output format, choose your FPS settings, and click Extract. Your extracted frames will be saved as WebP images and can be downloaded as a ZIP.'
  },
  {
    q: 'Why choose WebP over JPG or PNG?',
    a: 'WebP offers superior compression — typically 25-35% smaller than JPG at equivalent quality, and supports transparency like PNG. It\'s the modern standard for web images with broad browser support.'
  },
  {
    q: 'Does WebP support transparency (alpha channel)?',
    a: 'Yes! WebP supports lossless transparency, making it ideal for compositing work, game development, and UI elements extracted from video.'
  },
  {
    q: 'Can I extract WebP frames from any video format?',
    a: 'Yes. The tool supports MP4, MOV, and WEBM as input formats. Your video is decoded in the browser and re-encoded as WebP frames.'
  },
  {
    q: 'Is there a file size limit for video to WebP conversion?',
    a: 'No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support.'
  },
  {
    q: 'What quality settings are available for WebP output?',
    a: 'WebP frames are exported at high quality (92%) by default, balancing file size and visual fidelity. This is optimized for web delivery and further optimization pipelines.'
  }
];

const VideoToWebp: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('video-to-webp-schemas');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-to-webp-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Video to WebP Converter — Extract WebP Frames Free",
      "url": "https://www.videotoimagesequence.online/video-to-webp",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Convert video to WebP frames online for free. Extract high-quality WebP image sequences from MP4, MOV, and WEBM videos in your browser. Supports transparency, smaller file sizes than JPG/PNG. No server upload required.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video Converter",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5, WebAssembly and Javascript support",
      "featureList": [
        "Extract WebP frames with transparency support",
        "Smaller file sizes than JPG/PNG at equivalent quality",
        "Custom FPS control (1, 5, 10, 12, 15, 24, 25, 30, 60 FPS)",
        "Process videos entirely in your browser (100% private)",
        "Batch processing of multiple video files",
        "ZIP download of extracted WebP frames",
        "Supports MP4, MOV, and WEBM input"
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
      "name": "How to Convert Video to WebP Frames",
      "description": "Step-by-step instructions for extracting WebP frames from video files locally inside your web browser.",
      "totalTime": "PT1M",
      "step": [
        { "@type": "HowToStep", "name": "Load Your Video File", "text": "Drag and drop your MP4, MOV, or WEBM video file into the browser-based upload zone." },
        { "@type": "HowToStep", "name": "Select WebP Output Format", "text": "Choose WebP from the format selector for modern, efficient image output with transparency support." },
        { "@type": "HowToStep", "name": "Configure Frame Rate", "text": "Choose your desired FPS (Frames Per Second) setting for the extraction." },
        { "@type": "HowToStep", "name": "Extract WebP Frames", "text": "Click Extract Frames Now and watch the local decoding progress." },
        { "@type": "HowToStep", "name": "Download WebP Sequence", "text": "Download individual WebP frames or get all frames as a single ZIP file." }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => { const el = document.getElementById('video-to-webp-schemas'); if (el) el.remove(); };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('videoToWebp.title')}
        description={t('videoToWebp.description')}
        canonical="https://www.videotoimagesequence.online/video-to-webp"
        ogTitle={t('videoToWebp.title')}
        ogDescription={t('videoToWebp.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoToWebp.keywords')}
      />

      <Breadcrumb items={[{ label: 'Video to WebP', path: '/video-to-webp' }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoToWebp.h1')}<br />
          <span className="text-cyan-400">{t('videoToWebp.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoToWebp.hero')}
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['🔒 100% Private', '⚡ Local Processing', '📦 ZIP Download', '🌐 WebP Format', '🎨 Transparency Support', '🆓 Free Forever'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">{badge}</span>
          ))}
        </div>
      </section>

      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToImages />
      </div>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Why WebP for Video Frames?</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 leading-relaxed">
            WebP is the modern image format designed for the web. When extracting frames from video, WebP offers significant advantages:
          </p>
          <ul className="space-y-3 text-gray-300 list-disc pl-6">
            <li><strong className="text-white">25-35% smaller than JPG</strong> at equivalent visual quality — faster downloads, less storage.</li>
            <li><strong className="text-white">Supports transparency</strong> like PNG — perfect for compositing, game assets, UI elements.</li>
            <li><strong className="text-white">Lossless and lossy modes</strong> — choose quality vs size per project needs.</li>
            <li><strong className="text-white">Broad browser support</strong> — works in all modern browsers (Chrome, Firefox, Safari, Edge).</li>
            <li><strong className="text-white">Ideal for web delivery</strong> — smaller payloads mean faster page loads and better Core Web Vitals.</li>
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">How to Convert Video to WebP Online</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload your video file', desc: 'Drag and drop or click to select your MP4, MOV, or WEBM video.' },
              { num: '2', title: 'Select WebP format', desc: 'Choose WebP from the output format options for modern, efficient frames.' },
              { num: '3', title: 'Configure frame rate (FPS)', desc: 'Select how many frames per second to extract using the FPS slider.' },
              { num: '4', title: 'Start the conversion', desc: 'Click "Extract Frames Now" to decode the video locally in your browser.' },
              { num: '5', title: 'Download your WebP frames', desc: 'Download individual frames or get all frames as a single ZIP file.' },
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
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Supported Video Formats</h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          Best supported: MP4, MOV, and WEBM. Other formats such as AVI or MKV may work only when your browser supports the video codec.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['MP4', 'MOV', 'WEBM'].map(format => (
            <div key={format} className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
              <p className="text-cyan-400 font-bold text-lg">{format}</p>
              <p className="text-gray-500 text-xs mt-1">Best Supported</p>
            </div>
          ))}
          {['AVI', 'MKV'].map(format => (
            <div key={format} className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center opacity-60">
              <p className="text-gray-400 font-bold text-lg">{format}</p>
              <p className="text-gray-500 text-xs mt-1">Codec Dependent</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">⚠️ Browser Processing Notice</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support. Heavy 4K files or high FPS extraction sequences can exceed browser memory bounds. If the tab freezes, close background tabs and run extraction with a lower FPS.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">More Free Online Frame Extractors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/mp4-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">MP4 to JPG</h3>
            <p className="text-gray-500 text-xs">Convert MP4 videos into high-quality JPGs.</p>
          </Link>
          <Link to="/video-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to PNG</h3>
            <p className="text-gray-500 text-xs">Extract lossless transparent PNG frames.</p>
          </Link>
          <Link to="/extract-frames-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Frame Extractor</h3>
            <p className="text-gray-500 text-xs">Supports MP4, MOV, WEBM and more.</p>
          </Link>
          <Link to="/screenshot-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Screenshot from Video</h3>
            <p className="text-gray-500 text-xs">Grab exact full-resolution frames.</p>
          </Link>
          <Link to="/video-to-gif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to GIF</h3>
            <p className="text-gray-500 text-xs">Turn video clips into animated GIFs free.</p>
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

export default VideoToWebp;