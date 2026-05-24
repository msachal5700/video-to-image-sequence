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
  '/about',
  '/privacy',
  '/terms',
  '/404',
];

async function runPrerender() {
  server.listen(PORT, async () => {
    console.log(`Temporary server running on http://localhost:${PORT}`);
    let browser;
    try {
      const executablePath = await chromium.executablePath(
        'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
      );

      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath,
        headless: true,
        defaultViewport: { width: 1280, height: 800 },
      });

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (compatible; Prerenderer/1.0)');

      for (const route of routes) {
        console.log(`Prerendering: ${route}`);
        const url = `http://localhost:${PORT}${route}`;

        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 1500));

        const html = await page.content();

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
      process.exit(1);
    } finally {
      if (browser) await browser.close();
      server.close(() => {
        if (fs.existsSync(TEMP_INDEX)) {
          fs.unlinkSync(TEMP_INDEX);
          console.log('Cleaned up temp files.');
        }
        console.log('Server stopped.');
        process.exit(0);
      });
    }
  });
}

runPrerender();
