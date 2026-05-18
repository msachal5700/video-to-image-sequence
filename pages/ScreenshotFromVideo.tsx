import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';

const faqs = [
  {
    q: 'How do I take a screenshot from a video online?',
    a: 'Upload your video to our tool above, let it extract frames, then hover over any frame in the grid and click the download button to save that exact frame as a JPG or PNG.'
  },
  {
    q: 'What resolution will my video screenshot be?',
    a: 'The screenshot will be the full native resolution of your video — 1080p, 4K, or whatever resolution your video was recorded at.'
  },
  {
    q: 'Can I capture a specific timestamp from my video?',
    a: 'Yes. Set the FPS to a high value to get more frames, then browse the frame grid to find the exact moment you want and download just that frame.'
  },
  {
    q: 'Does this work for MP4, MOV, and WEBM videos?',
    a: 'Yes. Our tool supports MP4, MOV, and WEBM — the three most common video formats used by phones, cameras, and screen recorders.'
  },
  {
    q: 'Is taking a screenshot from a video free?',
    a: 'Yes. Our tool is completely free, requires no account, and has no file size limit.'
  }
];

const ScreenshotFromVideo: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to take a screenshot from a video online",
        "description": "Take a screenshot from any video online for free. Capture the exact frame you need from MP4, MOV, or WEBM videos instantly in your browser.",
        "step": [
          { "@type": "HowToStep", "name": "Open the tool", "text": "Open https://www.videotoimagesequence.online/screenshot-from-video" },
          { "@type": "HowToStep", "name": "Upload video", "text": "Upload your video to our tool above" },
          { "@type": "HowToStep", "name": "Extract frames", "text": "Let it extract frames at your chosen FPS" },
          { "@type": "HowToStep", "name": "Find frame", "text": "Hover over any frame in the grid" },
          { "@type": "HowToStep", "name": "Download screenshot", "text": "Click the download button to save that exact frame as a JPG or PNG" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", ".hero-description"]
        },
        "url": "https://www.videotoimagesequence.online/screenshot-from-video"
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
        title="Screenshot from Video Online Free — Capture Any Frame Instantly"
        description="Take a screenshot from any video online for free. Capture the exact frame you need from MP4, MOV, or WEBM videos instantly in your browser. No upload required."
        canonical="https://www.videotoimagesequence.online/screenshot-from-video"
        ogTitle="Screenshot from Video — Free Online Frame Capture Tool"
        ogDescription="Capture any frame from your video as a JPG or PNG screenshot. Free, instant, no upload needed."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
      />
      
      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-16 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          Screenshot from Video<br />
          <span className="text-cyan-400">Capture Any Frame Online — Free & Instant</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          Difference between this tool and a regular screenshot — regular screenshots capture whatever is on screen at a moment, but this tool lets you seek to any exact timestamp and capture that precise frame as a full-resolution JPG or PNG.
        </p>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {[
            '✅ Full Resolution',
            '🎯 Exact Frame',
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
      <div className="animate-fade-in min-h-[400px] px-4">
        <VideoToImages />
      </div>

      {/* How is this different from pressing Print Screen? */}
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-display">
          How is this different from pressing Print Screen?
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-4 text-gray-300">
          <ul className="list-disc pl-5 space-y-4 marker:text-cyan-500">
            <li>Print Screen / cmd+shift+4 captures whatever resolution your monitor shows.</li>
            <li>This tool captures the full native video resolution (e.g. 1920x1080 or 4K).</li>
            <li>No compression artifacts from screen recording.</li>
            <li>Works on any video even if it is DRM-free local file.</li>
          </ul>
        </div>
      </section>

      {/* Best ways to take a screenshot from a video */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 font-display">
          Best ways to take a screenshot from a video
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-4">Browser Tool (this site)</h3>
            <ul className="space-y-2 text-gray-400 text-sm list-disc pl-4">
              <li><strong className="text-white">Best for:</strong> full resolution, private files, no install.</li>
              <li>Instantly accessible and highly precise.</li>
            </ul>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-4">VLC Media Player</h3>
            <ul className="space-y-2 text-gray-400 text-sm list-disc pl-4">
              <li><strong className="text-white">Best for:</strong> desktop users who already have VLC installed.</li>
              <li>Must know the keyboard shortcut, quality is configurable.</li>
            </ul>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-4">FFmpeg</h3>
            <ul className="space-y-2 text-gray-400 text-sm list-disc pl-4">
              <li><strong className="text-white">Best for:</strong> developers and batch processing via command line.</li>
              <li>Steep learning curve but extremely powerful.</li>
            </ul>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-4">Video Editing Software</h3>
            <ul className="space-y-2 text-gray-400 text-sm list-disc pl-4">
              <li><strong className="text-white">Best for:</strong> users already in Premiere, DaVinci, Final Cut.</li>
              <li>Heavy operation for just one screenshot.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Screenshot from Video FAQ */}
      <section id="faq" className="max-w-3xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-display">
          Screenshot from Video FAQ
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

export default ScreenshotFromVideo;
