import React from 'react';
import { Link } from 'react-router-dom';
import VideoToImages from './VideoToImages';
import AdsterraAd from '../components/AdsterraAd';
import SEOHead from '../components/SEOHead';

const faqs = [
  {
    q: 'How do I extract frames from a video?',
    a: 'Upload your video, choose JPG or PNG output, select your frame settings, and download the extracted frames.',
  },
  {
    q: 'Can I extract frames from an MP4 video?',
    a: 'Yes. MP4 is one of the best formats for frame extraction because it is widely supported and works well in most browsers.',
  },
  {
    q: 'What is a video frame extractor?',
    a: 'A video frame extractor is a tool that converts selected frames from a video into separate image files.',
  },
  {
    q: 'Should I export video frames as JPG or PNG?',
    a: 'Use JPG for smaller files and quick previews. Use PNG when you need better quality or plan to edit the extracted frames.',
  },
  {
    q: 'Can I use extracted frames for YouTube thumbnails?',
    a: 'Yes. You can extract frames from your own video and use the best frame as a thumbnail or preview image.',
  },
  {
    q: 'Is this tool free?',
    a: 'Yes. The tool is free to use and does not require signup.',
  },
  {
    q: 'Can I extract every frame from a video?',
    a: 'That depends on the video length, browser performance, and tool settings. Extracting every frame from a long video can create a large number of images.',
  },
];

const ExtractFramesFromVideo: React.FC = () => {
  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="Extract Frames from Video Online – Free Video Frame Extractor"
        description="Extract frames from video online for free. Upload MP4, MOV, WEBM, AVI, or MKV videos and save frames as JPG or PNG images."
        canonical="https://videotoimagesequence.online/extract-frames-from-video"
        ogTitle="Extract Frames from Video Online – Free Video Frame Extractor"
        ogDescription="Extract frames from video online for free. Upload MP4, MOV, WEBM, AVI, or MKV videos and save frames as JPG or PNG images."
        ogImage="https://videotoimagesequence.online/og-image.png"
        ogType="website"
      />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-16 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          Extract Frames from Video<br />
          <span className="text-cyan-400">Online</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Use this free video frame extractor to upload a video and save individual frames as JPG or PNG images. It supports <strong className="text-white">MP4, MOV, WEBM, AVI, and MKV</strong> files.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['✅ No Signup', '🔒 100% Private', '⚡ Free Forever', '🎬 All Formats'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              {badge}
            </span>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-cyan-600 bg-cyan-950/50 px-5 py-3 text-sm font-semibold text-cyan-400 transition-colors hover:bg-cyan-900 hover:text-white"
          >
            video to image sequence converter
          </Link>
        </div>
      </section>

      {/* Main Tool Content */}
      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToImages />
      </div>

      {/* Adsterra Ad Block */}
      <div className="max-w-5xl mx-auto">
        <AdsterraAd />
      </div>

      {/* ── HOW TO EXTRACT FRAMES ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          How to Extract Frames from a Video
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          Extracting frames from a video means converting selected moments from a video file into separate image files. This is useful when you need screenshots, animation references, thumbnails, visual samples, or image datasets.
        </p>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h3 className="text-white font-semibold mb-6">5 Simple Steps:</h3>
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload your video file', desc: 'Drag and drop or click to select your video.' },
              { num: '2', title: 'Choose JPG or PNG output', desc: 'Select your preferred image format.' },
              { num: '3', title: 'Select frame extraction settings', desc: 'Choose how many frames to extract and at what intervals.' },
              { num: '4', title: 'Start the conversion', desc: 'Click extract and wait for processing to complete.' },
              { num: '5', title: 'Download your frames', desc: 'Get individual frames or download all as a ZIP file.' },
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

      {/* ── SUPPORTED VIDEO FORMATS ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Supported Video Formats
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          This video frame extractor supports common video formats including MP4, MOV, WEBM, AVI, and MKV. For the fastest and most reliable results, MP4 is usually the best format because it works well across browsers and devices.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['MP4', 'MOV', 'WEBM', 'AVI', 'MKV'].map(format => (
            <div key={format} className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
              <p className="text-cyan-400 font-bold text-lg">{format}</p>
              <p className="text-gray-500 text-xs mt-1">Supported</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── JPG VS PNG ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          JPG vs PNG: Which Output Should You Choose?
        </h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Choose JPG if you want smaller file sizes, faster downloads, and general-purpose screenshots. Choose PNG if you need higher image quality, sharper details, editing flexibility, or frame-by-frame visual work.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              format: 'JPG',
              points: [
                'Smaller file size',
                'Faster download',
                'Good for thumbnails',
                'Web-friendly format',
                'Quick previews',
              ],
              icon: '📦',
            },
            {
              format: 'PNG',
              points: [
                'Higher quality',
                'Lossless compression',
                'Better for editing',
                'Good for animation',
                'Detailed frame work',
              ],
              icon: '🎨',
            },
          ].map(({ format, points, icon }) => (
            <div key={format} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{icon}</span>
                <h3 className="text-white font-bold text-lg">{format}</h3>
              </div>
              <ul className="space-y-2">
                {points.map(point => (
                  <li key={point} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="text-cyan-400 mt-1">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMON USE CASES ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Common Use Cases for Extracting Video Frames
        </h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Video frame extraction is useful for many professional and creative purposes. Here are the most common use cases:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🎥', title: 'YouTube Thumbnails', desc: 'Extract the perfect frame to use as a video thumbnail.' },
            { icon: '🎨', title: 'Animation Reference', desc: 'Get frame sequences for animation projects and storyboarding.' },
            { icon: '🤖', title: 'AI Datasets', desc: 'Build training datasets for machine learning models.' },
            { icon: '✂️', title: 'Video Editing', desc: 'Create still images and transition frames for editing.' },
            { icon: '📊', title: 'Motion Analysis', desc: 'Study motion and movement frame by frame.' },
            { icon: '🎨', title: 'Design & Presentations', desc: 'Extract visual elements for creative work.' },
            { icon: '📱', title: 'Social Media Content', desc: 'Create multiple preview images from one video.' },
            { icon: '🔍', title: 'Frame-by-Frame Review', desc: 'Analyze details, sports moves, or technical sequences.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BEST SETTINGS ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Best Settings for Frame Extraction
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          The best settings depend on what you need. For thumbnails, extracting a few key frames is usually enough. For animation, motion study, or AI datasets, you may need more frames at regular intervals. PNG is better when quality matters, while JPG is better when you want smaller files.
        </p>
        <div className="space-y-4">
          {[
            { use: 'Quick Thumbnails', settings: 'Extract 1-3 frames, JPG format, low FPS', reason: 'Fast processing, small files' },
            { use: 'Animation Reference', settings: 'Extract all frames or high FPS, PNG format', reason: 'Need every detail for smooth animation' },
            { use: 'AI/ML Datasets', settings: 'Extract 5-10 FPS, PNG format (for quality)', reason: 'Balanced file size and quality' },
            { use: 'Video Editing', settings: 'Extract 24-30 FPS, JPG or PNG depending on need', reason: 'Professional frame sequence' },
            { use: 'Quick Preview', settings: 'Extract 1 FPS, JPG format', reason: 'Lightweight preview across entire video' },
          ].map(({ use, settings, reason }) => (
            <div key={use} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <p className="text-white font-semibold mb-2">{use}</p>
              <p className="text-cyan-400 text-sm mb-2">{settings}</p>
              <p className="text-gray-500 text-xs">💡 {reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRIVACY ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Privacy and File Safety
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          Your video is used only for frame extraction. No signup is required. Your video is processed directly in your browser whenever possible, meaning it does not need to be stored permanently on our servers. After extraction, download your frames immediately.
        </p>
        <div className="bg-cyan-950/20 border border-cyan-800/50 rounded-lg p-6">
          <p className="text-white font-semibold mb-4">🔒 Safety Tips:</p>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>✓ Avoid uploading private, sensitive, or confidential videos</li>
            <li>✓ Use only for videos you have rights to process</li>
            <li>✓ Download immediately after extraction</li>
            <li>✓ Do not leave videos unattended during processing</li>
          </ul>
        </div>
      </section>

      {/* ── RELATED TOOLS ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Related Tools and Guides
        </h2>
        <div className="space-y-3">
          <Link
            to="/"
            className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-cyan-800 transition-colors group"
          >
            <p className="text-cyan-400 font-semibold group-hover:text-cyan-300">video to image sequence converter</p>
            <p className="text-gray-500 text-sm mt-1">The main tool for converting videos to image sequences with advanced features.</p>
          </Link>
          <Link
            to="/mp4-to-jpg"
            className="block bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-cyan-800 transition-colors group"
          >
            <p className="text-cyan-400 font-semibold group-hover:text-cyan-300">→ MP4 to Image Sequence Guide</p>
            <p className="text-gray-500 text-sm mt-1">Specific guide for converting MP4 files to image sequences.</p>
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto py-16 px-4">
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

      {/* FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        })}
      </script>
    </div>
  );
};

export default ExtractFramesFromVideo;
