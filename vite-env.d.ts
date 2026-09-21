/// <reference types="vite/client" />

declare module 'gif.js' {
  export interface GIFFrameOptions {
    copy?: boolean;
    delay?: number;
    dispose?: number;
  }

  export interface GIFOptions {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    workerScript?: string;
    background?: string;
    transparent?: number | null;
    dither?: boolean | string;
    repeat?: number;
  }

  export default class GIF {
    constructor(options?: GIFOptions);
    addFrame(
      image: CanvasRenderingContext2D | HTMLCanvasElement | ImageData | HTMLImageElement,
      options?: GIFFrameOptions
    ): void;
    on(event: 'progress', callback: (progress: number) => void): void;
    on(event: 'finished', callback: (blob: Blob) => void): void;
    on(event: 'abort', callback: () => void): void;
    render(): void;
    abort(): void;
  }
}

declare module 'gif.js/dist/gif.worker.js?url' {
  const workerUrl: string;
  export default workerUrl;
}
