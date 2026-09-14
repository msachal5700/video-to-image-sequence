import React, { useEffect, useRef, useState } from 'react';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play, Pause, ChevronLeft, ChevronRight, Download, Camera, Clock, X } from 'lucide-react';

const faqs = [
  {
    q: 'How do I extract a frame at an exact timestamp from a video?',
    a: 'Upload your video above, use the video player to navigate to the exact time (HH:MM:SS.mmm), then click "Capture Frame" to extract that specific frame as a high-quality JPG, PNG, or WebP image.'
  },
  {
    q: 'What precision does the timestamp extraction support?',
    a: 'The tool supports millisecond-level precision. You can enter timestamps like 00:01:23.456 to capture the exact frame at that moment.'
  },
  {
    q: 'Can I step frame-by-frame to find the perfect moment?',
    a: 'Yes. Use the "Previous Frame" and "Next Frame" buttons to step through the video one frame at a time for precise control.'
  },
  {
    q: 'What output formats are supported for exact frame capture?',
    a: 'JPG (smaller files), PNG (lossless quality), and WebP (modern format with transparency support and smaller file sizes).'
  },
  {
    q: 'Is there a file size limit for extracting exact frames?',
    a: 'No server upload required. Processing happens in your browser, so large files depend on your device memory, browser performance, and video codec support.'
  },
  {
    q: 'Does it work for MP4, MOV, and WEBM videos?',
    a: 'Yes. It supports the three most common video formats used by screen recorders, cameras, and mobile devices.'
  }
];

const ExtractFrameAtTimestamp: React.FC = () => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [capturedFrames, setCapturedFrames] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState<'jpg' | 'png' | 'webp'>('png');
  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);

  useEffect(() => {
    const existing = document.getElementById('extract-frame-at-timestamp-schemas');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'extract-frame-at-timestamp-schemas';

    const webAppSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Extract Frame at Exact Timestamp — Video Screenshot Tool",
      "url": "https://www.videotoimagesequence.online/extract-frame-at-timestamp",
      "image": "https://www.videotoimagesequence.online/og-image.png",
      "description": "Extract a specific frame from video at an exact timestamp (HH:MM:SS.mmm) online for free. Millisecond precision frame capture with frame-by-frame navigation. Supports JPG, PNG, and WebP output. 100% private, no server upload.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All — Browser-based",
      "browserRequirements": "Requires HTML5 and Javascript support",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": { "@type": "Answer", "text": faq.a }
      }))
    };

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Extract a Frame from Video at Exact Timestamp",
      "description": "Step-by-step guide to capture a specific video frame at a precise time using millisecond-level timestamp control.",
      "totalTime": "PT1M",
      "step": [
        { "@type": "HowToStep", "name": "Load Your Video", "text": "Select your MP4, MOV, or WEBM video file from your device." },
        { "@type": "HowToStep", "name": "Navigate to Target Time", "text": "Use the video player controls, timestamp input, or frame-stepping buttons to reach the exact moment." },
        { "@type": "HowToStep", "name": "Capture the Frame", "text": "Click 'Capture Frame' to extract the frame at that exact timestamp at full native resolution." },
        { "@type": "HowToStep", "name": "Download the Image", "text": "Save the captured frame as JPG, PNG, or WebP directly to your device." }
      ]
    };

    script.text = JSON.stringify([webAppSchema, faqSchema, howToSchema]);
    document.head.appendChild(script);

    return () => { const el = document.getElementById('extract-frame-at-timestamp-schemas'); if (el) el.remove(); };
  }, []);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setVideoWidth(videoRef.current.videoWidth);
      setVideoHeight(videoRef.current.videoHeight);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const seekToTime = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(time, duration));
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const stepFrame = (direction: number) => {
    if (!videoRef.current) return;
    const frameDuration = 1 / 30; // approximate
    seekToTime(currentTime + direction * frameDuration);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const parseTimeInput = (input: string): number => {
    const parts = input.split(':');
    if (parts.length === 3) {
      const hrs = parseInt(parts[0]) || 0;
      const mins = parseInt(parts[1]) || 0;
      const secParts = parts[2].split('.');
      const secs = parseInt(secParts[0]) || 0;
      const ms = secParts[1] ? parseInt(secParts[1].padEnd(3, '0')) / 1000 : 0;
      return hrs * 3600 + mins * 60 + secs + ms;
    }
    return 0;
  };

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseTimeInput(e.target.value);
    seekToTime(time);
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
    const mimeType = outputFormat === 'png' ? 'image/png' : outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';
    const quality = outputFormat === 'png' ? 1.0 : 0.92;
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCapturedFrames(prev => [url, ...prev].slice(0, 10));
      }
    }, mimeType, quality);
  };

  const downloadFrame = (url: string, index: number) => {
    const a = document.createElement('a');
    a.href = url;
    const ext = outputFormat === 'png' ? 'png' : outputFormat === 'webp' ? 'webp' : 'jpg';
    a.download = `frame_${formatTime(currentTime).replace(/[:.]/g, '-')}_${index}.${ext}`;
    a.click();
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) return;
    const url = URL.createObjectURL(file);
    if (videoRef.current) {
      videoRef.current.src = url;
      videoRef.current.load();
    }
  };

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <SEOHead
        title="Extract Frame at Exact Timestamp — Free Video Screenshot Tool"
        description="Extract a specific frame from video at an exact timestamp (HH:MM:SS.mmm) online for free. Millisecond precision frame capture with frame-by-frame navigation. Supports JPG, PNG, and WebP. 100% private, no server upload."
        canonical="https://www.videotoimagesequence.online/extract-frame-at-timestamp"
        ogTitle="Extract Frame at Exact Timestamp — Free Video Screenshot Tool"
        ogDescription="Capture the exact frame you need from any video with millisecond precision. Free, private, browser-based."
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords="extract frame at exact timestamp, video screenshot tool, capture frame from video at specific time, exact frame extractor"
      />

      <Breadcrumb items={[{ label: 'Exact Timestamp Extractor', path: '/extract-frame-at-timestamp' }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          Extract Frame at Exact Timestamp<br />
          <span className="text-cyan-400">Millisecond Precision Video Screenshot</span>
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Capture the exact frame you need from any video. Enter a precise timestamp (HH:MM:SS.mmm) or use frame-by-frame navigation to grab the perfect still image. Free, private, no upload required.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {['🔒 100% Private', '⚡ Instant Capture', '🎯 Millisecond Precision', '🆓 Free Forever'].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">{badge}</span>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Upload Video (MP4, MOV, WEBM)</label>
              <div
                className="border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer"
                onClick={() => document.getElementById('video-upload')?.click()}
              >
                <input
                  id="video-upload"
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                <div className="text-gray-400">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-lg">Drag & drop your video here</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                </div>
              </div>
            </div>

            {duration > 0 && (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    onLoadedMetadata={handleVideoLoad}
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full max-h-[70vh] bg-gray-950 rounded-xl"
                    controls
                  />
                </div>

                <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <button onClick={togglePlay} className="p-3 bg-cyan-500 text-gray-950 rounded-xl hover:bg-cyan-400 transition-colors">
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      <div>
                        <p className="text-sm text-gray-500">Current Time</p>
                        <p className="text-2xl font-mono font-bold text-white">{formatTime(currentTime)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="text-xl font-mono font-bold text-cyan-400">{formatTime(duration)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => stepFrame(-1)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors" title="Previous Frame">
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </button>
                      <button onClick={() => stepFrame(1)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors" title="Next Frame">
                        <ChevronRight className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Exact Timestamp (HH:MM:SS.mmm)</label>
                      <input
                        type="text"
                        value={formatTime(currentTime)}
                        onChange={handleTimestampChange}
                        placeholder="00:00:00.000"
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white font-mono text-lg focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value as 'jpg' | 'png' | 'webp')}
                        className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="png">PNG (Lossless)</option>
                        <option value="webp">WebP (Modern)</option>
                        <option value="jpg">JPG (Smaller)</option>
                      </select>
                      <button
                        onClick={captureFrame}
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-950 rounded-xl font-bold transition-colors flex items-center gap-2"
                      >
                        <Camera className="w-5 h-5" /> Capture Frame
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {capturedFrames.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 font-display">Captured Frames</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {capturedFrames.map((url, idx) => (
                <div key={idx} className="relative group aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                  <img src={url} alt={`Captured frame ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <button onClick={() => downloadFrame(url, idx)} className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 p-3 rounded-full shadow-lg">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => setCapturedFrames(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 p-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <GoogleAdUnit />

        <section className="max-w-4xl mx-auto py-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">How to Extract a Frame at an Exact Timestamp</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 space-y-4">
            <ol className="list-decimal pl-6 space-y-4 text-gray-300 marker:text-cyan-500 marker:font-bold">
              <li><strong className="text-white">Load Video:</strong> Drag and drop your MP4, MOV, or WEBM video file.</li>
              <li><strong className="text-white">Navigate to Time:</strong> Use the timestamp input for millisecond precision, or frame-step buttons for exact frame control.</li>
              <li><strong className="text-white">Choose Format:</strong> Select PNG for lossless quality, WebP for modern web use, or JPG for smaller files.</li>
              <li><strong className="text-white">Capture:</strong> Click "Capture Frame" to extract the frame at full native resolution.</li>
              <li><strong className="text-white">Download:</strong> Save the captured frame directly to your device.</li>
            </ol>
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">Why Use Exact Timestamp Extraction?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Perfect Thumbnails', desc: 'Capture the exact moment for YouTube thumbnails, social media posts, or video covers.' },
              { title: 'Frame-Accurate Analysis', desc: 'Extract precise frames for motion analysis, sports review, or technical inspection.' },
              { title: 'Privacy First', desc: 'No uploads — your video never leaves your browser. Perfect for sensitive content.' }
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-cyan-800 transition-colors">
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto py-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">More Free Online Frame Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/video-frame-extractor" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
              <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video Frame Extractor</h3>
              <p className="text-gray-500 text-xs">Extract all frames with custom FPS.</p>
            </Link>
            <Link to="/screenshot-from-video" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
              <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Screenshot from Video</h3>
              <p className="text-gray-500 text-xs">Batch extract frames as a grid.</p>
            </Link>
            <Link to="/mp4-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
              <h3 className="text-cyan-400 font-semibold mb-2 text-sm">MP4 to JPG</h3>
              <p className="text-gray-500 text-xs">Convert MP4 to JPG sequence.</p>
            </Link>
            <Link to="/video-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
              <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to PNG</h3>
              <p className="text-gray-500 text-xs">Extract lossless PNG frames.</p>
            </Link>
          </div>
        </section>

        <section id="faq" className="max-w-3xl mx-auto py-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-display">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="border border-gray-800 bg-gray-900/50 rounded-2xl p-5 cursor-pointer group hover:border-cyan-800 transition-colors">
                <summary className="font-medium text-white text-sm md:text-base list-none flex justify-between items-center group-open:text-cyan-400">
                  {faq.q}
                  <span className="text-cyan-400 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="mt-4 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExtractFrameAtTimestamp;