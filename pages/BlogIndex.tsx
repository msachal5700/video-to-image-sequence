import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';

const posts = [
  {
    slug: 'extract-frames-from-video-online',
    title: 'How to Extract Frames from Video Online (Free, No Install)',
    date: 'April 2026',
    description: 'A complete guide to extracting frames from MP4, MOV, and WEBM videos directly in your browser — no software needed.',
  },
  {
    slug: 'mp4-to-image-sequence-guide',
    title: 'MP4 to Image Sequence: Complete Beginner Guide',
    date: 'April 2026',
    description: 'Everything you need to know about converting MP4 videos into a sequence of JPG or PNG images for editing, animation, and VFX.',
  },
  {
    slug: 'video-to-png-frames-guide',
    title: 'How to Convert Video to PNG Frames Online — Complete 2026 Guide',
    date: 'April 27, 2026',
    description: 'Learn exactly how to extract lossless PNG frames from MP4, MOV, and WEBM videos locally in your browser. Private browser processing. Large files depend on your device and browser.',
  },
  {
    slug: 'ai-best-frame-from-video',
    title: 'How AI Picks the Best Frame From a Video (And Why It Beats Scrubbing)',
    date: 'August 4, 2026',
    description: 'A technical look at how computer vision scores frames on sharpness, motion blur, exposure, composition and face detection to find the best thumbnail for YouTube, Instagram, TikTok and LinkedIn.',
  },
  {
    slug: 'how-to-convert-images-to-video-guide',
    title: 'How to Convert Image Sequences into Video Online (Technical Guide)',
    date: 'August 1, 2026',
    description: 'Learn how to stitch PNG and JPG image sequences into WebM and MP4 videos using browser-based canvas encoding.',
  },
  {
    slug: 'ezgif-alternative-video-to-image-sequence',
    title: 'Why VideoToImageSequence is the Best Private Ezgif Alternative (2026)',
    date: 'August 14, 2026',
    description: 'A detailed benchmark comparing Ezgif vs VideoToImageSequence for video frame extraction. No 100MB file limits, zero server uploads, and 100% browser-native privacy.',
  },
  {
    slug: 'video-frame-extractor-use-cases',
    title: '7 Real-World Use Cases for Video Frame Extraction',
    date: 'August 29, 2026',
    description: 'Sports analysis, AI/ML training datasets, e-commerce product photography, stop-motion animation, social media content, video QA, and game development — see how professionals use frame extraction every day.',
  },
  {
    slug: 'best-fps-settings-for-video-frame-extraction',
    title: 'Best FPS Settings for Video Frame Extraction (Complete Guide)',
    date: 'August 29, 2026',
    description: 'A complete guide to choosing the right FPS when extracting video frames. Covers 1, 5, 10, 24, and 30 FPS with use cases, file size estimates, and format recommendations.',
  },
];


const BlogIndex: React.FC = () => {
  useEffect(() => {
    const existing = document.getElementById('blog-index-schemas');
    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'blog-index-schemas';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Video to Image Sequence Online Blog Posts",
      // Derived from `posts` so the schema can never drift out of sync with the
      // rendered list — the previous hardcoded copy had to be edited twice.
      "numberOfItems": posts.length,
      "itemListElement": posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": post.title,
        "url": `https://www.videotoimagesequence.online/blog/${post.slug}`
      }))
    });

    document.head.appendChild(script);
    return () => {
      const el = document.getElementById('blog-index-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <main className="max-w-4xl mx-auto py-16 px-6 font-sans">
      <SEOHead
        title="Video Editing Guides & Tutorials | Video to Image Sequence Blog"
        description="Free guides on extracting video frames, converting MP4 to image sequences, and exporting PNG frames. Tips for animators, developers, and creators."
        canonical="https://www.videotoimagesequence.online/blog"
        ogTitle="Video Editing Guides — Video to Image Sequence Blog"
        ogDescription="Tutorials and tips for frame extraction, image sequences, batch processing, and more."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords="video editing guides, frame extraction tutorials, image sequence guides, video to images guides, video processing blog"
      />
      <Breadcrumb items={[{ label: 'Blog', path: '/blog' }]} />
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white font-display">Video Editing <span className="text-cyan-400">Guides</span></h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Tutorials, tips, and free tools to help you extract frames, create image sequences, and optimize your media workflow.</p>
      </div>

      <div className="grid gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="group bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 hover:border-cyan-500/50 transition-colors shadow-xl">
            <p className="text-xs font-bold text-cyan-400 mb-3 tracking-wider uppercase font-mono">{post.date}</p>
            <h2 className="text-2xl font-bold mb-3 font-display">
              <Link to={`/blog/${post.slug}`} className="text-white group-hover:text-cyan-400 transition-colors">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">{post.description}</p>
            <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
              Read Article <span className="text-xl leading-none">→</span>
            </Link>
          </article>
        ))}
      </div>

      {/* Adsterra Ad — Blog Index */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <GoogleAdUnit />
      </div>
    </main>
  );
};

export default BlogIndex;
