import React, { useEffect } from 'react';

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
  nofollow
}) => {
  useEffect(() => {
    // Set title
    document.title = title;

    // Set description and robots
    let robotsContent = 'index, follow';
    if (noindex) {
      robotsContent = nofollow ? 'noindex, nofollow' : 'noindex, follow';
    }
    setMeta('meta[name="robots"]', 'content', robotsContent);
    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex, nofollow' : 'index, follow');
    
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

    // Set Twitter tags
    if (ogTitle) setMeta('meta[name="twitter:title"]', 'content', ogTitle);
    if (ogDescription) setMeta('meta[name="twitter:description"]', 'content', ogDescription);
    if (ogImage) setMeta('meta[name="twitter:image"]', 'content', ogImage);
    setMeta('meta[name="twitter:url"]', 'content', canonical);

    // Set Article Date
    if (articleDate) {
      setMeta('meta[property="article:published_time"]', 'content', articleDate);
    }
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogType, articleDate, noindex, nofollow]);

  return null;
};

export default SEOHead;
