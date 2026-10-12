/**
 * Lightweight, incremental video metadata parser — runs 100% in the browser.
 *
 * Reads only the file HEAD (and, if the moov box is at the end of the file,
 * a TAIL slice) instead of loading the whole file into memory.
 * Supports ISO-BMFF containers (MP4 / MOV / M4V / 3GP) via a small box parser
 * and WebM/MKV via a minimal EBML reader. Everything else falls back to the
 * browser's <video> element metadata.
 */

export interface TrackInfo {
  type: 'video' | 'audio' | 'other';
  codec: string;
  codecTag: string;
  width?: number;
  height?: number;
  fps?: number;
  durationSec?: number;
  language?: string;
}

export interface VideoMetadata {
  fileName: string;
  fileSize: number;
  container: string;
  majorBrand?: string;
  durationSec?: number;
  width?: number;
  height?: number;
  fps?: number;
  videoCodec?: string;
  audioCodec?: string;
  bitrateKbps?: number;
  creationDateIso?: string;
  muxingApp?: string;
  writingApp?: string;
  tracks: TrackInfo[];
  bytesRead: number;
  notes: string[];
}

export const HEAD_BYTES = 2 * 1024 * 1024;
export const TAIL_BYTES = 4 * 1024 * 1024;

// ── low-level helpers ───────────────────────────────────────────────────────

function ascii(view: DataView, off: number, len: number): string {
  let s = '';
  for (let i = 0; i < len; i++) s += String.fromCharCode(view.getUint8(off + i));
  return s;
}

function u64(view: DataView, off: number): number {
  return view.getUint32(off) * 4294967296 + view.getUint32(off + 4);
}

interface Box {
  type: string;
  start: number; // box start (size field)
  size: number;
  dataStart: number; // first byte after size+type (+largesize)
}

function parseBoxes(view: DataView, start: number, end: number, maxBoxes = 400): Box[] {
  const boxes: Box[] = [];
  let off = start;
  while (off + 8 <= end && boxes.length < maxBoxes) {
    const size32 = view.getUint32(off);
    const type = ascii(view, off + 4, 4);
    let dataStart = off + 8;
    let boxSize = size32;
    if (size32 === 1) {
      if (off + 16 > end) break;
      boxSize = u64(view, off + 8);
      dataStart = off + 16;
    } else if (size32 === 0) {
      boxSize = end - off; // extends to end of buffer
    }
    if (!/^[\x20-\x7E]{4}$/.test(type)) break; // not a plausible box
    if (boxSize < 8) break;
    if (off + boxSize > end) break; // box runs past our buffer — stop here
    boxes.push({ type, start: off, size: boxSize, dataStart });
    off += boxSize;
  }
  return boxes;
}

const CONTAINER_BRANDS: Record<string, string> = {
  isom: 'MP4', iso2: 'MP4', iso3: 'MP4', iso4: 'MP4', iso5: 'MP4', iso6: 'MP4',
  mp41: 'MP4', mp42: 'MP4', avc1: 'MP4', 'M4V ': 'M4V', 'M4A ': 'M4A',
  qt: 'QuickTime (MOV)', '3gp4': '3GPP', '3gp5': '3GPP', '3gp6': '3GPP',
  '3g2a': '3GPP2', f4v: 'F4V', heic: 'HEIC', heix: 'HEIC', mif1: 'HEIF',
  isml: 'Smooth Streaming (MP4)',
};

const VIDEO_CODECS: Record<string, string> = {
  avc1: 'H.264 / AVC', avc3: 'H.264 / AVC',
  hev1: 'H.265 / HEVC', hvc1: 'H.265 / HEVC', thev: 'H.265 / HEVC',
  av01: 'AV1', vp09: 'VP9', vp08: 'VP8',
  mp4v: 'MPEG-4 Part 2', mp4s: 'MPEG-4',
  dva1: 'Dolby Vision (HEVC)', dvav: 'Dolby Vision (AVC)', dvh1: 'Dolby Vision (HEVC)',
  encv: 'Encrypted video',
};

const AUDIO_CODECS: Record<string, string> = {
  mp4a: 'AAC', 'ac-3': 'Dolby Digital (AC-3)', 'ec-3': 'Dolby Digital Plus (EC-3)',
  alac: 'Apple Lossless (ALAC)', Opus: 'Opus', '.mp3': 'MP3',
  sowt: 'PCM', twos: 'PCM', lpcm: 'PCM', mlpa: 'Dolby TrueHD', 'dts ': 'DTS',
};

const WEBM_CODECS: Record<string, string> = {
  V_VP9: 'VP9', V_VP8: 'VP8', V_AV1: 'AV1',
  'V_MPEGH/ISO/HEVC': 'H.265 / HEVC', 'V_MPEG4/ISO/AVC': 'H.264 / AVC',
  A_OPUS: 'Opus', A_VORBIS: 'Vorbis', A_AAC: 'AAC',
  A_AC3: 'Dolby Digital (AC-3)', 'A_EAC3': 'Dolby Digital Plus (EC-3)',
};

const MAC_EPOCH_OFFSET = 2082844800; // seconds between 1904-01-01 and 1970-01-01

function macTimeToIso(t: number): string | undefined {
  if (!t || t < MAC_EPOCH_OFFSET) return undefined;
  try {
    return new Date((t - MAC_EPOCH_OFFSET) * 1000).toISOString();
  } catch {
    return undefined;
  }
}

// ── ISO-BMFF (MP4 / MOV) parsing ────────────────────────────────────────────

interface FullBoxTimes {
  creation: number;
  timescale: number;
  duration: number;
}

function parseFullBoxTimes(view: DataView, start: number): FullBoxTimes {
  const version = view.getUint8(start);
  let off = start + 4; // version + flags
  let creation: number, timescale: number, duration: number;
  if (version === 1) {
    creation = u64(view, off); off += 8;
    off += 8; // modification
    timescale = view.getUint32(off); off += 4;
    duration = u64(view, off);
  } else {
    creation = view.getUint32(off); off += 4;
    off += 4; // modification
    timescale = view.getUint32(off); off += 4;
    duration = view.getUint32(off);
  }
  return { creation, timescale, duration };
}

function mdhdLanguage(view: DataView, start: number): string | undefined {
  const version = view.getUint8(start);
  const langOff = version === 1 ? start + 32 : start + 20;
  const code = view.getUint16(langOff);
  if (!code) return undefined;
  return [10, 5, 0]
    .map(shift => String.fromCharCode(((code >> shift) & 0x1f) + 0x60))
    .join('');
}

function parseTkhd(view: DataView, start: number): { width: number; height: number } {
  const version = view.getUint8(start);
  let off = start + 4;
  off += version === 1 ? 8 + 8 + 4 + 4 + 8 : 4 + 4 + 4 + 4 + 4;
  off += 2 + 2 + 2 + 2; // layer, alternate_group, volume, reserved
  off += 36; // display matrix
  const width = Math.round(view.getUint32(off) / 65536);
  const height = Math.round(view.getUint32(off + 4) / 65536);
  return { width, height };
}

function parseSttsFps(view: DataView, start: number, end: number, timescale: number): number | undefined {
  if (start + 8 > end) return undefined;
  const entryCount = view.getUint32(start + 4);
  if (entryCount <= 0 || entryCount > 100000) return undefined;
  let off = start + 8;
  let totalSamples = 0;
  let totalDelta = 0;
  for (let i = 0; i < entryCount && off + 8 <= end; i++) {
    const count = view.getUint32(off);
    const delta = view.getUint32(off + 4);
    off += 8;
    if (count > 10000000) return undefined;
    totalSamples += count;
    totalDelta += count * delta;
  }
  if (totalSamples <= 0 || totalDelta <= 0 || timescale <= 0) return undefined;
  const fps = (timescale * totalSamples) / totalDelta;
  return fps > 0 && fps < 1000 ? Math.round(fps * 100) / 100 : undefined;
}

function parseMoov(view: DataView, moov: Box): Partial<VideoMetadata> & { tracks: TrackInfo[] } {
  const out: Partial<VideoMetadata> & { tracks: TrackInfo[] } = { tracks: [] };
  const moovEnd = moov.dataStart + (moov.size - (moov.dataStart - moov.start));
  const children = parseBoxes(view, moov.dataStart, Math.min(moovEnd, view.byteLength));

  for (const child of children) {
    if (child.type === 'mvhd') {
      const t = parseFullBoxTimes(view, child.dataStart);
      if (t.timescale > 0 && t.duration > 0) {
        out.durationSec = Math.round((t.duration / t.timescale) * 100) / 100;
      }
      const iso = macTimeToIso(t.creation);
      if (iso) out.creationDateIso = iso;
    }
  }

  for (const child of children) {
    if (child.type !== 'trak') continue;
    const trakEnd = child.dataStart + (child.size - (child.dataStart - child.start));
    const trakKids = parseBoxes(view, child.dataStart, Math.min(trakEnd, view.byteLength));
    const track: TrackInfo = { type: 'other', codec: 'Unknown', codecTag: '' };

    for (const tk of trakKids) {
      if (tk.type === 'tkhd') {
        const { width, height } = parseTkhd(view, tk.dataStart);
        if (width > 0 && height > 0) { track.width = width; track.height = height; }
      } else if (tk.type === 'mdia') {
        const mdiaEnd = tk.dataStart + (tk.size - (tk.dataStart - tk.start));
        const mdiaKids = parseBoxes(view, tk.dataStart, Math.min(mdiaEnd, view.byteLength));
        let timescale = 0;
        for (const mk of mdiaKids) {
          if (mk.type === 'mdhd') {
            const t = parseFullBoxTimes(view, mk.dataStart);
            timescale = t.timescale;
            if (t.timescale > 0 && t.duration > 0) {
              track.durationSec = Math.round((t.duration / t.timescale) * 100) / 100;
            }
            const lang = mdhdLanguage(view, mk.dataStart);
            if (lang) track.language = lang;
          } else if (mk.type === 'hdlr') {
            const handler = ascii(view, mk.dataStart + 8, 4);
            track.type = handler === 'vide' ? 'video' : handler === 'soun' ? 'audio' : 'other';
          } else if (mk.type === 'minf') {
            const minfEnd = mk.dataStart + (mk.size - (mk.dataStart - mk.start));
            const minfKids = parseBoxes(view, mk.dataStart, Math.min(minfEnd, view.byteLength));
            for (const stbl of minfKids) {
              if (stbl.type !== 'stbl') continue;
              const stblEnd = stbl.dataStart + (stbl.size - (stbl.dataStart - stbl.start));
              const stblKids = parseBoxes(view, stbl.dataStart, Math.min(stblEnd, view.byteLength), 20);
              for (const sk of stblKids) {
                if (sk.type === 'stsd') {
                  const codecTag = ascii(view, sk.dataStart + 12, 4);
                  track.codecTag = codecTag;
                  track.codec = VIDEO_CODECS[codecTag] || AUDIO_CODECS[codecTag] || codecTag;
                  // stsd: version+flags(4) + entry_count(4), entry = size(4)+type(4);
                  // video sample entry: reserved(6)+data_ref(2)+pre_defined/reserved(16)
                  // → width/height at entry+32 = dataStart+40/42
                  if (track.type === 'video' && sk.dataStart + 44 <= view.byteLength) {
                    const w = view.getUint16(sk.dataStart + 40);
                    const h = view.getUint16(sk.dataStart + 42);
                    if (w > 0 && h > 0) { track.width = w; track.height = h; }
                  }
                } else if (sk.type === 'stts' && track.type === 'video' && timescale > 0) {
                  const sttsEnd = sk.dataStart + (sk.size - (sk.dataStart - sk.start));
                  const fps = parseSttsFps(view, sk.dataStart, Math.min(sttsEnd, view.byteLength), timescale);
                  if (fps) track.fps = fps;
                }
              }
            }
          }
        }
      }
    }
    if (track.codecTag) out.tracks.push(track);
  }

  const videoTrack = out.tracks.find(t => t.type === 'video');
  const audioTrack = out.tracks.find(t => t.type === 'audio');
  if (videoTrack) {
    out.videoCodec = videoTrack.codec;
    if (videoTrack.width) { out.width = videoTrack.width; out.height = videoTrack.height; }
    if (videoTrack.fps) out.fps = videoTrack.fps;
    if (videoTrack.durationSec) out.durationSec = out.durationSec ?? videoTrack.durationSec;
  }
  if (audioTrack) out.audioCodec = audioTrack.codec;
  return out;
}

// ── EBML (WebM / MKV) parsing ───────────────────────────────────────────────

function ebmlId(view: DataView, pos: number): { id: number; len: number } | null {
  if (pos >= view.byteLength) return null;
  const b0 = view.getUint8(pos);
  let len = 1, mask = 0x80;
  while (len <= 4 && !(b0 & mask)) { len++; mask >>= 1; }
  if (len > 4) return null;
  let id = 0;
  for (let i = 0; i < len; i++) id = id * 256 + view.getUint8(pos + i);
  return { id, len };
}

function ebmlSize(view: DataView, pos: number): { size: number; len: number } | null {
  if (pos >= view.byteLength) return null;
  const b0 = view.getUint8(pos);
  let len = 1, mask = 0x80;
  while (len <= 8 && !(b0 & mask)) { len++; mask >>= 1; }
  if (len > 8) return null;
  let size = b0 & (mask - 1);
  for (let i = 1; i < len; i++) size = size * 256 + view.getUint8(pos + i);
  if (size === Math.pow(2, 7 * len) - 1) return { size: -1, len }; // unknown size
  return { size, len };
}

function ebmlUint(view: DataView, pos: number, len: number): number {
  let v = 0;
  for (let i = 0; i < len; i++) v = v * 256 + view.getUint8(pos + i);
  return v;
}

function ebmlFloat(view: DataView, pos: number, len: number): number {
  if (len === 4) return view.getFloat32(pos);
  if (len === 8) return view.getFloat64(pos);
  return NaN;
}

function ebmlString(view: DataView, pos: number, len: number): string {
  const bytes = new Uint8Array(view.buffer, view.byteOffset + pos, len);
  let end = len;
  while (end > 0 && bytes[end - 1] === 0) end--;
  try {
    return new TextDecoder().decode(bytes.subarray(0, end)).trim();
  } catch {
    return '';
  }
}

// Element IDs we care about
const E = {
  EBML: 0x1a45dfa3, SEGMENT: 0x18538067, INFO: 0x1549a966,
  TIMECODESCALE: 0x2ad7b1, DURATION: 0x4489, MUXINGAPP: 0x4d80,
  WRITINGAPP: 0x5741, DATEUTC: 0x4461, DOCTYPE: 0x4282,
  TRACKS: 0x1654ae6b, TRACKENTRY: 0xae, TRACKTYPE: 0x83,
  CODECID: 0x86, VIDEO: 0xe0, AUDIO: 0xe1,
  PIXELWIDTH: 0xb0, PIXELHEIGHT: 0xba, SAMPLINGFREQ: 0xb5,
};

function parseWebm(view: DataView, notes: string[]): Partial<VideoMetadata> & { tracks: TrackInfo[] } {
  const out: Partial<VideoMetadata> & { tracks: TrackInfo[] } = { tracks: [] };
  let timecodeScale = 1000000;

  const walk = (start: number, end: number, depth: number): void => {
    if (depth > 8) return;
    let pos = start;
    let guard = 0;
    while (pos < end && guard++ < 20000) {
      const idR = ebmlId(view, pos);
      if (!idR) break;
      const sizeR = ebmlSize(view, pos + idR.len);
      if (!sizeR) break;
      const dataPos = pos + idR.len + sizeR.len;
      const dataEnd = sizeR.size < 0 ? end : Math.min(end, dataPos + sizeR.size);
      if (dataPos > end) break;
      const dlen = Math.max(0, dataEnd - dataPos);

      switch (idR.id) {
        case E.DOCTYPE: {
          const dt = ebmlString(view, dataPos, dlen).toLowerCase();
          out.container = dt === 'webm' ? 'WebM' : dt === 'matroska' ? 'Matroska (MKV)' : `EBML (${dt || 'unknown'})`;
          break;
        }
        case E.TIMECODESCALE:
          timecodeScale = ebmlUint(view, dataPos, dlen) || 1000000;
          break;
        case E.DURATION: {
          const d = ebmlFloat(view, dataPos, dlen);
          if (Number.isFinite(d)) out.durationSec = Math.round((d * timecodeScale) / 1e7) / 100;
          break;
        }
        case E.DATEUTC: {
          const ns = ebmlUint(view, dataPos, dlen);
          const ms2001 = 978307200000;
          const t = new Date(ms2001 + Math.round(ns / 1e6));
          if (!Number.isNaN(t.getTime())) out.creationDateIso = t.toISOString();
          break;
        }
        case E.MUXINGAPP: out.muxingApp = ebmlString(view, dataPos, dlen); break;
        case E.WRITINGAPP: out.writingApp = ebmlString(view, dataPos, dlen); break;
        case E.TRACKENTRY: {
          const track: TrackInfo = { type: 'other', codec: 'Unknown', codecTag: '' };
          walkTrackEntry(dataPos, dataEnd, track);
          if (track.codecTag) out.tracks.push(track);
          break;
        }
        case E.EBML:
        case E.SEGMENT:
        case E.INFO:
        case E.TRACKS:
          walk(dataPos, dataEnd, depth + 1);
          break;
        default:
          break; // skip unknown elements via their declared size
      }
      pos = sizeR.size < 0 ? end : dataPos + sizeR.size;
    }
  };

  const walkTrackEntry = (start: number, end: number, track: TrackInfo): void => {
    let pos = start;
    let guard = 0;
    while (pos < end && guard++ < 5000) {
      const idR = ebmlId(view, pos);
      if (!idR) break;
      const sizeR = ebmlSize(view, pos + idR.len);
      if (!sizeR) break;
      const dataPos = pos + idR.len + sizeR.len;
      const dataEnd = sizeR.size < 0 ? end : Math.min(end, dataPos + sizeR.size);
      const dlen = Math.max(0, dataEnd - dataPos);
      switch (idR.id) {
        case E.TRACKTYPE: {
          const t = ebmlUint(view, dataPos, dlen);
          track.type = t === 1 ? 'video' : t === 2 ? 'audio' : 'other';
          break;
        }
        case E.CODECID: {
          const cid = ebmlString(view, dataPos, dlen);
          track.codecTag = cid;
          track.codec = WEBM_CODECS[cid] || cid;
          break;
        }
        case E.VIDEO: {
          let p = dataPos;
          let g2 = 0;
          while (p < dataEnd && g2++ < 200) {
            const i2 = ebmlId(view, p);
            if (!i2) break;
            const s2 = ebmlSize(view, p + i2.len);
            if (!s2) break;
            const dp = p + i2.len + s2.len;
            if (i2.id === E.PIXELWIDTH) track.width = ebmlUint(view, dp, Math.max(0, (s2.size < 0 ? dataEnd : dp + s2.size) - dp));
            else if (i2.id === E.PIXELHEIGHT) track.height = ebmlUint(view, dp, Math.max(0, (s2.size < 0 ? dataEnd : dp + s2.size) - dp));
            p = s2.size < 0 ? dataEnd : dp + s2.size;
          }
          break;
        }
        default:
          break;
      }
      pos = sizeR.size < 0 ? end : dataPos + sizeR.size;
    }
  };

  walk(0, view.byteLength, 0);

  const videoTrack = out.tracks.find(t => t.type === 'video');
  const audioTrack = out.tracks.find(t => t.type === 'audio');
  if (videoTrack) {
    out.videoCodec = videoTrack.codec;
    if (videoTrack.width) { out.width = videoTrack.width; out.height = videoTrack.height; }
  }
  if (audioTrack) out.audioCodec = audioTrack.codec;
  if (!out.container) out.container = 'WebM / Matroska (EBML)';
  if (!out.tracks.length) notes.push('Track details were not found in the file header.');
  return out;
}

// ── public entry point ──────────────────────────────────────────────────────

async function readSlice(file: File, start: number, end: number): Promise<DataView> {
  const buf = await file.slice(start, Math.min(end, file.size)).arrayBuffer();
  return new DataView(buf);
}

function findMoovInTail(view: DataView): Box | null {
  // Scan for a plausible 'moov' box: size field followed by the ASCII tag.
  for (let i = 4; i + 4 <= view.byteLength - 4; i++) {
    if (
      view.getUint8(i) === 0x6d && // m
      view.getUint8(i + 1) === 0x6f && // o
      view.getUint8(i + 2) === 0x6f && // o
      view.getUint8(i + 3) === 0x76 // v
    ) {
      const boxStart = i - 4;
      const size = view.getUint32(boxStart);
      if (size >= 8 && boxStart + size <= view.byteLength + 16) {
        const dataStart = boxStart + 8;
        const claimedEnd = Math.min(boxStart + size, view.byteLength);
        return { type: 'moov', start: boxStart, size: claimedEnd - boxStart, dataStart };
      }
    }
  }
  return null;
}

export async function inspectVideoFile(file: File): Promise<VideoMetadata> {
  const notes: string[] = [];
  const meta: VideoMetadata = {
    fileName: file.name,
    fileSize: file.size,
    container: 'Unknown',
    tracks: [],
    bytesRead: 0,
    notes,
  };

  const head = await readSlice(file, 0, HEAD_BYTES);
  meta.bytesRead = head.byteLength;
  const headBoxes = parseBoxes(head, 0, head.byteLength, 12);

  const isEbml = head.byteLength >= 4 && ebmlId(head, 0)?.id === E.EBML;

  if (isEbml) {
    const parsed = parseWebm(head, notes);
    Object.assign(meta, parsed, { tracks: parsed.tracks });
    notes.push('WebM/MKV metadata was parsed from the EBML file header.');
  } else {
    const ftyp = headBoxes.find(b => b.type === 'ftyp');
    if (ftyp) {
      const major = ascii(head, ftyp.dataStart, 4).trim();
      meta.majorBrand = major;
      meta.container = CONTAINER_BRANDS[major] || `ISO-BMFF (${major})`;
    } else if (file.name.toLowerCase().endsWith('.mov')) {
      meta.container = 'QuickTime (MOV)';
    } else {
      notes.push('No ftyp box found in the file header; container identified from the file extension.');
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      meta.container = ext ? ext.toUpperCase() : 'Unknown';
    }

    let moov = headBoxes.find(b => b.type === 'moov');
    if (!moov && meta.container !== 'Unknown') {
      // moov is often at the end of the file (non-faststart exports)
      const tailStart = Math.max(0, file.size - TAIL_BYTES);
      const tail = await readSlice(file, tailStart, file.size);
      meta.bytesRead += tail.byteLength;
      moov = findMoovInTail(tail);
      if (moov) {
        notes.push('The moov box was found at the end of the file, so the file tail was read too — the file was still never fully loaded.');
        const parsed = parseMoov(tail, moov);
        Object.assign(meta, parsed, { tracks: parsed.tracks });
      } else {
        notes.push('Could not locate the moov box in the file head or tail — container-level metadata is unavailable.');
      }
    } else if (moov) {
      const parsed = parseMoov(head, moov);
      Object.assign(meta, parsed, { tracks: parsed.tracks });
    }
  }

  // Browser fallback / confirmation for duration + dimensions on playable files
  try {
    const url = URL.createObjectURL(file);
    const dims = await new Promise<{ duration: number; width: number; height: number }>((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      const timer = window.setTimeout(() => { URL.revokeObjectURL(url); reject(new Error('timeout')); }, 15000);
      video.onloadedmetadata = () => {
        window.clearTimeout(timer);
        URL.revokeObjectURL(url);
        resolve({ duration: video.duration, width: video.videoWidth, height: video.videoHeight });
      };
      video.onerror = () => {
        window.clearTimeout(timer);
        URL.revokeObjectURL(url);
        reject(new Error('unplayable'));
      };
      video.src = url;
    });
    if (dims.duration && Number.isFinite(dims.duration)) {
      meta.durationSec = meta.durationSec ?? Math.round(dims.duration * 100) / 100;
    }
    if (dims.width > 0) {
      meta.width = meta.width ?? dims.width;
      meta.height = meta.height ?? dims.height;
    }
  } catch {
    notes.push('The browser could not decode this file, so duration and dimensions could not be confirmed by playback.');
  }

  if (meta.durationSec && meta.durationSec > 0) {
    meta.bitrateKbps = Math.round(((file.size * 8) / meta.durationSec / 1000) * 10) / 10;
  }

  return meta;
}
