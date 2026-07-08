const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

function findChrome() {
  const winChromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
  ];
  for (const p of winChromePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

async function runTest() {
  const chromePath = findChrome();
  if (!chromePath) {
    console.error('Error: Google Chrome not found.');
    process.exit(1);
  }

  console.log('Using Chrome binary at:', chromePath);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Log browser console messages
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  // Log browser page errors
  page.on('pageerror', err => {
    console.error('[BROWSER PAGE ERROR]', err);
  });

  try {
    console.log('Navigating to local dev server...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
    console.log('Page loaded successfully.');

    // Find the input element (file dropzone)
    const fileInputSelector = 'input[type="file"]';
    await page.waitForSelector(fileInputSelector);
    const fileInput = await page.$(fileInputSelector);

    const testVideoPath = path.resolve(__dirname, '../dummy.mp4');
    console.log(`Uploading test video: ${testVideoPath}`);
    await fileInput.uploadFile(testVideoPath);

    // Wait for the controls to appear (App state becomes IDLE with videoMetadata loaded)
    console.log('Waiting for controls and video metadata to load...');
    await page.waitForSelector('button', { timeout: 5000 });

    // Look for the "Extract Frames" button
    const buttons = await page.$$('button');
    let extractButton = null;
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text.includes('Extract Frames') || text.includes('Extract Now') || text.includes('Extract')) {
        extractButton = button;
        break;
      }
    }

    if (!extractButton) {
      throw new Error('Could not find Extract Frames button.');
    }

    console.log('Clicking Extract Frames button (should show Interstitial)...');
    await extractButton.click();

    // Wait 6 seconds for the "Skip Ad" button to enable
    console.log('Waiting 6 seconds for Interstitial timer...');
    await new Promise(resolve => setTimeout(resolve, 6000));

    // Find and click the "Skip Ad" button
    const skipButtons = await page.$$('button');
    let skipButton = null;
    for (const b of skipButtons) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text.includes('Skip Ad')) {
        skipButton = b;
        break;
      }
    }

    if (!skipButton) {
      throw new Error('Could not find Skip Ad button.');
    }

    console.log('Clicking Skip Ad button (should start extraction)...');
    await skipButton.click();

    // Poll the status every 500ms for 8 seconds
    console.log('Polling extraction status...');
    for (let i = 0; i < 16; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const statusText = await page.evaluate(() => {
        const h3 = document.querySelector('h3');
        const progressP = document.querySelector('p');
        const bodyText = document.body ? document.body.innerText : '';
        
        let progressVal = 'none';
        // Look for the text Processed X / Y
        const matches = bodyText.match(/Processed \d+ \/ \d+/i);
        if (matches) {
          progressVal = matches[0];
        }

        return {
          h3: h3 ? h3.textContent : 'none',
          progress: progressVal,
          isProcessingVisible: bodyText.includes('Extracting Frames') || bodyText.includes('Processing Complete') || bodyText.includes('Failed'),
          bodySnippet: bodyText.substring(0, 300).replace(/\n/g, ' ')
        };
      });

      console.log(`Poll ${i+1}: H3="${statusText.h3}" | Progress="${statusText.progress}" | Visible=${statusText.isProcessingVisible} | Body="${statusText.bodySnippet}"`);
    }

    console.log('Test completed.');
  } catch (error) {
    console.error('Test execution failed:', error);
  } finally {
    await browser.close();
  }
}

runTest();
