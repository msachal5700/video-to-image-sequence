import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I extract frames from video for an AI dataset?',
    a: 'Upload your video, set FPS to 1–5 (typical for classification/detection), choose PNG for pixel-perfect labels, and click Extract. Download the ZIP and import into your labeling tool (CVAT, LabelImg, Roboflow, Labelbox).'
  },
  {
    q: 'What FPS should I use for computer vision training data?',
    a: 'Classification: 1 FPS. Object detection (YOLO, Faster R-CNN): 1–3 FPS. Instance segmentation: 2–5 FPS. Video tracking: 5–10 FPS. Action recognition: 5–10 FPS with clip sampling. Lower FPS = more temporal diversity, smaller dataset.'
  },
  {
    q: 'Should I use PNG or JPG for ML training images?',
    a: 'PNG for pixel-perfect ground truth (segmentation masks, keypoint annotations). JPG for classification backbones where storage matters. WebP (lossless) is a modern alternative — 25–35% smaller than PNG with transparency.'
  },
  {
    q: 'Can I extract frames from multiple videos for a single dataset?',
    a: 'Yes. Drop multiple videos in batch mode. Each video produces its own ZIP. Combine ZIPs post-download, or use the tool sequentially and merge folders. Naming pattern: frame_000001.png ensures sort order.'
  },
  {
    q: 'How do I handle class imbalance when extracting frames?',
    a: 'Extract at low FPS (1) from all videos, then manually curate/augment minority classes. Or extract at higher FPS from rare-class videos only. The tool lets you process videos independently with different FPS settings.'
  },
  {
    q: 'What resolution should I extract for training?',
    a: 'Frames are extracted at native video resolution (downscaled to 1920px max for preview only; downloads are full resolution). For training, resize in your data pipeline (e.g., 640×640 for YOLO, 224×224 for classification).'
  },
  {
    q: 'Does the tool support video annotation formats (COCO, YOLO, Pascal VOC)?',
    a: 'The tool outputs raw image sequences (PNG/JPG/WebP) + ZIP. Annotation format conversion happens in your labeling tool (CVAT, Roboflow, LabelImg all export COCO/YOLO/VOC). Frame naming (frame_000001.png) matches standard expectations.'
  }
];

const VideoFramesForAiDatasets: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('video-frames-for-ai-datasets-schemas');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-frames-for-ai-datasets-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Extract Video Frames for AI & Computer Vision Datasets",
      "url": "https://www.videotoimagesequence.online/video-frames-for-ai-datasets",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Extract frames from video for AI datasets free. Build YOLO, classification, segmentation training data with custom FPS (1–60), lossless PNG/WebP output, ZIP download. 100% private, no server upload.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "AI Dataset Preparation",
      "operatingSystem": "All — Browser-based",
      "browserRequirements": "Requires HTML5 and Javascript support",
      "featureList": [
        "Custom FPS 1–60 for dataset sampling control",
        "Lossless PNG/WebP for pixel-perfect labels",
        "Batch multi-video processing for large datasets",
        "ZIP download compatible with CVAT, LabelImg, Roboflow",
        "100% private — no data leaves your browser",
        "Supports MP4, MOV, WEBM (H.264, VP9, AV1)"
      ],
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": { "@type": "Answer", "text": faq.a }
      }))
    };

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Extract Video Frames for Computer Vision Datasets",
      "description": "Complete workflow: video → frames → labeling → training. Extract frames locally, download ZIP, import into CVAT/LabelImg/Roboflow.",
      "totalTime": "PT5M",
      "step": [
        { "@type": "HowToStep", "name": "Prepare Source Videos", "text": "Collect MP4/MOV/WEBM videos. Organize by class if doing classification." },
        { "@type": "HowToStep", "name": "Set Extraction FPS", "text": "Choose 1–5 FPS for detection/segmentation, 5–10 FPS for tracking/action recognition." },
        { "@type": "HowToStep", "name": "Choose Lossless Format", "text": "Select PNG (universal) or WebP (25–35% smaller, transparency) for pixel-perfect labels." },
        { "@type": "HowToStep", "name": "Extract & Download ZIP", "text": "Process videos locally. Each video yields a ZIP with sequentially named frames." },
        { "@type": "HowToStep", "name": "Import to Labeling Tool", "text": "Unzip into CVAT, LabelImg, Roboflow, Labelbox. Frames named frame_000001.png sort correctly." },
        { "@type": "HowToStep", "name": "Annotate & Export", "text": "Label frames. Export COCO JSON, YOLO TXT, or Pascal VOC XML for training." }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => { const el = document.getElementById('video-frames-for-ai-datasets-schemas'); if (el) el.remove(); };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="Extract Video Frames for AI Datasets — Build CV Training Data Free"
        description="Extract frames from video for AI datasets free. Build YOLO, classification, segmentation training data with custom FPS (1–60), lossless PNG/WebP, ZIP download. 100% private, no server upload."
        canonical="https://www.videotoimagesequence.online/video-frames-for-ai-datasets"
        ogTitle="Extract Video Frames for AI Datasets — Build CV Training Data Free"
        ogDescription="Extract frames from video for AI/ML datasets. Custom FPS, PNG/WebP, ZIP download compatible with CVAT, LabelImg, Roboflow. 100% private."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords="extract frames from video for AI dataset, video frames for computer vision, video to training data, YOLO dataset preparation, ML dataset frame extraction"
      />

      <Breadcrumb items={[
        { label: 'Use Cases', path: '/#use-cases' },
        { label: 'AI Datasets', path: '/video-frames-for-ai-datasets' }
      ]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          Extract Video Frames for AI Datasets<br />
          <span className="text-cyan-400">Build Computer Vision Training Data Free</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Convert video into ML-ready image sequences. Control FPS (1–60), choose lossless PNG/WebP, download ZIPs compatible with CVAT, LabelImg, Roboflow, Labelbox. 100% private — no server upload.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['🤖 YOLO / Detection', '🎯 Classification', '🔬 Segmentation', '📦 ZIP for CVAT/LabelImg', '🎨 PNG / WebP Lossless', '🔒 100% Private'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">{badge}</span>
          ))}
        </div>
      </section>

      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToImages />
      </div>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Why This Tool for AI Dataset Prep?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">FPS Control = Sampling Strategy</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              1 FPS for classification, 2–3 FPS for YOLO detection, 5 FPS for segmentation, 10 FPS for tracking. Dial in exact temporal sampling per task — no fixed presets.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Lossless Formats = Clean Labels</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              PNG (universal) or WebP (25–35% smaller, alpha) — no compression artifacts in your ground truth. Critical for segmentation masks and keypoint precision.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Batch + ZIP = Pipeline Ready</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Drop 50 videos → 50 ZIPs. Frame naming: frame_000001.png. Unzip directly into CVAT, LabelImg, Roboflow, Labelbox. No renaming scripts needed.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Recommended FPS by CV Task</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-800 mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Task</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium">Recommended FPS</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium">Format</th>
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Image Classification</td>
                <td className="px-5 py-3 text-center">1 FPS</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">JPG / PNG</td>
                <td className="px-5 py-3 text-gray-400">Max temporal diversity, minimal redundancy</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Object Detection (YOLO, SSD, Faster R-CNN)</td>
                <td className="px-5 py-3 text-center">1–3 FPS</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG / WebP</td>
                <td className="px-5 py-3 text-gray-400">Balance box accuracy vs dataset size</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Instance Segmentation (Mask R-CNN)</td>
                <td className="px-5 py-3 text-center">2–5 FPS</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG (lossless masks)</td>
                <td className="px-5 py-3 text-gray-400">Pixel-perfect boundaries need lossless</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Video Tracking (DeepSORT, ByteTrack)</td>
                <td className="px-5 py-3 text-center">5–10 FPS</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG / JPG</td>
                <td className="px-5 py-3 text-gray-400">Temporal continuity for ID association</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Action Recognition (SlowFast, TSM)</td>
                <td className="px-5 py-3 text-center">Clip sampling (8–16 frames/clip)</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">JPG</td>
                <td className="px-5 py-3 text-gray-400">Uniform temporal sampling, not frame-level</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Pose Estimation (OpenPose, HRNet)</td>
                <td className="px-5 py-3 text-center">5–10 FPS</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG</td>
                <td className="px-5 py-3 text-gray-400">Keypoint precision needs lossless</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">End-to-End Workflow</h2>
        <div className="space-y-4">
          {[
            { step: '1', title: 'Collect Videos', desc: 'Gather MP4/MOV/WEBM by class. Organize folders: /class_a/, /class_b/ for classification.' },
            { step: '2', title: 'Extract Frames', desc: 'Drop videos → set FPS → choose PNG/WebP → Extract. Each video → ZIP with frame_000001.png naming.' },
            { step: '3', title: 'Unzip & Organize', desc: 'Extract ZIPs. Mirror folder structure: /dataset/train/class_a/frame_*.png' },
            { step: '4', title: 'Label in CVAT/LabelImg', desc: 'Import images. Draw boxes, polygons, keypoints. Export COCO JSON / YOLO TXT / VOC XML.' },
            { step: '5', title: 'Train', desc: 'Feed annotations + images to YOLOv8, Detectron2, MMDetection, PyTorch Lightning, TensorFlow.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/20 border border-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-xl">{step}</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Labeling Tool Compatibility</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'CVAT', formats: 'COCO, YOLO, VOC, TFRecord', desc: 'Web-based, team collaboration, active learning' },
            { name: 'LabelImg', formats: 'Pascal VOC XML, YOLO TXT', desc: 'Lightweight desktop, single-user, fast' },
            { name: 'Roboflow', formats: 'COCO, YOLO, VOC, COCO Segmentation', desc: 'Cloud platform, augmentation, versioning' },
            { name: 'Labelbox', formats: 'COCO, YOLO, custom schemas', desc: 'Enterprise, model-assisted labeling' },
            { name: 'Supervisely', formats: 'COCO, Supervisely format', desc: 'Neural network assisted, video labeling' },
            { name: 'VoTT', formats: 'COCO, YOLO, VOC, TensorFlow', desc: 'Microsoft, Visual Object Tagging Tool' },
          ].map((tool, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-2">{tool.name}</h3>
              <p className="text-cyan-400 text-xs font-medium mb-2">Exports: {tool.formats}</p>
              <p className="text-gray-400 text-sm">{tool.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">💡 Pro Tips for Dataset Quality</h2>
          <ul className="text-gray-400 text-sm space-y-2 list-disc pl-5">
            <li>Extract at 1 FPS first, review class balance, then re-extract rare classes at higher FPS.</li>
            <li>Use <Link to="/video-to-webp" className="text-cyan-400 hover:underline">WebP lossless</Link> for 25–35% storage savings vs PNG with same label quality.</li>
            <li>For temporal tasks (tracking, action), extract at native FPS, then sub-sample in your data loader.</li>
            <li>Remove duplicate/near-duplicate frames with perceptual hashing before labeling.</li>
            <li>Split by video (not frame) for train/val/test to avoid data leakage.</li>
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Related Tools & Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/extract-frames-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video Frame Extractor</h3>
            <p className="text-gray-500 text-xs">Main tool — all formats, all FPS.</p>
          </Link>
          <Link to="/video-to-webp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to WebP</h3>
            <p className="text-gray-500 text-xs">25–35% smaller than PNG, lossless.</p>
          </Link>
          <Link to="/extract-frame-at-timestamp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Exact Timestamp</h3>
            <p className="text-gray-500 text-xs">Capture keyframes for validation sets.</p>
          </Link>
          <Link to="/blog/video-frame-extractor-use-cases" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Use Cases Guide</h3>
            <p className="text-gray-500 text-xs">7 real-world CV/ML workflows.</p>
          </Link>
        </div>
      </section>

      <section id="faq" className="max-w-3xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-display">Frequently Asked Questions</h2>
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
    </div>
  );
};

export default VideoFramesForAiDatasets;