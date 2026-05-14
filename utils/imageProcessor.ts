interface CreateVideoOptions {
  images: File[];
  fps: number;
  onProgress: (progress: number) => void;
}

export const createVideoFromImages = async ({
  images,
  fps,
  onProgress
}: CreateVideoOptions): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    if (images.length === 0) {
      reject(new Error('No images provided'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not create canvas context'));
      return;
    }

    // Load first image to set dimensions
    let firstImg: HTMLImageElement;
    try {
        firstImg = await loadImage(images[0]);
    } catch (e) {
        reject(new Error('Failed to load the first image.'));
        return;
    }
    
    canvas.width = firstImg.width;
    canvas.height = firstImg.height;

    // Determine supported mime type
    const mimeTypes = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4'
    ];
    
    let selectedMimeType = '';
    for (const type of mimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        selectedMimeType = type;
        break;
      }
    }

    if (!selectedMimeType) {
      reject(new Error('No supported video mime type found in this browser.'));
      return;
    }

    // Explicit cast to any because captureStream is not always in standard lib.dom.d.ts
    const stream = (canvas as any).captureStream(fps);
    const recorder = new MediaRecorder(stream, {
      mimeType: selectedMimeType,
      videoBitsPerSecond: 8000000 // 8 Mbps for better quality
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: selectedMimeType });
      resolve(blob);
    };

    recorder.start();

    let currentIndex = 0;

    const processNext = async () => {
      if (currentIndex >= images.length) {
        recorder.stop();
        return;
      }

      try {
        const img = await loadImage(images[currentIndex]);
        
        // Fill background black to handle different aspect ratios if necessary
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw image centered (simplistic approach, assumes same size for best result)
        // For a more robust tool, we would calculate aspect ratio fit here
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        onProgress(Math.round(((currentIndex + 1) / images.length) * 100));
        currentIndex++;
        
        // Approximate frame timing
        setTimeout(processNext, 1000 / fps);
        
      } catch (err) {
        // If one image fails, we try to skip or abort. Aborting is safer.
        console.error(`Error processing image index ${currentIndex}`, err);
        recorder.stop();
        reject(err);
      }
    };

    processNext();
  });
};

const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
};