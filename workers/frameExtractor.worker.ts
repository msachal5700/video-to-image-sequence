import JSZip from 'jszip';
// @ts-ignore
import * as MP4Box from 'mp4box';

self.onmessage = async (e) => {
  const { type, payload } = e.data;
  if (type === 'START') {
    try {
      if (typeof VideoDecoder === 'undefined' || typeof OffscreenCanvas === 'undefined') {
        self.postMessage({ type: 'FALLBACK' });
        return;
      }
      await processVideo(payload);
    } catch (err: any) {
      self.postMessage({ type: 'FALLBACK' });
    }
  }
};

async function processVideo(payload: any) {
  const { arrayBuffer, fps, format, quality, maxFrames } = payload;
  let zip: JSZip | null = new JSZip();
  const startTime = Date.now();

  const mp4boxfile = MP4Box.createFile();
  let videoTrack: any = null;
  let decoder: VideoDecoder | null = null;

  let totalFrames = 0;
  let processedFrames = 0;
  
  let canvas: OffscreenCanvas | null = null;
  let ctx: OffscreenCanvasRenderingContext2D | null = null;
  
  const timeIntervalMicroseconds = (1 / fps) * 1e6;
  let nextFrameTime = 0;
  let isCanceled = false;
  
  const resolvePromise: any = {};
  const promise = new Promise((resolve, reject) => {
    resolvePromise.resolve = resolve;
    resolvePromise.reject = reject;
  });

  mp4boxfile.onError = (e: any) => {
    resolvePromise.reject(new Error(e));
  };
  
  (arrayBuffer as any).fileStart = 0;

  mp4boxfile.onReady = (info: any) => {
    videoTrack = info.videoTracks[0];
    if (!videoTrack) {
       resolvePromise.reject(new Error('No video track found'));
       return;
    }
    
    totalFrames = Math.floor((videoTrack.movie_duration / videoTrack.movie_timescale) * fps);

    // Scale down to prevent memory exception on mobile
    const MAX_DIM = 1920;
    let targetWidth = videoTrack.video.width;
    let targetHeight = videoTrack.video.height;
    
    if (targetWidth > MAX_DIM || targetHeight > MAX_DIM) {
      const ratio = Math.min(MAX_DIM / targetWidth, MAX_DIM / targetHeight);
      targetWidth = Math.round(targetWidth * ratio);
      targetHeight = Math.round(targetHeight * ratio);
    }

    canvas = new OffscreenCanvas(targetWidth, targetHeight);
    ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

    decoder = new VideoDecoder({
      output: async (frame: VideoFrame) => {
        if (isCanceled) { frame.close(); return; }

        // If we are close or past the next frame time, capture it
        if (frame.timestamp >= nextFrameTime) {
          ctx!.drawImage(frame, 0, 0, canvas!.width, canvas!.height);
          
          const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
          const exportQuality = format === 'png' ? 1.0 : quality;
          
          try {
            const blob = await canvas!.convertToBlob({
              type: mimeType,
              quality: exportQuality
            });
            
            const extension = format === 'png' ? 'png' : 'jpg';
            const fileName = `frame_${processedFrames.toString().padStart(6, '0')}.${extension}`;
            
            if (zip) {
              if (format === 'jpg') {
                zip.file(fileName, blob, { compression: 'STORE' });
              } else {
                zip.file(fileName, blob, { compression: 'DEFLATE', compressionOptions: { level: 3 } });
              }
            }
            
            self.postMessage({ type: 'FRAME', blob, index: processedFrames });
            
            processedFrames++;
            nextFrameTime += timeIntervalMicroseconds;
            
            const elapsed = (Date.now() - startTime) / 1000;
            const fpsProcessing = processedFrames / elapsed;
            const remaining = totalFrames - processedFrames;
            const est = remaining / fpsProcessing;
            
            self.postMessage({
              type: 'PROGRESS',
              processedFrames,
              totalFrames,
              progress: Math.round((processedFrames / totalFrames) * 100),
              estimatedTimeRemaining: est
            });

            if (maxFrames && processedFrames >= maxFrames) {
               isCanceled = true;
               if (decoder && decoder.state === 'configured') decoder.flush();
            }
          } catch (err: any) {
             console.error("Frame export error", err);
          }
        }
        
        frame.close();
      },
      error: (e) => {
        resolvePromise.reject(e);
      }
    });

    try {
      const trak = mp4boxfile.getTrackById(videoTrack.id);
      let description: Uint8Array | undefined;
      
      for (const entry of trak.mdia.minf.stbl.stsd.entries) {
        const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
        if (box) {
          const stream = new MP4Box.DataStream(undefined, 0, MP4Box.DataStream.BIG_ENDIAN);
          box.write(stream);
          description = new Uint8Array(stream.buffer, 8); // Skip box header
          break;
        }
      }

      const config: VideoDecoderConfig = {
        codec: videoTrack.codec,
        codedWidth: videoTrack.video.width,
        codedHeight: videoTrack.video.height,
        description
      };

      VideoDecoder.isConfigSupported(config).then(support => {
        if (!support.supported) {
          resolvePromise.reject(new Error('Codec not supported'));
          return;
        }
        decoder!.configure(config);
        mp4boxfile.setExtractionOptions(videoTrack.id, null, { nbSamples: 10000 });
        mp4boxfile.start();
      }).catch(resolvePromise.reject);
    } catch (e) {
      resolvePromise.reject(e);
    }
  };

  mp4boxfile.onSamples = (trackId: any, user: any, samples: any[]) => {
    for (const sample of samples) {
      if (!decoder || decoder.state !== 'configured') break;
      const type = sample.is_sync ? 'key' : 'delta';
      const chunk = new EncodedVideoChunk({
        type: type as EncodedVideoChunkType,
        timestamp: sample.cts * (1e6 / sample.timescale),
        duration: sample.duration * (1e6 / sample.timescale),
        data: sample.data
      });
      try {
        decoder.decode(chunk);
      } catch(e) {
        console.error('Decode error', e);
      }
    }
  };
  
  mp4boxfile.onFlush = async () => {
    if (decoder && decoder.state === 'configured') {
      try {
        await decoder.flush();
      } catch(e) {
        console.error("Decoder flush error", e);
      }
      if (!zip) {
        resolvePromise.reject(new Error('ZIP instance destroyed.'));
        return;
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      zip = null; // GC collection mark
      self.postMessage({ type: 'COMPLETE', zipBlob });
      resolvePromise.resolve();
    } else {
       resolvePromise.reject(new Error('Decoder not initialized before flush'));
    }
  };

  // Set a timeout to catch files that aren't MP4s or supported
  const fallbackTimer = setTimeout(() => {
     resolvePromise.reject(new Error('MP4Box Parsing Timeout - falling back'));
  }, 2000);

  try {
    mp4boxfile.appendBuffer(arrayBuffer);
    mp4boxfile.flush();
    clearTimeout(fallbackTimer);
  } catch(e) {
    clearTimeout(fallbackTimer);
    resolvePromise.reject(e);
  }
  
  await promise;
}
