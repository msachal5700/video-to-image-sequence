import React from 'react';
import VideoColorPaletteTool from '../components/VideoColorPaletteTool';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I extract a color palette from a video?',
    a: 'Drop your video into the extractor above and click "Extract Color Palette". The tool samples frames evenly across the full duration, analyzes the pixels with median-cut quantization, and returns the dominant colors as HEX and RGB swatches. Click any swatch to copy its HEX code, or export the whole palette as CSS variables, a text list, or a PNG strip.'
  },
  {
    q: 'Is my video uploaded to a server?',
    a: 'No. Everything runs locally in your browser — the video is decoded, sampled, and analyzed on your own device. Nothing is uploaded, which also means there is no queue, no file-size limit on our side, and your footage stays private. The only limits are your device\u2019s memory and your browser\u2019s codec support.'
  },
  {
    q: 'How accurate are the extracted colors?',
    a: 'The palette reflects the colors that actually dominate your footage, weighted by how many sampled pixels each color represents. Each swatch shows its share (for example "23% of sampled pixels"), so you can tell at a glance which colors define the video and which are accents. Sampling more frames gives a more representative result for long or varied videos.'
  },
  {
    q: 'Can I use these colors in Figma, Photoshop, or my code?',
    a: 'Yes. Click any swatch to copy its HEX code straight into Figma, Photoshop, Illustrator, or any design tool. The "Copy as CSS variables" button gives you a ready-to-paste :root block (e.g. --palette-1: #A1B2C3;) for stylesheets, and the text list works anywhere plain text does.'
  },
  {
    q: 'What video formats are supported?',
    a: 'MP4, MOV, and WEBM — anything your browser can decode natively. MP4 with H.264 works everywhere; HEVC/H.265 support depends on your device and browser. If a file will not load, re-exporting it as H.264 MP4 almost always fixes it.'
  },
  {
    q: 'Why do my palettes look similar, and how do I get more varied colors?',
    a: 'Similar palettes usually mean the footage itself has a consistent grade — which is useful information in its own right. For more variety, raise the "Palette colors" setting from 6 to 10 (finer shades get their own swatches) and sample more frames (16 or 24) so brief scenes contribute. Re-extracting is instant, so experimenting costs nothing.'
  }
];

const VideoColorPalette: React.FC = () => {
  const { t } = useTranslation();
  const webAppSchema = {
    "@type": "WebApplication",
    "name": "Video Color Palette Extractor — Free Online Tool",
    "url": "https://www.videotoimagesequence.online/video-color-palette",
    "image": "https://www.videotoimagesequence.online/og-image.png",
    "description": "Extract a color palette from any video free in your browser. Get dominant HEX/RGB swatches from MP4, MOV, or WEBM — no upload, no signup, no watermark.",
    "applicationCategory": "DesignApplication",
    "applicationSubCategory": "Video Color Palette Generator",
    "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
    "browserRequirements": "Requires HTML5 and Javascript support",
    "featureList": [
      "Extract dominant colors from any MP4, MOV, or WEBM video",
      "Median-cut quantization weighted by pixel share",
      "Click-to-copy HEX and RGB values",
      "Export as CSS variables, text list, or PNG strip",
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
    "name": "How to Extract a Color Palette from a Video",
    "description": "Get the dominant HEX and RGB colors from any MP4, MOV, or WEBM video, free in your browser.",
    "totalTime": "PT1M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Drop in your video",
        "text": "Add an MP4, MOV, or WEBM file — it is decoded locally in your browser and never uploaded."
      },
      {
        "@type": "HowToStep",
        "name": "Extract the palette",
        "text": "Choose how many frames to sample and how many colors you want, then run the extraction."
      },
      {
        "@type": "HowToStep",
        "name": "Copy or export",
        "text": "Click any swatch to copy its HEX code, or export the palette as CSS variables, a text list, or a PNG strip."
      }
    ]
  };

  const breadcrumbSchema = {
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
        "name": "Video Color Palette Extractor",
        "item": "https://www.videotoimagesequence.online/video-color-palette"
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
    "@graph": [webAppSchema, faqSchema, howToSchema, breadcrumbSchema, orgSchema]
  };

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <script type="application/ld+json">
        {JSON.stringify(pageSchemas)}
      </script>
      <SEOHead
        title={t('videoColorPalette.title')}
        description={t('videoColorPalette.description')}
        canonical="https://www.videotoimagesequence.online/video-color-palette"
        ogTitle={t('videoColorPalette.title')}
        ogDescription={t('videoColorPalette.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoColorPalette.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Video Color Palette', path: '/video-color-palette' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoColorPalette.h1')}<br />
          <span className="text-cyan-400">{t('videoColorPalette.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoColorPalette.hero')}
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
        <VideoColorPaletteTool />
      </div>

      {/* ── INTENT DISAMBIGUATION CROSS-LINK ── */}
      <section className="max-w-4xl mx-auto px-4 mt-2">
        <p className="text-center text-sm text-gray-500">
          Want the actual frames instead of just their colors? Try our{' '}
          <Link to="/video-to-frames" className="text-cyan-400 hover:underline">
            video to frames converter
          </Link>
          .
        </p>
      </section>

      {/* ── WHY EXTRACT A PALETTE FROM VIDEO ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Every Video Has a Color Story — Here Is How to Read It
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Designers have pulled color palettes from still images for years: drop a photo into a palette tool, get five swatches, build a brand around them. Video is a richer source for the same job, and it has been strangely hard to tap. A two-minute clip contains thousands of frames, each one a photograph with its own light, mood, and color relationships. Somewhere in that flood are the exact hues that make the footage feel the way it does — the teal-and-orange of a travel vlog, the muted sage of a wedding film, the neon bleed of a music video.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          Extracting a color palette from video automates the oldest trick in a colorist&rsquo;s book: squinting at the timeline until the dominant hues reveal themselves. Instead of scrubbing through footage and eyeballing it, you sample frames across the whole duration and let quantization math find the colors that actually dominate — weighted by how much screen time each one gets. The result is not a guess; it is a measurement.
        </p>
        <p className="text-gray-400 leading-relaxed">
          And because this extractor runs entirely in your browser, the footage never leaves your machine. Client work, unreleased cuts, personal projects — the colors come out, the video stays in.
        </p>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          How the Extraction Works
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Under the hood, the process has three stages. First, the tool seeks to evenly spaced timestamps across your video — skipping the very first and last instants, which are often black — and draws each frame to a small offscreen canvas. A 12-frame sample of a two-minute video effectively storyboards the whole clip.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          Second, every sampled pixel goes through <strong className="text-white">median-cut quantization</strong>, the classic algorithm behind tools like Photoshop&rsquo;s color tables. The full RGB color space is repeatedly split along its widest channel until the requested number of color boxes remains; each box&rsquo;s average becomes one palette swatch. Light pre-quantization keeps sensor noise from spawning near-duplicate swatches.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Third, the swatches are ranked by <strong className="text-white">share</strong> — the percentage of sampled pixels each color represents. The first swatch is genuinely the most dominant color in your footage, not just the most saturated one. That ranking is what turns a pile of colors into a usable hierarchy: foundation, support, accent.
        </p>
      </section>

      {/* ── USE CASES ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          What Designers Actually Do With Video Palettes
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Brand identity from footage</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              A client hands you a brand film and says &ldquo;make the website feel like this.&rdquo; Instead of guessing, extract the palette and build the site&rsquo;s color tokens from the footage itself. The CSS-variables export drops straight into a stylesheet, so the brand&rsquo;s motion identity and web identity share the same DNA.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">UI design from reference video</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Designing an app with a cinematic feel? Pull the palette from a film trailer or showreel in the genre you are targeting. The dominant colors become your surfaces; the low-share swatches become your accents and CTAs. It is mood-boarding with math.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Color grading reference</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Filmmakers and editors use extracted palettes as grading targets: sample a reference clip, note its five core hues, then match your own footage toward them in your color panel. Faster than describing &ldquo;that warm film look&rdquo; in words.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Event and wedding themes</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Planners pull palettes from venue walkthrough videos or inspiration reels to build decor, floral, and stationery schemes. A palette extracted from the actual venue footage beats one guessed from memory.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Thumbnail and cover design</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              YouTubers and marketers design thumbnails that pop against — or harmonize with — the video itself. Extract the palette first, then pick thumbnail text and shape colors from the accent swatches for contrast that is guaranteed to work with the footage.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Extract a Color Palette from Video in 3 Steps
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Drop in your video', desc: 'Add an MP4, MOV, or WEBM file. It is decoded locally — nothing is uploaded.' },
              { num: '2', title: 'Tune the extraction', desc: 'Choose how many frames to sample (8–24) and how many colors you want (6–10), then run it.' },
              { num: '3', title: 'Copy or export', desc: 'Click any swatch to copy its HEX, or export everything as CSS variables, a text list, or a PNG strip.' },
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

      {/* ── WORKING WITH THE PALETTE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Turning Swatches Into a Working Color Scheme
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          A palette is raw material, not a finished scheme. The classic <strong className="text-white">60-30-10 rule</strong> maps neatly onto the share percentages this tool reports: let the top one or two swatches (your 60%) carry backgrounds and large surfaces, the next two (30%) handle secondary elements, and reserve the smallest-share swatches (10%) for accents — buttons, links, highlights. Because the shares come from real pixel counts, the ratio is already tuned to the footage.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          Watch out for the two usual suspects in video-derived palettes: near-black and near-white. Letterbox bars, fade-ins, and overexposed skies inflate them. If your top swatches are #0A0A0A and #F5F5F5, that is the video telling you about its exposure, not its art direction — skip down to the first chromatic swatches for the real story.
        </p>
        <p className="text-gray-400 leading-relaxed">
          Finally, treat extracted palettes as <strong className="text-white">starting points for accessibility checks</strong>, not finished accessible schemes. Run your chosen pairs through a contrast checker before shipping — a beautiful cinematic palette can still fail WCAG on text, and it is cheaper to adjust a swatch now than to redesign later.
        </p>
      </section>

      {/* ── RELATED TOOLS (INTERNAL LINKING) ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Video Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/video-to-frames" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to Frames</h3>
            <p className="text-gray-500 text-xs">Extract every frame, not just the colors.</p>
          </Link>
          <Link to="/video-contact-sheet" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video Contact Sheet</h3>
            <p className="text-gray-500 text-xs">Storyboard your footage as a printable grid.</p>
          </Link>
          <Link to="/screenshot-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Screenshot from Video</h3>
            <p className="text-gray-500 text-xs">Grab a single clean still for closer color study.</p>
          </Link>
          <Link to="/video-to-photo" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to Photo</h3>
            <p className="text-gray-500 text-xs">Save the most colorful moment as a full-quality photo.</p>
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

export default VideoColorPalette;
