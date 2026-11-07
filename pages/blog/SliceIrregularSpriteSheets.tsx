import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import Breadcrumb from '../../components/Breadcrumb';
import AuthorBio from '../../components/AuthorBio';

const PUBLISHED = '2026-11-07';
const CANONICAL = 'https://www.videotoimagesequence.online/blog/slice-irregular-sprite-sheets';

const SliceIrregularSpriteSheets: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
  {
    "q": "How do I slice a sprite sheet with different-sized sprites?",
    "a": "Use auto-detect if the sprites are separated by transparent or flat-colour gutters — it finds each sprite's true bounding box regardless of size. If you have the packer's JSON or XML atlas file, use Atlas file mode instead: it cuts by the packer's exact rectangles and also handles trimmed and touching sprites."
  },
  {
    "q": "What is a TexturePacker JSON atlas file?",
    "a": "It is the data file a texture packer writes alongside the sheet image, listing every sprite's name and rectangle (x, y, w, h) on the sheet. TexturePacker exports it in hash format (frames keyed by filename) or array format (frames as a list). Loading it into a slicer reproduces the packer's cuts exactly."
  },
  {
    "q": "What is a Sparrow XML atlas?",
    "a": "It is the atlas format used by the Starling/Sparrow framework: an XML file with one SubTexture element per sprite, each carrying a name and rectangle. It serves the same purpose as TexturePacker JSON — the packer's record of where each sprite sits."
  },
  {
    "q": "Why did auto-detect merge two of my sprites into one frame?",
    "a": "The two sprites touch or are separated by less than a visible gutter, so the detector sees one connected region. Separate them with background space and re-slice, or use Atlas file mode with the packer's rectangles. The same limitation applies to automatic slicing in engine sprite editors."
  },
  {
    "q": "Why did auto-detect find tiny junk frames?",
    "a": "Usually JPG compression noise around sprite edges, or a background that is not one flat colour. Re-export the sheet as PNG with clean transparency and the false regions disappear. If the sheet's corner pixel is sprite-coloured, the background reference itself is wrong — trim the sheet first."
  },
  {
    "q": "Can I slice a sprite sheet without installing software?",
    "a": "Yes. The slicer on this site runs entirely in your browser: drop the sheet, pick Grid, Auto-detect, or Atlas file mode, check the overlay, and download frames individually or as a ZIP with an atlas JSON. No upload, no account, and the sheet never leaves your device."
  },
  {
    "q": "Do sliced frames keep transparency?",
    "a": "Yes. Frames export as PNG, so alpha is preserved exactly. That matters for game sprites, which are almost always layered over backgrounds, tiles, or other sprites in-engine."
  }
];

  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const articleSchema = {
    '@type': 'TechArticle',
    headline: "How to Slice a Sprite Sheet That Isn't a Grid (Auto-Detect + Atlas Files)",
    description: "Slice a sprite sheet that isn't a grid: auto-detect mode finds irregular sprites by their outlines, and atlas files use the packer's own rectangles — then turn the slices into a working animation.",
    url: CANONICAL,
    datePublished: PUBLISHED,
    author: {
      '@type': 'Person',
      name: 'Muhammad Sachal',
      jobTitle: 'Founder & Senior Software Engineer',
      url: 'https://www.linkedin.com/in/sachalspeaks/'
    },
  };

  const orgSchema = {
    '@type': 'Organization',
    name: 'Video to Image Sequence Online',
    url: 'https://www.videotoimagesequence.online/',
  };

  const blogSchema = {
    '@context': 'https://schema.org',
    '@graph': [articleSchema, faqSchema, orgSchema],
  };

  return (
    <>
      <SEOHead
        title="How to Slice a Sprite Sheet That Isn't a Grid (Auto-Detect + Atlas Files)"
        description="Slice a sprite sheet that isn't a grid: auto-detect mode finds irregular sprites by their outlines, and atlas files use the packer's own rectangles — then turn the slices into a working animation."
        canonical={CANONICAL}
        keywords="how to slice a sprite sheet, sprite sheet slicer, slice irregular sprite sheet, atlas file slicer"
        ogTitle="How to Slice a Sprite Sheet That Isn't a Grid (Auto-Detect + Atlas Files)"
        ogDescription="Grid slicers fail on packed, irregular sprite sheets. Auto-detect and atlas-file slicing handle the sheets real games actually ship."
        ogType="article"
        articleDate={PUBLISHED}
      />

      <script type="application/ld+json">{JSON.stringify(blogSchema)}</script>

      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 font-sans text-gray-300">
        <Breadcrumb
          items={[
            { label: 'Home', path: '/' },
            { label: 'Blog', path: '/blog' },
            { label: "Irregular Sprite Sheet Guide", path: '/blog/slice-irregular-sprite-sheets' },
          ]}
        />

        <header className="mt-8 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 uppercase tracking-wider">
              Guide
            </span>
            <span className="text-gray-500 text-xs">•</span>
            <span className="text-xs font-mono text-gray-400">9 min read</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            How to Slice a Sprite Sheet That Isn't a Grid <span className="text-cyan-400">(Auto-Detect + Atlas Files)</span>
          </h1>
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400 border-b border-gray-800 pb-8">
            <span>Published <time dateTime={PUBLISHED}>7 November 2026</time></span>
            <span>•</span>
            <span>By <a href="https://www.linkedin.com/in/sachalspeaks/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-medium hover:underline">Muhammad Sachal (SachalSpeaks)</a></span>
          </div>
        </header>

        <div className="mt-10 space-y-12 leading-relaxed text-base md:text-lg">

          <section className="space-y-4">
            <p><strong className="text-white">Related reading:</strong> <Link to="/blog/sprite-sheets-explained-game-devs" className="text-cyan-400 underline hover:text-cyan-300">/blog/sprite-sheets-explained-game-devs</Link> · <Link to="/video-to-sprite-sheet" className="text-cyan-400 underline hover:text-cyan-300">/video-to-sprite-sheet</Link> · <Link to="/video-to-frames" className="text-cyan-400 underline hover:text-cyan-300">/video-to-frames</Link></p>
            <p>Most sprite-sheet tutorials assume a perfect grid: every frame the same size, evenly spaced, ready for "columns × rows" slicing. Real sheets from asset packs rarely cooperate. A character's attack frame is wider than its idle frame, a UI icon sheet mixes 16px and 48px art, and a packed atlas has no grid at all — just rectangles crammed wherever they fit. Forcing those sheets through a grid slicer gives you frames cut in half and a lot of manual cropping.</p>
            <p>There are two reliable ways to slice a non-grid sheet, and they match the two non-grid modes in our <Link to="/sprite-sheet-slicer" className="text-cyan-400 underline hover:text-cyan-300">sprite sheet slicer</Link>: let the tool find the sprites from the image itself (auto-detect), or hand it the atlas file the packer already wrote (atlas mode). This guide explains when to use each, what each one needs from your sheet, and where each one fails.</p>
          </section>

          <div className="p-6 rounded-2xl bg-cyan-950/40 border border-cyan-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <p className="font-display font-bold text-white text-lg">Try the free tool this guide uses</p>
              <p className="text-gray-400 text-sm mt-1">Free, in your browser, no upload — your files never leave your device.</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                to="/sprite-sheet-slicer"
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-gray-950 font-bold font-display text-sm transition-colors shadow-lg shadow-cyan-500/20"
              >
                Sprite Sheet Slicer →
              </Link>
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white border-b border-gray-800 pb-2">First, identify what kind of sheet you have</h2>
            <p>Before picking a mode, look at the sheet for thirty seconds. Three questions decide everything:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm"><li><strong className="text-white">Are all frames the same size and evenly spaced?</strong> If yes, stop — use Grid mode. It is the most predictable option, and nothing here beats it for uniform sheets.</li><li><strong className="text-white">Are the sprites separated by empty space?</strong> If each sprite sits in its own island of transparency (or a flat background colour) with a visible gutter around it, auto-detect will work.</li><li><strong className="text-white">Did the sheet arrive with a second file?</strong> A <code className="text-cyan-400">.json</code> or <code className="text-cyan-400">.xml</code> sitting next to the PNG — usually from TexturePacker, a game engine export, or another packer — is an atlas file. If you have one, use it: it is the packer's own record of where every sprite is, and it beats any guesswork.</li></ol>
            <p>TexturePacker's own splitter documentation describes the same three-way split: grid for uniform sheets, rectangular detection for sprites separated by transparent pixels, and a data-file mode when an atlas file exists (CodeAndWeb, TexturePacker tutorials).</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white border-b border-gray-800 pb-2">Method 1: Auto-detect — let the tool find the sprites</h2>
            <p>Auto-detect works by scanning the sheet for connected regions of non-background pixels. In plain terms: it treats the corner pixel as the background, finds every island of sprite pixels separated from the others by background, and draws one rectangle around each island. Sprites of different sizes and uneven spacing come out at their true sizes, in reading order (left to right, top to bottom).</p>
            <p>This is the right choice for:</p>
            <ul className="list-disc list-inside space-y-2 text-sm"><li><strong className="text-white">Loose asset sheets and icon boards</strong>, where an artist laid sprites out by eye rather than on a grid.</li><li><strong className="text-white">Sprite collections cut from screenshots or scans</strong>, where no grid ever existed.</li><li><strong className="text-white">Mixed-size animation frames</strong>, like a boss character whose attack frames are much wider than its walk frames.</li></ul>
            <p>It is also the mode Unity's Sprite Editor approximates with its Automatic slicing, which finds sprites by their transparent gaps. The same warning applies in both tools: automatic detection is genuinely useful for messy sheets of loose objects, and the wrong tool for a walk cycle whose limbs nearly touch (tsubu.art, Unity sprite-sheet guide).</p>
            <h3 className="font-display text-xl font-bold text-white mt-6">What auto-detect needs from your sheet</h3>
            <ul className="list-disc list-inside space-y-2 text-sm"><li><strong className="text-white">A visible gutter.</strong> Every sprite must be separated from its neighbours by background — transparent pixels or one flat colour. Sprites that touch or overlap merge into a single detected region, and no setting can un-merge them. If two frames touch, fall back to Grid or Atlas mode.</li><li><strong className="text-white">A clean background.</strong> The detector reads the corner pixel as the background reference, so a sheet whose corner pixel is part of a sprite (for example, a full-bleed background illustration) can mis-detect. Trim the sheet to the sprite area first, or use Atlas mode.</li><li><strong className="text-white">Consistent transparency.</strong> PNG with an alpha channel gives the cleanest detection. JPG sheets work when the background is one flat colour, but compression noise around sprite edges can create speck-sized false regions — if you see tiny junk frames, re-export the sheet as PNG.</li></ul>
            <h3 className="font-display text-xl font-bold text-white mt-6">Checking the result before you export</h3>
            <p>Always look at the overlay before downloading. Count the rectangles, and check that none spans two sprites and none clips a sprite's edge — that catches the common failure (merged neighbours) before it reaches your engine. Export is individual PNGs (transparency preserved) or one ZIP with an atlas JSON listing each frame's x, y, width, and height.</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white border-b border-gray-800 pb-2">Method 2: Atlas file — use the packer's own rectangles</h2>
            <p>When a sheet was made by a packer, the packer already solved the detection problem and wrote the answers down. TexturePacker exports JSON in two shapes — hash format, where frames are keyed by filename, and array format, where they are a list — each frame carrying an <code className="text-cyan-400">x</code>, <code className="text-cyan-400">y</code>, <code className="text-cyan-400">w</code>, <code className="text-cyan-400">h</code> rectangle. Sparrow/Starling atlases use XML, with one <code className="text-cyan-400">SubTexture</code> element per sprite carrying its name and rectangle. Loading that file into the slicer cuts by those exact rectangles: no guessing, no gutter requirement, no merged neighbours.</p>
            <p>This is the right choice whenever the atlas file exists, full stop. It is also the only reliable choice for:</p>
            <ul className="list-disc list-inside space-y-2 text-sm"><li><strong className="text-white">Trimmed sheets</strong>, where the packer cut away transparent borders to save space. Auto-detect sees the trimmed sprite, not the original frame — the atlas file carries the original size and offset, so frames keep their alignment.</li><li><strong className="text-white">Sheets with touching or overlapping sprites</strong>, where detection cannot separate them.</li><li><strong className="text-white">Re-slicing a sheet you packed yourself</strong>, since the JSON you exported is the ground truth for that sheet.</li></ul>
            <p>The workflow is: drop the sheet image, switch the slicer to Atlas file mode, load the JSON or XML that belongs to that exact sheet, and check the overlay. If the atlas belongs to a different sheet (a common mistake after re-exporting), the rectangles will land in the wrong places — the overlay makes that obvious in seconds.</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white border-b border-gray-800 pb-2">Which method for which sheet</h2>
            <div className="overflow-x-auto"><table className="w-full text-sm border border-gray-800 rounded-2xl overflow-hidden"><thead><tr className="bg-gray-900/70 text-left"><th className="px-4 py-3 font-semibold text-white">Sheet</th><th className="px-4 py-3 font-semibold text-white">Best mode</th><th className="px-4 py-3 font-semibold text-white">Why</th></tr></thead><tbody className="divide-y divide-gray-800"><tr><td className="px-4 py-3 text-white font-medium">Uniform grid, same-size frames</td><td className="px-4 py-3">Grid</td><td className="px-4 py-3">Exact, predictable, no detection risk</td></tr><tr><td className="px-4 py-3 text-white font-medium">Mixed sizes, visible gutters, no atlas file</td><td className="px-4 py-3">Auto-detect</td><td className="px-4 py-3">Finds true boundaries without a grid</td></tr><tr><td className="px-4 py-3 text-white font-medium">Any sheet with a matching JSON/XML atlas</td><td className="px-4 py-3">Atlas file</td><td className="px-4 py-3">The packer's own rectangles; handles trimmed and touching sprites</td></tr><tr><td className="px-4 py-3 text-white font-medium">Sprites touching or overlapping, no atlas</td><td className="px-4 py-3">Neither — fix the sheet</td><td className="px-4 py-3">Separate the sprites with a gutter, or re-export with an atlas</td></tr></tbody></table></div>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white border-b border-gray-800 pb-2">From sliced frames to a working animation</h2>
            <p>Sliced frames are only half the job. In Unity, import the PNGs as individual sprites and build the animation clip in frame order. In Godot, add the frames to a SpriteFrames resource in order. In Phaser, load the individual PNGs or keep the sheet plus the exported atlas JSON and load it as an atlas. Sheets made with our <Link to="/video-to-sprite-sheet" className="text-cyan-400 underline hover:text-cyan-300">video to sprite sheet maker</Link> use the same format, so they can be re-sliced and rebuilt without conversion.</p>
            <p>If you started from a video rather than a sheet, the path is: extract frames with the <Link to="/video-to-frames" className="text-cyan-400 underline hover:text-cyan-300">video to frames tool</Link>, pack or arrange them into a sheet, and slice from there. Each step stays in the browser, and no file is uploaded at any point.</p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white border-b border-gray-800 pb-2">
              Related Tools on This Site
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><Link to="/sprite-sheet-slicer" className="text-cyan-400 underline hover:text-cyan-300">Sprite Sheet Slicer</Link> — Slice sprite sheets — grid, auto-detect, and atlas-file modes — into individual frames.</li>
              <li><Link to="/video-to-frames" className="text-cyan-400 underline hover:text-cyan-300">Video to Frames</Link> — Extract frames from any video as a JPG/PNG/WebP image sequence — free, in your browser, no upload.</li>
            </ul>
          </section>


          <section className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white border-b border-gray-800 pb-2">
              Frequently Asked Questions
            </h2>
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

          <section className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white border-b border-gray-800 pb-2">Sources</h2>
            <ul className="list-disc list-inside space-y-2 text-sm"><li>CodeAndWeb, TexturePacker tutorials, "How to split sprite sheets into individual sprites" — grid, rectangular (transparent-pixel), and data-file splitting modes: https://www.codeandweb.com/texturepacker/tutorials/how-to-split-sprite-sheets</li><li>tsubu.art, "Sprite sheet for Unity" — automatic slicing finds sprites by transparent gaps; warns it can merge nearly-touching frames: https://tsubu.art/blog/sprite-sheet-unity</li><li>PlayCanvas Developer Site, "Using Texture Packers" — why atlases are packed (fewer requests, single draw call) and TexturePacker JSON hash format: https://developer.playcanvas.com/user-manual/2D/texture-packing/</li><li>Tool behaviour verified from the live site: /sprite-sheet-slicer Auto-detect (connected-region detection, corner-pixel background reference) and Atlas file (TexturePacker JSON hash/array, Sparrow XML) modes, shipped 2026-10-26; overlay preview, PNG export, ZIP + atlas JSON.</li></ul>
          </section>
          <AuthorBio />

        </div>
      </article>
    </>
  );
};

export default SliceIrregularSpriteSheets;
