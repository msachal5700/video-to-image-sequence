import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ExtractFrameEveryNSecondsProps {
  seconds: 1 | 5 | 10 | 30;
}

const slugFor = (s: number): string =>
  s === 1 ? 'extract-frame-every-1-second' : `extract-frame-every-${s}-seconds`;

/** Cadence-specific content so each landing page reads uniquely
 *  (avoids near-duplicate "doorway" pages for search & ad review). */
interface CadenceContent {
  perMinute: number;
  useCase: string;
  example: string;
  whyIntro: string;
  whyBullets: Array<{ title: string; text: string }>;
  formatsNote: string;
  noticeText: string;
  howToTip: string;
  faqFormats: string;
  faqCustom: string;
  faqPrivacy: string;
}

const cadenceDetail = (s: number): CadenceContent => {
  switch (s) {
    case 1:
      return {
        perMinute: 60,
        useCase: 'dense, near-frame-by-frame sampling — great for slow-motion analysis, sports form checks, and building compact AI training sets without the bloat of full-FPS extraction',
        example: 'a 60-second clip gives you about 60 evenly spaced stills',
        whyIntro:
          'A one-second cadence is the densest interval sampling this tool offers — close to frame-by-frame review without the storage bloat of full-FPS extraction. It is the right choice when motion matters but you still want a predictable, evenly spaced set of stills instead of thousands of near-identical frames.',
        whyBullets: [
          { title: 'Catch every beat of fast action', text: 'Sports swings, dance moves, machinery cycles: at 60 frames per minute you will not miss the moment a sparse interval would skip entirely.' },
          { title: 'Review technique like a coach', text: 'Athletes and trainers flip through one-second stills to check form, timing, and positioning without scrubbing a video timeline back and forth.' },
          { title: 'Build compact AI training sets', text: 'Dense, evenly spaced samples give computer-vision models consistent temporal coverage with far fewer images than 30 or 60 FPS extraction.' },
          { title: 'Inspect processes visually', text: 'Manufacturing steps, lab procedures, and repair walkthroughs become an annotatable flipbook you can share or archive.' },
          { title: 'Predictable, portable output', text: 'A 60-second clip yields about 60 stills — large enough to be useful, small enough to download and share instantly.' },
        ],
        formatsNote:
          'Phone-shot MP4 and MOV files are the most common source for one-second sampling — sports clips, action footage, and process recordings usually arrive in these formats. WEBM from screen recording works identically; your browser decodes everything locally before sampling.',
        noticeText:
          'One-second sampling of long videos adds up: an hour of footage yields roughly 3,600 frames. For very long recordings prefer JPG or WebP to keep the ZIP manageable (PNG is best for short clips). Your browser does all the work, so available device memory is the practical limit.',
        howToTip:
          'Tip: for sports analysis, sample every second first to find the interesting moments, then use the exact-timestamp extractor to pull full-resolution frames of the key instants.',
        faqFormats:
          'MP4, MOV, and WEBM work best — exactly the formats phones and action cameras produce for sports and process footage. Other formats like AVI or MKV may work if your browser can decode them, since all sampling happens with your browser\u2019s built-in video decoder.',
        faqCustom:
          'Yes — this page presets the extractor to 1 second, but you can switch to the 5, 10, or 30-second presets or type any custom interval from 1 to 3600 seconds. Toggle between \u201cEvery N Seconds\u201d and \u201cBy FPS\u201d modes at any time before extracting.',
        faqPrivacy:
          'No. Your video never leaves your device — frames are pulled entirely in your browser with local decoding, so even sensitive sports or workplace footage stays 100% private.',
      };
    case 5:
      return {
        perMinute: 12,
        useCase: 'thumbnail hunting, storyboard creation, and quick visual summaries — you see every important moment without scrolling through hundreds of near-identical frames',
        example: 'a 60-second clip gives you about 12 evenly spaced stills',
        whyIntro:
          'Five seconds is the storyteller\u2019s interval: sparse enough to turn minutes of footage into a quick visual summary, dense enough that no important moment slips through. It is the most popular cadence for thumbnail hunting, storyboards, and meeting recaps.',
        whyBullets: [
          { title: 'Hunt thumbnails in seconds', text: 'Twelve frames per minute is plenty to spot expressive faces, peak action, and clean compositions worth turning into YouTube thumbnails.' },
          { title: 'Storyboard any video', text: 'Turn a rough cut, vlog, or ad into a panel-by-panel storyboard for review, client approval, or shot planning.' },
          { title: 'Summarize meetings and calls', text: 'Skim a one-hour call visually instead of rewatching it — drop to a longer interval later if you want an even tighter summary.' },
          { title: 'Build neat contact sheets', text: 'Evenly spaced frames lay out cleanly into contact sheets for archives, portfolios, and documentation.' },
          { title: 'Skip the near-duplicates', text: 'Unlike FPS extraction you will not get hundreds of almost-identical frames — each still is five seconds apart, so each one shows something new.' },
        ],
        formatsNote:
          'MP4 from screen recordings and video calls is the most common source for five-second sampling — think recorded meetings, webinars, and gameplay captures. MOV from iPhones and WEBM from browsers all decode locally with the same result.',
        noticeText:
          'At 12 frames per minute, even a two-hour webinar produces under 1,500 stills — comfortable for most devices. JPG keeps the ZIP small for sharing; choose PNG when you plan to crop thumbnails out of the frames.',
        howToTip:
          'Tip: extracting thumbnails? Sample every 5 seconds first, pick your favorites, then re-extract those moments at exact timestamps for maximum resolution.',
        faqFormats:
          'MP4, MOV, and WEBM — the formats used by screen recorders, video-call apps, and phones. Anything your browser can decode (sometimes AVI or MKV too) works, because sampling happens locally with your browser\u2019s own decoder.',
        faqCustom:
          'Yes — this page presets 5 seconds, but 1, 10, and 30-second presets plus any custom value from 1 to 3600 seconds are one click away. You can also switch to \u201cBy FPS\u201d mode before extracting.',
        faqPrivacy:
          'No — everything runs in your browser. Meeting recordings and personal vlogs are never uploaded anywhere, so your footage stays completely private.',
      };
    case 10:
      return {
        perMinute: 6,
        useCase: 'timelapse previews, contact sheets, and lecture or webinar summarization — one glance tells you what happened across minutes of footage',
        example: 'a 60-second clip gives you about 6 evenly spaced stills',
        whyIntro:
          'Ten seconds is the summarizer\u2019s interval. Six frames per minute is enough to follow the arc of a lecture, webinar, or travel video at a glance — distilling long recordings into a visual table of contents you can scan in seconds.',
        whyBullets: [
          { title: 'Preview timelapses fast', text: 'Check whether a day-long timelapse captured what you wanted before committing to a full extraction — six frames per minute tells the story.' },
          { title: 'Recap lectures and webinars', text: 'Slides, whiteboards, and speaker moments surface as a visual outline of the whole session.' },
          { title: 'Scan travel footage', text: 'A day of travel clips collapses into a handful of frames per minute — enough to find the shots worth keeping.' },
          { title: 'Document step-by-step processes', text: 'Cooking videos, tutorials, and DIY builds become stills you can print, annotate, or embed in written guides.' },
          { title: 'Featherweight output', text: 'An hour of video becomes roughly 360 images — a ZIP that downloads in seconds and sips storage.' },
        ],
        formatsNote:
          'Lecture captures and webinar replays are usually MP4 — perfect for ten-second sampling. Travel vlogs shot on phones arrive as MP4 or MOV, and WEBM screen recordings behave identically; your browser decodes them all locally.',
        noticeText:
          'Ten-second intervals are gentle on resources: multi-hour recordings still produce only a few hundred frames. This is the safest cadence for very long videos on modest devices — output stays small in any format.',
        howToTip:
          'Tip: summarizing a course? Sample every 10 seconds, then arrange the stills in a document as visual chapter markers with your own notes.',
        faqFormats:
          'MP4, MOV, and WEBM cover virtually all lecture captures, webinar replays, and vlog footage. If your browser can decode it (occasionally AVI or MKV), interval sampling works the same — everything stays local.',
        faqCustom:
          'Yes — this page presets 10 seconds, with 1, 5, and 30-second presets plus any custom interval from 1 to 3600 seconds available. Switch between \u201cEvery N Seconds\u201d and \u201cBy FPS\u201d modes freely before extracting.',
        faqPrivacy:
          'No. Lecture videos, courses, and personal footage are sampled entirely on your device — nothing is uploaded, so your content stays 100% private.',
      };
    default:
      return {
        perMinute: 2,
        useCase: 'long recordings, surveillance-style sampling, and progress documentation — distill hours of footage into a handful of representative frames',
        example: 'a 60-second clip gives you about 2 evenly spaced stills',
        whyIntro:
          'Thirty seconds is the archivist\u2019s interval: two frames per minute, designed for very long recordings where you want the gist, not the detail. Surveillance-style review, construction progress, and day-long lectures all compress into a handful of representative stills.',
        whyBullets: [
          { title: 'Distill hours into handfuls', text: 'A full day of site footage becomes a visual log you can review over coffee — two frames per minute, zero scrubbing.' },
          { title: 'Track long-term progress', text: 'Construction, renovations, and experiments become a clean before/during/after sequence from a single continuous recording.' },
          { title: 'Review without watching', text: 'Security-style footage, dashcam archives, and long monitoring sessions: scan days of video as stills instead of fast-forwarding.' },
          { title: 'Archive lectures cheaply', text: 'Semester-long course recordings shrink to tiny, skimmable frame sets instead of terabytes of video.' },
          { title: 'Smallest output of any cadence', text: 'Even a 10-hour recording yields only about 1,200 frames — the lightest ZIP this tool can produce.' },
        ],
        formatsNote:
          'Long recordings are almost always MP4 (H.264) — from IP cameras, dashcams, and lecture-capture systems. That is ideal: MP4 seeks quickly, so thirty-second sampling flies even on multi-hour files. MOV and WEBM work too.',
        noticeText:
          'Thirty-second sampling is the most resource-friendly mode here — output stays tiny even for very long videos. If your source file is enormous (many GB), give the browser a moment to index it; extraction itself stays fast because so few frames are captured.',
        howToTip:
          'Tip: documenting progress? Record continuously and sample every 30 seconds — you get a ready-made visual timeline with no editing required.',
        faqFormats:
          'MP4 is king for thirty-second sampling — it is what IP cameras, dashcams, and lecture-capture systems record. MOV and WEBM work as well; anything your browser decodes (sometimes AVI/MKV) can be sampled locally.',
        faqCustom:
          'Yes — this page presets 30 seconds, but 1, 5, and 10-second presets plus any custom interval from 1 to 3600 seconds are available. Toggle between \u201cEvery N Seconds\u201d and \u201cBy FPS\u201d modes before extracting.',
        faqPrivacy:
          'No — sampling happens 100% in your browser. Monitoring-style footage and private recordings never leave your device.',
      };
  }
};

const OTHER_CADENCES: Array<1 | 5 | 10 | 30> = [1, 5, 10, 30];

const ExtractFrameEveryNSeconds: React.FC<ExtractFrameEveryNSecondsProps> = ({ seconds }) => {
  const { t } = useTranslation();
  const plural = seconds === 1 ? '' : 's';
  const slug = slugFor(seconds);
  const url = `https://www.videotoimagesequence.online/${slug}`;
  const detail = cadenceDetail(seconds);
  const interp = { n: seconds, plural };

  const faqs = [
    {
      q: `How do I extract a frame every ${seconds} second${plural} from a video?`,
      a: `Upload your video above — the “Every N Seconds” extraction mode is already selected with a ${seconds}-second interval. Pick JPG, PNG, or WebP output and click “Extract Frames Now”. Your video is decoded frame-by-frame right in your browser and the stills download as a ZIP — no upload, no watermark.`
    },
    {
      q: `How many frames will I get with a ${seconds}-second interval?`,
      a: `Roughly one frame per ${seconds} seconds of footage, so ${detail.example} (${detail.perMinute} frames per minute of video). If the interval is longer than the clip itself you still get the opening frame, never an empty result.`
    },
    {
      q: `When should I use every-${seconds}-seconds instead of FPS extraction?`,
      a: `Use a fixed time interval when you want predictable, evenly spaced samples: ${detail.useCase}. Use FPS mode instead when you need smooth motion or every single frame of a short clip.`
    },
    {
      q: 'Which video formats work with interval frame extraction?',
      a: detail.faqFormats
    },
    {
      q: 'Can I change the interval or set a custom number of seconds?',
      a: detail.faqCustom
    },
    {
      q: 'Is my video uploaded to a server?',
      a: detail.faqPrivacy
    }
  ];

  useEffect(() => {
    const scriptId = `extract-every-${seconds}s-schemas`;
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": t('extractEveryN.title', interp),
      "url": url,
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": t('extractEveryN.description', interp),
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video Frame Extractor",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5, WebAssembly and Javascript support",
      "featureList": [
        `Extract one frame every ${seconds} second${plural} from any video`,
        "Presets for 1, 5, 10, and 30 second intervals plus custom 1–3600s input",
        "JPG, PNG, and WebP output with ZIP download",
        "Process videos entirely in your browser (100% private)",
        "No watermark, no sign-up, free forever"
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
      "name": `How to Extract a Frame Every ${seconds} Second${plural}`,
      "description": `Step-by-step instructions for pulling one still image every ${seconds} second${plural} from a video locally inside your web browser.`,
      "totalTime": "PT1M",
      "step": [
        { "@type": "HowToStep", "name": "Upload Your Video", "text": "Drag and drop your MP4, MOV, or WEBM video file into the browser-based upload zone." },
        { "@type": "HowToStep", "name": "Confirm the Interval", "text": `The “Every N Seconds” mode comes preselected at every ${seconds} second${plural}. Adjust it or type a custom interval (1–3600 seconds) if you like.` },
        { "@type": "HowToStep", "name": "Choose an Output Format", "text": "Pick JPG for small files, PNG for lossless quality, or WebP for efficient web-ready images." },
        { "@type": "HowToStep", "name": "Extract the Frames", "text": "Click “Extract Frames Now” — one frame per interval is captured locally in your browser." },
        { "@type": "HowToStep", "name": "Download the ZIP", "text": "Preview the evenly spaced stills and download them all as a single ZIP archive." }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => { const el = document.getElementById(scriptId); if (el) el.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('extractEveryN.title', interp)}
        description={t('extractEveryN.description', interp)}
        canonical={url}
        ogTitle={t('extractEveryN.title', interp)}
        ogDescription={t('extractEveryN.description', interp)}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('extractEveryN.keywords', interp)}
      />

      <Breadcrumb items={[{ label: `Every ${seconds} Second${plural}`, path: `/${slug}` }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('extractEveryN.h1', interp)}<br />
          <span className="text-cyan-400">{t('extractEveryN.h1Sub', interp)}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('extractEveryN.hero', interp)}
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['🔒 100% Private', '⏱️ Fixed Time Interval', '🖼️ JPG / PNG / WebP', '📦 ZIP Download', '🚫 No Watermark', '🆓 Free Forever'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">{badge}</span>
          ))}
        </div>
      </section>

      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToImages initialIntervalSeconds={seconds} />
      </div>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Why Extract One Frame Every {seconds} Second{plural}?</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 leading-relaxed">
            {detail.whyIntro}
          </p>
          <ul className="space-y-3 text-gray-300 list-disc pl-6">
            {detail.whyBullets.map(b => (
              <li key={b.title}><strong className="text-white">{b.title}</strong> — {b.text}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">How to Extract a Frame Every {seconds} Second{plural} Online</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload your video file', desc: 'Drag and drop or click to select your MP4, MOV, or WEBM video.' },
              { num: '2', title: 'Confirm the interval', desc: `“Every N Seconds” mode is preselected at every ${seconds} second${plural} — or pick 1, 5, 10, 30 seconds, or type a custom value up to 3600.` },
              { num: '3', title: 'Choose JPG, PNG, or WebP', desc: 'JPG for small files, PNG for lossless quality, WebP for efficient web images.' },
              { num: '4', title: 'Extract the frames', desc: 'Click “Extract Frames Now” — one frame per interval is captured locally in your browser.' },
              { num: '5', title: 'Download your stills', desc: 'Preview the evenly spaced frames and download them all as a single ZIP file.' },
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
          <p className="mt-6 text-sm text-cyan-300/90 bg-cyan-950/30 border border-cyan-900/50 rounded-xl px-4 py-3">
            {detail.howToTip}
          </p>
        </div>
      </section>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Supported Video Formats</h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          {detail.formatsNote}
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
            {detail.noticeText}
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Other Extraction Intervals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {OTHER_CADENCES.filter(s => s !== seconds).map(s => (
            <Link key={s} to={`/${slugFor(s)}`} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
              <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Every {s} Second{s === 1 ? '' : 's'}</h3>
              <p className="text-gray-500 text-xs">Extract one frame every {s} second{s === 1 ? '' : 's'} from video.</p>
            </Link>
          ))}
          <Link to="/extract-frames-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">FPS Extraction</h3>
            <p className="text-gray-500 text-xs">Extract frames by frames-per-second instead.</p>
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

export default ExtractFrameEveryNSeconds;
