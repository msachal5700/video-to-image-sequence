const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const PORT = 3456;
const DIST_DIR = path.join(__dirname, '../dist');
const ORIGINAL_INDEX = path.join(DIST_DIR, 'index.html');
const TEMP_INDEX = path.join(DIST_DIR, 'index.temp.html');

// Copy original index.html to a temporary file before we start overwriting it
if (!fs.existsSync(ORIGINAL_INDEX)) {
  console.error(`Error: original build index.html not found at ${ORIGINAL_INDEX}`);
  process.exit(1);
}
fs.copyFileSync(ORIGINAL_INDEX, TEMP_INDEX);
console.log('Created temporary index.temp.html for pre-rendering...');

const server = http.createServer((req, res) => {
  // Decode URI to handle special characters in routing
  let filePath = path.join(DIST_DIR, decodeURIComponent(req.url));
  
  // If requesting a folder or route without a file extension, fallback to temp index
  if (!path.extname(filePath)) {
    filePath = TEMP_INDEX;
  }

  // Verify file existence
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
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
    };
    
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      res.writeHead(500);
      res.end('Server Error');
    });
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
  '/about-us',
  '/privacy-policy',
  '/terms-of-service',
  '/404'
];

async function runPrerender() {
  server.listen(PORT, async () => {
    console.log(`Temporary server running on http://localhost:${PORT}`);
    
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      for (const route of routes) {
        console.log(`Prerendering: ${route}`);
        const url = `http://localhost:${PORT}${route}`;
        
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        
        // Wait a short duration to let React Helmet / useEffect update the DOM
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
        console.log(`Saved pre-rendered HTML to ${targetFilePath}`);
      }
      
      console.log('Prerendering successfully finished.');
    } catch (err) {
      console.error('Prerendering failed:', err);
    } finally {
      if (browser) {
        await browser.close();
      }
      
      // Stop server and clean up temp files
      server.close(() => {
        if (fs.existsSync(TEMP_INDEX)) {
          fs.unlinkSync(TEMP_INDEX);
          console.log('Cleaned up temporary files.');
        }
        console.log('Server stopped.');
        process.exit(0);
      });
    }
  });
}

runPrerender();
