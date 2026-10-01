import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'What is a video frame extractor?',
    a: 'A video frame extractor is software that decodes a video file and saves individual frames as separate image files. Instead of watching motion, you get the raw stills — at whatever rate you choose, from one frame per second to every single frame the video contains.'
  },
  {
    q: 'Should I use an online extractor, ffmpeg, or VLC?',
    a: 'Use an online extractor when you want zero setup: drop in a video, get frames, done — ideal for occasional jobs. Use ffmpeg when you live in the terminal and need scriptable batch processing across hundreds of files. Use VLC when you only need a snapshot or two while watching. For most people, most of the time, the online tool is fastest.'
  },
  {
    q: 'Do I need to install software to extract video frames?',
    a: 'No. Modern browsers can decode video natively, so a browser-based extractor needs no installation, no plugins, and no admin rights — useful on work or school machines where you cannot install software. Install ffmpeg only if you need command-line automation.'
  },
  {
    q: 'What are extracted video frames used for?',
    a: 'Common uses: YouTube thumbnails, product photos from product videos, AI/ML training datasets, animation reference and rotoscoping, video forensics and documentation stills, memes and reaction images, and contact sheets for reviewing footage quickly.'
  },
  {
    q: 'Is it legal to extract frames from a video?',
    a: 'Extracting frames from videos you own or created is completely fine. For other people\u2019s content, the same copyright rules apply as with the video itself — personal study, commentary, and criticism are generally safer ground than republication. When in doubt, use your own footage or licensed stock.'
  },
  {
    q: 'How accurate is frame extraction — do I get the exact frame I see?',
    a: 'Yes, with a good extractor. Frames are captured from the decoded video stream at full resolution, so what you extract is the actual frame data — sharper and more faithful than a screen recording or a photo of your monitor. Timestamp-based capture can hit a specific moment with millisecond precision.'
  },
  {
    q: 'Why do some frame extractors add watermarks or limit exports?',
    a: 'Server-side extractors pay for upload bandwidth, storage, and compute, so they gatekeep with watermarks, file-size caps, or paid tiers. Browser-based extractors do the work on your device, so there is nothing to pay for — no watermark, no account, no limits beyond your own hardware.'
  },
  {
    q: 'Can a frame extractor handle 4K video or very long recordings?',
    a: 'Yes, but mind your hardware: 4K frames are large, and long videos at high frame rates produce enormous file counts. For 4K sources, extract at modest rates (1–5 fps) unless you truly need every frame, and split multi-hour recordings into segments first.'
  }
];

const VideoFrameExtractor: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('video-frame-extractor-schemas');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-frame-extractor-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Video Frame Extractor — Extract Video Frames Online Free",
      "url": "https://www.videotoimagesequence.online/video-frame-extractor",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Free online video frame extractor. Pull still frames from MP4, MOV, and WEBM videos as JPG or PNG images in your browser. No install, no upload, no watermark.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video Frame Extractor",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5, WebAssembly and Javascript support",
      "featureList": [
        "Extract frames from video with no software install",
        "Online tool, ffmpeg, and VLC methods compared",
        "Millisecond-precise timestamp frame capture",
        "JPG and PNG output with ZIP download",
        "Full-resolution frames from 4K sources",
        "Private by design — nothing is uploaded"
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
      "name": "How to Extract Frames with an Online Video Frame Extractor",
      "description": "The fastest method: extract still frames from any video in your browser with no install. Compare with ffmpeg and VLC alternatives.",
      "totalTime": "PT2M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Open the extractor",
          "text": "Load the browser-based frame extractor below — no install, no account."
        },
        {
          "@type": "HowToStep",
          "name": "Add your video",
          "text": "Drag in an MP4, MOV, or WEBM file. It is decoded locally on your device."
        },
        {
          "@type": "HowToStep",
          "name": "Choose extraction mode",
          "text": "Set frames per second for a sequence, or jump to a timestamp for one exact frame."
        },
        {
          "@type": "HowToStep",
          "name": "Extract the frames",
          "text": "Run the extraction and preview every captured frame in the results grid."
        },
        {
          "@type": "HowToStep",
          "name": "Download",
          "text": "Save the frames you need individually, or download the full set as a ZIP."
        }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('video-frame-extractor-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('videoFrameExtractor.title')}
        description={t('videoFrameExtractor.description')}
        canonical="https://www.videotoimagesequence.online/video-frame-extractor"
        ogTitle={t('videoFrameExtractor.title')}
        ogDescription={t('videoFrameExtractor.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoFrameExtractor.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Video Frame Extractor', path: '/video-frame-extractor' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoFrameExtractor.h1')}<br />
          <span className="text-cyan-400">{t('videoFrameExtractor.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoFrameExtractor.hero')}
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

      {/* ── WHAT IS A FRAME EXTRACTOR ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          What a Video Frame Extractor Does
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Video looks continuous, but it is a flipbook: dozens of still images per second. A frame extractor opens that flipbook and hands you the pages — decoding the video stream and writing individual frames out as JPG or PNG files you can keep, edit, and reuse.
        </p>
        <p className="text-gray-400 leading-relaxed">
          That simple operation unlocks a surprising range of work: thumbnails, datasets, documentation, animation reference, and forensics all start with <strong className="text-white">getting the stills out of the video</strong>. The only real questions are how fast, how precise, and how private the extraction is — which is where the method you choose matters.
        </p>
      </section>

      {/* ── METHOD COMPARISON ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          Three Ways to Extract Frames, Compared
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-cyan-800 rounded-2xl p-5">
            <h3 className="text-cyan-400 font-semibold mb-2">Online extractor (this page) — fastest for most jobs</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              No install, no commands to memorize. Drop in a video, set a frame rate or timestamp, download stills. Best when you extract frames occasionally and want results in under a minute. The browser-based approach also means your footage never uploads anywhere.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">ffmpeg — best for batch automation</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The command-line standard: <span className="text-gray-300 font-mono text-xs">ffmpeg -i input.mp4 -vf fps=1 frame_%04d.jpg</span> extracts one frame per second with total scriptability. Unbeatable for processing hundreds of files overnight — but you must install it and learn its flags.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">VLC — fine for one-off snapshots</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              VLC\u2019s snapshot feature (Video → Take Snapshot) grabs whatever is on screen while you watch. Quick for one or two stills, but manual, imprecise, and impractical for sequences — you would be pressing a hotkey hundreds of times.
            </p>
          </div>
        </div>
      </section>

      {/* Google AdSense ad — Post How-To */}
      <div className="max-w-5xl mx-auto px-4">
        <GoogleAdUnit />
      </div>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Extract Frames Online (No Install)
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Open the extractor', desc: 'The tool above runs in your browser — no install, no account, no upload.' },
              { num: '2', title: 'Add your video', desc: 'Drag in an MP4, MOV, or WEBM file. It is decoded locally on your device.' },
              { num: '3', title: 'Choose extraction mode', desc: 'Set frames per second for a full sequence, or jump to a timestamp for one exact frame.' },
              { num: '4', title: 'Extract the frames', desc: 'Run the extraction and preview every captured frame in the results grid.' },
              { num: '5', title: 'Download', desc: 'Save the frames you need individually, or download the full set as a ZIP.' },
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

      {/* ── BROWSER NOTICE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">
            Why Browser-Based Extraction Wins on Privacy
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Server-side extractors must receive your entire video before doing anything — slow for large files and a privacy exposure for sensitive footage. Here, decoding happens on your own device: nothing uploads, nothing is stored remotely, and there is no queue. The trade-off is that very large jobs are bounded by your device\u2019s memory rather than a server farm.
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
            <h3 className="text-white font-semibold mb-2">Video Won\u2019t Load</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              If a file refuses to load, its codec is likely unsupported by your browser — common with older AVI or MKV files. Re-encode to H.264 MP4 (Handbrake and Shutter Encoder are free) and try again.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Extraction Stalls Partway</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Stalls usually mean the browser ran out of memory mid-job. Close other tabs, lower the frame rate, and avoid extracting full-fps sequences from 4K footage in one go.
            </p>
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS (INTERNAL LINKING) ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          Related Extraction Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/video-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to Frames</h3>
            <p className="text-gray-500 text-xs">Convert video into a numbered frame sequence.</p>
          </Link>
          <Link to="/video-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to JPG</h3>
            <p className="text-gray-500 text-xs">Extract full-resolution JPG stills.</p>
          </Link>
          <Link to="/extract-frames-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Extract Frames from Video</h3>
            <p className="text-gray-500 text-xs">FPS control plus exact timestamp capture.</p>
          </Link>
          <Link to="/screenshot-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Screenshot from Video</h3>
            <p className="text-gray-500 text-xs">Grab one perfect frame, full resolution.</p>
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

export default VideoFrameExtractor;
