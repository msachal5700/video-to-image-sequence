import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { useLocaleSync } from './hooks/usePageLang';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
const ImagesToVideoPage = lazy(() => import('./pages/ImagesToVideoPage'));
import NotFound from './pages/NotFound';
const BlogIndex = lazy(() => import('./pages/BlogIndex'));
const ExtractFramesOnline = lazy(() => import('./pages/blog/ExtractFramesOnline'));
const Mp4ToImageSequence = lazy(() => import('./pages/blog/Mp4ToImageSequence'));
const PrivacyPolicy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/Legal').then((m) => ({ default: m.TermsOfService })));
const AboutUs = lazy(() => import('./pages/Legal').then((m) => ({ default: m.AboutUs })));
const EditorialPolicy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.EditorialPolicy })));
const Disclaimer = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Disclaimer })));
const Mp4ToJpg = lazy(() => import('./pages/Mp4ToJpg'));
const Mp4ToPng = lazy(() => import('./pages/Mp4ToPng'));
const ScreenshotFromVideo = lazy(() => import('./pages/ScreenshotFromVideo'));
const VideoToPng = lazy(() => import('./pages/VideoToPng'));
const VideoToGif = lazy(() => import('./pages/VideoToGif'));
const ImageCrop = lazy(() => import('./pages/ImageCrop'));
const VideoToWebp = lazy(() => import('./pages/VideoToWebp'));
const VideoToAvif = lazy(() => import('./pages/VideoToAvif'));
const MovToJpg = lazy(() => import('./pages/MovToJpg'));
const MovToPng = lazy(() => import('./pages/MovToPng'));
const WebmToJpg = lazy(() => import('./pages/WebmToJpg'));
const WebmToPng = lazy(() => import('./pages/WebmToPng'));
const VideoToPngGuide = lazy(() => import('./pages/blog/VideoToPngGuide'));
const ExtractFrameAtTimestamp = lazy(() => import('./pages/ExtractFrameAtTimestamp'));
const ExtractFramesFromVideo = lazy(() => import('./pages/ExtractFramesFromVideo'));
const ExtractFrameEveryNSeconds = lazy(() => import('./pages/ExtractFrameEveryNSeconds'));
const AiSocialMediaFramePicker = lazy(() => import('./pages/AiSocialMediaFramePicker'));
const AiBestFrameFromVideo = lazy(() => import('./pages/blog/AiBestFrameFromVideo'));
const ImagesToVideoGuide = lazy(() => import('./pages/blog/ImagesToVideoGuide'));
const EzgifAlternative = lazy(() => import('./pages/blog/EzgifAlternative'));
const FrameExtractionFpsGuide = lazy(() => import('./pages/blog/FrameExtractionFpsGuide'));
const GifToMp4WhyHow = lazy(() => import('./pages/blog/GifToMp4WhyHow'));
const HowToCompressGif = lazy(() => import('./pages/blog/HowToCompressGif'));
const HeicToJpgGuide = lazy(() => import('./pages/blog/HeicToJpgGuide'));
const FreeVideoToolsRoundup = lazy(() => import('./pages/blog/FreeVideoToolsRoundup'));
const StopMotionBeginners = lazy(() => import('./pages/blog/StopMotionBeginners'));
const VideoContactSheetsGuide = lazy(() => import('./pages/blog/VideoContactSheetsGuide'));
const VideoThumbnailsThatGetClicks = lazy(() => import('./pages/blog/VideoThumbnailsThatGetClicks'));
const SpriteSheetsGameDevs = lazy(() => import('./pages/blog/SpriteSheetsGameDevs'));
const ColorPalettesFilmStills = lazy(() => import('./pages/blog/ColorPalettesFilmStills'));
const LectureNotesFromVideos = lazy(() => import('./pages/blog/LectureNotesFromVideos'));
const SmartSceneDetectionGuide = lazy(() => import('./pages/blog/SmartSceneDetectionGuide'));
const VideoFrameExtractorUseCases = lazy(() => import('./pages/blog/VideoFrameExtractorUseCases'));
const BestFpsForVideoExtraction = lazy(() => import('./pages/blog/BestFpsForVideoExtraction'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const MediaPartner = lazy(() => import('./pages/MediaPartner'));
const Changelog = lazy(() => import('./pages/Changelog'));
const VideoToFrames = lazy(() => import('./pages/VideoToFrames'));
const VideoContactSheet = lazy(() => import('./pages/VideoContactSheet'));
const VideoToJpg = lazy(() => import('./pages/VideoToJpg'));
const VideoFrameExtractor = lazy(() => import('./pages/VideoFrameExtractor'));
const VideoToPhoto = lazy(() => import('./pages/VideoToPhoto'));
const YoutubeThumbnailDownloader = lazy(() => import('./pages/YoutubeThumbnailDownloader'));
const GifToFrames = lazy(() => import('./pages/GifToFrames'));
const GifToMp4 = lazy(() => import('./pages/GifToMp4'));
const VideoNotesExtractor = lazy(() => import('./pages/VideoNotesExtractor'));
const VideoToSpriteSheet = lazy(() => import('./pages/VideoToSpriteSheet'));
const StopMotionCapture = lazy(() => import('./pages/StopMotionCapture'));
const VideoColorPalette = lazy(() => import('./pages/VideoColorPalette'));
const VideoThumbnailMaker = lazy(() => import('./pages/VideoThumbnailMaker'));
const VideoMetadataInspector = lazy(() => import('./pages/VideoMetadataInspector'));
const VideoLooper = lazy(() => import('./pages/VideoLooper'));
const FramesToGif = lazy(() => import('./pages/FramesToGif'));
const CompressGif = lazy(() => import('./pages/CompressGif'));
const HeicToJpg = lazy(() => import('./pages/HeicToJpg'));
const SpriteSheetSlicer = lazy(() => import('./pages/SpriteSheetSlicer'));
const DiscordStickerMaker = lazy(() => import('./pages/DiscordStickerMaker'));
const LastFrameExtractor = lazy(() => import('./pages/LastFrameExtractor'));
const VideoToPdf = lazy(() => import('./pages/VideoToPdf'));
const VideoFramesForAiDatasets = lazy(() => import('./pages/VideoFramesForAiDatasets'));
const VideoToImageSequenceForBlender = lazy(() => import('./pages/VideoToImageSequenceForBlender'));
const VideoFrameForYoutubeThumbnail = lazy(() => import('./pages/VideoFrameForYoutubeThumbnail'));
const HowManyFramesPerSecond = lazy(() => import('./pages/blog/HowManyFramesPerSecond'));
const VideoCodecsExplained = lazy(() => import('./pages/blog/VideoCodecsExplained'));
const ExtractVideoFramesForAI = lazy(() => import('./pages/blog/ExtractVideoFramesForAI'));
const HowToExtractFramesFromVideo = lazy(() => import('./pages/blog/HowToExtractFramesFromVideo'));
const VideoToImageSequenceExplained = lazy(() => import('./pages/blog/VideoToImageSequenceExplained'));
const JpgVsPngVsWebp = lazy(() => import('./pages/blog/JpgVsPngVsWebp'));
const WhatIsVideoFrameRate = lazy(() => import('./pages/blog/WhatIsVideoFrameRate'));
const FreeImageCropToolGuide = lazy(() => import('./pages/blog/FreeImageCropToolGuide'));
const VideoToStopMotionFrames = lazy(() => import('./pages/blog/VideoToStopMotionFrames'));
const EcommerceProductStills = lazy(() => import('./pages/blog/EcommerceProductStills'));
const CloudinaryAlternative = lazy(() => import('./pages/blog/CloudinaryAlternative'));
import CookieConsent from './components/CookieConsent';
import FeedbackWidget from './components/FeedbackWidget';
import ClarityConsent from './components/ClarityConsent';
import LocalizedRoutes from './components/LocalizedRoutes';



// Keeps <html lang>, text direction and i18next in sync with the URL on
// every route change — including English-only pages, where it resets any
// language leaked from an earlier localized visit (see useLocaleSync).
const LocaleSync: React.FC = () => {
  useLocaleSync();
  return null;
};

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
          <LocaleSync />
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
              <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-5rem)]"><div className="text-gray-500 text-sm font-mono animate-pulse">Loading…</div></div>}>
<Routes>
                <Route path="/" element={<Home />} />
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
                <Route path="/video-to-avif" element={<VideoToAvif />} />
                <Route path="/mov-to-jpg" element={<MovToJpg />} />
                <Route path="/mov-to-png" element={<MovToPng />} />
                <Route path="/webm-to-jpg" element={<WebmToJpg />} />
                <Route path="/webm-to-png" element={<WebmToPng />} />
                <Route path="/screenshot-from-video" element={<ScreenshotFromVideo />} />
                <Route path="/video-to-png" element={<VideoToPng />} />
                <Route path="/video-to-gif" element={<VideoToGif />} />
                <Route path="/image-crop" element={<ImageCrop />} />
                <Route path="/blog" element={<BlogIndex />} />
                <Route path="/blog/extract-frames-from-video-online" element={<ExtractFramesOnline />} />
                <Route path="/blog/mp4-to-image-sequence-guide" element={<Mp4ToImageSequence />} />
                <Route path="/blog/video-to-png-frames-free" element={<Navigate to="/blog/video-to-png-frames-guide" replace />} />
                <Route path="/blog/video-to-png-frames-guide" element={<VideoToPngGuide />} />
                <Route path="/blog/ai-best-frame-from-video" element={<AiBestFrameFromVideo />} />
                <Route path="/blog/how-to-convert-images-to-video-guide" element={<ImagesToVideoGuide />} />
                <Route path="/blog/ezgif-alternative-video-to-image-sequence" element={<EzgifAlternative />} />
                <Route path="/blog/frame-extraction-fps-vs-interval-guide" element={<FrameExtractionFpsGuide />} />
                <Route path="/blog/gif-to-mp4-why-and-how" element={<GifToMp4WhyHow />} />
                <Route path="/blog/how-to-compress-a-gif" element={<HowToCompressGif />} />
                <Route path="/blog/heic-to-jpg-guide" element={<HeicToJpgGuide />} />
                <Route path="/blog/free-video-tools-online" element={<FreeVideoToolsRoundup />} />
                <Route path="/blog/stop-motion-for-beginners" element={<StopMotionBeginners />} />
                <Route path="/blog/video-contact-sheets-guide" element={<VideoContactSheetsGuide />} />
                <Route path="/blog/video-thumbnails-that-get-clicks" element={<VideoThumbnailsThatGetClicks />} />
                <Route path="/blog/sprite-sheets-explained-game-devs" element={<SpriteSheetsGameDevs />} />
                <Route path="/blog/color-palettes-from-film-stills" element={<ColorPalettesFilmStills />} />
                <Route path="/blog/lecture-notes-from-videos" element={<LectureNotesFromVideos />} />
                <Route path="/blog/smart-scene-detection-guide" element={<SmartSceneDetectionGuide />} />
                <Route path="/blog/video-frame-extractor-use-cases" element={<VideoFrameExtractorUseCases />} />
                <Route path="/blog/best-fps-settings-for-video-frame-extraction" element={<BestFpsForVideoExtraction />} />
                <Route path="/blog/how-many-frames-per-second" element={<HowManyFramesPerSecond />} />
                <Route path="/blog/video-codecs-explained" element={<VideoCodecsExplained />} />
                <Route path="/blog/extract-video-frames-for-ai" element={<ExtractVideoFramesForAI />} />
                <Route path="/blog/how-to-extract-frames-from-video" element={<HowToExtractFramesFromVideo />} />
                <Route path="/blog/video-to-image-sequence-explained" element={<VideoToImageSequenceExplained />} />
                <Route path="/blog/jpg-vs-png-vs-webp-video-frames" element={<JpgVsPngVsWebp />} />
                <Route path="/blog/what-is-video-frame-rate" element={<WhatIsVideoFrameRate />} />
                <Route path="/blog/free-image-crop-tool-guide" element={<FreeImageCropToolGuide />} />
                <Route path="/blog/video-to-stop-motion-frames" element={<VideoToStopMotionFrames />} />
                <Route path="/blog/product-video-to-product-photos-ecommerce" element={<EcommerceProductStills />} />
                <Route path="/blog/cloudinary-video-to-image-sequence-alternative" element={<CloudinaryAlternative />} />

                <Route path="/video-frames-for-ai-datasets" element={<VideoFramesForAiDatasets />} />
                <Route path="/video-to-image-sequence-for-blender" element={<VideoToImageSequenceForBlender />} />
                <Route path="/video-frame-for-youtube-thumbnail" element={<VideoFrameForYoutubeThumbnail />} />

                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/editorial-policy" element={<EditorialPolicy />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/media-partner" element={<MediaPartner />} />
                <Route path="/changelog" element={<Changelog />} />
                <Route path="/video-to-frames" element={<VideoToFrames />} />
                <Route path="/video-contact-sheet" element={<VideoContactSheet />} />
                <Route path="/video-to-jpg" element={<VideoToJpg />} />
                <Route path="/video-frame-extractor" element={<VideoFrameExtractor />} />
                <Route path="/video-to-photo" element={<VideoToPhoto />} />
                <Route path="/youtube-thumbnail-downloader" element={<YoutubeThumbnailDownloader />} />
                <Route path="/gif-to-frames" element={<GifToFrames />} />
                <Route path="/gif-to-mp4" element={<GifToMp4 />} />
                <Route path="/video-notes-extractor" element={<VideoNotesExtractor />} />
                <Route path="/video-to-sprite-sheet" element={<VideoToSpriteSheet />} />
                <Route path="/sprite-sheet-slicer" element={<SpriteSheetSlicer />} />
                <Route path="/stop-motion-capture" element={<StopMotionCapture />} />
                <Route path="/video-color-palette" element={<VideoColorPalette />} />
                <Route path="/video-thumbnail-maker" element={<VideoThumbnailMaker />} />
                <Route path="/video-metadata-inspector" element={<VideoMetadataInspector />} />
                <Route path="/video-looper" element={<VideoLooper />} />
                <Route path="/frames-to-gif" element={<FramesToGif />} />
                <Route path="/compress-gif" element={<CompressGif />} />
                <Route path="/heic-to-jpg" element={<HeicToJpg />} />
                <Route path="/discord-sticker-maker" element={<DiscordStickerMaker />} />
                <Route path="/last-frame-extractor" element={<LastFrameExtractor />} />
                <Route path="/video-to-pdf" element={<VideoToPdf />} />
                <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
                <Route path="/terms-of-service" element={<Navigate to="/terms" replace />} />
                <Route path="/about-us" element={<Navigate to="/about" replace />} />
                <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
                {/* Localized URLs: /es/mp4-to-jpg, /de/ … — real prerendered pages with hreflang.
                    Static routes above outrank this dynamic segment, so /blog/* etc. are unaffected. */}
                <Route path="/:lang/*" element={<LocalizedRoutes />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
</Suspense>
            </main>

            <Footer />
            <CookieConsent />
            <ClarityConsent />
            <FeedbackWidget />
            <Analytics />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
