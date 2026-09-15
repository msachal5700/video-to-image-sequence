const fs = require('fs');
const path = 'D:/VideoToImage/video-to-image-sequence/i18n/locales/en.json';
let content = fs.readFileSync(path, 'utf8');

// Replace corrupted emoji sequences with simple text
content = content
  .replace(/"icon": "\uD83D\\uDD12"/g, '"icon": "[Lock]"')
  .replace(/"icon": "\u26A1\\uFE0F"/g, '"icon": "[Lightning]"')
  .replace(/"icon": "\uD83C\\uDFAF"/g, '"icon": "[Target]"')
  .replace(/"icon": "\uD83D\\uDCE6"/g, '"icon": "[Box]"')
  .replace(/"icon": "\uD83C\\uDD93"/g, '"icon": "[Free]"')
  .replace(/"icon": "\uD83D\\uDEE0\\uFE0F"/g, '"icon": "[Tools]"')
  .replace(/"icon": "\\uD83D\\uDD12"/g, '"icon": "[Lock]"')
  .replace(/"icon": "\\u26A1\\uFE0F"/g, '"icon": "[Lightning]"')
  .replace(/"icon": "\\uD83C\\uDFAF"/g, '"icon": "[Target]"')
  .replace(/"icon": "\\uD83D\\uDCE6"/g, '"icon": "[Box]"')
  .replace(/"icon": "\\uD83C\\uDD93"/g, '"icon": "[Free]"')
  .replace(/"icon": "\\uD83D\\uDEE0\\uFE0F"/g, '"icon": "[Tools]"')
  // Fix any remaining corrupted sequences
  .replace(/\\uD83D\\uDD12/g, '"icon": "[Lock]"')
  .replace(/\\u26A1\\uFE0F/g, '"icon": "[Lightning]"')
  .replace(/\\uD83C\\uDFAF/g, '"icon": "[Target]"')
  .replace(/\\uD83D\\uDCE6/g, '"icon": "[Box]"')
  .replace(/\\uD83C\\uDD93/g, '"icon": "[Free]"')
  .replace(/\\uD83D\\uDEE0\\uFE0F/g, '"icon": "[Tools]"')
  .replace(/"icon": "\\\\uD83D\\\\uDD12"/g, '"icon": "[Lock]"')
  .replace(/"icon": "\\\\u26A1\\\\uFE0F"/g, '"icon": "[Lightning]"')
  .replace(/"icon": "\\\\uD83C\\\\uDFAF"/g, '"icon": "[Target]"')
  .replace(/"icon": "\\\\uD83D\\\\uDCE6"/g, '"icon": "[Box]"')
  .replace(/"icon": "\\\\uD83C\\\\uDD93"/g, '"icon": "[Free]"')
  .replace(/"icon": "\\\\uD83D\\\\uDEE0\\\\uFE0F"/g, '"icon": "[Tools]"');

// Also fix any remaining "????" in the content
content = content.replace(/Completely Free \?\?\?\? No Limits/g, 'Completely Free - No Limits');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed emoji encoding v2');