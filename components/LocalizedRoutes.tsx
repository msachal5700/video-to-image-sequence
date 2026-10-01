import React, { useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n/index';
import { isNonEnLang } from '../utils/localizedRoutes';
import Home from '../pages/Home';
import Mp4ToJpg from '../pages/Mp4ToJpg';
import ExtractFramesFromVideo from '../pages/ExtractFramesFromVideo';
import VideoToPng from '../pages/VideoToPng';
import ScreenshotFromVideo from '../pages/ScreenshotFromVideo';
import VideoToWebp from '../pages/VideoToWebp';
import ImagesToVideoPage from '../pages/ImagesToVideoPage';
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
    <Routes>
      <Route index element={<Home />} />
      <Route path="mp4-to-jpg" element={<Mp4ToJpg />} />
      <Route path="extract-frames-from-video" element={<ExtractFramesFromVideo />} />
      <Route path="video-to-png" element={<VideoToPng />} />
      <Route path="screenshot-from-video" element={<ScreenshotFromVideo />} />
      <Route path="video-to-webp" element={<VideoToWebp />} />
      <Route path="images-to-video" element={<ImagesToVideoPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default LocalizedRoutes;
