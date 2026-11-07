import React from 'react';
import WebmToMp4Tool from '../components/WebmToMp4Tool';
import SEOHead from '../components/SEOHead';
import { localizedUrl } from '../utils/localizedRoutes';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import AuthorBio from '../components/AuthorBio';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageLang } from '../hooks/usePageLang';

const faqs = [
  {
    q: 'Is the converted MP4 silent?',
    a: 'Yes — and the tool tells you that before you convert, not after. This converter decodes the WebM’s picture and re-encodes it as H.264; it does not carry the audio track over, because WebM audio (Opus or Vorbis) cannot simply be copied into an MP4 and re-encoding it reliably in a browser tab is a much bigger job. If your WebM has sound you need to keep, use a desktop converter like HandBrake or ffmpeg. If your clip is a screen recording, animation, or GIF-style loop — the majority of WebM files — nothing is lost.'
  },
  {
    q: 'Why is there a 60-second limit?',
    a: 'Because the conversion happens frame by frame inside your browser tab: the WebM is stepped through at 30 frames per second and every frame is re-encoded. Sixty seconds is 1,800 frames — already a minute or two of work on a modest laptop. Rather than accept a ten-minute video and fail halfway (or freeze your tab), the tool refuses long clips up front. Trim the section you need, then convert it.'
  },
  {
    q: 'Which browsers does this work in?',
    a: 'Chrome and Edge on desktop are the reliable route — the converter needs the WebCodecs VideoEncoder API with H.264 support. If your browser cannot encode H.264, the tool detects that before converting and tells you plainly instead of producing a broken file. Firefox and Safari support for the required encoder pieces is still incomplete. Everything runs locally, so the converted file never passes through a server.'
  },
  {
    q: 'Why convert WebM to MP4 at all?',
    a: 'Compatibility. WebM is a fine format on the web, but it is a dead end almost everywhere else: iPhones won’t play it in the Photos app, most video editors reject it or handle it badly, PowerPoint and Keynote won’t embed it, and plenty of upload forms (social platforms, school and work portals) accept MP4 only. MP4 with H.264 is the one video format that plays essentially everywhere — converting is how a WebM clip escapes the browser.'
  },
  {
    q: 'Will the quality change?',
    a: 'Slightly, and honestly: the picture is decoded and re-encoded, which is always a generation of loss, and the frame rate is set to 30 fps — a 60 fps WebM becomes a 30 fps MP4 (motion looks a little less smooth), while slower sources are not harmed. Resolution is preserved exactly (rounded down to even dimensions, which H.264 requires). The encoder uses a generous quality-based bitrate, so for typical clips the difference is hard to see; this is a compatibility conversion, not an archival one.'
  },
  {
    q: 'Are my videos uploaded?',
    a: 'No. The file is read by your own browser, decoded by the browser’s built-in WebM decoder, re-encoded on your device, and downloaded back to you. There is no server in the loop at all — you can verify it by loading the page and then going offline; the converter still works. That also means very large files are limited by your device, which is one reason for the 60-second cap.'
  }
];

const WebmToMp4: React.FC = () => {
  const { t } = useTranslation();
  const pageLang = usePageLang();
  const webAppSchema = {
    "@type": "WebApplication",
    "name": "WebM to MP4 Converter — Convert WebM to MP4 Free Online",
    "url": "https://www.videotoimagesequence.online/webm-to-mp4",
    "image": "https://www.videotoimagesequence.online/og-image.png",
    "description": "Convert WebM to MP4 free, entirely in your browser. H.264 MP4 at 30 fps for clips up to 60 seconds — no upload, no signup. Output is silent: the audio track is not carried over.",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires HTML5 and Javascript support",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const howToSchema = {
    "@type": "HowTo",
    "name": "How to Convert WebM to MP4",
    "description": "Convert a WebM video (up to 60 seconds) into a universally playable H.264 MP4, entirely in your browser.",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Add Your WebM Video",
        "text": "Drag and drop a .webm file (up to 60 seconds) into the upload zone. It is read locally — never uploaded."
      },
      {
        "@type": "HowToStep",
        "name": "Convert to MP4",
        "text": "Click Convert to MP4. Your browser decodes the WebM frame by frame and re-encodes it as H.264 at 30 fps. The output has no audio track."
      },
      {
        "@type": "HowToStep",
        "name": "Download the MP4",
        "text": "Download the finished MP4 — it plays in editors, presentations, phones, and upload forms that reject WebM."
      }
    ]
  };

  const organizationSchema = {
    "@type": "Organization",
    "name": "Video to Image Sequence Online",
    "url": "https://www.videotoimagesequence.online",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.videotoimagesequence.online/og-image.png"
    }
  };

  const pageSchemas = {
    "@context": "https://schema.org",
    "@graph": [webAppSchema, faqSchema, howToSchema, organizationSchema]
  };

  return (
    <div className="w-full mx-auto pb-16 font-sans">
      <script type="application/ld+json">
        {JSON.stringify(pageSchemas)}
      </script>
      <SEOHead
        title={t('webmToMp4.title')}
        description={t('webmToMp4.description')}
        canonical={localizedUrl('/webm-to-mp4', pageLang)}
        ogTitle={t('webmToMp4.title')}
        ogDescription={t('webmToMp4.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('webmToMp4.keywords')}
      />

      <Breadcrumb items={[{ label: 'WebM to MP4', path: '/webm-to-mp4' }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('webmToMp4.h1')}<br />
          <span className="text-cyan-400">{t('webmToMp4.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          {t('webmToMp4.hero')}
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400 mb-10">
          {[
            t('badges.private'),
            t('badges.fast'),
            t('badges.free')
          ].map(badge => (
            <span key={badge} className="bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <GoogleAdUnit />
      </div>

      <div className="animate-fade-in min-h-[400px] px-4">
        <WebmToMp4Tool />
      </div>

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Why WebM Files Get Stuck — and Why MP4 Fixes It
        </h2>
        <p className="text-gray-400 leading-relaxed">
          WebM was designed for one job: efficient video inside web pages. It does that job well, which is
          why browsers record in it, screen-capture tools export it, and half the short clips floating
          around Discord and group chats are WebM. The trouble starts the moment a clip leaves the web.
          iOS won’t open WebM in the Photos app or iMessage previews. Premiere Pro, Final Cut, and most
          other editors either refuse it or demand a plugin. PowerPoint and Keynote won’t embed it.
          School portals, job-application forms, and plenty of social uploaders accept MP4 and quietly
          reject everything else. MP4 with an H.264 picture is the closest thing video has to a universal
          format — it plays on every phone, every editor, every presentation tool, and every upload form.
          Converting WebM to MP4 is simply how a clip escapes the browser and becomes usable everywhere
          else.
        </p>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Convert WebM to MP4 Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="list-decimal pl-6 space-y-4 text-gray-300 marker:text-cyan-500 marker:font-bold">
            <li>
              <strong className="text-white">Add your WebM:</strong> Drop a .webm file of up to 60 seconds
              into the box above. The tool reads its dimensions and duration locally and checks that your
              browser can encode H.264 — before anything is converted.
            </li>
            <li>
              <strong className="text-white">Convert:</strong> One click starts the conversion. Your
              browser steps through the WebM at 30 frames per second, decodes each frame, and re-encodes
              it as H.264 into an MP4 container, with a progress bar the whole way. Keep the tab open —
              the work is happening on your device, not on a server.
            </li>
            <li>
              <strong className="text-white">Download the MP4:</strong> The finished file is offered as a
              download with its size and format spelled out. It will play in editors, presentations, and
              phones that reject the original WebM — remembering that it has no audio track.
            </li>
          </ol>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <GoogleAdUnit />
      </div>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Converted in Your Browser — Nothing Is Uploaded
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 text-gray-400 leading-relaxed">
          <p>
            Most online converters upload your video to their server, convert it there, and let you
            download the result — which means a copy of your clip sat on a stranger’s machine, and the
            “conversion” took a round trip through their queue. This tool works the other way. Modern
            browsers can already decode WebM natively, and with the WebCodecs API they can encode H.264
            too. So the whole job — decode, re-encode, package as MP4 — runs in your tab, on your
            hardware. Your clip never leaves your device; load the page, disconnect from the internet,
            and the converter still works.
          </p>
          <p>
            That design has honest costs, and this page would rather state them than hide them. In-browser
            conversion is slower than a server farm, which is why clips are capped at 60 seconds. The
            output is fixed at 30 frames per second. And the MP4 is silent: WebM audio (Opus or Vorbis)
            can’t be copied into an MP4 container, and this tool does not pretend otherwise. For the
            screen recordings, animations, reaction clips, and GIF-replacements that make up most WebM
            files, none of that matters. For a music video with sound you need, a desktop tool like
            HandBrake is the right call — and now you know exactly why.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          What Changes in the Conversion
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">The container and codec: WebM/VP9 → MP4/H.264</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              That is the entire point of the exercise — the output is a standard H.264 MP4, the format
              every editor, phone, and upload form accepts. Resolution is preserved exactly, rounded down
              by at most one pixel per dimension because H.264 requires even width and height.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">The frame rate: normalised to 30 fps</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A 60 fps WebM becomes a 30 fps MP4 — still smooth for ordinary footage, slightly less fluid
              for fast gameplay. Sources at 30 fps or below are unaffected in motion terms (slower sources
              simply repeat frames). Variable-frame-rate screen recordings come out as clean
              constant-frame-rate video, which editors strongly prefer.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">The audio: not carried over</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The converted MP4 has no audio track. The tool says so in the upload box, on the result
              card, and in the FAQ — no surprises after download. Most WebM clips are silent anyway; if
              yours is not and the sound matters, convert it with a desktop tool instead.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">The quality: one careful re-encode</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Re-encoding is always a generation of loss, so the encoder is given a generous bitrate
              scaled to the video’s resolution. For typical clips the result is visually very close to the
              source. Treat the MP4 as your working, shareable copy — keep the WebM if it is your only
              original.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More WebM and Video Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/webm-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">WebM to PNG</h3>
            <p className="text-gray-500 text-xs">Extract lossless PNG frames from a WebM video.</p>
          </Link>
          <Link to="/webm-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">WebM to JPG</h3>
            <p className="text-gray-500 text-xs">Pull JPG stills out of any WebM clip.</p>
          </Link>
          <Link to="/gif-to-mp4" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">GIF to MP4</h3>
            <p className="text-gray-500 text-xs">Turn an animated GIF into a small, playable MP4.</p>
          </Link>
          <Link to="/video-to-webp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to WebP</h3>
            <p className="text-gray-500 text-xs">Going the other way? Make an animated WebP from video.</p>
          </Link>
          <Link to="/video-looper" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video Looper</h3>
            <p className="text-gray-500 text-xs">Repeat a short clip into a seamless looping video.</p>
          </Link>
        </div>
      </section>

      <section id="faq" className="max-w-3xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-display">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="border border-gray-800 bg-gray-900/50 rounded-2xl p-5 cursor-pointer group hover:border-cyan-800 transition-colors">
              <summary className="font-medium text-white text-sm md:text-base list-none flex justify-between items-center group-open:text-cyan-400">
                {faq.q}
                <span className="text-cyan-400 transition-transform group-open:rotate-180">
                   ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <AuthorBio />
    </div>
  );
};

export default WebmToMp4;
