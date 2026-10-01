import React, { useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';

interface Entry {
  date: string;
  title: string;
  items: string[];
}

const entries: Entry[] = [
  {
    date: '2026-09-30',
    title: 'Site now available in 8 languages',
    items: [
      'The homepage and seven converter pages are now fully translated into Spanish, French, German, Portuguese, Chinese, Arabic (right-to-left), and Hindi.',
      'Added a Media Partner page for directories, tutorial creators, and educators who want to feature the tools.',
      'About page now states the site is run from Pakistan, with the author\'s name, photo, and contact links.',
    ],
  },
  {
    date: '2026-09-29',
    title: 'Two new in-depth guides',
    items: [
      'New guide: turning video into stop-motion animation frames.',
      'New guide: turning product videos into e-commerce product photos.',
      'Expanded the timestamp-extraction and images-to-video guides with more detail and FAQs.',
    ],
  },
  {
    date: '2026-09-22',
    title: 'New tool: Freeform Image Crop',
    items: [
      'Crop images in any shape — place points to draw a freeform polygon, drag nodes to adjust, rotate, zoom, undo/redo, and export the exact shape as transparent PNG/WebP or JPG.',
      'Companion guide post explaining freeform vs rectangular cropping.',
    ],
  },
  {
    date: '2026-09-12',
    title: 'WebP output + exact timestamp extractor',
    items: [
      'All converters can now export WebP in addition to JPG and PNG.',
      'New dedicated tool: extract a frame at an exact timestamp with millisecond precision, with a video player and frame-by-frame stepping.',
      'Homepage repositioned around frame extraction workflows (AI datasets, Blender/VFX, thumbnails).',
    ],
  },
  {
    date: '2026-08-04',
    title: 'New tool: AI Social Media Frame Picker',
    items: [
      'Upload a video and get the best frame for ten platform profiles (YouTube, Instagram, TikTok, LinkedIn, and more) — scored on sharpness, exposure, and composition, entirely in your browser.',
    ],
  },
  {
    date: '2026-08-03',
    title: 'Search and indexing improvements',
    items: [
      'Fixed duplicate and missing sitemap entries, retargeted the homepage title, and added new landing pages for GIF output and fixed-interval extraction (every N seconds).',
    ],
  },
];

const Changelog: React.FC = () => {
  useEffect(() => {
    const existing = document.getElementById('changelog-schemas');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'changelog-schemas';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Changelog — videotoimagesequence.online',
      url: 'https://www.videotoimagesequence.online/changelog',
      description: 'Release history of videotoimagesequence.online: new tools, new guides, and site improvements.',
    });
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById('changelog-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="Changelog — New Tools & Updates | videotoimagesequence.online"
        description="Release history of videotoimagesequence.online: new frame-extraction tools, format support, guides, and site improvements."
        canonical="https://www.videotoimagesequence.online/changelog"
        ogTitle="Changelog — videotoimagesequence.online"
        ogDescription="Every new tool, guide, and improvement we've shipped."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords="changelog, release notes, updates, video to image sequence"
      />

      <Breadcrumb items={[{ label: 'Changelog', path: '/changelog' }]} />

      <section className="text-center max-w-3xl mx-auto pt-10 pb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
          Changelog
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          Every new tool, guide, and improvement we ship — newest first.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4">
        <div className="space-y-6">
          {entries.map((entry) => (
            <article
              key={entry.date + entry.title}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-cyan-500/20 border border-cyan-500 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full">
                  {entry.date}
                </span>
                <h2 className="text-white font-bold text-lg">{entry.title}</h2>
              </div>
              <ul className="space-y-2">
                {entry.items.map((item, i) => (
                  <li key={i} className="text-gray-400 text-sm leading-relaxed flex gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Changelog;
