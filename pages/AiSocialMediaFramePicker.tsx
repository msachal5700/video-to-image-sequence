/**
 * Landing page for /ai-social-media-frame-picker.
 *
 * Structure follows the existing tool pages: SEOHead, breadcrumb, an injected
 * JSON-LD block, the tool, then long-form supporting content. Keeping the same
 * shape means the prerender script and the rest of the SEO tooling treat this
 * page exactly like the others.
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { FramePickerWorkspace } from '../components/framePicker/FramePickerWorkspace';
import { PLATFORM_PROFILES } from '../ai/platformProfiles';

const SITE = 'https://www.videotoimagesequence.online';
const CANONICAL = `${SITE}/ai-social-media-frame-picker`;

/** FAQ content. Single source for both the visible list and the FAQ schema. */
const FAQS: ReadonlyArray<{ question: string; answer: string }> = [
  {
    question: 'How does the AI choose the best frame from my video?',
    answer:
      'Every candidate frame is measured on sharpness, motion blur, brightness, contrast, exposure clipping, colour vibrancy, composition against a rule-of-thirds grid, and whether a face is present and well positioned. Those measurements are combined into a single 0-100 score, then weighted again for each platform, so a YouTube thumbnail and an Instagram story can win on different criteria. Nothing is chosen at random.',
  },
  {
    question: 'Is my video uploaded to a server?',
    answer:
      'No. Decoding, analysis and export all run inside your browser using the standard video and canvas APIs. Your file never leaves your device, which is why the tool works on unlisted footage and client work without a confidentiality problem.',
  },
  {
    question: 'What video formats and sizes are supported?',
    answer:
      'Any format your browser can play, which in practice covers MP4 (H.264), MOV and WEBM, up to 500MB. Very long videos are sampled more sparsely rather than rejected, so a feature-length file still returns results in reasonable time.',
  },
  {
    question: 'Why does it extract 80-150 frames instead of every frame?',
    answer:
      'A 30-second clip at 30fps contains 900 frames, and the overwhelming majority are near-identical to their neighbours. The tool detects scene changes and samples adaptively around them, then removes near-duplicates with a perceptual hash. You get the same best frame in a fraction of the time and memory.',
  },
  {
    question: 'What resolution are the downloaded images?',
    answer:
      'Downloads are re-decoded from the original video at full resolution, not taken from the preview thumbnails. You can export at the source resolution, at 1080p or 720p, or at each platform’s recommended dimensions, in PNG, JPEG or WEBP.',
  },
  {
    question: 'Does it work without face detection?',
    answer:
      'Yes. Face detection uses the browser’s native FaceDetector API where available. Where it is not, the tool falls back to skin-tone and region-of-interest heuristics and continues scoring on every other factor. The results panel tells you which mode was used.',
  },
  {
    question: 'Is the AI Social Media Frame Picker free?',
    answer:
      'Yes, it is free and needs no account. All processing happens locally, so there are no per-video costs to pass on.',
  },
];

const AiSocialMediaFramePicker = () => {
  useEffect(() => {
    // Schemas are injected imperatively, matching the pattern used by the other
    // tool pages so a single prerender pass picks them all up the same way.
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'ai-frame-picker-schemas';

    const softwareSchema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'AI Social Media Frame Picker',
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any (web browser)',
      url: CANONICAL,
      description:
        'Free AI tool that analyses a video in your browser, scores every keyframe on sharpness, lighting, composition and faces, and picks the best thumbnail for YouTube, Instagram, TikTok, LinkedIn, Pinterest, X and WhatsApp.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: [
        'AI frame scoring from 0 to 100',
        'Scene-change keyframe extraction',
        'Perceptual duplicate removal',
        'Face and eye detection',
        'Per-platform thumbnail recommendations',
        'PNG, JPEG and WEBP export',
        '100% in-browser processing',
      ],
      browserRequirements: 'Requires a modern browser with HTML5 video support',
    };

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'AI Social Media Frame Picker',
          item: CANONICAL,
        },
      ],
    };

    const howToSchema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to find the best thumbnail frame in a video with AI',
      totalTime: 'PT2M',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Upload your video',
          text: 'Drag a video file onto the upload area, or click Browse. Files stay on your device.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Let the AI analyse it',
          text: 'The tool detects scene changes, extracts keyframes and scores each one on sharpness, lighting, composition and faces.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Review the platform picks',
          text: 'Each card shows the winning frame for one platform with its score and the reasons it won.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Download',
          text: 'Download individual frames, the whole set, or just your favourites in PNG, JPEG or WEBP.',
        },
      ],
    };

    script.text = JSON.stringify([softwareSchema, faqSchema, breadcrumbSchema, howToSchema]);
    document.head.appendChild(script);

    return () => {
      // Remove on unmount so a client-side navigation does not leave stale
      // structured data describing a page the user is no longer on.
      document.getElementById('ai-frame-picker-schemas')?.remove();
    };
  }, []);

  return (
    <>
      <SEOHead
        title="AI Social Media Frame Picker — Find the Best Thumbnail Frame in Any Video"
        description="Free AI thumbnail generator. Upload a video and the AI scores every frame on sharpness, lighting, faces and composition, then picks the best image for YouTube, Instagram, TikTok, LinkedIn and more. Runs entirely in your browser."
        canonical={CANONICAL}
        keywords="ai thumbnail generator, best frame from video, extract best image from video, ai frame selector, choose best thumbnail, video to thumbnail ai, best screenshot from video, social media thumbnail generator"
        ogTitle="AI Social Media Frame Picker — Best Video Frame, Chosen by AI"
        ogDescription="Score every frame of your video on sharpness, lighting, faces and composition. Get the best thumbnail for every social platform, free and private."
        ogType="website"
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Home', path: '/' },
            { label: 'AI Social Media Frame Picker', path: '/ai-social-media-frame-picker' },
          ]}
        />

        <header className="mx-auto mt-6 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
            <span aria-hidden="true">✨</span> AI-powered frame scoring
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            AI Social Media Frame Picker
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Stop scrubbing the timeline looking for a usable thumbnail. Upload a video and the AI
            scores every keyframe on sharpness, lighting, composition and faces, then hands you the
            best image for each platform — free, private, and entirely in your browser.
          </p>
        </header>

        <div className="mt-10">
          <FramePickerWorkspace />
        </div>

        {/* Long-form supporting content */}
        <div className="mx-auto mt-20 max-w-4xl space-y-14 font-sans">
          
          {/* Feature Overview */}
          <section className="bg-gray-900/70 border border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 text-cyan-400 text-sm font-semibold tracking-wider uppercase font-mono mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Computer Vision & AI Mechanics
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-6">
              An AI Thumbnail Generator That Actually Looks at Your Footage
            </h2>
            
            <div className="space-y-5 text-gray-300 leading-relaxed text-base md:text-lg">
              <p>
                Most tools that promise to extract the best image from a video do something much
                simpler than they imply: they grab a frame at 10%, 50% and 90% of the duration and
                let you choose. If your subject blinked at the halfway mark, that is what you get.
              </p>
              
              <div className="my-6 p-5 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 border-l-4 border-l-cyan-400 text-cyan-100 text-base">
                <strong className="text-white block mb-1 font-display">How True In-Browser AI Frame Selection Works:</strong>
                The video is decoded locally in your browser. Scene changes are detected by comparing colour
                histograms between samples, and keyframes are extracted around those boundaries.
                Every candidate then goes through a computer-vision scoring pass that measures
                sharpness with a Laplacian variance kernel, estimates motion blur from directional
                gradients, checks exposure clipping, measures contrast and colour vibrancy, and evaluates
                composition against a rule-of-thirds grid.
              </div>

              <p>
                The output is a single quality score from <span className="text-cyan-400 font-bold font-mono">0 to 100</span>, plus the specific reasons behind it. A
                frame scoring 96 will tell you why: <span className="text-white font-medium">excellent sharpness, good lighting, centred
                subject, no motion blur, human face detected</span>. When a frame scores badly, you also
                see why — making thumbnail selection fast and effortless.
              </p>
            </div>
          </section>

          {/* Per-Platform Grid */}
          <section>
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                One Video, a Best Frame for <span className="text-cyan-400">Every Platform</span>
              </h2>
              <p className="mt-2 text-gray-400 text-base">
                Different social platforms demand different aspect ratios and visual priorities. Our AI re-weights scoring metrics for each destination:
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PLATFORM_PROFILES.map(profile => (
                <div
                  key={profile.id}
                  className="flex flex-col justify-between rounded-2xl bg-gray-900/80 border border-gray-800 p-5 hover:border-cyan-500/50 transition-all hover:-translate-y-1 shadow-lg group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl p-2 rounded-xl bg-gray-800/80 group-hover:scale-110 transition-transform">
                        {profile.icon}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                        {profile.aspectLabel}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white font-display group-hover:text-cyan-400 transition-colors">
                      {profile.label}
                    </h3>
                    <p className="mt-1 text-xs font-mono text-gray-500">
                      Recommended: {profile.recommendedWidth}×{profile.recommendedHeight}px
                    </p>
                    <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                      {profile.blurb}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Why Creators Need This */}
          <section className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-4">
              Why Creators Need a Better Way to Choose a Thumbnail
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bg-gray-950/60 border border-gray-800/80 rounded-2xl p-5">
                <div className="text-cyan-400 text-xl font-bold mb-2">01. Eliminate Scrubber Bias</div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Timeline scrubbers are too small (120px) to spot motion blur or soft focus that destroys full-size 1080p thumbnails.
                </p>
              </div>
              <div className="bg-gray-950/60 border border-gray-800/80 rounded-2xl p-5">
                <div className="text-cyan-400 text-xl font-bold mb-2">02. Exposure Guard</div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Highlight clipping destroys pixel data permanently. The AI penalises blown-out frames so you never publish ruined highlights.
                </p>
              </div>
              <div className="bg-gray-950/60 border border-gray-800/80 rounded-2xl p-5">
                <div className="text-cyan-400 text-xl font-bold mb-2">03. Eye & Face Lock</div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Open eyes and centered expressions measurably boost click-through rates. The scoring engine automatically prioritises non-blinking faces.
                </p>
              </div>
            </div>
          </section>

          {/* How Scoring Engine Works Grid */}
          <section>
            <div className="mb-8 text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                How the <span className="text-cyan-400">Scoring Engine</span> Works
              </h2>
              <p className="mt-2 text-gray-400 text-base">
                Scoring runs in a background Web Worker off the main thread. Here are the 8 key factors evaluated per candidate frame:
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Sharpness & Clarity', metric: 'Laplacian Variance', desc: 'Measures edge density across the luminance channel. Disqualifies soft or out-of-focus frames.', icon: '🔍' },
                { title: 'Motion Blur Filter', metric: 'Directional Gradients', desc: 'Separates intentional cinematic depth-of-field from smeared subject movement.', icon: '⚡' },
                { title: 'Exposure & Contrast', metric: 'Histogram Spread', desc: 'Evaluates dynamic range while imposing strict penalties on crushed shadows and clipped highlights.', icon: '☀️' },
                { title: 'Color Vibrancy', metric: 'Mean Saturation', desc: 'Rewards balanced, rich saturation while avoiding flat desaturated or garish oversaturated frames.', icon: '🎨' },
                { title: 'Composition Grid', metric: 'Rule-of-Thirds', desc: 'Scores visual weight and subject alignment against classic 3x3 grid intersections.', icon: '📐' },
                { title: 'Faces & Open Eyes', metric: 'Computer Vision', desc: 'Detects face position, size, and eye visibility to maximize viewer engagement.', icon: '👁️' },
                { title: 'Black Frame Disqualification', metric: 'Luminance Threshold', desc: 'Excludes zero-value black frames from fade-ins and fade-outs outright.', icon: '🚫' },
                { title: 'Duplicate Filtering', metric: 'Perceptual Hashing', desc: 'Groups visually identical frames and keeps only the highest-scoring candidate.', icon: '👯' },
              ].map((factor) => (
                <div key={factor.title} className="flex gap-4 p-5 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition">
                  <span className="text-2xl p-2.5 rounded-xl bg-gray-800/60 h-fit">{factor.icon}</span>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base font-display">{factor.title}</h3>
                      <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">{factor.metric}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-400 leading-relaxed">{factor.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section className="bg-gray-900/70 border border-gray-800 rounded-3xl p-6 md:p-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-6">
              Frequently Asked <span className="text-cyan-400">Questions</span>
            </h2>
            <div className="grid gap-4">
              {FAQS.map(faq => (
                <div key={faq.question} className="rounded-2xl bg-gray-950/60 border border-gray-800/80 p-5">
                  <h3 className="font-bold text-white text-base font-display mb-2 flex items-center gap-2">
                    <span className="text-cyan-400 font-mono">Q.</span> {faq.question}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed pl-6">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Tools Navigation */}
          <section className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 p-6 md:p-8">
            <h2 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">🔗</span> Related Video Tools & Reading
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: 'Extract Every Frame', path: '/extract-frames-from-video', desc: 'Full image sequence extraction' },
                { label: 'MP4 to JPG Converter', path: '/mp4-to-jpg', desc: 'Quick MP4 frame extraction' },
                { label: 'Video to PNG Frames', path: '/video-to-png', desc: 'Lossless PNG image sequence' },
                { label: 'Screenshot from Video', path: '/screenshot-from-video', desc: 'Grab single high-res frame' },
                { label: 'AI Frame Picker Guide', path: '/blog/ai-best-frame-from-video', desc: 'Read the technical guide' },
                { label: 'Images to Video', path: '/images-to-video', desc: 'Stitch frames back into WebM' },
              ].map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group block p-4 rounded-xl bg-gray-950/80 border border-gray-800 hover:border-cyan-500/50 hover:bg-gray-900 transition-all"
                >
                  <div className="font-semibold text-white text-sm group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                    {item.label}
                    <span className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default AiSocialMediaFramePicker;
