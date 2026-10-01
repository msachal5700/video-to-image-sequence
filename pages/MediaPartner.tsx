import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';

const CANONICAL = 'https://www.videotoimagesequence.online/media-partner';

const PARTNER_TYPES = [
  {
    title: 'Tool directories & listings',
    body: 'We welcome listings on software directories, alternative-to sites, and curated tool collections. Link to the tool page that fits your category and we will link back from this page.',
  },
  {
    title: 'Bloggers & tutorial creators',
    body: 'Writing a video-editing tutorial or a frame-extraction guide? Use our free tool in your workflow and cite it — we feature standout tutorials here and share them with our readers.',
  },
  {
    title: 'Educators & open-source projects',
    body: 'Teachers, course creators, and open-source maintainers who recommend the tool to students or users get a permanent partner listing, free, no reciprocation required for .edu and non-profit sites.',
  },
  {
    title: 'Integration partners',
    body: 'Building a video pipeline, dataset tool, or creative app? Talk to us about deep links, embed-friendly URLs, and co-marketing around frame extraction workflows.',
  },
];

const MediaPartner: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const existing = document.getElementById('media-partner-schemas');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'media-partner-schemas';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Media Partners — videotoimagesequence.online',
      url: CANONICAL,
      description: 'Partner with videotoimagesequence.online: tool directories, tutorial creators, educators, and integrations.',
    });
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById('media-partner-schemas');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="Media Partners — Video to Image Sequence"
        description="Partner with Video to Image Sequence: tool directories, bloggers, educators, and open-source projects. Get listed as a media partner with a backlink."
        canonical={CANONICAL}
        ogTitle="Media Partners — Video to Image Sequence"
        ogDescription="Partner with Video to Image Sequence: directories, bloggers, educators, and open-source projects."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords="media partner, partnership, video to image sequence partners, tool directory listing"
      />

      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb
          items={[
            { label: 'Media Partners', path: '/media-partner' },
          ]}
        />

        <h1 className="text-3xl md:text-4xl font-bold text-white font-display mt-6 mb-4">
          Media Partners
        </h1>
        <p className="text-gray-400 leading-relaxed mb-4">
          Video to Image Sequence is a free, privacy-first video frame extractor used by
          creators, educators, and developers. We grow through genuine partnerships with
          people who share our vision of making video processing accessible to everyone —
          no accounts, no uploads, no watermarks.
        </p>
        <p className="text-gray-400 leading-relaxed mb-10">
          Partners are listed publicly on this page with a followed link back to their
          site. If you feature our tool, tell us — we will add you here.
        </p>

        <h2 className="text-2xl font-bold text-white font-display mb-6">
          Who we partner with
        </h2>
        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {PARTNER_TYPES.map((p) => (
            <div
              key={p.title}
              className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">{p.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white font-display mb-6">
          Our partners
        </h2>
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 mb-12 text-center">
          <p className="text-gray-400 leading-relaxed mb-2">
            We are onboarding our first partners now.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Featured our tool or listed us in your directory?{' '}
            <Link to="/contact" className="text-cyan-400 hover:text-cyan-300 underline">
              Contact us
            </Link>{' '}
            with your URL and we will add your listing here.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white font-display mb-4">
          How to become a partner
        </h2>
        <ol className="list-decimal list-inside text-gray-400 leading-relaxed space-y-2 mb-10">
          <li>Feature or link to Video to Image Sequence from your site, article, or project.</li>
          <li>
            <Link to="/contact" className="text-cyan-400 hover:text-cyan-300 underline">
              Send us
            </Link>{' '}
            the URL where we are featured, plus your site name and a one-line description.
          </li>
          <li>We review within a few days and publish your listing on this page.</li>
        </ol>

        <p className="text-gray-500 text-sm leading-relaxed">
          We only list real, relevant partners — no link farms, no paid placements, no
          automated submissions. Partnerships are free in both directions.
        </p>
      </div>
    </div>
  );
};

export default MediaPartner;
