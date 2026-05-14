import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800 font-display">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* BRAND NAME — must say "Video to Image Sequence Online" */}
        <Link to="/" className="flex items-center gap-2 font-bold text-white text-lg group">
          <span className="text-cyan-400 group-hover:scale-110 transition-transform">▶</span>
          <span>Video to Image Sequence <span className="text-cyan-400">Online</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400 font-sans">
          <Link to="/" className="hover:text-white transition">Tool</Link>
          <Link to="/images-to-video" className="hover:text-white transition">Images to Video</Link>
          <Link to="/blog" className="hover:text-white transition">Blog</Link>
          <Link to="/#how-it-works" className="hover:text-white transition">How it Works</Link>
          <Link to="/#faq" className="hover:text-white transition">FAQ</Link>
        </nav>

        {/* Mobile menu */}
        <button className="md:hidden text-gray-400" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        {open && (
          <div className="absolute top-16 left-0 w-full bg-gray-950 border-b border-gray-800 p-4 flex flex-col gap-4 text-sm text-gray-300 md:hidden font-sans">
            <Link to="/" onClick={() => setOpen(false)}>Tool</Link>
            <Link to="/images-to-video" onClick={() => setOpen(false)}>Images to Video</Link>
            <Link to="/blog" onClick={() => setOpen(false)}>Blog</Link>
            <Link to="/#faq" onClick={() => setOpen(false)}>FAQ</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default memo(Header);