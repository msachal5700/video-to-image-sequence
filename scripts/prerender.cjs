const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium-min');

const PORT = 3456;
const DIST_DIR = path.join(__dirname, '../dist');
const ORIGINAL_INDEX = path.join(DIST_DIR, 'index.html');
const TEMP_INDEX = path.join(DIST_DIR, 'index.temp.html');

if (!fs.existsSync(ORIGINAL_INDEX)) {
  console.error(`Error: original build index.html not found at ${ORIGINAL_INDEX}`);
  process.exit(1);
}
fs.copyFileSync(ORIGINAL_INDEX, TEMP_INDEX);
console.log('Created temporary index.temp.html for pre-rendering...');

const server = http.createServer((req, res) => {
  let filePath = path.join(DIST_DIR, decodeURIComponent(req.url));
  if (!path.extname(filePath)) {
    filePath = TEMP_INDEX;
  }
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = TEMP_INDEX;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => { res.writeHead(500); res.end('Server Error'); });
    stream.pipe(res);
  });
});

const routes = [
  '/',
  '/extract-frames-from-video',
  '/images-to-video',
  '/mp4-to-jpg',
  '/mp4-to-png',
  '/video-to-webp',
  '/mov-to-jpg',
  '/mov-to-png',
  '/webm-to-jpg',
  '/webm-to-png',
  '/screenshot-from-video',
  '/extract-frame-at-timestamp',
  '/extract-frame-every-1-second',
  '/extract-frame-every-5-seconds',
  '/extract-frame-every-10-seconds',
  '/extract-frame-every-30-seconds',
  '/video-to-png',
  '/video-to-gif',
  '/image-crop',
  '/video-frames-for-ai-datasets',
  '/video-to-image-sequence-for-blender',
  '/video-frame-for-youtube-thumbnail',
  '/blog',
  '/blog/extract-frames-from-video-online',
  '/blog/mp4-to-image-sequence-guide',
  '/blog/video-to-png-frames-guide',
  '/ai-social-media-frame-picker',
  '/blog/ai-best-frame-from-video',
  '/blog/how-to-convert-images-to-video-guide',
  '/blog/ezgif-alternative-video-to-image-sequence',
  '/blog/video-frame-extractor-use-cases',
  '/blog/best-fps-settings-for-video-frame-extraction',
  '/blog/how-many-frames-per-second',
  '/blog/video-codecs-explained',
  '/blog/extract-video-frames-for-ai',
  '/blog/how-to-extract-frames-from-video',
  '/blog/video-to-image-sequence-explained',
  '/blog/jpg-vs-png-vs-webp-video-frames',
  '/blog/what-is-video-frame-rate',
  '/blog/free-image-crop-tool-guide',
  '/blog/video-to-stop-motion-frames',
  '/blog/product-video-to-product-photos-ecommerce',
  '/about',
  '/contact',
  '/media-partner',
  '/changelog',
  '/video-to-frames',
  '/video-contact-sheet',
  '/video-to-jpg',
  '/video-frame-extractor',
  '/video-to-photo',

  '/privacy',
  '/terms',
  '/404',
];

/**
 * Programmatic i18n: localized URL prefixes for every fully-translated page.
 * 7 pages × 7 non-English languages = 49 extra prerendered URLs
 * (e.g. /es/mp4-to-jpg), each validated against its translated H1 so a
 * half-rendered or English-fallback snapshot fails the build loudly.
 */
const NON_EN_LANGS = ['es', 'fr', 'de', 'pt', 'zh', 'ar', 'hi'];
const LOCALIZED_PAGES = [
  { path: '/', key: 'home' },
  { path: '/mp4-to-jpg', key: 'mp4ToJpg' },
  { path: '/extract-frames-from-video', key: 'extractFrames' },
  { path: '/video-to-png', key: 'videoToPng' },
  { path: '/screenshot-from-video', key: 'screenshotVideo' },
  { path: '/video-to-webp', key: 'videoToWebp' },
  { path: '/images-to-video', key: 'imagesToVideo' },
];

const routeTextMap = {
  '/': 'Video to Image Sequence',
  '/extract-frames-from-video': 'Extract Frames from Video',
  '/images-to-video': 'Images to Video',
  '/mp4-to-jpg': 'MP4 to JPG',
  '/mp4-to-png': 'MP4 to PNG',
  '/video-to-webp': 'Video to WebP',
  '/mov-to-jpg': 'MOV to JPG',
  '/mov-to-png': 'MOV to PNG',
  '/webm-to-jpg': 'WebM to JPG',
  '/webm-to-png': 'WebM to PNG',
  '/screenshot-from-video': 'Screenshot from Video',
  '/extract-frame-at-timestamp': 'Extract Frame at Exact Timestamp',
  '/extract-frame-every-1-second': 'Extract a Frame Every 1 Second',
  '/extract-frame-every-5-seconds': 'Extract a Frame Every 5 Seconds',
  '/extract-frame-every-10-seconds': 'Extract a Frame Every 10 Seconds',
  '/extract-frame-every-30-seconds': 'Extract a Frame Every 30 Seconds',
  '/video-to-png': 'Video to PNG',
  '/video-to-gif': 'Video to GIF',
  '/image-crop': 'Freeform Image Crop',
  '/video-frames-for-ai-datasets': 'Video Frames for AI Datasets',
  '/video-to-image-sequence-for-blender': 'Video to Image Sequence for Blender',
  '/video-frame-for-youtube-thumbnail': 'Extract Frame for YouTube Thumbnail',
  '/blog': 'Blog',
  '/blog/extract-frames-from-video-online': 'Extract Frames from Video',
  '/blog/mp4-to-image-sequence-guide': 'MP4 to Image Sequence',
  '/blog/video-to-png-frames-guide': 'Video to PNG',
  '/ai-social-media-frame-picker': 'AI Social Media Frame Picker',
  '/blog/ai-best-frame-from-video': 'Best Frame',
  '/blog/how-to-convert-images-to-video-guide': 'Convert Images',
  '/blog/ezgif-alternative-video-to-image-sequence': 'Ezgif vs VideoToImageSequence',
  '/blog/video-frame-extractor-use-cases': 'Use Cases',
  '/blog/best-fps-settings-for-video-frame-extraction': 'FPS Settings',
  '/blog/how-many-frames-per-second': 'How Many FPS',
  '/blog/video-codecs-explained': 'Video Codecs',
  '/blog/extract-video-frames-for-ai': 'Frames for AI',
  '/blog/how-to-extract-frames-from-video': 'How to Extract Frames',
  '/blog/video-to-image-sequence-explained': 'Image Sequence Explained',
  '/blog/jpg-vs-png-vs-webp-video-frames': 'JPG vs PNG vs WebP',
  '/blog/what-is-video-frame-rate': 'Video Frame Rate',
  '/blog/free-image-crop-tool-guide': 'Freeform Image Crop',
  '/blog/video-to-stop-motion-frames': 'Stop-Motion Reference Frames',
  '/blog/product-video-to-product-photos-ecommerce': 'Product Photos from Video',
  '/about': 'About',
  '/contact': 'Contact',
  '/media-partner': 'Media Partners',
  '/changelog': 'Changelog',
  '/video-to-frames': 'Video to Frames Converter',
  '/video-contact-sheet': 'Video Contact Sheet Maker',
  '/video-to-jpg': 'Video to JPG Converter',
  '/video-frame-extractor': 'Video Frame Extractor',
  '/video-to-photo': 'Video to Photo Converter',

  '/privacy': 'Privacy',
  '/terms': 'Terms',
  '/404': '404',
};

// Expand routes + expected-text map with the localized URLs. Expected text
// comes straight from the locale files (translated H1), so the prerender
// waits for the real translated render — not an English fallback.
const _localeCache = {};
function _localeH1(lang, key) {
  if (!_localeCache[lang]) {
    _localeCache[lang] = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../i18n/locales', lang + '.json'), 'utf8')
    );
  }
  const page = _localeCache[lang][key] || {};
  return page.h1 || page.title || '';
}
for (const lang of NON_EN_LANGS) {
  for (const { path: p, key } of LOCALIZED_PAGES) {
    const route = p === '/' ? `/${lang}` : `/${lang}${p}`;
    routes.push(route);
    routeTextMap[route] = _localeH1(lang, key);
  }
}

/**
 * Strip third-party ad DOM injected at runtime from the Puppeteer snapshot.
 * We want clean semantic HTML for Google without removing legitimate content.
 */
function cleanHtml(html) {
  // Remove preferencenail.com tracker script injected by Adsterra Social Bar
  html = html.replace(/<script[^>]*preferencenail\.com[^>]*><\/script>/gi, '');
  // Remove Adsterra Social Bar iframe injected at bottom of body
  html = html.replace(/<iframe[^>]*container-bd398f279d1f8fec04c333ece472ce02[^>]*>[\s\S]*?<\/iframe>/gi, '');
  // Empty the Adsterra native banner container divs (keep the outer div for layout)
  html = html.replace(
    /(<div id="container-999c8cf3f03558a8b1b5b28a2f0a1248">)[\s\S]*?(<\/div>)/g,
    '$1$2'
  );
  // Remove injected Adsterra <style> blocks for ad containers
  html = html.replace(/<style>#container-999c8cf3f03558a8b1b5b28a2f0a1248[\s\S]*?<\/style>/g, '');
  // Remove the scroll lock baked in by the consent gate: the prerender runs
  // with no stored consent, so the gate is visible and its lock effect leaves
  // style="overflow: hidden;" on <html> and <body> before the snapshot is
  // taken. Left in place, every visitor (fresh or returning) would load an
  // unscrollable page, and the gate's own unlock could not clear it.
  html = html.replace(/<(html|body)([^>]*?)\sstyle="overflow:\s*hidden;?"/gi, '<$1$2');
  return html;
}

async function runPrerender() {
  server.listen(PORT, async () => {
    console.log(`Temporary server running on http://localhost:${PORT}`);
    let browser;
    let exitCode = 0;
    try {
      let launchOptions = {};
      
      if (process.platform === 'win32' || process.platform === 'darwin') {
        // Local Windows/macOS - use standard Google Chrome
        const winChromePaths = [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
        ];
        let localPath = null;
        for (const p of winChromePaths) {
          if (fs.existsSync(p)) {
            localPath = p;
            break;
          }
        }
        if (!localPath && process.platform === 'darwin') {
          localPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        }
        
        launchOptions = {
          executablePath: localPath || undefined,
          headless: true,
          defaultViewport: { width: 1280, height: 800 },
        };
      } else {
        // Serverless Vercel environment (Linux) - use @sparticuz/chromium-min.
        // Local override: set PRERENDER_CHROME_PATH to skip the /tmp download
        // (useful when /tmp is a small tmpfs). PRERENDER_CHROME_LIB_PATH
        // optionally prepends to LD_LIBRARY_PATH for bundled libs.
        let executablePath;
        let headless = chromium.headless;
        let args = chromium.args;
        if (process.env.PRERENDER_CHROME_PATH) {
          executablePath = process.env.PRERENDER_CHROME_PATH;
          if (process.env.PRERENDER_CHROME_LIB_PATH) {
            process.env.LD_LIBRARY_PATH = process.env.PRERENDER_CHROME_LIB_PATH +
              (process.env.LD_LIBRARY_PATH ? ':' + process.env.LD_LIBRARY_PATH : '');
          }
          // The sparticuz arg list embeds a quoted --headless='shell' that a
          // stock Chromium build chokes on; drop it and let puppeteer drive
          // headless mode itself.
          args = args.filter((a) => !a.startsWith('--headless'));
          headless = true;
        } else {
          executablePath = await chromium.executablePath(
            'https://github.com/Sparticuz/chromium/releases/download/v148.0.0/chromium-v148.0.0-pack.x64.tar'
          );
        }
        launchOptions = {
          args,
          defaultViewport: chromium.defaultViewport || { width: 1280, height: 800 },
          executablePath,
          headless,
        };
      }

      browser = await puppeteer.launch(launchOptions);

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (compatible; Prerenderer/1.0)');

      for (const route of routes) {
        console.log(`Prerendering: ${route}`);
        const url = `http://localhost:${PORT}${route}`;

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        const expectedText = routeTextMap[route];
        
        // Wait for React content before capturing
        const isBlogRoute = route.startsWith('/blog/');
        const skipBodyCheck = route === '/blog/how-to-extract-frames-from-video';
        await page.waitForFunction(
          (text, skipBody) => {
            const h1 = document.querySelector('h1');
            const desc = document.querySelector('meta[name="description"]');
            const canonical = document.querySelector('link[rel="canonical"]');
            const title = document.title;
            if (!h1 || !desc || !canonical || !title) return false;
            if (skipBody) return true;
            const bodyText = document.body ? document.body.innerText : '';
            return bodyText.includes(text);
          },
          { timeout: isBlogRoute ? 60000 : 15000 },
          expectedText,
          skipBodyCheck
        );

        let html = await page.content();

        // Strip third-party ad DOM from snapshot (keeps semantic content clean for Google)
        html = cleanHtml(html);

        // Route validation:
        if (!html.includes('<title>')) {
          throw new Error(`Validation failed for route ${route}: HTML is missing <title> tag.`);
        }
        if (!html.includes('name="description"')) {
          throw new Error(`Validation failed for route ${route}: HTML is missing meta description tag.`);
        }
        if (!html.includes('rel="canonical"')) {
          throw new Error(`Validation failed for route ${route}: HTML is missing canonical link.`);
        }
        if (!html.includes('<h1')) {
          throw new Error(`Validation failed for route ${route}: HTML is missing <h1> element.`);
        }
        if (!html.includes(expectedText)) {
          throw new Error(`Validation failed for route ${route}: HTML is missing expected text "${expectedText}".`);
        }

        let targetFilePath;
        if (route === '/') {
          targetFilePath = ORIGINAL_INDEX;
        } else if (route === '/404') {
          targetFilePath = path.join(DIST_DIR, '404.html');
        } else {
          const targetDir = path.join(DIST_DIR, route);
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }
          targetFilePath = path.join(targetDir, 'index.html');
        }

        fs.writeFileSync(targetFilePath, html);
        console.log(`Saved: ${targetFilePath}`);
      }

      console.log('Prerendering complete.');
    } catch (err) {
      console.error('Prerendering failed:', err);
      exitCode = 1;
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch (e) {
          console.error('Error closing browser:', e);
        }
      }
      server.close(() => {
        if (fs.existsSync(TEMP_INDEX)) {
          fs.unlinkSync(TEMP_INDEX);
          console.log('Cleaned up temp files.');
        }
        console.log(`Server stopped. Exiting with code ${exitCode}`);
        process.exit(exitCode);
      });
    }
  });
}

runPrerender();
