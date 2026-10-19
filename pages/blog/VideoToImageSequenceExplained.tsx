import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import Breadcrumb from '../../components/Breadcrumb';
import GoogleAdUnit from '../../components/GoogleAdUnit';
import AuthorBio from '../../components/AuthorBio';

const blogSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "Video to Image Sequence Explained — Complete Technical Guide",
      "description": "What is an image sequence? How does video-to-frames conversion work? Technical deep-dive on FPS, formats, naming conventions, and pipeline integration for VFX, animation, and ML.",
      "url": "https://www.videotoimagesequence.online/blog/video-to-image-sequence-explained",
      "mainEntityOfPage": "https://www.videotoimagesequence.online/blog/video-to-image-sequence-explained",
      "keywords": ["video to image sequence", "image sequence explained", "frame extraction technical", "video frames pipeline", "FPS settings"],
      "datePublished": "2026-09-12",
      "dateModified": "2026-09-12",
      "author": { "@type": "Person", "name": "Muhammad Sachal", "url": "https://www.linkedin.com/in/sachalspeaks/" },
      "publisher": { "@type": "Organization", "name": "Video to Image Sequence Online" },
      "image": "https://www.videotoimagesequence.online/og-image.png"
    };

const VideoToImageSequenceExplained: React.FC = () => {


  return (
    <article className="max-w-3xl mx-auto py-16 px-6 font-sans">
      <script type="application/ld+json">
        {JSON.stringify(blogSchema)}
      </script>
      <SEOHead
        title="Video to Image Sequence Explained — Complete Technical Guide"
        description="What is an image sequence? How does video-to-frames conversion work? Technical deep-dive on FPS, formats, naming conventions, and pipeline integration for VFX, animation, and ML."
        canonical="https://www.videotoimagesequence.online/blog/video-to-image-sequence-explained"
        ogTitle="Video to Image Sequence Explained — Complete Technical Guide"
        ogDescription="Technical deep-dive on image sequences: FPS, formats, naming conventions, and pipeline integration for VFX, animation, and ML."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="article"
        articleDate="2026-09-12"
        keywords="video to image sequence explained, image sequence technical guide, frame extraction pipeline, video frames FPS, naming conventions"
      />

      <Breadcrumb items={[
        { label: 'Blog', path: '/blog' },
        { label: 'Video to Image Sequence Explained' }
      ]} />

      <div className="mb-10 text-center mt-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">Video to Image Sequence Explained</h1>
        <p className="text-cyan-400 font-mono text-sm tracking-wider uppercase">Sep 12, 2026 • 12 min read</p>
      </div>

      <div className="text-gray-300 space-y-6 leading-relaxed text-lg lg:text-xl">
        <p className="text-xl text-gray-100">
          An <strong className="text-cyan-400">image sequence</strong> is a folder of sequentially numbered still images that, when played back at a specific frame rate, reconstructs the original video. Unlike a video file (which is a single container with compressed frames), an image sequence gives you direct, random access to every single frame as an independent file.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Why Use Image Sequences Instead of Video Files?</h2>
        <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-400">
          <li><strong className="text-white">Frame-perfect access:</strong> No seeking, no keyframe dependence — frame 147 is right there at <code className="bg-gray-900 px-1.5 py-0.5 rounded">frame_000147.png</code>.</li>
          <li><strong className="text-white">Pipeline universal:</strong> Blender, Nuke, After Effects, DaVinci, Houdini, Unity, Unreal, Python (OpenCV/PIL) — everything reads image sequences natively.</li>
          <li><strong className="text-white">Lossless options:</strong> PNG/EXR preserve every pixel for VFX compositing, color grading, ML ground truth.</li>
          <li><strong className="text-white">Parallel processing:</strong> Distribute frames across cores/GPUs for rendering, training, or analysis.</li>
          <li><strong className="text-white">Version control friendly:</strong> Git LFS handles image sequences better than binary video containers.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">The Three Pillars: FPS, Format, Naming</h2>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">1. Frame Rate (FPS) — Temporal Resolution</h3>
        <p>FPS (frames per second) controls how many images represent each second of video:</p>
        <div className="overflow-x-auto rounded-2xl border border-gray-800 my-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900 text-white uppercase text-xs font-mono">
              <tr><th className="px-4 py-3">FPS</th><th className="px-4 py-3">Use Case</th><th className="px-4 py-3">Frame Count (10s video)</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-cyan-400">1</td><td className="px-4 py-3">Slide capture, lecture thumbnails</td><td className="px-4 py-3">10</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-cyan-400">5</td><td className="px-4 py-3">ML datasets, storyboards</td><td className="px-4 py-3">50</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-cyan-400">10</td><td className="px-4 py-3">Motion sampling, previews</td><td className="px-4 py-3">100</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-cyan-400">24</td><td className="px-4 py-3">Cinema/film standard</td><td className="px-4 py-3">240</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-cyan-400">25</td><td className="px-4 py-3">PAL broadcast (EU)</td><td className="px-4 py-3">250</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-cyan-400">30</td><td className="px-4 py-3">NTSC broadcast, web, YouTube</td><td className="px-4 py-3">300</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-cyan-400">60</td><td className="px-4 py-3">High-speed, gaming, slow-mo</td><td className="px-4 py-3">600</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 mt-2"><em>💡 Our tool supports all these presets plus 12/15 FPS for animation workflows.</em></p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">2. Output Format — Quality vs Size</h3>
        <div className="overflow-x-auto rounded-2xl border border-gray-800 my-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900 text-white uppercase text-xs font-mono">
              <tr><th className="px-4 py-3">Format</th><th className="px-4 py-3">Compression</th><th className="px-4 py-3">Alpha</th><th className="px-4 py-3">1080p Frame Size</th><th className="px-4 py-3">Best For</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-cyan-400">JPG</td><td className="px-4 py-3">Lossy (92%)</td><td className="px-4 py-3">❌</td><td className="px-4 py-3">150–300 KB</td><td className="px-4 py-3">Thumbnails, social, previews</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-cyan-400">PNG</td><td className="px-4 py-3">Lossless</td><td className="px-4 py-3">✅</td><td className="px-4 py-3">1–2 MB</td><td className="px-4 py-3">VFX, ML, animation, compositing</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-cyan-400">WebP</td><td className="px-4 py-3">Lossless/Lossy</td><td className="px-4 py-3">✅</td><td className="px-4 py-3">25–35% smaller than JPG</td><td className="px-4 py-3">Web delivery, modern pipelines</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-cyan-400">EXR</td><td className="px-4 py-3">Lossless (16/32-bit)</td><td className="px-4 py-3">✅</td><td className="px-4 py-3">4–8 MB</td><td className="px-4 py-3">HDR VFX, deep compositing</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">3. Naming Conventions — Pipeline Compatibility</h3>
        <p>Frame naming determines whether your sequence imports correctly:</p>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm">
          <div className="text-cyan-400 mb-2">✅ Recommended (our tool):</div>
          <code>frame_000001.png, frame_000002.png, ... frame_000300.png</code>
          <div className="text-yellow-400 mt-3 mb-2">⚠️ Common variants:</div>
          <code>frame_001.png (3-digit) • img_0001.png • shot01_0001.png • %04d.png (FFmpeg default)</code>
          <div className="text-red-400 mt-3 mb-2">❌ Avoid:</div>
          <code>frame1.png (no padding) • frame_1.png (inconsistent) • frame-001.png (hyphens break sort)</code>
        </div>
        <p className="text-sm text-gray-500 mt-2">Our tool outputs <code>frame_000001.png</code> (6-digit zero-padded) which works in Blender, Nuke, After Effects, DaVinci, FFmpeg, and Python <code>glob.sort()</code> without renaming.</p>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">How Browser-Based Extraction Works</h2>
        <p>Unlike cloud tools that upload → server decode → download, our tool runs entirely in your browser:</p>
        <ol className="list-decimal pl-6 space-y-3 mt-4 text-gray-400 marker:text-cyan-500 marker:font-bold">
          <li><strong>File API:</strong> Browser reads video from your disk into memory (no upload).</li>
          <li><strong>WebCodecs / Canvas:</strong> Hardware-accelerated decode via <code>VideoDecoder</code> (modern) or <code>HTMLVideoElement</code> + <code>canvas.drawImage()</code> (fallback).</li>
          <li><strong>Frame selection:</strong> Seek to each target timestamp, render to <code>OffscreenCanvas</code>.</li>
          <li><strong>Encode:</strong> <code>canvas.convertToBlob({'{'} type: 'image/png' {'}'})</code> or JPG/WebP.</li>
          <li><strong>ZIP assembly:</strong> <code>JSZip</code> streams blobs into a single archive (no intermediate files).</li>
          <li><strong>Download:</strong> <code>URL.createObjectURL(zipBlob)</code> → trigger <code>{'<a download>'}</code>.</li>
        </ol>
        <p>All memory stays in your browser tab. Close the tab → everything is gone.</p>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Pipeline Integration Examples</h2>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Blender (VFX/Animation)</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400 overflow-x-auto max-w-full"><code>{`# Blender Python API
import bpy
bpy.ops.image.open(directory="/path/to/frames/", files=[{"name":"frame_000001.png"}])
# Blender auto-detects sequence from first frame`}</code></pre>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Python / OpenCV (ML/Analysis)</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400 overflow-x-auto max-w-full"><code>import cv2, glob
frames = sorted(glob.glob("frames/frame_*.png"))
for f in frames:
    img = cv2.imread(f)
    # process...</code></pre>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">FFmpeg (Re-encode to Video)</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400 overflow-x-auto max-w-full"><code># Image sequence → MP4 (H.264, CRF 18)
ffmpeg -framerate 30 -i frame_%06d.png -c:v libx264 -crf 18 -pix_fmt yuv420p output.mp4</code></pre>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Memory & Performance</h2>
        <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-400">
          <li><strong>1080p @ 30 FPS, 10s:</strong> ~300 frames → JPG ZIP ~30 MB, PNG ZIP ~300 MB.</li>
          <li><strong>4K @ 30 FPS, 10s:</strong> ~300 frames → PNG ZIP ~1.2 GB (4× 1080p).</li>
          <li><strong>Browser limit:</strong> Tab crashes ~1.5–2 GB JS heap. Mitigate: lower FPS, use JPG/WebP, chunk long videos.</li>
          <li><strong>Preview downscale:</strong> Our tool caps preview at 1920px; downloads are full resolution.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Common Pitfalls</h2>
        <div className="space-y-4 mt-4">
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ Mismatched FPS</h4>
            <p className="text-gray-400">Extract at 30 FPS, import into 24 FPS project → 25% speedup. Always match project FPS to extraction FPS.</p>
          </div>
          <div className="bg-yellow-950/30 border border-yellow-800 rounded-xl p-4">
            <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Color Space Mismatch</h4>
            <p className="text-gray-400">Video is usually sRGB/Rec.709. VFX pipelines (ACES/OCIO) expect linear. Convert in compositor or set Blender View Transform → Standard (sRGB) for direct use.</p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ Alpha Lost</h4>
            <p className="text-gray-400">H.264/HEVC don't support alpha. Need WebM VP9 with alpha or ProRes 4444 → transcode first. Our tool preserves alpha if source has it.</p>
          </div>
        </div>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Image Sequence vs Video Container: When Each Wins</h2>
        <p>
          Understanding when to use an image sequence versus keeping the original video file saves both time and
          storage. The two formats solve different problems.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-800 my-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900 text-white uppercase text-xs font-mono">
              <tr><th className="px-4 py-3">Aspect</th><th className="px-4 py-3">Image Sequence</th><th className="px-4 py-3">Video Container</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-white">Random access</td><td className="px-4 py-3 text-cyan-400">Instant — every frame is a file</td><td className="px-4 py-3">Slow — must decode from nearest keyframe</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-white">Storage size</td><td className="px-4 py-3">Large (10–100× video)</td><td className="px-4 py-3 text-cyan-400">Compact (temporal compression)</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-white">Edit-friendliness</td><td className="px-4 py-3 text-cyan-400">Replace/delete individual frames</td><td className="px-4 py-3">Re-encode required for frame edits</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-white">Network transfer</td><td className="px-4 py-3">Thousands of files (slow listing)</td><td className="px-4 py-3 text-cyan-400">Single file (fast)</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-white">Corruption risk</td><td className="px-4 py-3 text-cyan-400">One bad frame ≠ lost sequence</td><td className="px-4 py-3">One bad byte can kill the file</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-white">Color precision</td><td className="px-4 py-3 text-cyan-400">16/32-bit EXR possible</td><td className="px-4 py-3">Usually 8-bit (10-bit in ProRes/H.265)</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong className="text-white">Rule of thumb:</strong> use image sequences when you need to <em>work on</em> frames
          (VFX, ML training, animation, analysis). Keep the video container when you need to <em>store or deliver</em> footage
          (archiving, streaming, sharing). Most professional pipelines convert video → sequence at ingest, work on frames,
          then re-encode → video at delivery.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Choosing Extraction Settings by Use Case</h2>
        <p>
          The "right" FPS and format depend entirely on what happens after extraction. Here's a practical decision guide:
        </p>
        <div className="space-y-4 mt-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h4 className="text-cyan-400 font-semibold mb-2">🎬 VFX / Compositing (Nuke, After Effects)</h4>
            <p className="text-gray-400 text-sm">Extract at <strong className="text-white">source FPS</strong> (usually 24/25/30) in <strong className="text-white">PNG or EXR</strong>. Never downsample FPS for VFX — every frame matters for tracking and roto. Use 6-digit zero-padded naming.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h4 className="text-cyan-400 font-semibold mb-2">🤖 ML Training Data (YOLO, classification)</h4>
            <p className="text-gray-400 text-sm"><strong className="text-white">1–5 FPS in JPG (quality 85–92)</strong> is the sweet spot. Consecutive frames at 30 FPS are near-duplicates that waste training time and skew datasets. Deduplicate aggressively — 1,000 diverse frames beat 10,000 redundant ones.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h4 className="text-cyan-400 font-semibold mb-2">🎞️ Animation Reference / Stop Motion</h4>
            <p className="text-gray-400 text-sm"><strong className="text-white">12 FPS in PNG</strong> matches traditional animation timing (animators work "on twos" at 24 FPS). PNG preserves clean edges for tracing and rotoscoping.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h4 className="text-cyan-400 font-semibold mb-2">📊 Video Analysis / Thumbnails</h4>
            <p className="text-gray-400 text-sm"><strong className="text-white">1 FPS in JPG</strong> gives you a contact-sheet view of the entire video at minimal cost. A 10-minute video becomes 600 thumbnails — enough to find any moment visually.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h4 className="text-cyan-400 font-semibold mb-2">🌐 Web Delivery / Previews</h4>
            <p className="text-gray-400 text-sm"><strong className="text-white">WebP at source FPS</strong> — 25–35% smaller than JPG with equal quality, alpha support included. All modern browsers decode it natively.</p>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Frequently Asked Questions</h2>
        <div className="space-y-4 mt-4">
          <details className="border border-gray-800 bg-gray-900/50 rounded-2xl p-5 cursor-pointer group hover:border-cyan-800 transition-colors">
            <summary className="font-medium text-white text-sm md:text-base list-none flex justify-between items-center group-open:text-cyan-400">
              How many images will I get from a 1-minute video at 30 FPS?
              <span className="text-cyan-400 transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">1,800 frames (60 seconds × 30 FPS). At 1080p JPG that's roughly 270–540 MB as a ZIP; PNG would be 1.8–3.6 GB. For long videos, consider extracting at 1–5 FPS or splitting into chapters first.</p>
          </details>
          <details className="border border-gray-800 bg-gray-900/50 rounded-2xl p-5 cursor-pointer group hover:border-cyan-800 transition-colors">
            <summary className="font-medium text-white text-sm md:text-base list-none flex justify-between items-center group-open:text-cyan-400">
              Can I extract frames without losing quality?
              <span className="text-cyan-400 transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">Yes — use PNG output. The extracted frame will match the decoded video frame pixel-for-pixel. Note that the source video itself is already compressed (H.264/H.265), so "lossless" here means no <em>additional</em> loss beyond what the video codec already introduced.</p>
          </details>
          <details className="border border-gray-800 bg-gray-900/50 rounded-2xl p-5 cursor-pointer group hover:border-cyan-800 transition-colors">
            <summary className="font-medium text-white text-sm md:text-base list-none flex justify-between items-center group-open:text-cyan-400">
              Why do professionals prefer image sequences over video files?
              <span className="text-cyan-400 transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">Three reasons: frame-accurate random access (no keyframe seeking), per-frame editability (fix one frame without re-encoding), and corruption isolation (a damaged frame doesn't destroy the sequence). Every major VFX, animation, and color-grading pipeline is built around sequences.</p>
          </details>
          <details className="border border-gray-800 bg-gray-900/50 rounded-2xl p-5 cursor-pointer group hover:border-cyan-800 transition-colors">
            <summary className="font-medium text-white text-sm md:text-base list-none flex justify-between items-center group-open:text-cyan-400">
              What's the difference between extracting at 30 FPS vs every 1 second?
              <span className="text-cyan-400 transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">30 FPS captures every frame (full temporal resolution — 1,800 frames/minute). Every-1-second captures 1 frame per second (60 frames/minute — a 30× reduction). Use full FPS for VFX/analysis where motion matters; use interval extraction for thumbnails, storyboards, and dataset sampling where coverage matters more than continuity.</p>
          </details>
          <details className="border border-gray-800 bg-gray-900/50 rounded-2xl p-5 cursor-pointer group hover:border-cyan-800 transition-colors">
            <summary className="font-medium text-white text-sm md:text-base list-none flex justify-between items-center group-open:text-cyan-400">
              Do extracted frames keep the original video's metadata?
              <span className="text-cyan-400 transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">No — still image formats (JPG/PNG/WebP) don't carry video container metadata like creation date, camera settings, or GPS. The frame's pixel data and dimensions are preserved, but timestamps, codec info, and camera metadata are lost. If you need metadata, record the source video's properties separately before extracting.</p>
          </details>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Conclusion</h2>
        <p>
          An image sequence is the universal interchange format for frame-level work. Whether you're compositing in Nuke, training YOLO, animating in Blender, or analyzing motion in Python — extracting frames with the right FPS, format, and naming saves hours of pipeline friction.
        </p>
        <p className="mt-4">
          Ready to build your sequence? <Link to="/" className="text-cyan-400 hover:text-cyan-300 underline">Extract frames free →</Link>
        </p>

        <div className="my-10">
          <GoogleAdUnit />
        </div>
      </div>
      <AuthorBio />
      </article>
  );
};

export default VideoToImageSequenceExplained;