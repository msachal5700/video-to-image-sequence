import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoToImages from './VideoToImages';
import GoogleAdUnit from '../components/GoogleAdUnit';
import SEOHead from '../components/SEOHead';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();

  const faqItems = (t('home.faq.items', { returnObjects: true }) || []) as Array<{ q: string; a: string }>;
  const steps = (t('home.steps', { returnObjects: true }) || []) as string[];
  const whoUsesList = (t('home.whoUsesList', { returnObjects: true }) || []) as string[];
  const howSteps = (t('home.howSteps', { returnObjects: true }) || []) as Array<{ title: string; desc: string }>;
  const whoUsesItems = (t('home.whoUsesItems', { returnObjects: true }) || []) as Array<{ icon: string; title: string; desc: string }>;
  const compareHeaders = (t('home.compareHeaders', { returnObjects: true }) || []) as string[];
  const compareRows = (t('home.compareRows', { returnObjects: true }) || []) as string[][];
  const moreToolsData = (t('home.moreTools', { returnObjects: true }) || []) as Array<{ title: string; desc: string }>;
  const relatedData = (t('home.relatedItems', { returnObjects: true }) || []) as Array<{ title: string; desc: string }>;

  useEffect(() => {
    const existing = document.getElementById('home-schemas');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'home-schemas';
    
    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": "https://www.videotoimagesequence.online/#webapp",
      "name": "Video to Image Sequence Online",
      "alternateName": [
        "Video Frame Extractor",
        "MP4 to Image Sequence Converter",
        "Video to PNG Sequence Online"
      ],
      "url": "https://www.videotoimagesequence.online",
      "description": "Free browser-based tool to extract frames from MP4, MOV, WEBM videos as JPG/PNG image sequences. Processed locally in device memory, 100% private, batch processing, ZIP download, custom FPS.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video Converter",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires modern browser with JavaScript enabled",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "featureList": [
        "No server upload — 100% private processing",
        "Processed locally in browser memory",
        "JPG and PNG output format selection",
        "Custom FPS frame rate control (all, 1, 5, 10, 24, 30 FPS)",
        "ZIP download of all frames",
        "Batch processing of multiple videos",
        "MP4, MOV, WEBM input support"
      ],
      "speakable": {
        "@type": "SpeakableSpecification",
        "xPath": [
          "/html/head/meta[@name='description']/@content"
        ]
      },
      "mainEntity": {
        "@id": "https://www.videotoimagesequence.online/#faq"
      }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://www.videotoimagesequence.online/#faq",
      "mainEntity": faqItems.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };

    const navigationSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Site Navigation Tools",
      "itemListElement": [
        {
          "@type": "SiteNavigationElement",
          "position": 1,
          "name": "Video to Image Sequence Converter",
          "url": "https://www.videotoimagesequence.online"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 2,
          "name": "MP4 to JPG Converter",
          "url": "https://www.videotoimagesequence.online/mp4-to-jpg"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 3,
          "name": "Video to PNG Converter",
          "url": "https://www.videotoimagesequence.online/video-to-png"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 4,
          "name": "Screenshot from Video",
          "url": "https://www.videotoimagesequence.online/screenshot-from-video"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 5,
          "name": "Extract Frames from Video",
          "url": "https://www.videotoimagesequence.online/extract-frames-from-video"
        },
        {
          "@type": "SiteNavigationElement",
          "position": 6,
          "name": "Images to Video Converter",
          "url": "https://www.videotoimagesequence.online/images-to-video"
        }
      ]
    };

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Video to Image Sequence Online",
      "description": "Learn how to extract frame sequences from video files locally inside your web browser.",
      "totalTime": "PT1M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Load Your Video File",
          "text": "Drag and drop your video file (MP4, MOV, or WEBM) into the browser-based upload zone.",
          "url": "https://www.videotoimagesequence.online/#dropzone"
        },
        {
          "@type": "HowToStep",
          "name": "Select Output Settings",
          "text": "Choose your desired image format (JPG or PNG) and custom frame rate (FPS).",
          "url": "https://www.videotoimagesequence.online/#settings"
        },
        {
          "@type": "HowToStep",
          "name": "Extract and Download Frames",
          "text": "Click Extract Frames and preview the sequence. Download all frames as a ZIP file.",
          "url": "https://www.videotoimagesequence.online/#preview"
        }
      ]
    };

    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Video to Image Sequence Online",
      "url": "https://www.videotoimagesequence.online",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.videotoimagesequence.online/favicon.svg",
        "width": 32,
        "height": 32
      },
      "description": "Free online video frame extraction tool. Convert MP4, MOV, and WEBM videos to image sequences in your browser.",
      "sameAs": [
        "https://x.com/videotoimage"
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, navigationSchema, howToSchema, orgSchema]);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('home-schemas');
      if (el) {
        el.remove();
      }
    };
  }, [faqItems]);

  const moreToolsLinks = ['/mp4-to-jpg', '/screenshot-from-video', '/video-to-png'];
  const relatedLinks = [
    '/extract-frames-from-video',
    '/blog/mp4-to-image-sequence-guide',
    '/video-to-png',
    '/images-to-video',
    '/screenshot-from-video',
    '/blog/mp4-to-image-sequence-guide'
  ];

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('home.title')}
        description={t('home.description')}
        canonical="https://www.videotoimagesequence.online/"
        ogTitle={t('home.title')}
        ogDescription={t('home.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('home.keywords')}
      />
      
      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-16 pb-10 px-4">
        {/* Announcement Pill */}
        <Link
          to="/ai-social-media-frame-picker"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-950/80 to-gray-900 border border-cyan-800/80 text-cyan-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 hover:border-cyan-400 transition-all shadow-lg shadow-cyan-950/50 group"
        >
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span>✨ NEW: AI Social Media Frame Picker — Auto-Score & Pick Best Thumbnail</span>
          <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>

        {/* H1 — SEO + AI optimized */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('home.h1')}<br />
          <span className="text-cyan-400">{t('home.h1Sub')}</span>
        </h1>

        {/* Answer-first description */}
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('home.hero')}
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {[
            t('home.badges.noUpload'),
            t('home.badges.private'),
            t('home.badges.fast'),
            t('home.badges.zip'),
            t('home.badges.batch'),
            t('home.badges.fps'),
            t('home.badges.free')
          ].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Tool Switcher Tabs */}
      <div className="flex justify-center mb-10 px-4">
        <div className="bg-gray-900 p-1.5 rounded-xl border border-gray-800 flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 bg-cyan-500 text-gray-950 shadow-lg shadow-cyan-500/20"
          >
            {t('home.tabs.toImages')}
          </Link>
          <Link
            to="/images-to-video"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 text-gray-400 hover:text-white hover:bg-gray-800/80"
          >
            {t('home.tabs.toVideo')}
          </Link>
        </div>
      </div>

      {/* Main Tool Content */}
      <div className="animate-fade-in min-h-[400px] px-4">
        <VideoToImages />
      </div>

      {/* Adsterra Ad Block */}
      <div className="max-w-5xl mx-auto">
        <GoogleAdUnit />
      </div>

      {/* ── HOW THIS TOOL WORKS ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          {t('home.howWorksTitle')}
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          {t('home.howWorksDesc')}
        </p>
        <p className="text-gray-400 mb-6 font-semibold text-white">{t('home.simpleProcess')}</p>
        <ol className="text-gray-400 space-y-2 mb-6 list-decimal list-inside">
          {steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
        <p className="text-gray-400 leading-relaxed">
          {t('home.useCases')}
        </p>
      </section>

      {/* ── SUPPORTED VIDEO FORMATS ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          {t('home.formatsTitle')}
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          {t('home.formatsDesc1')}
        </p>
        <p className="text-gray-400 leading-relaxed">
          {t('home.formatsDesc2')}
        </p>
      </section>

      {/* ── SUPPORTED IMAGE OUTPUT FORMATS ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          {t('home.outputsTitle')}
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          {t('home.outputsDesc')}
        </p>
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-white font-semibold mb-1">{t('home.jpgTitle')}</p>
            <p className="text-gray-400">{t('home.jpgDesc')}</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">{t('home.pngTitle')}</p>
            <p className="text-gray-400">{t('home.pngDesc')}</p>
          </div>
        </div>
        <p className="text-gray-400 leading-relaxed">
          {t('home.outputChoose')}
        </p>
      </section>

      {/* ── WHO CAN USE THIS TOOL ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          {t('home.whoUsesTitle')}
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          {t('home.whoUsesDesc')}
        </p>
        <ul className="text-gray-400 space-y-2 list-disc list-inside">
          {whoUsesList.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* ── PRIVACY AND FILE SAFETY ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          {t('home.privacyTitle')}
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          {t('home.privacyDesc1')}
        </p>
        <p className="text-gray-400 mb-6 leading-relaxed">
          {t('home.privacyDesc2')}
        </p>
        <p className="text-gray-400 leading-relaxed">
          <strong className="text-white">{t('home.privacyWarn')}</strong>
        </p>
      </section>
      
      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
          {t('home.howItWorksTitle')}
        </h2>
        <p className="text-gray-500 text-center text-sm mb-12">
          {t('home.howItWorksSub')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howSteps.map(({ title, desc }, idx) => (
            <div key={idx} className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-5xl font-black text-cyan-950 mb-4">{String(idx + 1).padStart(2, '0')}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section id="use-cases" className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
          {t('home.whoUsesOnlineTitle')}
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10">
          {t('home.whoUsesOnlineSub')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {whoUsesItems.map(({ icon, title, desc }) => (
            <div key={title}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-800 hover:bg-gray-900/80 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPETITOR COMPARISON ── */}
      <section id="compare" className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
          {t('home.compareTitle')}
        </h2>
        <p className="text-gray-500 text-center text-sm mb-8">
          {t('home.compareSub')}
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                {compareHeaders.map((header, idx) => (
                  <th key={idx} className="px-5 py-4 text-left text-gray-400 font-medium whitespace-nowrap">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {compareRows.map(([feature, ours, cloud, others]) => (
                <tr key={feature} className="hover:bg-gray-900/50 transition-colors">
                  <td className="px-5 py-3 text-gray-300 font-medium">{feature}</td>
                  <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-medium">{ours}</td>
                  <td className="px-5 py-3 text-center text-gray-400">{cloud}</td>
                  <td className="px-5 py-3 text-center text-gray-500">{others}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── RELATED TOOLS ── */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-display">
          {t('home.moreToolsTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {moreToolsData.map(({ title, desc }, idx) => (
            <Link key={idx} to={moreToolsLinks[idx] || '/'} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-800 hover:bg-gray-900/80 transition-all group block text-left">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                {idx === 0 ? '🎞️' : idx === 1 ? '📸' : '🎨'}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-cyan-400 transition-colors">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── RELATED VIDEO FRAME TOOLS AND GUIDES ── */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
          {t('home.relatedTitle')}
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10">
          {t('home.relatedSub')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {relatedData.map(({ title, desc }, idx) => (
            <Link key={idx} to={relatedLinks[idx] || '/'} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-cyan-800 hover:bg-gray-900/80 transition-all group block text-left">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">
                {idx === 0 ? '🎯' : idx === 1 ? '📚' : idx === 2 ? '🎨' : idx === 3 ? '🎬' : idx === 4 ? '📸' : '📷'}
              </div>
              <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors text-sm md:text-base">{title}</h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="max-w-3xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
          {t('home.faq.title')}
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10">
          {t('home.faq.sub')}
        </p>
        <div className="space-y-3">
          {faqItems.map((faq, i) => (
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

      {/* Adsterra Ad — Post FAQ */}
      <div className="max-w-5xl mx-auto">
        <GoogleAdUnit />
      </div>
    </div>
  );
};

export default Home;