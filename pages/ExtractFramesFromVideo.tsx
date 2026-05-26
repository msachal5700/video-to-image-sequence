import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import AdsterraAd from '../components/AdsterraAd';
import { Link } from 'react-router-dom';

const faqs = [
  {
    q: 'How do I extract frames from a video?',
    a: 'Load your video above, choose your output format (JPG or PNG), choose your FPS settings, and click Extract. Your extracted frames will display in a grid and can be downloaded as a ZIP.'
  },
  {
    q: 'Can I extract frames from an MP4 video?',
    a: 'Yes. MP4 is highly recommended because it uses standard codecs that are natively decoded by your browser for optimal performance.'
  },
  {
    q: 'What is a video frame extractor?',
    a: 'A video frame extractor decodes video files and saves individual frame buffers as separate, downloadable image files.'
  },
  {
    q: 'Is there a file size limit for frame extraction?',
    a: 'No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support.'
  },
  {
    q: 'Should I export frames as JPG or PNG?',
    a: 'Use JPG for smaller file sizes and fast downloads. Use PNG if you require lossless quality or need to preserve transparency (alpha channel).'
  }
];

const ExtractFramesFromVideo: React.FC = () => {
  useEffect(() => {
    const existing = document.getElementById('extract-frames-from-video-schemas');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'extract-frames-from-video-schemas';
    
    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Extract Frames from Video",
      "url": "https://www.videotoimagesequence.online/extract-frames-from-video",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Extract frames from video online for free. Convert MP4, MOV, and WEBM videos to JPG or PNG sequences in your browser. No server upload required.",
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

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Extract Frames from Video Online",
      "description": "Step-by-step instructions to extract individual frame images from video files.",
      "totalTime": "PT1M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Open the Frame Extractor",
          "text": "Access the browser-based tool and load your MP4, MOV, or WEBM file."
        },
        {
          "@type": "HowToStep",
          "name": "Configure Extraction Rate",
          "text": "Select the target frame rate (FPS) to dictate how frequently frames are sliced."
        },
        {
          "@type": "HowToStep",
          "name": "Generate the Frame Sequence",
          "text": "Process the video locally in device memory to decode frame images."
        },
        {
          "@type": "HowToStep",
          "name": "Download Output Zip",
          "text": "Download all extracted frames packaged inside a clean ZIP archive."
        }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('extract-frames-from-video-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="Extract Frames from Video Online — Free Video Frame Extractor"
        description="Extract frames from video online for free. Convert MP4, MOV, and WEBM videos to JPG or PNG sequences in your browser. No server upload required."
        canonical="https://www.videotoimagesequence.online/extract-frames-from-video"
        ogTitle="Extract Frames from Video Online — Free Video Frame Extractor"
        ogDescription="Extract frames from video online for free. Convert MP4, MOV, and WEBM videos to JPG or PNG sequences in your browser. No server upload required."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords="extract frames from video, video frame extractor, convert video to images, video to frame sequence"
      />
      

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Extract Frames', path: '/extract-frames-from-video' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          Extract Frames from Video<br />
          <span className="text-cyan-400">Online — Free Video Frame Extractor</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Extract frames from video online for free. Drag and drop MP4, MOV, or WEBM videos to save still images as JPG or PNG sequences. Runs completely in your local browser for maximum privacy.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {[
            '🔒 100% Private (Local)',
            '⚡ Local Browser Extraction',
            '📦 ZIP Archive Download',
            '🎨 JPG & PNG Formats',
            '🆓 Free'
          ].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Adsterra Ad — Pre-Tool */}
      <div className="max-w-5xl mx-auto px-4">
        <AdsterraAd label="Advertisement" />
      </div>

      {/* Main Tool Content */}
      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToImages />
      </div>

      {/* ── BROWSER SECURITY & PRIVACY ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Local, Secure Video Decoding
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Most online frame extraction services require you to upload massive video files to their cloud servers, which is slow and exposes your data. Our tool leverages WebCodecs and canvas decoding to process files directly inside your browser. No files are uploaded, keeping your video private and making extraction fast.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Extract Frames from Video Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload your video file', desc: 'Drag and drop or click to select your MP4, MOV, or WEBM video.' },
              { num: '2', title: 'Choose JPG or PNG output', desc: 'Select JPG for smaller images or PNG for lossless quality frames.' },
              { num: '3', title: 'Select frame extraction settings', desc: 'Select how many frames per second to extract using the FPS slider.' },
              { num: '4', title: 'Start the conversion', desc: 'Click "Extract Frames Now" and watch the local decoding progress.' },
              { num: '5', title: 'Download your frames', desc: 'Download individual snapshots or get all frames as a single ZIP file.' },
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

      {/* Adsterra Ad — Post How-To */}
      <div className="max-w-5xl mx-auto px-4">
        <AdsterraAd label="Advertisement" />
      </div>

      {/* ── SUPPORTED VIDEO FORMATS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Supported Video Formats
        </h2>
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

      {/* ── LIMITATIONS & MEMORY WARNING ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">
            ⚠️ Browser Processing Notice
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support. Heavy 4K files or high FPS extraction sequences can exceed browser memory bounds. If the tab freezes, close background tabs and run extraction with a lower FPS.
          </p>
        </div>
      </section>

      {/* ── TROUBLESHOOTING ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Troubleshooting Common Issues
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Worker/Decoder Failed to Start</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              If your video contains a codec not supported natively by WebCodecs, the application will automatically fall back to legacy rendering. For best performance, encode your video as an H.264 MP4.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">ZIP File Generation Fails</h3>
            <p className="text-gray-405 text-sm leading-relaxed">
              If you extract thousands of frames, compiling them into a ZIP archive can exceed browser memory bounds. Reduce your FPS selector to create a smaller, more manageable sequence.
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
          <Link to="/video-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to PNG</h3>
            <p className="text-gray-500 text-xs">Extract lossless transparent PNG frames.</p>
          </Link>
          <Link to="/screenshot-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Capture Screenshot</h3>
            <p className="text-gray-500 text-xs">Grab exact full-resolution frames.</p>
          </Link>
          <Link to="/images-to-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Images to Video</h3>
            <p className="text-gray-500 text-xs">Stitch frame sequences into a WebM video.</p>
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-display">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="border border-gray-800 bg-gray-900/50 rounded-xl p-5 cursor-pointer group hover:border-cyan-800 transition-colors">
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

export default ExtractFramesFromVideo;
