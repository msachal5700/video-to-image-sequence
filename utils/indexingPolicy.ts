/**
 * Which pages are offered to search engines (and therefore to AdSense review).
 *
 * The policy itself lives in config/indexing-policy.json so the prerender
 * script (CommonJS) and the app (TypeScript) read the same list. See that
 * file for the reason behind every withheld page.
 */
import policy from '../config/indexing-policy.json';
import { NON_EN_LANGS, SITE_ORIGIN } from './localizedRoutes';

/** When false, every /es, /fr, … URL is served with noindex and no hreflang. */
export const PUBLISH_LOCALIZED_PAGES: boolean = policy.publishLocalizedPages === true;

const NOINDEX_PATHS: ReadonlySet<string> = new Set(policy.noindexPaths.map((p) => p.path));

/** Normalise a root-relative path: drop query/hash and any trailing slash. */
const normalisePath = (urlPath: string): string => {
  const bare = urlPath.split(/[?#]/)[0].replace(/\/+$/, '');
  return bare === '' ? '/' : bare;
};

/** True when a root-relative path (e.g. "/mp4-to-png", "/es/mp4-to-jpg") may be indexed. */
export function isIndexablePath(urlPath: string): boolean {
  const path = normalisePath(urlPath);
  const firstSegment = path.split('/')[1] ?? '';
  if ((NON_EN_LANGS as readonly string[]).includes(firstSegment)) {
    if (!PUBLISH_LOCALIZED_PAGES) return false;
    const rest = path.slice(firstSegment.length + 1) || '/';
    return !NOINDEX_PATHS.has(rest);
  }
  return !NOINDEX_PATHS.has(path);
}

/** Same check for an absolute URL on this site; off-site URLs are left alone. */
export function isIndexableUrl(url: string): boolean {
  if (!url.startsWith(SITE_ORIGIN)) return true;
  return isIndexablePath(url.slice(SITE_ORIGIN.length) || '/');
}
