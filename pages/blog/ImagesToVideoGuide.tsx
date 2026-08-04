import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';
import Breadcrumb from '../../components/Breadcrumb';

const PUBLISHED = '2025-01-20';
const CANONICAL = 'https://www.videotoimagesequence.online/blog/how-to-convert-images-to-video-guide';

const ImagesToVideoGuide: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What image formats can be stitched into video?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PNG and JPG image sequences are fully supported. PNG is recommended for graphics and animation due to zero compression artifacts.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does frame rate affect video playback length?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Video duration equals total image frames divided by FPS. For example, 120 images rendered at 30 FPS result in a 4-second video.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does image sequence to video conversion run on a server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. All canvas rendering and video encoding happen locally inside your web browser using HTML5 Canvas and MediaRecorder APIs.',
        },
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How to Convert Image Sequences into Video (Complete Technical Guide)',
    description: 'Learn how to stitch PNG and JPG image sequences into WebM and MP4 videos using browser-based canvas encoding.',
    url: CANONICAL,
    datePublished: PUBLISHED,
    author: {
      '@type': 'Organization',
      name: 'Video to Image Sequence Engineering',
    },
  };

  return (
    <>
      <SEOHead
        title="How to Convert Images into Video (Step-by-Step Guide) | Video to Image Sequence"
        description="Learn how to turn PNG and JPG image sequences back into video files online. Understand FPS frame rates, canvas stitching, and browser encoding."
        canonical={CANONICAL}
        keywords="images to video guide, turn pictures into video, image sequence to mp4, image sequence to webm, stitch png to video"
        ogTitle="How to Convert Images into Video (Step-by-Step Guide)"
        ogDescription="Complete guide to converting image sequences into video files locally in your browser."
        ogType="article"
        articleDate={PUBLISHED}
      />

      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>

      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
        <Breadcrumb
          items={[
            { label: 'Home', path: '/' },
            { label: 'Blog', path: '/blog' },
            { label: 'How to Convert Images to Video', path: '/blog/how-to-convert-images-to-video-guide' },
          ]}
        />

        <header className="mt-8 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 uppercase tracking-wider">
              Technical Guide
            </span>
            <span className="text-gray-500 text-xs">•</span>
            <span className="text-xs font-mono text-gray-400">7 min read</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
            How to Convert Image Sequences into Video <span className="text-cyan-400">Online</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300 leading-relaxed">
            Stitching individual PNG or JPG frames back into a smooth video file is a core requirement for 3D animation, stop-motion, time-lapse, and visual effects rendering. Here is how browser-based encoding works.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400 border-b border-gray-800 pb-8">
            <span>Published <time dateTime={PUBLISHED}>20 January 2025</time></span>
            <span>•</span>
            <span>By <strong className="text-white font-medium">Video to Image Sequence Engineering</strong></span>
          </div>
        </header>

        <div className="mt-10 space-y-12 text-gray-300 leading-relaxed text-base md:text-lg">
          <section className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white border-b border-gray-800 pb-2">
              Understanding Image Sequence to Video Assembly
            </h2>
            <p>
              When 3D rendering engines like Blender, Cinema4D, or Unreal Engine produce animations, they typically output individual image files (e.g., <code>frame_0001.png</code>, <code>frame_0002.png</code>) rather than a single video file. This prevents corrupted video files if a render crashes mid-sequence.
            </p>
            <p>
              To convert those individual images into a playable video file, an encoder reads each image frame by frame, draws it onto an off-screen canvas at a specified Frame Rate (FPS), and compresses the visual stream into a WebM or MP4 container.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white border-b border-gray-800 pb-2">
              Calculating Video Duration from Image Frame Count
            </h2>
            <p>
              The playback speed of your generated video depends on your selected Frame Rate (FPS):
            </p>
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 font-mono text-sm space-y-3">
              <div className="text-cyan-400 font-bold uppercase">Duration Formula</div>
              <div className="text-white text-base">Duration (Seconds) = Total Frames / Frame Rate (FPS)</div>
              <div className="text-gray-400 text-xs">Example: 300 PNG images rendered at 30 FPS = 10.0 seconds of video playback.</div>
            </div>
          </section>

          <section className="my-10 p-8 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-gray-900 to-gray-950 border border-cyan-800/50 text-center">
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              Ready to Convert Images into Video?
            </h2>
            <p className="text-gray-300 text-sm mb-4">Use our free in-browser Images to Video converter. Drag and drop your image sequence and export WebM video files instantly.</p>
            <Link
              to="/images-to-video"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-gray-950 font-bold font-display transition-colors"
            >
              🎬 Open Images to Video Converter
            </Link>
          </section>
        </div>
      </article>
    </>
  );
};

export default ImagesToVideoGuide;
