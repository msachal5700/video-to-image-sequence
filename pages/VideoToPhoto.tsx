import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I convert a video to a photo online?',
    a: 'Drop your video into the converter above, let it build a preview grid of frames, click the moment you want to keep, and download it as a JPG or PNG photo. Your video is processed locally in the browser — nothing is uploaded to any server.'
  },
  {
    q: 'Is this better than taking a screenshot of a video?',
    a: 'For quality, yes. A screenshot is capped at your screen resolution and often includes player buttons or black bars. This tool pulls the frame straight from the video file at its native resolution — up to 4K — with no player chrome in the image.'
  },
  {
    q: 'How is this different from iPhone\u2019s \u201CSave Video Frame as Photo\u201D?',
    a: 'Apple\u2019s feature (introduced in iOS 27) saves one frame at a time and only works on iPhone. This tool works on iPhone, Android, and desktop, and you can save as many stills from a video as you like — then download them individually or all together as a ZIP.'
  },
  {
    q: 'What format will my photo be \u2014 JPG, PNG, or HEIF?',
    a: 'JPG by default, which opens everywhere including iPhone Photos and is small enough to share. Choose PNG when you need lossless quality. HEIF is not produced in the browser; if you need HEIF, convert the downloaded JPG afterward.'
  },
  {
    q: 'Will the photo be full quality?',
    a: 'Yes. The photo is rendered from the video frame at the source video\u2019s native resolution — sharper than any screenshot, because screenshots are limited by your display. A 4K video frame becomes a genuine 4K photo.'
  },
  {
    q: 'Does it work on iPhone and Android?',
    a: 'Yes. The whole tool runs in your mobile browser — no app to install, no account to create. Open the page, choose a video from your camera roll or files, and save the frame as a photo.'
  },
  {
    q: 'Is my video uploaded to a server?',
    a: 'No. Everything runs locally in your browser using modern web video decoders. The file never leaves your device, which also means there is no upload wait and no size queue on our side — the only limits are your device\u2019s memory and your browser\u2019s codec support.'
  },
  {
    q: 'Can I save multiple photos from one video?',
    a: 'Yes. Extract frames at your chosen interval, browse the grid, and keep every photo-worthy moment you find. Download each photo individually or grab the whole set as a single ZIP archive.'
  }
];

const VideoToPhoto: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('video-to-photo-schemas');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-to-photo-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Video to Photo Converter — Save Any Frame as a Photo",
      "url": "https://www.videotoimagesequence.online/video-to-photo",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Convert video to photo free — save any frame as a JPG or PNG photo in your browser. No upload, no signup, full quality. Works on iPhone, Android & desktop.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video to Photo Converter",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5, WebAssembly and Javascript support",
      "featureList": [
        "Save any video frame as a JPG or PNG photo",
        "Full native video resolution — up to 4K stills",
        "Works on iPhone, Android, and desktop browsers",
        "100% browser-based — videos never leave your device",
        "Download single photos or the whole set as a ZIP"
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
      "name": "How to Convert a Video to a Photo Online",
      "description": "Save any frame of an MP4, MOV, or WEBM video as a full-quality JPG or PNG photo, free in your browser.",
      "totalTime": "PT1M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Drop in your video",
          "text": "Add an MP4, MOV, or WEBM file — it is decoded locally in your browser and never uploaded."
        },
        {
          "@type": "HowToStep",
          "name": "Pick the moment",
          "text": "Browse the extracted frame grid and find the exact photo-worthy instant."
        },
        {
          "@type": "HowToStep",
          "name": "Save the photo",
          "text": "Download the frame as a JPG or PNG at full native resolution, or ZIP the whole set."
        }
      ]
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.videotoimagesequence.online/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Video to Photo Converter",
          "item": "https://www.videotoimagesequence.online/video-to-photo"
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

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema, breadcrumbSchema, orgSchema]);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('video-to-photo-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('videoToPhoto.title')}
        description={t('videoToPhoto.description')}
        canonical="https://www.videotoimagesequence.online/video-to-photo"
        ogTitle={t('videoToPhoto.title')}
        ogDescription={t('videoToPhoto.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoToPhoto.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Video to Photo', path: '/video-to-photo' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoToPhoto.h1')}<br />
          <span className="text-cyan-400">{t('videoToPhoto.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoToPhoto.hero')}
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

      {/* ── INTENT DISAMBIGUATION CROSS-LINK ── */}
      <section className="max-w-4xl mx-auto px-4 mt-2">
        <p className="text-center text-sm text-gray-500">
          Need a quick screen capture instead? Try our{' '}
          <Link to="/screenshot-from-video" className="text-cyan-400 hover:underline">
            screenshot-from-video tool
          </Link>
          .
        </p>
      </section>

      {/* ── WHY VIDEO TO PHOTO ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Your Videos Are Full of Photos You Never Took
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Every video you shoot is a burst of still photographs hiding inside a timeline. The laugh mid-sentence, the wave frozen at its peak, the landscape panning past at golden hour — moments you would never have thought to photograph, but your camera captured anyway. Converting video to photo simply reaches into that timeline and pulls the stills back out.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          Apple clearly agrees with the idea: iOS 27 added a built-in &ldquo;Save Video Frame as Photo&rdquo; option. But the built-in route saves one frame at a time and only exists on iPhone. This converter does the same job on any device — iPhone, Android, or desktop — and lets you save as many stills from a video as you want, at the video&rsquo;s full native resolution, without installing anything.
        </p>
        <p className="text-gray-400 leading-relaxed">
          And unlike cloud converters that make you upload personal footage to someone else&rsquo;s server, everything here runs inside your browser. Your home videos, your kids, your unreleased work — none of it ever leaves your device.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Convert Video to Photo in 3 Steps
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Drop in your video', desc: 'Add an MP4, MOV, or WEBM file from your phone or computer. It is decoded locally — nothing is uploaded.' },
              { num: '2', title: 'Pick the moment', desc: 'Browse the extracted frame grid and find the exact instant worth keeping. Scrub through as many frames as you need.' },
              { num: '3', title: 'Save the photo', desc: 'Download the frame as a JPG or PNG at full native resolution — or ZIP the whole set of keepers at once.' },
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

      {/* ── WHY NOT JUST SCREENSHOT ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Why Not Just Screenshot the Video?
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          You can — but the photo you get will be worse in two ways that matter. First, a screenshot is capped at your <strong className="text-white">screen</strong> resolution, not your video&rsquo;s. A 4K video frame paused on a 1080p phone display becomes a 1080p screenshot; this tool saves the actual 4K frame. Second, screenshots capture whatever is on screen: play buttons, progress bars, subtitles, black letterbox bars. A converted photo is the clean frame itself, nothing else.
        </p>
        <p className="text-gray-400 leading-relaxed">
          There is one more practical difference: precision. Pausing a player at the exact right millisecond is fiddly. The converter lays the video out as a grid of stills, so you can compare neighboring moments side by side and pick the sharpest one — the frame where eyes are open, motion is frozen, and nobody is mid-blink.
        </p>
      </section>

      {/* ── iOS 27 COMPARISON ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          iPhone&rsquo;s &ldquo;Save Video Frame as Photo&rdquo; vs This Tool
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          Since iOS 27, iPhone owners can long-press a video and save a single frame to Photos. It is convenient — and it is also the narrowest possible version of the idea. Here is an honest comparison so you can pick the right tool for the job:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-500 font-medium"></th>
                <th className="text-left py-3 px-4 text-white font-semibold">iOS 27 built-in</th>
                <th className="text-left py-3 px-4 text-white font-semibold">This converter</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              <tr className="border-b border-gray-800/60">
                <td className="py-3 px-4 text-white font-medium">Devices</td>
                <td className="py-3 px-4">iPhone only</td>
                <td className="py-3 px-4">iPhone, Android, desktop — any modern browser</td>
              </tr>
              <tr className="border-b border-gray-800/60">
                <td className="py-3 px-4 text-white font-medium">Frames per video</td>
                <td className="py-3 px-4">One at a time</td>
                <td className="py-3 px-4">As many as you want; browse a whole grid</td>
              </tr>
              <tr className="border-b border-gray-800/60">
                <td className="py-3 px-4 text-white font-medium">Output format</td>
                <td className="py-3 px-4">HEIF / JPG into Photos</td>
                <td className="py-3 px-4">JPG (default) or PNG, downloaded as files or ZIP</td>
              </tr>
              <tr className="border-b border-gray-800/60">
                <td className="py-3 px-4 text-white font-medium">Batch download</td>
                <td className="py-3 px-4">No — repeat per frame</td>
                <td className="py-3 px-4">Yes — one ZIP with every keeper</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white font-medium">Privacy</td>
                <td className="py-3 px-4">On-device (Apple)</td>
                <td className="py-3 px-4">On-device (your browser) — nothing uploaded</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed mt-4">
          Bottom line: if you need one quick still on your iPhone, the built-in option is fine. If you want several photos, work on Android or desktop, or keep full control over format and resolution, use the converter above.
        </p>
      </section>

      {/* ── TIPS FOR THE PERFECT STILL ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Tips for the Perfect Still
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Start with the best source</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A photo can only be as sharp as the video it comes from. 4K footage yields genuinely printable stills; a heavily compressed chat-app video will look soft no matter what you do. When it matters, transfer the original camera file, not the recompressed copy.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Freeze the motion, not the blur</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Fast action shot at a slow shutter speed bakes motion blur into every frame. If your video looks smeary when paused, no extractor can fix it — pick a moment where the subject is relatively still, or shoot the next one with a faster shutter.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Compare neighbors before you commit</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The frame grid is your friend: the difference between a keeper and a throwaway is often one frame — eyes open versus mid-blink. Extract at a higher rate around the moment you care about, then pick the sharpest of the bunch.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Choose JPG for sharing, PNG for editing</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              JPG photos are small and open everywhere — ideal for messaging, social posts, and thumbnails. PNG keeps every pixel intact for prints or further editing, at the cost of much larger files.
            </p>
          </div>
        </div>
      </section>

      {/* ── BROWSER NOTICE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">
            Browser Processing Notice
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support. If you are saving many photos from a long 4K video and the tab slows down, extract from a shorter segment instead.
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
            <h3 className="text-white font-semibold mb-2">First frames are black</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Many videos open with a fade from black, so the earliest frames are genuinely black images. Skip past the first second or two of the grid — your photo-worthy moments are further in.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Video won&rsquo;t load</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The tool relies on your browser&rsquo;s built-in video decoders. MP4, MOV, and WEBM work almost everywhere; AVI or MKV files may fail if the browser doesn&rsquo;t support their codec. Re-exporting to MP4 (H.264) fixes nearly every case.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Photo looks washed out</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Modern phones record in HDR, but JPG and PNG are standard-dynamic-range formats — bright highlights can look flat after conversion. This is a format limitation, not a bug; the same thing happens when any software exports an HDR frame as a still.
            </p>
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS (INTERNAL LINKING) ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Photo &amp; Frame Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/screenshot-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Screenshot from Video</h3>
            <p className="text-gray-500 text-xs">Quick screen-capture style frame grabs.</p>
          </Link>
          <Link to="/video-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to Frames</h3>
            <p className="text-gray-500 text-xs">Need every frame, not just one photo?</p>
          </Link>
          <Link to="/extract-frame-at-timestamp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Frame at Timestamp</h3>
            <p className="text-gray-500 text-xs">Grab the photo at an exact second.</p>
          </Link>
          <Link to="/video-contact-sheet" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video Contact Sheet</h3>
            <p className="text-gray-500 text-xs">Lay out your best stills in a printable grid.</p>
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

export default VideoToPhoto;
