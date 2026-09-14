import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I extract a frame from video for a YouTube thumbnail?',
    a: 'Use the Exact Timestamp Extractor: upload your video, scrub to the most engaging moment (peak emotion, action, or visual), click "Capture Frame" at full resolution, choose PNG for editing or WebP for upload, and download. Crop to 1280×720 in your editor.'
  },
  {
    q: 'What resolution should I extract for YouTube thumbnails?',
    a: 'Extract at native video resolution (1080p or 4K) — far sharper than screen capture. YouTube displays thumbnails at 1280×720 but uses higher-res source for quality. Downscale in Photoshop/Canva after extraction.'
  },
  {
    q: 'Can I capture the exact peak moment for a thumbnail?',
    a: 'Yes. Use frame-by-frame step buttons (Previous/Next Frame) or enter HH:MM:SS.mmm timestamp to land on the exact frame. Capture at full resolution — no player UI, no compression artifacts.'
  },
  {
    q: 'Should I use PNG, WebP, or JPG for YouTube thumbnails?',
    a: 'PNG for editing (lossless, layers in Photoshop/Canva). WebP for direct upload (25–35% smaller than JPG, YouTube accepts WebP). JPG only if your editor requires it. Extract as PNG, convert on export.'
  },
  {
    q: 'What timestamp makes the best thumbnail?',
    a: 'Peak emotion (laugh, shock, awe), decisive action (jump, swing, click), or clear visual metaphor. Avoid motion blur — use frame-step to find the sharpest frame. High contrast, readable at small size.'
  },
  {
    q: 'Can I batch extract multiple thumbnail candidates?',
    a: 'Yes. Use the main Frame Extractor at 1–5 FPS to generate a grid of candidates, then browse and download the best 5–10 frames. Or use Exact Timestamp Extractor repeatedly for precise picks.'
  },
  {
    q: 'Does the tool work for Shorts thumbnails (vertical)?',
    a: 'Yes. Extract horizontal frame, then crop to 9:16 in your editor. Or record vertical video (1080×1920) and extract — frames keep native aspect. YouTube Shorts thumbnail: 1280×720 (same as regular) but vertical safe zone.'
  }
];

const VideoFrameForYoutubeThumbnail: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('video-frame-for-youtube-thumbnail-schemas');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-frame-for-youtube-thumbnail-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Extract Frame for YouTube Thumbnail — Perfect Still Free",
      "url": "https://www.videotoimagesequence.online/video-frame-for-youtube-thumbnail",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Extract the perfect frame for YouTube thumbnails free. Millisecond precision, frame-by-frame step, 4K native resolution, PNG/WebP/JPG. No server upload, 100% private. Works for Shorts too.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Thumbnail Creator",
      "operatingSystem": "All — Browser-based",
      "browserRequirements": "Requires HTML5 and Javascript support",
      "featureList": [
        "Exact timestamp capture (HH:MM:SS.mmm)",
        "Frame-by-frame step for sharpest frame",
        "4K native resolution extraction",
        "PNG (edit) / WebP (upload) / JPG formats",
        "100% private — no upload, local processing",
        "Works for YouTube, Shorts, Twitch, TikTok"
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
      "name": "How to Get the Perfect Thumbnail Frame from Video",
      "description": "Step-by-step: find peak moment → capture at 4K → edit in Canva/Photoshop → upload to YouTube.",
      "totalTime": "PT2M",
      "step": [
        { "@type": "HowToStep", "name": "Open Exact Timestamp Extractor", "text": "Go to the Exact Timestamp Extractor tool and load your video." },
        { "@type": "HowToStep", "name": "Find the Peak Moment", "text": "Scrub timeline or use frame-step buttons to locate the sharpest, most engaging frame." },
        { "@type": "HowToStep", "name": "Capture at Full Resolution", "text": "Click Capture Frame — extracts at native 1080p/4K, no player UI." },
        { "@type": "HowToStep", "name": "Download as PNG", "text": "Choose PNG for lossless editing in Canva/Photoshop." },
        { "@type": "HowToStep", "name": "Crop & Export for YouTube", "text": "Crop to 1280×720, add text/graphics, export as WebP/JPG, upload to YouTube Studio." }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => { const el = document.getElementById('video-frame-for-youtube-thumbnail-schemas'); if (el) el.remove(); };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="Extract Frame for YouTube Thumbnail — Perfect Still Free"
        description="Extract the perfect frame for YouTube thumbnails free. Millisecond precision, frame-by-frame step, 4K native resolution, PNG/WebP/JPG. No server upload, 100% private. Works for Shorts too."
        canonical="https://www.videotoimagesequence.online/video-frame-for-youtube-thumbnail"
        ogTitle="Extract Frame for YouTube Thumbnail — Perfect Still Free"
        ogDescription="Capture the exact peak moment from any video for YouTube thumbnails. 4K resolution, frame-by-frame precision, PNG/WebP. 100% private."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords="extract frame for youtube thumbnail, youtube thumbnail from video, video thumbnail generator, best frame for thumbnail, shorts thumbnail from video"
      />

      <Breadcrumb items={[
        { label: 'Use Cases', path: '/#use-cases' },
        { label: 'YouTube Thumbnails', path: '/video-frame-for-youtube-thumbnail' }
      ]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          Extract Frame for YouTube Thumbnail<br />
          <span className="text-cyan-400">Capture the Perfect Still Free</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Find the exact peak moment — emotion, action, visual hook. Capture at 4K native resolution with frame-by-frame precision. Edit in Canva/Photoshop, upload to YouTube Studio. 100% private, no upload.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['🎯 Millisecond Precision', '⏪ Frame-by-Frame Step', '🖥️ 4K Native Resolution', '🎨 PNG / WebP / JPG', '🔒 100% Private', '🆓 Free Forever'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">{badge}</span>
          ))}
        </div>
      </section>

      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToImages />
      </div>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Why Not Just Screenshot?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Full Native Resolution</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Print Screen caps at monitor resolution (often 1080p). This tool extracts at the video's native 1080p/4K — 2–4× sharper for crisp thumbnails.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Zero UI Contamination</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              No player controls, cursor, browser chrome, or timestamp overlay. Clean frame ready for text/graphics.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Frame-Accurate Selection</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pause a player → motion blur. Frame-step buttons → razor-sharp frame at the exact millisecond.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Thumbnail Frame Selection Checklist</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
          <p className="text-gray-400 leading-relaxed mb-4">Score each candidate frame (1–5) on these criteria:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-cyan-500" />
                <span className="text-white font-medium">Peak Emotion</span> <span className="text-gray-500 text-xs">(laugh, shock, awe, curiosity)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-cyan-500" />
                <span className="text-white font-medium">Decisive Action</span> <span className="text-gray-500 text-xs">(jump, click, swing, reveal)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-cyan-500" />
                <span className="text-white font-medium">Visual Metaphor</span> <span className="text-gray-500 text-xs">(represents video topic instantly)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-cyan-500" />
                <span className="text-white font-medium">High Contrast</span> <span className="text-gray-500 text-xs">(readable at 1280×720)</span>
              </label>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-cyan-500" />
                <span className="text-white font-medium">Sharp Focus</span> <span className="text-gray-500 textxs">(no motion blur — use frame-step)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-cyan-500" />
                <span className="text-white font-medium">Face/Eye Contact</span> <span className="text-gray-500 text-xs">(if person in frame)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-cyan-500" />
                <span className="text-white font-medium">Rule of Thirds</span> <span className="text-gray-500 text-xs">(subject off-center for text space)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-cyan-500" />
                <span className="text-white font-medium">Brand Consistency</span> <span className="text-gray-500 text-xs">(matches your thumbnail style)</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Workflow: Video → Thumbnail in 3 Minutes</h2>
        <div className="space-y-4">
          {[
            { step: '1', tool: 'Exact Timestamp Extractor', action: 'Load video → scrub to peak moment → frame-step to sharpest frame → Capture → Download PNG' },
            { step: '2', tool: 'Canva / Photoshop', action: 'Open PNG → Crop 1280×720 → Add text, arrows, circles, brand elements → Position per rule of thirds' },
            { step: '3', tool: 'YouTube Studio', action: 'Upload video → Custom thumbnail → Upload WebP/JPG → Save → Publish' },
          ].map(({ step, tool, action }) => (
            <div key={step} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/20 border border-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-xl">{step}</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">{tool}</h3>
                <p className="text-gray-400 text-sm">{action}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Format Choice for Thumbnails</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Stage</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium">Recommended Format</th>
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Extraction (this tool)</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG</td>
                <td className="px-5 py-3 text-gray-400">Lossless for editing, layers, color grading</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Editing (Canva/PS)</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG (working file)</td>
                <td className="px-5 py-3 text-gray-400">Preserves quality through edits</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Export for YouTube</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">WebP (preferred) or JPG</td>
                <td className="px-5 py-3 text-gray-400">WebP: 25–35% smaller, YouTube accepts. JPG: universal fallback.</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Shorts Thumbnail</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">Same pipeline</td>
                <td className="px-5 py-3 text-gray-400">Crop 9:16 in editor, export 1280×720</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">📱 YouTube Shorts Thumbnails</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Shorts thumbnails also use 1280×720 but vertical safe zone matters. Extract horizontal frame → crop 9:16 in editor → keep center subject in middle 60% → export 1280×720. YouTube auto-generates Shorts thumbnails from video frames — override with custom for CTR control.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">CTR Optimization Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">High Contrast = High CTR</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Dark subject on light bg (or vice versa). Test with grayscale filter — if readable, contrast works.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Text: 3 Words Max</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Large, bold, high-contrast font. Outline or shadow for readability on any bg.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Consistent Brand Style</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Same font, color palette, layout across videos. Viewers recognize you in feed.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/extract-frame-at-timestamp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Exact Timestamp Extractor</h3>
            <p className="text-gray-500 text-xs">Main tool for precise frame capture.</p>
          </Link>
          <Link to="/screenshot-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Screenshot from Video</h3>
            <p className="text-gray-500 text-xs">Batch extract → browse grid → pick best.</p>
          </Link>
          <Link to="/ai-social-media-frame-picker" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">AI Frame Picker</h3>
            <p className="text-gray-500 text-xs">Auto-scores frames for YouTube thumbnail quality.</p>
          </Link>
          <Link to="/video-to-webp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to WebP</h3>
            <p className="text-gray-500 text-xs">Export final thumbnail as WebP.</p>
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

export default VideoFrameForYoutubeThumbnail;