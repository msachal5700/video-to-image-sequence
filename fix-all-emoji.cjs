const fs = require('fs');
const path = 'D:/VideoToImage/video-to-image-sequence/i18n/locales/en.json';
let content = fs.readFileSync(path, 'utf8');

// Replace bullet points with simple text
content = content.replace(/•/g, ' | ');

// Also replace any remaining special chars
content = content.replace(/✅/g, '[OK]')
  .replace(/❌/g, '[NO]')
  .replace(/⚠️/g, '[WARN]')
  .replace(/✨/g, '[NEW]')
  .replace(/🎯/g, '[TARGET]')
  .replace(/🎨/g, '[ART]')
  .replace(/🎮/g, '[GAME]')
  .replace(/📺/g, '[TV]')
  .replace(/📚/g, '[BOOK]')
  .replace(/🎞️/g, '[FILM]')
  .replace(/🤖/g, '[BOT]')
  .replace(/📦/g, '[BOX]')
  .replace(/🔒/g, '[LOCK]')
  .replace(/⚡/g, '[BOLT]')
  .replace(/📦/g, '[BOX]')
  .replace(/🆓/g, '[FREE]')
  .replace(/🛠️/g, '[TOOLS]')
  .replace(/🌐/g, '[WEB]')
  .replace(/📊/g, '[CHART]')
  .replace(/💡/g, '[IDEA]')
  .replace(/🚀/g, '[ROCKET]')
  .replace(/🔧/g, '[TOOL]')
  .replace(/📝/g, '[NOTE]')
  .replace(/📋/g, '[CLIP]')
  .replace(/📁/g, '[FOLDER]')
  .replace(/💾/g, '[SAVE]')
  .replace(/⏱️/g, '[TIMER]')
  .replace(/🎚️/g, '[FADER]')
  .replace(/🎛️/g, '[KNOB]')
  .replace(/🔬/g, '[MICRO]')
  .replace(/🧪/g, '[TEST]')
  .replace(/🧠/g, '[BRAIN]')
  .replace(/💻/g, '[PC]')
  .replace(/🖥️/g, '[MONITOR]')
  .replace(/📱/g, '[PHONE]')
  .replace(/🔍/g, '[SEARCH]')
  .replace(/🔎/g, '[SEARCH2]')
  .replace(/💡/g, '[IDEA]')
  .replace(/🔦/g, '[FLASH]')
  .replace(/🕯️/g, '[CANDLE]')
  .replace(/🪔/g, '[LAMP]')
  .replace(/🧿/g, '[EYE]')
  .replace(/🪬/g, '[HAMSA]')
  .replace(/🧿/g, '[EYE]')
  .replace(/📷/g, '[CAMERA]')
  .replace(/📸/g, '[CAMERA2]')
  .replace(/📹/g, '[VIDEO]')
  .replace(/📼/g, '[TAPE]')
  .replace(/🔍/g, '[SEARCH]')
  .replace(/🔎/g, '[SEARCH2]')
  .replace(/💡/g, '[IDEA]')
  .replace(/🔦/g, '[FLASH]')
  .replace(/🕯️/g, '[CANDLE]')
  .replace(/🪔/g, '[LAMP]')
  .replace(/🧿/g, '[EYE]')
  .replace(/🪬/g, '[HAMSA]')
  .replace(/🧿/g, '[EYE]')
  .replace(/📷/g, '[CAMERA]')
  .replace(/📸/g, '[CAMERA2]')
  .replace(/📹/g, '[VIDEO]')
  .replace(/📼/g, '[TAPE]')
  .replace(/🔍/g, '[SEARCH]')
  .replace(/🔎/g, '[SEARCH2]')
  .replace(/💡/g, '[IDEA]')
  .replace(/🔦/g, '[FLASH]')
  .replace(/🕯️/g, '[CANDLE]')
  .replace(/🪔/g, '[LAMP]')
  .replace(/🧿/g, '[EYE]')
  .replace(/🪬/g, '[HAMSA]')
  .replace(/🧿/g, '[EYE]');

fs.writeFileSync(path, content, 'utf8');
console.log('Replaced all emojis and special chars');

// Validate
try {
  JSON.parse(content);
  console.log('Valid JSON!');
} catch (e) {
  console.log('Invalid:', e.message);
}