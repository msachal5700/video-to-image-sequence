import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ImagesToVideoPage from './pages/ImagesToVideoPage';
import NotFound from './pages/NotFound';
import BlogIndex from './pages/BlogIndex';
import ExtractFramesOnline from './pages/blog/ExtractFramesOnline';
import Mp4ToImageSequence from './pages/blog/Mp4ToImageSequence';
import VideoToPngFrames from './pages/blog/VideoToPngFrames';
import { PrivacyPolicy, TermsOfService, AboutUs } from './pages/Legal';
import Mp4ToJpg from './pages/Mp4ToJpg';
import ScreenshotFromVideo from './pages/ScreenshotFromVideo';
import VideoToPng from './pages/VideoToPng';
import VideoToPngGuide from './pages/blog/VideoToPngGuide';

// Component to handle hash-based scrolling
const ScrollToHash: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Retry logic to handle cases where DOM isn't ready yet
    const scrollToElement = () => {
      if (location.hash) {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
        return false;
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return true;
      }
    };

    // Try immediately, then with delays to handle slow DOM rendering
    let attempts = 0;
    const maxAttempts = 5;
    const retryInterval = setInterval(() => {
      if (scrollToElement() || attempts >= maxAttempts) {
        clearInterval(retryInterval);
      }
      attempts++;
    }, 150);

    return () => clearInterval(retryInterval);
  }, [location]);

  return null;
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToHash />
        <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-cyan-500/30 flex flex-col font-sans">
          <Header />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/images-to-video" element={<ImagesToVideoPage />} />
              <Route path="/mp4-to-jpg" element={<Mp4ToJpg />} />
              <Route path="/screenshot-from-video" element={<ScreenshotFromVideo />} />
              <Route path="/video-to-png" element={<VideoToPng />} />
              <Route path="/blog" element={<BlogIndex />} />
              <Route path="/blog/extract-frames-from-video-online" element={<ExtractFramesOnline />} />
              <Route path="/blog/mp4-to-image-sequence-guide" element={<Mp4ToImageSequence />} />
              <Route path="/blog/video-to-png-frames-free" element={<VideoToPngFrames />} />
              <Route path="/blog/video-to-png-frames-guide" element={<VideoToPngGuide />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
