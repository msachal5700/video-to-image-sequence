import JSZip from 'jszip';
import { ProcessingStats, OutputFormat } from '../types';

interface LegacyProcessOptions {
  file: File;
  fps: number;
  format: OutputFormat;
  quality?: number; // 0 to 1
  maxFrames?: number;
  onProgress: (stats: ProcessingStats) => void;
  onFrame?: (frameBlob: Blob, index: number) => void;
}

export const extractFramesLegacy = async ({
  file,
  fps,
  format,
  quality = 0.8,
  maxFrames,
  onProgress,
  onFrame,
}: LegacyProcessOptions): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let zip: JSZip | null = new JSZip();
    const startTime = Date.now();

    const cleanup = () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
    };

    if (!ctx) {
      reject(new Error('CANVAS_FAILED: Could not initialize canvas renderer. Try closing other browser tabs to free memory.'));
      return;
    }

    video.autoplay = false;
    video.muted = true;
    video.playsInline = true;
    
    // Create object URL for the file
    const url = URL.createObjectURL(file);
    video.src = url;

    let seekTimeout: NodeJS.Timeout | null = null;

    video.onloadedmetadata = async () => {
      // Scale down large videos to prevent memory exhaustion on mobile
      const MAX_DIM = 1920;
      let targetWidth = video.videoWidth;
      let targetHeight = video.videoHeight;
      
      if (targetWidth > MAX_DIM || targetHeight > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / targetWidth, MAX_DIM / targetHeight);
        targetWidth = Math.round(targetWidth * ratio);
        targetHeight = Math.round(targetHeight * ratio);
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      const duration = video.duration;
      let totalFrames = Math.floor(duration * fps);
      const timeInterval = 1 / fps;
      
      // Support maxFrames safety cap
      if (maxFrames && totalFrames > maxFrames) {
        totalFrames = maxFrames;
      }
      
      let currentFrame = 0;

      const processNextFrame = async () => {
        const seekTime = currentFrame * timeInterval;

        if (seekTime > duration || currentFrame >= totalFrames) {
          URL.revokeObjectURL(url);
          cleanup();

          onProgress({
             totalFrames,
             processedFrames: currentFrame,
             progress: 100,
             startTime,
             estimatedTimeRemaining: 0
          });

          try {
            if (!zip) throw new Error('ZIP_FAILED: JSZip instance was unexpectedly destroyed.');
            const blob = await zip.generateAsync({ 
              type: 'blob',
              compression: format === 'png' ? 'DEFLATE' : 'STORE',
              compressionOptions: format === 'png' ? { level: 3 } : undefined,
            });
            zip = null; // allow GC to collect the JSZip instance
            resolve(blob);
          } catch (err) {
            reject(new Error('ZIP_FAILED: Could not create ZIP archive. Your device may be running low on memory.'));
          }
          return;
        }

        seekTimeout = setTimeout(() => {
          cleanup();
          reject(new Error('SEEK_TIMEOUT: Video seeking timed out after 15 seconds. The file may be corrupted or too large for your device.'));
        }, 15000);

        video.currentTime = seekTime;
      };

      video.onseeked = async () => {
        if (seekTimeout) clearTimeout(seekTimeout);

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const exportQuality = format === 'png' ? 1 : quality;
        
        canvas.toBlob(
          (blob) => {
            if (blob && zip) {
              const extension = format === 'png' ? 'png' : 'jpg';
              const fileName = `frame_${currentFrame.toString().padStart(6, '0')}.${extension}`;
              
              if (format === 'jpg') {
                zip.file(fileName, blob, { compression: 'STORE' });
              } else {
                zip.file(fileName, blob, { compression: 'DEFLATE', compressionOptions: { level: 3 } });
              }
              
              if (onFrame) onFrame(blob, currentFrame);

              currentFrame++;
              
              const elapsed = (Date.now() - startTime) / 1000;
              const framesPerSecondProcessing = currentFrame / elapsed;
              const remainingFrames = totalFrames - currentFrame;
              const estimatedTimeRemaining = remainingFrames / framesPerSecondProcessing;

              onProgress({
                totalFrames,
                processedFrames: currentFrame,
                progress: Math.round((currentFrame / totalFrames) * 100),
                startTime,
                estimatedTimeRemaining
              });

              // Use requestAnimationFrame followed by slight timeout to allow UI rendering and GC 
              requestAnimationFrame(() => {
                 setTimeout(processNextFrame, 15);
              });
            } else {
              reject(new Error('CANVAS_FAILED: Could not render image from canvas.'));
            }
          },
          mimeType,
          exportQuality
        );
      };

      video.onerror = (e) => {
        if (seekTimeout) clearTimeout(seekTimeout);
        URL.revokeObjectURL(url);
        cleanup();
        reject(new Error('CODEC_UNSUPPORTED: This video codec is not supported by your browser. Try converting to MP4 H.264 first using HandBrake (free).'));
      };

      processNextFrame();
    };

    video.onerror = () => {
        reject(new Error('CODEC_UNSUPPORTED: Failed to load video file. This format or codec may be unsupported.'));
    }
  });
};
