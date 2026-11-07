import React, { useEffect, useRef } from 'react';

/**
 * Animated screencast demo for the homepage hero — a faithful port of
 * the approved standalone preview (artifact:
 * animated-screencast-demo-homepage-preview). A browser-framed,
 * self-playing 14-second loop drawn entirely in code (no video file):
 * a cursor drops sample-clip.mp4 in, the clip plays with a live
 * timecode, the cursor picks the 0.5s interval, clicks Extract, 12
 * frame thumbnails (real snapshots of the animated clip at their
 * printed timestamps) pop into the results grid, the cursor clicks
 * Download, and a "frames.zip saved" toast appears.
 * prefers-reduced-motion visitors get the static completed frame.
 */

const LOOP = 14000;
const FRAMES = 12;
const FRAME_EVERY = 400;
const EXTRACT_START = 5400;
const CLIP_LEN = 6;

function fmtTC(v: number): string {
  const m = Math.floor(v / 60);
  const s = v - m * 60;
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s.toFixed(1)}`;
}
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number) => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const frac = (x: number) => x - Math.floor(x);

function cloud(c: CanvasRenderingContext2D, x: number, y: number, r: number) {
  c.beginPath();
  c.arc(x, y, r, 0, 7);
  c.arc(x + r * 1.05, y + r * 0.18, r * 0.72, 0, 7);
  c.arc(x - r * 1.05, y + r * 0.2, r * 0.66, 0, 7);
  c.fill();
}
function ridge(
  c: CanvasRenderingContext2D, w: number, h: number,
  base: number, amp: number, off: number, color: string,
) {
  c.beginPath();
  c.moveTo(0, h);
  for (let x = 0; x <= w; x += 8) {
    c.lineTo(x, h * base - Math.sin((x + off) / (w * 0.32)) * h * amp - Math.sin((x + off) / (w * 0.11)) * h * amp * 0.35);
  }
  c.lineTo(w, h);
  c.closePath();
  c.fillStyle = color;
  c.fill();
}
function drawScene(c: CanvasRenderingContext2D, w: number, h: number, v: number) {
  const prog = v / CLIP_LEN;
  const sky = c.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#3f9bd8');
  sky.addColorStop(0.62, '#a8dcf2');
  sky.addColorStop(1, '#e8f7ee');
  c.fillStyle = sky;
  c.fillRect(0, 0, w, h);
  const sx = w * (0.12 + 0.72 * prog);
  const sy = h * 0.26 - Math.sin(prog * Math.PI) * h * 0.07;
  const g = c.createRadialGradient(sx, sy, 4, sx, sy, h * 0.34);
  g.addColorStop(0, 'rgba(255,214,90,.95)');
  g.addColorStop(0.25, 'rgba(255,205,80,.55)');
  g.addColorStop(1, 'rgba(255,205,80,0)');
  c.fillStyle = g;
  c.fillRect(0, 0, w, h);
  c.beginPath();
  c.arc(sx, sy, h * 0.075, 0, 7);
  c.fillStyle = '#ffd94d';
  c.fill();
  c.fillStyle = 'rgba(255,255,255,.92)';
  cloud(c, w * frac(0.15 + v * 0.03), h * 0.18, h * 0.075);
  cloud(c, w * frac(0.62 + v * 0.021), h * 0.11, h * 0.055);
  cloud(c, w * frac(0.85 + v * 0.037), h * 0.3, h * 0.045);
  ridge(c, w, h, 0.66, 0.05, v * 6, '#7dbb7f');
  ridge(c, w, h, 0.78, 0.07, v * 11 + 40, '#4d9959');
  c.fillStyle = '#3c8a4c';
  c.fillRect(0, h * 0.865, w, h * 0.135);
  c.fillStyle = 'rgba(255,255,255,.16)';
  c.fillRect(0, h * 0.865, w, 2);
  const bx = w * (0.08 + 0.84 * prog);
  const bounce = Math.abs(Math.sin(v * 2.4));
  const by = h * 0.865 - 12 - bounce * h * 0.34;
  c.beginPath();
  c.ellipse(bx, h * 0.875, 20 + (1 - bounce) * 10, 4.5, 0, 0, 7);
  c.fillStyle = 'rgba(10,40,20,.28)';
  c.fill();
  c.beginPath();
  c.arc(bx, by, h * 0.052, 0, 7);
  const bg2 = c.createRadialGradient(bx - 6, by - 7, 2, bx, by, h * 0.055);
  bg2.addColorStop(0, '#ff9a7a');
  bg2.addColorStop(1, '#d63c2a');
  c.fillStyle = bg2;
  c.fill();
}

type Anchor = { x: number; y: number };

const HeroScreencast: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const filechipRef = useRef<HTMLSpanElement>(null);
  const upbarRef = useRef<HTMLSpanElement>(null);
  const upfillRef = useRef<HTMLElement>(null);
  const fnameRef = useRef<HTMLSpanElement>(null);
  const fmetaRef = useRef<HTMLSpanElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const playFillRef = useRef<HTMLDivElement>(null);
  const playHeadRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<HTMLSpanElement>(null);
  const opt1Ref = useRef<HTMLSpanElement>(null);
  const opt05Ref = useRef<HTMLSpanElement>(null);
  const extractRef = useRef<HTMLButtonElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const progFillRef = useRef<HTMLElement>(null);
  const progStatRef = useRef<HTMLSpanElement>(null);
  const progPctRef = useRef<HTMLSpanElement>(null);
  const dlRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const fzMetaRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<SVGSVGElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<{ cell: HTMLDivElement; img: HTMLImageElement }[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const capC = document.createElement('canvas');
    capC.width = 480;
    capC.height = 300;
    const capX = capC.getContext('2d');
    const captures: Record<number, string> = {};
    const captureFrame = (idx: number): string => {
      if (captures[idx]) return captures[idx];
      if (capX) drawScene(capX, capC.width, capC.height, idx * 0.5);
      captures[idx] = capC.toDataURL('image/png');
      return captures[idx];
    };

    const anchors: Record<string, Anchor> = {};
    const centre = (el: Element | null): Anchor => {
      if (!el) return { x: 0, y: 0 };
      const sr = stage.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { x: r.left - sr.left + r.width / 2, y: r.top - sr.top + r.height / 2 };
    };
    const measure = () => {
      anchors.drop = centre(dropzoneRef.current);
      anchors.opt = centre(opt05Ref.current);
      anchors.extract = centre(extractRef.current);
      anchors.download = centre(dlRef.current);
      const sr = stage.getBoundingClientRect();
      const gr = gridRef.current?.getBoundingClientRect();
      anchors.grid = gr
        ? { x: gr.left - sr.left + gr.width * 0.5, y: gr.top - sr.top + 14 }
        : { x: sr.width / 2, y: sr.height - 60 };
      anchors.rest = { x: sr.width - 54, y: sr.height - 46 };
      anchors.start = { x: sr.width * 0.72, y: sr.height * 0.6 };
    };
    const path: { t: number; a: string }[] = [
      { t: 0, a: 'start' }, { t: 750, a: 'drop' }, { t: 1750, a: 'drop' },
      { t: 2600, a: 'start' }, { t: 3600, a: 'opt' }, { t: 4500, a: 'opt' },
      { t: 5150, a: 'extract' }, { t: 6100, a: 'grid' }, { t: 10100, a: 'grid' },
      { t: 10900, a: 'download' }, { t: 12100, a: 'download' },
      { t: 13100, a: 'rest' }, { t: 14000, a: 'rest' },
    ];
    const clicks = [1000, 4300, 5350, 11250];
    const cursorPos = (t: number): Anchor | null => {
      for (let i = 0; i < path.length - 1; i++) {
        if (t >= path[i].t && t <= path[i + 1].t) {
          const k = smooth((t - path[i].t) / (path[i + 1].t - path[i].t));
          const A = anchors[path[i].a];
          const B = anchors[path[i + 1].a];
          if (!A || !B) return null;
          return {
            x: lerp(A.x, B.x, k),
            y: lerp(A.y, B.y, k) - Math.sin(k * Math.PI) * 14,
          };
        }
      }
      return anchors[path[path.length - 1].a] || null;
    };

    const lastClickFired: Record<number, boolean> = {};
    let playing = !reduced;

    const render = (t: number) => {
      const up = clamp01((t - 1200) / 700);
      filechipRef.current?.classList.toggle('hidden', !(t >= 1080 && t < 13300));
      filechipRef.current?.classList.toggle('inline-flex', t >= 1080 && t < 13300);
      upbarRef.current?.classList.toggle('hidden', !(t >= 1200 && t < 2000));
      if (upfillRef.current) upfillRef.current.style.width = `${(up * 100).toFixed(1)}%`;
      const loaded = t >= 1950;
      if (dropzoneRef.current) {
        dropzoneRef.current.style.opacity = t >= 1800 ? '0' : '1';
        dropzoneRef.current.style.pointerEvents = t >= 1800 ? 'none' : 'auto';
      }
      if (fnameRef.current) fnameRef.current.textContent = loaded ? 'sample-clip.mp4' : '\u00A0';
      if (fmetaRef.current) fmetaRef.current.textContent = loaded ? '6.0s · 1280 × 720 · 12.4 MB' : '';

      const vt = t < 2000 ? 0 : t > 8000 ? CLIP_LEN : (t - 2000) / 1000;
      drawScene(ctx, canvas.width, canvas.height, vt);
      if (tcRef.current) tcRef.current.textContent = fmtTC(vt);
      const played = (vt / CLIP_LEN) * 100;
      if (playFillRef.current) playFillRef.current.style.width = `${played}%`;
      if (playHeadRef.current) playHeadRef.current.style.left = `${played}%`;
      if (recRef.current) recRef.current.style.display = t >= 2000 && t < 10200 ? 'inline-flex' : 'none';

      const intSel = t >= 4300 && t < 13350;
      opt05Ref.current?.classList.toggle('hs-opt-sel', intSel);
      opt1Ref.current?.classList.toggle('hs-opt-sel', !intSel);

      const extractBtn = extractRef.current;
      if (extractBtn) {
        extractBtn.style.transform = t >= 5300 && t < 5480 ? 'scale(.965)' : '';
        extractBtn.textContent =
          t >= EXTRACT_START && t < 10200 ? 'Extracting…' : t >= 10200 ? 'Extract again' : 'Extract frames';
        extractBtn.disabled = t < 1950 || (t >= EXTRACT_START && t < 10200);
        extractBtn.style.opacity = extractBtn.disabled && t >= EXTRACT_START && t < 10200 ? '0.85' : '';
      }

      const ep = clamp01((t - EXTRACT_START) / (FRAME_EVERY * FRAMES));
      progRef.current?.classList.toggle('hidden', !(t >= EXTRACT_START && t < 13350));
      if (progFillRef.current) progFillRef.current.style.width = `${(ep * 100).toFixed(1)}%`;
      if (progPctRef.current) progPctRef.current.textContent = `${Math.round(ep * 100)}%`;
      let shown = 0;
      for (let i = 0; i < FRAMES; i++) {
        const at = EXTRACT_START + 250 + i * FRAME_EVERY;
        const on = t >= at;
        if (on) shown++;
        const entry = cellRefs.current[i];
        if (!entry) continue;
        const isFilled = entry.cell.dataset.filled === '1';
        if (on && !isFilled) {
          entry.img.src = captureFrame(i);
          entry.cell.dataset.filled = '1';
          entry.cell.classList.add('hs-filled');
          if (playing && !reduced) {
            entry.cell.classList.remove('hs-pop');
            void entry.cell.offsetWidth;
            entry.cell.classList.add('hs-pop');
          }
        } else if (!on && isFilled) {
          entry.cell.dataset.filled = '0';
          entry.cell.classList.remove('hs-filled', 'hs-pop');
        }
      }
      if (progStatRef.current) {
        progStatRef.current.textContent =
          t >= 10200 ? 'Done — 12 frames' : shown > 0 ? `Frame ${shown} of 12` : 'Extracting…';
      }
      if (fzMetaRef.current) {
        fzMetaRef.current.textContent =
          t < EXTRACT_START
            ? loaded
              ? 'ready — 12 frames at 0.5s intervals'
              : 'waiting for a video…'
            : t >= 10200
              ? '12 frames · PNG · 1280 × 720'
              : `${shown} of 12 frames`;
      }

      const dl = dlRef.current;
      if (dl) {
        const ready = t >= 10200 && t < 13350;
        dl.classList.toggle('hs-dl-ready', ready);
        dl.style.transform = t >= 11200 && t < 11380 ? 'scale(.965)' : '';
      }
      toastRef.current?.classList.toggle('hs-toast-show', t >= 11450 && t < 13250);

      if (!reduced) {
        const pos = cursorPos(t);
        if (pos && cursorRef.current) {
          cursorRef.current.style.transform = `translate(${pos.x - 3}px, ${pos.y - 2}px)`;
        }
        for (const ct of clicks) {
          if (playing && t >= ct && t < ct + 90 && !lastClickFired[ct]) {
            lastClickFired[ct] = true;
            if (pos && rippleRef.current) {
              rippleRef.current.style.left = `${pos.x}px`;
              rippleRef.current.style.top = `${pos.y}px`;
              rippleRef.current.classList.remove('hs-ripple-go');
              void rippleRef.current.offsetWidth;
              rippleRef.current.classList.add('hs-ripple-go');
            }
          }
          if (t < ct - 200) lastClickFired[ct] = false;
        }
      }
    };

    measure();
    let tNow = reduced ? 10600 : 0;
    render(tNow);

    if (reduced) {
      const onResize = () => {
        measure();
        render(10600);
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    let raf = 0;
    let lastTs: number | null = null;
    let visible = true;
    const tick = (ts: number) => {
      if (lastTs == null) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;
      if (playing && visible) {
        tNow += dt;
        if (tNow >= LOOP) {
          tNow -= LOOP;
          for (const k of Object.keys(lastClickFired)) delete lastClickFired[Number(k)];
        }
      }
      render(tNow);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 },
    );
    io.observe(stage);
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    // Re-measure after fonts/layout settle, like the preview did.
    const settle = requestAnimationFrame(() => {
      measure();
      render(tNow);
    });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(settle);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const optCls =
    'border border-gray-700 bg-gray-800/60 text-gray-300 rounded-lg px-2.5 py-1.5 text-[13px] font-bold font-mono';
  return (
    <div className="bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden text-left">
      <style>{`
        .hs-opt-sel { background: #22d3ee !important; color: #082f3a !important; border-color: #22d3ee !important; }
        .hs-filled { border-style: solid !important; border-color: #374151 !important; }
        .hs-filled img, .hs-filled .hs-cap { opacity: 1 !important; }
        .hs-pop { animation: hs-pop .45s cubic-bezier(.2,1.6,.4,1); }
        @keyframes hs-pop { 0% { transform: scale(.8); } 100% { transform: scale(1); } }
        .hs-ripple-go { animation: hs-rip .55s ease-out; }
        @keyframes hs-rip { 0% { opacity: .9; transform: translate(-50%,-50%) scale(.4); } 100% { opacity: 0; transform: translate(-50%,-50%) scale(1.25); } }
        .hs-toast-show { opacity: 1 !important; transform: translate(-50%, 0) !important; }
        .hs-dl-ready { background: #22d3ee !important; color: #082f3a !important; border: 1.5px solid #22d3ee !important; }
        .hs-blink { animation: hs-blink 1.6s ease-in-out infinite; }
        @keyframes hs-blink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        @media (prefers-reduced-motion: reduce) {
          .hs-pop, .hs-blink { animation: none !important; }
        }
      `}</style>

      {/* Browser chrome */}
      <div className="flex items-center gap-3 bg-gray-800/80 px-4 py-2.5 border-b border-gray-700/70" aria-hidden="true">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e5484d]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#f2a93b]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#46a758]" />
        </div>
        <div className="flex-1 max-w-md mx-auto bg-gray-900 border border-gray-700 rounded-md px-3 py-1 text-[12px] text-gray-400 font-mono text-center truncate">
          videotoimagesequence.online
        </div>
        <div className="w-12 hidden sm:block" />
      </div>

      {/* Stage */}
      <div ref={stageRef} className="relative bg-gray-900" role="img" aria-label="Animated demo: a video clip is dropped in, frames are extracted every half second into a grid of 12 PNG stills, and the set is downloaded as frames.zip.">
        <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-gray-800 bg-gray-900">
          <span className="font-display font-bold text-sm text-white">Video to Image Sequence</span>
          <span className="text-xs text-gray-500 font-semibold">Extractor</span>
          <span className="inline-flex items-center gap-1.5 ml-auto font-mono text-[11px] font-bold tracking-widest text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 hs-blink" />
            LIVE DEMO
          </span>
        </div>

        <div className="grid md:grid-cols-[1.55fr_1fr]">
          {/* Player side */}
          <div className="p-4">
            <div className="relative">
              <div className="relative rounded-[10px] overflow-hidden bg-[#0b1c26] aspect-video border border-gray-700">
                <canvas ref={canvasRef} width={640} height={360} className="absolute inset-0 w-full h-full block" />
                <span
                  ref={recRef}
                  style={{ display: 'none' }}
                  className="absolute top-2.5 left-2.5 items-center gap-1.5 bg-[#051812]/70 bg-black/60 text-white font-mono text-[11px] font-bold tracking-widest px-2 py-1 rounded-md"
                >
                  <i className="w-2 h-2 rounded-full bg-red-500 hs-blink inline-block" /> REC
                </span>
                <span ref={tcRef} className="absolute top-2.5 right-2.5 bg-black/70 text-[#eaf6f8] font-mono text-xs font-bold px-2 py-1 rounded-md tracking-wide">
                  00:00.0
                </span>
                <div className="absolute left-0 right-0 bottom-0 h-[22px] flex items-end" aria-hidden="true">
                  <div className="relative h-[5px] flex-1 bg-white/30">
                    <div ref={playFillRef} className="absolute left-0 top-0 bottom-0 bg-amber-500" style={{ width: '0%' }} />
                    <div
                      ref={playHeadRef}
                      className="absolute top-1/2 w-[11px] h-[11px] rounded-full bg-white shadow"
                      style={{ left: '0%', transform: 'translate(-50%, -50%)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Dropzone overlay */}
              <div
                ref={dropzoneRef}
                className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-2 text-center p-4 bg-gray-900 border-2 border-dashed border-gray-700 rounded-[10px] transition-opacity duration-300"
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 16V4m0 0 4 4m-4-4L8 8" />
                  <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
                </svg>
                <span className="font-display font-bold text-[15px] text-white">Drop a video here</span>
                <span className="text-[13px] text-gray-500 font-semibold">MP4, WebM or MOV — processed locally, never uploaded</span>
                <span
                  ref={filechipRef}
                  className="hidden items-center gap-2 mt-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 font-mono text-xs font-bold text-gray-300"
                >
                  sample-clip.mp4 · 12.4 MB
                </span>
                <span ref={upbarRef} className="hidden w-[min(240px,80%)] h-1.5 rounded-full bg-gray-700 overflow-hidden mt-2.5">
                  <i ref={upfillRef} className="block h-full bg-cyan-400" style={{ width: '0%' }} />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 mt-3 text-[13px] text-gray-500 font-semibold">
              <span ref={fnameRef} className="font-mono text-gray-300 font-bold">&nbsp;</span>
              <span ref={fmetaRef} />
            </div>
          </div>

          {/* Control panel */}
          <div className="border-t md:border-t-0 md:border-l border-gray-800 bg-gray-900 p-4 flex flex-col gap-3.5">
            <div>
              <h3 className="m-0 text-xs font-extrabold tracking-widest uppercase text-gray-500">Extract every</h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span ref={opt1Ref} className={`${optCls} hs-opt-sel`}>1 sec</span>
                <span ref={opt05Ref} className={optCls}>0.5 sec</span>
                <span className={optCls}>2 sec</span>
                <span className={optCls}>Every frame</span>
              </div>
            </div>
            <div>
              <h3 className="m-0 text-xs font-extrabold tracking-widest uppercase text-gray-500">Format</h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className={`${optCls} hs-opt-sel`}>PNG</span>
                <span className={optCls}>JPG</span>
                <span className={optCls}>WebP</span>
              </div>
            </div>
            <button
              ref={extractRef}
              type="button"
              tabIndex={-1}
              className="w-full rounded-[10px] bg-cyan-400 text-[#082f3a] font-display font-extrabold text-[15px] py-3 transition-transform"
            >
              Extract frames
            </button>
            <div ref={progRef} className="hidden">
              <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                <i ref={progFillRef} className="block h-full bg-cyan-400 transition-[width] duration-150" style={{ width: '0%' }} />
              </div>
              <div className="flex justify-between mt-1.5 text-xs font-bold text-gray-400 font-mono">
                <span ref={progStatRef}>Extracting…</span>
                <span ref={progPctRef}>0%</span>
              </div>
            </div>
            <button
              ref={dlRef}
              type="button"
              tabIndex={-1}
              className="w-full rounded-[10px] font-display font-extrabold text-sm py-3 inline-flex items-center justify-center gap-2 bg-gray-800/60 border-[1.5px] border-dashed border-gray-600 text-gray-400 transition-all"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 4v12m0 0 4-4m-4 4-4-4" />
                <path d="M4 19h16" />
              </svg>
              Download all (.zip)
            </button>
            <p className="text-xs text-gray-500 font-semibold mt-auto">
              Frames are captured in the browser — the video never leaves the device.
            </p>
          </div>
        </div>

        {/* Frames grid */}
        <div className="border-t border-gray-800 bg-gray-900 px-4 py-3.5">
          <div className="flex items-baseline gap-2.5 mb-2.5">
            <b className="text-[13.5px] text-white">Extracted frames</b>
            <span ref={fzMetaRef} className="text-xs text-gray-500 font-semibold font-mono">waiting for a video…</span>
          </div>
          <div ref={gridRef} className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {Array.from({ length: FRAMES }, (_, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) {
                    const img = el.querySelector('img');
                    if (img) cellRefs.current[i] = { cell: el, img };
                  }
                }}
                data-filled="0"
                className="relative aspect-[16/10] rounded-lg overflow-hidden border-[1.5px] border-dashed border-gray-700 bg-gray-800/50 grid place-items-center text-gray-600 font-mono text-[11px] font-bold"
              >
                ·
                <img
                  alt={`Extracted frame at ${(i * 0.5).toFixed(1)} seconds`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0"
                />
                <span className="hs-cap absolute left-0 right-0 bottom-0 px-1.5 py-0.5 text-[10px] bg-black/70 text-[#eaf6f8] opacity-0 text-left font-mono">
                  {fmtTC(i * 0.5)} · PNG
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cursor, ripple, toast */}
        <div
          ref={rippleRef}
          className="absolute z-[19] w-[34px] h-[34px] rounded-full border-[2.5px] border-cyan-400 pointer-events-none opacity-0"
          style={{ transform: 'translate(-50%, -50%) scale(.4)' }}
          aria-hidden="true"
        />
        <svg
          ref={cursorRef}
          className="absolute z-20 w-[26px] h-[26px] left-0 top-0 pointer-events-none drop-shadow-[0_3px_5px_rgba(5,18,24,.45)]"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M5 3.5 19 12.2c.6.35.5 1.24-.17 1.48l-5.1 1.85-2.4 4.9c-.3.62-1.23.6-1.5-.03L5 4.6c-.14-.32-.1-.7 0-1.1Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.6" />
        </svg>
        <div
          ref={toastRef}
          className="absolute z-[21] left-1/2 bottom-4 bg-white text-gray-900 text-[13.5px] font-bold px-4 py-2.5 rounded-[10px] opacity-0 pointer-events-none inline-flex gap-2 items-center whitespace-nowrap shadow-2xl transition-all duration-300"
          style={{ transform: 'translate(-50%, 16px)' }}
          aria-hidden="true"
        >
          <span className="text-cyan-600 font-black">✓</span>
          <span>frames.zip saved — 12 PNG frames</span>
        </div>
      </div>
    </div>
  );
};

export default HeroScreencast;
