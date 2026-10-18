import React from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import { localizedUrl } from '../utils/localizedRoutes';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageLang } from '../hooks/usePageLang';

const faqs = [
  {
    q: 'How do I convert a video to AVIF frames?',
    a: 'Upload your video above, select "AVIF" as the output format, choose your FPS settings, and click Extract. Your extracted frames will be saved as AVIF images and can be downloaded as a ZIP.'
  },
  {
    q: 'Why choose AVIF over WebP or JPG?',
    a: 'AVIF delivers the best compression of any mainstream image format — typically 30-50% smaller than WebP and up to 50% smaller than JPG at equivalent visual quality. It is based on the royalty-free AV1 video codec and is the most efficient choice for web delivery and archival.'
  },
  {
    q: 'Does AVIF support transparency and HDR?',
    a: 'Yes. AVIF supports lossless transparency (alpha channel) like PNG and WebP, plus HDR, wide color gamut, and 10-bit color depth — making it ideal for high-end compositing, game assets, and professional video frame extraction.'
  },
  {
    q: 'Which browsers support AVIF images?',
    a: 'AVIF is supported in Chrome 85+, Firefox 93+, Safari 16.4+, Edge 121+, and Opera 71+. If you need maximum compatibility with older browsers, WebP or JPG remain safe fallbacks.'
  },
  {
    q: 'Can I extract AVIF frames from any video format?',
    a: 'Yes. The tool supports MP4, MOV, and WEBM as input formats. Your video is decoded in the browser and re-encoded as AVIF frames — no upload required.'
  },
  {
    q: 'Is AVIF encoding slower than WebP?',
    a: 'AVIF encoding is more computationally intensive than WebP, so extraction may take slightly longer on large frame counts. The payoff is dramatically smaller files. For very long videos, consider a lower FPS setting.'
  }
];

const VideoToAvif: React.FC = () => {
  const { t } = useTranslation();
  const pageLang = usePageLang();


  const webAppSchema = {
    "@type": "WebApplication",
    "name": "Video to AVIF Converter — Extract AVIF Frames Free",
    "url": "https://www.videotoimagesequence.online/video-to-avif",
    "image": "https://www.videotoimagesequence.online/og-image.png",
    "description": "Convert video to AVIF frames online for free. Extract ultra-efficient AVIF image sequences from MP4, MOV, and WEBM videos in your browser. Up to 50% smaller than WebP. No server upload required.",
    "applicationCategory": "MultimediaApplication",
    "applicationSubCategory": "Video Converter",
    "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
    "browserRequirements": "Requires HTML5, WebAssembly and Javascript support",
    "featureList": [
      "Extract AVIF frames with transparency and HDR support",
      "Up to 50% smaller than WebP at equivalent quality",
      "Custom FPS control (1, 5, 10, 12, 15, 24, 25, 30, 60 FPS)",
      "Process videos entirely in your browser (100% private)",
      "Batch processing of multiple video files",
      "ZIP download of extracted AVIF frames",
      "Supports MP4, MOV, and WEBM input"
    ],
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  const faqSchema = {
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  };

  const howToSchema = {
    "@type": "HowTo",
    "name": "How to Convert Video to AVIF Frames",
    "description": "Step-by-step instructions for extracting AVIF frames from video files locally inside your web browser.",
    "totalTime": "PT1M",
    "step": [
      { "@type": "HowToStep", "name": "Load Your Video File", "text": "Drag and drop your MP4, MOV, or WEBM video file into the browser-based upload zone." },
      { "@type": "HowToStep", "name": "Select AVIF Output Format", "text": "Choose AVIF from the format selector for the most efficient modern image output." },
      { "@type": "HowToStep", "name": "Configure Frame Rate", "text": "Choose your desired FPS (Frames Per Second) setting for the extraction." },
      { "@type": "HowToStep", "name": "Extract AVIF Frames", "text": "Click Extract Frames Now and watch the local decoding progress." },
      { "@type": "HowToStep", "name": "Download AVIF Sequence", "text": "Download individual AVIF frames or get all frames as a single ZIP file." }
    ]
  };



  const organizationSchema = {
    "@type": "Organization",
    "name": "Video to Image Sequence Online",
    "url": "https://www.videotoimagesequence.online",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.videotoimagesequence.online/og-image.png"
    }
  };

  const pageSchemas = {
    "@context": "https://schema.org",
    "@graph": [webAppSchema, faqSchema, howToSchema, organizationSchema]
  };


  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <script type="application/ld+json">
        {JSON.stringify(pageSchemas)}
      </script>
      <SEOHead
        title={t('videoToAvif.title')}
        description={t('videoToAvif.description')}
        canonical={localizedUrl('/video-to-avif', pageLang)}
        ogTitle={t('videoToAvif.title')}
        ogDescription={t('videoToAvif.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoToAvif.keywords')}
      />

      <Breadcrumb items={[{ label: 'Video to AVIF', path: '/video-to-avif' }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoToAvif.h1')}<br />
          <span className="text-cyan-400">{t('videoToAvif.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoToAvif.hero')}
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['🔒 100% Private', '⚡ Local Processing', '📦 ZIP Download', '🖼️ AVIF Format', '🎨 HDR + Transparency', '🆓 Free Forever'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">{badge}</span>
          ))}
        </div>
      </section>

      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToImages />
      </div>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Why AVIF for Video Frames?</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 leading-relaxed">
            AVIF (AV1 Image File Format) is the most advanced image format available today. Built on the royalty-free AV1 video codec by the Alliance for Open Media, it represents the state of the art in image compression. When extracting frames from video, AVIF offers unmatched advantages:
          </p>
          <ul className="space-y-3 text-gray-300 list-disc pl-6">
            <li><strong className="text-white">30-50% smaller than WebP</strong> at equivalent visual quality — the most efficient mainstream format ever measured.</li>
            <li><strong className="text-white">Up to 50% smaller than JPG</strong> — dramatic savings on storage and bandwidth for large frame sequences.</li>
            <li><strong className="text-white">HDR and wide color gamut</strong> — 10-bit and 12-bit color depth preserve the full fidelity of your source video.</li>
            <li><strong className="text-white">Lossless transparency</strong> — alpha channel support for compositing, game assets, and VFX work.</li>
            <li><strong className="text-white">Royalty-free and open</strong> — no licensing concerns for commercial projects, unlike some proprietary codecs.</li>
            <li><strong className="text-white">Growing browser support</strong> — native in Chrome, Firefox, Safari, and Edge; ideal for future-proof web delivery.</li>
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">AVIF vs WebP vs JPG: Frame Extraction Compared</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 leading-relaxed">
            Choosing the right output format depends on your priorities. Here is how the three formats compare for video frame extraction:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 pr-4 text-gray-500 font-medium">Format</th>
                  <th className="py-3 pr-4 text-gray-500 font-medium">File Size</th>
                  <th className="py-3 pr-4 text-gray-500 font-medium">Transparency</th>
                  <th className="py-3 pr-4 text-gray-500 font-medium">HDR</th>
                  <th className="py-3 text-gray-500 font-medium">Browser Support</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800/50">
                  <td className="py-3 pr-4 font-semibold text-cyan-400">AVIF</td>
                  <td className="py-3 pr-4">Smallest</td>
                  <td className="py-3 pr-4">Yes</td>
                  <td className="py-3 pr-4">Yes</td>
                  <td className="py-3">Modern browsers</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-3 pr-4 font-semibold text-white">WebP</td>
                  <td className="py-3 pr-4">Small</td>
                  <td className="py-3 pr-4">Yes</td>
                  <td className="py-3 pr-4">No</td>
                  <td className="py-3">All modern browsers</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-white">JPG</td>
                  <td className="py-3 pr-4">Largest</td>
                  <td className="py-3 pr-4">No</td>
                  <td className="py-3 pr-4">No</td>
                  <td className="py-3">Universal</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-400 leading-relaxed">
            For maximum compression and future-proof quality, AVIF wins. For universal compatibility today, JPG remains the safe choice. WebP sits in the middle — smaller than JPG with broader support than AVIF.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">How to Convert Video to AVIF Online</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload your video file', desc: 'Drag and drop or click to select your MP4, MOV, or WEBM video.' },
              { num: '2', title: 'Select AVIF format', desc: 'Choose AVIF from the output format options for maximum compression efficiency.' },
              { num: '3', title: 'Configure frame rate (FPS)', desc: 'Select how many frames per second to extract using the FPS slider.' },
              { num: '4', title: 'Start the conversion', desc: 'Click "Extract Frames Now" to decode the video locally in your browser.' },
              { num: '5', title: 'Download your AVIF frames', desc: 'Download individual frames or get all frames as a single ZIP file.' },
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
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Best Use Cases for AVIF Frame Extraction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Web Performance', desc: 'The smallest possible hero images, thumbnails, and galleries — faster Largest Contentful Paint scores.' },
            { title: 'AI Training Datasets', desc: 'Compact, high-fidelity frame datasets that cut storage costs without sacrificing image quality.' },
            { title: 'Game Development', desc: 'Tiny sprite sheets and texture frames with transparency support for efficient asset pipelines.' },
            { title: 'Archival & Backup', desc: 'Maximum quality per megabyte when archiving important video frames long-term.' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-cyan-400 font-semibold mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Supported Video Formats</h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          Best supported: MP4, MOV, and WEBM. Other formats such as AVI or MKV may work only when your browser supports the video codec. Note that AVIF encoding itself requires a Chromium-based browser (Chrome, Edge, Opera) or Firefox — Safari does not yet support AVIF encoding via canvas.
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
            No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support. AVIF encoding is more CPU-intensive than WebP — for very long videos, use a lower FPS. If the tab freezes, close background tabs and retry.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">More Free Online Frame Extractors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/video-to-webp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to WebP</h3>
            <p className="text-gray-500 text-xs">Modern efficient frames with transparency.</p>
          </Link>
          <Link to="/video-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to PNG</h3>
            <p className="text-gray-500 text-xs">Extract lossless transparent PNG frames.</p>
          </Link>
          <Link to="/video-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Frame Extractor</h3>
            <p className="text-gray-500 text-xs">Supports MP4, MOV, WEBM and more.</p>
          </Link>
          <Link to="/mp4-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">MP4 to JPG</h3>
            <p className="text-gray-500 text-xs">Convert MP4 videos into high-quality JPGs.</p>
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

export default VideoToAvif;
