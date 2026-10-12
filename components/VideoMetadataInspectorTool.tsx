import React, { useState, useCallback } from 'react';
import { Loader2, AlertTriangle, Copy, Check, FileSearch, RefreshCw, HardDrive } from 'lucide-react';
import Dropzone from './Dropzone';
import { useToast } from './Toast';
import { inspectVideoFile, type VideoMetadata } from './videoMetadataParser';

interface FieldRow {
  label: string;
  value: string;
  hint?: string;
}

const formatBytes = (bytes: number): string => {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
};

const formatDuration = (sec: number): string => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const base = h > 0 ? `${h}:${m.toString().padStart(2, '0')}` : `${m}`;
  return `${base}:${s.toString().padStart(2, '0')}`;
};

const formatDate = (iso?: string): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

function buildFields(meta: VideoMetadata): FieldRow[] {
  return [
    { label: 'File name', value: meta.fileName },
    { label: 'Container', value: meta.container, hint: meta.majorBrand ? `Major brand: ${meta.majorBrand}` : undefined },
    { label: 'File size', value: formatBytes(meta.fileSize) },
    {
      label: 'Duration',
      value: meta.durationSec != null ? `${formatDuration(meta.durationSec)} (${meta.durationSec}s)` : '—',
    },
    {
      label: 'Dimensions',
      value: meta.width && meta.height ? `${meta.width} × ${meta.height}px` : '—',
    },
    { label: 'Frame rate', value: meta.fps != null ? `${meta.fps} fps` : '—', hint: 'Average from the sample table — VFR files vary frame to frame' },
    { label: 'Video codec', value: meta.videoCodec ?? '—' },
    { label: 'Audio codec', value: meta.audioCodec ?? '—' },
    {
      label: 'Overall bitrate',
      value: meta.bitrateKbps != null ? `${meta.bitrateKbps.toLocaleString()} kbps` : '—',
      hint: 'File size ÷ duration — includes container overhead',
    },
    { label: 'Creation date', value: formatDate(meta.creationDateIso), hint: 'From the file header — may be missing if the file was re-encoded' },
    ...(meta.muxingApp ? [{ label: 'Muxing app', value: meta.muxingApp }] : []),
    ...(meta.writingApp ? [{ label: 'Writing app', value: meta.writingApp }] : []),
  ];
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

const VideoMetadataInspectorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<VideoMetadata | null>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const { showToast } = useToast();

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    const isVideo = selectedFile.type.startsWith('video/') ||
      /\.(mp4|m4v|mov|webm|mkv|3gp|3g2|avi|f4v)$/i.test(selectedFile.name);
    if (!isVideo) {
      showToast('Please select a video file (MP4, MOV, WebM, MKV…).', 'error');
      return;
    }
    setFile(selectedFile);
    setMeta(null);
    setError(null);
    setParsing(true);
    try {
      const result = await inspectVideoFile(selectedFile);
      setMeta(result);
    } catch (e) {
      console.error(e);
      setError('Could not read this file. It may be corrupted or use an unsupported container.');
    } finally {
      setParsing(false);
    }
  }, [showToast]);

  const handleReset = useCallback(() => {
    setFile(null);
    setMeta(null);
    setError(null);
    setCopiedField(null);
    setCopiedAll(false);
  }, []);

  const copyField = useCallback(async (label: string, value: string) => {
    const ok = await copyText(value);
    if (ok) {
      setCopiedField(label);
      window.setTimeout(() => setCopiedField(c => (c === label ? null : c)), 1500);
    } else {
      showToast('Copy failed — your browser blocked clipboard access.', 'error');
    }
  }, [showToast]);

  const copyAllJson = useCallback(async () => {
    if (!meta) return;
    const json = JSON.stringify({
      fileName: meta.fileName,
      container: meta.container,
      majorBrand: meta.majorBrand ?? null,
      fileSizeBytes: meta.fileSize,
      durationSeconds: meta.durationSec ?? null,
      width: meta.width ?? null,
      height: meta.height ?? null,
      fps: meta.fps ?? null,
      videoCodec: meta.videoCodec ?? null,
      audioCodec: meta.audioCodec ?? null,
      bitrateKbps: meta.bitrateKbps ?? null,
      creationDate: meta.creationDateIso ?? null,
      tracks: meta.tracks,
    }, null, 2);
    const ok = await copyText(json);
    if (ok) {
      setCopiedAll(true);
      window.setTimeout(() => setCopiedAll(false), 2000);
      showToast('Metadata copied as JSON.', 'success');
    } else {
      showToast('Copy failed — your browser blocked clipboard access.', 'error');
    }
  }, [meta, showToast]);

  const fields = meta ? buildFields(meta) : [];

  return (
    <div className="max-w-3xl mx-auto">
      {!file && (
        <Dropzone onFileSelect={handleFileSelect} />
      )}

      {file && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <FileSearch className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold truncate">{file.name}</p>
                <p className="text-gray-500 text-sm">{formatBytes(file.size)}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-2 transition flex-shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              New file
            </button>
          </div>

          {parsing && (
            <div className="flex flex-col items-center py-12 gap-4">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-gray-400 text-sm">Reading file header — the video is never fully loaded…</p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 bg-red-950/40 border border-red-800/60 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {meta && !parsing && (
            <>
              <div className="overflow-hidden rounded-xl border border-gray-800">
                <table className="w-full text-sm">
                  <tbody>
                    {fields.map((f, i) => (
                      <tr key={f.label} className={i % 2 === 0 ? 'bg-gray-950/60' : 'bg-gray-900'}>
                        <td className="px-4 py-3 text-gray-500 font-medium w-36 md:w-44 align-top">
                          {f.label}
                          {f.hint && <span className="block text-[11px] text-gray-600 font-normal mt-0.5">{f.hint}</span>}
                        </td>
                        <td className="px-4 py-3 text-white break-all">{f.value}</td>
                        <td className="px-3 py-3 w-12 align-top">
                          <button
                            onClick={() => copyField(f.label, f.value)}
                            title={`Copy ${f.label}`}
                            aria-label={`Copy ${f.label}`}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-gray-800 transition"
                          >
                            {copiedField === f.label ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {meta.tracks.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-white font-semibold text-sm mb-2">Streams</h3>
                  <div className="space-y-2">
                    {meta.tracks.map((t, i) => (
                      <div key={i} className="bg-gray-950/60 border border-gray-800 rounded-xl px-4 py-3 text-sm">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mr-2 uppercase tracking-wide ${t.type === 'video' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : t.type === 'audio' ? 'bg-violet-950 text-violet-300 border border-violet-800' : 'bg-gray-800 text-gray-400'}`}>
                          {t.type}
                        </span>
                        <span className="text-white font-medium">{t.codec}</span>
                        {t.width != null && t.height != null && t.type === 'video' && (
                          <span className="text-gray-500 ml-2">{t.width}×{t.height}{t.fps != null ? ` @ ${t.fps} fps` : ''}</span>
                        )}
                        {t.language && <span className="text-gray-600 ml-2">· {t.language}</span>}
                        <span className="text-gray-600 ml-2 font-mono text-xs">[{t.codecTag}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={copyAllJson}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold rounded-xl px-4 py-3 transition"
              >
                {copiedAll ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copiedAll ? 'Copied!' : 'Copy all as JSON'}
              </button>

              <div className="mt-4 space-y-2">
                <p className="flex items-start gap-2 text-xs text-gray-600">
                  <HardDrive className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  Parsed from {formatBytes(meta.bytesRead)} of {formatBytes(meta.fileSize)} — the file was never fully loaded into memory.
                </p>
                {meta.notes.map((n, i) => (
                  <p key={i} className="text-xs text-gray-600">Note: {n}</p>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoMetadataInspectorTool;
