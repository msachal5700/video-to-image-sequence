import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import Breadcrumb from '../../components/Breadcrumb';
import GoogleAdUnit from '../../components/GoogleAdUnit';

const WhatIsVideoFrameRate: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "What Is Video Frame Rate (FPS) — Complete Guide for Frame Extraction",
      "description": "Understanding FPS: what it means, common standards (24/25/30/60), how it affects frame extraction, and choosing the right FPS for your workflow.",
      "url": "https://www.videotoimagesequence.online/blog/what-is-video-frame-rate",
      "mainEntityOfPage": "https://www.videotoimagesequence.online/blog/what-is-video-frame-rate",
      "keywords": ["what is video frame rate", "FPS explained", "video frame rate standards", "24fps vs 30fps", "frame rate for extraction"],
      "datePublished": "2026-09-12",
      "dateModified": "2026-09-12",
      "author": { "@type": "Person", "name": "Muhammad Sachal", "url": "https://www.linkedin.com/in/sachalspeaks/" },
      "publisher": { "@type": "Organization", "name": "Video to Image Sequence Online" },
      "image": "https://www.videotoimagesequence.online/og-image.png"
    });
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return (
    <article className="max-w-3xl mx-auto py-16 px-6 font-sans">
      <SEOHead
        title="What Is Video Frame Rate (FPS) — Complete Guide for Frame Extraction"
        description="Understanding FPS: what it means, common standards (24/25/30/60), how it affects frame extraction, and choosing the right FPS for your workflow."
        canonical="https://www.videotoimagesequence.online/blog/what-is-video-frame-rate"
        ogTitle="What Is Video Frame Rate (FPS) — Complete Guide"
        ogDescription="FPS explained: 24/25/30/60 standards, how frame rate affects extraction, choosing the right FPS for VFX, ML, animation, web."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="article"
        articleDate="2026-09-12"
        keywords="what is video frame rate, FPS explained, video frame rate standards, 24fps vs 30fps, frame rate for extraction guide"
      />

      <Breadcrumb items={[
        { label: 'Blog', path: '/blog' },
        { label: 'What Is Video Frame Rate' }
      ]} />

      <div className="mb-10 text-center mt-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">What Is Video Frame Rate (FPS)?</h1>
        <p className="text-cyan-400 font-mono text-sm tracking-wider uppercase">Sep 12, 2026 • 7 min read</p>
      </div>

      <div className="text-gray-300 space-y-6 leading-relaxed text-lg lg:text-xl">
        <p className="text-xl text-gray-100">
          <strong className="text-cyan-400">FPS (Frames Per Second)</strong> is the number of individual still images displayed per second to create the illusion of motion. Video is a flipbook — each "frame" is a complete image. Play them fast enough and your brain merges them into continuous motion.
        </p>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">The Standards & Where They Came From</h2>

        <div className="overflow-x-auto rounded-2xl border border-gray-800 my-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900 text-white uppercase text-xs font-mono">
              <tr>
                <th className="px-4 py-3">FPS</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Origin</th>
                <th className="px-4 py-3">Used By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-gray-900/50">
                <td className="px-4 py-3 font-bold text-cyan-400">24</td>
                <td className="px-4 py-3">Cinema / Film</td>
                <td className="px-4 py-3">Sound film standardization (1920s)</td>
                <td className="px-4 py-3">Movies, Netflix, cinematic content</td>
              </tr>
              <tr className="hover:bg-gray-900/50">
                <td className="px-4 py-3 font-bold text-cyan-400">25</td>
                <td className="px-4 py-3">PAL (Europe)</td>
                <td className="px-4 py-3">50 Hz power grid sync (1960s)</td>
                <td className="px-4 py-3">EU broadcast, DVD, some cameras</td>
              </tr>
              <tr className="hover:bg-gray-900/50">
                <td className="px-4 py-3 font-bold text-cyan-400">29.97</td>
                <td className="px-4 py-3">NTSC (US/Japan)</td>
                <td className="px-4 py-3">60 Hz power grid + color subcarrier</td>
                <td className="px-4 py-3">US broadcast, legacy TV</td>
              </tr>
              <tr className="hover:bg-gray-900/50">
                <td className="px-4 py-3 font-bold text-cyan-400">30</td>
                <td className="px-4 py-3">NTSC (modern) / Web</td>
                <td className="px-4 py-3">60 Hz / 2 (simplified)</td>
                <td className="px-4 py-3">YouTube, social media, gaming, phones</td>
              </tr>
              <tr className="hover:bg-gray-900/50">
                <td className="px-4 py-3 font-bold text-cyan-400">50</td>
                <td className="px-4 py-3">PAL High Frame Rate</td>
                <td className="px-4 py-3">2× 25 (sports)</td>
                <td className="px-4 py-3">EU sports broadcast</td>
              </tr>
              <tr className="hover:bg-gray-900/50">
                <td className="px-4 py-3 font-bold text-cyan-400">59.94 / 60</td>
                <td className="px-4 py-3">NTSC HFR / Gaming</td>
                <td className="px-4 py-3">2× 29.97 / 60 Hz</td>
                <td className="px-4 py-3">US sports, gaming, slow-mo, VR</td>
              </tr>
              <tr className="hover:bg-gray-900/50">
                <td className="px-4 py-3 font-bold text-cyan-400">120+</td>
                <td className="px-4 py-3">High Speed / VR</td>
                <td className="px-4 py-3">Specialty cameras</td>
                <td className="px-4 py-3">Slow-motion, VR, scientific</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Why 29.97 and Not 30? (The Drop-Frame Mystery)</h2>
        <p>
          NTSC color TV added a 3.58 MHz chroma subcarrier. To prevent interference with the audio carrier, the frame rate was slowed by 0.1%: <code>30 × 1000/1001 = 29.97002997...</code>
        </p>
        <p>
          Over an hour, 30 FPS drifts 3.6 seconds vs real time. <strong>Drop-frame timecode</strong> skips frame numbers 00 and 01 every minute (except every 10th minute) to stay synced to wall clock. <strong>This doesn't drop actual frames</strong> — just the numbering.
        </p>
        <div className="bg-yellow-950/30 border border-yellow-800 rounded-xl p-4 my-4">
          <strong className="text-yellow-400">⚠️ For frame extraction:</strong> If your source is 29.97, extracting at "30 FPS" in our tool will give you slightly more frames than real-time seconds. For precise timing, match your extraction FPS to the source's actual frame rate.
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">How FPS Affects Frame Extraction</h2>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Extraction FPS ≠ Source FPS</h3>
        <p>You can extract at any FPS regardless of the video's native frame rate:</p>
        <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-400">
          <li><strong>Source 30 FPS, Extract 1 FPS:</strong> Get 1 frame every 30 source frames (every second).</li>
          <li><strong>Source 24 FPS, Extract 30 FPS:</strong> Frames duplicated/interpolated — our tool seeks to nearest timestamps.</li>
          <li><strong>Source 60 FPS, Extract 60 FPS:</strong> True 1:1 frame mapping — every source frame becomes an image.</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Frame Interval vs FPS</h3>
        <p>Some tools use "interval" (every N frames) instead of FPS:</p>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm">
          <code>FPS = Source FPS / Interval</code>
        </div>
        <p className="mt-2">Example: 30 FPS source, interval 5 → 6 extracted FPS. Our tool uses FPS directly — more intuitive.</p>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Choosing Extraction FPS by Workflow</h2>

        <div className="overflow-x-auto rounded-2xl border border-gray-800 my-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900 text-white uppercase text-xs font-mono">
              <tr>
                <th className="px-4 py-3">Workflow</th>
                <th className="px-4 py-3 text-center">Recommended Extraction FPS</th>
                <th className="px-4 py-3">Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">VFX Plates / Compositing</td><td className="px-4 py-3 text-center text-cyan-400">Match source (24/25/30/60)</td><td className="px-4 py-3">Every frame needed for pixel-perfect alignment</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Rotoscoping / Roto Paint</td><td className="px-4 py-3 text-center text-cyan-400">Match source (all frames)</td><td className="px-4 py-3">Every frame for accurate mattes</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Camera Tracking / Matchmove</td><td className="px-4 py-3 text-center text-cyan-400">Match source (all frames)</td><td className="px-4 py-3">More frames = better solve</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Animation Reference</td><td className="px-4 py-3 text-center text-cyan-400">12 / 15 / 24</td><td className="px-4 py-3">12 = classic 2s; 15 = smooth; 24 = film</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Game Sprite Sheets</td><td className="px-4 py-3 text-center text-cyan-400">All frames (native)</td><td className="px-4 py-3">Preserve original timing for engine import</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">ML Classification</td><td className="px-4 py-3 text-center text-cyan-400">1</td><td className="px-4 py-3">Max temporal diversity, minimal redundancy</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Object Detection (YOLO)</td><td className="px-4 py-3 text-center text-cyan-400">1–3</td><td className="px-4 py-3">Balance box accuracy vs dataset size</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Instance Segmentation</td><td className="px-4 py-3 text-center text-cyan-400">2–5</td><td className="px-4 py-3">Pixel-perfect masks need more samples</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Video Tracking (DeepSORT)</td><td className="px-4 py-3 text-center text-cyan-400">5–10</td><td className="px-4 py-3">Temporal continuity for ID association</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Action Recognition</td><td className="px-4 py-3 text-center text-cyan-400">Clip sampling (8–16/clip)</td><td className="px-4 py-3">Uniform temporal sampling, not frame-level</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Lecture / Slide Capture</td><td className="px-4 py-3 text-center text-cyan-400">1</td><td className="px-4 py-3">One frame per second = slide deck</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Social Media / Thumbnails</td><td className="px-4 py-3 text-center text-cyan-400">Custom / Exact timestamp</td><td className="px-4 py-3">Pick the single best frame</td></tr>
            </tbody>
          </table>
        </div>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Variable Frame Rate (VFR) vs Constant (CFR)</h2>
        <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-400">
          <li><strong>CFR (Constant):</strong> Every frame exactly 1/FPS seconds apart. Standard for broadcast, cinema, most phone recordings.</li>
          <li><strong>VFR (Variable):</strong> Frame timing varies — screen recordings, Zoom calls, some mobile apps save space by dropping duplicate frames.</li>
        </ul>
        <p>Our tool handles VFR by seeking to exact timestamps. At "30 FPS" extraction, it targets t=0, 0.033s, 0.066s... regardless of source frame timing.</p>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Slow Motion & High Frame Rate</h2>
        <p>High-speed cameras record at 120/240/480/960 FPS but often containerize at 30/60 FPS with repeated frames or metadata flags.</p>
        <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-400">
          <li><strong>True HFR:</strong> Source 240 FPS, extract 240 FPS → slow-mo playback at 30 FPS = 8× slowdown.</li>
          <li><strong>Container HFR:</strong> Source says 30 FPS but has 240 unique frames → extract "all frames" or 240 FPS to get them all.</li>
          <li><strong>Our tool:</strong> Set extraction FPS to the container's reported rate × slowdown factor, or use "all frames" mode.</li>
        </ul>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">FPS & File Size Math</h2>
        <p>Quick estimate for planning storage/bandwidth:</p>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm">
          <code>Frames = Duration (seconds) × Extraction FPS</code>
        </div>
        <p className="mt-2">Storage estimates (1080p, 10-second clip):</p>
        <div className="overflow-x-auto rounded-2xl border border-gray-800 my-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900 text-white uppercase text-xs font-mono">
              <tr><th className="px-4 py-3">Extraction FPS</th><th className="px-4 py-3 text-center">Frames (10s)</th><th className="px-4 py-3 text-center">JPG ZIP</th><th className="px-4 py-3 text-center">PNG ZIP</th><th className="px-4 py-3 text-center">WebP ZIP</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3">1</td><td className="px-4 py-3 text-center">10</td><td className="px-4 py-3 text-center">~1 MB</td><td className="px-4 py-3 text-center">~10 MB</td><td className="px-4 py-3 text-center">~0.7 MB</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3">5</td><td className="px-4 py-3 text-center">50</td><td className="px-4 py-3 text-center">~5 MB</td><td className="px-4 py-3 text-center">~50 MB</td><td className="px-4 py-3 text-center">~3 MB</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3">10</td><td className="px-4 py-3 text-center">100</td><td className="px-4 py-3 text-center">~10 MB</td><td className="px-4 py-3 text-center">~100 MB</td><td className="px-4 py-3 text-center">~7 MB</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3">24</td><td className="px-4 py-3 text-center">240</td><td className="px-4 py-3 text-center">~24 MB</td><td className="px-4 py-3 text-center">~240 MB</td><td className="px-4 py-3 text-center">~16 MB</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3">30</td><td className="px-4 py-3 text-center">300</td><td className="px-4 py-3 text-center">~30 MB</td><td className="px-4 py-3 text-center">~300 MB</td><td className="px-4 py-3 text-center">~20 MB</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3">60</td><td className="px-4 py-3 text-center">600</td><td className="px-4 py-3 text-center">~60 MB</td><td className="px-4 py-3 text-center">~600 MB</td><td className="px-4 py-3 text-center">~40 MB</td></tr>
            </tbody>
          </table>
        </div>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Common FPS Mistakes</h2>
        <div className="space-y-4 mt-4">
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ "Extract at 30 FPS for everything"</h4>
            <p className="text-gray-400">Wastes 10× storage for ML classification. Match FPS to task.</p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ Ignoring 29.97 vs 30</h4>
            <p className="text-gray-400">Hour-long 29.97 source at "30 FPS" extraction = 108 extra frames. Use exact timestamp for sync-critical work.</p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ Extracting 60 FPS from 30 FPS source</h4>
            <p className="text-gray-400">Duplicates frames, wastes space. Max useful extraction FPS = source FPS.</p>
          </div>
        </div>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Quick Reference Card</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-2">
          <p className="text-gray-300"><strong className="text-white">Cinema/film:</strong> 24 FPS</p>
          <p className="text-gray-300"><strong className="text-white">EU broadcast:</strong> 25 FPS</p>
          <p className="text-gray-300"><strong className="text-white">US broadcast/YouTube:</strong> 30 FPS (actually 29.97)</p>
          <p className="text-gray-300"><strong className="text-white">Gaming/sports/slow-mo:</strong> 60 FPS</p>
          <p className="text-gray-300"><strong className="text-white">ML classification:</strong> 1 FPS</p>
          <p className="text-gray-300"><strong className="text-white">ML detection/seg:</strong> 2–5 FPS</p>
          <p className="text-gray-300"><strong className="text-white">Animation reference:</strong> 12/15/24 FPS</p>
          <p className="text-gray-300"><strong className="text-white">VFX/roto/tracking:</strong> All frames (match source)</p>
        </div>

        <p className="mt-12 text-center">
          <Link to="/video-frame-extractor" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-2xl text-gray-950 bg-cyan-400 hover:bg-cyan-300 transition-all transform hover:-translate-y-1 shadow-lg shadow-cyan-500/20">
            Extract Frames at Any FPS →
          </Link>
        </p>

        <div className="my-10">
          <GoogleAdUnit />
        </div>
      </div>
    </article>
  );
};

export default WhatIsVideoFrameRate;