/**
 * Programmatic i18n routing — localized URL prefixes with full hreflang.
 *
 * English lives at the root (e.g. /mp4-to-jpg). Every other supported
 * language gets a real, prerendered URL prefix (e.g. /es/mp4-to-jpg),
 * mirroring the system used by top-ranking competitors in this niche.
 *
 * Only pages whose locale files carry complete translations
 * (title, description, h1, hero, howTo, faq) are localized. Pages with
 * English-only content stay English-only — a half-translated page is a
 * thin-content liability, not an asset.
 */

export const SITE_ORIGIN = 'https://www.videotoimagesequence.online';

export const NON_EN_LANGS = ['es', 'fr', 'de', 'pt', 'zh', 'ar', 'hi'] as const;
export type NonEnLang = (typeof NON_EN_LANGS)[number];

export const ALL_LANGS = ['en', ...NON_EN_LANGS] as const;
export type SiteLang = (typeof ALL_LANGS)[number];

export function isNonEnLang(code: string | undefined): code is NonEnLang {
  return (NON_EN_LANGS as readonly string[]).includes(code ?? '');
}

/** Root-relative page paths that ship a fully translated version. */
export const LOCALIZED_PAGE_PATHS = [
  '/',
  '/mp4-to-jpg',
  '/extract-frames-from-video',
  '/video-to-png',
  '/screenshot-from-video',
  '/video-to-webp',
  '/images-to-video',
] as const;

export function isLocalizedPath(path: string): boolean {
  return (LOCALIZED_PAGE_PATHS as readonly string[]).includes(path);
}

/** Absolute URL for a page in a given language. */
export function localizedUrl(path: string, lang: string): string {
  const clean = path === '/' ? '' : path;
  return isNonEnLang(lang) ? `${SITE_ORIGIN}/${lang}${clean}` : `${SITE_ORIGIN}${clean || '/'}`;
}

/** Root-relative path for a page in a given language (for <Link> targets). */
export function localizedPath(path: string, lang: string): string {
  const clean = path === '/' ? '' : path;
  return isNonEnLang(lang) ? `/${lang}${clean}` : clean || '/';
}

export interface HreflangAlternate {
  hreflang: string;
  href: string;
}

/**
 * Full hreflang set for a localized page: one entry per language plus
 * x-default pointing at the English (root) URL. Returns null for pages
 * that are not localized, so callers fall back to the x-default-only tag.
 */
export function hreflangAlternates(path: string): HreflangAlternate[] | null {
  if (!isLocalizedPath(path)) return null;
  const alternates: HreflangAlternate[] = ALL_LANGS.map((lang) => ({
    hreflang: lang,
    href: localizedUrl(path, lang),
  }));
  alternates.push({ hreflang: 'x-default', href: localizedUrl(path, 'en') });
  return alternates;
}

/**
 * Strip a language prefix from a root-relative URL path.
 * Returns { lang, path } — lang defaults to 'en' when no prefix is present.
 */
export function splitLangPrefix(urlPath: string): { lang: SiteLang; path: string } {
  const match = urlPath.match(/^\/([a-z]{2})(\/.*)?$/);
  if (match && isNonEnLang(match[1]) && (match[2] === undefined || isLocalizedPath(match[2]))) {
    return { lang: match[1], path: match[2] || '/' };
  }
  return { lang: 'en', path: urlPath };
}
