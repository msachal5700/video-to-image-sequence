import React, { useState, useCallback, useEffect, useRef } from 'react';
import { UploadCloud, Download, AlertTriangle, Film } from 'lucide-react';
import { AppState } from '../types';
import { useToast } from './Toast';

/**
 * WebM → MP4, fully in the browser. The WebM is decoded with the
 * browser's own video decoder (frame-stepping a <video> element) and
 * re-encoded to H.264 with WebCodecs, muxed with mp4-muxer — the same
 * honest stack as the GIF to MP4 tool. Limits, stated up front in the
 * UI and FAQ: output is 30 fps, clips up to 60 seconds, and the MP4 is
 * SILENT (the audio track is not carried over). If the browser cannot
 * encode H.264 (no WebCodecs VideoEncoder), the tool says so instead
 * of pretending.
 */
const FPS = 30;
const MAX_SECONDS = 60;

interface LoadedVideo {
  url: string;
  name: string;
  duration: number;
  width: number;
  height: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function probeCodec(width: number, height: number): Promise<string | null> {
  const VE = (window as unknown as { VideoEncoder?: typeof VideoEncoder }).VideoEncoder;
  if (!VE) return null;
  for (const codec of ['avc1.640028', 'avc1.42001f']) {
    try {
      const sup = await VE.isConfigSupported({ codec, width, height, bitrate: 2_000_000, framerate: FPS });
      if (sup.supported) return codec;
    } catch {
      /* try the next profile */
    }
  }
  return null;
}

function seekTo(video: HTMLVideoElement, t: number): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      video.removeEventListener('seeked', finish);
      resolve();
    };
    video.addEventListener('seeked', finish);
    video.currentTime = t;
    setTimeout(finish, 2500); // never hang the conversion on a missed event
  });
}

const WebmToMp4Tool: React.FC = () => {
  const [loaded, setLoaded] = useState<LoadedVideo | null>(null);
  const [codec, setCodec] = useState<string | null | undefined>(undefined);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      if (loaded) URL.revokeObjectURL(loaded.url);
      if (result) URL.revokeObjectURL(result.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFile = useCallback(
    async (file: File) => {
      const nameOk = file.name.toLowerCase().endsWith('.webm') || file.type === 'video/webm';
      if (!nameOk) {
        showToast('That file is not a WebM video. This converter accepts .webm files only.', 'error');
        return;
      }
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.src = url;
      try {
        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => resolve();
          video.onerror = () => reject(new Error('the browser could not read this WebM file'));
        });
        // MediaRecorder-made WebMs often report duration = Infinity
        // until you seek past the end once.
        if (!Number.isFinite(video.duration)) {
          await new Promise<void>((resolve) => {
            const onChange = () => {
              if (Number.isFinite(video.duration)) {
                video.removeEventListener('durationchange', onChange);
                resolve();
              }
            };
            video.addEventListener('durationchange', onChange);
            video.currentTime = Number.MAX_SAFE_INTEGER;
            setTimeout(resolve, 3000);
          });
          video.currentTime = 0;
        }
        const info: LoadedVideo = {
          url,
          name: file.name,
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
        };
        if (!info.width || !info.height || !Number.isFinite(info.duration)) {
          throw new Error('could not read the video’s dimensions or duration');
        }
        videoRef.current = video;
        setLoaded(info);
        setResult(null);
        setProgress(0);
        setAppState(AppState.IDLE);
        const encW = info.width - (info.width % 2);
        const encH = info.height - (info.height % 2);
        setCodec(await probeCodec(encW, encH));
      } catch (err) {
        URL.revokeObjectURL(url);
        showToast(`Could not load that WebM (${err instanceof Error ? err.message : String(err)}).`, 'error');
      }
    },
    [showToast],
  );

  const convert = useCallback(async () => {
    const video = videoRef.current;
    if (!loaded || !video || !codec) return;
    if (loaded.duration > MAX_SECONDS) {
      showToast(
        `This clip is ${Math.round(loaded.duration)}s — the in-browser converter handles up to ${MAX_SECONDS}s. Trim it first (the Video Looper page can help you work with short clips).`,
        'error',
      );
      return;
    }
    setAppState(AppState.PROCESSING);
    setProgress(0);
    try {
      const encW = loaded.width - (loaded.width % 2);
      const encH = loaded.height - (loaded.height % 2);
      const frameDurUs = Math.round(1_000_000 / FPS);
      const totalFrames = Math.max(1, Math.min(Math.ceil(loaded.duration * FPS), MAX_SECONDS * FPS));

      const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');
      const muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: { codec: 'avc', width: encW, height: encH },
        fastStart: 'in-memory',
        firstTimestampBehavior: 'offset',
      });
      const VE = (window as unknown as { VideoEncoder: typeof VideoEncoder }).VideoEncoder;
      const VF = (window as unknown as { VideoFrame: typeof VideoFrame }).VideoFrame;
      let encodeError: Error | null = null;
      const encoder = new VE({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: (e) => {
          encodeError = e instanceof Error ? e : new Error(String(e));
        },
      });
      const bitrate = Math.min(8_000_000, Math.max(500_000, Math.round(encW * encH * FPS * 0.13)));
      encoder.configure({ codec, width: encW, height: encH, bitrate, framerate: FPS });

      const canvas = document.createElement('canvas');
      canvas.width = encW;
      canvas.height = encH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context is not available in this browser.');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, encW, encH);

      for (let i = 0; i < totalFrames; i++) {
        const t = Math.min(i / FPS, Math.max(0, loaded.duration - 0.001));
        await seekTo(video, t);
        ctx.drawImage(video, 0, 0, encW, encH);
        const vf = new VF(canvas, { timestamp: i * frameDurUs, duration: frameDurUs });
        encoder.encode(vf, { keyFrame: i % (FPS * 2) === 0 });
        vf.close();
        while (encoder.encodeQueueSize > 8) await sleep(10);
        setProgress(Math.round(((i + 1) / totalFrames) * 100));
        if (encodeError) throw encodeError;
      }
      await encoder.flush();
      encoder.close();
      if (encodeError) throw encodeError;
      muxer.finalize();
      const blob = new Blob([(muxer.target as unknown as { buffer: ArrayBuffer }).buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setResult({ url, size: blob.size });
      setAppState(AppState.COMPLETED);
      showToast('MP4 ready — check the result below. Remember: the converted file has no audio.', 'success');
    } catch (err) {
      setAppState(AppState.ERROR);
      showToast(
        `Conversion failed (${err instanceof Error ? err.message : String(err)}). Your WebM is untouched — a shorter or smaller clip may work better.`,
        'error',
      );
    }
  }, [loaded, codec, showToast]);

  const reset = () => {
    if (loaded) URL.revokeObjectURL(loaded.url);
    if (result) URL.revokeObjectURL(result.url);
    videoRef.current = null;
    setLoaded(null);
    setResult(null);
    setCodec(undefined);
    setProgress(0);
    setAppState(AppState.IDLE);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {!loaded && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a WebM video"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const f = e.dataTransfer.files?.[0];
            if (f) loadFile(f);
          }}
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-cyan-400 bg-cyan-950/30' : 'border-gray-700 bg-gray-900/50 hover:border-cyan-800'
          }`}
        >
          <UploadCloud className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
          <p className="text-white font-display font-bold text-lg">Drop your WebM video here</p>
          <p className="text-gray-400 text-sm mt-2">
            One WebM file, up to {MAX_SECONDS} seconds. Converted 100% in your browser — nothing is uploaded.
            The MP4 is silent (audio is not carried over) and plays at 30 fps.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".webm,video/webm"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) loadFile(f);
              e.target.value = '';
            }}
          />
        </div>
      )}

      {loaded && (
        <div>
          <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 max-w-xl mx-auto">
            <Film className="w-8 h-8 text-cyan-400 shrink-0" />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-white text-sm font-medium truncate">{loaded.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">
                {loaded.width}×{loaded.height} · {loaded.duration.toFixed(1)}s WebM → MP4 (H.264, 30 fps, no audio)
              </p>
            </div>
          </div>

          {loaded.duration > MAX_SECONDS && (
            <div className="flex gap-3 max-w-xl mx-auto mt-4 bg-yellow-950/40 border border-yellow-800/60 rounded-2xl p-4 text-left">
              <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-yellow-200/90 text-sm leading-relaxed">
                This clip is {Math.round(loaded.duration)} seconds — longer than the {MAX_SECONDS}-second
                in-browser limit. Frame-by-frame conversion in a browser tab is slow, so longer videos are
                not accepted here rather than failing halfway. Trim the clip first, then convert.
              </p>
            </div>
          )}

          {codec === null && (
            <div className="flex gap-3 max-w-xl mx-auto mt-4 bg-red-950/40 border border-red-800/60 rounded-2xl p-4 text-left">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-200/90 text-sm leading-relaxed">
                This browser cannot encode H.264 video (WebCodecs VideoEncoder is unavailable or refused
                both H.264 profiles). Try Chrome or Edge on desktop — Firefox and Safari do not yet expose
                everything this converter needs. Nothing was converted and nothing was uploaded.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-6 justify-center">
            <button
              onClick={convert}
              disabled={appState === AppState.PROCESSING || codec === null || codec === undefined || loaded.duration > MAX_SECONDS}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-gray-950 font-bold font-display text-sm transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              {appState === AppState.PROCESSING ? `Converting… ${progress}%` : 'Convert to MP4'}
            </button>
            <button
              onClick={reset}
              className="px-8 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 font-medium text-sm border border-gray-800 transition-colors"
            >
              Choose a different file
            </button>
          </div>

          {appState === AppState.PROCESSING && (
            <div className="max-w-xl mx-auto mt-6">
              <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-gray-500 text-xs text-center mt-2">
                Decoding and re-encoding frame by frame in your browser — keep this tab open.
              </p>
            </div>
          )}

          {result && (
            <div className="max-w-xl mx-auto mt-8 bg-gray-900 border border-cyan-900/60 rounded-3xl p-6 text-center">
              <p className="text-white font-display font-bold">Your MP4 is ready</p>
              <p className="text-gray-400 text-sm mt-1">
                {(result.size / 1024 / 1024).toFixed(2)} MB · H.264 · {loaded.width - (loaded.width % 2)}×
                {loaded.height - (loaded.height % 2)} · 30 fps · no audio track
              </p>
              <a
                href={result.url}
                download={loaded.name.replace(/\.webm$/i, '') + '.mp4'}
                className="inline-flex items-center gap-2 mt-4 px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-gray-950 font-bold font-display text-sm transition-colors"
              >
                <Download className="w-4 h-4" /> Download MP4
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WebmToMp4Tool;
