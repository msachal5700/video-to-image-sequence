import React, { useState, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n/index';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language)
    || SUPPORTED_LANGUAGES[0];

  const switchLanguage = useCallback((code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nLang', code);
    // Update html lang + dir attributes for RTL support
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (lang) {
      document.documentElement.lang = code;
      document.documentElement.dir = lang.dir;
    }
    setLangOpen(false);
    setOpen(false);
  }, [i18n]);

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800 font-display">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* BRAND NAME */}
        <Link to="/" className="flex items-center gap-2 font-bold text-white text-lg group">
          <span className="text-cyan-400 group-hover:scale-110 transition-transform">▶</span>
          <span>Video to Image Sequence <span className="text-cyan-400">Online</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400 font-sans">
          <div className="relative group">
            <button className="hover:text-white transition flex items-center gap-1 py-1 font-medium">
              {t('nav.tools')} <span className="text-[10px] text-gray-600">▼</span>
            </button>
            <div className="absolute top-full left-0 mt-1 bg-gray-950 border border-gray-800 rounded-xl p-2 min-w-[240px] hidden group-hover:block shadow-2xl z-50 flex flex-col max-h-[70vh] overflow-y-auto">
              <Link to="/" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">Video to Image Sequence</Link>
              <Link to="/mp4-to-jpg" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">MP4 to JPG Converter</Link>
              <Link to="/mp4-to-png" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">MP4 to PNG Converter</Link>
              <Link to="/video-to-webp" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">Video to WebP Converter</Link>
              <Link to="/mov-to-jpg" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">MOV to JPG Converter</Link>
              <Link to="/mov-to-png" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">MOV to PNG Converter</Link>
              <Link to="/webm-to-jpg" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">WebM to JPG Converter</Link>
              <Link to="/webm-to-png" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">WebM to PNG Converter</Link>
              <Link to="/video-to-png" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">Video to PNG Converter</Link>
              <Link to="/video-to-gif" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">Video to GIF Converter</Link>
              <Link to="/screenshot-from-video" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">Screenshot from Video</Link>
              <Link to="/extract-frame-at-timestamp" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">Exact Timestamp Extractor</Link>
              <Link to="/extract-frames-from-video" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">Extract Frames from Video</Link>
              <hr className="border-gray-900 my-1" />
              <span className="text-xs text-gray-600 uppercase font-semibold tracking-wider px-3 py-1">Every N Seconds</span>
              <Link to="/extract-frame-every-1-second" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">Frame Every 1 Second</Link>
              <Link to="/extract-frame-every-5-seconds" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">Frame Every 5 Seconds</Link>
              <Link to="/extract-frame-every-10-seconds" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">Frame Every 10 Seconds</Link>
              <Link to="/extract-frame-every-30-seconds" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">Frame Every 30 Seconds</Link>
              <hr className="border-gray-900 my-1" />
              <Link to="/ai-social-media-frame-picker" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors flex items-center justify-between font-medium">
                <span>AI Social Media Frame Picker</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded font-mono font-bold">NEW</span>
              </Link>

              <Link to="/images-to-video" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">Images to Video</Link>
              <Link to="/image-crop" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors flex items-center justify-between font-medium">
                <span>Freeform Image Crop</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded font-mono font-bold">NEW</span>
              </Link>
            </div>
          </div>
          <div className="relative group">
            <button className="hover:text-white transition flex items-center gap-1 py-1 font-medium">
              {t('nav.blog')} <span className="text-[10px] text-gray-600">▼</span>
            </button>
            <div className="absolute top-full left-0 mt-1 bg-gray-950 border border-gray-800 rounded-xl p-2 min-w-[280px] hidden group-hover:block shadow-2xl z-50 flex flex-col max-h-[70vh] overflow-y-auto">
              <Link to="/blog" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium">All Articles</Link>
              <hr className="border-gray-900 my-1" />
              <span className="text-xs text-gray-600 uppercase font-semibold tracking-wider px-3 py-1">Guides</span>
              <Link to="/blog/how-to-extract-frames-from-video" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">How to Extract Frames from Video</Link>
              <Link to="/blog/how-many-frames-per-second" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">How Many FPS to Extract?</Link>
              <Link to="/blog/video-codecs-explained" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">Video Codecs Explained</Link>
              <Link to="/blog/extract-video-frames-for-ai" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">Extract Frames for AI Datasets</Link>
              <Link to="/blog/video-to-image-sequence-explained" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">Video to Image Sequence Explained</Link>
              <Link to="/blog/jpg-vs-png-vs-webp-video-frames" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">JPG vs PNG vs WebP for Frames</Link>
              <Link to="/blog/what-is-video-frame-rate" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">What Is Video Frame Rate?</Link>
              <hr className="border-gray-900 my-1" />
              <span className="text-xs text-gray-600 uppercase font-semibold tracking-wider px-3 py-1">Tool Guides</span>
              <Link to="/blog/extract-frames-from-video-online" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">Extract Frames Online</Link>
              <Link to="/blog/mp4-to-image-sequence-guide" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">MP4 to Image Sequence</Link>
              <Link to="/blog/video-to-png-frames-guide" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">Video to PNG Frames</Link>
              <Link to="/blog/ai-best-frame-from-video" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">AI Best Frame from Video</Link>
              <Link to="/blog/how-to-convert-images-to-video-guide" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">Images to Video Guide</Link>
              <Link to="/blog/ezgif-alternative-video-to-image-sequence" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">Ezgif Alternative</Link>
              <Link to="/blog/video-frame-extractor-use-cases" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">Use Cases</Link>
              <Link to="/blog/best-fps-settings-for-video-frame-extraction" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">Best FPS Settings</Link>
              <Link to="/blog/free-image-crop-tool-guide" className="text-gray-400 hover:text-cyan-400 hover:bg-gray-900/60 px-3 py-2 rounded-lg transition-colors block text-left font-medium text-sm">Free Image Crop Tool Guide</Link>
            </div>
          </div>
          <Link to="/contact" className="hover:text-white transition font-medium">Contact</Link>
          <Link to="/#how-it-works" className="hover:text-white transition font-medium">{t('nav.howItWorks')}</Link>
          <Link to="/#faq" className="hover:text-white transition font-medium">{t('nav.faq')}</Link>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition py-1 font-medium"
              aria-label={t('nav.language')}
              title={t('nav.language')}
            >
              <Globe size={15} />
              <span className="text-sm">{currentLang.flag}</span>
              <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-1 bg-gray-950 border border-gray-800 rounded-xl p-2 min-w-[160px] shadow-2xl z-50">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium ${
                      i18n.language === lang.code
                        ? 'text-cyan-400 bg-cyan-950/40'
                        : 'text-gray-400 hover:text-white hover:bg-gray-900/60'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-gray-800/50"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
        </button>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-gray-400 ml-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>

        {open && (
          <div className="absolute top-16 left-0 w-full bg-gray-950 border-b border-gray-800 p-4 flex flex-col gap-3.5 text-sm text-gray-300 md:hidden font-sans max-h-[80vh] overflow-y-auto">
            <span className="text-xs text-gray-600 uppercase font-semibold tracking-wider">Converter Tools</span>
            <Link to="/" onClick={() => setOpen(false)} className="pl-2 font-medium">Video to Image Sequence</Link>
            <Link to="/mp4-to-jpg" onClick={() => setOpen(false)} className="pl-2 font-medium">MP4 to JPG Converter</Link>
            <Link to="/mp4-to-png" onClick={() => setOpen(false)} className="pl-2 font-medium">MP4 to PNG Converter</Link>
            <Link to="/video-to-webp" onClick={() => setOpen(false)} className="pl-2 font-medium">Video to WebP Converter</Link>
            <Link to="/mov-to-jpg" onClick={() => setOpen(false)} className="pl-2 font-medium">MOV to JPG Converter</Link>
            <Link to="/mov-to-png" onClick={() => setOpen(false)} className="pl-2 font-medium">MOV to PNG Converter</Link>
            <Link to="/webm-to-jpg" onClick={() => setOpen(false)} className="pl-2 font-medium">WebM to JPG Converter</Link>
            <Link to="/webm-to-png" onClick={() => setOpen(false)} className="pl-2 font-medium">WebM to PNG Converter</Link>
            <Link to="/video-to-png" onClick={() => setOpen(false)} className="pl-2 font-medium">Video to PNG Converter</Link>
            <Link to="/video-to-gif" onClick={() => setOpen(false)} className="pl-2 font-medium">Video to GIF Converter</Link>
            <Link to="/screenshot-from-video" onClick={() => setOpen(false)} className="pl-2 font-medium">Screenshot from Video</Link>
            <Link to="/extract-frame-at-timestamp" onClick={() => setOpen(false)} className="pl-2 font-medium">Exact Timestamp Extractor</Link>
            <Link to="/extract-frames-from-video" onClick={() => setOpen(false)} className="pl-2 font-medium">Extract Frames from Video</Link>
            <span className="text-xs text-gray-600 uppercase font-semibold tracking-wider pl-2 pt-1">Every N Seconds</span>
            <Link to="/extract-frame-every-1-second" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">Frame Every 1 Second</Link>
            <Link to="/extract-frame-every-5-seconds" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">Frame Every 5 Seconds</Link>
            <Link to="/extract-frame-every-10-seconds" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">Frame Every 10 Seconds</Link>
            <Link to="/extract-frame-every-30-seconds" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">Frame Every 30 Seconds</Link>
            <Link to="/ai-social-media-frame-picker" onClick={() => setOpen(false)} className="pl-2 font-medium flex items-center justify-between">
              <span>AI Social Media Frame Picker</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded font-mono font-bold mr-2">NEW</span>
            </Link>

            <Link to="/images-to-video" onClick={() => setOpen(false)} className="pl-2 font-medium">Images to Video</Link>
            <Link to="/image-crop" onClick={() => setOpen(false)} className="pl-2 font-medium flex items-center justify-between">
              <span>Freeform Image Crop</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded font-mono font-bold mr-2">NEW</span>
            </Link>
            <hr className="border-gray-900 my-1" />
            <div className="pl-2">
              <span className="text-xs text-gray-600 uppercase font-semibold tracking-wider block pb-1">{t('nav.blog')}</span>
              <Link to="/blog" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">All Articles</Link>
              <Link to="/blog/how-to-extract-frames-from-video" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">How to Extract Frames</Link>
              <Link to="/blog/how-many-frames-per-second" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">How Many FPS?</Link>
              <Link to="/blog/video-codecs-explained" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">Video Codecs Explained</Link>
              <Link to="/blog/extract-video-frames-for-ai" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">Frames for AI Datasets</Link>
              <Link to="/blog/video-to-image-sequence-explained" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">Image Sequence Explained</Link>
              <Link to="/blog/jpg-vs-png-vs-webp-video-frames" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">JPG vs PNG vs WebP</Link>
              <Link to="/blog/what-is-video-frame-rate" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">What Is Frame Rate?</Link>
              <Link to="/blog/extract-frames-from-video-online" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">Extract Frames Online</Link>
              <Link to="/blog/mp4-to-image-sequence-guide" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">MP4 to Image Sequence</Link>
              <Link to="/blog/video-to-png-frames-guide" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">Video to PNG Guide</Link>
              <Link to="/blog/ai-best-frame-from-video" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">AI Best Frame</Link>
              <Link to="/blog/how-to-convert-images-to-video-guide" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">Images to Video Guide</Link>
              <Link to="/blog/ezgif-alternative-video-to-image-sequence" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">Ezgif Alternative</Link>
              <Link to="/blog/video-frame-extractor-use-cases" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">Use Cases</Link>
              <Link to="/blog/best-fps-settings-for-video-frame-extraction" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">Best FPS Settings</Link>
              <Link to="/blog/free-image-crop-tool-guide" onClick={() => setOpen(false)} className="pl-4 font-medium text-sm">Free Image Crop Tool Guide</Link>
            </div>
            <Link to="/#how-it-works" onClick={() => setOpen(false)} className="font-medium">{t('nav.howItWorks')}</Link>
            <Link to="/#faq" onClick={() => setOpen(false)} className="font-medium">{t('nav.faq')}</Link>
            <hr className="border-gray-900 my-1" />
            {/* Mobile Language Switcher */}
            <span className="text-xs text-gray-600 uppercase font-semibold tracking-wider">{t('nav.language')}</span>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => switchLanguage(lang.code)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                    i18n.language === lang.code
                      ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900/60 border border-gray-800'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="text-xs">{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click-outside overlay for lang dropdown */}
      {langOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setLangOpen(false)}
        />
      )}
    </header>
  );
};

export default memo(Header);