import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import Breadcrumb from '../../components/Breadcrumb';
import GoogleAdUnit from '../../components/GoogleAdUnit';

const VideoCodecsExplained: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "Video Codecs Explained — H.264, HEVC, VP9, AV1, ProRes for Frame Extraction",
      "description": "Complete guide to video codecs for frame extraction. Which codecs work in browsers, which need transcoding, hardware acceleration support, and troubleshooting codec errors.",
      "url": "https://www.videotoimagesequence.online/blog/video-codecs-explained",
      "mainEntityOfPage": "https://www.videotoimagesequence.online/blog/video-codecs-explained",
      "keywords": ["video codecs explained", "H.264 vs HEVC", "VP9 AV1 codec", "ProRes frame extraction", "browser codec support", "video codec troubleshooting"],
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
        title="Video Codecs Explained — H.264, HEVC, VP9, AV1, ProRes for Frame Extraction"
        description="Complete guide to video codecs for frame extraction. Which codecs work in browsers, which need transcoding, hardware acceleration support, and troubleshooting codec errors."
        canonical="https://www.videotoimagesequence.online/blog/video-codecs-explained"
        ogTitle="Video Codecs Explained — Complete Guide for Frame Extraction"
        ogDescription="H.264, HEVC, VP9, AV1, ProRes: which work in browsers, which need transcoding, hardware acceleration, troubleshooting for frame extraction."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="article"
        articleDate="2026-09-12"
        keywords="video codecs explained, H.264 vs HEVC, VP9 AV1 codec guide, ProRes frame extraction, browser codec support, codec troubleshooting"
      />

      <Breadcrumb items={[
        { label: 'Blog', path: '/blog' },
        { label: 'Video Codecs Explained' }
      ]} />

      <div className="mb-10 text-center mt-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">Video Codecs Explained</h1>
        <p className="text-cyan-400 font-mono text-sm tracking-wider uppercase">Sep 12, 2026 • 10 min read</p>
      </div>

      <div className="text-gray-300 space-y-6 leading-relaxed text-lg lg:text-xl">
        <p className="text-xl text-gray-100">
          A <strong className="text-cyan-400">codec</strong> (coder-decoder) is the algorithm that compresses raw video into a file and decompresses it for playback. Your browser must support the codec to extract frames — no codec support = no extraction.
        </p>

        <div className="bg-cyan-950/20 border border-cyan-800 rounded-2xl p-6 my-8">
          <h3 className="text-cyan-400 font-semibold mb-3">🎯 TL;DR — Codec Support in Our Tool</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-900 text-white uppercase text-xs font-mono">
                <tr>
                  <th className="px-4 py-3">Codec</th>
                  <th className="px-4 py-3 text-center">Browser Support</th>
                  <th className="px-4 py-3 text-center">Container</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-cyan-400">H.264 / AVC</td><td className="px-4 py-3 text-center text-green-400">✅ Universal</td><td className="px-4 py-3 text-center">MP4, MOV</td><td className="px-4 py-3 text-green-400">Works everywhere — recommended</td></tr>
                <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">HEVC / H.265</td><td className="px-4 py-3 text-center text-yellow-400">⚠️ Varies</td><td className="px-4 py-3 text-center">MP4, MOV</td><td className="px-4 py-3 text-yellow-400">Safari ✅, Chrome/Edge need HW, Firefox ❌</td></tr>
                <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">VP8</td><td className="px-4 py-3 text-center text-green-400">✅ Universal</td><td className="px-4 py-3 text-center">WebM</td><td className="px-4 py-3 text-green-400">Works everywhere (legacy WebM)</td></tr>
                <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">VP9</td><td className="px-4 py-3 text-center text-green-400">✅ Modern</td><td className="px-4 py-3 text-center">WebM</td><td className="px-4 py-3 text-green-400">Chrome/Firefox/Edge/Safari 14+ ✅</td></tr>
                <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">AV1</td><td className="px-4 py-3 text-center text-yellow-400">⚠️ Modern</td><td className="px-4 py-3 text-center">WebM, MP4</td><td className="px-4 py-3 text-yellow-400">Chrome/Firefox/Edge ✅, Safari 16+ ⚠️</td></tr>
                <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">ProRes 422/4444</td><td className="px-4 py-3 text-center text-red-400">❌ None</td><td className="px-4 py-3 text-center">MOV</td><td className="px-4 py-3 text-red-400">Transcode to H.264 first</td></tr>
                <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">DNxHD/DNxHR</td><td className="px-4 py-3 text-center text-red-400">❌ None</td><td className="px-4 py-3 text-center">MOV</td><td className="px-4 py-3 text-red-400">Transcode to H.264 first</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Codec Deep Dives</h2>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">H.264 / AVC — The Universal Standard</h3>
        <p><strong>Status:</strong> ✅ Works everywhere — Chrome, Firefox, Safari, Edge, iOS, Android, Smart TVs.</p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
          <li>Mature, hardware-accelerated on every device since ~2010.</li>
          <li>8-bit 4:2:0 (standard), 10-bit 4:2:2 (Hi10P) — browser support for 10-bit varies.</li>
          <li>Baseline/Main/High profiles — High profile is standard for HD.</li>
          <li><strong>Best practice:</strong> Encode at CRF 18–20, preset medium/fast for extraction source.</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">HEVC / H.265 — The Efficiency Upgrade</h3>
        <p><strong>Status:</strong> ⚠️ Hardware-dependent. ~50% better compression than H.264.</p>
        <div className="overflow-x-auto rounded-xl border border-gray-800 my-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900 text-white uppercase text-xs font-mono">
              <tr><th className="px-4 py-3">Platform</th><th className="px-4 py-3 text-center">HEVC Support</th><th className="px-4 py-3">Notes</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3">Safari (macOS/iOS)</td><td className="px-4 py-3 text-center text-green-400">✅ Native</td><td className="px-4 py-3">Full hardware decode since 2017</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3">Chrome (Windows)</td><td className="px-4 py-3 text-center text-yellow-400">⚠️ With HW</td><td className="px-4 py-3">Needs Intel 7th gen+ / AMD RDNA / Nvidia Pascal+</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3">Chrome (Mac)</td><td className="px-4 py-3 text-center text-green-400">✅ Via VideoToolbox</td><td className="px-4 py-3">Apple Silicon / T2 / AMD dGPU</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3">Firefox</td><td className="px-4 py-3 text-center text-red-400">❌ No</td><td className="px-4 py-3">Licensing refusal — no HEVC support</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3">Edge (Windows)</td><td className="px-4 py-3 text-center text-yellow-400">⚠️ With HW</td><td className="px-4 py-3">Same as Chrome — needs HEVC extensions</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2"><strong>Our tool:</strong> Falls back to software decode if hardware missing — slower, may fail on high-res. Transcode to H.264 for guaranteed extraction.</p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">VP9 — Google's Web Codec</h3>
        <p><strong>Status:</strong> ✅ Excellent modern support. Royalty-free, used by YouTube, Netflix.</p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
          <li>Native in Chrome, Firefox, Edge, Safari 14+.</li>
          <li>Supports alpha channel (VP9 with alpha) — perfect for transparent WebM.</li>
          <li>Hardware decode on most devices 2016+.</li>
          <li><strong>Best for:</strong> WebM screen recordings, web delivery, transparency.</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">AV1 — The Next Generation</h3>
        <p><strong>Status:</strong> ⚠️ Cutting edge. ~30% better than HEVC, royalty-free.</p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
          <li>Chrome 70+, Firefox 67+, Edge 79+, Safari 16.4+ (partial).</li>
          <li>Hardware decode: Intel 11th gen+, AMD RDNA2+, Apple M1+, Nvidia RTX 30-series+.</li>
          <li>Supports alpha, HDR, 10/12-bit.</li>
          <li><strong>Note:</strong> Safari support still evolving — test before relying on it.</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">ProRes / DNxHD — Professional Intermediates</h3>
        <p><strong>Status:</strong> ❌ <strong>Zero browser support.</strong> These are editing codecs, not delivery codecs.</p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-400">
          <li>ProRes 422/422 HQ/4444/4444 XQ — 10-bit, 4:2:2 or 4:4:4, alpha in 4444.</li>
          <li>DNxHD/DNxHR — Avid equivalent, similar profile structure.</li>
          <li>File sizes: 100–500 Mbps (vs 5–20 Mbps for H.264).</li>
          <li><strong>Must transcode before extraction.</strong></li>
        </ul>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Transcoding for Extraction — Quick Commands</h2>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">FFmpeg — Universal Transcoder</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400"><code># ProRes MOV → H.264 MP4 (high quality, fast)
ffmpeg -i input.mov -c:v libx264 -crf 18 -preset fast -pix_fmt yuv420p output.mp4

# ProRes 4444 (with alpha) → WebM VP9 with alpha
ffmpeg -i input.mov -c:v libvpx-vp9 -auto-alt-ref 0 -pix_fmt yuva420p -b:v 0 output.webm

# DNxHR → H.264 MP4
ffmpeg -i input.mov -c:v libx264 -crf 18 -preset fast output.mp4

# HEVC → H.264 (if browser can't decode)
ffmpeg -i input.mp4 -c:v libx264 -crf 18 -preset fast output.mp4

# Any → H.264 MP4 (safe universal)
ffmpeg -i input.* -c:v libx264 -crf 18 -preset fast -pix_fmt yuv420p -movflags +faststart output.mp4</code></pre>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">HandBrake — GUI Alternative</h3>
        <ol className="list-decimal pl-6 space-y-2 mt-4 text-gray-400">
          <li>Open HandBrake → Load source file</li>
          <li>Preset: <strong>"Fast 1080p30"</strong> or <strong>"HQ 1080p30"</strong></li>
          <li>Video tab: <strong>H.264 (x264)</strong>, RF 18–20, <strong>Fast</strong> or <strong>Medium</strong> preset</li>
          <li>Dimensions: Keep source resolution (or downscale if 4K+)</li>
          <li>Start Encode → Save as <strong>.mp4</strong></li>
        </ol>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Shutter Encoder — Pro Alternative</h3>
        <p className="mt-2">Free, powerful, supports ProRes/DNxHR input → H.264/HEVC/VP9/AV1 output. Good batch queue.</p>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Common Extraction Errors & Fixes</h2>

        <div className="space-y-4 mt-4">
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ "Worker/Decoder Failed to Start"</h4>
            <p className="text-gray-400"><strong>Cause:</strong> Codec not supported by browser WebCodecs (ProRes, DNxHR, HEVC without HW).</p>
            <p className="text-gray-400 mt-2"><strong>Fix:</strong> Transcode to H.264 MP4 using FFmpeg/HandBrake above.</p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ "SEEK_TIMEOUT: Video seeking timed out"</h4>
            <p className="text-gray-400"><strong>Cause:</strong> Corrupted file, non-standard container, or codec browser can't seek in.</p>
            <p className="text-gray-400 mt-2"><strong>Fix:</strong> Remux with FFmpeg: <code className="bg-gray-900 px-1.5 py-0.5 rounded">ffmpeg -i input.mov -c copy output.mp4</code> (no re-encode, fixes container).</p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ "ZIP_FAILED: Could not create ZIP archive"</h4>
            <p className="text-gray-400"><strong>Cause:</strong> Too many frames / too large → browser OOM.</p>
            <p className="text-gray-400 mt-2"><strong>Fix:</strong> Lower FPS, use WebP/JPG, chunk video, close other tabs.</p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ "CODEC_UNSUPPORTED"</h4>
            <p className="text-gray-400"><strong>Cause:</strong> Browser can't decode the codec at all (ProRes, DNxHR, obscure codecs).</p>
            <p className="text-gray-400 mt-2"><strong>Fix:</strong> Transcode to H.264. That's it — H.264 always works.</p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ Black frames / green frames / corrupted output</h4>
            <p className="text-gray-400"><strong>Cause:</strong> Variable frame rate (VFR) confusing seek, or hardware decoder bug.</p>
            <p className="text-gray-400 mt-2"><strong>Fix:</strong> Force CFR in transcode: <code className="bg-gray-900 px-1.5 py-0.5 rounded">ffmpeg -i input -vsync cfr -c:v libx264 ...</code></p>
          </div>
        </div>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">How to Check Your Video's Codec</h2>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">FFprobe (CLI)</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400"><code>ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,codec_long_name,profile,pix_fmt,width,height,r_frame_rate -of csv=p=0 input.mp4</code></pre>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">MediaInfo (GUI)</h3>
        <p className="mt-2">Free, cross-platform. Drag file → shows codec, profile, bitrate, frame rate, color space.</p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Browser DevTools</h3>
        <ol className="list-decimal pl-6 space-y-2 mt-4 text-gray-400">
          <li>Open video in new tab (or our tool)</li>
          <li>Right-click video → "Show video info" (Chrome) / "Video stats for nerds" (YouTube)</li>
          <li>Shows codec, resolution, frame rate, bitrate</li>
        </ol>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Codec Selection Checklist for Extraction</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
            <span className="text-white">Source is H.264 MP4/MOV → ✅ Extract directly</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
            <span className="text-white">Source is WebM VP8/VP9 → ✅ Extract directly</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
            <span className="text-white">Source is HEVC → Test in Safari first, else transcode</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
            <span className="text-white">Source is ProRes/DNxHR → Transcode to H.264 first</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
            <span className="text-white">Source is AV1 → Test in Chrome/Edge, else transcode</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
            <span className="text-white">Extraction fails → Transcode to H.264 CRF 18, retry</span>
          </label>
        </div>

        <p className="mt-12 text-center">
          <Link to="/video-frame-extractor" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-2xl text-gray-950 bg-cyan-400 hover:bg-cyan-300 transition-all transform hover:-translate-y-1 shadow-lg shadow-cyan-500/20">
            Extract Frames Free →
          </Link>
        </p>

        <div className="my-10">
          <GoogleAdUnit />
        </div>
      </div>
    </article>
  );
};

export default VideoCodecsExplained;