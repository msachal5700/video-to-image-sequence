import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import Breadcrumb from '../../components/Breadcrumb';
import GoogleAdUnit from '../../components/GoogleAdUnit';

const HowManyFramesPerSecond: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "How Many Frames Per Second Should You Extract? — FPS Decision Guide",
      "description": "Complete FPS decision guide for frame extraction. Match extraction rate to your workflow: VFX (all frames), ML (1-5 FPS), animation (12-24), thumbnails (exact timestamp). Includes frame count calculator.",
      "url": "https://www.videotoimagesequence.online/blog/how-many-frames-per-second",
      "mainEntityOfPage": "https://www.videotoimagesequence.online/blog/how-many-frames-per-second",
      "keywords": ["how many frames per second", "FPS for frame extraction", "best FPS settings", "frame extraction FPS guide", "frames per second calculator"],
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
        title="How Many Frames Per Second Should You Extract? — FPS Decision Guide"
        description="Complete FPS decision guide for frame extraction. Match extraction rate to your workflow: VFX (all frames), ML (1-5 FPS), animation (12-24), thumbnails (exact timestamp). Includes frame count calculator."
        canonical="https://www.videotoimagesequence.online/blog/how-many-frames-per-second"
        ogTitle="How Many Frames Per Second Should You Extract? — FPS Decision Guide"
        ogDescription="FPS decision guide: VFX=all frames, ML=1-5, animation=12-24, thumbnails=exact. Frame count calculator included. Free tool."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="article"
        articleDate="2026-09-12"
        keywords="how many frames per second, FPS for frame extraction, best FPS settings, frame extraction FPS guide, frames per second calculator"
      />

      <Breadcrumb items={[
        { label: 'Blog', path: '/blog' },
        { label: 'How Many FPS' }
      ]} />

      <div className="mb-10 text-center mt-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">How Many Frames Per Second?</h1>
        <p className="text-cyan-400 font-mono text-sm tracking-wider uppercase">Sep 12, 2026 • 6 min read</p>
      </div>

      <div className="text-gray-300 space-y-6 leading-relaxed text-lg lg:text-xl">
        <p className="text-xl text-gray-100">
          The answer depends entirely on <strong className="text-cyan-400">what you're doing with the frames</strong>. There's no universal "best" FPS — extracting 60 FPS for a classification dataset wastes 98% of your storage. Here's the decision framework.
        </p>

        <div className="bg-cyan-950/20 border border-cyan-800 rounded-2xl p-6 my-8">
          <h3 className="text-cyan-400 font-semibold mb-3">🎯 The Golden Rule</h3>
          <p className="text-gray-300"><strong className="text-white">Extract at the lowest FPS that still achieves your goal.</strong> Every extra frame costs storage, bandwidth, labeling time, and training compute — with diminishing returns.</p>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Quick Decision: What's Your Workflow?</h2>

        <div className="space-y-4 mt-4">
          {[
            { workflow: 'VFX Compositing / Rotoscoping / Camera Tracking', fps: 'All frames (match source)', badge: 'text-cyan-400', reason: 'Every frame needed for pixel-perfect alignment, mattes, solve accuracy' },
            { workflow: 'Blender / Nuke / After Effects Plates', fps: 'All frames (24/25/30/60)', badge: 'text-cyan-400', reason: 'Sequence must match project frame rate exactly' },
            { workflow: 'Game Sprite Sheets / Texture Atlases', fps: 'All frames (native)', badge: 'text-cyan-400', reason: 'Preserve original timing for engine import' },
            { workflow: 'Animation Reference (2D/3D)', fps: '12 / 15 / 24', badge: 'text-yellow-400', reason: '12 = classic 2s; 15 = smooth; 24 = film standard' },
            { workflow: 'YouTube / Social Media Thumbnails', fps: 'Exact timestamp (1 frame)', badge: 'text-pink-400', reason: 'Pick the single best frame — use Exact Timestamp Extractor' },
            { workflow: 'ML Image Classification', fps: '1', badge: 'text-green-400', reason: 'Max temporal diversity, minimal redundancy, smallest dataset' },
            { workflow: 'Object Detection (YOLO, SSD, Faster R-CNN)', fps: '1–3', badge: 'text-green-400', reason: 'Balance box accuracy vs dataset size; 2 FPS typical' },
            { workflow: 'Instance Segmentation (Mask R-CNN)', fps: '2–5', badge: 'text-green-400', reason: 'Pixel-perfect masks need more samples; 3 FPS typical' },
            { workflow: 'Video Tracking (DeepSORT, ByteTrack)', fps: '5–10', badge: 'text-blue-400', reason: 'Temporal continuity for ID association across frames' },
            { workflow: 'Action Recognition (SlowFast, TSM)', fps: 'Clip sampling (8–16/clip)', badge: 'text-blue-400', reason: 'Uniform temporal sampling, not frame-level FPS' },
            { workflow: 'Pose Estimation / Keypoints', fps: '5–10', badge: 'text-blue-400', reason: 'Keypoint precision needs temporal density' },
            { workflow: 'Lecture / Slide / Document Capture', fps: '1', badge: 'text-green-400', reason: 'One frame per second = searchable slide deck' },
            { workflow: 'Software Tutorial / Demo Recording', fps: '5–10', badge: 'text-blue-400', reason: 'Capture UI transitions without overwhelming storage' },
          ].map(({ workflow, fps, badge, reason }) => (
            <div key={workflow} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-white font-semibold text-lg">{workflow}</h3>
                <span className={`font-mono font-bold px-3 py-1 rounded bg-gray-800 ${badge}`}>{fps}</span>
              </div>
              <p className="text-gray-400 text-sm">{reason}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Frame Count Calculator</h2>
        <p>Use this formula to estimate output size before extracting:</p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm">
          <code>Total Frames = Duration (seconds) × Extraction FPS</code>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-800 my-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900 text-white uppercase text-xs font-mono">
              <tr>
                <th className="px-4 py-3">Video Duration</th>
                <th className="px-4 py-3 text-center">@ 1 FPS</th>
                <th className="px-4 py-3 text-center">@ 5 FPS</th>
                <th className="px-4 py-3 text-center">@ 10 FPS</th>
                <th className="px-4 py-3 text-center">@ 24 FPS</th>
                <th className="px-4 py-3 text-center">@ 30 FPS</th>
                <th className="px-4 py-3 text-center">@ 60 FPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">30 seconds</td><td className="px-4 py-3 text-center">30</td><td className="px-4 py-3 text-center">150</td><td className="px-4 py-3 text-center">300</td><td className="px-4 py-3 text-center">720</td><td className="px-4 py-3 text-center">900</td><td className="px-4 py-3 text-center">1,800</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">1 minute</td><td className="px-4 py-3 text-center">60</td><td className="px-4 py-3 text-center">300</td><td className="px-4 py-3 text-center">600</td><td className="px-4 py-3 text-center">1,440</td><td className="px-4 py-3 text-center">1,800</td><td className="px-4 py-3 text-center">3,600</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">5 minutes</td><td className="px-4 py-3 text-center">300</td><td className="px-4 py-3 text-center">1,500</td><td className="px-4 py-3 text-center">3,000</td><td className="px-4 py-3 text-center">7,200</td><td className="px-4 py-3 text-center">9,000</td><td className="px-4 py-3 text-center">18,000</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">10 minutes</td><td className="px-4 py-3 text-center">600</td><td className="px-4 py-3 text-center">3,000</td><td className="px-4 py-3 text-center">6,000</td><td className="px-4 py-3 text-center">14,400</td><td className="px-4 py-3 text-center">18,000</td><td className="px-4 py-3 text-center">36,000</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">30 minutes</td><td className="px-4 py-3 text-center">1,800</td><td className="px-4 py-3 text-center">9,000</td><td className="px-4 py-3 text-center">18,000</td><td className="px-4 py-3 text-center">43,200</td><td className="px-4 py-3 text-center">54,000</td><td className="px-4 py-3 text-center">108,000</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">1 hour</td><td className="px-4 py-3 text-center">3,600</td><td className="px-4 py-3 text-center">18,000</td><td className="px-4 py-3 text-center">36,000</td><td className="px-4 py-3 text-center">86,400</td><td className="px-4 py-3 text-center">108,000</td><td className="px-4 py-3 text-center">216,000</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Storage Estimates (1080p, JPG vs PNG vs WebP)</h2>

        <div className="overflow-x-auto rounded-2xl border border-gray-800 my-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900 text-white uppercase text-xs font-mono">
              <tr>
                <th className="px-4 py-3">Extraction</th>
                <th className="px-4 py-3 text-center">Frames</th>
                <th className="px-4 py-3 text-center">JPG ZIP</th>
                <th className="px-4 py-3 text-center">PNG ZIP</th>
                <th className="px-4 py-3 text-center">WebP ZIP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">1 min @ 1 FPS</td><td className="px-4 py-3 text-center">60</td><td className="px-4 py-3 text-center">~1 MB</td><td className="px-4 py-3 text-center">~10 MB</td><td className="px-4 py-3 text-center">~0.7 MB</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">1 min @ 5 FPS</td><td className="px-4 py-3 text-center">300</td><td className="px-4 py-3 text-center">~5 MB</td><td className="px-4 py-3 text-center">~50 MB</td><td className="px-4 py-3 text-center">~3 MB</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">1 min @ 30 FPS</td><td className="px-4 py-3 text-center">1,800</td><td className="px-4 py-3 text-center">~30 MB</td><td className="px-4 py-3 text-center">~300 MB</td><td className="px-4 py-3 text-center">~20 MB</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">10 min @ 1 FPS</td><td className="px-4 py-3 text-center">600</td><td className="px-4 py-3 text-center">~10 MB</td><td className="px-4 py-3 text-center">~100 MB</td><td className="px-4 py-3 text-center">~7 MB</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">10 min @ 30 FPS</td><td className="px-4 py-3 text-center">18,000</td><td className="px-4 py-3 text-center">~300 MB</td><td className="px-4 py-3 text-center">~3 GB</td><td className="px-4 py-3 text-center">~200 MB</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">1 hour @ 30 FPS</td><td className="px-4 py-3 text-center">108,000</td><td className="px-4 py-3 text-center">~1.8 GB</td><td className="px-4 py-3 text-center">~18 GB</td><td className="px-4 py-3 text-center">~1.2 GB</td></tr>
            </tbody>
          </table>
        </div>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Browser Memory Limits — Practical Ceilings</h2>
        <p>Your browser tab has a JavaScript heap limit (~1.5–2 GB on desktop, ~500 MB–1 GB on mobile). Large extractions can crash the tab.</p>

        <div className="space-y-3 mt-4">
          <div className="bg-yellow-950/30 border border-yellow-800 rounded-xl p-4">
            <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Safe Extraction Limits</h4>
            <ul className="text-gray-400 text-sm space-y-1 list-disc pl-5">
              <li><strong>Desktop (16 GB RAM):</strong> Up to ~3,000 PNG frames or ~10,000 JPG frames per batch</li>
              <li><strong>Desktop (8 GB RAM):</strong> ~1,500 PNG / ~5,000 JPG</li>
              <li><strong>Mobile (4–6 GB RAM):</strong> ~500 PNG / ~2,000 JPG</li>
            </ul>
          </div>
          <div className="bg-green-950/30 border border-green-800 rounded-xl p-4">
            <h4 className="text-green-400 font-semibold mb-2">✅ Strategies for Large Videos</h4>
            <ul className="text-gray-400 text-sm space-y-1 list-disc pl-5">
              <li>Use <strong className="text-white">WebP</strong> — 25–35% smaller than PNG, same quality</li>
              <li>Lower <strong className="text-white">FPS</strong> — 5 FPS instead of 30 cuts frames 6×</li>
              <li><strong className="text-white">Chunk it</strong> — Process 5-minute segments, merge ZIPs after</li>
              <li><strong className="text-white">Close tabs</strong> — Free JS heap before starting</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">When to Break the Rules</h2>

        <div className="space-y-4 mt-4">
          <div className="bg-blue-950/30 border border-blue-800 rounded-xl p-4">
            <h4 className="text-blue-400 font-semibold mb-2">🔬 Research / Forensics — Extract More</h4>
            <p className="text-gray-400">Legal evidence, medical analysis, failure investigation — extract all frames. Storage is cheap; missing a frame isn't.</p>
          </div>
          <div className="bg-blue-950/30 border border-blue-800 rounded-xl p-4">
            <h4 className="text-blue-400 font-semibold mb-2">🎬 High-Speed / Slow-Mo — Extract Source FPS</h4>
            <p className="text-gray-400">240 FPS source → extract 240 FPS. Don't downsample; you lose the slow-mo data.</p>
          </div>
          <div className="bg-blue-950/30 border border-blue-800 rounded-xl p-4">
            <h4 className="text-blue-400 font-semibold mb-2">🤖 ML Active Learning — Start Low, Increase</h4>
            <p className="text-gray-400">Extract 1 FPS → train → find failure cases → re-extract those videos at 5 FPS. Iterative beats bulk.</p>
          </div>
        </div>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Our Tool's FPS Presets</h2>
        <p className="mb-4">The frame extractor includes these presets (plus custom via slider):</p>

        <div className="flex flex-wrap gap-3 mb-8">
          {['1', '5', '10', '12', '15', '24', '25', '30', '60'].map(fps => (
            <span key={fps} className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-white font-mono font-semibold hover:border-cyan-500 transition-colors">{fps} FPS</span>
          ))}
        </div>

        <p className="text-gray-400">Plus a slider for any value 1–60. The tool shows estimated frame count and warns if you're approaching memory limits.</p>

        <p className="mt-12 text-center">
          <Link to="/video-frame-extractor" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-2xl text-gray-950 bg-cyan-400 hover:bg-cyan-300 transition-all transform hover:-translate-y-1 shadow-lg shadow-cyan-500/20">
            Try the FPS Selector Free →
          </Link>
        </p>

        <div className="my-10">
          <GoogleAdUnit />
        </div>
      </div>
    </article>
  );
};

export default HowManyFramesPerSecond;