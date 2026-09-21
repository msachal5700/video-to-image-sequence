import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ImagesToVideoPage from './pages/ImagesToVideoPage';
import NotFound from './pages/NotFound';
import BlogIndex from './pages/BlogIndex';
import ExtractFramesOnline from './pages/blog/ExtractFramesOnline';
import Mp4ToImageSequence from './pages/blog/Mp4ToImageSequence';
import { PrivacyPolicy, TermsOfService, AboutUs } from './pages/Legal';
import Mp4ToJpg from './pages/Mp4ToJpg';
import Mp4ToPng from './pages/Mp4ToPng';
import ScreenshotFromVideo from './pages/ScreenshotFromVideo';
import VideoToPng from './pages/VideoToPng';
import VideoToGif from './pages/VideoToGif';
import VideoToWebp from './pages/VideoToWebp';
import MovToJpg from './pages/MovToJpg';
import MovToPng from './pages/MovToPng';
import WebmToJpg from './pages/WebmToJpg';
import WebmToPng from './pages/WebmToPng';
import VideoToPngGuide from './pages/blog/VideoToPngGuide';
import ExtractFrameAtTimestamp from './pages/ExtractFrameAtTimestamp';
import ExtractFramesFromVideo from './pages/ExtractFramesFromVideo';
import ExtractFrameEveryNSeconds from './pages/ExtractFrameEveryNSeconds';
import AiSocialMediaFramePicker from './pages/AiSocialMediaFramePicker';
import AiBestFrameFromVideo from './pages/blog/AiBestFrameFromVideo';
import ImagesToVideoGuide from './pages/blog/ImagesToVideoGuide';
import EzgifAlternative from './pages/blog/EzgifAlternative';
import VideoFrameExtractorUseCases from './pages/blog/VideoFrameExtractorUseCases';
import BestFpsForVideoExtraction from './pages/blog/BestFpsForVideoExtraction';
import ContactPage from './pages/ContactPage';
import VideoFramesForAiDatasets from './pages/VideoFramesForAiDatasets';
import VideoToImageSequenceForBlender from './pages/VideoToImageSequenceForBlender';
import VideoFrameForYoutubeThumbnail from './pages/VideoFrameForYoutubeThumbnail';
import HowManyFramesPerSecond from './pages/blog/HowManyFramesPerSecond';
import VideoCodecsExplained from './pages/blog/VideoCodecsExplained';
import ExtractVideoFramesForAI from './pages/blog/ExtractVideoFramesForAI';
import HowToExtractFramesFromVideo from './pages/blog/HowToExtractFramesFromVideo';
import VideoToImageSequenceExplained from './pages/blog/VideoToImageSequenceExplained';
import JpgVsPngVsWebp from './pages/blog/JpgVsPngVsWebp';
import WhatIsVideoFrameRate from './pages/blog/WhatIsVideoFrameRate';
import CookieConsent from './components/CookieConsent';



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
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToHash />
          {/* Skip link for keyboard navigation — focusable when tabbed, jumps to main content */}
          <a
            href="#__next"
            className="fixed top-0 left-0 z-50 bg-gray-950 px-6 py-3 text-white font-semibold transform -translate-x-full transition-transform duration-300 focus:translate-x-0 focus:outline-none focus:outline-2 focus:outline-cyan-500"
            aria-label="Skip to main content"
          >
            Skip to main content
          </a>
          <div className="min-h-screen bg-gray-950 text-gray-100 selection:bg-cyan-500/30 flex flex-col font-sans transition-colors duration-300">
            <Header />
            
            <main id="__next" className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/video-frame-extractor" element={<ExtractFramesFromVideo />} />
                <Route path="/extract-frames-from-video" element={<ExtractFramesFromVideo />} />
                <Route path="/extract-frame-at-timestamp" element={<ExtractFrameAtTimestamp />} />
                <Route path="/extract-frame-every-1-second" element={<ExtractFrameEveryNSeconds seconds={1} />} />
                <Route path="/extract-frame-every-5-seconds" element={<ExtractFrameEveryNSeconds seconds={5} />} />
                <Route path="/extract-frame-every-10-seconds" element={<ExtractFrameEveryNSeconds seconds={10} />} />
                <Route path="/extract-frame-every-30-seconds" element={<ExtractFrameEveryNSeconds seconds={30} />} />
                <Route path="/ai-social-media-frame-picker" element={<AiSocialMediaFramePicker />} />

                <Route path="/images-to-video" element={<ImagesToVideoPage />} />
                <Route path="/mp4-to-jpg" element={<Mp4ToJpg />} />
                <Route path="/mp4-to-png" element={<Mp4ToPng />} />
                <Route path="/video-to-webp" element={<VideoToWebp />} />
                <Route path="/mov-to-jpg" element={<MovToJpg />} />
                <Route path="/mov-to-png" element={<MovToPng />} />
                <Route path="/webm-to-jpg" element={<WebmToJpg />} />
                <Route path="/webm-to-png" element={<WebmToPng />} />
                <Route path="/screenshot-from-video" element={<ScreenshotFromVideo />} />
                <Route path="/video-to-png" element={<VideoToPng />} />
                <Route path="/video-to-gif" element={<VideoToGif />} />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/extract-frames-from-video-online" element={<ExtractFramesOnline />} />
                <Route path="/blog/mp4-to-image-sequence-guide" element={<Mp4ToImageSequence />} />
                <Route path="/blog/video-to-png-frames-free" element={<Navigate to="/blog/video-to-png-frames-guide" replace />} />
                <Route path="/blog/video-to-png-frames-guide" element={<VideoToPngGuide />} />
                <Route path="/blog/ai-best-frame-from-video" element={<AiBestFrameFromVideo />} />
                <Route path="/blog/how-to-convert-images-to-video-guide" element={<ImagesToVideoGuide />} />
                <Route path="/blog/ezgif-alternative-video-to-image-sequence" element={<EzgifAlternative />} />
                <Route path="/blog/video-frame-extractor-use-cases" element={<VideoFrameExtractorUseCases />} />
                <Route path="/blog/best-fps-settings-for-video-frame-extraction" element={<BestFpsForVideoExtraction />} />
                <Route path="/blog/how-many-frames-per-second" element={<HowManyFramesPerSecond />} />
                <Route path="/blog/video-codecs-explained" element={<VideoCodecsExplained />} />
                <Route path="/blog/extract-video-frames-for-ai" element={<ExtractVideoFramesForAI />} />
                <Route path="/blog/how-to-extract-frames-from-video" element={<HowToExtractFramesFromVideo />} />
                <Route path="/blog/video-to-image-sequence-explained" element={<VideoToImageSequenceExplained />} />
                <Route path="/blog/jpg-vs-png-vs-webp-video-frames" element={<JpgVsPngVsWebp />} />
                <Route path="/blog/what-is-video-frame-rate" element={<WhatIsVideoFrameRate />} />

                <Route path="/video-frames-for-ai-datasets" element={<VideoFramesForAiDatasets />} />
                <Route path="/video-to-image-sequence-for-blender" element={<VideoToImageSequenceForBlender />} />
                <Route path="/video-frame-for-youtube-thumbnail" element={<VideoFrameForYoutubeThumbnail />} />

                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
                <Route path="/terms-of-service" element={<Navigate to="/terms" replace />} />
                <Route path="/about-us" element={<Navigate to="/about" replace />} />
                <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
            <CookieConsent />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
