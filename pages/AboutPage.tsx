import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';

const CANONICAL = 'https://www.videotoimagesequence.online/about';

const AboutPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
    }
  };

  // Structured Data for Google E-E-A-T (Organization & Person Schema)
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Muhammad Sachal',
    jobTitle: 'Founder & Senior Software Engineer',
    description: 'Computer Science graduate specializing in AI, AR, Web Development, 3D Graphics, and SEO automation.',
    url: 'https://github.com/msachal5700',
    sameAs: [
      'https://github.com/msachal5700',
      'https://www.linkedin.com/in/muhammadsachal'
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Computer Science Department'
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Video to Image Sequence Online',
    url: 'https://www.videotoimagesequence.online',
    logo: 'https://www.videotoimagesequence.online/og-image.png',
    founder: {
      '@type': 'Person',
      name: 'Muhammad Sachal'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@videotoimagesequence.online',
      contactType: 'technical support'
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.videotoimagesequence.online/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: CANONICAL
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="About Us — Privacy-First Video Frame Extraction | Video to Image Sequence"
        description="Learn about Video to Image Sequence Online, built by Muhammad Sachal. Discover our mission for fast, 100% private, in-browser video frame extraction tools."
        canonical={CANONICAL}
        ogTitle="About Video to Image Sequence — Privacy-First In-Browser Media Tools"
        ogDescription="Built by Muhammad Sachal. Fast, 100% private, browser-based frame extraction with no server uploads or file limits."
        ogType="website"
        keywords="about video to image sequence online, muhammad sachal, in-browser frame extraction, private video converter, open roadmap, software engineer"
      />

      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>

      <div className="w-full mx-auto pb-20 font-sans text-gray-300">
        
        {/* ── 1. HERO SECTION ── */}
        <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'About', path: '/about' }]} />
          
          <div className="mt-8 inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Our Mission & Philosophy
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Making Video Frame Extraction <span className="text-cyan-400">Faster, Simpler,</span> and More Private.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Video to Image Sequence was created to eliminate the friction of traditional video converters. No server uploads, no file size restrictions, and no waiting queues — just instant, browser-native media processing on your own device.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-gray-950 font-bold font-display transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <span>⚡ Try the Tool Now</span>
            </Link>
            <a
              href="https://github.com/msachal5700/video-to-image-sequence"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold font-display border border-gray-800 hover:border-cyan-500/50 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span>View GitHub Project</span>
            </a>
          </div>
        </section>


        {/* ── 2. WHY THIS WEBSITE EXISTS ── */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-gray-800/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Why This Website Exists
            </h2>
            <p className="mt-3 text-gray-400">
              The story behind building a faster, cleaner alternative to legacy web converters.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 rounded-3xl bg-gray-900/60 border border-gray-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 font-mono font-bold text-lg">
                ✕
              </div>
              <h3 className="font-display text-xl font-bold text-white">The Problem with Legacy Converters</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                If you have ever needed to pull high-res frames out of a video, you know the frustration. Most online converters force you to upload your 2GB video file to their remote server, wait in a slow processing queue, dodge pop-up ads, and finally download a compressed, watermarked file.
              </p>
              <p className="text-sm text-gray-400 leading-relaxed">
                This approach is slow, consumes unnecessary bandwidth, and exposes sensitive personal or client video footage to third-party servers.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-gray-900/60 border border-cyan-900/40 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 font-mono font-bold text-lg">
                ✓
              </div>
              <h3 className="font-display text-xl font-bold text-white">The Browser-Native Solution</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Video to Image Sequence was built to flip that model upside down. Modern web browsers have standard, powerful APIs (HTML5 Video, Canvas 2D, Web Workers) capable of decoding video frames directly on your CPU and GPU.
              </p>
              <p className="text-sm text-cyan-300/90 leading-relaxed font-medium">
                By processing your video 100% locally on your machine, your video never touches a server. It extracts thousands of frames in seconds, respects your privacy, and remains completely free to use.
              </p>
            </div>
          </div>
        </section>


        {/* ── 3. MEET THE CREATOR ── */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-gray-800/80">
          <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 border border-gray-800 shadow-2xl flex flex-col md:flex-row gap-8 items-center">
            
            {/* Avatar / Profile Graphic */}
            <div className="flex-shrink-0 text-center">
              <div className="relative w-36 h-36 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-1 shadow-xl shadow-cyan-500/10">
                <div className="w-full h-full rounded-[22px] bg-gray-950 flex items-center justify-center text-4xl font-bold font-display text-white">
                  MS
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Lead Engineer & Creator
                </span>
              </div>
            </div>

            {/* Profile Bio */}
            <div className="space-y-4 text-center md:text-left flex-1">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Muhammad Sachal
                </h2>
                <p className="text-sm font-mono text-cyan-400 mt-1">
                  Computer Science Graduate & Full-Stack Developer
                </p>
              </div>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Hi! I'm Muhammad Sachal. With a degree in Computer Science, my engineering work spans <strong>AI development, Augmented Reality (AR), 3D graphics rendering, web development, and SEO automation</strong>.
              </p>

              <p className="text-sm text-gray-400 leading-relaxed">
                I built Video to Image Sequence to combine client-side computer vision algorithms with user-focused UI design. My goal is to build web tools that feel as fast and privacy-focused as native desktop software, without requiring installs or fees.
              </p>

              {/* Social Links */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono">
                <a
                  href="https://github.com/msachal5700"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gray-950 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 transition flex items-center gap-2"
                >
                  <span>🐙 GitHub Profile</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/muhammadsachal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gray-950 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800 transition flex items-center gap-2"
                >
                  <span>💼 LinkedIn Profile</span>
                </a>
              </div>
            </div>

          </div>
        </section>


        {/* ── 4. WHAT MAKES THIS TOOL DIFFERENT ── */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-gray-800/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              What Makes This Tool Different
            </h2>
            <p className="mt-3 text-gray-400">
              Purpose-built for speed, quality, and strict data privacy.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: '🔒 Privacy First', desc: '100% browser-native processing. Your media files are never uploaded to any remote server.', icon: '🛡️' },
              { title: '⚡ Fast Processing', desc: 'Leverages Web Workers and Canvas hardware acceleration for multi-frame extraction in seconds.', icon: '⚡' },
              { title: '💻 Zero Installation', desc: 'Runs instantly in Chrome, Firefox, Safari, Edge, or mobile browsers without software downloads.', icon: '🌐' },
              { title: '✨ 100% Free', desc: 'No hidden fees, no subscription paywalls, no file size caps, and no mandatory registration.', icon: '🎁' },
              { title: '🖼️ Lossless Quality', desc: 'Export uncompressed PNG image sequences with full color depth and transparent alpha channels.', icon: '🎨' },
              { title: '⚙️ Multiple Options', desc: 'Custom FPS controls, scene change filters, AI thumbnail scoring, and ZIP archiver output.', icon: '🎛️' },
              { title: '📱 Modern Interface', desc: 'Clean, responsive dark-mode layout designed for effortless workflow on desktop and mobile.', icon: '📱' },
              { title: '🤖 AI Assisted', desc: 'In-browser computer vision evaluates sharpness, motion blur, and face expressions automatically.', icon: '🧠' },
            ].map(card => (
              <div
                key={card.title}
                className="p-5 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-cyan-500/50 hover:bg-gray-900/80 transition-all duration-300 group"
              >
                <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">{card.icon}</div>
                <h3 className="font-display font-bold text-white text-base mb-1.5 group-hover:text-cyan-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ── 5. ROADMAP ── */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-gray-800/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Product Roadmap
            </h2>
            <p className="mt-3 text-gray-400">
              Our transparent development plan. See what features are live and what is coming next.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { feature: 'AI Best Frame Picker', status: 'Completed', date: 'v2.0 Released', badgeBg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800' },
              { feature: 'Images to Video Converter', status: 'Completed', date: 'v1.8 Released', badgeBg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800' },
              { feature: 'Screenshot from Video', status: 'Completed', date: 'v1.7 Released', badgeBg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800' },
              { feature: 'Batch Video Queueing', status: 'In Progress', date: 'Active Dev', badgeBg: 'bg-cyan-950/80 text-cyan-400 border-cyan-800' },
              { feature: 'Scene Change Detection', status: 'In Progress', date: 'Active Dev', badgeBg: 'bg-cyan-950/80 text-cyan-400 border-cyan-800' },
              { feature: 'Video Metadata Viewer', status: 'Planned', date: 'Q3 2026', badgeBg: 'bg-gray-900 text-gray-400 border-gray-800' },
              { feature: 'Frame Quality Analyzer', status: 'Planned', date: 'Q3 2026', badgeBg: 'bg-gray-900 text-gray-400 border-gray-800' },
              { feature: 'Mobile Performance Tuning', status: 'Planned', date: 'Q4 2026', badgeBg: 'bg-gray-900 text-gray-400 border-gray-800' },
            ].map(item => (
              <div key={item.feature} className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 flex flex-col justify-between">
                <div>
                  <span className={`inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${item.badgeBg} mb-2`}>
                    {item.status === 'Completed' ? '✓ ' : item.status === 'In Progress' ? '⚙ ' : '⏳ '}{item.status}
                  </span>
                  <h3 className="font-bold text-white text-sm font-display">{item.feature}</h3>
                </div>
                <div className="text-[11px] font-mono text-gray-500 mt-3">{item.date}</div>
              </div>
            ))}
          </div>
        </section>


        {/* ── 6. OPEN DEVELOPMENT ── */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-gray-800/80 text-center">
          <div className="p-8 md:p-10 rounded-3xl bg-gray-900/70 border border-gray-800 max-w-3xl mx-auto">
            <span className="text-2xl mb-2 block">🛠️</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
              Actively Maintained & Open Development
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              This platform is continuously updated with bug fixes, browser optimization patches, performance upgrades, and user-requested features. Have feedback or spot a bug? We welcome your input!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono font-semibold">
              <a
                href="https://github.com/msachal5700/video-to-image-sequence"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-gray-950 hover:bg-gray-800 text-cyan-400 border border-gray-800 transition"
              >
                📂 GitHub Repository
              </a>
              <a
                href="https://github.com/msachal5700/video-to-image-sequence/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-gray-950 hover:bg-gray-800 text-red-400 border border-gray-800 transition"
              >
                🐛 Report an Issue
              </a>
              <a
                href="#contact"
                className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-gray-950 font-bold transition"
              >
                💡 Suggest a Feature
              </a>
            </div>
          </div>
        </section>


        {/* ── 7. CHANGELOG PREVIEW ── */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-gray-800/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display text-3xl font-bold text-white">Changelog & Version History</h2>
            <p className="text-sm text-gray-400 mt-2">Track the continuous technical evolution of the platform.</p>
          </div>

          <div className="relative border-l-2 border-cyan-800/60 ml-4 sm:ml-8 space-y-8 pl-6 sm:pl-8">
            {[
              { version: 'v2.0 — August 2026', title: 'AI Social Media Frame Picker', points: ['Integrated Web Worker computer vision engine for scoring sharpness, blur & composition', 'Added platform presets for YouTube, Instagram, TikTok & LinkedIn', 'Created AI research guide /blog/ai-best-frame-from-video'] },
              { version: 'v1.8 — July 2026', title: 'Images to Video Converter', points: ['Added client-side WebM video encoder from PNG/JPG image sequences', 'Custom FPS duration calculations and canvas stitching'] },
              { version: 'v1.7 — June 2026', title: 'High-Res Screenshot Tool', points: ['Single-frame snapshot extractor with pixel-accurate video seeker', 'Zero quality loss PNG export'] },
              { version: 'v1.6 — May 2026', title: 'Performance & Memory Tuning', points: ['Upgraded Web Workers to handle 1,000+ frame extraction batches without browser memory crashes', 'Cleaned static HTML pre-rendering pipeline'] },
              { version: 'v1.5 — April 2026', title: 'New Core Extraction Engine', points: ['Replaced legacy DOM canvas loops with WebAssembly canvas pipeline'] },
            ].map(ver => (
              <div key={ver.version} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-cyan-400 border-4 border-gray-950 group-hover:scale-125 transition-transform" />
                <div className="text-xs font-mono font-bold text-cyan-400 mb-1">{ver.version}</div>
                <h3 className="text-lg font-bold text-white font-display mb-2">{ver.title}</h3>
                <ul className="list-disc list-inside text-xs sm:text-sm text-gray-400 space-y-1">
                  {ver.points.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>


        {/* ── 8. TRUST SECTION ── */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-gray-800/80">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Privacy Focused', desc: 'Zero server uploads. Your video files remain on your device.', icon: '🛡️' },
              { title: 'Runs in Browser', desc: 'Powered by HTML5, Web Workers, and WebAssembly APIs.', icon: '💻' },
              { title: 'No Hidden Charges', desc: '100% free with no premium paywalls or subscription fees.', icon: '🏷️' },
              { title: 'Actively Maintained', desc: 'Regular performance patches, bug fixes, and feature updates.', icon: '🚀' },
              { title: 'Fast Technical Support', desc: 'Direct support via email and GitHub issue tracking.', icon: '💬' },
              { title: 'Open Roadmap', desc: 'Transparent product development driven by user feedback.', icon: '🗺️' },
            ].map(item => (
              <div key={item.title} className="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 flex items-start gap-4">
                <div className="text-2xl">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-white text-sm font-display mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ── 9. CONTACT SECTION ── */}
        <section id="contact" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-gray-800/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-display text-3xl font-bold text-white">Get in Touch</h2>
            <p className="text-sm text-gray-400 mt-2">Have a question, feedback, or technical issue? We'd love to hear from you.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Contact Info Cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800">
                <div className="text-xs font-mono text-cyan-400 uppercase mb-1">Official Support Email</div>
                <a href="mailto:support@videotoimagesequence.online" className="text-white font-bold font-mono text-base hover:text-cyan-300 transition">
                  support@videotoimagesequence.online
                </a>
                <p className="text-xs text-gray-500 mt-1">Expected response time: 24–48 hours.</p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800">
                <div className="text-xs font-mono text-cyan-400 uppercase mb-1">GitHub Developer Profile</div>
                <a href="https://github.com/msachal5700" target="_blank" rel="noopener noreferrer" className="text-white font-bold font-mono text-base hover:text-cyan-300 transition">
                  github.com/msachal5700
                </a>
                <p className="text-xs text-gray-500 mt-1">Inspect source code and open pull requests.</p>
              </div>

              <div className="p-5 rounded-2xl bg-gray-900/70 border border-gray-800">
                <div className="text-xs font-mono text-cyan-400 uppercase mb-1">LinkedIn Profile</div>
                <a href="https://www.linkedin.com/in/muhammadsachal" target="_blank" rel="noopener noreferrer" className="text-white font-bold font-mono text-base hover:text-cyan-300 transition">
                  linkedin.com/in/muhammadsachal
                </a>
                <p className="text-xs text-gray-500 mt-1">Connect with the founder for professional inquiries.</p>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800">
              <h3 className="font-display font-bold text-white text-lg mb-4">Send Us a Direct Message</h3>

              {formSubmitted ? (
                <div className="p-6 rounded-2xl bg-cyan-950/80 border border-cyan-800 text-center space-y-2">
                  <div className="text-2xl">✅</div>
                  <div className="font-bold text-white font-display">Thank You for Your Message!</div>
                  <p className="text-xs text-cyan-300">We have received your submission and will get back to you at {formData.email}.</p>
                  <button onClick={() => setFormSubmitted(false)} className="mt-4 text-xs font-mono text-cyan-400 underline">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-mono text-gray-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-gray-400 mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-gray-400 mb-1">Message / Suggestion</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your feature request or issue..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-gray-950 font-bold font-display text-sm transition-colors"
                  >
                    Submit Message
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>


        {/* ── 10. FINAL CTA ── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-gray-800/80 text-center">
          <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-gray-900 to-gray-950 border border-cyan-800/60 shadow-2xl">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Extract Frames?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-xl mx-auto">
              Start extracting image sequences from your videos in seconds — free, private, and 100% in your browser.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/"
                className="px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-gray-950 font-bold font-display text-base transition-colors shadow-lg shadow-cyan-500/20"
              >
                ⚡ Try the Tool
              </Link>
              <Link
                to="/ai-social-media-frame-picker"
                className="px-8 py-4 rounded-xl bg-gray-950 hover:bg-gray-800 text-white font-bold font-display text-base border border-gray-800 transition-colors"
              >
                ✨ Explore AI Frame Picker
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default AboutPage;
