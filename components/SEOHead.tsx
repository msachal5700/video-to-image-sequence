import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n/index';

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
 * This site translates in the client and serves every language from a single
 * URL. There are no per-language URLs, so there is nothing to point language
 * alternates *at*. Previously this emitted one `alternate` tag per supported
 * language with all eight hrefs identical, plus two more were hardcoded in
 * index.html and copied into every prerendered route — 20 tags per page, all
 * claiming the same URL. Google treats self-contradictory sets like that as
 * invalid and discards them, so they were pure crawl-budget waste.
 *
 * The only honest signal here is a self-referencing `x-default`: this URL is
 * the fallback for every locale. If per-language URLs are ever introduced
 * (e.g. /es/, /de/), restore the per-language loop and point each tag at its
 * real translated URL.
 */
const updateHreflangTags = (canonicalUrl: string, currentLang: string) => {
  // Drop anything a previous render injected, so language switches don't stack.
  document.querySelectorAll('link[data-i18n-hreflang]').forEach(el => el.remove());

  const xDefaultLink = document.createElement('link');
  xDefaultLink.rel = 'alternate';
  xDefaultLink.hreflang = 'x-default';
  xDefaultLink.href = canonicalUrl;
  xDefaultLink.setAttribute('data-i18n-hreflang', 'x-default');
  document.head.appendChild(xDefaultLink);

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
  const currentLang = i18n.language || 'en';

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
