import React from 'react';
import SpriteSheetSlicerTool from '../components/SpriteSheetSlicerTool';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'What is a sprite sheet slicer?',
    a: 'A sprite sheet slicer (also called a sprite sheet splitter or cutter) takes one sprite sheet image — a grid of animation frames packed into a single PNG — and cuts it back into individual frame images. Game developers use it to extract frames from asset packs, edit single frames in an image editor, rebuild an animation at a different frame size, or feed the frames into another tool or engine.'
  },
  {
    q: 'How do I split a sprite sheet into individual frames?',
    a: 'Drop your sprite sheet into the tool above. Set the number of columns and rows in the grid — the preview overlay shows the cut lines live, so you can see exactly where each slice will fall. If the sheet has a border or gaps between frames, set the margin and spacing in pixels. Click Slice Sprite Sheet, then download frames individually or all at once as a ZIP with an atlas JSON file.'
  },
  {
    q: 'What if my sprite sheet has margins or spacing between frames?',
    a: 'That is what the Margin and Spacing controls are for. Margin is the empty border around the whole sheet (in pixels); spacing is the gap between neighbouring frames. Set them to match your sheet and the grid overlay will line up with the real frame boundaries. Many published asset packs are packed edge-to-edge, in which case both stay at zero.'
  },
  {
    q: 'My sheet is not a regular grid. Can I still slice it?',
    a: 'Yes — switch the slicer to Auto-detect. It finds each sprite\u2019s real boundaries by looking for the transparent or flat-colour gutters between sprites, so frames of different sizes and uneven spacing slice correctly without any columns/rows setup. If your packer already exported an atlas, use Atlas file mode instead: load the TexturePacker JSON or Sparrow XML that belongs to the sheet and the slicer cuts by the atlas\u2019s exact rectangles.'
  },
  {
    q: 'What formats can I slice, and what do I get back?',
    a: 'Input can be PNG, JPG, or WebP — PNG is recommended because sprite sheets usually rely on transparency. Every sliced frame comes out as a PNG so transparency is preserved exactly, named frame_0000, frame_0001, and so on. The optional ZIP also includes an atlas JSON listing each frame\u2019s x, y, width, and height on the original sheet.'
  },
  {
    q: 'Is this sprite sheet slicer really free? Is my image uploaded anywhere?',
    a: 'Yes, completely free, and nothing is uploaded. The slicing runs entirely in your browser with canvas — your asset pack never leaves your device, there is no account, no watermark, and no limit on how many sheets you slice. That matters for commercial asset packs and unreleased game art, which stay private by design.'
  },
  {
    q: 'Can I use the sliced frames in Unity, Godot, or Phaser?',
    a: 'Yes. In Unity, import the frames as individual sprites or drop the atlas JSON values into a custom importer. In Godot, add the frames to a SpriteFrames resource in order. In Phaser, individual PNGs can be loaded as separate images, or keep the sheet plus the atlas JSON and load it as an atlas. The JSON also matches what our Video to Sprite Sheet maker produces, so sheets made here can be re-sliced and rebuilt in the same format.'
  },
  {
    q: 'What is the difference between this and the Video to Sprite Sheet maker?',
    a: 'They work in opposite directions. The Video to Sprite Sheet maker turns a video clip into a packed sprite sheet (many frames → one image). This slicer does the reverse: it takes a packed sprite sheet and cuts it back into individual frames (one image → many frames). Together they cover the full round trip.'
  }
];

const SpriteSheetSlicer: React.FC = () => {
  const { t } = useTranslation();
  const webAppSchema = {
    "@type": "WebApplication",
    "name": "Sprite Sheet Slicer — Split Sprite Sheets into Frames Free",
    "url": "https://www.videotoimagesequence.online/sprite-sheet-slicer",
    "image": "https://www.videotoimagesequence.online/og-image.png",
    "description": "Split any sprite sheet into individual PNG frames free in your browser — grid overlay preview, margin/spacing controls, ZIP + atlas JSON export for Unity, Godot & Phaser. No upload, no signup.",
    "applicationCategory": "MultimediaApplication",
    "applicationSubCategory": "Sprite Sheet Slicer",
    "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
    "browserRequirements": "Requires HTML5 canvas support",
    "featureList": [
      "Slice sprite sheets into individual PNG frames",
      "Live grid overlay preview before cutting",
      "Columns/rows plus margin and spacing controls",
      "Auto-detect frames in irregular, non-grid sheets",
      "TexturePacker JSON and Sparrow XML atlas import",
      "Skip fully-empty frames automatically",
      "Download frames individually or as a ZIP",
      "Atlas JSON export with per-frame x/y/width/height",
      "100% browser-based — images never leave your device"
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
    "name": "How to Split a Sprite Sheet into Frames",
    "description": "Cut a sprite sheet PNG into individual animation frames free in your browser, with a ZIP and atlas JSON for your game engine.",
    "totalTime": "PT1M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Load your sprite sheet",
        "text": "Drag and drop a PNG, JPG, or WebP sprite sheet into the slicer — it never leaves your browser."
      },
      {
        "@type": "HowToStep",
        "name": "Tell it how the sheet is packed",
        "text": "For a regular grid, enter columns and rows plus margin and spacing — the overlay shows the exact cut lines. For irregular sheets, choose Auto-detect and the slicer finds each sprite's boundaries. If the sheet came with a TexturePacker JSON or Sparrow XML atlas, load it in Atlas file mode and slice by its exact rectangles."
      },
      {
        "@type": "HowToStep",
        "name": "Slice the sheet",
        "text": "Click Slice Sprite Sheet. Empty cells can be skipped automatically; every frame is extracted as a PNG."
      },
      {
        "@type": "HowToStep",
        "name": "Download frames or ZIP",
        "text": "Download single frames by clicking them, or grab the ZIP with every frame plus the atlas JSON for Unity, Godot, or Phaser."
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
        title={t('spriteSheetSlicer.title')}
        description={t('spriteSheetSlicer.description')}
        canonical="https://www.videotoimagesequence.online/sprite-sheet-slicer"
        ogTitle={t('spriteSheetSlicer.title')}
        ogDescription={t('spriteSheetSlicer.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('spriteSheetSlicer.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Sprite Sheet Slicer', path: '/sprite-sheet-slicer' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('spriteSheetSlicer.h1')}<br />
          <span className="text-cyan-400">{t('spriteSheetSlicer.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('spriteSheetSlicer.hero')}
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
        <SpriteSheetSlicerTool />
      </div>

      <GoogleAdUnit />

      {/* ── WHAT IS A SPRITE SHEET SLICER ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          What Does a Sprite Sheet Slicer Do?
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          Sprite sheets are how games ship animation: dozens of frames packed into one image file. That packing is great for engines and terrible for editing. The moment you need <strong className="text-white">one frame on its own</strong> — to retouch it, replace it, measure it, or reuse it in a different animation — you need the sheet cut back apart. A sprite sheet slicer (or splitter) does exactly that: it divides the packed grid into its individual cells and hands each one back as a separate image.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          The usual alternatives are clunky. Cropping frames one by one in Photoshop works for three frames, not ninety. Desktop tools want installs and licences. Some online slicers charge per download. This one runs <strong className="text-white">entirely in your browser</strong>: the sheet is decoded locally, the grid overlay shows you the exact cut lines before anything is sliced, and the frames come out as transparent PNGs — free, with no upload and no account.
        </p>
        <p className="text-gray-400 leading-relaxed">
          If you arrived with a video instead of a sheet, start with the <Link to="/video-to-sprite-sheet" className="text-cyan-400 hover:text-cyan-300 underline">Video to Sprite Sheet maker</Link> — it packs video frames into a sheet. This page is the other half of the round trip, and both tools share the same JSON frame format.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Split a Sprite Sheet Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Load your sprite sheet', desc: 'Drag and drop a PNG, JPG, or WebP sheet. It is decoded locally in your browser — nothing is uploaded.' },
              { num: '2', title: 'Pick how the sheet is packed', desc: 'Grid: set columns and rows to match the sheet. No grid? Auto-detect finds each sprite\u2019s boundaries from the transparent gutters between them. Packed with TexturePacker? Load its JSON or Sparrow XML atlas instead.' },
              { num: '3', title: 'Check the overlay, adjust if needed', desc: 'The cyan overlay redraws live so you can see every cut before slicing. In Grid mode, sheets with a border or gaps between frames need margin and spacing in pixels; edge-to-edge sheets leave both at zero.' },
              { num: '4', title: 'Slice and download', desc: 'Click Slice Sprite Sheet, then download frames one by one or as a ZIP with the atlas JSON.' }
            ].map(step => (
              <li key={step.num} className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-semibold text-sm">{step.num}</span>
                <div>
                  <p className="text-white font-medium">{step.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── WHY SLICE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Why Developers Slice Sprite Sheets
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-white">Editing single frames.</strong> Fixing one bad frame in a walk cycle should not mean redrawing the sheet. Slice it, retouch the frame in your editor of choice, and repack — or rebuild the sheet from a video with the maker tool.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          <strong className="text-white">Reusing asset-pack art.</strong> Marketplace packs ship as sheets sized for the author's engine. Slicing gives you raw frames you can rearrange, subsample (every second frame for a choppier retro feel), or port to a different engine with its own packing rules.
        </p>
        <p className="text-gray-400 leading-relaxed">
          <strong className="text-white">Building training data and previews.</strong> Individual frames are what ML pipelines, documentation, and store pages actually consume. A sheet sliced into numbered PNGs is a dataset; a sheet left whole is a picture. The zero-padded names (frame_0000, frame_0001, …) sort correctly everywhere.
        </p>
      </section>

      {/* ── RELATED TOOLS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Related Tools</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { to: '/video-to-sprite-sheet', label: 'Video to Sprite Sheet', desc: 'Pack a video clip into a sprite sheet — the reverse of this tool.' },
            { to: '/gif-to-frames', label: 'GIF Splitter', desc: 'Split an animated GIF into its individual frames.' },
            { to: '/video-to-frames', label: 'Video to Frames', desc: 'Extract frames from any video as JPG, PNG, or WebP images.' }
          ].map(item => (
            <Link key={item.to} to={item.to} className="block bg-gray-900 border border-gray-800 hover:border-cyan-500/50 rounded-xl p-5 transition-colors">
              <p className="text-white font-medium mb-1">{item.label}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 group">
              <summary className="text-white font-medium cursor-pointer list-none flex justify-between items-center">
                {faq.q}
                <span className="text-cyan-400 ml-4 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-gray-400 leading-relaxed mt-3 text-sm">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SpriteSheetSlicer;
