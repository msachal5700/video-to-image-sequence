import React from 'react';
import VideoToImages from './VideoToImages';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    q: 'How do I convert a MOV video to PNG images for free?',
    a: 'Drag and drop your MOV file, select "PNG" format, choose FPS, and click Extract. Frames are extracted locally as lossless PNG and downloaded as a ZIP. No server upload.'
  },
  {
    q: 'Does MOV to PNG preserve transparency from ProRes 4444?',
    a: 'Not directly. ProRes 4444 carries alpha, but browsers cannot decode ProRes. Transcode it to WebM (VP9 with alpha) first, then extract PNG and the transparency is kept. Transcoding to H.264 instead gives opaque frames, because H.264 has no alpha channel.'
  },
  {
    q: 'Can I extract PNG frames from iPhone HEVC MOV files?',
    a: 'Yes, on Safari (macOS/iOS) and browsers with HEVC hardware decode. The extracted PNG frames will be opaque (HEVC doesn\'t carry alpha). For transparency, record in a format that supports it or use a different source.'
  },
  {
    q: 'Is there a file size limit for MOV to PNG conversion?',
    a: 'No server upload required. Processing happens in your browser. PNG files are 3–5× larger than JPG — expect larger ZIP downloads. Ensure sufficient RAM for long/high-FPS extractions.'
  },
  {
    q: 'Should I use PNG or WebP for MOV frame extraction?',
    a: 'PNG for maximum compatibility with VFX/game engines (Blender, Unity, Unreal, After Effects). WebP for web delivery: this tool exports WebP at 92% quality (lossy), which keeps transparency and is usually much smaller. Only PNG is lossless.'
  },
  {
    q: 'What FPS for VFX/ML datasets from MOV?',
    a: 'VFX: all frames (native FPS) for motion fidelity. ML datasets: 1–5 FPS for manageable size. Use the FPS slider to set your exact rate.'
  }
];

const MovToPng: React.FC = () => {
  const { t } = useTranslation();
  const webAppSchema = {
    "@type": "WebApplication",
    "name": "MOV to PNG Converter — Extract Lossless PNG Frames from MOV Free",
    "url": "https://www.videotoimagesequence.online/mov-to-png",
    "image": "https://www.videotoimagesequence.online/og-image.png",
    "description": "Convert MOV to PNG frames online for free. Extract lossless PNG image sequences from MOV videos (H.264, iPhone HEVC) in your browser. No server upload, custom FPS, ZIP download. Perfect for VFX, game dev, and ML datasets.",
    "applicationCategory": "MultimediaApplication",
    "applicationSubCategory": "Video Converter",
    "operatingSystem": "All — Browser-based",
    "browserRequirements": "Requires HTML5 and Javascript support",
    "featureList": [
      "Lossless PNG extraction (alpha kept when the source has it)",
      "Custom FPS control (1–60 FPS)",
      "Process MOV entirely in your browser (100% private)",
      "Batch processing of multiple MOV files",
      "ZIP download of extracted PNG frames",
      "ProRes must be transcoded first: to WebM VP9 to keep alpha, or to H.264 without alpha"
    ],
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  const faqSchema = {
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  };

  const howToSchema = {
    "@type": "HowTo",
    "name": "How to Convert MOV to PNG Frames",
    "description": "Step-by-step guide to extracting lossless PNG frames from MOV video locally in your browser.",
    "totalTime": "PT1M",
    "step": [
      { "@type": "HowToStep", "name": "Load Your MOV", "text": "Drag and drop your MOV file into the upload zone." },
      { "@type": "HowToStep", "name": "Select PNG Format", "text": "PNG is preselected on this page: lossless, and it keeps any alpha channel the source has." },
      { "@type": "HowToStep", "name": "Configure Frame Rate", "text": "Set your desired FPS (1–60) or select every frame." },
      { "@type": "HowToStep", "name": "Extract PNG Sequence", "text": "Click Extract Frames Now to decode locally." },
      { "@type": "HowToStep", "name": "Download PNG Frames", "text": "Download individual frames or get all as a ZIP archive." }
    ]
  };

  const organizationSchema = {
    "@type": "Organization",
    "name": "Video to Image Sequence Online",
    "url": "https://www.videotoimagesequence.online",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.videotoimagesequence.online/og-image.png"
    }
  };

  const pageSchemas = {
    "@context": "https://schema.org",
    "@graph": [webAppSchema, faqSchema, howToSchema, organizationSchema]
  };

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <script type="application/ld+json">
        {JSON.stringify(pageSchemas)}
      </script>
      <SEOHead
        title="MOV to PNG Converter — Extract Lossless PNG Frames from MOV Free"
        description="Convert MOV to PNG frames online for free. Extract lossless PNG image sequences from MOV and iPhone videos in your browser. No server upload, custom FPS, ZIP download. Perfect for VFX, game dev, and ML datasets."
        canonical="https://www.videotoimagesequence.online/mov-to-png"
        ogTitle="MOV to PNG Converter — Extract Lossless PNG Frames from MOV Free"
        ogDescription="Convert MOV to PNG frames online for free. Extract lossless PNG image sequences from MOV and iPhone videos in your browser. No server upload."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords="mov to png, mov to png converter, extract png frames from mov, lossless frame extractor, video to png sequence"
      />

      <Breadcrumb items={[{ label: 'MOV to PNG', path: '/mov-to-png' }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          MOV to PNG Converter<br />
          <span className="text-cyan-400">Extract Lossless PNG Frames Free</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Convert MOV video to lossless PNG images online for free. Custom FPS, ZIP download; alpha is kept when the source has it. 100% private — no server upload.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['🔒 100% Private', '🎨 Lossless PNG', '🌈 Alpha Channel', '📦 ZIP Download', '🎯 Custom FPS 1–60', '🆓 Free Forever'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">{badge}</span>
          ))}
        </div>
      </section>

      <div className="animate-fade-in min-h-[400px] px-4 mb-4">
        <VideoToImages initialFormat="png" />
      </div>

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">MOV Codec Support for PNG Extraction</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">H.264 / AVC (Standard MOV)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Universal support. Works perfectly on all browsers.</p>
            <span className="inline-block bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-semibold">Highly Recommended</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">HEVC / H.265 (iPhone MOV)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Native on Safari. Chrome/Edge/Firefox need hardware HEVC decode. Frames will be opaque (no alpha in HEVC).</p>
            <span className="inline-block bg-yellow-950 border border-yellow-800 text-yellow-500 text-xs px-2.5 py-1 rounded-full font-semibold">Varies by Browser</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">ProRes 4444 (With Alpha)</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Carries alpha but not browser-decodable. Transcode to WebM VP9 with alpha first, then extract PNG (H.264 would drop the alpha).</p>
            <span className="inline-block bg-red-950 border border-red-800 text-red-500 text-xs px-2.5 py-1 rounded-full font-semibold">Pre-transcode Required</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-lg mb-2">DNxHD / DNxHR</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-3">Not browser-decodable. Transcode to H.264 for extraction.</p>
            <span className="inline-block bg-red-950 border border-red-800 text-red-500 text-xs px-2.5 py-1 rounded-full font-semibold">Pre-transcode Required</span>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">How to Convert MOV to PNG Online</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="space-y-4">
            {[
              { num: '1', title: 'Upload your MOV file', desc: 'Drag and drop or click to select your MOV video.' },
              { num: '2', title: 'Select PNG format', desc: 'PNG is preselected: lossless, and it keeps any alpha channel the source has.' },
              { num: '3', title: 'Configure frame rate (FPS)', desc: 'Select how many frames per second to extract (1–60 FPS or every frame).' },
              { num: '4', title: 'Start the conversion', desc: 'Click "Extract Frames Now" to decode the video locally.' },
              { num: '5', title: 'Download your PNG frames', desc: 'Download individual frames or get all frames as a single ZIP file.' },
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

      <GoogleAdUnit />

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">MOV → PNG vs MOV → JPG vs MOV → WebP</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-5 py-4 text-left text-gray-400 font-medium">Factor</th>
                <th className="px-5 py-4 text-center font-bold text-cyan-400">PNG (This Page)</th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium"><Link to="/mov-to-jpg" className="hover:text-cyan-400">JPG</Link></th>
                <th className="px-5 py-4 text-center text-gray-400 font-medium"><Link to="/video-to-webp" className="hover:text-cyan-400">WebP</Link></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Quality</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">Lossless</td>
                <td className="px-5 py-3 text-center text-gray-500">Lossy (92%)</td>
                <td className="px-5 py-3 text-center text-gray-400">Lossless option</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Transparency</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">✅ Full alpha</td>
                <td className="px-5 py-3 text-center text-gray-500">❌ None</td>
                <td className="px-5 py-3 text-center text-gray-400">✅ Alpha</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">File Size</td>
                <td className="px-5 py-3 text-center text-gray-400">Largest</td>
                <td className="px-5 py-3 text-center bg-cyan-950/10 text-cyan-400 font-semibold">Smallest</td>
                <td className="px-5 py-3 text-center text-gray-400">25\u201335% smaller than JPG</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="px-5 py-3 text-gray-300 font-medium">Best For</td>
                <td className="px-5 py-3 text-center text-gray-400">VFX, Game Dev, ML, Archival</td>
                <td className="px-5 py-3 text-center text-gray-400">Thumbnails, Social</td>
                <td className="px-5 py-3 text-center text-gray-400">Web, Modern Pipelines</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed mt-6">
          Working with a mix of formats instead? The{' '}
          <Link to="/video-to-png" className="text-cyan-400 underline hover:text-cyan-300">video to PNG converter for any format</Link>{' '}
          runs the same lossless engine on MP4, MOV, WebM, and more.
        </p>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">⚠️ Browser RAM Notice for PNG</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            PNG files are 3–5× larger than JPG. MOV files (especially ProRes) can be large. Use lower FPS (1–5), process in chunks, or close other tabs to free RAM.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">MOV Files: ProRes, HEVC, and iPhone Footage</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <p className="text-gray-400 leading-relaxed">
            MOV is a container, not a codec — the .mov extension says nothing about what is inside. The reason to pull PNG frames out of one, specifically, is that PNG is the format you choose when the still itself becomes source material: a master frame for editing, a reference for color work, a dataset image, or an asset that will be processed again later. Every re-save of a JPG throws away a little more of the image; a PNG frame can be opened, edited, and re-saved indefinitely without drifting.
          </p>
          <p className="text-gray-400 leading-relaxed">
            That matters most with iPhone footage. iPhones record MOV with HEVC (H.265) when "High Efficiency" capture is on, and HEVC is already a heavily compressed format — the compression artifacts are baked into every frame before you touch it. Saving an extracted frame as JPG compresses it a second time and adds a fresh layer of artifacts on top. PNG writes the decoded frame exactly as decoded: one generation of loss, not two.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The same logic applies at the professional end. Editors working from ProRes MOV masters use stills for VFX plates, poster frames, and client approvals, where a soft or artifacted frame is useless. One honest limit: no browser can decode ProRes, so a ProRes file has to be transcoded before it can be extracted here — and for a true ProRes master, desktop tools that read the original file directly remain the right choice. This converter covers the far more common case: H.264 and HEVC MOV files from phones and cameras, written out losslessly.
          </p>
          <p className="text-gray-400 leading-relaxed">
            If the frames are only for quick review or sharing, the smaller files from the <Link to="/mov-to-jpg" className="text-cyan-400 hover:underline">MOV to JPG converter</Link> are the better trade. PNG earns its larger file size when the frame has a job to do after extraction.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Related Frame Extractors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/mov-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">MOV to JPG</h3>
            <p className="text-gray-500 text-xs">Smallest files, universal compatibility.</p>
          </Link>
          <Link to="/mp4-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">MP4 to PNG</h3>
            <p className="text-gray-500 text-xs">Standard MP4 H.264 → lossless PNG.</p>
          </Link>
          <Link to="/webm-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">WebM to PNG</h3>
            <p className="text-gray-500 text-xs">Lossless PNG frames from WebM clips.</p>
          </Link>
          <Link to="/video-to-webp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to WebP</h3>
            <p className="text-gray-500 text-xs">Modern format, 25–35% smaller than JPG, with alpha.</p>
          </Link>
          <Link to="/extract-frame-at-timestamp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Exact Timestamp</h3>
            <p className="text-gray-500 text-xs">Capture one precise PNG frame from MOV.</p>
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

export default MovToPng;