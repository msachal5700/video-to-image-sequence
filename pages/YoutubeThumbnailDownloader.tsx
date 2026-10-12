import React, { useEffect, useState } from 'react';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I download a YouTube thumbnail?',
    a: 'Paste the YouTube video URL into the box above and click "Get Thumbnails". The tool extracts the video ID and shows every thumbnail resolution YouTube generated for that video — from full HD (1280×720) down to the small default. Click "Download" under the size you want and the image saves straight to your device.'
  },
  {
    q: 'Is this YouTube thumbnail downloader free? Do I need an account?',
    a: 'Completely free, no account, no signup, no watermark. There is nothing to install either — it runs entirely in your browser. Paste a link, preview the thumbnails, download the one you need.'
  },
  {
    q: 'What thumbnail resolutions can I download?',
    a: 'YouTube generates up to five sizes per video: maxresdefault (1280×720 HD), sddefault (640×480), hqdefault (480×360), mqdefault (320×180), and default (120×90). This tool lists all five with live previews so you can see exactly what is available before downloading.'
  },
  {
    q: 'Why is the HD (1280×720) thumbnail missing for some videos?',
    a: 'YouTube only creates the max-resolution thumbnail when the source video was uploaded in HD quality. Older uploads, low-resolution videos, and some Shorts never got an HD thumbnail generated — for those, the highest available size is usually hqdefault (480×360) or sddefault (640×480). This is a YouTube limitation, not a tool bug; the downloader shows you honestly what exists.'
  },
  {
    q: 'Can I download thumbnails from YouTube Shorts?',
    a: 'Yes. Paste the Shorts URL (youtube.com/shorts/VIDEO_ID) the same way — the tool reads the video ID from Shorts, watch, youtu.be, embed, and live URLs alike, then shows the available thumbnails.'
  },
  {
    q: 'Does this download the YouTube video itself?',
    a: 'No — and that is deliberate. This tool downloads only the thumbnail image, which YouTube serves publicly for every video. It cannot download, convert, or save video or audio content.'
  },
  {
    q: 'Is it legal to download YouTube thumbnails?',
    a: 'Thumbnails are publicly served images, and downloading one for personal reference, competitive research, or recovering the thumbnail of your own video is normal use. What you should not do is re-upload someone else\u2019s thumbnail as your own — that artwork belongs to the creator. If you need a thumbnail for your own video, consider making one from your footage with our frame extractor instead.'
  },
  {
    q: 'Do you store the URLs I paste or track what I download?',
    a: 'No. The video ID is parsed locally in your browser and the thumbnail images load directly from YouTube\u2019s image servers. Nothing you paste is uploaded, stored, or logged on our side.'
  }
];

const RESOLUTIONS = [
  { key: 'maxresdefault', label: 'Full HD', dims: '1280 × 720' },
  { key: 'sddefault', label: 'SD', dims: '640 × 480' },
  { key: 'hqdefault', label: 'High Quality', dims: '480 × 360' },
  { key: 'mqdefault', label: 'Medium Quality', dims: '320 × 180' },
  { key: 'default', label: 'Default', dims: '120 × 90' },
];

function parseVideoId(input: string): string | null {
  const url = input.trim();
  if (!url) return null;
  // Bare 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtube\.com\/v\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/|youtu\.be\/|youtube\.com\/attribution_link\?.*u=\/watch%3Fv%3D)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*[?&]v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

const YoutubeThumbnailDownloader: React.FC = () => {
  const { t } = useTranslation();
  const [urlInput, setUrlInput] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    const existing = document.getElementById('youtube-thumbnail-downloader-schemas');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'youtube-thumbnail-downloader-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "YouTube Thumbnail Downloader — Save Any Thumbnail in HD",
      "url": "https://www.videotoimagesequence.online/youtube-thumbnail-downloader",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Download any YouTube thumbnail in HD free — paste the video URL, preview every resolution, save the image. No signup, no watermark.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "YouTube Thumbnail Downloader",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5 and Javascript support",
      "featureList": [
        "Download YouTube thumbnails in up to 1280×720 HD",
        "Works with watch, youtu.be, Shorts, embed, and live URLs",
        "Live preview of every available resolution",
        "100% browser-based — nothing uploaded or stored",
        "Free forever, no account, no watermark"
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
      "name": "How to Download a YouTube Thumbnail",
      "description": "Save the thumbnail image of any YouTube video in HD, free in your browser.",
      "totalTime": "PT30S",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Paste the video URL",
          "text": "Copy the YouTube link — watch, youtu.be, Shorts, embed, or live URL — and paste it into the box."
        },
        {
          "@type": "HowToStep",
          "name": "Preview the resolutions",
          "text": "The tool extracts the video ID and shows every thumbnail size YouTube generated, from 1280×720 HD down."
        },
        {
          "@type": "HowToStep",
          "name": "Download the image",
          "text": "Click Download under the resolution you want. The JPG saves directly to your device."
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
          "name": "YouTube Thumbnail Downloader",
          "item": "https://www.videotoimagesequence.online/youtube-thumbnail-downloader"
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
      const el = document.getElementById('youtube-thumbnail-downloader-schemas');
      if (el) el.remove();
    };
  }, []);

  const handleFetch = () => {
    const id = parseVideoId(urlInput);
    if (!id) {
      setError('That doesn\u2019t look like a YouTube URL. Paste a full link (youtube.com/watch?v=…, youtu.be/…, or youtube.com/shorts/…) or just the 11-character video ID.');
      setVideoId(null);
      return;
    }
    setError('');
    setVideoId(id);
  };

  const handleDownload = async (resKey: string) => {
    if (!videoId) return;
    const src = `https://i.ytimg.com/vi/${videoId}/${resKey}.jpg`;
    setDownloading(resKey);
    try {
      const resp = await fetch(src, { mode: 'cors' });
      if (!resp.ok) throw new Error('fetch failed');
      const blob = await resp.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      a.download = `youtube-thumbnail-${videoId}-${resKey}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objUrl), 5000);
    } catch {
      // Fallback: open the image in a new tab so the user can save it manually
      window.open(src, '_blank', 'noopener');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('youtubeThumbnailDownloader.title')}
        description={t('youtubeThumbnailDownloader.description')}
        canonical="https://www.videotoimagesequence.online/youtube-thumbnail-downloader"
        ogTitle={t('youtubeThumbnailDownloader.title')}
        ogDescription={t('youtubeThumbnailDownloader.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('youtubeThumbnailDownloader.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'YouTube Thumbnail Downloader', path: '/youtube-thumbnail-downloader' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('youtubeThumbnailDownloader.h1')}<br />
          <span className="text-cyan-400">{t('youtubeThumbnailDownloader.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('youtubeThumbnailDownloader.hero')}
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

      {/* ── TOOL WIDGET ── */}
      <section className="max-w-3xl mx-auto px-4 mb-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
          <label htmlFor="yt-url" className="block text-white font-semibold mb-3">
            Paste a YouTube video URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="yt-url"
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleFetch(); }}
              placeholder="https://www.youtube.com/watch?v=…  or  https://youtu.be/…"
              className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition"
            />
            <button
              onClick={handleFetch}
              className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold px-6 py-3 rounded-xl transition whitespace-nowrap"
            >
              Get Thumbnails
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-3">{error}</p>
          )}
          <p className="text-gray-600 text-xs mt-3">
            Works with youtube.com/watch, youtu.be, /shorts/, /embed/, /live/ links — or paste just the 11-character video ID.
          </p>
        </div>

        {videoId && (
          <div className="mt-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-4 font-display">
              Available thumbnails
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RESOLUTIONS.map((r) => (
                <div key={r.key} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="aspect-video bg-gray-950 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
                    <img
                      src={`https://i.ytimg.com/vi/${videoId}/${r.key}.jpg`}
                      alt={`YouTube thumbnail ${r.label} ${r.dims}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        // maxresdefault 404s on videos without an HD thumbnail — hide the broken tile honestly
                        (e.target as HTMLImageElement).closest('div')!.parentElement!.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">{r.label}</p>
                      <p className="text-gray-500 text-xs">{r.dims} · JPG</p>
                    </div>
                    <button
                      onClick={() => handleDownload(r.key)}
                      disabled={downloading === r.key}
                      className="bg-cyan-500/15 border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500/30 font-semibold text-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
                    >
                      {downloading === r.key ? 'Saving…' : 'Download'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-4">
              If the Full HD tile is missing, YouTube never generated a 1280×720 thumbnail for this video — the largest size shown is the best available.
            </p>
          </div>
        )}
      </section>

      {/* ── INTENT DISAMBIGUATION CROSS-LINK ── */}
      <section className="max-w-4xl mx-auto px-4 mt-2">
        <p className="text-center text-sm text-gray-500">
          Want to <em>make</em> a thumbnail from your own video instead? Try our{' '}
          <Link to="/video-frame-for-youtube-thumbnail" className="text-cyan-400 hover:underline">
            frame extractor for YouTube thumbnails
          </Link>
          .
        </p>
      </section>

      {/* ── WHY DOWNLOAD THUMBNAILS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Why Would You Download a YouTube Thumbnail?
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          YouTube gives creators no &ldquo;download thumbnail&rdquo; button, yet the thumbnail is often the single most valuable image attached to a video. Creators download thumbnails to recover the artwork for a video they uploaded years ago, to study what top channels in their niche are doing, or to reuse a design as the starting point for the next one. Designers and marketers pull competitor thumbnails for mood boards and click-through-rate teardowns.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          The manual trick — guessing the <code className="text-cyan-300 bg-gray-900 px-1.5 py-0.5 rounded text-sm">img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg</code> URL — works, but only if you know the exact video ID format and only if that video actually has an HD thumbnail. Most people don&rsquo;t, and half the dedicated &ldquo;thumbnail downloader&rdquo; sites out there are thin pages wrapped around pop-up ads.
        </p>
        <p className="text-gray-400 leading-relaxed">
          This page does the honest version: paste any YouTube link, see every resolution YouTube actually generated for that video with live previews, and download exactly the size you need. No account, no ads-in-your-face, no mystery about what you&rsquo;re getting.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Download a YouTube Thumbnail in 3 Steps
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Paste the video URL', desc: 'Copy the link from YouTube — a watch page, a youtu.be short link, a Short, an embed, or a live stream URL all work. You can also paste just the 11-character video ID.' },
              { num: '2', title: 'Preview every resolution', desc: 'The tool pulls the video ID out of the link and shows all five thumbnail sizes YouTube generated, from 1280×720 HD down to the 120×90 default — each with a live preview.' },
              { num: '3', title: 'Download the size you need', desc: 'Hit Download under the resolution you want. The JPG saves directly to your device — no watermark, no signup, no waiting room.' },
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

      {/* ── RESOLUTION GUIDE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Which Thumbnail Size Should You Download?
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          YouTube generates up to five versions of every video&rsquo;s thumbnail. Bigger is not always better — pick the size that matches the job:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Size</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Dimensions</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Best for</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              <tr className="border-b border-gray-800/60">
                <td className="py-3 px-4 text-white font-medium">Full HD</td>
                <td className="py-3 px-4">1280 × 720</td>
                <td className="py-3 px-4">Reusing as a new thumbnail, print-quality reference, detailed analysis</td>
              </tr>
              <tr className="border-b border-gray-800/60">
                <td className="py-3 px-4 text-white font-medium">SD</td>
                <td className="py-3 px-4">640 × 480</td>
                <td className="py-3 px-4">Blog embeds and article headers where HD is overkill</td>
              </tr>
              <tr className="border-b border-gray-800/60">
                <td className="py-3 px-4 text-white font-medium">High Quality</td>
                <td className="py-3 px-4">480 × 360</td>
                <td className="py-3 px-4">Quick reference, thumbnails in documents and slides</td>
              </tr>
              <tr className="border-b border-gray-800/60">
                <td className="py-3 px-4 text-white font-medium">Medium / Default</td>
                <td className="py-3 px-4">320 × 180 / 120 × 90</td>
                <td className="py-3 px-4">Favicons, tiny previews, placeholder images</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed mt-4">
          Note: YouTube&rsquo;s recommended <em>upload</em> size for thumbnails is 1280×720 — but the generated <em>download</em> labeled &ldquo;Full HD&rdquo; is the closest public equivalent, and it only exists for videos uploaded in HD.
        </p>
      </section>

      {/* ── WHAT IT DOESN'T DO ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">
            What this tool does not do
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            This downloads the thumbnail <strong className="text-white">image only</strong>. It cannot download YouTube videos, extract audio, or bypass any restriction — and it never will. If a site offering &ldquo;thumbnail download&rdquo; also promises the full video, treat it with suspicion: that&rsquo;s a different, far shadier category of tool.
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
            <h3 className="text-white font-semibold mb-2">&ldquo;Doesn&rsquo;t look like a YouTube URL&rdquo; error</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Make sure you pasted the full link, not a search-results page or a channel URL. The tool needs a link that points at one specific video. When in doubt, paste just the 11-character video ID from the end of the URL.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">The HD thumbnail tile is blank</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              That video simply has no 1280×720 thumbnail on YouTube&rsquo;s servers — common for older uploads and low-resolution originals. Download the largest size that does preview; upscaling it yourself won&rsquo;t recover detail that was never there.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Download opens the image instead of saving it</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Some browsers block the direct-save path for cross-origin images. When that happens the tool opens the full-size image in a new tab instead — right-click (or long-press on mobile) and choose &ldquo;Save image&rdquo; to keep it.
            </p>
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS (INTERNAL LINKING) ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Thumbnail &amp; Frame Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/video-frame-for-youtube-thumbnail" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Make a Thumbnail from Video</h3>
            <p className="text-gray-500 text-xs">Extract the perfect frame for your own thumbnail.</p>
          </Link>
          <Link to="/video-to-photo" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to Photo</h3>
            <p className="text-gray-500 text-xs">Save any video frame as a full-quality photo.</p>
          </Link>
          <Link to="/screenshot-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Screenshot from Video</h3>
            <p className="text-gray-500 text-xs">Quick screen-capture style frame grabs.</p>
          </Link>
          <Link to="/ai-social-media-frame-picker" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">AI Frame Picker</h3>
            <p className="text-gray-500 text-xs">Let AI score your best thumbnail candidates.</p>
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

export default YoutubeThumbnailDownloader;
