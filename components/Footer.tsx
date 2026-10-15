import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          <div>
            <div className="flex items-center gap-2 font-bold text-white mb-3 font-display">
              <span className="text-cyan-400">▶</span> Video to Image Sequence Online
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">{t('footer.converterTools')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-cyan-400 transition">Video to Image Sequence</Link></li>
              <li><Link to="/mp4-to-jpg" className="text-gray-600 hover:text-cyan-400 transition">MP4 to JPG Converter</Link></li>
              <li><Link to="/video-to-png" className="text-gray-600 hover:text-cyan-400 transition">Video to PNG Converter</Link></li>
              <li><Link to="/video-to-gif" className="text-gray-600 hover:text-cyan-400 transition">Video to GIF Converter</Link></li>
              <li><Link to="/screenshot-from-video" className="text-gray-600 hover:text-cyan-400 transition">Screenshot from Video</Link></li>
              <li><Link to="/extract-frames-from-video" className="text-gray-600 hover:text-cyan-400 transition">Extract Frames from Video</Link></li>
              <li><Link to="/video-contact-sheet" className="text-gray-600 hover:text-cyan-400 transition">Video Contact Sheet</Link></li>
              <li><Link to="/extract-frame-every-1-second" className="text-gray-600 hover:text-cyan-400 transition">Frame Every 1 Second</Link></li>
              <li><Link to="/extract-frame-every-5-seconds" className="text-gray-600 hover:text-cyan-400 transition">Frame Every 5 Seconds</Link></li>
              <li><Link to="/extract-frame-every-10-seconds" className="text-gray-600 hover:text-cyan-400 transition">Frame Every 10 Seconds</Link></li>
              <li><Link to="/extract-frame-every-30-seconds" className="text-gray-600 hover:text-cyan-400 transition">Frame Every 30 Seconds</Link></li>
              <li><Link to="/images-to-video" className="text-gray-600 hover:text-cyan-400 transition">Images to Video</Link></li>
              <li><Link to="/image-crop" className="text-gray-600 hover:text-cyan-400 transition">Freeform Image Crop</Link></li>
              <li><Link to="/youtube-thumbnail-downloader" className="text-gray-600 hover:text-cyan-400 transition">YouTube Thumbnail Downloader</Link></li>
              <li><Link to="/gif-to-frames" className="text-gray-600 hover:text-cyan-400 transition">GIF to Frames</Link></li>
              <li><Link to="/gif-to-mp4" className="text-gray-600 hover:text-cyan-400 transition">GIF to MP4 Converter</Link></li>
              <li><Link to="/video-looper" className="text-gray-600 hover:text-cyan-400 transition">Video Looper</Link></li>
              <li><Link to="/frames-to-gif" className="text-gray-600 hover:text-cyan-400 transition">Frames to GIF</Link></li>