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
  '/screenshot-from-video',
  '/video-to-png',
  '/blog',
  '/blog/extract-frames-from-video-online',
  '/blog/mp4-to-image-sequence-guide',
  '/blog/video-to-png-frames-guide',
  '/ai-social-media-frame-picker',
  '/blog/ai-best-frame-from-video',
  '/about',

  '/privacy',
  '/terms',
  '/404',
];

const routeTextMap = {
  '/': 'Video to Image Sequence',
  '/extract-frames-from-video': 'Extract Frames from Video',
  '/images-to-video': 'Images to Video',
  '/mp4-to-jpg': 'MP4 to JPG',
  '/screenshot-from-video': 'Screenshot from Video',
  '/video-to-png': 'Video to PNG',
  '/blog': 'Blog',
  '/blog/extract-frames-from-video-online': 'Extract Frames from Video',
  '/blog/mp4-to-image-sequence-guide': 'MP4 to Image Sequence',
  '/blog/video-to-png-frames-guide': 'Video to PNG',
  '/ai-social-media-frame-picker': 'AI Social Media Frame Picker',
  '/blog/ai-best-frame-from-video': 'Best Frame',
  '/about': 'About',

  '/privacy': 'Privacy',
  '/terms': 'Terms',
  '/404': '404',
};

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
        // Serverless Vercel environment (Linux) - use @sparticuz/chromium-min
        const executablePath = await chromium.executablePath(
          'https://github.com/Sparticuz/chromium/releases/download/v148.0.0/chromium-v148.0.0-pack.x64.tar'
        );
        launchOptions = {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport || { width: 1280, height: 800 },
          executablePath,
          headless: chromium.headless,
        };
      }

      browser = await puppeteer.launch(launchOptions);

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (compatible; Prerenderer/1.0)');

      for (const route of routes) {
        console.log(`Prerendering: ${route}`);
        const url = `http://localhost:${PORT}${route}`;

        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
        
        const expectedText = routeTextMap[route];
        
        // Wait for React content before capturing
        await page.waitForFunction(
          (text) => {
            const h1 = document.querySelector('h1');
            const desc = document.querySelector('meta[name="description"]');
            const canonical = document.querySelector('link[rel="canonical"]');
            const title = document.title;
            const bodyText = document.body ? document.body.innerText : '';
            return !!h1 && !!desc && !!canonical && !!title && bodyText.includes(text);
          },
          { timeout: 15000 },
          expectedText
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
