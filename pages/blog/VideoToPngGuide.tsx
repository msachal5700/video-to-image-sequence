import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';

export default function VideoToPngGuide() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "How to Convert Video to PNG Frames Online — Complete 2026 Guide",
        "description": "Learn exactly how to extract lossless PNG frames from any video file free in your browser. No software, no upload, no quality loss. Step-by-step guide for VFX, game dev, and ML engineers.",
        "url": "https://videotoimagesequence.online/blog/video-to-png-frames-guide",
        "datePublished": "2026-04-27",
        "dateModified": "2026-04-27",
        "author": {
          "@type": "Organization",
          "name": "Video to Image Sequence Online"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Video to Image Sequence Online"
        },
        "mainEntityOfPage": "https://videotoimagesequence.online/blog/video-to-png-frames-guide",
        "keywords": [
          "video to PNG", "extract PNG frames from video",
          "video to PNG sequence", "convert video to PNG online",
          "lossless video frames", "PNG frame extraction"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://videotoimagesequence.online" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://videotoimagesequence.online/blog" },
          { "@type": "ListItem", "position": 3, "name": "Video to PNG Frames Guide", "item": "https://videotoimagesequence.online/blog/video-to-png-frames-guide" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I convert a video to PNG images online for free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Go to videotoimagesequence.online/video-to-png, drop your MP4, MOV or WEBM video, select PNG as output format, choose your FPS, and click Extract. All PNG frames download as a ZIP file instantly in your browser."
            }
          },
          {
            "@type": "Question",
            "name": "Why is PNG better than JPG for video frame extraction?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PNG uses lossless compression meaning zero quality degradation. Every pixel is preserved exactly as it appears in the original video. JPG uses lossy compression which introduces artifacts especially at edges and text. For VFX, game development, and machine learning, PNG is always the professional choice."
            }
          },
          {
            "@type": "Question",
            "name": "Can I extract PNG frames from 4K video online?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Since all processing happens in your browser with no server upload, there is no file size or resolution limit. 4K PNG extraction works the same as 1080p. The only constraint is your device RAM."
            }
          },
          {
            "@type": "Question",
            "name": "What is the best free tool to extract PNG frames from video?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Video to Image Sequence Online at videotoimagesequence.online/video-to-png is the best free option. It requires no upload, has no file size limit, outputs lossless PNG, supports custom FPS, and processes everything privately in your browser."
            }
          },
          {
            "@type": "Question",
            "name": "How large are PNG frames extracted from video?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PNG frame sizes depend on resolution and content complexity. A typical 1080p PNG frame is between 500KB and 2MB. A 4K PNG frame can range from 2MB to 8MB. PNG files are significantly larger than JPG but contain no quality loss."
            }
          }
        ]
      }
    ]);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <SEOHead
        title="How to Convert Video to PNG Frames Online Free — Complete 2026 Guide"
        description="Learn exactly how to extract lossless PNG frames from any video file free in your browser. No software, no upload, no quality loss. Step-by-step guide for VFX, game dev, and ML engineers."
        canonical="https://videotoimagesequence.online/blog/video-to-png-frames-guide"
        ogTitle="How to Convert Video to PNG Frames Online Free — 2026 Guide"
        ogDescription="Extract lossless PNG frames from any video instantly in your browser. No upload, no size limit, free forever."
        ogImage="https://videotoimagesequence.online/og-image.png"
        ogType="article"
        articleDate="2026-04-27"
      />

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-2">
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-cyan-400 transition">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-cyan-400 transition">Blog</Link>
          <span>/</span>
          <span className="text-gray-400">Video to PNG Frames Guide</span>
        </nav>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 pt-8 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <span className="bg-cyan-950 border border-cyan-800 text-cyan-400 
            text-xs px-3 py-1 rounded-full">
            PNG Extraction
          </span>
          <span className="text-gray-500 text-xs">April 27, 2026</span>
          <span className="text-gray-500 text-xs">·</span>
          <span className="text-gray-500 text-xs">12 min read</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold font-display text-white 
          leading-tight mb-6">
          How to Convert Video to PNG Frames Online —{' '}
          <span className="text-cyan-400">Complete 2026 Guide</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-8">
          PNG is the professional standard for video frame extraction. Unlike JPG,
          PNG preserves every single pixel with zero quality loss — making it
          essential for VFX compositing, game development, and machine learning
          datasets. This guide covers everything you need to know about converting
          video to PNG frames online, completely free, without uploading your file
          to any server.
        </p>

        {/* Quick stats bar */}
        <div className="grid grid-cols-3 gap-4 bg-gray-900 border border-gray-800 
          rounded-2xl p-6">
          {[
            { label: 'Processing', value: '100% Browser' },
            { label: 'Output Quality', value: 'Lossless PNG' },
            { label: 'Cost', value: 'Free Forever' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-cyan-400 font-bold text-lg">{stat.value}</div>
              <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Article Body */}
      <article className="max-w-4xl mx-auto px-4 pb-20 prose prose-invert 
        prose-cyan max-w-none">

        {/* Section 1 */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            What Does "Video to PNG" Actually Mean?
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            When people say they want to convert a video to PNG, they mean
            extracting individual frames from a video file and saving each frame
            as a separate PNG image. A 30-second video recorded at 30 frames per
            second contains exactly 900 individual frames. Each of those frames
            can be saved as a PNG file — a still image that captures that exact
            moment in the video with complete detail.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            This process is called frame extraction or video to image sequence
            conversion. The resulting PNG files can be used for anything from
            creating video thumbnails to building machine learning training
            datasets to compositing visual effects in professional film production.
          </p>
          <p className="text-gray-400 leading-relaxed">
            The key word is PNG specifically — not JPG. PNG uses lossless
            compression which means every pixel in the extracted frame is
            mathematically identical to the corresponding pixel in the original
            video. There is no quality degradation, no compression artifacts,
            no blurring of edges. What you see in the video is exactly what you
            get in the PNG file. This is why professionals always choose PNG when
            quality matters.
          </p>
        </section>

        {/* Section 2 - Why PNG */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Why PNG Instead of JPG for Video Frames?
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            This is the most common question from users new to frame extraction.
            Both JPG and PNG are image formats, so why does the choice matter?
            The answer comes down to one fundamental difference in how each
            format handles compression.
          </p>

          {/* Comparison Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-900 border border-gray-800">
                  <th className="text-left p-4 text-white font-semibold">Property</th>
                  <th className="text-left p-4 text-cyan-400 font-semibold">PNG</th>
                  <th className="text-left p-4 text-gray-400 font-semibold">JPG</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Compression Type', 'Lossless — zero quality loss', 'Lossy — quality degrades'],
                  ['Pixel Accuracy', 'Perfect — every pixel preserved', 'Approximate — artifacts appear'],
                  ['File Size', 'Larger (500KB–2MB per 1080p frame)', 'Smaller (50–200KB per 1080p frame)'],
                  ['Transparency', 'Supported (alpha channel)', 'Not supported'],
                  ['Best For', 'VFX, game dev, ML, professional work', 'Thumbnails, web, social media'],
                  ['Re-editing', 'No quality loss on resave', 'Loses quality each resave'],
                ].map(([prop, png, jpg], i) => (
                  <tr key={prop}
                    className={`border border-gray-800 ${i % 2 === 0 ? 'bg-gray-900/50' : ''}`}>
                    <td className="p-4 text-white font-medium text-sm">{prop}</td>
                    <td className="p-4 text-cyan-400 text-sm">{png}</td>
                    <td className="p-4 text-gray-500 text-sm">{jpg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-gray-400 leading-relaxed mb-4">
            JPG compression works by analyzing the image and discarding information
            that the human eye is less likely to notice — particularly fine details
            at edges and areas of high contrast. For casual use like sharing on
            social media, this is perfectly acceptable. The files are smaller and
            the quality loss is usually invisible at normal viewing sizes.
          </p>
          <p className="text-gray-400 leading-relaxed">
            But for professional workflows, that discarded information matters
            enormously. A VFX artist compositing a PNG sequence into a film scene
            needs clean, sharp edges for their rotoscoping masks. A game developer
            creating sprite sheets needs pixel-perfect transparency in their PNG
            frames. A machine learning engineer training a computer vision model
            needs accurate pixel values that have not been altered by compression
            algorithms. In all of these cases, JPG simply does not meet the
            quality bar that PNG delivers.
          </p>
        </section>

        {/* Section 3 - How to extract */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            How to Extract PNG Frames from Video Online — Step by Step
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            The fastest and most private way to convert video to PNG frames online
            is using a browser-based tool that processes your video locally on
            your device. This approach requires no software installation, no
            account creation, and no uploading your video to a remote server.
            Here is the complete process using our free tool:
          </p>

          <div className="space-y-6 mb-8">
            {[
              {
                num: '01',
                title: 'Open the Video to PNG Tool',
                desc: 'Navigate to videotoimagesequence.online/video-to-png in any modern browser — Chrome, Firefox, Safari, or Edge all work perfectly. No installation required. The tool loads instantly.'
              },
              {
                num: '02',
                title: 'Load Your Video File',
                desc: 'Drag and drop your MP4, MOV, or WEBM video file directly into the upload zone, or click to browse and select it from your device. Your video file stays on your device — it is never uploaded to any server.'
              },
              {
                num: '03',
                title: 'Select PNG as Output Format',
                desc: 'In the format selector, click PNG. A hint will appear confirming that PNG gives you lossless quality best for VFX and game development. This is the key step that determines your output will be full-quality lossless frames.'
              },
              {
                num: '04',
                title: 'Choose Your Frame Rate',
                desc: 'Select how many frames per second to extract. For VFX and animation work, 24 or 30 FPS captures every frame. For creating reference images or datasets, 1 or 5 FPS gives you a manageable number of files. Higher FPS means more PNG files and a larger ZIP archive.'
              },
              {
                num: '05',
                title: 'Extract and Download',
                desc: 'Click Extract Frames. The tool processes your video entirely in your browser and displays a visual preview grid of all extracted PNG frames. Click Download All as ZIP to get every frame in a single archive, or hover over individual frames to download just the ones you need.'
              },
            ].map((step) => (
              <div key={step.num}
                className="flex gap-6 bg-gray-900 border border-gray-800 
                  rounded-2xl p-6">
                <div className="text-cyan-400 font-bold text-3xl font-display 
                  shrink-0 w-12">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Box */}
          <div className="bg-cyan-950 border border-cyan-800 rounded-2xl p-8 
            text-center">
            <h3 className="text-white font-bold text-xl mb-3">
              Ready to Extract PNG Frames?
            </h3>
            <p className="text-cyan-300 text-sm mb-6">
              Free, private, no upload required. Works on any device.
            </p>
            <Link
              to="/video-to-png"
              className="inline-flex items-center gap-2 bg-cyan-500 
                hover:bg-cyan-400 text-gray-950 font-bold px-8 py-3 
                rounded-xl transition-colors"
            >
              Extract PNG Frames Free →
            </Link>
          </div>
        </section>

        {/* Section 4 - Use Cases */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Who Needs PNG Frames from Video?
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            PNG frame extraction is used across a wide range of professional
            creative and technical disciplines. Understanding the specific use
            case helps you configure the extraction settings for the best results.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '🎬',
                title: 'VFX Artists and Compositors',
                desc: 'Visual effects professionals extract PNG sequences from footage to composite into film and television productions. The lossless quality is essential for clean rotoscoping masks, accurate color grading, and seamless integration with CGI elements. Software like Adobe After Effects, Nuke, and DaVinci Resolve all work natively with PNG image sequences. PNG sequences preserve HDR color information that JPG compression would destroy.',
                tip: 'Use 24 or 25 FPS to match cinema frame rates. Always choose PNG for compositing work.'
              },
              {
                icon: '🎮',
                title: 'Game Developers',
                desc: 'Game developers extract PNG frames to create sprite sheets for 2D games, reference images for 3D modelling, and animation frames for character movement cycles. The transparency support in PNG is critical — game engines like Unity and Godot read PNG alpha channels directly for sprite transparency. Game assets need to be pixel-perfect and PNG delivers exactly that without any JPG compression artifacts that would create dark halos around transparent edges.',
                tip: 'For sprite sheets, use maximum FPS to capture every animation frame from your reference video.'
              },
              {
                icon: '🤖',
                title: 'Machine Learning Engineers',
                desc: 'Training computer vision models requires large datasets of labeled images. Video is the most efficient way to generate these datasets — a single hour of video at 1 FPS produces 3,600 training images. PNG output is important for ML work because neural networks are sensitive to compression artifacts. JPG compression changes pixel values in ways that can introduce noise into training data. PNG ensures your model learns from accurate visual information.',
                tip: 'Use 1-5 FPS for ML datasets to avoid extracting near-identical consecutive frames.'
              },
              {
                icon: '🎨',
                title: 'Motion Designers',
                desc: 'Motion graphics designers working in Blender, Cinema 4D, and Houdini frequently need to export PNG image sequences from rendered video files to use in presentation tools, client deliverables, or further compositing. PNG sequences are the standard interchange format between 3D rendering and compositing software. The ability to extract a PNG sequence from an existing video without re-rendering saves hours of computation time.',
                tip: 'Match your extraction FPS to the original render frame rate for frame-accurate sequences.'
              },
            ].map((card) => (
              <div key={card.title}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-white font-bold text-lg mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {card.desc}
                </p>
                <div className="bg-gray-800 rounded-xl p-3">
                  <p className="text-cyan-400 text-xs">
                    <span className="font-bold">💡 Pro Tip:</span> {card.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 - File size guide */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            How Large Will Your PNG Files Be?
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            PNG files are significantly larger than JPG files because they store
            complete lossless data. Understanding the expected file sizes helps
            you plan storage and choose the right FPS setting for your project.
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-900 border border-gray-800">
                  <th className="text-left p-4 text-white font-semibold">
                    Resolution
                  </th>
                  <th className="text-left p-4 text-cyan-400 font-semibold">
                    Avg PNG Frame Size
                  </th>
                  <th className="text-left p-4 text-gray-400 font-semibold">
                    100 Frames ZIP Size
                  </th>
                  <th className="text-left p-4 text-gray-400 font-semibold">
                    1 Min at 30FPS ZIP
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['720p (1280×720)', '~300KB', '~30MB', '~540MB'],
                  ['1080p (1920×1080)', '~800KB', '~80MB', '~1.4GB'],
                  ['1440p (2560×1440)', '~1.5MB', '~150MB', '~2.7GB'],
                  ['4K (3840×2160)', '~3MB', '~300MB', '~5.4GB'],
                ].map(([res, frame, zip100, zip1min], i) => (
                  <tr key={res}
                    className={`border border-gray-800 
                      ${i % 2 === 0 ? 'bg-gray-900/50' : ''}`}>
                    <td className="p-4 text-white text-sm font-medium">{res}</td>
                    <td className="p-4 text-cyan-400 text-sm">{frame}</td>
                    <td className="p-4 text-gray-400 text-sm">{zip100}</td>
                    <td className="p-4 text-gray-400 text-sm">{zip1min}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-900 border border-yellow-800/50 rounded-2xl p-6">
            <p className="text-yellow-400 font-bold mb-2">
              ⚠️ Storage Planning Tip
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              For most use cases you do not need every single frame. A 1-minute
              video at 1 FPS gives you 60 PNG frames — usually sufficient for
              reference images, thumbnails, or dataset sampling. Only use 24–30
              FPS when you specifically need every individual frame for animation
              or compositing work.
            </p>
          </div>
        </section>

        {/* Section 6 - Alternatives */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Other Ways to Extract PNG Frames from Video
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Browser-based tools are the easiest approach, but it is worth
            knowing the alternatives so you can choose the right method for
            your specific situation.
          </p>

          <div className="space-y-4">
            {[
              {
                method: 'FFmpeg (Command Line)',
                difficulty: 'Advanced',
                diffColor: 'text-red-400',
                pros: 'Extremely powerful, batch processing, scriptable, handles any format',
                cons: 'Requires installation, command line knowledge, not beginner-friendly',
                command: 'ffmpeg -i input.mp4 -vf fps=1 frame_%04d.png'
              },
              {
                method: 'VLC Media Player',
                difficulty: 'Intermediate',
                diffColor: 'text-yellow-400',
                pros: 'Free desktop software, good format support',
                cons: 'Slow manual process, requires installation, limited batch capability',
                command: 'Video → Scene Filter → Set path and format → Enable'
              },
              {
                method: 'Adobe Premiere Pro',
                difficulty: 'Professional',
                diffColor: 'text-purple-400',
                pros: 'Highest quality, timeline control, professional features',
                cons: 'Expensive subscription, complex for simple frame extraction',
                command: 'File → Export → Media → PNG Sequence'
              },
              {
                method: 'Browser Tool (This Site)',
                difficulty: 'Beginner',
                diffColor: 'text-cyan-400',
                pros: 'No install, no upload, free, private, instant results on any device',
                cons: 'Requires modern browser, very large files need sufficient device RAM',
                command: 'videotoimagesequence.online/video-to-png'
              },
            ].map((alt) => (
              <div key={alt.method}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold">{alt.method}</h3>
                  <span className={`text-xs font-bold ${alt.diffColor}`}>
                    {alt.difficulty}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-green-400 text-xs font-bold mb-1">
                      ✓ Pros
                    </p>
                    <p className="text-gray-400 text-xs">{alt.pros}</p>
                  </div>
                  <div>
                    <p className="text-red-400 text-xs font-bold mb-1">
                      ✗ Cons
                    </p>
                    <p className="text-gray-400 text-xs">{alt.cons}</p>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg px-4 py-2">
                  <code className="text-cyan-400 text-xs">{alt.command}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'How do I convert a video to PNG images online for free?',
                a: 'Go to videotoimagesequence.online/video-to-png, drop your MP4, MOV or WEBM video into the tool, select PNG as the output format, choose your desired FPS setting, and click Extract Frames. All PNG frames will be generated in your browser and available to download as a ZIP archive. The entire process is free and your video never leaves your device.'
              },
              {
                q: 'Why is PNG better than JPG for video frame extraction?',
                a: 'PNG uses lossless compression meaning every pixel is preserved exactly as it appears in the original video. JPG uses lossy compression which discards visual information to reduce file size, creating artifacts especially at edges and areas of high contrast. For professional work like VFX compositing, game development, and machine learning, PNG is always the correct choice because pixel accuracy matters.'
              },
              {
                q: 'Can I extract PNG frames from 4K video online for free?',
                a: 'Yes. Since all processing happens locally in your browser with no file upload to any server, there is no imposed file size or resolution limit. You can process 4K videos the same as 1080p videos. The only practical constraint is your device RAM — close other browser tabs when processing very large 4K files.'
              },
              {
                q: 'What is the best free tool to extract PNG frames from video?',
                a: 'Video to Image Sequence Online at videotoimagesequence.online/video-to-png is the best free option available. It requires no server upload so your files stay completely private, has no file size limit, outputs true lossless PNG, supports custom FPS from 1 to 60, allows batch processing of multiple videos, and works on any device without installation.'
              },
              {
                q: 'How large are PNG files extracted from video?',
                a: 'PNG frame file sizes depend on your video resolution. A typical 1080p PNG frame is between 500KB and 2MB. A 4K PNG frame ranges from 2MB to 8MB. PNG files are 4 to 10 times larger than equivalent JPG frames, but contain zero quality loss. For 1-minute of 1080p video at 30FPS, expect approximately 1.4GB of PNG files.'
              },
            ].map((item, i) => (
              <details key={i}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 
                  group cursor-pointer">
                <summary className="text-white font-medium list-none flex 
                  justify-between items-center gap-4">
                  <span>{item.q}</span>
                  <span className="text-cyan-400 text-xl shrink-0 
                    group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-gray-900 to-cyan-950 
          border border-cyan-900 rounded-3xl p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Start Extracting PNG Frames Now
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Free, private, lossless PNG output. No upload required.
            Works on any device. No account needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/video-to-png"
              className="inline-flex items-center justify-center gap-2 
                bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold 
                px-8 py-4 rounded-xl transition-colors"
            >
              Extract PNG Frames Free →
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center gap-2 
                bg-gray-800 hover:bg-gray-700 text-white font-medium 
                px-8 py-4 rounded-xl transition-colors"
            >
              Read More Guides
            </Link>
          </div>
        </section>

        {/* Related Articles */}
        <section className="mt-16">
          <h2 className="text-xl font-bold text-white mb-6">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                to: '/blog/mp4-to-image-sequence-guide',
                tag: 'MP4 Guide',
                title: 'MP4 to Image Sequence: Complete Beginner Guide'
              },
              {
                to: '/blog/extract-frames-from-video-online',
                tag: 'Frame Extraction',
                title: 'How to Extract Frames from Any Video Online Free'
              },
              {
                to: '/blog/video-to-png-frames-free',
                tag: 'PNG Frames',
                title: 'Video to PNG Frames — Best Free Method in 2026'
              },
            ].map((article) => (
              <Link
                key={article.to}
                to={article.to}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 
                  hover:border-cyan-800 transition-colors group"
              >
                <span className="text-xs text-cyan-400 font-medium">
                  {article.tag}
                </span>
                <p className="text-white text-sm font-medium mt-2 
                  group-hover:text-cyan-400 transition-colors leading-snug">
                  {article.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}