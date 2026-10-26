import React from 'react';
import AvifToJpgTool from '../components/AvifToJpgTool';
import SEOHead from '../components/SEOHead';
import { localizedUrl } from '../utils/localizedRoutes';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageLang } from '../hooks/usePageLang';

const faqs = [
  {
    q: 'Why won’t my AVIF image open, or upload to a form?',
    a: 'AVIF is a modern format built on the AV1 video codec. It compresses far better than JPG, which is why sites and apps that care about bandwidth have adopted it — but many upload forms, older editors, printers, and desktop apps still do not recognise it. Converting to JPG — the format every device and website accepts — fixes the upload or compatibility problem without changing what the image shows.'
  },
  {
    q: 'Are my images uploaded to a server?',
    a: 'No. Decoding and JPG encoding run entirely in your browser on your own device. Your images never leave your computer or phone, nothing is stored anywhere, and the tool keeps working even if your connection drops after the page loads.'
  },
  {
    q: 'Will the JPG be bigger than my AVIF?',
    a: 'Usually, yes — and that is expected, not a bug. AVIF compresses much more efficiently than JPG, so the same picture saved as a JPG is typically larger, sometimes several times larger. You are trading file size for compatibility: the JPG will open everywhere, while the AVIF will not. If file size matters more than compatibility, keep the AVIF and do not convert.'
  },
  {
    q: 'Does the converted JPG keep transparency?',
    a: 'No — JPG has no transparency channel. Any see-through areas in your AVIF are filled with a background colour you choose in the tool (white by default, with presets and a custom colour picker). Pick a colour that matches where the image will be used: white for documents and forms, black for dark backgrounds. If you need transparency preserved, convert to PNG instead.'
  },
  {
    q: 'Does the converted JPG keep my image’s metadata?',
    a: 'No — and that is deliberate. The converted JPG does not carry over the original metadata, including GPS location, camera settings, and timestamps. That makes the JPG safer to share publicly or send to a stranger, since it cannot reveal where the image was taken. If you need the metadata preserved, export from your source app instead.'
  },
  {
    q: 'What if my browser cannot decode an AVIF file?',
    a: 'Conversion needs a browser that decodes AVIF. All current versions of Chrome, Edge, Firefox, and Safari do. If a file fails to decode, that file is marked with a clear message and the rest of your batch still converts — one undecodable file never blocks the others. Update your browser to the latest version and try again; older browsers cannot decode AVIF at all. HDR and wide-gamut colour are also flattened to standard 8-bit sRGB in the JPG, which is what every viewer and printer expects.'
  }
];

const AvifToJpg: React.FC = () => {
  const { t } = useTranslation();
  const pageLang = usePageLang();
  const webAppSchema = {
    "@type": "WebApplication",
    "name": "AVIF to JPG Converter — Convert AVIF Images to JPG Free",
    "url": "https://www.videotoimagesequence.online/avif-to-jpg",
    "image": "https://www.videotoimagesequence.online/og-image.png",
    "description": "Convert AVIF images to JPG free, entirely in your browser. Batch up to 20 images, quality control, background colour for transparency, no upload, no signup.",
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
    "name": "How to Convert AVIF to JPG",
    "description": "Turn AVIF images into JPGs that open anywhere, entirely in your browser.",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Add Your AVIF Images",
        "text": "Drag and drop up to 20 .avif files into the upload zone. They are never sent to a server."
      },
      {
        "@type": "HowToStep",
        "name": "Choose Quality, Size, and Background",
        "text": "Set JPG quality (92% by default), optionally shrink the longest side, and pick the background colour that fills transparent areas."
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
        title={t('avifToJpg.title')}
        description={t('avifToJpg.description')}
        canonical={localizedUrl('/avif-to-jpg', pageLang)}
        ogTitle={t('avifToJpg.title')}
        ogDescription={t('avifToJpg.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('avifToJpg.keywords')}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'AVIF to JPG', path: '/avif-to-jpg' }]} />

      {/* ── HERO SECTION ── */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('avifToJpg.h1')}<br />
          <span className="text-cyan-400">{t('avifToJpg.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          {t('avifToJpg.hero')}
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
        <AvifToJpgTool />
      </div>

      {/* ── PRIVATE, IN-BROWSER ── */}
      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Private, In-Browser AVIF Conversion
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Your images are decoded and re-encoded entirely inside your web browser. Nothing is uploaded
          to any server — your images stay on your device from start to finish, and the tool keeps
          working even if your connection drops after the page loads. That matters for images too:
          a photo can reveal where you were and when, and a converter that never receives your image
          cannot leak it. Decoding uses your browser’s own built-in AVIF support, so there is no
          extra download and no new software to trust.
        </p>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Convert AVIF to JPG Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="list-decimal pl-6 space-y-4 text-gray-300 marker:text-cyan-500 marker:font-bold">
            <li>
              <strong className="text-white">Add your AVIF images:</strong> Drag and drop up to 20
              .avif files into the upload zone above. Files are accepted by extension and type —
              anything else is skipped with a clear message, never silently converted.
            </li>
            <li>
              <strong className="text-white">Choose quality, size, and background:</strong> The JPG
              quality slider defaults to 92%, a balance most viewers cannot distinguish from the
              original. Leave the max-dimension control at “Original size” to keep full resolution,
              or shrink the longest side when you need smaller files for email or a form. If your
              image has transparency, pick the background colour that will fill the see-through
              areas — white by default.
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

      {/* ── WHY AVIF WON'T OPEN ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Why AVIF Images Won’t Open Everywhere
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 text-gray-400 leading-relaxed">
          <p>
            AVIF is built on AV1, the open video codec developed as a successor to VP9. As a still
            format it is genuinely impressive: it holds the same picture in a much smaller file than
            JPG, supports HDR, wide colour gamut, and transparency, and it is royalty-free. That is
            why browsers, image CDNs, and modern apps have adopted it quickly — and why you now
            receive AVIF files when you download images from the web.
          </p>
          <p>
            The catch is the long tail of software that never caught up. Many web upload forms,
            older image editors, printers, and desktop apps reject AVIF outright, usually with an
            unhelpful “unsupported format” error. JPG, by contrast, has been the universal image
            format for decades: every browser, phone, printer, and form on earth opens it. Converting
            is the one-step fix, and doing it in your browser means you do not have to install an
            app or hand your images to a server to get it.
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
              The JPG keeps the image’s original pixel dimensions unless you set a max dimension,
              and the orientation stored in the file is applied during decoding. Nothing is cropped
              or rotated by the converter.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">JPG is lossy — and usually larger than your AVIF</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              JPG compression discards some image data to shrink the file, and it is far less
              efficient than AVIF. At 92% quality the loss is invisible in normal viewing, but the
              output file is usually larger than the AVIF you started from. Keep the original AVIF
              as your master copy and treat the JPG as the compatibility copy for sharing, uploading,
              and printing.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Transparency is flattened onto a background colour</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              JPG cannot store transparency, so see-through areas are filled with the background
              colour you pick in the tool — white by default, with presets and a custom colour
              picker. Semi-transparent edges blend into that colour, so choose one that matches
              where the image will sit. If you need transparency preserved, convert to PNG instead.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Metadata is not carried over</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              GPS location, camera settings, and other metadata embedded in the original are not
              written into the JPG. That is a privacy feature, not a bug: a JPG from this tool is
              safe to post publicly or send to someone you do not know well. If you need the
              metadata, export the image from your source app instead.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">HDR and wide gamut are flattened to 8-bit sRGB</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              AVIF can store HDR and wide-gamut colour; a standard JPG cannot. The output is a
              regular 8-bit sRGB JPG — the format every viewer, printer, and upload form expects.
              Colours may look slightly flatter than on an HDR display, and that is expected.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">You need a browser that decodes AVIF</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              This tool uses your browser’s own AVIF decoder, so it works in all current versions of
              Chrome, Edge, Firefox, and Safari. If a file fails to decode, it is marked on its own
              row with a clear message and the rest of the batch still converts. Older browsers
              cannot decode AVIF at all — update to the latest version and try again.
            </p>
          </div>
        </div>
      </section>

      {/* ── BATCH TIPS ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Batch Tips: Converting a Whole Folder
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Twenty files per run is the sweet spot: large enough for a day’s downloads, small enough
          that your browser stays responsive. If you have more, convert in groups of twenty and use
          the ZIP download for each group. Files convert sequentially, so a single bad file — a
          renamed file, a corrupted download, or an AVIF variant your browser cannot decode — is
          reported on its own row and never blocks the rest. And because everything happens on your
          device, there is no queue, no upload wait, and no daily limit.
        </p>
      </section>

      {/* ── RELATED TOOLS (INTERNAL LINKING) ── */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Image Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/heic-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">HEIC to JPG</h3>
            <p className="text-gray-500 text-xs">Convert iPhone HEIC photos to JPG.</p>
          </Link>
          <Link to="/video-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to JPG</h3>
            <p className="text-gray-500 text-xs">Extract JPG frames from any video.</p>
          </Link>
          <Link to="/video-to-avif" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to AVIF</h3>
            <p className="text-gray-500 text-xs">Extract frames in the compact AVIF format.</p>
          </Link>
          <Link to="/video-to-webp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to WebP</h3>
            <p className="text-gray-500 text-xs">Turn video frames into modern WebP images.</p>
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

export default AvifToJpg;
