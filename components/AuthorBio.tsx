import React from 'react';

/**
 * AuthorBio — reusable author byline box for blog posts.
 * Renders Muhammad Sachal's credentials to strengthen E-E-A-T signals.
 */
const AuthorBio: React.FC = () => {
  return (
    <section className="p-6 rounded-2xl bg-gray-950 border border-gray-800 flex flex-col sm:flex-row items-center gap-4 text-xs" aria-label="About the author">
      <img
        src="/muhammad-sachal.jpg"
        alt="Muhammad Sachal"
        className="w-14 h-14 rounded-full object-cover border border-cyan-500/40"
        loading="lazy"
      />
      <div>
        <div className="font-bold text-white font-display text-sm">About the Author</div>
        <p className="text-gray-400 mt-0.5">
          <strong>Muhammad Sachal (SachalSpeaks)</strong> is a Computer Science engineer specializing in
          client-side media pipelines, computer vision, and browser performance optimization. He builds
          free, privacy-first video tools at VideoToImageSequence.online — everything runs locally in
          your browser, nothing is uploaded.
        </p>
        <p className="mt-2">
          <a
            href="https://www.linkedin.com/in/sachalspeaks/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            LinkedIn
          </a>
          <span className="text-gray-600 mx-2">·</span>
          <a
            href="https://github.com/msachal5700"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            GitHub
          </a>
        </p>
      </div>
    </section>
  );
};

export default AuthorBio;
