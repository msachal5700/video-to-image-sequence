import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VideoNotesExtractorTool from '../components/VideoNotesExtractorTool';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';

const faqs = [
  {
    q: 'How do I extract images from a lecture video for my notes?',
    a: 'Load the lecture recording into the tool above and choose an extraction interval — every 30 seconds works well for slide-based lectures, every 1–2 minutes for talking-head lessons. The tool pulls a frame at each interval and shows every frame in a scrollable gallery. Tick the frames that hold the diagrams, formulas, or slides you need, then download just those as a ZIP of images or a multi-page PDF. Everything runs in your browser, so class recordings never get uploaded anywhere.'
  },
  {
    q: 'Can I turn a video lecture into a PDF?',
    a: 'Yes — that is exactly what the PDF export is for. After extracting frames and selecting the ones you want to keep, click "Download as PDF" and the tool builds a multi-page document with one frame per page, each labeled with its timestamp. The result is a printable set of visual notes you can file alongside your written summaries or share with classmates.'
  },
  {
    q: 'Is the Video Notes Extractor free? Do I need an account?',
    a: 'Completely free, no account, no signup, no watermark. There is nothing to install — it runs entirely in your browser. Upload a video, extract frames, select the keepers, and download your ZIP or PDF. Your videos are processed locally on your device, which also means lecture recordings with sensitive or paid-course content stay private.'
  },
  {
    q: 'What is the best frame interval for study notes?',
    a: 'Match the interval to the lecture style. Slide-heavy lectures: every 30–60 seconds catches each new slide without drowning you in duplicates. Whiteboard or coding tutorials where the picture changes constantly: every 10–30 seconds. Talking-head videos with occasional diagrams: every 2–5 minutes, then use select-all/invert to keep only the diagram frames. You can always re-run with a different interval — extraction takes seconds.'
  },
  {
    q: 'How is this different from taking screenshots while watching?',
    a: 'Screenshots work but they are slow and inconsistent: you pause, capture, crop, rename, and repeat dozens of times, usually ending up with files named "Screenshot 47". The extractor does the tedious part in one pass — evenly spaced, timestamped, consistently named frames — and the checkbox gallery lets you curate the keepers in seconds instead of scrubbing back and forth through the video.'
  },
  {
    q: 'What video formats work with the notes extractor?',
    a: 'Anything your browser can play: MP4, MOV, and WEBM cover virtually all lecture recordings, Zoom exports, and downloaded course videos. If a file will not load, it is usually a codec your browser does not support — converting it to MP4 first fixes it in nearly all cases.'
  },
  {
    q: 'Can I use this for online course videos and tutorials?',
    a: 'Yes, for videos you have legitimate access to: downloaded course videos, your own recordings, Zoom/Teams exports, and Creative Commons tutorials. The tool processes files locally on your device — it does not bypass any platform protection or download from streaming sites. If a course platform only offers streaming with no download option, record or export the video through the platform\u2019s own tools first.'
  },
  {
    q: 'How many frames can I extract at once?',
    a: 'Up to 200 frames per run, which covers a 100-minute lecture at 30-second intervals. For longer videos, use a wider interval or run the extraction in sections. Frames are captured at up to 960px wide — sharp enough for slides, diagrams, and whiteboard writing in both the ZIP images and the PDF pages.'
  }
];

const VideoNotesExtractor: React.FC = () => {
  const { t } = useTranslation();
  const webAppSchema = {
    "@type": "WebApplication",
    "name": "Video Notes Extractor — Free Lecture-to-Notes Tool",
    "url": "https://www.videotoimagesequence.online/video-notes-extractor",
    "image": "https://www.videotoimagesequence.online/og-image.png",
    "description": "Turn lecture videos into study notes free. Extract frames from any class recording, pick the key images in a visual gallery, and download them as a ZIP or a timestamped multi-page PDF. 100% browser-based — no upload, no signup.",
    "applicationCategory": "EducationalApplication",
    "applicationSubCategory": "Study Notes Generator",
    "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
    "browserRequirements": "Requires HTML5 video and canvas support",
    "featureList": [
      "Extract frames from lecture videos at 10s–5min intervals",
      "Scrollable gallery of every extracted frame with timestamps",
      "Checkbox selection with select-all, deselect-all, and invert",
      "Download selected frames as a ZIP of JPG/PNG images",
      "Download selected frames as a multi-page PDF, one frame per page",
      "100% browser-based — videos never leave your device"
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
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
    "@type": "HowTo",
    "name": "How to Turn a Lecture Video into Study Notes",
    "description": "Extract key frames from any lecture recording, curate the important ones, and download them as images or a PDF — free in your browser.",
    "totalTime": "PT5M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload the lecture video",
        "text": "Drag and drop an MP4, MOV, or WEBM recording. It is decoded locally — nothing is uploaded."
      },
      {
        "@type": "HowToStep",
        "name": "Choose an extraction interval",
        "text": "Pick every 10 seconds up to every 5 minutes, matched to how fast the lecture visuals change."
      },
      {
        "@type": "HowToStep",
        "name": "Review the frame gallery",
        "text": "Scroll through every extracted frame, each labeled with its timestamp, and tick the ones worth keeping."
      },
      {
        "@type": "HowToStep",
        "name": "Curate with bulk selection",
        "text": "Use select-all, deselect-all, or invert-selection to narrow hundreds of frames down to the keepers in seconds."
      },
      {
        "@type": "HowToStep",
        "name": "Download ZIP or PDF",
        "text": "Export the selected frames as a ZIP of images, or as a multi-page PDF with one timestamped frame per page."
      }
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
        title={t('videoNotesExtractor.title')}
        description={t('videoNotesExtractor.description')}
        canonical="https://www.videotoimagesequence.online/video-notes-extractor"
        ogTitle={t('videoNotesExtractor.title')}
        ogDescription={t('videoNotesExtractor.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoNotesExtractor.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Video Notes Extractor', path: '/video-notes-extractor' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoNotesExtractor.h1')}<br />
          <span className="text-cyan-400">{t('videoNotesExtractor.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoNotesExtractor.hero')}
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
        <VideoNotesExtractorTool />
      </div>

      {/* ── WHAT IS IT ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          From Lecture Video to Study Notes in Minutes
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Hours of lecture recordings pile up fast — and rewatching them before an exam is nobody's idea of revision. The Video Notes Extractor turns any class recording, tutorial, or online course video into a set of visual study notes: it pulls frames out of the video at whatever interval you choose, lays every frame out in a scrollable gallery, and lets you tick exactly the slides, diagrams, whiteboard moments, and code walkthroughs worth keeping. Download your picks as a <strong className="text-white">ZIP of images</strong> or a <strong className="text-white">multi-page PDF</strong> with one timestamped frame per page.
        </p>
        <p className="text-gray-400 leading-relaxed">
          The difference from manual screenshots is the curation loop. Instead of pausing every two minutes to capture, crop, and rename, you run one extraction pass and then do the thinking work — scanning a gallery of timestamped frames and keeping the ten that matter. Students use it for <strong className="text-white">online lectures, exam revision, language classes, and coding tutorials</strong>; teachers use it to pull stills for handouts and slide decks. And because everything runs locally in your browser, even paid-course recordings and unlisted class videos stay private — nothing is uploaded to any server.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Extract Study Notes from a Video
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload the lecture video', desc: 'Drag and drop an MP4, MOV, or WEBM recording. It is decoded locally — nothing leaves your device.' },
              { num: '2', title: 'Choose an extraction interval', desc: 'Every 30 seconds suits slide lectures; every 10 seconds suits whiteboard or coding sessions; every few minutes suits talking-head lessons.' },
              { num: '3', title: 'Scan the frame gallery', desc: 'Scroll through every extracted frame — each carries its timestamp so you can jump back to that exact moment.' },
              { num: '4', title: 'Select the keepers', desc: 'Tick the frames that hold diagrams, formulas, and key slides. Bulk tools (select all / invert) narrow hundreds of frames in seconds.' },
              { num: '5', title: 'Download ZIP or PDF', desc: 'Export as a ZIP of JPG/PNG images, or as a printable multi-page PDF with one timestamped frame per page.' },
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
          Who Uses Video Notes — and How
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Online Lectures &amp; Exam Revision</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Extract every slide from a recorded lecture at 30–60 second intervals, keep the ones covering examinable topics, and export a PDF. You get a visual revision pack that maps 1:1 to the lecture — far faster than rewatching two hours of video the night before.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Coding &amp; Software Tutorials</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tutorial videos move fast. Pull frames every 10–30 seconds, keep the ones showing final code, configs, or terminal output, and you have a visual cheat-sheet you can glance at while you code — no more scrubbing back to 14:32.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Teachers &amp; Handouts</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Turn your own recorded lessons into printable handouts: extract the key diagrams, export the PDF, and distribute it with the recording. Students get the visuals; you never touch a screenshot tool.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Language &amp; Skill Learning</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Vocabulary slides, pronunciation diagrams, technique demos — frame extraction captures the visual half of any lesson. Build themed image sets (one ZIP per topic) and review them like flashcards.
            </p>
          </div>
        </div>
      </section>

      {/* ── TIPS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Tips for Better Video Study Notes
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-white">Match the interval to the content.</strong> The single biggest quality lever is the extraction interval. Slide decks change slowly — 60 seconds catches each slide once. Whiteboard sessions change constantly — 10–15 seconds keeps you from missing a step in a derivation. When in doubt, extract denser and curate harder: deleting extra frames from a gallery is instant, but a missed diagram means re-running.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-white">Use JPG for PDFs, PNG for diagrams with fine text.</strong> JPG keeps file sizes small — a 50-page study PDF stays emailable. If a slide has tiny text or thin lines, PNG preserves the crispness. The format toggle sits right next to the interval picker, so you can choose per video.
        </p>
        <p className="text-gray-400 leading-relaxed">
          <strong className="text-white">Keep the timestamps.</strong> Every frame in the gallery and every PDF page carries its timestamp for a reason: when a diagram confuses you later, the timestamp tells you exactly where to rewatch. Think of the extracted set as an index into the video, not just a pile of pictures. For the deepest revision workflow, pair the PDF with the <Link to="/extract-frame-at-timestamp" className="text-cyan-400 hover:underline">exact timestamp extractor</Link> to pull any single moment you missed at full quality.
        </p>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group">
              <summary className="cursor-pointer px-6 py-4 font-semibold text-white hover:text-cyan-300 transition list-none flex justify-between items-center gap-4">
                <span>{faq.q}</span>
                <span className="text-cyan-400 text-xl leading-none group-open:rotate-45 transition-transform flex-shrink-0">+</span>
              </summary>
              <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── RELATED TOOLS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          Related Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/video-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-700 transition block">
            <h3 className="text-white font-semibold mb-1">Extract Frames from Video</h3>
            <p className="text-gray-500 text-sm">Full-frame extraction at custom frame rates, exported as a ZIP image sequence.</p>
          </Link>
          <Link to="/screenshot-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-700 transition block">
            <h3 className="text-white font-semibold mb-1">Screenshot from Video</h3>
            <p className="text-gray-500 text-sm">Grab individual high-quality stills from any moment in a video.</p>
          </Link>
          <Link to="/video-to-photo" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-700 transition block">
            <h3 className="text-white font-semibold mb-1">Video to Photo</h3>
            <p className="text-gray-500 text-sm">Save any single frame as a full-quality JPG or PNG photo.</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default VideoNotesExtractor;
