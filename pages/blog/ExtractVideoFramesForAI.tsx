import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import Breadcrumb from '../../components/Breadcrumb';
import GoogleAdUnit from '../../components/GoogleAdUnit';

const ExtractVideoFramesForAI: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "Extract Video Frames for AI Datasets — Complete Workflow Guide",
      "description": "Complete guide to extracting video frames for ML/AI datasets. Covers FPS selection, format choice, labeling tool compatibility (CVAT, LabelImg, Roboflow), dataset structure, and automation.",
      "url": "https://www.videotoimagesequence.online/blog/extract-video-frames-for-ai",
      "mainEntityOfPage": "https://www.videotoimagesequence.online/blog/extract-video-frames-for-ai",
      "keywords": ["extract video frames for AI", "video frames for machine learning", "dataset preparation frames", "CVAT LabelImg Roboflow", "frame extraction for training data"],
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
        title="Extract Video Frames for AI Datasets — Complete Workflow Guide"
        description="Complete guide to extracting video frames for ML/AI datasets. Covers FPS selection, format choice, labeling tool compatibility (CVAT, LabelImg, Roboflow), dataset structure, and automation."
        canonical="https://www.videotoimagesequence.online/blog/extract-video-frames-for-ai"
        ogTitle="Extract Video Frames for AI Datasets — Complete Workflow Guide"
        ogDescription="FPS, format, labeling tool compatibility (CVAT, LabelImg, Roboflow), dataset structure, automation. Free frame extractor for ML datasets."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="article"
        articleDate="2026-09-12"
        keywords="extract video frames for AI, video frames for machine learning, dataset preparation frames, CVAT LabelImg Roboflow, frame extraction for training data"
      />

      <Breadcrumb items={[
        { label: 'Blog', path: '/blog' },
        { label: 'Frames for AI Datasets' }
      ]} />

      <div className="mb-10 text-center mt-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">Extract Video Frames for AI Datasets</h1>
        <p className="text-cyan-400 font-mono text-sm tracking-wider uppercase">Sep 12, 2026 • 12 min read</p>
      </div>

      <div className="text-gray-300 space-y-6 leading-relaxed text-lg lg:text-xl">
        <p className="text-xl text-gray-100">
          Building a computer vision dataset from video? The frame extraction step determines everything downstream: labeling speed, model accuracy, storage costs, and training time. Get it right once.
        </p>

        <div className="bg-cyan-950/20 border border-cyan-800 rounded-2xl p-6 my-8">
          <h3 className="text-cyan-400 font-semibold mb-3">🎯 30-Second Summary</h3>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div className="bg-gray-900 p-4 rounded-xl"><strong className="text-white">Task</strong><br/>Classification → 1 FPS</div>
            <div className="bg-gray-900 p-4 rounded-xl"><strong className="text-white">Task</strong><br/>Detection → 2–3 FPS</div>
            <div className="bg-gray-900 p-4 rounded-xl"><strong className="text-white">Task</strong><br/>Segmentation → 3–5 FPS</div>
            <div className="bg-gray-900 p-4 rounded-xl"><strong className="text-white">Task</strong><br/>Tracking/Pose → 5–10 FPS</div>
            <div className="bg-gray-900 p-4 rounded-xl"><strong className="text-white">Format</strong><br/>JPG for speed/storage, WebP for balance, PNG only if lossless required</div>
            <div className="bg-gray-900 p-4 rounded-xl"><strong className="text-white">Structure</strong><br/>Flat folder per class, or YOLO/COCO/VOC export from labeling tool</div>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Step 1: Choose Your FPS by Task</h2>

        <div className="overflow-x-auto rounded-2xl border border-gray-800 my-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900 text-white uppercase text-xs font-mono">
              <tr>
                <th className="px-4 py-3">CV Task</th>
                <th className="px-4 py-3 text-center">Recommended FPS</th>
                <th className="px-4 py-3 text-center">Frames / 10 min</th>
                <th className="px-4 py-3">Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Image Classification</td><td className="px-4 py-3 text-center">1</td><td className="px-4 py-3 text-center">600</td><td className="px-4 py-3">Max diversity, min redundancy</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Object Detection (YOLO, SSD)</td><td className="px-4 py-3 text-center">2–3</td><td className="px-4 py-3 text-center">1,200–1,800</td><td className="px-4 py-3">Balance box accuracy vs size</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Instance Segmentation</td><td className="px-4 py-3 text-center">3–5</td><td className="px-4 py-3 text-center">1,800–3,000</td><td className="px-4 py-3">Pixel masks need more samples</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Semantic Segmentation</td><td className="px-4 py-3 text-center">5–10</td><td className="px-4 py-3 text-center">3,000–6,000</td><td className="px-4 py-3">Dense labels need temporal density</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Multi-Object Tracking</td><td className="px-4 py-3 text-center">5–10</td><td className="px-4 py-3 text-center">3,000–6,000</td><td className="px-4 py-3">ID association across frames</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Pose Estimation / Keypoints</td><td className="px-4 py-3 text-center">5–10</td><td className="px-4 py-3 text-center">3,000–6,000</td><td className="px-4 py-3">Keypoint precision needs density</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold">Action Recognition (clip-based)</td><td className="px-4 py-3 text-center">Uniform 8–16/clip</td><td className="px-4 py-3 text-center">N/A</td><td className="px-4 py-3">Not frame-level — clip sampling</td></tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4"><strong className="text-cyan-400">Pro tip:</strong> Start with the minimum FPS. Train a baseline. If model fails on motion blur or fast objects, re-extract <em>only those videos</em> at 2× FPS. Iterative beats bulk.</p>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Step 2: Pick the Right Format</h2>

        <div className="overflow-x-auto rounded-2xl border border-gray-800 my-4">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-900 text-white uppercase text-xs font-mono">
              <tr>
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3 text-center">Size (1080p)</th>
                <th className="px-4 py-3 text-center">Load Speed</th>
                <th className="px-4 py-3 text-center">Labeling Tools</th>
                <th className="px-4 py-3">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-green-400">JPG</td><td className="px-4 py-3 text-center">~50 KB</td><td className="px-4 py-3 text-center">Fastest</td><td className="px-4 py-3 text-center">All</td><td className="px-4 py-3">Default choice — detection, classification, tracking</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-cyan-400">WebP</td><td className="px-4 py-3 text-center">~35 KB</td><td className="px-4 py-3 text-center">Fast</td><td className="px-4 py-3 text-center">Most modern</td><td className="px-4 py-3">Storage-constrained, large datasets, web pipelines</td></tr>
              <tr className="hover:bg-gray-900/50"><td className="px-4 py-3 font-bold text-yellow-400">PNG</td><td className="px-4 py-3 text-center">~500 KB</td><td className="px-4 py-3 text-center">Slow</td><td className="px-4 py-3 text-center">All</td><td className="px-4 py-3">Only if lossless required (medical, forensics, QC)</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-green-950/30 border border-green-800 rounded-xl p-4 my-6">
          <h4 className="text-green-400 font-semibold mb-2">✅ Recommendation</h4>
          <p className="text-gray-400"><strong>JPG quality 90</strong> for 95% of ML workflows. WebP if you're pushing TB-scale datasets or deploying to edge. PNG only when you have a documented reason.</p>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Step 3: Dataset Structure — Compatible with Your Labeler</h2>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Option A: Flat Folder per Class (Classification)</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400"><code>dataset/
├── train/
│   ├── cat/
│   │   ├── frame_0001.jpg
│   │   ├── frame_0002.jpg
│   │   └── ...
│   └── dog/
│       ├── frame_0001.jpg
│       └── ...
├── val/
│   ├── cat/
│   └── dog/
└── test/
    ├── cat/
    └── dog/</code></pre>
        <p className="text-gray-400">Works with: PyTorch ImageFolder, TensorFlow image_dataset_from_directory, fastai, most classification tutorials.</p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Option B: YOLO Format (Detection/Segmentation)</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400"><code>dataset/
├── images/
│   ├── train/
│   │   ├── video1_frame_0001.jpg
│   │   ├── video1_frame_0002.jpg
│   │   └── ...
│   └── val/
│       └── ...
└── labels/
    ├── train/
    │   ├── video1_frame_0001.txt
    │   ├── video1_frame_0002.txt
    │   └── ...
    └── val/
        └── ...

# Label file format (one line per object):
# class_id x_center y_center width height  (normalized 0-1)
0 0.523 0.412 0.187 0.234</code></pre>
        <p className="text-gray-400">Works with: YOLOv5/v8/v10, Ultralytics, Detectron2 (with converter), Roboflow export.</p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Option C: COCO JSON (Detection/Segmentation/Keypoints)</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400"><code>{`dataset/
├── images/
│   ├── train/
│   └── val/
└── annotations/
    ├── instances_train.json
    └── instances_val.json

# JSON structure:
{
  "images": [{"id": 1, "file_name": "frame_0001.jpg", "width": 1920, "height": 1080}],
  "annotations": [{"id": 1, "image_id": 1, "category_id": 1, "bbox": [100, 200, 300, 400], "area": 120000, "iscrowd": 0}],
  "categories": [{"id": 1, "name": "person"}]`}</code></pre>
        <p className="text-gray-400">Works with: Detectron2, MMDetection, FiftyOne, LabelStudio, CVAT export, Roboflow export.</p>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Option D: Pascal VOC XML (Legacy)</h3>
        <p className="mt-2 text-gray-400">One XML per image. Still used by some older pipelines. Most tools export to this.</p>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Step 4: Labeling Tool Compatibility</h2>

        <div className="space-y-4 mt-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-xl mb-3">CVAT (Computer Vision Annotation Tool)</h3>
            <p className="text-gray-400 mb-4">Industry standard, web-based, supports interpolation, teams, cloud/self-hosted.</p>
            <div className="grid gap-3 md:grid-cols-3 text-sm">
              <div className="bg-gray-800 p-3 rounded"><strong>Import:</strong> Images (ZIP) or video (auto-extracts frames)</div>
              <div className="bg-gray-800 p-3 rounded"><strong>Export:</strong> COCO, YOLO, Pascal VOC, TFRecord, LabelMe, MOT</div>
              <div className="bg-gray-800 p-3 rounded"><strong>Tasks:</strong> Detection, Segmentation, Classification, Keypoints, Tracking</div>
            </div>
            <p className="mt-4 text-cyan-400"><strong>Workflow:</strong> Upload video → CVAT extracts frames at your FPS → label → export YOLO/COCO → train.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-xl mb-3">LabelImg</h3>
            <p className="text-gray-400 mb-4">Lightweight desktop app (PyQt). Pascal VOC XML + YOLO TXT. No cloud, no account.</p>
            <div className="grid gap-3 md:grid-cols-3 text-sm">
              <div className="bg-gray-800 p-3 rounded"><strong>Input:</strong> Pre-extracted JPG/PNG folder</div>
              <div className="bg-gray-800 p-3 rounded"><strong>Output:</strong> Pascal VOC XML, YOLO TXT</div>
              <div className="bg-gray-800 p-3 rounded"><strong>Tasks:</strong> Bounding boxes only</div>
            </div>
            <p className="mt-4 text-cyan-400"><strong>Workflow:</strong> Extract frames with our tool → open folder in LabelImg → draw boxes → save → train YOLO.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-xl mb-3">Roboflow</h3>
            <p className="text-gray-400 mb-4">End-to-end: upload → augment → label → export → train → deploy. Free tier generous.</p>
            <div className="grid gap-3 md:grid-cols-3 text-sm">
              <div className="bg-gray-800 p-3 rounded"><strong>Input:</strong> Video (auto-extract) or images (ZIP/folder)</div>
              <div className="bg-gray-800 p-3 rounded"><strong>Export:</strong> YOLO, COCO, TFRecord, ONNX, CoreML, TFLite, more</div>
              <div className="bg-gray-800 p-3 rounded"><strong>Augmentation:</strong> 30+ ops (rotate, noise, blur, cutout, mosaic...)</div>
            </div>
            <p className="mt-4 text-cyan-400"><strong>Workflow:</strong> Upload video → set FPS in Roboflow → label in UI → export YOLOv8 format → <code className="bg-gray-900 px-1.5 py-0.5 rounded">yolo train data=data.yaml model=yolov8n.pt</code></p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-xl mb-3">Label Studio</h3>
            <p className="text-gray-400 mb-4">Flexible, supports audio/text/video, ML-assisted labeling, active learning.</p>
            <div className="grid gap-3 md:grid-cols-3 text-sm">
              <div className="bg-gray-800 p-3 rounded"><strong>Import:</strong> Images, video (frame sampling), tasks JSON</div>
              <div className="bg-gray-800 p-3 rounded"><strong>Export:</strong> COCO, YOLO, Pascal VOC, JSON, CSV</div>
              <div className="bg-gray-800 p-3 rounded"><strong>Tasks:</strong> All CV + NLP + Audio + Time Series</div>
            </div>
            <p className="mt-4 text-cyan-400"><strong>Workflow:</strong> Pre-extract frames → import to Label Studio → configure labeling interface → label → export.</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-xl mb-3">Supervisely</h3>
            <p className="text-gray-400 mb-4">Enterprise-grade, neural network assisted labeling, Python SDK, apps ecosystem.</p>
            <div className="grid gap-3 md:grid-cols-3 text-sm">
              <div className="bg-gray-800 p-3 rounded"><strong>Input:</strong> Video (smart frame sampling), images</div>
              <div className="bg-gray-800 p-3 rounded"><strong>Export:</strong> COCO, YOLO, Supervisely format, custom</div>
              <div className="bg-gray-800 p-3 rounded"><strong>Unique:</strong> NN-assisted labeling, active learning loops</div>
            </div>
          </div>
        </div>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Step 5: Automation — From Video to Training-Ready</h2>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Our Tool: Batch Extraction + Auto-ZIP</h3>
        <ol className="list-decimal pl-6 space-y-3 mt-4 text-gray-400">
          <li>Drop multiple videos → set FPS per video or global</li>
          <li>Choose JPG/WebP → quality slider</li>
          <li>Extract → auto-ZIP per video (or single ZIP)</li>
          <li>Unzip → upload to Roboflow / CVAT / LabelImg</li>
        </ol>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">Python Script: Auto-Split Train/Val/Test</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400"><code>{`import os, random, shutil
from pathlib import Path

def split_dataset(src_dir, dst_dir, train=0.7, val=0.2, test=0.1, seed=42):
    random.seed(seed)
    classes = [d for d in os.listdir(src_dir) if os.path.isdir(src_dir/d)]
    for split, ratio in [('train', train), ('val', val), ('test', test)]:
        for cls in classes:
            os.makedirs(Path(dst_dir)/split/cls, exist_ok=True)
    for cls in classes:
        imgs = list(Path(src_dir/cls).glob('*.jpg'))
        random.shuffle(imgs)
        n = len(imgs)
        t, v = int(n*train), int(n*(train+val))
        for i, img in enumerate(imgs):
            split = 'train' if i < t else 'val' if i < v else 'test'
            shutil.copy2(img, Path(dst_dir)/split/cls/img.name)
    print(f'Done. Check {dst_dir}')`}</code></pre>

        <h3 className="text-xl font-semibold text-white mt-8 mb-4">FFmpeg: Direct Video → Frames (Headless/CI)</h3>
        <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 my-4 font-mono text-sm text-cyan-400"><code># Extract 2 FPS, JPG quality 90, zero-padded names
ffmpeg -i input.mp4 -vf fps=2 -q:v 2 frames/frame_%06d.jpg

# Extract specific time range
ffmpeg -ss 00:01:30 -t 30 -i input.mp4 -vf fps=5 -q:v 2 frames/frame_%06d.jpg

# Extract with scene change detection (keyframes only)
ffmpeg -i input.mp4 -vf "select='gt(scene,0.4)'" -vsync vfr frames/keyframe_%06d.jpg</code></pre>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Step 6: Quality Control Checklist</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
            <span className="text-white">No duplicate / near-duplicate frames (check perceptual hash)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
            <span className="text-white">No motion blur frames (or flagged for review)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
            <span className="text-white">Class balance verified (count per folder)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
            <span className="text-white">Resolution consistent (all same W×H or explicit resize)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
            <span className="text-white">Color space consistent (all sRGB, no mixed BT.709/BT.601)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
            <span className="text-white">Train/Val/Test split stratified by video source (no leakage)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
            <span className="text-white">Labels exported in target format (YOLO/COCO) verified</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
            <span className="text-white">Dataset versioned (DVC/Git LFS) with extraction params recorded</span>
          </label>
        </div>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-12 mb-6 font-display border-b border-gray-800 pb-2">Common Pitfalls</h2>

        <div className="space-y-4 mt-4">
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ Extracting All Frames at 30 FPS</h4>
            <p className="text-gray-400">10 min video → 18,000 frames. Labeling takes weeks. Model overfits to temporal correlation.</p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ Mixed Resolutions in One Dataset</h4>
            <p className="text-gray-400">Some 1080p, some 4K, some 720p → model learns resolution artifacts. Resize to common size <em>before</em> labeling.</p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ Train/Val Split by Random Frames</h4>
            <p className="text-gray-400">Frames from same video in both splits = data leakage. Split by <strong>video source</strong>, not frames.</p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ Ignoring Color Space</h4>
            <p className="text-gray-400">HDR source + SDR extract + mixed labeling = color shift artifacts. Normalize to sRGB.</p>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-xl p-4">
            <h4 className="text-red-400 font-semibold mb-2">❌ No Version Control on Dataset</h4>
            <p className="text-gray-400">Can't reproduce training run. Use DVC or at minimum record: video hashes, FPS, format, date, tool version.</p>
          </div>
        </div>

        <div className="my-10">
          <GoogleAdUnit />
        </div>

        <p className="mt-12 text-center">
          <Link to="/video-frames-for-ai-datasets" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-2xl text-gray-950 bg-cyan-400 hover:bg-cyan-300 transition-all transform hover:-translate-y-1 shadow-lg shadow-cyan-500/20">
            Extract Frames for AI Free →
          </Link>
        </p>

        <p className="mt-6 text-center text-gray-500">
          Or use the general extractor for custom FPS:
          <Link to="/video-frame-extractor" className="text-cyan-400 hover:underline ml-2">Video Frame Extractor</Link>
        </p>

        <div className="my-10">
          <GoogleAdUnit />
        </div>
      </div>
    </article>
  );
};

export default ExtractVideoFramesForAI;