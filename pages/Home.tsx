import React from 'react';
import { Link } from 'react-router-dom';
import VideoToImages from './VideoToImages';
import AdUnit from '../components/AdUnit';
import AdsterraAd from '../components/AdsterraAd';
import AtOptionsAd from '../components/AtOptionsAd';
import SEOHead from '../components/SEOHead';

const faqs = [
  { q: 'Is there a file size limit?',
    a: 'No. Video to Image Sequence Online processes everything in your browser. There is no upload and no file size limit at all — convert videos of any size for free.' },
  { q: 'What video formats are supported?',
    a: 'MP4, MOV, and WEBM — the three most common formats used by phones, cameras, and screen recorders.' },
  { q: 'Should I extract frames as JPG or PNG?',
    a: 'JPG is recommended for most uses — smaller file sizes, faster downloads, great quality. Choose PNG if you need lossless frames for VFX compositing, game development, or machine learning datasets where pixel-perfect accuracy matters.' },
  { q: 'Are my videos kept private?',
    a: '100% private. Your video never leaves your device. Everything runs locally in your browser using JavaScript. Nothing is sent to any server.' },
  { q: 'Can I download all frames at once?',
    a: 'Yes. After extraction, click "Download All as ZIP" to get every frame packed into a single ZIP file with one click.' },
  { q: 'How do I control how many frames are extracted?',
    a: 'Use the FPS selector before extracting. Choose every frame for maximum quality, or pick 1, 5, 10, 24, or 30 FPS depending on your needs.' },
  { q: 'Can I extract frames from multiple videos at once?',
    a: 'Yes. Just drop multiple video files at once and our batch mode will process them automatically one by one.' },
  { q: 'Can I download individual frames?',
    a: 'Yes. Every extracted frame appears in a visual grid. Hover over any frame and click the download button to save that specific frame.' },
  { q: 'What is the best free alternative for extracting video frames?',
    a: 'Video to Image Sequence Online is the best free alternative — it has no file size limit, no server upload, batch processing, ZIP download, individual frame downloads, and custom FPS control. All completely free.' },
  { q: 'Do I need to create an account or install anything?',
    a: 'No. Just open the website and start converting. No account, no download, no installation. Works on any device with a modern browser.' },
  { q: 'What is a video to image sequence converter?',
    a: 'A video to image sequence converter extracts individual frames from a video and saves them as separate image files.' },
  { q: 'Can I extract frames from an MP4 video?',
    a: 'Yes, you can upload an MP4 video and extract frames as JPG or PNG images.' },
  { q: 'Which format is better, JPG or PNG?',
    a: 'JPG is better for smaller file size. PNG is better for higher quality and editing.' },
  { q: 'Can I use this tool for YouTube videos?',
    a: 'If you have the video file downloaded legally, you can upload it and extract frames.' },
  { q: 'Is this tool free?',
    a: 'Yes, this tool is free to use.' },
  { q: 'Why should I extract frames from a video?',
    a: 'You may need frames for thumbnails, editing, animation, AI training datasets, visual analysis, or presentations.' },
]

const Home: React.FC = () => {
  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="Video to Image Sequence Converter Online – Extract Frames from Video"
        description="Convert video to image sequence online for free. Extract frames from MP4, MOV, WEBM, AVI, and MKV videos as JPG or PNG images directly from your browser."
        canonical="https://videotoimagesequence.online/"
        ogTitle="Video to Image Sequence Converter Online – Extract Frames from Video"
        ogDescription="Convert video to image sequence online for free. Extract frames from MP4, MOV, WEBM, AVI, and MKV videos as JPG or PNG images directly from your browser."
        ogImage="https://videotoimagesequence.online/og-image.png"
        ogType="website"
      />
      
      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-16 pb-10 px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-cyan-950/50 border border-cyan-800 text-cyan-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          100% Free · No Upload · No Limits
        </div>

        {/* H1 — SEO + AI optimized */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          Video to Image Sequence<br />
          <span className="text-cyan-400">Online Converter</span>
        </h1>

        {/* Answer-first description */}
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          <strong className="text-white">Video to Image Sequence Online</strong> is a free,
          browser-based tool that extracts every frame from <strong className="text-white">MP4, MOV, and WEBM</strong> videos as high-quality
          <strong className="text-white"> JPG or PNG images</strong>.
          Unlike other tools, it requires <strong className="text-white">no file upload</strong>,
          has <strong className="text-white">no file size limit</strong>, supports
          <strong className="text-white"> batch processing</strong>,
          <strong className="text-white"> ZIP download</strong>, and custom FPS control —
          all completely free and <strong className="text-white">100% private</strong>.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {[
            '✅ No File Size Limit',
            '🔒 100% Private',
            '⚡ Instant — No Upload',
            '📦 ZIP Download',
            '🎬 Batch Processing',
            '🎨 Custom FPS',
            '🆓 Free Forever',
          ].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Tool Switcher Tabs */}
      <div className="flex justify-center mb-10 px-4">
        <div className="bg-gray-900 p-1.5 rounded-xl border border-gray-800 flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 bg-cyan-500 text-gray-950 shadow-lg shadow-cyan-500/20"
          >
            Video to Images
          </Link>
          <Link
            to="/images-to-video"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 text-gray-400 hover:text-white hover:bg-gray-800/80"
          >
            Images to Video
          </Link>
        </div>
      </div>

      {/* Main Tool Content */}
      <div className="animate-fade-in min-h-[400px] px-4">
        <VideoToImages />
      </div>

      {/* Adsterra Ad Block */}
      <div className="max-w-5xl mx-auto">
        <AdsterraAd />
      </div>

      {/* ── HOW THIS TOOL WORKS ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          How This Video to Image Sequence Tool Works
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          This tool extracts individual frames from your video and converts them into downloadable image files. You can upload a video, choose the output format, and download frames as JPG or PNG images.
        </p>
        <p className="text-gray-400 mb-6 font-semibold text-white">The process is simple:</p>
        <ol className="text-gray-400 space-y-2 mb-6 list-decimal list-inside">
          <li>Upload your video file.</li>
          <li>Select the image format.</li>
          <li>Choose how many frames you want to extract.</li>
          <li>Download the extracted image sequence.</li>
        </ol>
        <p className="text-gray-400 leading-relaxed">
          This is useful for animation, video editing, AI dataset creation, thumbnails, motion analysis, and frame-by-frame review.
        </p>
      </section>

      {/* ── SUPPORTED VIDEO FORMATS ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Supported Video Formats
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          Our tool supports common video formats such as:
        </p>
        <ul className="text-gray-400 space-y-2 mb-6 list-disc list-inside">
          <li>MP4</li>
          <li>MOV</li>
          <li>WEBM</li>
          <li>AVI</li>
          <li>MKV</li>
        </ul>
        <p className="text-gray-400 leading-relaxed">
          For best results, use <strong className="text-white">MP4</strong> because it is widely supported, fast to process, and works well in most browsers.
        </p>
      </section>

      {/* ── SUPPORTED IMAGE OUTPUT FORMATS ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Supported Image Output Formats
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          You can extract frames as:
        </p>
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-white font-semibold mb-1">JPG/JPEG</p>
            <p className="text-gray-400">best for smaller file size and general use.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-1">PNG</p>
            <p className="text-gray-400">best for high-quality frames, transparent graphics, design work, and editing.</p>
          </div>
        </div>
        <p className="text-gray-400 leading-relaxed">
          Choose <strong className="text-white">JPG</strong> if you want faster downloads. Choose <strong className="text-white">PNG</strong> if image quality matters more.
        </p>
      </section>

      {/* ── WHO CAN USE THIS TOOL ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Who Can Use This Tool?
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          This tool is useful for:
        </p>
        <ul className="text-gray-400 space-y-2 list-disc list-inside">
          <li>Video editors who need frame-by-frame screenshots.</li>
          <li>Animators who need image sequences from video clips.</li>
          <li>AI developers who need video frames for datasets.</li>
          <li>YouTubers who want thumbnails from videos.</li>
          <li>Designers who want still images from motion footage.</li>
          <li>Students who need visual frames for projects.</li>
          <li>Researchers who analyze motion or visual changes in videos.</li>
        </ul>
      </section>

      {/* ── PRIVACY AND FILE SAFETY ── */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Privacy and File Safety
        </h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          Your uploaded video is processed directly in your browser whenever possible. This means your video does not need to be stored permanently on our servers.
        </p>
        <p className="text-gray-400 mb-6 leading-relaxed">
          We do not ask for login, account creation, or personal information. After processing, you can download your extracted frames immediately.
        </p>
        <p className="text-gray-400 leading-relaxed">
          <strong className="text-white">For privacy, avoid uploading sensitive, private, or confidential videos to any online tool.</strong>
        </p>
      </section>
      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
          How It Works
        </h2>
        <p className="text-gray-500 text-center text-sm mb-12">
          3 simple steps — no signup, no install, no upload
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Drop Your Video',
              desc: 'Drag and drop your MP4, MOV, or WEBM file. Drop multiple files for batch processing. Any file size works.' },
            { step: '02', title: 'Choose Settings',
              desc: 'Select your frame rate (FPS) and output format (JPG or PNG). Customize exactly how many frames to extract.' },
            { step: '03', title: 'Download Frames',
              desc: 'Browse the frame grid, download individual frames, or get all frames as a ZIP archive.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-5xl font-black text-cyan-950 mb-4">{step}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section id="use-cases" className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
          Who Uses Video to Image Sequence Online?
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10">
          Used by creators, developers, and professionals worldwide
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: '🎬', title: 'Video Editors & YouTubers',
              desc: 'Extract the perfect still frame for video thumbnails, title cards, or social media posts from any clip in seconds.' },
            { icon: '🎮', title: 'Game Developers & Animators',
              desc: 'Convert sprite sheet videos or animation previews into individual PNG frames for Unity, Godot, or Blender.' },
            { icon: '🤖', title: 'AI & ML Developers',
              desc: 'Generate large labeled image datasets from video footage for training computer vision and machine learning models.' },
            { icon: '🎨', title: 'VFX & Motion Artists',
              desc: 'Import extracted frame sequences into After Effects, DaVinci Resolve, or Nuke for frame-by-frame compositing.' },
            { icon: '📸', title: 'Photographers',
              desc: 'Capture split-second moments from slow-motion or high-speed video that would be impossible to photograph directly.' },
            { icon: '🎓', title: 'Educators & Researchers',
              desc: 'Extract frames for academic analysis, presentation slides, medical imaging review, or research documentation.' },
          ].map(({ icon, title, desc }) => (
            <div key={title}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-800 hover:bg-gray-900/80 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPETITOR COMPARISON ── */}
      <section id="compare" className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
          How We Compare to Other Tools
        </h2>
        <p className="text-gray-500 text-center text-sm mb-8">
          Video to Image Sequence Online vs other online converters
        </p>
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-5 py-4 text-left text-gray-400 font-medium whitespace-nowrap">Feature</th>
                <th className="px-5 py-4 text-center font-bold text-cyan-400 whitespace-nowrap">
                  videotoimagesequence.online ✦
                </th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium whitespace-nowrap">Cloud Converters</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium whitespace-nowrap">Others</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {[
                ['File size limit',          '✅ Unlimited',   '❌ 200MB',      '❌ 100-200MB'],
                ['Server upload required',   '✅ Never',       '❌ Always',     '❌ Always'],
                ['100% Private',             '✅ Yes',         '❌ No',         '❌ No'],
                ['Individual frame preview', '✅ Full grid',   '✅ Yes',        '⚠️ Limited'],
                ['Per-frame download',       '✅ Yes',         '✅ Yes',        '⚠️ Some'],
                ['ZIP download',             '✅ Yes',         '✅ Yes',        '⚠️ Some'],
                ['Custom FPS control',       '✅ Yes',         '✅ Yes',        '⚠️ Some'],
                ['Batch processing',         '✅ Yes',         '❌ No',         '❌ No'],
                ['JPG + PNG output',         '✅ Both',        '✅ Both',       '⚠️ Varies'],
                ['PWA / Installable',        '✅ Yes',         '❌ No',         '❌ No'],
                ['Free forever',             '✅ 100%',        '✅ Free',       '⚠️ Freemium'],
                ['No account needed',        '✅ None',        '✅ None',       '⚠️ Some'],
              ].map(([feature, ours, cloud, others]) => (
                <tr key={feature} className="hover:bg-gray-900/50 transition-colors">
                  <td className="px-5 py-3 text-gray-300 font-medium">{feature}</td>
                  <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-medium">{ours}</td>
                  <td className="px-5 py-3 text-center text-gray-400">{cloud}</td>
                  <td className="px-5 py-3 text-center text-gray-500">{others}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── RELATED TOOLS ── */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-display">
          More Free Video Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              href: '/mp4-to-jpg',
              title: 'MP4 to JPG Converter',
              desc: 'Extract JPG frames from any MP4 video free in your browser.',
              icon: '🎞️'
            },
            {
              href: '/screenshot-from-video',
              title: 'Screenshot from Video',
              desc: 'Capture any exact frame from a video as a full-resolution image.',
              icon: '📸'
            },
            {
              href: '/video-to-png',
              title: 'Video to PNG Frames',
              desc: 'Extract lossless PNG frames for VFX, game dev, and ML datasets.',
              icon: '🎨'
            },
          ].map(({ href, title, desc, icon }) => (
            <Link key={href} to={href} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-800 hover:bg-gray-900/80 transition-all group block text-left">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-cyan-400 transition-colors">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── RELATED VIDEO FRAME TOOLS AND GUIDES ── */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
          Related Video Frame Tools and Guides
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10">
          Explore more tools and guides for video frame extraction
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              href: '/mp4-to-jpg',
              title: 'MP4 to Image Sequence Guide',
              desc: 'Learn how to convert MP4 videos to image sequences quickly and efficiently.',
              icon: '📚'
            },
            {
              href: '/mp4-to-jpg',
              title: 'Extract Frames from Video',
              desc: 'A comprehensive guide on extracting and saving individual frames from any video format.',
              icon: '🎯'
            },
            {
              href: '/video-to-png',
              title: 'Video to PNG Sequence',
              desc: 'Extract lossless PNG frames perfect for high-quality design work and VFX compositing.',
              icon: '🎨'
            },
            {
              href: '/images-to-video',
              title: 'Image Sequence to Video',
              desc: 'Combine extracted image sequences back into a video file with custom frame rates.',
              icon: '🎬'
            },
            {
              href: '/screenshot-from-video',
              title: 'Screenshot from Video',
              desc: 'Capture the perfect frame from any video as a high-resolution screenshot.',
              icon: '📸'
            },
            {
              href: '/video-to-png',
              title: 'Video to JPG Converter',
              desc: 'Convert video files to JPG image sequences for fast downloads and easy sharing.',
              icon: '📷'
            },
          ].map(({ href, title, desc, icon }) => (
            <Link key={href} to={href} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-cyan-800 hover:bg-gray-900/80 transition-all group block text-left">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{icon}</div>
              <h3 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors text-sm md:text-base">{title}</h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="max-w-3xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-display">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10">
          Everything you need to know about Video to Image Sequence Online
        </p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="border border-gray-800 bg-gray-900/50 rounded-2xl p-5 cursor-pointer group hover:border-cyan-800 transition-colors">
              <summary className="font-medium text-white text-sm md:text-base list-none flex justify-between items-center group-open:text-cyan-400">
                {faq.q}
                <span className="text-cyan-400 transition-transform group-open:rotate-180">
                   ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* AtOptions Ad Block - After FAQ */}
      <div className="max-w-5xl mx-auto">
        <AtOptionsAd />
      </div>
    </div>
  );
};

export default Home;