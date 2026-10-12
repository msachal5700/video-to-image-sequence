import React, { useEffect } from 'react';
import VideoToSpriteSheetTool from '../components/VideoToSpriteSheetTool';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'What is a sprite sheet?',
    a: 'A sprite sheet is a single image that packs many animation frames into a uniform grid, plus data describing where each frame sits. Game engines load one texture instead of dozens of separate images, which is faster to render and easier to manage. A walk cycle, an explosion, a character idle animation — each becomes one PNG plus a list of frame rectangles the engine steps through over time.'
  },
  {
    q: 'How do I make a sprite sheet from a video?',
    a: 'Load your video into the tool above and choose how many frames the sheet should hold (8, 16, 24, or 32), how many columns the grid uses, and the pixel size of each frame cell. Click Generate Sprite Sheet: the tool samples frames evenly across the video, center-crops each to a uniform square, tiles them edge-to-edge into one PNG, and writes a matching JSON file with every frame\u2019s x, y, width, and height. Download both files — that is your complete sprite sheet.'
  },
  {
    q: 'What is inside the JSON frame data file?',
    a: 'A plain-text map of the sheet: the image filename, frame width and height, column and row counts, the seconds between sampled frames, and a frames array where each entry has a name (frame_0000, frame_0001, \u2026) plus its x, y, w, and h rectangle in pixels. It also includes short usage notes for Unity and Godot. Any engine or script that can read JSON can slice the PNG using these rectangles.'
  },
  {
    q: 'How do I use the sprite sheet in Unity?',
    a: 'Import the PNG into your Assets folder, select it, and set Texture Type to Sprite (2D and UI) with Sprite Mode set to Multiple. Open the Sprite Editor and slice the sheet: because every cell is a uniform square, you can use the automatic grid slice with the cell size you chose (128, 256, or 512 px), or enter the exact x/y/w/h rectangles from the JSON for precision. The sliced sprites can then drive a 2D animation clip.'
  },
  {
    q: 'How do I use the sprite sheet in Godot?',
    a: 'Add an AnimatedSprite2D node, create a new SpriteFrames resource, and add the PNG as a frame strip. In the import dialog Godot lets you define the grid: set the horizontal and vertical frame counts to match the columns and rows you chose (the JSON records both). Godot slices the sheet automatically, and you can preview and time the animation right in the editor.'
  },
  {
    q: 'How many frames should my sprite sheet have?',
    a: 'Match the motion, not the video length. A simple loop like a walk cycle or spinning coin reads well at 8 frames. Smoother actions — a jump, an attack swing, a particle burst — want 16 to 24. 32 suits longer or more detailed sequences. Remember the sheet grows with the frame count: 16 frames at 256 px in a 4-column grid is a 1024\u00d71024 texture, a comfortable size for most engines. Start small; you can always regenerate with more frames.'
  },
  {
    q: 'What video formats work with the sprite sheet maker?',
    a: 'Anything your browser can play: MP4, MOV, and WEBM work best. The frames are sampled from the decoded video, so quality depends on your source — a crisp, well-lit clip with a steady camera produces far cleaner sprites than shaky, compressed footage. For character animation, footage shot against a plain background crops and reads best in small cells.'
  },
  {
    q: 'Is the sprite sheet maker really free? Is my video uploaded anywhere?',
    a: 'Yes to free, no to uploading. The entire pipeline — decoding, frame sampling, grid compositing, PNG and JSON encoding — runs locally in your browser with JavaScript and canvas. Your footage never leaves your device, there is no account, no watermark, and no limit on how many sheets you generate. That also means unreleased game footage and client work stay private by design.'
  }
];

const VideoToSpriteSheet: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('video-to-sprite-sheet-schemas');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-to-sprite-sheet-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Video to Sprite Sheet Maker — Free for Game Developers",
      "url": "https://www.videotoimagesequence.online/video-to-sprite-sheet",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Turn any video into a game-ready sprite sheet free — PNG grid plus JSON frame data for Unity & Godot. No upload, no signup, 100% in your browser.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Sprite Sheet Generator",
      "operatingSystem": "All — Browser-based (Chrome, Firefox, Safari, Edge)",
      "browserRequirements": "Requires HTML5 video and canvas support",
      "featureList": [
        "Convert video clips into sprite sheet PNG grids",
        "8 to 32 evenly-spaced frames per sheet",
        "Adjustable grid columns (2–6) and frame sizes (128–512 px)",
        "JSON frame data with x/y/width/height per frame",
        "Unity and Godot usage notes included in every JSON",
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
      "name": "How to Make a Sprite Sheet from a Video",
      "description": "Turn any video clip into a game-ready sprite sheet — one PNG grid plus JSON frame data — free in your browser.",
      "totalTime": "PT2M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Load your video",
          "text": "Drag and drop an MP4, MOV, or WEBM clip into the maker above — it never leaves your browser."
        },
        {
          "@type": "HowToStep",
          "name": "Choose frames, columns, and size",
          "text": "Pick 8–32 frames, set the grid columns, and choose the per-frame pixel size (128, 256, or 512)."
        },
        {
          "@type": "HowToStep",
          "name": "Generate the sheet",
          "text": "The tool samples frames evenly, crops each to a uniform square, and tiles them edge-to-edge into one PNG."
        },
        {
          "@type": "HowToStep",
          "name": "Download PNG + JSON",
          "text": "Download the sprite sheet PNG and the JSON frame-data file, then import both into Unity, Godot, or any engine."
        }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('video-to-sprite-sheet-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title={t('videoToSpriteSheet.title')}
        description={t('videoToSpriteSheet.description')}
        canonical="https://www.videotoimagesequence.online/video-to-sprite-sheet"
        ogTitle={t('videoToSpriteSheet.title')}
        ogDescription={t('videoToSpriteSheet.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('videoToSpriteSheet.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Video to Sprite Sheet', path: '/video-to-sprite-sheet' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('videoToSpriteSheet.h1')}<br />
          <span className="text-cyan-400">{t('videoToSpriteSheet.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('videoToSpriteSheet.hero')}
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
        <VideoToSpriteSheetTool />
      </div>

      {/* ── WHAT IS A SPRITE SHEET ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          What Is a Sprite Sheet, and Why Do Game Developers Need One?
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          A sprite sheet packs every frame of an animation into a single image, arranged in a uniform grid, accompanied by data that says where each frame lives. Instead of loading thirty-two separate PNGs for a walk cycle, a game engine loads <strong className="text-white">one texture</strong> and steps through its cells over time. That single-texture approach renders faster, uses less memory, and keeps an animation's frames organized as one asset instead of a folder of loose files.
        </p>
        <p className="text-gray-400 leading-relaxed mb-4">
          Traditionally, sprite sheets were drawn frame by frame by pixel artists — beautiful, but slow. Video changed the economics: film a motion once — a hand wave, a bouncing ball, smoke rising, a character turning — and <strong className="text-white">convert the footage into frames</strong>. Each sampled frame becomes one cell of the sheet. What took an artist a day takes a camera ten seconds, and the result drops straight into Unity, Godot, GameMaker, or any engine that reads sprite grids.
        </p>
        <p className="text-gray-400 leading-relaxed">
          This maker automates the whole conversion. It samples your clip at even intervals, crops every frame to an identical square (the uniform cell size engines expect), tiles the cells edge-to-edge with no gutters or labels, and writes a JSON sidecar file mapping each frame to its exact rectangle. You download two files — the PNG and the JSON — and you have a complete, engine-ready sprite sheet.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Make a Sprite Sheet from Video Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Load your video', desc: 'Drag and drop an MP4, MOV, or WEBM clip. It is decoded locally in your browser — nothing is uploaded.' },
              { num: '2', title: 'Choose frame count', desc: 'Pick 8, 16, 24, or 32 frames. Simple loops read well at 8; smoother actions want 16–24.' },
              { num: '3', title: 'Set columns and frame size', desc: 'Columns (2–6) control the grid shape; frame size (128, 256, or 512 px) sets each cell\u2019s resolution. The sheet dimensions update accordingly.' },
              { num: '4', title: 'Generate the sheet', desc: 'Frames are sampled evenly across the clip, center-cropped to uniform squares, and tiled edge-to-edge into one PNG.' },
              { num: '5', title: 'Download PNG + JSON', desc: 'Get the sprite sheet image and its JSON frame-data file together, then import both into your engine.' },
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
          What Game Developers Use Video Sprite Sheets For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Character Animation Loops</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Film an actor walking, jumping, or attacking against a plain background, then convert the motion into a loopable sheet. Indie teams get realistic human motion without hand-drawing dozens of frames or buying motion-capture rigs.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Effects &amp; Particles</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Explosions, smoke, muzzle flashes, and magic effects are notoriously hard to draw convincingly. Real footage of fire, water, or dust converts into organic-looking effect sheets that read far better than procedural approximations.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">2D Animation &amp; Cutscenes</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Rotoscoping — tracing over live footage — is a century-old animation technique. A video sprite sheet is its digital shortcut: the footage itself becomes the animation frames, ready to drop into a 2D pipeline or visual-novel engine.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Prototyping &amp; Placeholders</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Need animated placeholders while final art is in production? Convert stock or phone footage into temp sheets in minutes. Gameplay code gets built against real timing data, and artists replace the sheets later without touching the animation logic.
            </p>
          </div>
        </div>
      </section>

      {/* ── JSON FORMAT ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Understanding the JSON Frame Data
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          The PNG is only half the sprite sheet — the JSON tells software where each frame is. Every download includes a file like this, describing the exact rectangle of each cell:
        </p>
        <pre className="bg-gray-950 border border-gray-800 rounded-xl p-5 text-xs md:text-sm text-gray-300 font-mono overflow-x-auto leading-relaxed mb-4">{`{
  "image": "walk_cycle_spritesheet.png",
  "frameWidth": 256,
  "frameHeight": 256,
  "columns": 4,
  "rows": 4,
  "frameCount": 16,
  "frames": [
    { "name": "frame_0000", "index": 0, "x": 0,   "y": 0,   "w": 256, "h": 256 },
    { "name": "frame_0001", "index": 1, "x": 256, "y": 0,   "w": 256, "h": 256 },
    { "name": "frame_0002", "index": 2, "x": 512, "y": 0,   "w": 256, "h": 256 },
    ...
  ]
}`}</pre>
        <p className="text-gray-400 leading-relaxed">
          Frames run left-to-right, top-to-bottom, so <strong className="text-white">frame order is animation order</strong> — play cells 0 through 15 in sequence and you replay the sampled motion. Because cells are uniform squares with no gutters, most engines can also auto-slice the sheet on the grid alone; the JSON exists for the cases where you need exact rectangles, like custom importers or web-based sprite renderers.
        </p>
      </section>

      {/* ── SPRITE SHEET VS ALTERNATIVES ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Sprite Sheet vs. Frame Extraction vs. Contact Sheet
        </h2>
        <p className="text-gray-400 leading-relaxed mb-4">
          All three start by pulling stills from video, but they serve different masters. <strong className="text-white">Frame extraction</strong> gives you individual image files — one per frame — for editing, compositing, or datasets. <strong className="text-white">A contact sheet</strong> composites frames into one labeled grid for human review: footage scanning, storyboards, archiving.
        </p>
        <p className="text-gray-400 leading-relaxed">
          A <strong className="text-white">sprite sheet</strong> is the machine-readable variant: edge-to-edge cells, no labels, uniform squares, plus coordinate data — built for software to consume, not people to read. If a person needs to <em>look at</em> the footage, make a contact sheet. If your game engine needs to <em>play</em> the footage, make a sprite sheet.
        </p>
      </section>

      {/* ── TIPS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Tips for Game-Ready Sprite Sheets
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Shoot against a plain background</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Cells are small — busy backgrounds turn to noise at 128 px. A solid backdrop keeps the subject readable and makes the sheet far easier to work with in-engine.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Keep the camera locked off</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A static camera means only the subject moves between frames, which is exactly what sprite animation wants. Camera shake becomes jitter in every cell.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Mind the texture budget</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              16 frames at 256 px in 4 columns is a 1024×1024 texture — comfortable. 32 frames at 512 px is 4096×2048, which strains mobile GPUs. Match cell size to how big the sprite appears on screen; bigger is not always better.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Video frames have no transparency</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              An honest limitation: unlike hand-drawn sprites, video frames are opaque rectangles. If you need transparency, key out the background in an editor after download, or composite the sheet over matching background colors in-engine.
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
            No server upload required. The sheet is composited in your browser, so very long videos or 4K sources depend on your device memory. For game sprites, short clips work best anyway — trim to the motion you need before generating.
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
          <Link to="/video-contact-sheet" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video Contact Sheet</h3>
            <p className="text-gray-500 text-xs">Timestamped grid overviews for footage review.</p>
          </Link>
          <Link to="/extract-frames-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Extract Frames from Video</h3>
            <p className="text-gray-500 text-xs">FPS-controlled extraction with timestamp capture.</p>
          </Link>
          <Link to="/video-to-gif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to GIF</h3>
            <p className="text-gray-500 text-xs">Turn clips into shareable animated GIFs.</p>
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

export default VideoToSpriteSheet;
