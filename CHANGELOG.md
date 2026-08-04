# Changelog

Running record of every change made to **videotoimagesequence.online** by the AI assistant, so you always know what was touched, when, why, and how to undo it.

Format: newest entries at the top. Each entry lists the files changed, the reason, and a revert note.

---

## 2026-08-04 — New feature: AI Social Media Frame Picker

Additive feature. No existing route, component or util was modified in a way that
changes current behaviour — the frame extractor, converters and blog are untouched.

**New route:** `/ai-social-media-frame-picker`
**New article:** `/blog/ai-best-frame-from-video`

What it does: analyses an uploaded video entirely in the browser, extracts
keyframes around detected scene changes, scores each on measurable image-quality
criteria, removes near-duplicates, and surfaces the best frame for ten platform
profiles (YouTube, Instagram post and story, LinkedIn, Pinterest, X, TikTok,
WhatsApp, wallpaper, plus best overall).

| Area | Files |
| --- | --- |
| Scoring engine | `ai/types.ts`, `ai/imageMetrics.ts`, `ai/scoreEngine.ts`, `ai/frameAnalyzer.ts`, `ai/duplicateFilter.ts`, `ai/platformProfiles.ts` |
| Face detection | `models/faceDetector.ts` |
| Worker | `workers/frameScorer.worker.ts` |
| Services | `services/keyframeExtractor.ts`, `services/framePickerPipeline.ts`, `services/frameExportService.ts` |
| State | `hooks/useFramePicker.ts` |
| UI | `components/framePicker/` (6 components) |
| Pages | `pages/AiSocialMediaFramePicker.tsx`, `pages/blog/AiBestFrameFromVideo.tsx` |
| Docs | `docs/ai-frame-picker.md` |

**Files modified (all additive):**

| File | Change |
| --- | --- |
| `App.tsx` | Two new lazy routes. |
| `components/Header.tsx` | Tool link added to desktop dropdown and mobile menu. |
| `pages/BlogIndex.tsx` | New post entry. Also derived the `ItemList` JSON-LD from the `posts` array — it was hardcoded, so every new post previously required editing the same data twice and the count was already drifting. |
| `scripts/prerender.cjs` | Added both routes to `routes` and `routeTextMap`. Without this the pages ship as an empty shell to crawlers. |
| `public/sitemap.xml` | Both URLs added. |
| `public/llms.txt` | Tool listed for AI crawler citation. |
| `package.json` | Added `@types/react` and `@types/react-dom` as devDependencies — they were absent, so TypeScript had no JSX types at all. |

**Design decisions worth knowing:**

- Scoring runs in a Web Worker at reduced resolution; downloads re-decode from
  the original video at full resolution, so previews are never what you receive.
- Black frames are disqualified rather than down-weighted. Laplacian-variance
  sharpness rates them highly, which is how naive tools recommend a fade-out.
- Face detection uses the native `FaceDetector` API where present and falls back
  to skin-tone heuristics elsewhere; the active mode is shown in the UI. No
  TensorFlow.js or OpenCV.js bundle was added — the metrics are implemented
  directly, keeping the added JS at roughly 6 kB rather than several megabytes.
- Smile detection was specified but is **not implemented**; the native API does
  not expose expression data and a dedicated model was not worth the download.
  Documented in `docs/ai-frame-picker.md`.

**Verified:** `npm run build` passes, all 16 routes prerender and clear the
existing validation gates including both new pages.

**To revert:** delete `ai/`, `models/`, `hooks/`, `services/framePicker*`,
`services/keyframeExtractor.ts`, `services/frameExportService.ts`,
`workers/frameScorer.worker.ts`, `components/framePicker/`, the two new pages and
`docs/ai-frame-picker.md`; then remove the added lines from the six modified
files listed above. Nothing else depends on this feature.

---

## 2026-08-03 — SEO fixes driven by Search Console data


First pass using the real GSC export (2026-05-05 → 2026-08-02: 4,050 clicks,
111,208 impressions, 3.64% CTR, pos 8.71). Full reasoning and figures for each
change are in `docs/seo-log.md`.

| File | Change | Why |
| --- | --- | --- |
| `index.html` | Removed the two static `<link rel="alternate" hreflang>` tags. | They pointed at the homepage, and the prerender step copies this `<head>` into all 14 routes — so every page claimed to be the language alternate of `/`. |
| `components/SEOHead.tsx` | `updateHreflangTags` now emits a single self-referencing `x-default` instead of one tag per supported language. | Combined with the above, pages were shipping **20 hreflang tags all pointing at the same URL**. i18n is client-side with no per-language URLs, so per-language tags claimed something untrue. `<html lang>`/`dir` handling is unchanged. |
| `public/sitemap.xml` | Removed `/privacy` and `/terms`; refreshed every `lastmod` from `2026-05-24` to `2026-08-03`; re-prioritised by measured demand. | Both removed pages serve `noindex, nofollow`, so listing them was contradictory. Identical stale dates gave Google no recrawl signal. |
| `i18n/locales/en.json` | Rewrote `home.title` / `home.description` and `mp4ToJpg.title` / `mp4ToJpg.description`. | CTR-driven. `/mp4-to-jpg` was converting at 0.85% on 6,483 impressions; the homepage at 1.58% on the `video to image` / `video to frames` queries. Titles now match the vocabulary searchers actually use. Visible page copy is untouched. |
| `public/robots.txt` | Added explicit `Allow` for 11 AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.). | AI-SEO — several of these do not infer permission from `User-agent: *`. |
| `public/llms.txt` | New file. | Answer-first factual summary for LLMs and AI Overviews to cite. |
| `scratch/audit-live.cjs` | New dev script. | Fetches every route as Googlebot and reports canonical, robots, title, description, h1, hreflang count, JSON-LD and word count. Re-run after any deploy to confirm what Google sees. Not part of the build. |

**Verified:** `npm run build` passes, all 14 routes prerender and clear the existing
validation gates. Post-build check on `dist/` confirms 1 hreflang tag per page with
the correct per-route href, plus both new titles.

**Not changed, needs your action:** the apex domain serves a **307 temporary**
redirect, not the `308` that `vercel.json` requests — likely a domain-level redirect
in the Vercel dashboard overriding it. That is why Google still indexes the apex
(442 clicks at 7.03% CTR on a second hostname). Fix is in the Vercel dashboard.

**Revert:** `git checkout 0255acb -- index.html components/SEOHead.tsx public/sitemap.xml public/robots.txt i18n/locales/en.json` then delete `public/llms.txt` and `scratch/audit-live.cjs`. No behavioural code was touched, only metadata and copy.

---


## Baseline — as received

**Cloned:** 2026-08-03
**Source:** https://github.com/msachal5700/video-to-image-sequence
**Branch:** `main`
**Commit:** `0255acbfa2a5ad30e73628623770d52f8b40de76`
**Commit date:** 2026-07-09 12:58:40 +0500
**Commit message:** `feat: complete multi-language i18n support on Homepage, subpages, dropzone, and controls`

This is the "before" reference point. Anything not listed in the change entries below is untouched from this commit.

### Stack
| Area | Tech |
| --- | --- |
| Framework | React 19 + Vite 6, TypeScript 5.8 |
| Routing | react-router-dom 6 (client-side SPA) |
| Styling | Tailwind CSS 3 + PostCSS |
| i18n | i18next / react-i18next + browser language detector |
| Video processing | Canvas API, MediaElement, Web Workers, mp4box |
| Packaging | jszip (ZIP download of frames) |
| Icons | lucide-react |
| Hosting | Vercel (`vercel.json`) |
| Prerender | `scripts/prerender.cjs` — puppeteer-core + @sparticuz/chromium-min, runs after `vite build` |

Build pipeline: `npm run build` = `vite build && node scripts/prerender.cjs`. The prerender step snapshots each route to static HTML so crawlers get server-rendered markup from an otherwise client-side SPA. It also strips injected Adsterra ad DOM from the snapshots and hard-fails the build if a route is missing `<title>`, meta description, canonical, `<h1>`, or expected body text.

### Routes (prerendered + in sitemap)
`/` · `/extract-frames-from-video` · `/images-to-video` · `/mp4-to-jpg` · `/screenshot-from-video` · `/video-to-png` · `/blog` · `/blog/extract-frames-from-video-online` · `/blog/mp4-to-image-sequence-guide` · `/blog/video-to-png-frames-guide` · `/about` · `/privacy` · `/terms` · `/404`

### SEO setup as-received
- **Canonical host:** `https://www.videotoimagesequence.online` (Vercel 308-redirects the apex to `www`)
- **`components/SEOHead.tsx`** — per-page title, description, robots, canonical, OG, Twitter, keywords, and hreflang injection. All languages point at the same URL, canonical stays English.
- **`index.html`** — static fallback meta: title, description, keywords, OG, Twitter, theme-color, favicons, manifest, DNS prefetch/preconnect. **No canonical tag** and **no Search Console verification tag** at this point.
- **Structured data** — JSON-LD injected per page (e.g. `WebApplication` + FAQ schema on Home).
- **`public/robots.txt`** — allows all, disallows `/generate-og.html`, `/dist/`, `/migrated_prompt_history/`, declares the sitemap.
- **`public/sitemap.xml`** — 13 URLs, all `lastmod` 2026-05-24.
- **Analytics** — Google Analytics 4 (`gtag.js`, `G-889T8GYP8M`) hardcoded in `index.html`.
- **Ads** — Adsterra Social Bar script in `index.html`; AdSense block present but commented out.
- **Security headers** — set in `vercel.json`: HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, plus a **report-only** CSP.

### Known gaps noted at baseline
These are observations, not yet changes. Nothing here has been altered.
1. No `<link rel="canonical">` in `index.html` — pages rely on `SEOHead` injecting it at runtime. The prerender step captures it, so built output is fine, but there's no static fallback.
2. No Google Search Console verification token in the codebase.
3. `sitemap.xml` `lastmod` dates (2026-05-24) predate the latest commit (2026-07-09) and are all identical.
4. Sitemap has no `<xhtml:link>` hreflang entries despite the site being multilingual.
5. CSP is `Content-Security-Policy-Report-Only`, so it isn't actually enforced.
6. `.gitignore` covered `.env.local` but not `.env`.
7. `scratch/` and `dummy.mp4` are committed to the repo and ship in version control.

---

## Changes

### 2026-08-03 — Live Google Search Console connection (MCP server)

**8. Built a Google Search Console MCP server so the assistant can read GSC data directly**
- Files: none in this repo. The server lives outside the project at
  `C:\Users\ADMN\Documents\Cline\MCP\google-search-console\` so no Google credentials
  ever enter version control.
- Also edited: the Cline MCP settings file, to register the server.
- Node.js server talking to the Search Console API over OAuth2 (Desktop-app client,
  scope `webmasters` only). Exposes 12 tools: `list_sites`, `search_analytics`,
  `top_queries`, `top_pages`, `ctr_opportunities`, `striking_distance`,
  `page_queries`, `compare_periods`, `inspect_url`, `list_sitemaps`,
  `submit_sitemap`, `seo_audit`.
- **Why this over CSV exports:** removes the manual export step entirely, and lets
  changes be measured against the numbers automatically via `compare_periods`.
- `credentials.json` / `tokens.json` are gitignored inside the server folder and stay
  on this machine. Access is revocable at https://myaccount.google.com/permissions.
- *Revert:* delete the `google-search-console` entry from `cline_mcp_settings.json`,
  and delete the server folder.

### 2026-08-03 — Project setup, change tracking

**1. Cloned the repository into the working folder**

- Cloned `main` @ `0255acb` into `d:\SEO Material\VideoToImageSeqProject` via a temp directory, then moved all contents (including `.git`) to the root.
- The folder is now a live git working copy — `git log`, `git diff`, and `git push` all work.
- *Revert:* delete the folder contents and re-clone.

**2. Removed empty `.env` files**
- Files: `.env` (deleted), `.env.local.backup` (deleted)
- Both were 0 bytes. The pre-existing `.env` was empty and the repo ships no `.env`, so the backup held nothing. No credentials were lost.
- *Revert:* `New-Item .env` — recreates an empty file.

**3. Added `.env` to `.gitignore`**
- File: `.gitignore`
- Added `.env` and `.env.*.local` alongside the existing `.env.local`. Prevents a future `.env` with real keys from being committed by accident.
- *Revert:* remove those two lines.

**4. Created this changelog**
- File: `CHANGELOG.md` (new)
- Captures the baseline commit, stack inventory, SEO setup, and known gaps, plus a running log of all changes going forward.
- *Revert:* delete the file.

**5. Created the SEO / Search Console work log**
- File: `docs/seo-log.md` (new)
- Separate log tying each SEO edit to the Search Console data that prompted it, so impact can be measured after the fact.
- *Revert:* delete the file.

**6. Google Search Console verification method decided — GA4, no code change**
- Files: none (documentation only, in `docs/seo-log.md`)
- Chose to verify via the existing GA4 tag (`G-889T8GYP8M`) already in `index.html`, so no verification token or file was added to the repo.
- **Consequence for future work:** the `gtag.js` snippet in `index.html` (lines 5–13) is now load-bearing for Search Console ownership. Removing it, or switching GA to Google Tag Manager, will un-verify the property. Flagged here so it doesn't get "cleaned up" later by accident.
- Verification must use a **URL-prefix** property at `https://www.videotoimagesequence.online/` — GA4 verification doesn't support Domain properties.
- *Revert:* n/a, nothing changed in code.

**7. Verified the build works at baseline**
- Ran `npm install` (167 packages) and `npm run build` successfully.
- All 14 routes prerendered to static HTML, `dist/404.html` generated, temp files cleaned up.
- Confirmed every prerendered page carries both the GA4 tag (`G-889T8GYP8M`) and `rel="canonical"` — so the GA4-based Search Console verification will hold across the whole site, and the canonical gap noted in the baseline only affects the raw source `index.html`, not the deployed output.
- *Revert:* n/a, no source changes. `dist/` is gitignored.

---

## How to use this file

- Every future change gets an entry under **Changes**, newest first, with files touched, reason, and revert note.
- The **Baseline** section never changes — it's the fixed reference for what the project looked like on arrival.
- SEO edits driven by Search Console data get a short entry here and the full detail (queries, impressions, CTR, position, before/after copy) in `docs/seo-log.md`.
- To see the raw diff against the original: `git diff 0255acb`
