import React from 'react';
import HeicToJpgTool from '../components/HeicToJpgTool';
import SEOHead from '../components/SEOHead';
import { localizedUrl } from '../utils/localizedRoutes';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageLang } from '../hooks/usePageLang';

const faqs = [
  {
    q: 'Why won’t my iPhone photo open on Windows, or upload to a form?',
    a: 'iPhones have saved photos in the HEIC format by default since iOS 11, because it stores the same photo in roughly half the file size of a JPG. The trade-off is compatibility: many Windows apps, web forms, printers, and older devices simply do not recognize HEIC. Converting to JPG — the format every device and website accepts — fixes the upload or printing problem without changing what the photo shows.'
  },
  {
    q: 'Are my photos uploaded to a server?',
    a: 'No. Decoding and JPG encoding run entirely in your browser on your own device. Your photos never leave your computer or phone, nothing is stored anywhere, and the tool keeps working even if your connection drops after the page loads.'
  },
  {
    q: 'Will converting HEIC to JPG reduce the quality?',
    a: 'Slightly, and honestly: JPG is a lossy format, so saving at any quality setting discards some image data. At the default 92% quality the difference is invisible in normal viewing — you would have to zoom in and compare pixel by pixel to spot it. If you need a pixel-perfect archival copy, keep the original HEIC file as well; use the JPG for sharing, uploading, and printing.'
  },
  {
    q: 'Does the converted JPG keep my photo’s location and camera metadata?',
    a: 'No — and that is deliberate. The converted JPG does not carry over the original metadata, including GPS location, camera settings, and timestamps. That makes the JPG safer to share publicly or send to a stranger, since it cannot reveal where the photo was taken. If you need the metadata preserved, export from your phone’s own Photos app instead.'
  },
  {
    q: 'What about Live Photos, portrait-mode depth, or HDR photos?',
    a: 'The converter decodes the main still image in the file. Live Photo video clips are not included — only the still frame is converted. Portrait-mode files that store a separate depth map may fail to decode in some cases; if one file fails, the error is shown on that file only and the rest of your batch still converts. 10-bit color and HDR gain maps are not preserved in the JPG output — the result is a standard 8-bit JPG, which is what every viewer and printer expects.'
  },
  {
    q: 'Can I convert many photos at once?',
    a: 'Yes — drop up to 20 HEIC or HEIF files at a time. Files are decoded one after another (not all at once) so a large batch does not spike your browser’s memory. Each file gets its own download button, or grab everything in one ZIP with “Download all as ZIP”. One failed file never stops the rest of the batch.'
  }
];

const HeicToJpg: React.FC = () => {
  const { t } = useTranslation();
  const pageLang = usePageLang();
  const webAppSchema = {
    "@type": "WebApplication",
    "name": "HEIC to JPG Converter — Convert iPhone HEIC Photos to JPG Free",
    "url": "https://www.videotoimagesequence.online/heic-to-jpg",
    "image": "https://www.videotoimagesequence.online/og-image.png",
    "description": "Convert iPhone HEIC and HEIF photos to JPG free, entirely in your browser. Batch up to 20 photos, quality control, no upload, no signup.",
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
    "name": "How to Convert HEIC to JPG",
    "description": "Turn iPhone HEIC photos into JPGs that open anywhere, entirely in your browser.",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Add Your HEIC Photos",
        "text": "Drag and drop up to 20 .heic or .heif files into the upload zone. They are never sent to a server."
      },
      {
        "@type": "HowToStep",
        "name": "Choose Quality and Size",
        "text": "Set JPG quality (92% by default) and optionally shrink the longest side with the max-dimension control."
      },
      {
        "@type": "HowToStep",
        "name": "Convert and Download",
        "text": "Convert the batch, check each file's before/after size, then download JPGs individually or as one ZIP."
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
        title={t('heicToJpg.title')}
        description={t('heicToJpg.description')}
        canonical={localizedUrl('/heic-to-jpg', pageLang)}
        ogTitle={t('heicToJpg.title')}
        ogDescription={t('heicToJpg.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('heicToJpg.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'HEIC to JPG', path: '/heic-to-jpg' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('heicToJpg.h1')}<br />
          <span className="text-cyan-400">{t('heicToJpg.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          {t('heicToJpg.hero')}
        </p>

        {/* Trust badges */}
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

      {/* Google AdSense ad — Pre-Tool */}
      <div className="max-w-5xl mx-auto px-4">
        <GoogleAdUnit />
      </div>

      {/* Main Tool Content */}
      <div className="animate-fade-in min-h-[400px] px-4">
        <HeicToJpgTool />
      </div>

      {/* ── PRIVATE, IN-BROWSER ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Private, In-Browser HEIC Conversion
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Your photos are decoded and re-encoded entirely inside your web browser. Nothing is uploaded
          to any server — your photos stay on your device from start to finish, and the tool keeps
          working even if your connection drops after the page loads. That matters more for photos
          than for most files: a photo can reveal where you were and when, and a converter that never
          receives your photo cannot leak it.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Convert HEIC to JPG Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="list-decimal pl-6 space-y-4 text-gray-300 marker:text-cyan-500 marker:font-bold">
            <li>
              <strong className="text-white">Add your HEIC photos:</strong> Drag and drop up to 20
              .heic or .heif files into the upload zone above. Files are accepted by extension and
              type — anything else is skipped with a clear message, never silently converted.
            </li>
            <li>
              <strong className="text-white">Choose quality and size:</strong> The JPG quality
              slider defaults to 92%, a balance most viewers cannot distinguish from the original.
              Leave the max-dimension control at “Original size” to keep full resolution, or shrink
              the longest side when you need smaller files for email or a form.
            </li>
            <li>
              <strong className="text-white">Convert and download:</strong> Files convert one at a
              time, so a big batch stays within your browser’s memory. Each file shows its original
              size, its JPG size, and its dimensions. Download JPGs one by one, or take the whole
              batch as a single ZIP.
            </li>
          </ol>
        </div>
      </section>

      {/* Google AdSense ad — Post How-To */}
      <div className="max-w-5xl mx-auto px-4">
        <GoogleAdUnit />
      </div>

      {/* ── WHY HEIC WON'T OPEN ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Why HEIC Photos Won’t Open Everywhere
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 text-gray-400 leading-relaxed">
          <p>
            Since iOS 11, iPhones save photos as HEIC by default. The format is genuinely better at
            its job: it packs the same photo into a much smaller file than JPG, which is why your
            phone can hold thousands of photos without filling its storage. The catch is that the
            rest of the world never adopted it at the same pace.
          </p>
          <p>
            Windows without the optional HEIF extension, many web upload forms, older Android
            devices, printers, and some desktop editors all reject HEIC outright — usually with an
            unhelpful “unsupported format” error. JPG, by contrast, has been the universal photo
            format for decades: every browser, phone, printer, and form on earth opens it. Converting
            is the one-step fix, and doing it in your browser means you do not have to install an
            app or hand your photos to a server to get it.
          </p>
        </div>
      </section>

      {/* ── WHAT CHANGES, WHAT DOESN'T ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          What Changes — and What Doesn’t — When You Convert
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Dimensions and orientation are preserved</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The JPG keeps the photo’s original pixel dimensions unless you set a max dimension,
              and the orientation stored in the file is applied during decoding — a portrait photo
              stays portrait. Nothing is cropped or rotated by the converter.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">JPG is lossy — by design</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              JPG compression discards some image data to shrink the file. At 92% quality the loss
              is invisible in normal viewing, but it is real: if you convert the same JPG again and
              again, quality degrades a little each time. Keep the original HEIC as your master copy
              and treat the JPG as the sharing copy.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Metadata is not carried over</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              GPS location, camera settings, and other metadata embedded in the original are not
              written into the JPG. That is a privacy feature, not a bug: a JPG from this tool is
              safe to post publicly or send to someone you do not know well. If you need the
              metadata, export the photo from your phone’s own Photos app instead.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">HDR and 10-bit color are not preserved</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Modern iPhones can store 10-bit color and an HDR gain map alongside the photo. A
              standard JPG cannot hold those, so the output is a regular 8-bit JPG — the format
              every viewer, printer, and upload form expects. Colors may look slightly flatter than
              on your phone’s HDR display, and that is expected.
            </p>
          </div>
        </div>
      </section>

      {/* ── BATCH TIPS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Batch Tips: Converting a Whole Camera Roll
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Twenty files per run is the sweet spot: large enough for a day’s shoot, small enough that
          your browser stays responsive. If you have more, convert in groups of twenty and use the
          ZIP download for each group. Files convert sequentially, so a single bad file — a renamed
          file, a corrupted download, or an unusual portrait variant — is reported on its own row
          and never blocks the rest. And because everything happens on your device, there is no
          queue, no upload wait, and no daily limit.
        </p>
      </section>

      {/* ── RELATED TOOLS (INTERNAL LINKING) ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Image Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/video-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to JPG</h3>
            <p className="text-gray-500 text-xs">Extract JPG frames from any video.</p>
          </Link>
          <Link to="/video-to-webp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to WebP</h3>
            <p className="text-gray-500 text-xs">Turn video frames into modern WebP images.</p>
          </Link>
          <Link to="/video-to-avif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to AVIF</h3>
            <p className="text-gray-500 text-xs">Extract frames in the compact AVIF format.</p>
          </Link>
          <Link to="/compress-gif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Compress GIF</h3>
            <p className="text-gray-500 text-xs">Shrink animated GIFs for Discord and sharing.</p>
          </Link>
          <Link to="/image-crop" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Freeform Image Crop</h3>
            <p className="text-gray-500 text-xs">Crop any image with a freeform polygon.</p>
          </Link>
        </div>
      </section>

      {/* ── FAQ Section ── */}
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
    </div>
  );
};

export default HeicToJpg;
