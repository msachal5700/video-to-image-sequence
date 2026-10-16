import React, { useEffect } from 'react';
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
    q: 'How do I extract frames from a video?',
    a: 'Load your video above, choose your output format (JPG or PNG), choose your FPS settings, and click Extract. Your extracted frames will display in a grid and can be downloaded as a ZIP.'
  },
  {
    q: 'How do I extract a frame at an exact timestamp from a video?',
    a: 'Use our precise timestamp control panel. Play your video, pause at the exact moment you need, and click the "Capture Frame" button to extract that specific frame. The system supports millisecond-level precision for exact frame capture.'
  },
  {
    q: 'Can I extract frames from a video for AI dataset training?',
    a: 'Yes! Our tool is perfect for AI datasets. Extract hundreds or thousands of frames from MP4, MOV, or WEBM videos locally in your browser with custom FPS controls. Download all frames as a ZIP file for training machine learning models. Processing happens entirely in your browser, keeping your data private.'
  },
  {
    q: 'What video formats support exact frame extraction with the highest quality?',
    a: 'MP4, MOV, and WEBM formats are best supported with native browser codec decoding for optimal extraction quality. Other formats like AVI or MKV may work if your browser supports their specific codecs.'
  },
  {
    q: 'How much system memory do I need for browser-based frame extraction?',
    a: 'For smooth 1080p video extraction at standard FPS (24-30), you’ll need at least 4-8GB of RAM. For 4K video or higher FPS extraction, 8-16GB of RAM is recommended. If you encounter memory issues, try extracting at lower FPS rates or close other browser tabs.'
  },
  {
    q: 'What is a video frame extractor?',
    a: 'A video frame extractor decodes video files and saves individual frame buffers as separate, downloadable image files. It processes video streams locally in your browser using WebAssembly and Canvas APIs, keeping your data private while providing flexible frame rate control.'
  },
  {
    q: 'Is there a file size limit for frame extraction?',
    a: 'No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support. Browser memory limits typically range from 1GB to 4GB for video processing.'
  },
  {
    q: 'Can I extract frames at a custom interval, like every 2.5 seconds?',
    a: 'Yes. Use the Manual tab in the extraction settings to type any interval — every N seconds (decimals allowed, e.g. 2.5s), every N minutes, or an exact manual FPS like 0.5. The tool shows a live estimate of how many frames your video will produce before you extract.'
  },
  {
    q: 'What is manual FPS extraction and when should I use it?',
    a: 'Manual FPS lets you set an exact frame rate instead of a preset — anything from 0.1 to 60 frames per second. Use a low manual FPS (e.g. 0.5 or 1) for long recordings, timelapses, and lectures where presets are too dense; use higher values for slow-motion analysis or dense AI training datasets. Extraction still runs 100% in your browser with the same ZIP download.'
  },
  {
    q: 'Is there a limit on how many frames I can extract with a custom interval?',
    a: 'Extraction is capped at 5,000 frames per run to protect browser memory. If your manual setting would exceed that — e.g. a high FPS on a long video — use a lower FPS or a wider interval, or split the video into shorter clips.'
  },
  {
    q: 'Should I export frames as JPG or PNG?',
    a: 'Use JPG for smaller file sizes and fast downloads. Use PNG if you require lossless quality or need to preserve transparency (alpha channel) for compositing work in video editing or VFX pipelines.'
  },
  {
    q: 'What is smart scene detection?',
    a: 'Smart scene detection is an extraction mode that keeps one frame per scene change instead of frames at fixed intervals. The tool samples your video about twice per second and saves a frame whenever the picture changes significantly — perfect for lectures, tutorials, and screen recordings where most of the footage is static.'
  },
  {
    q: 'How does scene-change detection work in the browser?',
    a: 'Each sampled frame is downscaled and compared against the last saved frame using pixel-difference analysis. When the difference passes your sensitivity setting, a new scene is registered. To avoid blurry transition frames, the tool compares the frame at the cut with one a moment later and keeps the sharper of the two. Everything runs locally in your browser — no uploads.'
  },
  {
    q: 'What does the scene sensitivity slider do?',
    a: 'Sensitivity controls how big a visual change must be to count as a new scene. High sensitivity catches subtle changes like slide transitions; low sensitivity only keeps hard cuts. If you get too many similar frames, lower the sensitivity; if scenes are being merged, raise it.'
  },
  {
    q: 'Will scene detection work on any video?',
    a: 'It works best on videos with clear visual cuts — presentations, tutorials, vlogs, and screen recordings. Slow fades, dissolves, and gradual camera pans may be grouped into fewer scenes because the picture changes gradually. For evenly spaced stills regardless of content, use the "every N seconds" mode instead.'
  }
];

const ExtractFramesFromVideo: React.FC = () => {
  const { t } = useTranslation();
  const pageLang = usePageLang();
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
      "name": "Free Video Frame Extractor — Extract Frames from Video",
      "url": "https://www.videotoimagesequence.online/video-to-frames",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Free browser-based video frame extractor — extract every frame from MP4, MOV, and WEBM videos as JPG or PNG images. Perfect for AI datasets, exact timestamp extraction, and professional frame-by-frame workflows. 100% private, no server upload required.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video Frame Extractor",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5, WebAssembly and Javascript support",
      "featureList": [
        "Extract frames at exact timestamps with millisecond precision",
        "Perfect for AI/ML image datasets and computer vision training",
        "Export JPG or PNG with customizable FPS control",
        "Process videos entirely in your browser (100% private)",
        "Batch processing of multiple video files",
        "ZIP download of extracted frames",
        "Supports MP4, MOV, and WEBM with fallback codec support"
      ],
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
      "name": "How to Extract Video Frames at Exact Timestamps",
      "description": "Step-by-step instructions for extracting individual video frames, perfect for AI datasets, precise frame capture, and professional workflows. Process videos entirely in your browser with millisecond precision.",
      "totalTime": "PT2M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Open the Video Frame Extractor",
          "text": "Access the browser-based tool and load your MP4, MOV, or WEBM video file."
        },
        {
          "@type": "HowToStep",
          "name": "Configure Exact Frame Capture",
          "text": "Use the video timeline player to jump to the exact timestamp (HH:MM:SS.mmm) where you want to capture a frame."
        },
        {
          "@type": "HowToStep",
          "name": "Capture Specific Frame",
          "text": "Click 'Capture Frame' to extract the exact frame at that timestamp as JPG or PNG format."
        },
        {
          "@type": "HowToStep",
          "name": "Batch Extract for AI Datasets",
          "text": "For AI/ML projects, use custom FPS (Frames Per Second) settings to extract multiple frames efficiently. Perfect for computer vision training datasets."
        },
        {
          "@type": "HowToStep",
          "name": "Download Extracted Frames",
          "text": "Download individual captured frames or get all extracted frames as a ZIP archive for your project."
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
        title={t('extractFrames.title')}
        description={t('extractFrames.description')}
        canonical={localizedUrl('/extract-frames-from-video', pageLang)}
        ogTitle={t('extractFrames.title')}
        ogDescription={t('extractFrames.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={`${t('extractFrames.keywords')}, video to frame sequence`}
      />
      

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Extract Frames', path: '/extract-frames-from-video' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('extractFrames.h1')}<br />
          <span className="text-cyan-400">{t('extractFrames.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('extractFrames.hero')}
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {[
            t('badges.private'),
            t('badges.fast'),
            t('badges.free')
          ].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </section>

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

      {/* Google AdSense ad — Post How-To */}
      <div className="max-w-5xl mx-auto px-4">
        <GoogleAdUnit />
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
            <p className="text-gray-400 text-sm leading-relaxed">
              If you extract thousands of frames, compiling them into a ZIP archive can exceed browser memory bounds. Reduce your FPS selector to create a smaller, more manageable sequence.
            </p>
          </div>
        </div>
      </section>

      {/* ── SMART SCENE DETECTION ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Smart Scene Detection — One Frame Per Scene Change
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Fixed intervals waste frames on static footage: a 10-minute lecture sampled every 5 seconds
          produces 120 near-identical slides. Switch the extractor above to the{' '}
          <strong className="text-white">Smart scenes</strong> tab and it will instead keep exactly
          one frame per scene change — a new still only when the picture actually changes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Detects cuts automatically</h3>
            <p className="text-gray-500 text-xs leading-relaxed">Samples ~2× per second and registers a scene whenever the frame differs significantly from the last kept one.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Adjustable sensitivity</h3>
            <p className="text-gray-500 text-xs leading-relaxed">Slide from Low to High: catch subtle slide transitions or keep only hard cuts. The detected scene count updates live.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Skips blurry transitions</h3>
            <p className="text-gray-500 text-xs leading-relaxed">Each cut is compared against a frame a moment later, and the sharper of the two is kept — no smeared dissolve frames.</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed mt-4">
          Ideal for lecture notes, tutorial documentation, and QA bug reproductions. For evenly spaced
          stills regardless of content, the every-N-seconds presets below remain available.
        </p>
      </section>

      {/* ── EXTRACT BY TIME INTERVAL (INTERNAL LINKING) ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Extract a Frame Every N Seconds
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          Prefer evenly spaced stills over a fixed frame rate? These presets capture one frame at a fixed time interval — perfect for timelapses, contact sheets, and thumbnail hunting.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/video-notes-extractor" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video Notes Extractor</h3>
            <p className="text-gray-500 text-xs">Turn lecture videos into study notes — pick frames, download ZIP or PDF.</p>
          </Link>
          <Link to="/extract-frame-every-1-second" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Every 1 Second</h3>
            <p className="text-gray-500 text-xs">Dense sampling — about 60 stills per minute of video.</p>
          </Link>
          <Link to="/extract-frame-every-5-seconds" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Every 5 Seconds</h3>
            <p className="text-gray-500 text-xs">Thumbnail hunting and storyboards — about 12 stills per minute.</p>
          </Link>
          <Link to="/extract-frame-every-10-seconds" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Every 10 Seconds</h3>
            <p className="text-gray-500 text-xs">Timelapse previews and summaries — about 6 stills per minute.</p>
          </Link>
          <Link to="/extract-frame-every-30-seconds" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Every 30 Seconds</h3>
            <p className="text-gray-500 text-xs">Long recordings distilled to a few representative frames.</p>
          </Link>
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
