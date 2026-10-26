import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n/index';
import { isNonEnLang } from '../utils/localizedRoutes';
import Home from '../pages/Home';
const Mp4ToJpg = lazy(() => import('../pages/Mp4ToJpg'));
const ExtractFramesFromVideo = lazy(() => import('../pages/ExtractFramesFromVideo'));
const VideoToPng = lazy(() => import('../pages/VideoToPng'));
const ScreenshotFromVideo = lazy(() => import('../pages/ScreenshotFromVideo'));
const VideoToWebp = lazy(() => import('../pages/VideoToWebp'));
const ImagesToVideoPage = lazy(() => import('../pages/ImagesToVideoPage'));
const VideoToFrames = lazy(() => import('../pages/VideoToFrames'));
const VideoToJpg = lazy(() => import('../pages/VideoToJpg'));
import NotFound from '../pages/NotFound';

/**
 * Handles /:lang/* — real, prerendered, indexable URLs for every supported
 * non-English language (e.g. /es/mp4-to-jpg). The language always comes from
 * the URL, never from localStorage or the browser, so crawlers and fresh
 * visitors deterministically get the translated page.
 */
const LocalizedRoutes: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (isNonEnLang(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
      try {
        localStorage.setItem('i18nLang', lang);
      } catch {
        /* storage unavailable — URL remains the source of truth */
      }
      const meta = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
      document.documentElement.lang = lang;
      if (meta) document.documentElement.dir = meta.dir;
    }
  }, [lang, i18n]);

  if (!isNonEnLang(lang)) {
    return <NotFound />;
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-5rem)]"><div className="text-gray-500 text-sm font-mono animate-pulse">Loading…</div></div>}>
<Routes>
      <Route index element={<Home />} />
      <Route path="mp4-to-jpg" element={<Mp4ToJpg />} />
      <Route path="extract-frames-from-video" element={<ExtractFramesFromVideo />} />
      <Route path="video-to-png" element={<VideoToPng />} />
      <Route path="screenshot-from-video" element={<ScreenshotFromVideo />} />
      <Route path="video-to-webp" element={<VideoToWebp />} />
      <Route path="images-to-video" element={<ImagesToVideoPage />} />
      <Route path="video-to-frames" element={<VideoToFrames />} />
      <Route path="video-to-jpg" element={<VideoToJpg />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
</Suspense>
  );
};

export default LocalizedRoutes;
