const fs = require('fs');
const path = 'D:/VideoToImage/video-to-image-sequence/i18n/locales/en.json';
let content = fs.readFileSync(path, 'utf8');

// Parse to find the issues
try {
  JSON.parse(content);
  console.log('Valid JSON!');
} catch (e) {
  console.log('Invalid JSON:', e.message);
}

// Find all icon fields and fix them
let fixed = 0;
content = content.replace(/"icon": "\uD83C�"/g, () => { fixed++; return '"icon": "[Free]"'; });
content = content.replace(/"icon": "\uD83D�"/g, () => { fixed++; return '"icon": "[Lock]"'; });
content = content.replace(/"icon": "\u26A1�"/g, () => { fixed++; return '"icon": "[Lightning]"'; });
content = content.replace(/"icon": "\uD83C�"/g, () => { fixed++; return '"icon": "[Target]"'; });
content = content.replace(/"icon": "\uD83D�"/g, () => { fixed++; return '"icon": "[Box]"'; });
content = content.replace(/"icon": "\uD83D�️"/g, () => { fixed++; return '"icon": "[Tools]"'; });

// Also handle the escaped versions
content = content.replace(/"icon": "\\uD83C\\uDD93"/g, '"icon": "[Free]"');
content = content.replace(/"icon": "\\uD83D\\uDD12"/g, '"icon": "[Lock]"');
content = content.replace(/"icon": "\\u26A1\\uFE0F"/g, '"icon": "[Lightning]"');
content = content.replace(/"icon": "\\uD83C\\uDFAF"/g, '"icon": "[Target]"');
content = content.replace(/"icon": "\\uD83D\\uDCE6"/g, '"icon": "[Box]"');
content = content.replace(/"icon": "\\uD83D\\uDEE0\\uFE0F"/g, '"icon": "[Tools]"');

// Fix the corrupted "Completely Free ??? No Limits"
content = content.replace(/Completely Free \?\?\?\? No Limits/g, 'Completely Free - No Limits');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed', fixed, 'icon fields');

// Validate
try {
  JSON.parse(content);
  console.log('Valid JSON!');
} catch (e) {
  console.log('Still invalid:', e.message);
  // Show error location
  const errPos = e.message.match(/position (\d+)/);
  if (errPos) {
    const pos = parseInt(errPos[1]);
    console.log('Context:', content.slice(pos-50, pos+100));
  }
}