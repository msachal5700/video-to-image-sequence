import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';

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
];

const BlogIndex: React.FC = () => {
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
    </main>
  );
};

export default BlogIndex;
