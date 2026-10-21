import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VideoToPdfTool from '../components/VideoToPdfTool';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';

const faqs = [
  {
    q: 'How do I convert a video to PDF?',
    a: 'Load the video into the tool above, choose how frames are picked — every N seconds, N evenly-spaced frames, or manual capture from the preview scrubber — then arrange the frame strip, set your page size, layout, and quality, and click Download PDF. The tool builds a paginated document with each frame as an image on the page and optional timestamp captions. Everything runs in your browser: no upload, no signup, no watermark.'
  },
  {
    q: 'Can I turn a lecture or tutorial video into a printable PDF?',
    a: 'Yes — that is one of the most common uses. Extract frames every 30–60 seconds from a slide-based lecture, delete the duplicates, add a title page with the course name, and export an A4 document that reads like a visual handout. For dense whiteboard or coding sessions, use every 10 seconds and two frames per page to keep the document compact. If you want per-frame study commentary rather than a clean document, our Video Notes Extractor is built for that workflow.'
  },
  {
    q: 'Is this video to PDF converter free? Do I need an account?',
    a: 'Completely free, no account, no signup, no watermark. There is nothing to install — it runs entirely in your browser using the same decoding your video player uses. Your videos are processed locally on your device, which means unreleased footage, client recordings, and paid-course content stay private: nothing is uploaded to any server.'
  },
  {
    q: 'What page settings can I control in the generated PDF?',
    a: 'Page size (A4 or Letter), orientation (auto, portrait, or landscape), 1, 2, or 4 frames per page, JPEG quality (50–95%), timestamp captions on or off, a custom document title and author (written into the PDF metadata), and an optional title page with the source filename, video length, and frame count. Auto orientation matches your video: landscape footage gets landscape pages.'
  },
  {
    q: 'How many frames can one PDF hold? Are there limits?',
    a: 'Up to 500 frames per run. In practice the real limit is your browser\u2019s memory: a few hundred full-quality frames make a large PDF, and very long documents can slow down weaker devices. If a download fails, split the video into sections (e.g. one PDF per chapter) or lower the JPEG quality to 80%. This is the honest trade-off of doing the work locally instead of on a server — your privacy in exchange for your device doing the heavy lifting.'
  },
  {
    q: 'How is this different from the Video Notes Extractor?',
    a: 'The Video Notes Extractor is built for studying: it extracts frames at fixed intervals and exports a simple one-frame-per-page PDF tuned for revision. Video to PDF is the general-purpose document maker: multi-frame page layouts, title pages, custom titles and authors, A4/Letter control, and quality settings — made for training manuals, documentation, evidence logs, meeting records, printable storyboards, and archiving. Same privacy-first, no-upload engine underneath; different job.'
  }
];

const VideoToPdf: React.FC = () => {
  const { t } = useTranslation();
  const webAppSchema = {
    "@type": "WebApplication",
    "name": "Video to PDF — Free Online Converter, No Signup",
    "url": "https://www.videotoimagesequence.online/video-to-pdf",
    "image": "https://www.videotoimagesequence.online/og-image.png",
    "description": "Convert video to PDF free in your browser. Extract frames every N seconds, capture moments manually, arrange the frame strip, and generate a paginated PDF with title page, timestamps, and quality control. No upload, no signup.",
    "applicationCategory": "UtilitiesApplication",
    "applicationSubCategory": "Video to PDF Converter",
    "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
    "browserRequirements": "Requires HTML5 video and canvas support",
    "featureList": [
      "Extract frames every N seconds, N evenly-spaced frames, or manual capture from scrubber",
      "Frame strip preview with delete and reorder before export",
      "A4/Letter page size, auto/portrait/landscape orientation, 1/2/4 frames per page",
      "JPEG quality slider, timestamp caption toggle, optional title page",
      "Custom document title and author written into PDF metadata",
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
    "name": "How to Convert a Video to PDF Online",
    "description": "Extract frames from any video, arrange them, and generate a paginated PDF document — free in your browser, no upload.",
    "totalTime": "PT5M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload the video",
        "text": "Drag and drop an MP4, MOV, or WEBM file. It is decoded locally — nothing is uploaded to any server."
      },
      {
        "@type": "HowToStep",
        "name": "Choose your frame-picking method",
        "text": "Extract a frame every N seconds, grab N evenly-spaced frames across the video, or scrub the preview and capture individual moments manually."
      },
      {
        "@type": "HowToStep",
        "name": "Arrange the frame strip",
        "text": "Delete duplicates, reorder frames with the arrow controls, and preview the estimated page count."
      },
      {
        "@type": "HowToStep",
        "name": "Set the PDF options",
        "text": "Pick A4 or Letter, orientation, 1/2/4 frames per page, JPEG quality, timestamp captions, title, author, and an optional title page."
      },
      {
        "@type": "HowToStep",
        "name": "Download the PDF",
        "text": "Generate the document in one click — each frame rendered as a JPEG on its page with your captions and metadata baked in."
      }
    ]
  };

  const orgSchema = {
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

  const pageSchemas = {
    "@context": "https://schema.org",
    "@graph": [webAppSchema, faqSchema, howToSchema, orgSchema]
  };

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <script type="application/ld+json">
        {JSON.stringify(pageSchemas)}
      </script>
      <SEOHead
        title={t('videoToPdf.title')}
        description={t('videoToPdf.description')}
        canonical="https://www.videotoimagesequence.online/video-to-pdf"
        ogTitle={t('videoToPdf.title')}
        ogDescription={t('videoToPdf.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoToPdf.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Video to PDF', path: '/video-to-pdf' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoToPdf.h1')}<br />
          <span className="text-cyan-400">{t('videoToPdf.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoToPdf.hero')}
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
        <VideoToPdfTool />
      </div>

      {/* ── WHAT IS IT ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Turn Any Video into a Paginated PDF Document
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Video is great for watching and terrible for filing. A video to PDF converter bridges that gap: it pulls frames out of a video and lays them into a proper paginated document you can print, email, attach to a report, or archive alongside your other files. Lecture recordings become visual handouts. Tutorial videos become step-by-step manuals. Meeting recordings become minutes with visual evidence. Screen recordings become documentation nobody has to rewatch.
        </p>
        <p className="text-gray-400 leading-relaxed">
          The tool above does the whole conversion in your browser — no upload, no signup, no watermark. You choose <strong className="text-white">how frames are picked</strong> (every N seconds, N evenly-spaced across the video, or hand-picked from the scrubber), arrange them in a frame strip, then set the document options: <strong className="text-white">A4 or Letter, 1/2/4 frames per page, JPEG quality, timestamp captions, a title page, and document metadata</strong>. One click generates the PDF. The difference from taking screenshots is scale and consistency: one extraction pass produces a hundred evenly-captured, timestamped frames; doing that by hand takes an afternoon.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Convert a Video to PDF in 3 Steps
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Drop in your video', desc: 'Add an MP4, MOV, or WEBM file. It is decoded locally in your browser and never uploaded to any server.' },
              { num: '2', title: 'Pick and arrange frames', desc: 'Extract every N seconds, grab N evenly-spaced frames, or scrub the preview and capture individual moments. Delete duplicates and reorder the frame strip until the sequence reads like a document.' },
              { num: '3', title: 'Set the layout and download', desc: 'Choose A4/Letter, orientation, frames per page, quality, captions, and a title page — then generate the PDF with your title and author baked into its metadata.' },
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
          What People Use Video-to-PDF For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Training Manuals &amp; Tutorials</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Software walkthroughs and equipment tutorials make terrible reading material as video — nobody can Ctrl+F a recording. Extract the key steps every 10–20 seconds, two frames per page with timestamps, and you have a printable manual that lives in the same folder as the rest of your docs.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Evidence &amp; Documentation Logs</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Inspection footage, site surveys, and dashcam-style records gain credibility as timestamped PDF pages. Each frame carries its timestamp caption, and the title page records the source file and video length — a clean exhibit you can attach to an email or file with a case.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Meeting Records &amp; Lecture Handouts</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pull the slides from a recorded presentation at 30–60 second intervals, add the event title and your name on the title page, and distribute a handout that matches the talk slide for slide. Attendees get the visuals; you never open a screenshot tool.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Printable Storyboards &amp; Archives</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Editors and animators turn rough cuts into printable storyboards: evenly-spaced frames, 4 per page, landscape A4. Archivists do the same with legacy footage — a 500-frame PDF is a visual index of a tape that would otherwise need a player and an afternoon.
            </p>
          </div>
        </div>
      </section>

      {/* ── FORMATS & QUALITY ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Quality, Formats &amp; Honest Limits
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-white">Frames are captured at up to 1280px wide</strong> — sharp on screen and clean on an A4 page — and written into the PDF as JPEGs with your chosen quality. 80–90% is the sweet spot for most documents: crisp text and diagrams at a file size that still emails comfortably. One frame per page suits large visuals; <strong className="text-white">2 or 4 per page</strong> keeps long sequences compact for storyboards and logs. Any video your browser can play works: MP4, MOV, and WEBM cover virtually all recordings, exports, and downloads.
        </p>
        <p className="text-gray-400 leading-relaxed">
          The honest limits: extraction and PDF generation happen entirely on your device, so a <strong className="text-white">500-frame cap</strong> protects weaker phones and laptops from running out of memory — for longer videos, split the work into sections. Seeking through very large files can also be slow on older hardware; if a frame takes too long, the tool tells you instead of hanging silently. What you get in exchange is absolute privacy: <strong className="text-white">nothing is uploaded, ever</strong> — client footage, unreleased work, and paid-course recordings never touch a server.
        </p>
      </section>

      {/* ── COMPARISON ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Browser Tool vs. Desktop Apps vs. Upload-Based Converters
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          The main alternatives are <strong className="text-white">mobile apps</strong> (search "video to PDF" in any app store and you will find several) and <strong className="text-white">upload-based online converters</strong> that take your video, process it on their servers, and return a PDF. Apps work but they live behind installs, ads, and often paid tiers for more than a few pages. Upload-based tools are convenient, yet they require you to hand your footage to a third party and wait in a server queue — a non-starter for client work or unlisted recordings.
        </p>
        <p className="text-gray-400 leading-relaxed">
          This tool takes the third route: <strong className="text-white">100% in-browser</strong>. No install, no upload, no queue, no account, and no per-video fee. The trade-off is that your device does the work, which is why the 500-frame cap exists — a server farm could chew through more, but then it would have your video. For one-off conversions of lectures, tutorials, documentation, and evidence footage, local processing is the faster and safer choice. Pair it with the <Link to="/video-notes-extractor" className="text-cyan-400 hover:underline">Video Notes Extractor</Link> when you want a study-focused export, or the <Link to="/video-contact-sheet" className="text-cyan-400 hover:underline">Video Contact Sheet Maker</Link> when you want a single overview grid instead of a paginated document.
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
          <Link to="/video-notes-extractor" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-700 transition block">
            <h3 className="text-white font-semibold mb-1">Video Notes Extractor</h3>
            <p className="text-gray-500 text-sm">Turn lecture videos into study notes — pick key frames and export a timestamped PDF.</p>
          </Link>
          <Link to="/video-contact-sheet" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-700 transition block">
            <h3 className="text-white font-semibold mb-1">Video Contact Sheet Maker</h3>
            <p className="text-gray-500 text-sm">A single-page grid overview of any video with timestamp labels — JPG or PNG export.</p>
          </Link>
          <Link to="/video-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-700 transition block">
            <h3 className="text-white font-semibold mb-1">Extract Frames from Video</h3>
            <p className="text-gray-500 text-sm">Full-frame extraction at custom intervals, exported as a ZIP image sequence.</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default VideoToPdf;
