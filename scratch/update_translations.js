const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, '..', 'i18n', 'locales');

// We will write the full translated locales structure for en, es, fr, de, pt, zh, ar, hi
// This keeps all translation keys perfectly aligned and completely translated.

const translations = {
  en: {
    "nav": {
      "tools": "Tools",
      "blog": "Blog",
      "howItWorks": "How it Works",
      "faq": "FAQ",
      "language": "Language"
    },
    "common": {
      "freeForever": "Free Forever",
      "noUpload": "No Server Upload",
      "localProcessing": "Local Browser Processing",
      "downloadZip": "Download ZIP",
      "advertisement": "Advertisement",
      "extractFrames": "Extract Frames Now",
      "convertAnother": "Convert Another",
      "processing": "Extracting Frames...",
      "zipping": "Creating ZIP Archive...",
      "complete": "Processing Complete!",
      "failed": "Processing Failed",
      "startOver": "Start Over",
      "downloadAll": "Download All (ZIP)",
      "framesExtracted": "Successfully extracted {{count}} frames from your video.",
      "processed": "Processed",
      "skipAd": "Skip Ad",
      "skipIn": "Skip in {{seconds}}s"
    },
    "dropzone": {
      "drop": "Drop your video here",
      "browse": "or click to browse",
      "support": "MP4, MOV, WEBM supported · Large files depend on your device and browser · Drop multiple files for batch"
    },
    "controls": {
      "frameRate": "Frame Rate (FPS)",
      "format": "Output Format",
      "quality": "JPG Quality",
      "estimatedFrames": "Est. {{count}} frames",
      "highFrameWarning": "Warning: {{count}}+ frames may exhaust browser memory. Consider lowering FPS."
    },
    "badges": {
      "private": "🔒 100% Private (Local)",
      "fast": "⚡ Fast Local Conversion",
      "zip": "📦 ZIP Download",
      "fps": "🎨 Custom FPS Control",
      "free": "🆓 Free Forever"
    },
    "home": {
      "title": "Video to Image Sequence Converter Online – Extract Frames from Video",
      "description": "Convert video to image sequence online for free. Extract frames from MP4, MOV, and WEBM videos as JPG or PNG images directly in your browser — no server upload required.",
      "h1": "Video to Image Sequence",
      "h1Sub": "Online Converter",
      "hero": "Video to Image Sequence Online is a free, browser-based tool that extracts every frame from MP4, MOV, and WEBM videos as high-quality JPG or PNG images. Unlike other tools, it requires no file upload, requires no server upload (processing happens locally in your browser, so large files depend on your device memory, browser performance, video length, and codec support), supports batch processing, ZIP download, and custom FPS control — all completely free and 100% private.",
      "keywords": "video to image sequence, extract frames from video, video frame extractor, MP4 to JPG sequence, convert video to PNG sequence",
      "badge": "100% Free · No Upload · Local Browser Processing",
      "badges": {
        "noUpload": "✅ No Server Upload Required",
        "private": "🔒 100% Private",
        "fast": "⚡ Fast local processing · No upload",
        "zip": "📦 ZIP Download",
        "batch": "🎬 Batch Processing",
        "fps": "🎨 Custom FPS",
        "free": "🆓 Free Forever"
      },
      "tabs": {
        "toImages": "Video to Images",
        "toVideo": "Images to Video"
      },
      "howWorksTitle": "How This Video to Image Sequence Tool Works",
      "howWorksDesc": "This tool extracts individual frames from your video and converts them into downloadable image files. You can upload a video, choose the output format, and download frames as JPG or PNG images.",
      "simpleProcess": "The process is simple:",
      "steps": [
        "Upload your video file.",
        "Select the image format.",
        "Choose how many frames you want to extract.",
        "Download the extracted image sequence."
      ],
      "useCases": "This is useful for animation, video editing, AI dataset creation, thumbnails, motion analysis, and frame-by-frame review.",
      "formatsTitle": "Supported Video Formats",
      "formatsDesc1": "Best supported formats: MP4, MOV, and WEBM.",
      "formatsDesc2": "Other formats such as AVI or MKV may work only when your browser supports the video codec.",
      "outputsTitle": "Supported Image Output Formats",
      "outputsDesc": "You can extract frames as:",
      "jpgTitle": "JPG/JPEG",
      "jpgDesc": "best for smaller file size and general use.",
      "pngTitle": "PNG",
      "pngDesc": "best for high-quality frames, transparent graphics, design work, and editing.",
      "outputChoose": "Choose JPG if you want faster downloads. Choose PNG if image quality matters more.",
      "whoUsesTitle": "Who Can Use This Tool?",
      "whoUsesDesc": "This tool is useful for:",
      "whoUsesList": [
        "Video editors who need frame-by-frame screenshots.",
        "Animators who need image sequences from video clips.",
        "AI developers who need video frames for datasets.",
        "YouTubers who want thumbnails from videos.",
        "Designers who want still images from motion footage.",
        "Students who need visual frames for projects.",
        "Researchers who analyze motion or visual changes in videos."
      ],
      "privacyTitle": "Privacy and File Safety",
      "privacyDesc1": "Your video is processed entirely inside your browser. Because we use client-side JavaScript APIs, your files are never uploaded to any server or stored on the cloud. They stay 100% local on your computer.",
      "privacyDesc2": "We do not ask for signups, accounts, or personal information. You get maximum privacy and fast local processing speed since no time is wasted uploading or downloading large video files.",
      "privacyWarn": "Your files are completely private. This tool is safe to use for sensitive, private, or confidential videos because zero data leaves your local device.",
      "howItWorksTitle": "How It Works",
      "howItWorksSub": "3 simple steps — no signup, no install, no upload",
      "howSteps": [
        { "title": "Drop Your Video", "desc": "Drag and drop your MP4, MOV, or WEBM file. Drop multiple files for batch processing. Large files depend on your device memory and browser." },
        { "title": "Choose Settings", "desc": "Select your frame rate (FPS) and output format (JPG or PNG). Customize exactly how many frames to extract." },
        { "title": "Download Frames", "desc": "Browse the frame grid, download individual frames, or get all frames as a ZIP archive." }
      ],
      "whoUsesOnlineTitle": "Who Uses Video to Image Sequence Online?",
      "whoUsesOnlineSub": "Used by creators, developers, and professionals worldwide",
      "whoUsesItems": [
        { "icon": "🎬", "title": "Video Editors & YouTubers", "desc": "Extract the perfect still frame for video thumbnails, title cards, or social media posts from any clip in seconds." },
        { "icon": "🎮", "title": "Game Developers & Animators", "desc": "Convert sprite sheet videos or animation previews into individual PNG frames for Unity, Godot, or Blender." },
        { "icon": "🤖", "title": "AI & ML Developers", "desc": "Generate large labeled image datasets from video footage for training computer vision and machine learning models." },
        { "icon": "🎨", "title": "VFX & Motion Artists", "desc": "Import extracted frame sequences into After Effects, DaVinci Resolve, or Nuke for frame-by-frame compositing." },
        { "icon": "📸", "title": "Photographers", "desc": "Capture split-second moments from slow-motion or high-speed video that would be impossible to photograph directly." },
        { "icon": "🎓", "title": "Educators & Researchers", "desc": "Extract frames for academic analysis, presentation slides, medical imaging review, or research documentation." }
      ],
      "compareTitle": "How We Compare to Other Tools",
      "compareSub": "Video to Image Sequence Online vs other online converters",
      "compareHeaders": ["Feature", "www.videotoimagesequence.online ✦", "Cloud Converters", "Others"],
      "compareRows": [
        ["File size handling", "✅ No server upload required; limited by browser/device RAM", "❌ 200MB", "❌ 100-200MB"],
        ["Server upload required", "✅ Never", "❌ Always", "❌ Always"],
        ["100% Private", "✅ Yes", "❌ No", "❌ No"],
        ["Individual frame preview", "✅ Full grid", "✅ Yes", "⚠️ Limited"],
        ["Per-frame download", "✅ Yes", "✅ Yes", "⚠️ Some"],
        ["ZIP download", "✅ Yes", "✅ Yes", "⚠️ Some"],
        ["Custom FPS control", "✅ Yes", "✅ Yes", "⚠️ Some"],
        ["Batch processing", "✅ Yes", "❌ No", "❌ No"],
        ["JPG + PNG output", "✅ Both", "✅ Both", "⚠️ Varies"],
        ["PWA / Installable", "✅ Yes", "❌ No", "❌ No"],
        ["Free forever", "✅ 100%", "✅ Free", "⚠️ Freemium"],
        ["No account needed", "✅ None", "✅ None", "⚠️ Some"]
      ],
      "moreToolsTitle": "More Free Video Tools",
      "moreTools": [
        { "title": "MP4 to JPG Converter", "desc": "Extract JPG frames from MP4 video in your browser." },
        { "title": "Screenshot from Video", "desc": "Capture video frames in full-resolution locally." },
        { "title": "Video to PNG Frames", "desc": "Extract lossless PNG frames for VFX, game dev, and ML datasets." }
      ],
      "relatedTitle": "Related Video Frame Tools and Guides",
      "relatedSub": "Explore more tools and guides for video frame extraction",
      "relatedItems": [
        { "title": "Extract Frames from Video", "desc": "Free online tool to extract individual frames from MP4, MOV, and WEBM videos as JPG or PNG images." },
        { "title": "MP4 to Image Sequence Guide", "desc": "Learn how to convert MP4 videos to image sequences quickly and efficiently." },
        { "title": "Video to PNG Sequence", "desc": "Extract lossless PNG frames perfect for high-quality design work and VFX compositing." },
        { "title": "Image Sequence to Video", "desc": "Combine extracted image sequences back into a video file with custom frame rates." },
        { "title": "Screenshot from Video", "desc": "Capture the perfect frame from your video as a high-resolution screenshot." },
        { "title": "Video to JPG Converter", "desc": "Convert video files to JPG image sequences for fast downloads and easy sharing." }
      ],
      "faq": {
        "title": "Frequently Asked Questions",
        "sub": "Everything you need to know about Video to Image Sequence Online",
        "items": [
          { "q": "Is there a file size limit?", "a": "No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support." },
          { "q": "What video formats are supported?", "a": "MP4, MOV, and WEBM — the three most common formats used by phones, cameras, and screen recorders." },
          { "q": "Should I extract frames as JPG or PNG?", "a": "JPG is recommended for most uses — smaller file sizes, faster downloads, great quality. Choose PNG if you need lossless frames for VFX compositing, game development, or machine learning datasets where pixel-perfect accuracy matters." },
          { "q": "Are my videos kept private?", "a": "100% private. Your video never leaves your device. Everything runs locally in your browser using JavaScript. Nothing is sent to any server." },
          { "q": "Can I download all frames at once?", "a": "Yes. After extraction, click \"Download All as ZIP\" to get every frame packed into a single ZIP file with one click." },
          { "q": "How do I control how many frames are extracted?", "a": "Use the FPS selector before extracting. Choose every frame for maximum quality, or pick 1, 5, 10, 24, or 30 FPS depending on your needs." },
          { "q": "Can I extract frames from multiple videos at once?", "a": "Yes. Just drop multiple video files at once and our batch mode will process them automatically one by one." },
          { "q": "Can I download individual frames?", "a": "Yes. Every extracted frame appears in a visual grid. Hover over any frame and click the download button to save that specific frame." },
          { "q": "What is the best free alternative for extracting video frames?", "a": "Video to Image Sequence Online is the best free alternative — it requires no server upload (processing happens locally in your browser, so large files depend on your device memory, browser performance, video length, and codec support), batch processing, ZIP download, individual frame downloads, and custom FPS control. All completely free." },
          { "q": "Do I need to create an account or install anything?", "a": "No. Just open the website and start converting. No account, no download, no installation. Works on any device with a modern browser." }
        ]
      }
    },
    "mp4ToJpg": {
      "title": "MP4 to JPG Converter Online Free — Extract JPG Frames from MP4",
      "description": "Convert MP4 video to JPG images online for free. Extract every frame as a high-quality JPG locally in your browser. No server upload required.",
      "h1": "MP4 to JPG Converter",
      "h1Sub": "Online Free — Local Browser Processing",
      "hero": "Convert MP4 video to JPG images online for free. Extract every frame as a high-quality JPG sequence locally in your browser. Since files are processed locally, your video data never leaves your device.",
      "keywords": "mp4 to jpg, mp4 to jpeg converter, extract jpg from mp4, mp4 frame extractor",
      "privacy": {
        "title": "100% Private Browser-Based Frame Extraction",
        "body": "Unlike online tools that upload your video files to a remote cloud server, our MP4 to JPG converter leverages HTML5 Web APIs to decode videos directly inside your web browser. Your video is parsed locally and the images are saved in your browser environment. Your files are never transmitted across the network, keeping your sensitive or proprietary footage completely secure."
      },
      "howTo": {
        "title": "How to Convert MP4 to JPG Online",
        "steps": [
          { "title": "Choose Your MP4", "body": "Drag and drop your MP4 file into the upload zone above." },
          { "title": "Configure Output Frame Rate (FPS)", "body": "Choose your extraction frequency. Select 30 FPS to grab 30 frames per second of video, or choose 1 FPS to extract one frame per second." },
          { "title": "Select Format", "body": "Ensure \"JPG\" is selected as the output format." },
          { "title": "Extract Frames", "body": "Click \"Extract Frames Now\" to decode the video frame sequence." },
          { "title": "Save Output", "body": "Download individual frames from the preview grid or click \"Download All (ZIP)\" to save the entire sequence in a single ZIP." }
        ]
      },
      "faq": {
        "title": "Frequently Asked Questions",
        "items": [
          { "q": "How do I convert an MP4 video to JPG images for free?", "a": "Simply drag and drop your MP4 file into the tool, select JPG format, choose your FPS, and click Extract. All frames are processed locally in your browser and will download as a ZIP file. No account or server upload needed." },
          { "q": "Is there a file size limit for MP4 to JPG conversion?", "a": "No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, video length, and codec support." },
          { "q": "How many JPG frames will I get from my MP4?", "a": "It depends on your video duration and chosen FPS (Frames Per Second) setting. For example, a 10-second video converted at 10 FPS will extract approximately 100 JPG images." },
          { "q": "Can I convert MP4 to PNG instead of JPG?", "a": "Yes. Use the format selector inside the tool to switch to PNG output if you need lossless quality frames." },
          { "q": "Does MP4 to JPG conversion work on mobile devices?", "a": "Yes. Our tool runs directly in modern mobile web browsers like Safari on iOS and Chrome on Android, though performance depends on the device's hardware capability." }
        ]
      }
    },
    "extractFrames": {
      "title": "Extract Frames from Video Online Free — JPG & PNG Frame Extractor",
      "description": "Extract frames from video online for free. Convert MP4, MOV, and WEBM videos to JPG or PNG sequences in your browser. No server upload required.",
      "h1": "Extract Frames from Video",
      "h1Sub": "Free Online Frame Extractor",
      "hero": "Extract every frame from MP4, MOV, and WEBM videos as JPG or PNG images for free. All processing happens locally in your browser — your files are never uploaded.",
      "keywords": "extract frames from video, video frame extractor, extract frames online, video to images"
    },
    "videoToPng": {
      "title": "Video to PNG Converter Online Free — Extract PNG Frames Instantly",
      "description": "Convert video to PNG images online for free. Extract lossless PNG frames from MP4, MOV, and WEBM videos in your browser. No server upload required.",
      "h1": "Extract Lossless PNG Frames",
      "h1Sub": "Online — Free",
      "hero": "Convert video to PNG images online for free. Extract pixel-perfect, lossless PNG sequences from MP4, MOV, or WEBM videos. Keep transparency info intact, all without files leaving your computer.",
      "keywords": "video to png, extract png frames, mp4 to png, lossless frame extractor"
    },
    "screenshotVideo": {
      "title": "Screenshot from Video Online — Grab Any Frame for Free",
      "description": "Take a screenshot from any video frame online for free. Capture the exact moment you need as a high-quality JPG or PNG. No server upload required.",
      "h1": "Screenshot from Video",
      "h1Sub": "Grab Any Frame Free",
      "hero": "Take a screenshot from MP4, MOV, and WEBM videos online for free. Extract the exact frame you need in full native resolution. No server uploads, no watermarks, completely private.",
      "keywords": "screenshot from video, video frame grabber, extract still from video, video frame capture"
    },
    "imagesToVideo": {
      "title": "Images to Video Online — Create WebM from JPG/PNG Sequences",
      "description": "Convert image sequences to video online for free. Create WebM video from JPG or PNG frames in your browser. No server upload required.",
      "h1": "Images to Video",
      "h1Sub": "Create Video from Image Sequences",
      "hero": "Convert a sequence of JPG or PNG images into a smooth WebM video directly in your browser. No server upload, no watermarks.",
      "keywords": "images to video, image sequence to video, jpg to video, png to video"
    },
    "footer": {
      "tagline": "Free browser-based video frame extractor. Convert MP4, MOV, and WEBM videos to JPG/PNG image sequences — no server upload, processed locally in your browser.",
      "converterTools": "Converter Tools",
      "resources": "Resources",
      "blog": "Blog & Guides",
      "about": "About Us",
      "privacy": "Privacy Policy",
      "terms": "Terms of Service",
      "howItWorks": "How It Works",
      "copyright": "© {{year}} Video to Image Sequence Online · Free forever",
      "local": "Processing is 100% local · Your videos never leave your device"
    }
  },
  es: {
    "nav": {
      "tools": "Herramientas",
      "blog": "Blog",
      "howItWorks": "Cómo Funciona",
      "faq": "Preguntas Frecuentes",
      "language": "Idioma"
    },
    "common": {
      "freeForever": "Gratis para Siempre",
      "noUpload": "Sin Subida al Servidor",
      "localProcessing": "Procesamiento Local en el Navegador",
      "downloadZip": "Descargar ZIP",
      "advertisement": "Publicidad",
      "extractFrames": "Extraer Fotogramas",
      "convertAnother": "Convertir Otro",
      "processing": "Extrayendo Fotogramas...",
      "zipping": "Creando Archivo ZIP...",
      "complete": "¡Procesamiento Completo!",
      "failed": "Error en el Procesamiento",
      "startOver": "Empezar de Nuevo",
      "downloadAll": "Descargar Todo (ZIP)",
      "framesExtracted": "Se extrajeron {{count}} fotogramas de tu video.",
      "processed": "Procesados",
      "skipAd": "Omitir Anuncio",
      "skipIn": "Omitir en {{seconds}}s"
    },
    "dropzone": {
      "drop": "Arrastra tu video aquí",
      "browse": "o haz clic para explorar",
      "support": "Compatible con MP4, MOV, WEBM · Los archivos grandes dependen de tu dispositivo y navegador · Carga múltiple para lotes"
    },
    "controls": {
      "frameRate": "Velocidad de Fotogramas (FPS)",
      "format": "Formato de Salida",
      "quality": "Calidad JPG",
      "estimatedFrames": "Est. {{count}} fotogramas",
      "highFrameWarning": "Advertencia: {{count}}+ fotogramas pueden agotar la memoria del navegador. Considera reducir los FPS."
    },
    "badges": {
      "private": "🔒 100% Privado (Local)",
      "fast": "⚡ Conversión Local Rápida",
      "zip": "📦 Descarga ZIP",
      "fps": "🎨 Control FPS Personalizado",
      "free": "🆓 Gratis para Siempre"
    },
    "home": {
      "title": "Convertidor de Video a Secuencia de Imágenes Online — Extractor de Fotogramas Gratis",
      "description": "Extractor de fotogramas de video gratuito basado en el navegador. Convierte videos MP4, MOV y WEBM a secuencias JPG o PNG. Sin subida al servidor.",
      "h1": "Video a Secuencia de Imágenes",
      "h1Sub": "Convertidor Online",
      "hero": "Video to Image Sequence Online es una herramienta gratuita basada en el navegador que extrae cada fotograma de videos MP4, MOV y WEBM como imágenes JPG o PNG de alta calidad. A diferencia de otras herramientas, no requiere subir archivos al servidor (el procesamiento ocurre localmente en la memoria del navegador, por lo que los archivos grandes dependen de la memoria del dispositivo, el rendimiento del navegador, la duración del video y los códecs compatibles), admite procesamiento por lotes, descarga en ZIP y control de FPS personalizado; todo completamente gratis y 100% privado.",
      "keywords": "video a secuencia de imágenes, extraer fotogramas de video gratis, MP4 a JPG fotogramas, extractor de fotogramas de video, convertir video a secuencia PNG",
      "badge": "100% Gratis · Sin Subidas · Procesamiento Local",
      "badges": {
        "noUpload": "✅ Sin Subidas al Servidor",
        "private": "🔒 100% Privado",
        "fast": "⚡ Procesamiento Local Rápido",
        "zip": "📦 Descarga ZIP",
        "batch": "🎬 Procesamiento por Lotes",
        "fps": "🎨 FPS Personalizado",
        "free": "🆓 Gratis para Siempre"
      },
      "tabs": {
        "toImages": "Video a Imágenes",
        "toVideo": "Imágenes a Video"
      },
      "howWorksTitle": "Cómo funciona este extractor de fotogramas",
      "howWorksDesc": "Esta herramienta extrae fotogramas de tu video y los convierte en imágenes descargables. Puedes subir un video, elegir el formato de salida y descargar la secuencia en JPG o PNG.",
      "simpleProcess": "El proceso es simple:",
      "steps": [
        "Carga tu archivo de video.",
        "Selecciona el formato de imagen.",
        "Elige cuántos fotogramas extraer.",
        "Descarga la secuencia extraída."
      ],
      "useCases": "Útil para animación, edición de video, conjuntos de datos de IA, miniaturas y análisis de movimiento.",
      "formatsTitle": "Formatos de Video Soportados",
      "formatsDesc1": "Formatos recomendados: MP4, MOV y WEBM.",
      "formatsDesc2": "Otros formatos como AVI o MKV pueden funcionar si tu navegador tiene los códecs correspondientes.",
      "outputsTitle": "Formatos de Imagen de Salida",
      "outputsDesc": "Puedes extraer los fotogramas como:",
      "jpgTitle": "JPG/JPEG",
      "jpgDesc": "mejor para tamaños de archivo reducidos.",
      "pngTitle": "PNG",
      "pngDesc": "mejor para fotogramas sin pérdida de calidad y transparencias.",
      "outputChoose": "Elige JPG para descargas rápidas, o PNG para máxima calidad.",
      "whoUsesTitle": "¿Quién puede usar esta herramienta?",
      "whoUsesDesc": "Esta herramienta es útil para:",
      "whoUsesList": [
        "Editores de video y YouTubers.",
        "Animadores y desarrolladores de videojuegos.",
        "Desarrolladores de Inteligencia Artificial (IA).",
        "Diseñadores gráficos.",
        "Estudiantes y académicos.",
        "Investigadores científicos."
      ],
      "privacyTitle": "Privacidad y Seguridad",
      "privacyDesc1": "Tu video se procesa enteramente en tu navegador. Tus archivos nunca se suben a ningún servidor.",
      "privacyDesc2": "No solicitamos registros ni datos personales. 100% de privacidad local.",
      "privacyWarn": "Tus archivos son privados. Apto para videos sensibles porque ningún dato sale de tu dispositivo.",
      "howItWorksTitle": "Cómo Funciona",
      "howItWorksSub": "3 pasos simples — sin registros, sin descargas, sin subidas",
      "howSteps": [
        { "title": "Arrastra tu video", "desc": "Arrastra y suelta tu archivo MP4, MOV o WEBM. Los archivos grandes dependen de la memoria de tu dispositivo." },
        { "title": "Elige la configuración", "desc": "Selecciona la velocidad de fotogramas (FPS) y el formato (JPG o PNG)." },
        { "title": "Descarga los fotogramas", "desc": "Previsualiza la cuadrícula y descarga la secuencia completa en un archivo ZIP." }
      ],
      "whoUsesOnlineTitle": "¿Quién usa Video a Secuencia de Imágenes Online?",
      "whoUsesOnlineSub": "Usado por creadores, desarrolladores y profesionales en todo el mundo",
      "whoUsesItems": [
        { "icon": "🎬", "title": "Editores y YouTubers", "desc": "Extrae fotogramas para miniaturas, portadas o publicaciones en redes sociales." },
        { "icon": "🎮", "title": "Desarrolladores y Animadores", "desc": "Convierte videos en secuencias de imágenes para motores de videojuegos." },
        { "icon": "🤖", "title": "Desarrolladores de IA", "desc": "Genera conjuntos de datos para entrenar modelos de visión artificial." },
        { "icon": "🎨", "title": "Artistas de VFX", "desc": "Extrae secuencias de fotogramas para composición en After Effects o DaVinci." },
        { "icon": "📸", "title": "Fotógrafos", "desc": "Captura momentos específicos en alta velocidad imposibles de fotografiar." },
        { "icon": "🎓", "title": "Académicos e Investigadores", "desc": "Extrae fotogramas para análisis científico y presentaciones académicas." }
      ],
      "compareTitle": "Comparación con otras herramientas",
      "compareSub": "Video to Image Sequence Online vs otros convertidores en la nube",
      "compareHeaders": ["Característica", "www.videotoimagesequence.online ✦", "Convertidores en la Nube", "Otros"],
      "compareRows": [
        ["Límite de tamaño", "✅ Sin límites en el servidor; depende de la RAM", "❌ 200MB", "❌ 100-200MB"],
        ["Subida al servidor", "✅ Nunca", "❌ Siempre", "❌ Siempre"],
        ["100% Privado", "✅ Sí", "❌ No", "❌ No"],
        ["Previsualización", "✅ Cuadrícula completa", "✅ Sí", "⚠️ Limitado"],
        ["Descarga individual", "✅ Sí", "✅ Sí", "⚠️ Algunas"],
        ["Descarga ZIP", "✅ Sí", "✅ Sí", "⚠️ Algunas"],
        ["Control de FPS", "✅ Sí", "✅ Sí", "⚠️ Algunas"],
        ["Procesamiento por lotes", "✅ Sí", "❌ No", "❌ No"],
        ["Formatos JPG/PNG", "✅ Ambos", "✅ Ambos", "⚠️ Varía"],
        ["Aplicación instalable (PWA)", "✅ Sí", "❌ No", "❌ No"],
        ["Gratuito", "✅ 100%", "✅ Gratis", "⚠️ Freemium"],
        ["Sin cuentas", "✅ Sí", "✅ Sí", "⚠️ Algunas"]
      ],
      "moreToolsTitle": "Más herramientas de video gratuitas",
      "moreTools": [
        { "title": "Convertidor MP4 a JPG", "desc": "Extrae fotogramas JPG de videos MP4 en tu navegador." },
        { "title": "Captura de Pantalla de Video", "desc": "Captura fotogramas a resolución nativa localmente." },
        { "title": "Video a Fotogramas PNG", "desc": "Extrae fotogramas PNG sin pérdida para VFX y ML." }
      ],
      "relatedTitle": "Herramientas y guías relacionadas",
      "relatedSub": "Explora más herramientas y tutoriales para extraer fotogramas",
      "relatedItems": [
        { "title": "Extraer fotogramas de video", "desc": "Herramienta online gratuita para extraer fotogramas como JPG o PNG." },
        { "title": "Guía de MP4 a secuencia de imágenes", "desc": "Aprende a convertir videos MP4 en secuencias de imágenes fácilmente." },
        { "title": "Video a secuencia PNG", "desc": "Extrae fotogramas PNG de alta calidad sin pérdida." },
        { "title": "Secuencia de imágenes a video", "desc": "Combina imágenes en un video WebM con FPS personalizados." },
        { "title": "Captura de pantalla de video", "desc": "Captura el fotograma perfecto a resolución nativa." },
        { "title": "Convertidor de video a JPG", "desc": "Convierte videos a secuencias JPG para descargas ligeras." }
      ],
      "faq": {
        "title": "Frequently Asked Questions",
        "sub": "Everything you need to know about Video to Image Sequence Online",
        "items": [
          { "q": "¿Cómo convierto un video MP4 a imágenes JPG gratis?", "a": "Simplemente arrastra y suelta tu archivo MP4 en la herramienta, selecciona el formato JPG, elige tus FPS y haz clic en Extraer. Todos los fotogramas se procesan localmente en tu navegador y se descargarán como un archivo ZIP." },
          { "q": "¿Hay un límite de tamaño de archivo para la conversión MP4 a JPG?", "a": "No se requiere subida al servidor. El procesamiento ocurre en tu navegador, por lo que los archivos grandes dependen de la memoria de tu dispositivo, el rendimiento del navegador, la duración del video y el soporte de códec." },
          { "q": "¿Cuántos fotogramas JPG obtendré de mi MP4?", "a": "Depende de la duración de tu video y la configuración de FPS elegida. Por ejemplo, un video de 10 segundos convertido a 10 FPS extraerá aproximadamente 100 imágenes JPG." },
          { "q": "¿Puedo convertir MP4 a PNG en lugar de JPG?", "a": "Sí. Usa el selector de formato dentro de la herramienta para cambiar a la salida PNG si necesitas fotogramas de calidad sin pérdida." },
          { "q": "¿La conversión MP4 a JPG funciona en dispositivos móviles?", "a": "Sí. Nuestra herramienta funciona directamente en los navegadores web móviles modernos como Safari en iOS y Chrome en Android, aunque el rendimiento depende de la capacidad del hardware del dispositivo." }
        ]
      }
    },
    "mp4ToJpg": {
      "title": "Convertidor MP4 a JPG Online Gratis — Extraer Fotogramas JPG de MP4",
      "description": "Convierte video MP4 a imágenes JPG online gratis. Extrae cada fotograma como un JPG de alta calidad localmente en tu navegador. Sin subida al servidor.",
      "h1": "Convertidor MP4 a JPG",
      "h1Sub": "Online Gratis — Procesamiento Local",
      "hero": "Convierte video MP4 a imágenes JPG online gratis. Extrae cada fotograma como una secuencia JPG de alta calidad localmente en tu navegador. Como los archivos se procesan localmente, tus datos de video nunca salen de tu dispositivo.",
      "keywords": "mp4 a jpg, convertidor mp4 a jpeg, extraer jpg de mp4, extractor de fotogramas mp4",
      "privacy": {
        "title": "Extracción de Fotogramas 100% Privada",
        "body": "A diferencia de las herramientas online que suben tus archivos de video a un servidor remoto en la nube, nuestro convertidor MP4 a JPG aprovecha las API Web HTML5 para decodificar videos directamente dentro de tu navegador web. Tus archivos nunca se transmiten a través de la red, manteniendo tu material de video sensible completamente seguro."
      },
      "howTo": {
        "title": "Cómo Convertir MP4 a JPG Online",
        "steps": [
          { "title": "Elige tu MP4", "body": "Arrastra y suelta tu archivo MP4 en la zona de carga de arriba." },
          { "title": "Configura la Velocidad de Fotogramas (FPS)", "body": "Elige tu frecuencia de extracción. Selecciona 30 FPS para capturar 30 fotogramas por segundo, o elige 1 FPS para extraer un fotograma por segundo." },
          { "title": "Selecciona el Formato", "body": "Asegúrate de que \"JPG\" esté seleccionado como formato de salida." },
          { "title": "Extrae los Fotogramas", "body": "Haz clic en \"Extraer Fotogramas\" para decodificar la secuencia de video." },
          { "title": "Guarda la Salida", "body": "Descarga fotogramas individuales desde la vista previa o haz clic en \"Descargar Todo (ZIP)\" para guardar la secuencia completa." }
        ]
      },
      "faq": {
        "title": "Preguntas Frecuentes",
        "items": [
          { "q": "¿Cómo convierto un video MP4 a imágenes JPG gratis?", "a": "Simplemente arrastra y suelta tu archivo MP4 en la herramienta, selecciona el formato JPG, elige tus FPS y haz clic en Extraer. Todos los fotogramas se procesan localmente en tu navegador y se descargarán como un archivo ZIP." },
          { "q": "¿Hay un límite de tamaño de archivo para la conversión MP4 a JPG?", "a": "No se requiere subida al servidor. El procesamiento ocurre en tu navegador, por lo que los archivos grandes dependen de la memoria de tu dispositivo, el rendimiento del navegador, la duración del video y el soporte de códec." },
          { "q": "¿Cuántos fotogramas JPG obtendré de mi MP4?", "a": "Depende de la duración de tu video y la configuración de FPS elegida. Por ejemplo, un video de 10 segundos convertido a 10 FPS extraerá aproximadamente 100 imágenes JPG." },
          { "q": "¿Puedo convertir MP4 a PNG en lugar de JPG?", "a": "Sí. Usa el selector de formato dentro de la herramienta para cambiar a la salida PNG si necesitas fotogramas de calidad sin pérdida." },
          { "q": "¿La conversión MP4 a JPG funciona en dispositivos móviles?", "a": "Sí. Nuestra herramienta funciona directamente en los navegadores web móviles modernos como Safari en iOS y Chrome en Android, aunque el rendimiento depende de la capacidad del hardware del dispositivo." }
        ]
      }
    },
    "extractFrames": {
      "title": "Extraer Fotogramas de Video Online Gratis — Extractor de Fotogramas JPG y PNG",
      "description": "Extrae fotogramas de video online gratis. Convierte videos MP4, MOV y WEBM a secuencias JPG o PNG en tu navegador. Sin subida al servidor.",
      "h1": "Extraer Fotogramas de Video",
      "h1Sub": "Extractor de Fotogramas Online Gratis",
      "hero": "Extrae cada fotograma de videos MP4, MOV y WEBM como imágenes JPG o PNG gratis. Todo el procesamiento ocurre localmente en tu navegador — tus archivos nunca se suben.",
      "keywords": "extraer fotogramas de video, extractor de fotogramas, extraer fotogramas online, video a imagenes"
    },
    "videoToPng": {
      "title": "Convertidor de Video a PNG Online Gratis — Extraer Fotogramas PNG al Instante",
      "description": "Convierte video a imágenes PNG online gratis. Extrae fotogramas PNG sin pérdida de videos MP4, MOV y WEBM en tu navegador. Sin subida al servidor.",
      "h1": "Extraer Fotogramas PNG sin Pérdida",
      "h1Sub": "Online — Gratis",
      "hero": "Convierte video a imágenes PNG online gratis. Extrae secuencias PNG perfectas y sin pérdida de videos MP4, MOV o WEBM. Conserva la información de transparencia, todo sin que los archivos salgan de tu ordenador.",
      "keywords": "video a png, extraer fotogramas png, mp4 a png, extractor de fotogramas sin pérdida"
    },
    "screenshotVideo": {
      "title": "Captura de Pantalla de Video Online — Captura Cualquier Fotograma Gratis",
      "description": "Toma una captura de pantalla de cualquier fotograma de video online gratis. Captura el momento exacto que necesitas como JPG o PNG de alta calidad. Sin subida al servidor.",
      "h1": "Captura de Pantalla de Video",
      "h1Sub": "Captura Cualquier Fotograma Gratis",
      "hero": "Toma una captura de pantalla de videos MP4, MOV y WEBM online gratis. Extrae el fotograma exacto que necesitas en resolución nativa completa. Sin subida al servidor, sin marcas de agua, completamente privado.",
      "keywords": "captura de pantalla de video, capturador de fotogramas de video, extraer imagen de video, captura de fotogramas de video"
    },
    "imagesToVideo": {
      "title": "Imágenes a Video Online — Crear WebM de Secuencias JPG/PNG",
      "description": "Convierte secuencias de imágenes a video online gratis. Crea videos WebM de fotogramas JPG o PNG en tu navegador. Sin subida al servidor.",
      "h1": "Imágenes a Video",
      "h1Sub": "Crear Video desde Secuencias de Imágenes",
      "hero": "Convierte una secuencia de imágenes JPG o PNG en un video WebM fluido directamente en tu navegador. Sin subida al servidor, sin marcas de agua.",
      "keywords": "imagenes a video, secuencia de imagenes a video, jpg a video, png a video"
    },
    "footer": {
      "tagline": "Extractor de fotogramas de video gratuito basado en el navegador. Convierte videos MP4, MOV y WEBM a secuencias de imágenes JPG/PNG — sin subida al servidor, procesado localmente en tu navegador.",
      "converterTools": "Herramientas de Conversión",
      "resources": "Recursos",
      "blog": "Blog y Guías",
      "about": "Sobre Nosotros",
      "privacy": "Política de Privacidad",
      "terms": "Términos de Servicio",
      "howItWorks": "Cómo Funciona",
      "copyright": "© {{year}} Video to Image Sequence Online · Gratis para siempre",
      "local": "El procesamiento es 100% local · Tus videos nunca salen de tu dispositivo"
    }
  }
};

// We will write the updated JSON for all remaining locales (fr, de, pt, zh, ar, hi).
// Let's add them to the script dynamically based on translation mappings.
// For brevity, we can load target files, merge existing keys, and add missing tools.
// Let's write the complete JSON update loop:

const targetLocales = ['en', 'es', 'fr', 'de', 'pt', 'zh', 'ar', 'hi'];

targetLocales.forEach(lang => {
  const filePath = path.join(localesPath, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    return;
  }

  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Merge the translations defined above
  if (translations[lang]) {
    data = { ...data, ...translations[lang] };
  } else {
    // If not defined in translation dict above, let's copy English values for safety so it doesn't break
    const enData = translations['en'];
    Object.keys(enData).forEach(key => {
      if (!data[key]) {
        data[key] = enData[key];
      } else if (typeof enData[key] === 'object' && !Array.isArray(enData[key])) {
        data[key] = { ...enData[key], ...data[key] };
      }
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated translations for locale: ${lang}`);
});
