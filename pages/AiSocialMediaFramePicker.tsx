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

        {/* Long-form supporting content. Placed after the tool so the primary
            action is never below a wall of text. */}
        <div className="mx-auto mt-20 max-w-3xl space-y-12">
          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              An AI thumbnail generator that actually looks at your footage
            </h2>
            <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Most tools that promise to extract the best image from a video do something much
                simpler than they imply: they grab a frame at 10%, 50% and 90% of the duration and
                let you choose. If your subject blinked at the halfway mark, that is what you get.
              </p>
              <p>
                This works differently. It is a genuine <strong>AI frame selector</strong>. The
                video is decoded in your browser, scene changes are detected by comparing colour
                histograms between samples, and keyframes are extracted around those boundaries.
                Every candidate then goes through a computer-vision scoring pass that measures
                sharpness with a Laplacian variance kernel, estimates motion blur from directional
                gradients, checks brightness and exposure clipping, measures contrast and colour
                vibrancy, and evaluates composition against a rule-of-thirds grid. Faces are
                detected where the browser supports it, and frames where a face sits near a
                thirds intersection with open eyes score higher.
              </p>
              <p>
                The output is a single number from 0 to 100, plus the specific reasons behind it. A
                frame scoring 96 will tell you why: excellent sharpness, good lighting, centred
                subject, no motion blur, human face detected. When a frame scores badly, you also
                see why, which is often more useful.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              One video, a best frame for every platform
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              The frame that works as a YouTube thumbnail is rarely the frame that works as an
              Instagram story. Aspect ratios differ, and so does what performs. Each category
              re-weights the same underlying measurements for its own platform:
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {PLATFORM_PROFILES.map(profile => (
                <li
                  key={profile.id}
                  className="flex gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                >
                  <span aria-hidden="true" className="text-xl">
                    {profile.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {profile.label}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {profile.aspectLabel} · {profile.recommendedWidth}×
                      {profile.recommendedHeight}
                    </p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{profile.blurb}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Why creators need a better way to choose a thumbnail
            </h2>
            <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                A thumbnail is the single most leveraged image you publish. It is the entire basis on
                which someone decides whether to watch, and it competes against a dozen others in a
                grid. Choosing it by scrubbing a timeline and eyeballing candidates is slow, and it
                is biased: you remember which moments felt good to film, not which frames are
                technically strong.
              </p>
              <p>
                Sharpness is the clearest example. A frame can look acceptable at timeline size and
                fall apart at full resolution, because the subject was moving during a long exposure.
                Motion blur that is invisible in a 120px scrubber is obvious in a 1280×720 thumbnail.
                Measuring it is trivial for a computer and genuinely difficult by eye.
              </p>
              <p>
                The same applies to exposure. A frame with blown-out highlights loses detail
                permanently, and no amount of editing brings it back. The scoring engine penalises
                clipping directly, so those frames drop below better-exposed alternatives from the
                same scene.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              How the scoring engine works
            </h2>
            <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Scoring runs in a Web Worker, off the main thread, so the interface stays responsive
                while several hundred frames are processed. Each frame is analysed at a reduced
                working resolution — enough to measure quality accurately, small enough to keep
                memory flat regardless of whether the source is 720p or 4K.
              </p>
              <p>The factors and roughly how they contribute:</p>
              <ul className="ml-5 list-disc space-y-2">
                <li>
                  <strong>Sharpness and blur</strong> — Laplacian variance across the luminance
                  channel. The strongest single signal, and the one most likely to disqualify a frame.
                </li>
                <li>
                  <strong>Motion blur</strong> — directional gradient imbalance, which separates a
                  softly-focused frame from one smeared by movement.
                </li>
                <li>
                  <strong>Brightness, contrast and exposure</strong> — histogram mean and spread,
                  with explicit penalties for crushed shadows and clipped highlights.
                </li>
                <li>
                  <strong>Colour vibrancy</strong> — mean saturation with a penalty for oversaturation,
                  since both flat and garish frames underperform.
                </li>
                <li>
                  <strong>Composition</strong> — subject placement relative to rule-of-thirds
                  intersections, and edge-density distribution as a proxy for visual balance.
                </li>
                <li>
                  <strong>Faces and eyes</strong> — presence, size, position and eye visibility,
                  weighted heavily for platforms where faces measurably lift engagement.
                </li>
                <li>
                  <strong>Black and near-black frames</strong> — detected and excluded outright, which
                  removes the fade-in and fade-out frames that otherwise dominate naive extraction.
                </li>
                <li>
                  <strong>Duplicates</strong> — a perceptual hash groups visually similar frames and
                  keeps only the highest-scoring member of each group.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Frequently asked questions
            </h2>
            <dl className="mt-6 space-y-6">
              {FAQS.map(faq => (
                <div key={faq.question}>
                  <dt className="font-semibold text-gray-900 dark:text-white">{faq.question}</dt>
                  <dd className="mt-2 text-gray-600 dark:text-gray-300">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-gray-200 p-6 dark:border-gray-700">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
              Related tools and reading
            </h2>
            <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <li>
                <Link
                  to="/extract-frames-from-video"
                  className="text-cyan-700 hover:underline dark:text-cyan-400"
                >
                  Extract every frame from a video
                </Link>
              </li>
              <li>
                <Link to="/mp4-to-jpg" className="text-cyan-700 hover:underline dark:text-cyan-400">
                  Convert MP4 to JPG
                </Link>
              </li>
              <li>
                <Link
                  to="/video-to-png"
                  className="text-cyan-700 hover:underline dark:text-cyan-400"
                >
                  Convert video to PNG frames
                </Link>
              </li>
              <li>
                <Link
                  to="/screenshot-from-video"
                  className="text-cyan-700 hover:underline dark:text-cyan-400"
                >
                  Take a screenshot from a video
                </Link>
              </li>
              <li>
                <Link
                  to="/blog/ai-best-frame-from-video"
                  className="text-cyan-700 hover:underline dark:text-cyan-400"
                >
                  Guide: how AI picks the best frame from a video
                </Link>
              </li>
              <li>
                <Link
                  to="/images-to-video"
                  className="text-cyan-700 hover:underline dark:text-cyan-400"
                >
                  Turn images back into a video
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default AiSocialMediaFramePicker;
