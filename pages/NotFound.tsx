import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const NotFound: React.FC = () => {
  return (
    <div className="w-full mx-auto pb-16 font-sans flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <SEOHead
        title="404 — Page Not Found | Video to Image Sequence"
        description="This page does not exist. Go back to the homepage to extract frames from your video for free."
        canonical="https://www.videotoimagesequence.online/404"
        noindex={true}
      />
      <h1 className="text-8xl md:text-9xl font-black text-cyan-400 font-display mb-6">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-400 mb-10 max-w-lg">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          to="/" 
          className="px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
        >
          Go Back Home
        </Link>
        <Link 
          to="/blog" 
          className="px-8 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl border border-gray-700 transition-all shadow-md"
        >
          Browse Guides
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
