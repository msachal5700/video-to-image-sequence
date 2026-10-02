import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'What does "video to frames" mean?',
    a: 'Converting video to frames means turning a video file into a sequence of still images — one image per extracted frame, saved as JPG or PNG files with sequential names like frame_0001.jpg, frame_0002.jpg. Each image is a single frozen moment from the video timeline, ready to edit, analyze, or reassemble.'
  },
  {
    q: 'How many frames will I get from my video?',
    a: 'It depends on the frame rate you choose. At 1 frame per second, a 60-second video produces 60 images. At the video\u2019s native 30 fps, the same clip produces 1,800 images. Lower rates are best for thumbnails and contact sheets; higher rates suit animation work and AI datasets where every moment matters.'
  },
  {
    q: 'What is the difference between converting video to frames and taking a screenshot?',
    a: 'A screenshot captures one hand-picked moment. Converting video to frames produces the entire sequence systematically — evenly spaced, sequentially numbered, and complete. If you need three stills, take screenshots; if you need every moment of a clip as images, convert the video to frames.'
  },
  {
    q: 'Can I convert video to frames for stop motion or animation work?',
    a: 'Yes. Animators routinely convert reference video to frames to study motion, trace movement (rotoscoping), or build onion-skin guides. Because the exported frames are sequentially numbered, they drop straight into animation software like Blender, After Effects, or Dragonframe as an image sequence.'
  },
  {
    q: 'How are the exported frames named?',
    a: 'Frames are exported with zero-padded sequential names (frame_0001.jpg, frame_0002.jpg, and so on) so they sort correctly in every file manager and import as an ordered image sequence in video editors. You can download them individually or all at once as a ZIP archive.'
  },
  {
    q: 'How do I choose the right frame rate for extraction?',
    a: 'Match the rate to the job: 1 fps for thumbnails, storyboards, and contact sheets; 2\u20135 fps for evenly spaced AI training samples; 12\u201324 fps for smooth animation reference; full native fps only when you need literally every frame, since file counts grow fast. Start low — you can always re-run at a higher rate.'
  },
  {
    q: 'Does converting video to frames reduce image quality?',
    a: 'Extraction itself is lossless — each frame is captured exactly as the video decoder renders it. Quality only changes if you choose a lossy output format: JPG applies compression (adjustable), while PNG preserves every pixel. For maximum fidelity, extract as PNG.'
  },
  {
    q: 'Can I turn extracted frames back into a video?',
    a: 'Yes. A numbered frame sequence can be reassembled into video in any editor, or with our free Images to Video tool, which stitches JPG/PNG sequences into a WebM video right in your browser.'
  }
];

const VideoToFrames: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('video-to-frames-schemas');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-to-frames-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Video to Frames — Free Online Video Frame Extractor",
      "url": "https://www.videotoimagesequence.online/video-to-frames",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Convert video to frames online for free. Turn MP4, MOV, and WEBM videos into numbered JPG or PNG image sequences in your browser. No upload, no watermark, 100% private.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video to Frames Converter",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5, WebAssembly and Javascript support",
      "featureList": [
        "Convert any video into a numbered frame sequence",
        "Adjustable extraction rate from 1 fps to full native fps",
        "Export frames as JPG or PNG with sequential filenames",
        "Download all frames as a single ZIP archive",
        "Import-ready sequences for Blender, Premiere, and After Effects",
        "100% browser-based — videos never leave your device"
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
      "name": "How to Convert Video to Frames Online",
      "description": "Turn any video into a numbered sequence of JPG or PNG still images, free in your browser. Pick a frame rate, extract, and download the sequence as a ZIP.",
      "totalTime": "PT2M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Load your video",
          "text": "Drag and drop an MP4, MOV, or WEBM file into the converter above — it never leaves your browser."
        },
        {
          "@type": "HowToStep",
          "name": "Set the frame rate",
          "text": "Choose how many frames per second to pull: 1 fps for thumbnails and contact sheets, higher for animation or dataset work."
        },
        {
          "@type": "HowToStep",
          "name": "Pick JPG or PNG",
          "text": "JPG keeps files small; PNG keeps every pixel lossless for editing and compositing."
        },
        {
          "@type": "HowToStep",
          "name": "Convert and preview",
          "text": "Start the conversion and watch the numbered frame sequence build up in the preview grid."
        },
        {
          "@type": "HowToStep",
          "name": "Download the sequence",
          "text": "Grab individual frames or download the whole numbered sequence as a ZIP, ready to import into any editor."
        }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('video-to-frames-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('videoToFrames.title')}
        description={t('videoToFrames.description')}
        canonical="https://www.videotoimagesequence.online/video-to-frames"
        ogTitle={t('videoToFrames.title')}
        ogDescription={t('videoToFrames.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoToFrames.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Video to Frames', path: '/video-to-frames' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoToFrames.h1')}<br />
          <span className="text-cyan-400">{t('videoToFrames.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoToFrames.hero')}
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

      {/* ── WHAT VIDEO TO FRAMES MEANS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Video In, Numbered Frames Out
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          A video is just a rapid sequence of still images played back fast enough to look like motion. Converting video to frames reverses that process: the tool decodes your video and saves each chosen moment as its own image file, numbered in order — frame_0001.jpg, frame_0002.jpg, and so on.
        </p>
        <p className="text-gray-400 leading-relaxed">
          The result is an <strong className="text-white">image sequence</strong>, the same format professional pipelines use everywhere. Video editors import sequences for frame-by-frame work, 3D software uses them as animated textures, and machine-learning teams feed them to models as training data. Because the files are sequentially numbered, any software that understands image sequences will play them back in the right order automatically.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Convert Video to Frames Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Load your video', desc: 'Drag and drop an MP4, MOV, or WEBM file. It is decoded locally — nothing is uploaded.' },
              { num: '2', title: 'Set the frame rate', desc: 'Choose frames per second: 1 fps for thumbnails and contact sheets, higher for animation or dataset work.' },
              { num: '3', title: 'Pick JPG or PNG', desc: 'JPG for compact files, PNG for lossless quality and transparency support.' },
              { num: '4', title: 'Convert and preview', desc: 'Run the conversion and watch the numbered sequence appear in the preview grid.' },
              { num: '5', title: 'Download the sequence', desc: 'Save individual frames or download the entire numbered sequence as one ZIP file.' },
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

      {/* ── USE CASES ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          What People Use Video-to-Frames For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Animation &amp; Rotoscoping</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Convert reference footage to frames to study motion, trace movement frame by frame, or build onion-skin guides. Numbered sequences import directly into Blender, After Effects, and Dragonframe.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">AI Training Datasets</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Machine-learning workflows need thousands of labeled stills. Extracting 2–5 frames per second from source video is the fastest honest way to build a diverse, sequential training set.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Contact Sheets &amp; Storyboards</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              One frame per second gives you a visual index of an entire clip — perfect for reviewing footage, pitching a storyboard, or finding the exact moment worth keeping. Try the dedicated <Link to="/video-contact-sheet" className="text-cyan-400 hover:underline">video contact sheet maker</Link> for a printable grid.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Thumbnails &amp; Key Art</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Scan a whole video as stills, pick the sharpest or most expressive frame, and you have a thumbnail or poster image without scrubbing through a timeline by hand.
            </p>
          </div>
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
            Browser Processing Notice
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support. Extracting at full native fps from long 4K videos can exceed browser memory — if the tab slows down, use a lower frame rate or a shorter clip.
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
            <h3 className="text-white font-semibold mb-2">Too Many Frames to Handle</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A 10-minute video at 30 fps is 18,000 images — more than most browsers can hold. Drop to 1–2 fps for review work, or split long videos into shorter segments before converting.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Frames Look Blurry</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Extracted frames can only be as sharp as the source video. If frames look soft, the video itself is low-resolution or heavily compressed — try a higher-quality source file, and export as PNG to avoid adding JPG compression on top.
            </p>
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS (INTERNAL LINKING) ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Frame Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/video-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to JPG</h3>
            <p className="text-gray-500 text-xs">Convert any video into JPG still images.</p>
          </Link>
          <Link to="/video-frame-extractor" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video Frame Extractor</h3>
            <p className="text-gray-500 text-xs">What frame extractors do and how they compare.</p>
          </Link>
          <Link to="/extract-frames-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Extract Frames from Video</h3>
            <p className="text-gray-500 text-xs">FPS-controlled extraction with timestamp capture.</p>
          </Link>
          <Link to="/images-to-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Images to Video</h3>
            <p className="text-gray-500 text-xs">Stitch your frame sequence back into a video.</p>
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

export default VideoToFrames;
