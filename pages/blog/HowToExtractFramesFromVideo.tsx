import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import Breadcrumb from '../../components/Breadcrumb';
import GoogleAdUnit from '../../components/GoogleAdUnit';

const HowToExtractFramesFromVideo: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "How to Extract Frames from Video — 3-Step Free Guide (2026)",
      "description": "Step-by-step guide to extract frames from video for free. Covers online tool, FFmpeg CLI, and Python automation. Includes FPS selection, format choice, and troubleshooting.",
      "url": "https://www.videotoimagesequence.online/blog/how-to-extract-frames-from-video",
      "mainEntityOfPage": "https://www.videotoimagesequence.online/blog/how-to-extract-frames-from-video",
      "keywords": ["how to extract frames from video", "video to frames free", "extract frames online", "FFmpeg extract frames", "Python video to frames"],
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
        title="How to Extract Frames from Video — 3-Step Free Guide (2026)"
        description="Step-by-step guide to extract frames from video for free. Covers online tool, FFmpeg CLI, and Python automation. Includes FPS selection, format choice, and troubleshooting."
        canonical="https://www.videotoimagesequence.online/blog/how-to-extract-frames-from-video"
        ogTitle="How to Extract Frames from Video — 3-Step Free Guide"
        ogDescription="Free online tool, FFmpeg CLI, Python script. 3 steps: upload → choose FPS/format → download ZIP. No upload, runs in browser."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="article"
        articleDate="2026-09-12"
        keywords="how to extract frames from video, video to frames free, extract frames online, FFmpeg extract frames, Python video to frames"
      />

      <Breadcrumb items={[
        { label: 'Blog', path: '/blog' },
        { label: 'How to Extract Frames' }
      ]} />

      <div className="mb-10 text-center mt-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">How to Extract Frames from Video</h1>
        <p className="text-cyan-400 font-mono text-sm tracking-wider uppercase">Sep 12, 2026 • 8 min read</p>
      </div>

      <div className="text-gray-300 space-y-6 leading-relaxed text-lg lg:text-xl">
        <p className="text-xl text-gray-100">
          Three ways to do it — pick the one that fits your workflow. All free, no watermarks, no account needed.
        </p>

        <div className="bg-cyan-950/20 border border-cyan-800 rounded-2xl p-6 my-8">
          <h3 className="text-cyan-400 font-semibold mb-4">⚡ Quickest: Online Tool (This Site)</h3>
          <ol className="list-decimal pl-6 space-y-3 text-gray-300">
            <li><strong>Open</strong> <a href="/video-frame-extractor" className="text-cyan-400 hover:underline font-semibold">Video Frame Extractor</a></li>
            <li><strong>Drop</strong> your video (MP4, MOV, WebM — up to 2 GB)</li>
            <li><strong>Choose</strong> FPS (1–60) and format (JPG/WebP/PNG)</li>
            <li><strong>Click</strong> Extract → Download ZIP</li>
          </ol>
          <p className="mt-4 text-sm text-gray-500">Runs entirely in your browser via WebCodecs. No upload, no server, works offline after first load.</p>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Method 1: Free Online Tool (Recommended)</h2>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Step-by-Step</h3>
        <div className="space-y-4 mt-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2"><span className="bg-cyan-900 text-cyan-400 px-2 py-0.5 rounded font-mono">1</span> Open the Extractor</h4>
            <p className="text-gray-400">Go to <a href="/video-frame-extractor" className="text-cyan-400 hover:underline">videotoimagesequence.online/video-frame-extractor</a>. Works in Chrome, Firefox, Edge, Safari.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2"><span className="bg-cyan-900 text-cyan-400 px-2 py-0.5 rounded font-mono">2</span> Load Your Video</h4>
            <ul className="list-disc pl-6 space-y-1 text-gray-400">
              <li>Drag & drop, or click "Choose File"</li>
              <li>Supported: MP4 (H.264), MOV (H.264), WebM (VP8/VP9)</li>
              <li>Max: ~2 GB (browser memory limit)</li>
              <li><strong>HEVC/ProRes?</strong> Transcode to H.264 first (see <a href="/blog/video-codecs-explained" className="text-cyan-400 hover:underline">codec guide</a>)</li>
            </ul>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2"><span className="bg-cyan-900 text-cyan-400 px-2 py-0.5 rounded font-mono">3</span> Configure Extraction</h4>
            <div className="grid gap-3 md:grid-cols-2 text-gray-400 mt-2">
              <div className="bg-gray-800 p-3 rounded">
                <strong>FPS Presets:</strong> 1, 5, 10, 12, 15, 24, 25, 30, 60
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <strong>Custom FPS:</strong> Slider 1–60
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <strong>Format:</strong> JPG (small), WebP (smaller), PNG (lossless)
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <strong>Quality:</strong> JPG 10–100, WebP 10–100
              </div>
            </div>
            <p className="mt-3"><strong className="text-yellow-400">Tip:</strong> See <a href="/blog/how-many-frames-per-second" className="text-cyan-400 hover:underline">FPS decision guide</a> for task-specific recommendations.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2"><span className="bg-cyan-900 text-cyan-400 px-2 py-0.5 rounded font-mono">4</span> Extract & Download</h4>
            <ul className="list-disc pl-6 space-y-1 text-gray-400">
              <li>Click "Extract Frames" — progress bar shows frames processed</li>
              <li>Frames zip automatically when complete</li>
              <li>Download ZIP → unzip → frames named <code className="bg-gray-900 px-1.5 py-0.5 rounded">frame_000001.jpg</code></li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Advanced Features</h3>
        <div className="grid gap-4 mt-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h4 className="text-cyan-400 font-semibold mb-2">⏱ Exact Timestamp Extractor</h4>
            <p className="text-gray-400">Need frames at specific times? Use <a href="/exact-timestamp-extractor" className="text-cyan-400 hover:underline">Exact Timestamp Extractor</a> — enter timestamps (e.g., 00:01:30.500) and get precise frames.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h4 className="text-cyan-400 font-semibold mb-2">🎞 Image Sequence Export</h4>
            <p className="text-gray-400">For VFX/Blender/After Effects: <a href="/video-to-image-sequence" className="text-cyan-400 hover:underline">Video to Image Sequence</a> tool exports numbered sequences with padding (frame_0001, frame_0002...).</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h4 className="text-cyan-400 font-semibold mb-2">🤖 AI Dataset Export</h4>
            <p className="text-gray-400">For ML training: <a href="/video-frames-for-ai-datasets" className="text-cyan-400 hover:underline">Video Frames for AI Datasets</a> — preset FPS by task, auto-train/val/test split structure.</p>
          </div>
        </div>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Method 2: FFmpeg (Command Line / Automation)</h2>
        <p className="mb-4">Best for: batch processing, CI/CD pipelines, servers, large videos, automation.</p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Basic Extraction</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400"><code># Extract all frames (matches video FPS)
ffmpeg -i input.mp4 frames/frame_%06d.jpg

# Extract at specific FPS (e.g., 5 FPS)
ffmpeg -i input.mp4 -vf fps=5 frames/frame_%06d.jpg

# Extract with custom quality (1=best, 31=worst for JPG)
ffmpeg -i input.mp4 -vf fps=5 -q:v 2 frames/frame_%06d.jpg</code></pre>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Format Options</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400"><code># JPG (default)
ffmpeg -i input.mp4 -vf fps=5 -q:v 2 frames/frame_%06d.jpg

# PNG (lossless)
ffmpeg -i input.mp4 -vf fps=5 frames/frame_%06d.png

# WebP (modern, smaller)
ffmpeg -i input.mp4 -vf fps=5 -c:v libwebp -quality 90 frames/frame_%06d.webp

# BMP / TIFF (rare, lossless)
ffmpeg -i input.mp4 -vf fps=5 frames/frame_%06d.bmp</code></pre>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Time Range Extraction</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400"><code># Start at 1:30, extract 30 seconds at 10 FPS
ffmpeg -ss 00:01:30 -t 30 -i input.mp4 -vf fps=10 frames/frame_%06d.jpg

# Extract single frame at exact timestamp
ffmpeg -ss 00:02:15.500 -i input.mp4 -vframes 1 frame_exact.jpg</code></pre>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Batch Process Multiple Videos</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400"><code>{`# Windows (PowerShell)
Get-ChildItem *.mp4 | ForEach-Object {'{'}
  $name = $_.BaseName
  ffmpeg -i $_.Name -vf fps=5 "$name/frame_%06d.jpg"
{'}'}

# Linux/macOS (Bash)
for f in *.mp4; do
  name="\${f%.*}"
  mkdir -p "\$name"
  ffmpeg -i "\$f" -vf fps=5 "\$name/frame_%06d.jpg"
done`}</code></pre>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Method 3: Python (OpenCV / MoviePy)</h2>
        <p className="mb-4">Best for: ML pipelines, data loading, custom preprocessing, integration with training code.</p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">OpenCV (Fast, No Dependencies Beyond opencv-python)</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400"><code>{`import cv2
import os

def extract_frames_opencv(video_path, output_dir, fps=5, format='jpg', quality=90):
    os.makedirs(output_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    video_fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(video_fps / fps)
    
    count = 0
    saved = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if count % frame_interval == 0:
            name = f"frame_{saved:06d}.{format}"
            if format == 'jpg':
                cv2.imwrite(os.path.join(output_dir, name), frame, [cv2.IMWRITE_JPEG_QUALITY, quality])
            elif format == 'png':
                cv2.imwrite(os.path.join(output_dir, name), frame)
            elif format == 'webp':
                cv2.imwrite(os.path.join(output_dir, name), frame, [cv2.IMWRITE_WEBP_QUALITY, quality])
            saved += 1
        count += 1
    cap.release()
    print(f"Extracted {saved} frames to {output_dir}")

# Usage
extract_frames_opencv('video.mp4', 'frames/', fps=5, format='jpg', quality=90)`}</code></pre>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">MoviePy (Higher Level, Handles More Codecs)</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400"><code>{`from moviepy.editor import VideoFileClip
import os

def extract_frames_moviepy(video_path, output_dir, fps=5, format='jpg'):
    os.makedirs(output_dir, exist_ok=True)
    clip = VideoFileClip(video_path)
    duration = clip.duration
    
    # Sample at regular intervals
    times = [i / fps for i in range(int(duration * fps) + 1)]
    
    for i, t in enumerate(times):
        if t > duration:
            break
        frame = clip.get_frame(t)
        name = f"frame_{i:06d}.{format}"
        from PIL import Image
        Image.fromarray(frame).save(os.path.join(output_dir, name), quality=90 if format == 'jpg' else None)
    
    clip.close()
    print(f"Extracted {len(times)} frames to {output_dir}")

# Usage
extract_frames_moviepy('video.mp4', 'frames/', fps=5, format='jpg')`}</code></pre>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Comparison: Which Method to Use?</h2>

        <div className="overflow-x-auto rounded-2xl border border-gray-800 my-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900 text-white uppercase text-xs font-mono">
              <tr>
                <th className="px-4 py-3">Criteria</th>
                <th className="px-4 py-3">Online Tool</th>
                <th className="px-4 py-3">FFmpeg</th>
                <th className="px-4 py-3">Python</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Setup</td><td className="px-4 py-3 text-center">Zero</td><td className="px-4 py-3 text-center">Install once</td><td className="px-4 py-3 text-center">pip install</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Max Video Size</td><td className="px-4 py-3 text-center">~2 GB</td><td className="px-4 py-3 text-center">Unlimited</td><td className="px-4 py-3 text-center">RAM dependent</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Batch/Automation</td><td className="px-4 py-3 text-center">Manual</td><td className="px-4 py-3 text-center">Excellent</td><td className="px-4 py-3 text-center">Excellent</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Codecs Supported</td><td className="px-4 py-3 text-center">H.264, VP8/9</td><td className="px-4 py-3 text-center">All</td><td className="px-4 py-3 text-center">Most (via FFmpeg)</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Privacy</td><td className="px-4 py-3 text-center">Local only</td><td className="px-4 py-3 text-center">Local only</td><td className="px-4 py-3 text-center">Local only</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Preview/Seek</td><td className="px-4 py-3 text-center">Visual</td><td className="px-4 py-3 text-center">CLI only</td><td className="px-4 py-3 text-center">Programmatic</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Best For</td><td className="px-4 py-3 text-center">One-offs, quick jobs</td><td className="px-4 py-3 text-center">Batch, servers, CI</td><td className="px-4 py-3 text-center">ML pipelines, custom logic</td></tr>
            </tbody>
          </table>
        </div>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Troubleshooting</h2>

        <div className="space-y-4 mt-4">
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ "File too large" / Browser crashes</h4>
            <p className="text-gray-400">Video exceeds browser memory. <strong>Fix:</strong> Split video (<code className="bg-gray-900 px-1.5 py-0.5 rounded">ffmpeg -i input.mp4 -c copy -segment_time 300 -f segment part_%03d.mp4</code>) or use FFmpeg/Python.</p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ "Codec not supported" (HEVC/ProRes)</h4>
            <p className="text-gray-400">Browser can't decode. <strong>Fix:</strong> Transcode first: <code className="bg-gray-900 px-1.5 py-0.5 rounded">ffmpeg -i input.mov -c:v libx264 -crf 18 -preset fast output.mp4</code></p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ Output frames are black/green/corrupted</h4>
            <p className="text-gray-400">Variable frame rate or seek issue. <strong>Fix:</strong> Force CFR: <code className="bg-gray-900 px-1.5 py-0.5 rounded">ffmpeg -i input.mp4 -vsync cfr -c:v libx264 fixed.mp4</code> then extract.</p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ Wrong number of frames extracted</h4>
            <p className="text-gray-400">FPS math mismatch. <strong>Fix:</strong> Check source FPS: <code className="bg-gray-900 px-1.5 py-0.5 rounded">ffprobe -v error -select_streams v -show_entries stream=r_frame_rate -of csv=p=0 input.mp4</code></p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ ZIP download fails / incomplete</h4>
            <p className="text-gray-400">Too many frames for browser ZIP. <strong>Fix:</strong> Lower FPS, use WebP, or extract in chunks with FFmpeg.</p>
          </div>
        </div>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Quick Reference Card</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 font-mono text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-gray-800 p-3 rounded"><strong>Online:</strong> <a href="/video-frame-extractor" className="text-cyan-400 hover:underline">/video-frame-extractor</a></div>
            <div className="bg-gray-800 p-3 rounded"><strong>Timestamps:</strong> <a href="/exact-timestamp-extractor" className="text-cyan-400 hover:underline">/exact-timestamp-extractor</a></div>
            <div className="bg-gray-800 p-3 rounded"><strong>Sequences:</strong> <a href="/video-to-image-sequence" className="text-cyan-400 hover:underline">/video-to-image-sequence</a></div>
            <div className="bg-gray-800 p-3 rounded"><strong>AI Datasets:</strong> <a href="/video-frames-for-ai-datasets" className="text-cyan-400 hover:underline">/video-frames-for-ai-datasets</a></div>
            <div className="bg-gray-800 p-3 rounded"><strong>Format Guide:</strong> <a href="/blog/jpg-vs-png-vs-webp-video-frames" className="text-cyan-400 hover:underline">/blog/jpg-vs-png-vs-webp-video-frames</a></div>
            <div className="bg-gray-800 p-3 rounded"><strong>FPS Guide:</strong> <a href="/blog/how-many-frames-per-second" className="text-cyan-400 hover:underline">/blog/how-many-frames-per-second</a></div>
            <div className="bg-gray-800 p-3 rounded"><strong>Codec Guide:</strong> <a href="/blog/video-codecs-explained" className="text-cyan-400 hover:underline">/blog/video-codecs-explained</a></div>
            <div className="bg-gray-800 p-3 rounded"><strong>AI Workflow:</strong> <a href="/blog/extract-video-frames-for-ai" className="text-cyan-400 hover:underline">/blog/extract-video-frames-for-ai</a></div>
          </div>
        </div>

        <p className="mt-12 text-center">
          <Link to="/video-frame-extractor" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-2xl text-gray-950 bg-cyan-400 hover:bg-cyan-300 transition-all transform hover:-translate-y-1 shadow-lg shadow-cyan-500/20">
            Start Extracting Free →
          </Link>
        </p>

        <div className="my-10">
          <GoogleAdUnit />
        </div>
      </div>
    </article>
  );
};

export default HowToExtractFramesFromVideo;