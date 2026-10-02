import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2, CheckCircle2, Download, AlertTriangle, LayoutGrid } from 'lucide-react';
import VideoContactSheetTool from '../components/VideoContactSheetTool';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'What is a video contact sheet?',
    a: 'A video contact sheet is a single image that arranges evenly-spaced video frames in a grid — like a photographic contact sheet, but for video. It lets you see the entire arc of a clip at a glance: opening shot, key moments, and ending, all on one printable page. Editors, archivists, and reviewers use them to scan footage without scrubbing through timelines.'
  },
  {
    q: 'How do I make a contact sheet from a video online?',
    a: 'Load your video into the tool above, choose how many frames you want (9, 16, 25, or 36) and how many columns the grid should have, then click Generate Contact Sheet. The tool samples frames evenly across the whole video, arranges them in a grid with timestamps, and gives you one JPG or PNG image to download. Everything runs in your browser — no upload.'
  },
  {
    q: 'How many frames should a video contact sheet have?',
    a: 'It depends on the video length and what the sheet is for. 9 frames (3×3) works for a quick overview of a short clip. 16 frames (4×4) is the standard all-rounder for review and archiving. 25–36 frames suits long videos or detailed analysis where you want denser coverage. More frames means a bigger image file, so match the density to the job.'
  },
  {
    q: 'Do contact sheets include timestamps?',
    a: 'This one does — each thumbnail is labeled with its timestamp (MM:SS) so you can jump straight to that moment in the video. Timestamps can be toggled off if you want a clean grid for presentations or storyboards. The optional header strip also records the filename, resolution, and total duration.'
  },
  {
    q: 'What is the difference between a contact sheet and extracting frames?',
    a: 'Extracting frames gives you many individual image files — one per frame. A contact sheet composites selected frames into a single grid image. Use frame extraction when you need the images themselves (editing, datasets, thumbnails); use a contact sheet when you need an overview document (review, archiving, shot lists, client approval).'
  },
  {
    q: 'Can I make a contact sheet without uploading my video?',
    a: 'Yes. This contact sheet maker decodes your video and builds the grid entirely in your browser using local processing. Your footage never leaves your device, which makes it safe for unreleased work, client material, and personal videos.'
  },
  {
    q: 'What video formats work with the contact sheet maker?',
    a: 'Anything your browser can play: MP4, MOV, and WEBM work best. AVI or MKV files may work if your browser supports their codec, but browser support for those containers is inconsistent — converting to MP4 first is the reliable route.'
  },
  {
    q: 'Can I use a video contact sheet for storyboards or shot lists?',
    a: 'Yes — that is one of the most common uses. Generate a sheet, print it or share the image, and annotate the frames: shot numbers, camera notes, selects for the edit. Because every thumbnail carries a timestamp, anyone reviewing the sheet can find the exact moment in the source video.'
  }
];

const VideoContactSheet: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('video-contact-sheet-schemas');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-contact-sheet-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Video Contact Sheet Maker — Free Online",
      "url": "https://www.videotoimagesequence.online/video-contact-sheet",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Make a video contact sheet online for free. Turn any MP4, MOV, or WEBM video into a printable grid of timestamped thumbnails in your browser. No upload, no watermark, 100% private.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video Contact Sheet Generator",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5 video and canvas support",
      "featureList": [
        "Generate a printable contact sheet from any video",
        "9 to 36 evenly-spaced thumbnails per sheet",
        "Adjustable grid columns with timestamp labels",
        "Header strip with filename, resolution, and duration",
        "Export as JPG or high-quality PNG",
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
      "name": "How to Make a Video Contact Sheet Online",
      "description": "Turn any video into a single printable grid image of evenly-spaced, timestamped thumbnails — free in your browser.",
      "totalTime": "PT2M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Load your video",
          "text": "Drag and drop an MP4, MOV, or WEBM file into the maker above — it never leaves your browser."
        },
        {
          "@type": "HowToStep",
          "name": "Choose frames and grid",
          "text": "Pick how many thumbnails the sheet should hold (9–36) and how many columns the grid uses."
        },
        {
          "@type": "HowToStep",
          "name": "Toggle timestamps and header",
          "text": "Keep timestamp labels and the metadata header on for review work, or turn them off for clean presentation grids."
        },
        {
          "@type": "HowToStep",
          "name": "Generate and download",
          "text": "Build the sheet and download it as a JPG or PNG — one image summarizing the whole video."
        }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('video-contact-sheet-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('videoContactSheet.title')}
        description={t('videoContactSheet.description')}
        canonical="https://www.videotoimagesequence.online/video-contact-sheet"
        ogTitle={t('videoContactSheet.title')}
        ogDescription={t('videoContactSheet.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoContactSheet.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Video Contact Sheet', path: '/video-contact-sheet' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoContactSheet.h1')}<br />
          <span className="text-cyan-400">{t('videoContactSheet.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoContactSheet.hero')}
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
        <VideoContactSheetTool />
      </div>

      {/* ── WHAT IS A VIDEO CONTACT SHEET ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          One Image That Summarizes a Whole Video
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          A video contact sheet takes evenly-spaced frames from across a video's full duration and arranges them into a single grid image. Instead of scrubbing through minutes of footage, you scan one page and see the entire arc: how a scene opens, where the action happens, and how it ends. Each thumbnail carries its timestamp, so any frame you spot on the sheet maps back to an exact moment in the video.
        </p>
        <p className="text-gray-400 leading-relaxed">
          The format comes from film photography, where contact sheets let photographers review a whole roll without printing every negative. Video adopted the same idea for <strong className="text-white">footage review, archiving, and client approval</strong>: a contact sheet is a visual index you can print, attach to a project folder, or drop into a report. Unlike server-based generators, this maker builds the sheet locally in your browser — unreleased edits, client footage, and personal videos never get uploaded anywhere.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Make a Video Contact Sheet Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Load your video', desc: 'Drag and drop an MP4, MOV, or WEBM file. It is decoded locally — nothing is uploaded.' },
              { num: '2', title: 'Choose frames and grid', desc: 'Pick 9–36 thumbnails and set the column count. Denser grids suit long videos; sparse grids suit quick overviews.' },
              { num: '3', title: 'Toggle timestamps and header', desc: 'Keep labels on for review and archiving, or switch them off for a clean presentation grid.' },
              { num: '4', title: 'Pick JPG or PNG', desc: 'JPG for compact, shareable sheets; PNG for maximum thumbnail sharpness.' },
              { num: '5', title: 'Generate and download', desc: 'Build the sheet in seconds and download one image that summarizes the entire video.' },
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
          What People Use Video Contact Sheets For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Footage Review &amp; Selects</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Editors scan a sheet to find the usable takes before ever opening a timeline. Timestamped thumbnails turn "somewhere around the middle" into an exact timecode you can jump to.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Storyboards &amp; Shot Lists</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Print a sheet and annotate it: shot numbers, camera notes, selects for the edit. The grid becomes a working document the whole crew can mark up.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Archive Indexing</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Attach a one-page visual index to archived footage so future-you can identify what's in a file without playing it. The header records filename, resolution, and duration automatically.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Client Approval &amp; Reports</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Drop a contact sheet into a report or share it with a client to show what a video contains without sending the whole file. Reviewers circle the frames they want kept.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACT SHEET VS FRAME EXTRACTION ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Contact Sheet vs. Frame Extraction
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Both start from the same idea — pulling stills out of video — but they answer different questions. <strong className="text-white">Frame extraction</strong> gives you the images themselves as individual files: one JPG or PNG per frame, sequentially numbered, ready to edit, composite, or feed to software. <strong className="text-white">A contact sheet</strong> gives you an overview document: many moments composited into one image for human review.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Rule of thumb: if a person needs to <em>look at</em> the footage quickly, make a contact sheet. If software or an editing workflow needs the <em>pixels</em>, extract frames. Many projects use both — a sheet to find the moments, extraction to pull them at full quality.
        </p>
      </section>

      {/* ── BROWSER NOTICE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">
            Browser Processing Notice
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No server upload required. The sheet is composited in your browser, so very long videos or 4K sources depend on your device memory. If generation slows down on huge files, use fewer frames or a shorter clip — the sheet stays just as useful.
          </p>
        </div>
      </section>

      {/* ── RELATED TOOLS (INTERNAL LINKING) ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Frame Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/video-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to Frames</h3>
            <p className="text-gray-500 text-xs">Convert video into numbered frame sequences.</p>
          </Link>
          <Link to="/extract-frames-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Extract Frames from Video</h3>
            <p className="text-gray-500 text-xs">FPS-controlled extraction with timestamp capture.</p>
          </Link>
          <Link to="/screenshot-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Screenshot from Video</h3>
            <p className="text-gray-500 text-xs">Grab a single exact frame as an image.</p>
          </Link>
          <Link to="/images-to-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Images to Video</h3>
            <p className="text-gray-500 text-xs">Stitch image sequences back into a video.</p>
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

export default VideoContactSheet;
