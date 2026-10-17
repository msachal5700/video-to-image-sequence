import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VideoMetadataInspectorTool from '../components/VideoMetadataInspectorTool';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';

const faqs = [
  {
    q: 'How do I check the codec of a video file online?',
    a: 'Open the inspector above and drop in the video file. It reads the file header in your browser and reports the exact video codec (for example H.264, H.265/HEVC, VP9, or AV1) and audio codec (AAC, Opus, AC-3, and more) — no upload, no signup, and the file never leaves your device. This is the fastest way to answer "why won\'t this video play" or "what settings was this exported with."'
  },
  {
    q: 'Can I see video metadata without uploading the file?',
    a: 'Yes — that is the whole point of this tool. Instead of sending your video to a server, it reads only the first couple of megabytes of the file (the header, where MP4 and WebM files store their metadata) directly on your device. Even a 2 GB export is inspected in seconds because the tool never loads the full file into memory. Nothing is uploaded anywhere, so client footage and unreleased edits stay private.'
  },
  {
    q: 'What is the difference between container and codec?',
    a: 'The container is the file\'s wrapper — MP4, MOV, WebM, or MKV — and it decides which players and platforms accept the file. The codec is the compression method used inside that wrapper — H.264, HEVC, VP9, AV1 for video; AAC or Opus for audio. An MP4 file can hold H.264 or HEVC video, which is why "it\'s an MP4" sometimes still won\'t play somewhere: the container is fine, but the device doesn\'t support the codec inside it. The inspector shows you both, so you know exactly what you\'re dealing with.'
  },
  {
    q: 'Why does my video show the wrong creation date?',
    a: 'Creation dates come from a timestamp written into the file header at export time — and many apps overwrite it, strip it, or never write it. Re-encoding a video, passing it through a messaging app, or downloading it from a platform usually replaces the original date with "now" or removes it entirely. Treat the creation date as a clue, not a fact: if the field is missing, the file was almost certainly re-encoded or processed after it was shot.'
  },
  {
    q: 'How accurate is the frame rate shown here?',
    a: 'The frame rate is computed from the file\'s sample table — the total number of frames divided by the total playback time — so it is the true average. Most camera footage and exports use a constant frame rate, in which case the average equals the actual frame rate exactly. Screen recordings and phone videos sometimes use a variable frame rate, where individual frames arrive faster or slower; the average still tells you the effective playback rate, which is what matters for editing and conversion decisions.'
  },
  {
    q: 'Is the Video Metadata Inspector free? Do I need an account?',
    a: 'Completely free, no account, no signup, no watermark, no file-size games. Drop in any video and read its full metadata in seconds. Everything runs locally in your browser — there is no server to pay for and no queue to wait in, which is exactly why it can stay free.'
  }
];

const VideoMetadataInspector: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('video-metadata-inspector-schemas');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-metadata-inspector-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Video Metadata Inspector — Free Online Codec & File Analyzer",
      "url": "https://www.videotoimagesequence.online/video-metadata-inspector",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Read video metadata free in your browser — container, codec, resolution, FPS, bitrate, and creation date revealed without uploading. No signup, fully private.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Video Metadata Analyzer",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5 video support",
      "featureList": [
        "Read container format, brand, and file structure from the file header",
        "Detect exact video codec (H.264, HEVC, VP9, AV1) and audio codec (AAC, Opus, AC-3)",
        "Show resolution, frame rate, duration, and overall bitrate",
        "Reveal creation date, muxing app, and per-stream track details",
        "Per-field copy buttons plus one-click copy-all as JSON",
        "Incremental parsing — reads only the file head, never the whole file"
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
      "name": "How to Inspect a Video File's Metadata",
      "description": "Read a video file's codec, container, resolution, frame rate, and bitrate in seconds — free, in your browser, without uploading anything.",
      "totalTime": "PT1M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Drop in the video file",
          "text": "Drag and drop an MP4, MOV, WebM, or MKV file. It is read locally — nothing is uploaded."
        },
        {
          "@type": "HowToStep",
          "name": "Let the tool read the header",
          "text": "The inspector parses the file's metadata boxes incrementally, reading only the header instead of loading the whole file."
        },
        {
          "@type": "HowToStep",
          "name": "Read the metadata table",
          "text": "Container, codecs, resolution, frame rate, duration, bitrate, and creation date appear in a clean readout."
        },
        {
          "@type": "HowToStep",
          "name": "Copy what you need",
          "text": "Copy any single field, or grab the entire report as JSON for your editor, script, or documentation."
        }
      ]
    };

    script.text = JSON.stringify({ "@context": "https://schema.org", "@graph": [webAppSchema, faqSchema, howToSchema] });
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('video-metadata-inspector-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('videoMetadataInspector.title')}
        description={t('videoMetadataInspector.description')}
        canonical="https://www.videotoimagesequence.online/video-metadata-inspector"
        ogTitle={t('videoMetadataInspector.title')}
        ogDescription={t('videoMetadataInspector.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoMetadataInspector.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Video Metadata Inspector', path: '/video-metadata-inspector' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoMetadataInspector.h1')}<br />
          <span className="text-cyan-400">{t('videoMetadataInspector.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoMetadataInspector.hero')}
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
        <VideoMetadataInspectorTool />
      </div>

      {/* ── WHAT IS IT ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          What Video Metadata Actually Tells You
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Every video file carries a hidden dossier about itself. Beyond the picture and sound, the file header records the <strong className="text-white">container format</strong> (MP4, MOV, WebM…), the <strong className="text-white">video and audio codecs</strong> (H.264, HEVC, VP9, AAC, Opus…), the <strong className="text-white">resolution, frame rate, and bitrate</strong>, and often a <strong className="text-white">creation date</strong> plus the app that wrote the file. This metadata decides whether a video plays on a given device, how big it is, and how it should be handled in an edit.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Most people meet metadata only when something goes wrong: a client sends "an MP4" that won't import into Premiere, a phone recording uploads to YouTube looking soft, a "4K" export turns out to be 1080p upscaled. Reading the metadata first turns guesswork into a five-second check. Editors use it to verify deliverables match spec; developers use it to debug playback failures; archivists use it to catalog footage without opening every file. The inspector reads it all <strong className="text-white">without uploading anything</strong> — parsing happens on your device, from just the file's header.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Inspect a Video File's Metadata
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Drop in the video file', desc: 'Drag and drop an MP4, MOV, WebM, MKV, or 3GP file. It never leaves your device — parsing is 100% local.' },
              { num: '2', title: 'Wait a second', desc: 'The tool reads only the file header (a couple of megabytes), so even multi-gigabyte exports inspect almost instantly.' },
              { num: '3', title: 'Read the metadata table', desc: 'Container, codecs, resolution, frame rate, duration, bitrate, and creation date appear in a clean, labeled readout — plus per-stream details.' },
              { num: '4', title: 'Copy what you need', desc: 'Each field has its own copy button. Building documentation or debugging a pipeline? Hit "Copy all as JSON" for the full report.' },
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

      {/* ── FIELD GUIDE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Every Field, Explained
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Container &amp; brand</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The wrapper around the streams — MP4, QuickTime MOV, WebM, Matroska. The "major brand" (isom, mp42, qt…) tells you which flavor of the spec the file claims, which matters when a picky player rejects an otherwise fine file.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Video &amp; audio codec</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The actual compression inside the wrapper. H.264 plays everywhere; HEVC halves file sizes but needs newer hardware; VP9 and AV1 are the web's royalty-free workhorses. If a video won't play, the codec — not the extension — is usually the culprit.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Resolution &amp; frame rate</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The pixel dimensions of the encoded picture and the average frames per second from the sample table. Resolution confirms what you were actually delivered (not what the filename claims); frame rate matters for slow-motion, conversion, and matching sequence settings in your editor.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Bitrate &amp; duration</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Overall bitrate is file size divided by duration — a quick quality sanity check. A "4K" file at 2 Mbps will look worse than a 1080p file at 12 Mbps. Comparing bitrate against the resolution instantly reveals over-compressed exports.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Creation date</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The timestamp written into the header at export time. Useful for organizing footage — but treat it as a clue, not gospel: re-encoding, messaging apps, and platform downloads routinely rewrite or strip it.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Streams</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A file can hold multiple tracks: one video stream, several audio languages, even subtitle tracks. The stream list shows each track's type, codec tag, and dimensions — the detail you need when a file "has no audio" but actually has five silent tracks.
            </p>
          </div>
        </div>
      </section>

      {/* ── TIPS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Tips for Reading Metadata Like a Pro
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-white">Check the codec before the container.</strong> When a video fails to import or play, almost everyone re-checks the file extension first. Skip that: the codec line is the real answer. H.264 in an MP4 plays on a toaster; HEVC in the same MP4 needs a modern device; AV1 in WebM needs a current browser. The inspector puts this front and center so you stop chasing the wrong suspect.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-white">Use bitrate to smell a bad export.</strong> Resolution lies; bitrate doesn't. If someone hands you "4K masters" at 3 Mbps, the metadata exposes them in one glance — genuine 4K needs roughly 35–80 Mbps depending on codec. For quick triage, divide the bitrate by the pixel count: anything under ~0.1 bits per pixel per frame deserves a closer look.
        </p>
        <p className="text-gray-400 leading-relaxed">
          <strong className="text-white">Verify deliverables with the JSON export.</strong> If you receive video files regularly — from freelancers, clients, or a camera team — paste the JSON export into your delivery checklist or ticket. It documents exactly what arrived, which ends the "but I sent you 4K" debate permanently. Pair it with the <Link to="/video-to-frames" className="text-cyan-400 hover:underline">frame extractor</Link> to spot-check the actual picture quality too.
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
            <h3 className="text-white font-semibold mb-1">Video to Frames</h3>
            <p className="text-gray-500 text-sm">Checked the metadata — now pull the actual frames as an image sequence.</p>
          </Link>
          <Link to="/video-contact-sheet" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-700 transition block">
            <h3 className="text-white font-semibold mb-1">Video Contact Sheet</h3>
            <p className="text-gray-500 text-sm">Generate a visual overview grid to pair with your metadata report.</p>
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

export default VideoMetadataInspector;
