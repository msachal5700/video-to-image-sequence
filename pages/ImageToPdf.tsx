import React from 'react';
import ImageToPdfTool from '../components/ImageToPdfTool';
import SEOHead from '../components/SEOHead';
import { localizedUrl } from '../utils/localizedRoutes';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageLang } from '../hooks/usePageLang';

const faqs = [
  {
    q: 'Are my images uploaded to a server?',
    a: 'No. The PDF is built entirely in your browser with a JavaScript PDF library — your images never leave your device, nothing is stored anywhere, and the tool keeps working offline once the page has loaded. That matters for scanned documents, ID photos, and anything else you would not email to a stranger’s server.'
  },
  {
    q: 'What image formats can I add?',
    a: 'JPG, PNG, and WebP — up to 30 images per document. JPG and PNG are embedded into the PDF directly. WebP is first re-encoded to PNG inside your browser (losslessly), because the PDF format cannot embed WebP. HEIC photos from an iPhone should be converted to JPG first — there is a free HEIC to JPG converter on this site.'
  },
  {
    q: 'Does the PDF keep my images’ quality?',
    a: 'Yes. Images are embedded at their original resolution — the tool does not downscale or re-compress them. A JPG goes in as the same JPG; a PNG goes in losslessly. The honest trade-off is file size: a PDF built from full-resolution photos is as large as the photos themselves. If you need a smaller PDF for email, shrink the images first with an image tool, then combine them.'
  },
  {
    q: 'What is the difference between “Fit to image”, A4, and Letter?',
    a: '“Fit to image” makes each PDF page exactly the size of its image — the right choice for screenshots, scans, and photo sets where the image is the page. A4 and Letter place each image, aspect ratio preserved, centred on a standard page with margins — the right choice when the PDF will be printed or submitted to a form that expects a standard document size. Landscape images automatically get landscape pages.'
  },
  {
    q: 'Can I change the order of the pages?',
    a: 'Yes. Pages follow the order of the list: use the up and down arrows to rearrange images before you create the PDF, and the × button to remove one. The order you see is the order in the document — page 1 is the top row.'
  },
  {
    q: 'Is there a file size or page limit?',
    a: 'Up to 30 images per document. There is no server-side file size limit because there is no server — the practical limits are your device’s memory and patience: a document built from thirty full-resolution phone photos will be a large PDF and can take a few seconds to assemble on a slow phone. For bigger jobs, build the PDF in two parts and merge them with a desktop tool.'
  }
];

const ImageToPdf: React.FC = () => {
  const { t } = useTranslation();
  const pageLang = usePageLang();
  const webAppSchema = {
    "@type": "WebApplication",
    "name": "Image to PDF Converter — Combine JPG, PNG, WebP into PDF Free",
    "url": "https://www.videotoimagesequence.online/image-to-pdf",
    "image": "https://www.videotoimagesequence.online/og-image.png",
    "description": "Combine JPG, PNG and WebP images into a single PDF free, entirely in your browser. Fit-to-image, A4 or Letter pages, reorder pages, no upload, no signup.",
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
    "name": "How to Convert Images to PDF",
    "description": "Combine JPG, PNG or WebP images into one PDF document, entirely in your browser.",
    "totalTime": "PT1M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Add Your Images",
        "text": "Drag and drop up to 30 JPG, PNG or WebP images into the upload zone. They are never sent to a server."
      },
      {
        "@type": "HowToStep",
        "name": "Order the Pages and Pick a Page Size",
        "text": "Reorder images with the arrow buttons — the list order becomes the page order. Choose Fit to image for pixel-exact pages, or A4 / Letter for printable documents."
      },
      {
        "@type": "HowToStep",
        "name": "Create and Download the PDF",
        "text": "Click Create PDF. The document is assembled in your browser at full image quality and downloaded as images.pdf."
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
        title={t('imageToPdf.title')}
        description={t('imageToPdf.description')}
        canonical={localizedUrl('/image-to-pdf', pageLang)}
        ogTitle={t('imageToPdf.title')}
        ogDescription={t('imageToPdf.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('imageToPdf.keywords')}
      />

      <Breadcrumb items={[{ label: 'Image to PDF', path: '/image-to-pdf' }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('imageToPdf.h1')}<br />
          <span className="text-cyan-400">{t('imageToPdf.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          {t('imageToPdf.hero')}
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
        <ImageToPdfTool />
      </div>

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Private by Design: Your Images Never Leave Your Device
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Most “free” image-to-PDF sites work by uploading your images to their server, building the PDF
          there, and letting you download it back. That is a reasonable design for a public photo — and a
          poor one for the things people actually combine into PDFs: scanned contracts, ID documents,
          application forms, receipts, medical letters. This tool takes the other route. A JavaScript PDF
          library runs entirely in your browser tab, reads the images from your device, and hands the
          finished PDF straight back as a download. Nothing is uploaded, nothing is stored, and there is
          no account to create — the converter cannot leak files it never receives.
        </p>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Combine Images into a PDF Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="list-decimal pl-6 space-y-4 text-gray-300 marker:text-cyan-500 marker:font-bold">
            <li>
              <strong className="text-white">Add your images:</strong> Drag and drop up to 30 JPG, PNG,
              or WebP files into the upload zone above. They appear in a numbered list in the order you
              added them — that order becomes the page order of the PDF.
            </li>
            <li>
              <strong className="text-white">Arrange and choose a page size:</strong> Move images up or
              down with the arrow buttons, remove any you don’t want, then pick the page mode. “Fit to
              image” makes every page the exact size of its image; A4 and Letter centre each image on a
              standard printable page, rotating to landscape automatically for wide images.
            </li>
            <li>
              <strong className="text-white">Create the PDF:</strong> One click assembles the document
              in your browser at full image quality — no recompression — and downloads it as images.pdf.
            </li>
          </ol>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <GoogleAdUnit />
      </div>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          When an Image-to-PDF Tool Is the Right Tool
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 text-gray-400 leading-relaxed">
          <p>
            A folder of images is fragile: the order scrambles when you share it, a form accepts one file
            where you have twelve, and a client opens them in whatever sequence their photo app prefers.
            A single PDF fixes all three problems at once — it is one file, in your order, that opens
            identically on every device. That is why application portals ask for “your documents as one
            PDF”, why teachers want the worksheet scans combined, and why a set of extracted video frames
            becomes a reviewable contact document instead of a zip nobody opens.
          </p>
          <p>
            The choice worth thinking about is page size. If the PDF is a container for the images
            themselves — scans, screenshots, frames, photos — “Fit to image” is correct: pages match the
            images pixel-for-pixel and nothing is rescaled. If the PDF will be printed or uploaded to a
            system that validates document dimensions, choose A4 (most of the world) or Letter (US and
            Canada): each image is placed on a standard page with margins, sized to fit and never
            stretched.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          What Changes — and What Doesn’t — When You Convert
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Image quality is untouched</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              JPGs are embedded as the same encoded data and PNGs are embedded losslessly — the tool
              never recompresses your images to save space. What you put in is what a PDF reader zooms
              into. If your source images are blurry, the PDF will be too; conversion preserves, it does
              not enhance.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">WebP images are re-encoded to PNG first</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The PDF specification has no WebP image type, so WebP files are decoded and stored as PNG
              inside the document. That conversion is lossless — same pixels, same transparency — but it
              can make the PDF larger than the WebP originals, because PNG compresses photos less
              aggressively than WebP.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">File size is the honest trade-off</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Because nothing is recompressed, the PDF is roughly the sum of its images. Thirty
              full-resolution phone photos make a heavy document. If a portal caps uploads at a few
              megabytes, reduce the images first — lower dimensions are what actually shrink a PDF; there
              is no free “compress” that keeps every pixel.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Order and orientation are handled for you</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pages follow the list exactly, and wide images get landscape pages in every mode, so a
              mixed set of portrait scans and landscape screenshots comes out readable without manual
              rotation. Mixed image sizes are fine in “Fit to image” mode — each page matches its own
              image.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Image Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/webp-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">WebP to PNG</h3>
            <p className="text-gray-500 text-xs">Convert WebP images to lossless PNG, transparency kept.</p>
          </Link>
          <Link to="/heic-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">HEIC to JPG</h3>
            <p className="text-gray-500 text-xs">Turn iPhone HEIC photos into JPGs you can add here.</p>
          </Link>
          <Link to="/avif-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">AVIF to JPG</h3>
            <p className="text-gray-500 text-xs">Convert AVIF images to JPG that opens anywhere.</p>
          </Link>
          <Link to="/video-to-pdf" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to PDF</h3>
            <p className="text-gray-500 text-xs">Turn video frames into a PDF contact sheet.</p>
          </Link>
          <Link to="/image-crop" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Freeform Image Crop</h3>
            <p className="text-gray-500 text-xs">Crop an image before adding it to your PDF.</p>
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
    </div>
  );
};

export default ImageToPdf;
