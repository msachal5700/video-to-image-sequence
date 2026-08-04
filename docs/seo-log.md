# SEO & Google Search Console Log

Companion to `CHANGELOG.md`. This file records SEO work driven by Google Search Console data, so every content and metadata edit is traceable back to the numbers that motivated it, and its impact can be measured afterwards.

Site: **https://www.videotoimagesequence.online**
Canonical host: `www`. ⚠️ `vercel.json` declares `"permanent": true`, but the apex
actually serves a **307 temporary** redirect (verified by `curl` 2026-08-03), so
Google keeps the apex indexed. See the 2026-08-03 change entry.


---

## Search Console connection status

| Item | Status | Notes |
| --- | --- | --- |
| Verification method | ✅ **Google Analytics (GA4)** | Chosen 2026-08-03. Uses the existing `gtag.js` snippet — **no code change required** |
| Verification token in repo | ❌ none needed | GA4 method verifies via the analytics tag already in `index.html` |
| Property type | URL-prefix | GA4 verification only supports URL-prefix properties, not Domain properties |
| Property URL to add | `https://www.videotoimagesequence.online/` | Must be the `www` version — the apex 308-redirects and would not verify cleanly |
| `robots.txt` | ✅ present | `public/robots.txt`, declares sitemap |
| `sitemap.xml` | ✅ present | `public/sitemap.xml`, 13 URLs |
| Sitemap submitted to GSC | ❓ unconfirmed | Can now be submitted directly via the `submit_sitemap` tool |
| Analytics | ✅ GA4 `G-889T8GYP8M` | Hardcoded in `index.html`; can be linked to GSC inside the GA4 UI |
| API access for the assistant | ⏳ **built, awaiting sign-in** | GSC MCP server installed — see "Direct API access" below |


### Chosen method: Google Analytics (GA4)

Decided 2026-08-03. The site already loads GA4 (`G-889T8GYP8M`) from `index.html`, and Search Console can verify ownership through that existing tag. **No repository changes are needed for verification.**

#### Requirements for this to work
- You must be signed into Google with an account that has the **Edit** permission (or higher) on the GA4 property `G-889T8GYP8M`.
- The `gtag.js` snippet must stay in the `<head>` of `index.html`. It is currently the first thing in `<head>` (lines 5–13). **Do not remove or defer it** — removing it can un-verify the property later.
- The snippet must be the analytics.js/gtag.js tag itself. Verification does **not** work if GA is loaded via Google Tag Manager instead.

#### Steps to verify
1. Go to https://search.google.com/search-console and click **Add property**.
2. Choose **URL prefix** (not Domain — GA4 verification does not support Domain properties).
3. Enter `https://www.videotoimagesequence.online/` — use the `www` form, since the apex 308-redirects to it.
4. Expand **Google Analytics** under "Other verification methods".
5. Click **Verify**.
6. Once verified, go to **Sitemaps** and submit `sitemap.xml`.

#### After verifying
- Submit the sitemap: `https://www.videotoimagesequence.online/sitemap.xml`
- Optionally also add `https://videotoimagesequence.online/` (apex) as a second property so you can see if anything is still being indexed on the non-`www` host.
- Link GSC to GA4 (GA4 → Admin → Product links → Search Console links) to surface search queries inside GA4.
- Data takes ~48 hours to start appearing, and the Performance report backfills up to 16 months once verified.

#### Fallback options, if GA4 verification fails
1. **HTML meta tag** — add `<meta name="google-site-verification" content="TOKEN">` to `<head>` in `index.html`. The prerender step copies the built head into every route, so one insertion covers the whole site.
2. **HTML file upload** — drop `google<TOKEN>.html` into `public/`. Vite copies `public/` to the build root, so it is served at `/google<TOKEN>.html`.
3. **DNS TXT record** — set at the registrar or in Vercel DNS. This is the only method that enables a Domain property, which covers `www` + apex + http/https in one.

Send me the token and I will wire up option 1 or 2 in a few minutes.

---

## Direct API access (added 2026-08-03)

Search Console is now wired to the assistant through a local MCP server, so search
data can be read on demand instead of being exported by hand.

**Location:** `C:\Users\ADMN\Documents\Cline\MCP\google-search-console\`
Deliberately outside this repository — Google credentials must never be committed.

**Auth:** OAuth2 Desktop-app client, scope `https://www.googleapis.com/auth/webmasters`
(Search Console only — no access to Gmail, Drive, or anything else on the account).
`credentials.json` and `tokens.json` stay on this machine and are gitignored.
Revoke any time at https://myaccount.google.com/permissions.

### Remaining setup step (yours, one time, ~5 min)
Full instructions are in the server's `README.md`. Summary:
1. Create a Google Cloud project, enable the **Search Console API**.
2. Configure the OAuth consent screen (External), add your Google account as a test
   user — or **Publish** the app so the refresh token doesn't expire every 7 days.
3. Create an **OAuth client ID → Desktop app**, download the JSON, save it as
   `credentials.json` in the server folder.
4. Run `npm run auth` in that folder and approve the browser prompt.
5. Run `npm run check` — it should list the property.

### Tools available once connected
| Tool | Purpose |
| --- | --- |
| `list_sites` | Confirm which properties are reachable and at what permission level |
| `search_analytics` | Arbitrary performance query by query/page/country/device/date |
| `top_queries` / `top_pages` | What the site ranks for, and which pages earn the clicks |
| `ctr_opportunities` | High impressions + low CTR → rewrite title/meta (signal #1 below) |
| `striking_distance` | Positions 5–20 → cheapest route to page one (signal #2 below) |
| `page_queries` | Every query for one URL — read this before rewriting any page |
| `compare_periods` | Measures whether a change actually worked (signal for re-checks) |
| `inspect_url` | Index status, Google's chosen canonical, rich results, crawl date |
| `list_sitemaps` / `submit_sitemap` | Sitemap health, and nudging a recrawl after edits |
| `seo_audit` | Everything above in one call — the standard starting point |

### How this changes the workflow
- **No CSV exports needed.** The "What to send" section below is now a fallback only.
- Every change entry can cite exact figures pulled at the time of the edit.
- The `Measure after` step becomes a `compare_periods` call rather than a manual diff.
- `submit_sitemap` lets a recrawl be requested right after publishing changes.

---

## Baseline metadata (before any GSC-driven edits)


Recorded 2026-08-03 from commit `0255acb`, so later rewrites can be compared against the original.


### Static fallback in `index.html`
- **Title:** `Video to Image Sequence Online — Free Frame Extractor`
- **Description:** `Free browser-based video frame extractor. Convert MP4, MOV, and WEBM videos to JPG or PNG sequences. No server upload required.`
- **Keywords:** video to image sequence, extract frames from video online free, MP4 to JPG frames, video frame extractor, convert video to PNG sequence, video to image no upload

Per-page titles and descriptions come from `components/SEOHead.tsx`, fed by the i18n translation files in `i18n/locales/`. **Copy edits for SEO usually belong in the locale files, not in the page components.**

### Indexable routes
Baseline as of commit `0255acb`. Priorities were changed on 2026-08-03 — see the
change entry for the current values and the reasoning.

| Route | Sitemap priority | changefreq |
| --- | --- | --- |
| `/` | 1.0 | weekly |
| `/extract-frames-from-video` | 0.9 | monthly |
| `/mp4-to-jpg` | 0.9 | monthly |
| `/video-to-png` | 0.9 | monthly |
| `/screenshot-from-video` | 0.9 | monthly |
| `/images-to-video` | 0.9 | monthly |
| `/blog` | 0.8 | weekly |
| `/blog/extract-frames-from-video-online` | 0.7 | monthly |
| `/blog/mp4-to-image-sequence-guide` | 0.7 | monthly |
| `/blog/video-to-png-frames-guide` | 0.7 | monthly |
| `/about` | 0.5 | yearly |
| `/privacy` | 0.5 | yearly | ← removed from sitemap 2026-08-03 (`noindex`) |
| `/terms` | 0.5 | yearly | ← removed from sitemap 2026-08-03 (`noindex`) |

### Performance baseline

| Period | Clicks | Impressions | CTR | Avg position |
| --- | --- | --- | --- | --- |
| 2026-05-05 → 2026-08-02 | 4,050 | 111,208 | 3.64% | 8.71 |

Reference period for every later comparison. Trend within it: impressions ~8x while
CTR fell ~6.9% → ~2.4% and position drifted 6.2 → 9.3.

Per-page, same period:

| Page | Clicks | Impressions | CTR | Position |
| --- | --- | --- | --- | --- |
| `www/` | 3,561 | 97,408 | 3.66% | 7.86 |
| apex `/` | 442 | 6,288 | 7.03% | 10.14 |
| `/mp4-to-jpg` | 55 | 6,483 | 0.85% | 15.62 |
| `/video-to-png` | 3 | 220 | 1.36% | 29.39 |
| `/images-to-video` | 0 | 358 | 0.00% | 5.95 |
| `/extract-frames-from-video` | — | — | — | not indexed |
| `/screenshot-from-video` | — | — | — | not indexed |


---

## What to send, and how

Any of these work — CSV export is the most useful.

**Performance report** (Search results → Export → CSV/Excel). The export contains `Queries`, `Pages`, `Countries`, `Devices`, and `Dates` tabs. Set the date range to the last 3 months and enable the Average CTR and Average position columns.

Most actionable signals, in priority order:
1. **High impressions + low CTR** → title/description rewrite opportunity
2. **Position 5–20** → on-page optimisation can realistically move these onto page one
3. **Queries with no matching page** → new page or new section opportunity
4. **Pages with impressions but zero clicks** → snippet is not compelling or intent is mismatched

**Indexing / Pages report** — anything under "Why pages aren't indexed" (crawled but not indexed, discovered but not indexed, redirect issues, canonical conflicts).

**Enhancements** — Core Web Vitals and any structured data errors, since the site ships JSON-LD.

Screenshots are fine too, just make the numbers legible.

---

## Change entries

Each entry follows this shape so impact stays measurable:

```
### YYYY-MM-DD — short title
**GSC data period:** ...
**Signal:** query / page, impressions, clicks, CTR, position
**Hypothesis:** why the change should help
**Change:** files touched, before → after
**Measure after:** date to re-check (usually 4 weeks)
**Result:** filled in on re-check
```

### 2026-08-03 — first GSC-driven pass: hreflang, sitemap hygiene, CTR retargeting

**GSC data period:** 2026-05-05 → 2026-08-02 (manual CSV export, all six reports)

**Baseline measured.** 4,050 clicks / 111,208 impressions / 3.64% CTR / pos 8.71.
Across the window impressions grew roughly 8x (335/day in May to ~2,600/day in
August) while CTR fell from ~6.9% to ~2.4% and average position drifted 6.2 → 9.3.
Ranking for more, converting less.

**Live crawl audit.** Added `scratch/audit-live.cjs`: fetches every route with a
Googlebot user-agent and reports canonical, robots, title, description, h1,
hreflang count, JSON-LD types and visible word count. Re-runnable after any deploy.

#### Two corrections to my own initial read, both caught by the live audit

1. I first concluded the sitemap was missing `/extract-frames-from-video` and
   `/screenshot-from-video`. It was not — all 13 routes were present. Those pages
   have zero impressions because they are **not indexed**, a different problem with
   a different fix. Recorded because the wrong diagnosis would have shipped a no-op.
2. The audit initially reported every page sharing one `<h1>`. Regex artifact: it
   matched the `<h1>` inside the `<noscript>` block in `index.html`, which precedes
   the React root. Per-page h1s are correct.

#### Changes made

| # | Change | Evidence |
|---|--------|----------|
| 1 | Removed 2 static `hreflang` links from `index.html`; rewrote `updateHreflangTags` in `SEOHead.tsx` to emit a single self-referencing `x-default`. | Live audit showed **20 hreflang tags on every page, all pointing at the same URL**. Prerender copies `index.html`'s `<head>` into all 14 routes, so the hardcoded homepage hrefs claimed every page was the language alternate of `/`. i18n is client-side with no per-language URLs, so per-language tags were never meaningful. Verified post-build: 1 tag, correct per-route href. |
| 2 | Dropped `/privacy` and `/terms` from `sitemap.xml`. | Both serve `noindex, nofollow` yet were listed — a contradictory signal feeding "Excluded by noindex tag". |
| 3 | Refreshed all `lastmod` from stale `2026-05-24` → `2026-08-03`; re-prioritised by measured demand. | Every URL claimed the same untouched date, so the sitemap carried no recrawl signal. |
| 4 | Homepage title → `Video to Image Converter — Extract Frames from Video Free`; description now leads with free / no upload / no signup / no watermark. | The homepage absorbs the generic high-volume queries and converts them badly: `video to image` 6,027 impr @ **1.58%**, `video to frames` 4,814 @ **1.58%**, `video to frame converter` 2,815 @ 2.34%, `video to image converter` 2,241 @ 2.28%, `video to jpg` 1,326 @ 0.75%. The old title led with "Image Sequence", not the phrasing these searchers used. |
| 5 | `/mp4-to-jpg` title → `MP4 to Frames — Convert MP4 to JPG Image Sequence Free`; description rewritten around numbered sequences + ZIP. | Worst page on the site: 6,483 impressions, 55 clicks, **0.85% CTR**, pos 15.6. Demand is sequence-shaped — `mp4 to frames` 2,539 impr, `mp4 to image sequence` 1,453 @ pos 3.98, `mp4 to png sequence` 1,407 @ pos 5.31 — while `mp4 to jpg` itself is only 864 impr and ranks worst at pos 13.5. "MP4 to JPG" also reads as single-image conversion, promising something the tool does not do. |
| 6 | Added explicit `Allow` rules for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot. | AI-SEO. Several do not infer permission from `User-agent: *`. |
| 7 | Added `public/llms.txt`. | Answer-first, quotable facts (formats, limits, JPG vs PNG, privacy model) in the shape LLMs and AI Overviews cite. |

#### Verified

`npm run build` passes; all 14 routes prerender and clear the existing title /
description / canonical / h1 validation gates. Confirmed in `dist/`: one hreflang
tag per page with the correct per-route href, and both new titles present.

#### Confirmed but not yet fixed

- **Apex returns `307`, not `308`.** `curl` on `https://videotoimagesequence.online/`
  shows a *temporary* redirect to www, while `vercel.json` declares
  `"permanent": true` — something upstream, most likely a domain-level redirect in
  the Vercel dashboard, takes precedence. This is why Google still indexes the apex:
  442 clicks / 6,288 impressions at **7.03% CTR**, roughly 2x the www CTR, splitting
  authority across two hostnames. Needs a dashboard change, not a code change.
- **Thin pages:** `/about` 233 words, `/terms` 278, `/blog` 293 — likely the
  "Discovered – currently not indexed (8 pages)" cohort.
- **Coverage ceiling:** 4 indexed vs 13 not indexed. Caps everything else.
- **`/images-to-video`:** 358 impressions, **0 clicks**, pos 5.95 — ranks, converts nothing.
- **Untargeted cluster:** `video to frames` + variants + `mp4 to frames` ≈ 13,000
  impressions with no dedicated page, all diluted onto the homepage. A
  `/video-to-frames` page is the largest remaining opportunity.

#### Not verifiable here

No competitor SERP audit was performed. Competitor signal does leak through the
site's own data (`ezgif mp4 to jpg`, `ezgif video to jpg`, `flixier video to photo
converter`), but I did not inspect competitor pages, so no claims are made about them.

**Measure after:** 2026-08-31 — compare CTR on `/` and `/mp4-to-jpg` once Google has
recrawled. Titles and descriptions are suggestions; Google may rewrite them.

**Result:** _pending_


