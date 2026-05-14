import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';

const faqs = [
  {
    q: 'How do I extract PNG frames from a video for free?',
    a: 'Drop your video into our tool above, select PNG as the output format, choose your FPS setting, and click Extract. All PNG frames download as a ZIP archive.'
  },
  {
    q: 'Why choose PNG over JPG for video frames?',
    a: 'PNG uses lossless compression so there is zero quality loss. This matters for VFX compositing, game development, and machine learning where pixel accuracy is critical.'
  },
  {
    q: 'Do PNG frames support transparency?',
    a: 'Yes. If your source video has an alpha channel (common in MOV files from professional cameras), our tool preserves transparency in the output PNG frames.'
  },
  {
    q: 'How large will the PNG files be?',
    a: 'PNG frames are typically 3 to 10 times larger than JPG frames depending on the video content. A 1080p PNG frame is usually between 500KB and 2MB.'
  },
  {
    q: 'Can I convert 4K video to PNG frames?',
    a: 'Yes. Since all processing happens in your browser with no upload, there is no file size or resolution limit. 4K PNG extraction works the same as 1080p.'
  }
];

const VideoToPng: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to extract PNG frames from a video",
        "description": "Convert video to PNG images online for free. Extract lossless PNG frames from MP4, MOV, and WEBM videos in your browser.",
        "step": [
          { "@type": "HowToStep", "name": "Open the tool", "text": "Open videotoimagesequence.online/video-to-png" },
          { "@type": "HowToStep", "name": "Upload video", "text": "Drop your video into our tool above" },
          { "@type": "HowToStep", "name": "Select format", "text": "Select PNG as the output format and choose your FPS setting" },
          { "@type": "HowToStep", "name": "Extract frames", "text": "Click Extract and wait for processing" },
          { "@type": "HowToStep", "name": "Download Zip", "text": "All PNG frames download as a ZIP archive" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", ".hero-description"]
        },
        "url": "https://videotoimagesequence.online/video-to-png"
      }
    ]);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="Video to PNG Converter Online Free — Extract PNG Frames Instantly"
        description="Convert video to PNG images online for free. Extract lossless PNG frames from MP4, MOV, and WEBM videos in your browser. No upload, no file size limit, 100% private."
        canonical="https://videotoimagesequence.online/video-to-png"
        ogTitle="Video to PNG Converter — Free, Lossless, No Upload"
        ogDescription="Extract lossless PNG frames from any video instantly in your browser. Perfect for VFX, game dev, and ML datasets."
        ogImage="https://videotoimagesequence.online/og-image.png"
        ogType="website"
      />
      
      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-16 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          Video to PNG Converter<br />
          <span className="text-cyan-400">Extract Lossless PNG Frames Online — Free</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          Why PNG matters over JPG — lossless compression means zero quality degradation, supports transparency (alpha channel), and is the professional standard for VFX, game development, and machine learning.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {[
            '✅ Lossless Quality',
            '🎨 PNG Alpha Support',
            '🔒 Private',
            '⚡ No Upload',
            '🆓 Free'
          ].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Main Tool Content */}
      <div className="animate-fade-in min-h-[400px] px-4 max-w-5xl mx-auto text-center">
        <div className="mb-4 inline-block bg-cyan-950/40 border border-cyan-800 text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium">
          💡 Tip: Select PNG in the format selector below for lossless output
        </div>
        <VideoToImages />
      </div>

      {/* JPG vs PNG for video frames */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-display">
          JPG vs PNG for video frames
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-5 py-4 text-left text-gray-400 font-medium whitespace-nowrap">Property</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium whitespace-nowrap">JPG</th>
                <th className="px-5 py-4 text-center font-bold text-cyan-400 whitespace-nowrap">PNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium whitespace-nowrap">Compression</td>
                <td className="px-5 py-3 text-center text-gray-400">Lossy</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-medium">Lossless</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium whitespace-nowrap">File Size</td>
                <td className="px-5 py-3 text-center text-gray-400">Smaller (~50-200KB/frame)</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-medium">Larger (~200KB-2MB/frame)</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium whitespace-nowrap">Quality Loss</td>
                <td className="px-5 py-3 text-center text-gray-400">Yes (artifacts at edges)</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-medium">None</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium whitespace-nowrap">Transparency</td>
                <td className="px-5 py-3 text-center text-gray-400">Not supported</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-medium">Full alpha channel support</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium whitespace-nowrap">Best For</td>
                <td className="px-5 py-3 text-center text-gray-400">Thumbnails, web sharing</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-medium">VFX, game dev, ML datasets</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium whitespace-nowrap">Processing Speed</td>
                <td className="px-5 py-3 text-center text-gray-400">Faster</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-medium">Slightly slower</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Who needs PNG frames from video? */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-display">
          Who needs PNG frames from video?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">VFX Artists</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Compositing in After Effects, Nuke, Fusion requires lossless PNG sequences.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Game Developers</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Sprite sheets and animation frames in Unity/Godot need transparent PNGs.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">ML Engineers</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Training computer vision models requires pixel-perfect image data.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">Motion Designers</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Blender and Cinema 4D render pipelines use PNG image sequences.</p>
          </div>
        </div>
      </section>

      {/* Video to PNG FAQ */}
      <section id="faq" className="max-w-3xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-display">
          Video to PNG FAQ
        </h2>
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
    </div>
  );
};

export default VideoToPng;
