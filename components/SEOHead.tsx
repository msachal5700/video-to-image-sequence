import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n/index';
import {
  SITE_ORIGIN,
  hreflangAlternates,
  splitLangPrefix,
  isLocalizedPath,
} from '../utils/localizedRoutes';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  articleDate?: string;
  noindex?: boolean;
  nofollow?: boolean;
  keywords?: string;
}

const setMeta = (selector: string, attr: string, value: string) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    
    const nameMatch = selector.match(/name="([^"]+)"/);
    if (nameMatch) el.setAttribute('name', nameMatch[1]);
    
    const propertyMatch = selector.match(/property="([^"]+)"/);
    if (propertyMatch) el.setAttribute('property', propertyMatch[1]);
    
    const relMatch = selector.match(/rel="([^"]+)"/);
    if (relMatch) el.setAttribute('rel', relMatch[1]);
    
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

/**
 * Maintain hreflang and the <html> lang/dir attributes.
 *
 * Pages with real localized URLs (e.g. /es/mp4-to-jpg) get the full
 * alternate set — one tag per supported language plus x-default pointing
 * at the English root URL. The set is derived from the canonical, so every
 * language version declares the identical, complete set (a requirement for
 * Google to honor hreflang).
 *
 * Pages without localized URLs keep the honest fallback: a single
 * self-referencing x-default. Emitting per-language tags that all point at
 * the same URL would be a self-contradictory set that Google discards.
 */
const updateHreflangTags = (canonicalUrl: string, currentLang: string) => {
  // Drop anything a previous render injected, so language switches don't stack.
  document.querySelectorAll('link[data-i18n-hreflang]').forEach(el => el.remove());

  const addTag = (hreflang: string, href: string) => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = hreflang;
    link.href = href;
    link.setAttribute('data-i18n-hreflang', hreflang);
    document.head.appendChild(link);
  };

  // Resolve the canonical to its language-neutral page path.
  let path = '/';
  if (canonicalUrl.startsWith(SITE_ORIGIN)) {
    path = splitLangPrefix(canonicalUrl.slice(SITE_ORIGIN.length) || '/').path;
  }
  const alternates = hreflangAlternates(path);
  if (alternates) {
    alternates.forEach(({ hreflang, href }) => addTag(hreflang, href));
  } else {
    addTag('x-default', canonicalUrl);
  }

  // Keep <html lang>/<html dir> honest — this genuinely helps screen readers
  // and tells Google which language the visible text is actually in.
  document.documentElement.lang = currentLang;
  const langObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang);
  if (langObj) document.documentElement.dir = langObj.dir;
};


const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType,
  articleDate,
  noindex,
  nofollow,
  keywords
}) => {
  const { i18n } = useTranslation();
  // The canonical is the language source of truth on localized pages: it is
  // built from the URL (via usePageLang), so og:locale, <html lang>/dir and
  // hreflang stay correct even before i18next finishes syncing. On
  // non-localized pages the client's chosen language keeps ruling.
  const currentLang = (() => {
    if (canonical.startsWith(SITE_ORIGIN)) {
      const { lang, path } = splitLangPrefix(canonical.slice(SITE_ORIGIN.length) || '/');
      if (isLocalizedPath(path)) return lang;
    }
    return i18n.language || 'en';
  })();

  useEffect(() => {
    // Set title
    document.title = title;

    // Set description
    setMeta('meta[name="description"]', 'content', description);

    // Set robots
    const robotsContent = noindex 
      ? (nofollow ? "noindex, nofollow" : "noindex, follow")
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
    setMeta('meta[name="robots"]', 'content', robotsContent);
    
    // Set canonical - ensure proper update
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.setAttribute('href', canonical);
    } else {
      const newCanonical = document.createElement('link');
      newCanonical.rel = 'canonical';
      newCanonical.href = canonical;
      document.head.appendChild(newCanonical);
    }

    // Set Open Graph tags
    if (ogTitle) setMeta('meta[property="og:title"]', 'content', ogTitle);
    if (ogDescription) setMeta('meta[property="og:description"]', 'content', ogDescription);
    if (ogImage) setMeta('meta[property="og:image"]', 'content', ogImage);
    if (ogType) setMeta('meta[property="og:type"]', 'content', ogType);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[property="og:locale"]', 'content', currentLang.replace('-', '_'));

    // Set Twitter tags
    if (ogTitle) setMeta('meta[name="twitter:title"]', 'content', ogTitle);
    if (ogDescription) setMeta('meta[name="twitter:description"]', 'content', ogDescription);
    if (ogImage) setMeta('meta[name="twitter:image"]', 'content', ogImage);
    setMeta('meta[name="twitter:url"]', 'content', canonical);

    // Set Article Date
    if (articleDate) {
      setMeta('meta[property="article:published_time"]', 'content', articleDate);
    }

    // Set Keywords
    if (keywords) {
      setMeta('meta[name="keywords"]', 'content', keywords);
    }

    // Inject hreflang alternate tags
    updateHreflangTags(canonical, currentLang);

  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogType, articleDate, noindex, nofollow, keywords, currentLang]);

  return null;
};

export default SEOHead;
