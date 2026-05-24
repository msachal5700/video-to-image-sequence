# Video to Image Sequence Online

Free browser-based tool to extract frames from MP4, MOV, and WEBM videos as JPG/PNG image sequences. No server upload required — processing happens locally in your browser. 100% private, batch processing, and ZIP download.

## Features
- **No Server Upload:** Processes videos entirely in the browser. Large files depend on your device memory, browser performance, and video length.
- **100% Private:** Videos are never uploaded to any server.
- **Lossless PNGs:** Supports alpha channel transparency.
- **Custom FPS Control:** Extract every frame, 1 FPS, 5 FPS, 10 FPS, etc.
- **Batch Processing:** Drop multiple files at once.
- **ZIP Download:** Get all frames inside an organized ZIP file.

## Tech Stack
- Frontend: React (Vite), TypeScript, Tailwind CSS
- Processing: Canvas API, MediaElement, Web Workers
- Icons: Lucide React

## Local Development
Since this project uses Vite, you can start the development server using:
```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```
