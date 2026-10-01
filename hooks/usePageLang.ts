import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n/index';
import { splitLangPrefix, isLocalizedPath } from '../utils/localizedRoutes';

/**
 * `usePageLang` — the URL is the single source of truth for page language.
 *
 * On localized pages (the 7 fully translated page groups, at root or under
 * a /:lang prefix) the language comes from the URL path:
 *   /es/mp4-to-jpg  -> 'es'
 *   /mp4-to-jpg     -> 'en'
 * and i18next is synced to match, so client-side navigation can never leave
 * a translated page rendering the wrong language with the wrong canonical —
 * e.g. clicking the logo from /es/mp4-to-jpg used to show the English root
 * URL with Spanish text and a Spanish canonical until something else
 * happened to call changeLanguage.
 *
 * On non-localized pages (blog, legal, English-only tools) the client's
 * chosen language keeps ruling, preserving the existing in-place swap.
 *
 * Returns the effective language for the current page — use it anywhere a
 * page needs a language that must agree with its URL (canonical, hreflang).
 */
export function usePageLang(): string {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();

  const { lang, path } = splitLangPrefix(pathname);
  const localized = isLocalizedPath(path);

  useEffect(() => {
    if (!localized) return;
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang;
    const meta = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    if (meta) document.documentElement.dir = meta.dir;
  }, [localized, lang, i18n]);

  return localized ? lang : i18n.language;
}
