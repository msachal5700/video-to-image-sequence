import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
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
          <div className="relative group">
            <button className="hover:text-white transition flex items-center gap-1 py-1 font-medium">
              Tools <span className="text-[10px] text-gray-600">▼</span>
            </button>
            <div className="absolute top-full left-0 mt-1 bg-gray-950 border border-gray-800 rounded-xl p-2 min-w-[240px] hidden group-hover:block shadow-2xl z-50 flex flex-col">
              <Link to="/" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">Video to Image Sequence</Link>
              <Link to="/mp4-to-jpg" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">MP4 to JPG Converter</Link>
              <Link to="/video-to-png" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">Video to PNG Converter</Link>
              <Link to="/screenshot-from-video" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">Screenshot from Video</Link>
              <Link to="/extract-frames-from-video" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">Extract Frames from Video</Link>
              <Link to="/images-to-video" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">Images to Video</Link>
            </div>
          </div>
          <Link to="/blog" className="hover:text-white transition font-medium">Blog</Link>
          <Link to="/#how-it-works" className="hover:text-white transition font-medium">How it Works</Link>
          <Link to="/#faq" className="hover:text-white transition font-medium">FAQ</Link>
        </nav>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-gray-800/50"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Mobile menu */}
        <button className="md:hidden text-gray-400 ml-2" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        {open && (
          <div className="absolute top-16 left-0 w-full bg-gray-950 border-b border-gray-800 p-4 flex flex-col gap-3.5 text-sm text-gray-300 md:hidden font-sans max-h-[80vh] overflow-y-auto">
            <span className="text-xs text-gray-600 uppercase font-semibold tracking-wider">Converter Tools</span>
            <Link to="/" onClick={() => setOpen(false)} className="pl-2 font-medium">Video to Image Sequence</Link>
            <Link to="/mp4-to-jpg" onClick={() => setOpen(false)} className="pl-2 font-medium">MP4 to JPG Converter</Link>
            <Link to="/video-to-png" onClick={() => setOpen(false)} className="pl-2 font-medium">Video to PNG Converter</Link>
            <Link to="/screenshot-from-video" onClick={() => setOpen(false)} className="pl-2 font-medium">Screenshot from Video</Link>
            <Link to="/extract-frames-from-video" onClick={() => setOpen(false)} className="pl-2 font-medium">Extract Frames from Video</Link>
            <Link to="/images-to-video" onClick={() => setOpen(false)} className="pl-2 font-medium">Images to Video</Link>
            <hr className="border-gray-900 my-1" />
            <Link to="/blog" onClick={() => setOpen(false)} className="font-medium">Blog</Link>
            <Link to="/#how-it-works" onClick={() => setOpen(false)} className="font-medium">How it Works</Link>
            <Link to="/#faq" onClick={() => setOpen(false)} className="font-medium">FAQ</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default memo(Header);