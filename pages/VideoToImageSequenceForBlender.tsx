import React, { useEffect } from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I convert a video to an image sequence for Blender?',
    a: 'Upload your video, select PNG format (lossless with alpha), set FPS to match your video\'s native frame rate (e.g., 24, 25, 30), and click Extract. Download the ZIP, unzip into a folder, then in Blender: Add → Image Sequence, select the folder. Set the frame rate in Blender to match your extraction FPS.'
  },
  {
    q: 'What naming convention does Blender expect for image sequences?',
    a: 'Blender expects sequential numbering: frame_0001.png, frame_0002.png, etc. Our tool outputs frame_000001.png (6-digit padding) which Blender reads correctly. Just select the first frame and Blender auto-detects the sequence.'
  },
  {
    q: 'Should I use PNG or EXR for Blender VFX work?',
    a: 'PNG for most compositing (lossless, 8/16-bit, alpha support, universal). EXR for HDR plates, deep compositing, cryptomatte passes. This tool outputs PNG/WebP/JPG. For EXR, use FFmpeg/OCIO pipeline post-extraction.'
  },
  {
    q: 'How do I match Blender\'s frame rate to my extracted sequence?',
    a: 'In Blender: Scene Properties → Frame Rate → set to your extraction FPS (Custom). Then: Output Properties → Frame Rate → same value. Set Frame Start=1, Frame End=total frames. This ensures 1:1 frame playback.'
  },
  {
    q: 'Can I extract frames with alpha channel for Blender compositing?',
    a: 'Yes, if your source video has alpha (WebM VP9 with alpha, ProRes 4444 MOV). Select PNG format — transparency is preserved. Standard H.264 MP4 does not carry alpha; frames will be opaque.'
  },
  {
    q: 'What about color space — sRGB vs linear for Blender?',
    a: 'Extracted frames are in the video\'s native color space (typically sRGB/Rec.709). In Blender, set Color Management → View Transform → Standard (sRGB) for sRGB sources. For linear workflow, convert in compositor or use OCIO config.'
  },
  {
    q: 'How do I handle 4K video for Blender without memory issues?',
    a: '4K frames consume 4× RAM of 1080p. Options: (1) Lower FPS to 12–15 for reference, (2) Process in 30-second chunks, (3) Close other tabs, (4) Use proxy resolution in Blender (50%/25%) for viewport, full res at render.'
  }
];

const VideoToImageSequenceForBlender: React.FC = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const existing = document.getElementById('video-to-image-sequence-for-blender-schemas');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'video-to-image-sequence-for-blender-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Video to Image Sequence for Blender — PNG Frames Free",
      "url": "https://www.videotoimagesequence.online/video-to-image-sequence-for-blender",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Convert video to PNG image sequence for Blender free. Extract lossless frames with alpha, custom FPS (24/25/30/60), ZIP download. 100% private, no server upload. Perfect for VFX, compositing, rotoscoping, camera tracking.",
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "VFX Pipeline Tool",
      "operatingSystem": "All — Browser-based",
      "browserRequirements": "Requires HTML5 and Javascript support",
      "featureList": [
        "Lossless PNG with alpha for Blender compositing",
        "Custom FPS: 24, 25, 30, 60 (film & broadcast standards)",
        "Sequential naming: frame_000001.png (Blender native)",
        "ZIP download → unzip → Add → Image Sequence",
        "100% private — no upload, local browser processing",
        "Supports MP4, MOV, WEBM (H.264, ProRes* via transcode)"
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
      "name": "How to Create Blender Image Sequence from Video",
      "description": "Step-by-step: video → PNG sequence → Blender import. Match FPS, preserve alpha, composite in Cycles/Eevee.",
      "totalTime": "PT3M",
      "step": [
        { "@type": "HowToStep", "name": "Extract PNG Sequence", "text": "Upload video → PNG format → set FPS (24/25/30/60) → Extract → Download ZIP." },
        { "@type": "HowToStep", "name": "Unzip to Folder", "text": "Extract ZIP to a dedicated folder (e.g., /project/plates/shot01/)." },
        { "@type": "HowToStep", "name": "Import in Blender", "text": "Add → Image Sequence → select folder → click first frame (frame_000001.png)." },
        { "@type": "HowToStep", "name": "Match Frame Rate", "text": "Scene → Frame Rate → Custom → enter extraction FPS. Output → Frame Rate → same." },
        { "@type": "HowToStep", "name": "Composite & Render", "text": "Use in Compositor, as texture, or background plate. Render at matched frame rate." }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => { const el = document.getElementById('video-to-image-sequence-for-blender-schemas'); if (el) el.remove(); };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="Video to Image Sequence for Blender — PNG Frames Free"
        description="Convert video to PNG image sequence for Blender free. Extract lossless frames with alpha, custom FPS (24/25/30/60), ZIP download. 100% private, no server upload. Perfect for VFX, compositing, rotoscoping."
        canonical="https://www.videotoimagesequence.online/video-to-image-sequence-for-blender"
        ogTitle="Video to Image Sequence for Blender — PNG Frames Free"
        ogDescription="Convert video to Blender-ready PNG sequence. Lossless, alpha, custom FPS, ZIP download. 100% private."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords="video to image sequence blender, blender png sequence, video to blender frames, blender compositing plates, image sequence for blender"
      />

      <Breadcrumb items={[
        { label: 'Use Cases', path: '/#use-cases' },
        { label: 'Blender Pipeline', path: '/video-to-image-sequence-for-blender' }
      ]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          Video to Image Sequence for Blender<br />
          <span className="text-cyan-400">PNG Frames for VFX & Compositing Free</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Convert video into Blender-ready PNG image sequences. Lossless quality, alpha channel support, film-standard FPS (24/25/30/60), sequential naming. Unzip → Add → Image Sequence → composite. 100% private.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['🎬 Blender Native Naming', '🎨 Lossless PNG + Alpha', '⚙️ 24/25/30/60 FPS', '📦 ZIP → Add → Image Sequence', '🔒 100% Private', '🆓 Free Forever'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">{badge}</span>
          ))}
        </div>
      </section>

      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToImages />
      </div>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">Blender Import Workflow</h2>
        <div className="space-y-4">
          {[
            { step: '1', title: 'Extract PNG Sequence', desc: 'Upload video → PNG format → set FPS (24/25/30/60) → Extract → Download ZIP.' },
            { step: '2', title: 'Unzip to Project Folder', desc: 'Extract ZIP to /project/plates/shot_name/. Frames named frame_000001.png.' },
            { step: '3', title: 'Import in Blender', desc: 'Shift+A → Image → Image Sequence → select folder → click frame_000001.png.' },
            { step: '4', title: 'Match Frame Rate', desc: 'Scene Properties → Frame Rate → Custom → enter extraction FPS. Output → same FPS.' },
            { step: '5', title: 'Use in Compositor/Shader', desc: 'Add → Image node in Compositor, or Image Texture in Shader Editor. Connect to Viewer/Output.' },
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
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Recommended Settings for Blender</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-800 mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Use Case</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium">FPS</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium">Format</th>
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Film/VFX Plates (Cinema)</td>
                <td className="px-5 py-3 text-center">24 FPS</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG</td>
                <td className="px-5 py-3 text-gray-400">Standard film rate. Match project FPS.</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Broadcast (PAL/EU)</td>
                <td className="px-5 py-3 text-center">25 FPS</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG</td>
                <td className="px-5 py-3 text-gray-400">European TV standard.</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Broadcast (NTSC/US) / Web</td>
                <td className="px-5 py-3 text-center">30 FPS</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG</td>
                <td className="px-5 py-3 text-gray-400">US TV, YouTube, social media.</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">High-Speed / Slow-Mo Reference</td>
                <td className="px-5 py-3 text-center">60 FPS</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG</td>
                <td className="px-5 py-3 text-gray-400">Smooth motion analysis, retiming.</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Rotoscoping / Roto Paint</td>
                <td className="px-5 py-3 text-center">Native FPS (all frames)</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG</td>
                <td className="px-5 py-3 text-gray-400">Every frame for precise mattes.</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Camera Tracking / Matchmove</td>
                <td className="px-5 py-3 text-center">Native FPS</td>
                <td className="px-5 py-3 text-center text-cyan-400 font-semibold">PNG</td>
                <td className="px-5 py-3 text-gray-400">Every frame for solve accuracy.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Alpha Channel & Transparency</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">When Alpha Works</h3>
            <ul className="text-gray-400 text-sm space-y-2 list-disc pl-5">
              <li>WebM VP9 with alpha (Chrome screen recording)</li>
              <li>ProRes 4444 MOV (transcode to H.264 first — browsers can't decode ProRes)</li>
              <li>AV1 with alpha (Chrome/Firefox/Edge)</li>
            </ul>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">When Alpha Won't Work</h3>
            <ul className="text-gray-400 text-sm space-y-2 list-disc pl-5">
              <li>Standard H.264 MP4 (no alpha support in codec)</li>
              <li>HEVC/H.265 MP4 (no alpha)</li>
              <li>Most screen recordings (opaque background)</li>
            </ul>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-4">
          Need alpha from ProRes? Transcode to WebM VP9 with alpha using FFmpeg:
          <code className="text-cyan-400 bg-gray-900 px-2 py-1 rounded ml-2">ffmpeg -i input.mov -c:v libvpx-vp9 -auto-alt-ref 0 -pix_fmt yuva420p output.webm</code>
        </p>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Color Management for Blender</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 leading-relaxed">
            Extracted frames inherit the video's color space (usually sRGB/Rec.709). Configure Blender accordingly:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
              <h4 className="text-cyan-400 font-semibold mb-2">sRGB Source (Most Videos)</h4>
              <ul className="text-gray-400 text-sm space-y-1 list-disc pl-5">
                <li>Color Management → View Transform: <strong>Standard (sRGB)</strong></li>
                <li>Compositor: Image node → Color Space: <strong>sRGB</strong></li>
                <li>Shader: Image Texture → Color Space: <strong>sRGB</strong></li>
              </ul>
            </div>
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
              <h4 className="text-cyan-400 font-semibold mb-2">Linear/OCIO Workflow</h4>
              <ul className="text-gray-400 text-sm space-y-1 list-disc pl-5">
                <li>Color Management → View Transform: <strong>Filmic / AgX</strong></li>
                <li>Compositor: Image node → Color Space: <strong>Linear</strong> (if converted)</li>
                <li>Use OCIO config for show-wide consistency</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Blender Compositor Nodes for Plates</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 leading-relaxed">
            Minimal node setup for a clean plate:
          </p>
          <pre className="text-xs text-gray-300 bg-gray-950 p-4 rounded overflow-x-auto"><code>Image (frame_####.png) → [Color Space: sRGB/Linear] → Viewer / Composite Output
     │
     └─→ Alpha Over (if plate has alpha) → Background Plate → Composite</code></pre>
          <p className="text-gray-400 text-sm">
            For rotoscoping: Image → Roto/Mask nodes → Alpha Over → Composite.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">⚠️ 4K/High-Res in Blender</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            4K plates = 4× VRAM. In Blender: Preferences → System → Memory → set limit. Use Proxy/Timecode → 50%/25% for viewport, full res at render. Close other apps.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Related Blender Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/extract-frames-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video Frame Extractor</h3>
            <p className="text-gray-500 text-xs">Main tool — all formats, all FPS.</p>
          </Link>
          <Link to="/video-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to PNG</h3>
            <p className="text-gray-500 text-xs">Lossless PNG from any format.</p>
          </Link>
          <Link to="/extract-frame-at-timestamp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Exact Timestamp</h3>
            <p className="text-gray-500 text-xs">Capture reference frames for matchmove.</p>
          </Link>
          <Link to="/blog/mp4-to-image-sequence-guide" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">MP4 to Image Sequence Guide</h3>
            <p className="text-gray-500 text-xs">Complete Blender import guide.</p>
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

export default VideoToImageSequenceForBlender;