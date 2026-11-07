import React from 'react';
import WebpToPngTool from '../components/WebpToPngTool';
import SEOHead from '../components/SEOHead';
import { localizedUrl } from '../utils/localizedRoutes';
import Breadcrumb from '../components/Breadcrumb';
import GoogleAdUnit from '../components/GoogleAdUnit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageLang } from '../hooks/usePageLang';

const faqs = [
  {
    q: 'Why convert WebP to PNG at all?',
    a: 'WebP is a web format. Browsers love it, but a long tail of software still does not: older image editors, office suites, upload forms, print services, some game engines and embedded tools. PNG is the universal lossless format — everything opens it. Converting gives you a copy that works everywhere while keeping every pixel and the transparency of the original.'
  },
  {
    q: 'Are my images uploaded to a server?',
    a: 'No. Decoding and PNG encoding run entirely in your browser on your own device. Your images never leave your computer or phone, nothing is stored anywhere, and the tool keeps working even if your connection drops after the page loads.'
  },
  {
    q: 'Does the PNG keep transparency?',
    a: 'Yes. Unlike JPG, PNG has a full alpha channel, and this converter draws the decoded WebP onto a transparent canvas without filling any background — so transparent and semi-transparent areas stay exactly as they were. That is the main reason to choose PNG over JPG for WebP logos, stickers, and overlays.'
  },
  {
    q: 'Will the PNG be bigger than my WebP?',
    a: 'Almost always, yes — often several times bigger. WebP was designed to beat PNG at lossless and lossy compression, so converting back to PNG gives that saving away. You are trading file size for compatibility and editability. If the image is staying on a website, keep the WebP; convert when a tool, form, or person needs a PNG.'
  },
  {
    q: 'Does converting WebP to PNG lose quality?',
    a: 'No. The decode reads the WebP’s pixels and the PNG encode writes them losslessly — the PNG shows exactly what the WebP showed. One honest caveat: if the WebP itself was saved with lossy compression, those artefacts are already baked into its pixels; the PNG preserves them faithfully rather than removing them. Conversion never adds quality, it just stops adding loss.'
  },
  {
    q: 'Can I convert an animated WebP?',
    a: 'This tool converts the first frame of an animated WebP, because PNG is a still-image format. If you need every frame of an animation, extract the frames from the source video instead, or use a GIF frame splitter for animated GIFs. For a still PNG of the opening frame, this converter is enough.'
  }
];

const WebpToPng: React.FC = () => {
  const { t } = useTranslation();
  const pageLang = usePageLang();
  const webAppSchema = {
    "@type": "WebApplication",
    "name": "WebP to PNG Converter — Convert WebP Images to PNG Free",
    "url": "https://www.videotoimagesequence.online/webp-to-png",
    "image": "https://www.videotoimagesequence.online/og-image.png",
    "description": "Convert WebP images to PNG free, entirely in your browser. Lossless output, transparency preserved, batch up to 20 images, no upload, no signup.",
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
    "name": "How to Convert WebP to PNG",
    "description": "Turn WebP images into lossless PNGs that open anywhere, entirely in your browser.",
    "totalTime": "PT1M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Add Your WebP Images",
        "text": "Drag and drop up to 20 .webp files into the upload zone. They are never sent to a server."
      },
      {
        "@type": "HowToStep",
        "name": "Convert",
        "text": "Click Convert. Each WebP is decoded by your browser and re-encoded as a lossless PNG at the original dimensions, with transparency preserved."
      },
      {
        "@type": "HowToStep",
        "name": "Download the PNGs",
        "text": "Download each PNG individually, or the whole batch as one ZIP."
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
        title={t('webpToPng.title')}
        description={t('webpToPng.description')}
        canonical={localizedUrl('/webp-to-png', pageLang)}
        ogTitle={t('webpToPng.title')}
        ogDescription={t('webpToPng.description')}
        ogImage="https://www.videotoimagesequence.online/og-image.png"
        ogType="website"
        keywords={t('webpToPng.keywords')}
      />

      <Breadcrumb items={[{ label: 'WebP to PNG', path: '/webp-to-png' }]} />

      <section className="text-center max-w-4xl mx-auto pt-10 pb-10 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight font-display">
          {t('webpToPng.h1')}<br />
          <span className="text-cyan-400">{t('webpToPng.h1Sub')}</span>
        </h1>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed hero-description">
          {t('webpToPng.hero')}
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
        <WebpToPngTool />
      </div>

      <section className="max-w-4xl mx-auto py-12 px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Private, In-Browser WebP Conversion
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Your images are decoded and re-encoded entirely inside your web browser. Nothing is uploaded
          to any server — your images stay on your device from start to finish, and the tool keeps
          working even if your connection drops after the page loads. Decoding uses your browser’s own
          built-in WebP support, which every current browser ships, so there is no extra download and
          no new software to trust. A converter that never receives your image cannot leak it, sell it,
          or quietly keep a copy.
        </p>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          How to Convert WebP to PNG Online
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
          <ol className="list-decimal pl-6 space-y-4 text-gray-300 marker:text-cyan-500 marker:font-bold">
            <li>
              <strong className="text-white">Add your WebP images:</strong> Drag and drop up to 20
              .webp files into the upload zone above. Files are accepted by extension and type —
              anything else is skipped with a clear message, never silently converted.
            </li>
            <li>
              <strong className="text-white">Convert:</strong> One click decodes each WebP with your
              browser’s own image engine and re-encodes it as PNG at the original pixel dimensions.
              Transparency is carried over as-is — there is no background colour to pick, because PNG
              does not need one.
            </li>
            <li>
              <strong className="text-white">Download:</strong> Each row shows the original size, the
              PNG size, and the dimensions. Download PNGs one by one, or take the whole batch as a
              single ZIP.
            </li>
          </ol>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <GoogleAdUnit />
      </div>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Why WebP Images Won’t Open Everywhere
        </h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 text-gray-400 leading-relaxed">
          <p>
            WebP was built by Google for one job: making web pages lighter. It typically beats JPG by
            about a quarter to a third at the same visual quality, and it beats PNG by a wide margin on
            photographic content — which is why browsers, CDNs, and chat apps now hand you WebP files
            whenever you save an image from the web. If you have ever right-clicked a picture, saved it,
            and found a .webp file in your downloads instead of the PNG or JPG you expected, this is why.
          </p>
          <p>
            The problem is everywhere that is not a browser. Older image editors, office documents,
            upload forms, printers, and a long tail of desktop and embedded software reject WebP or open
            it incorrectly. PNG is the opposite story: a lossless format from the 1990s that literally
            everything reads, with full transparency support. Converting WebP to PNG is how you move an
            image from the web’s favourite format into the format the rest of your software expects —
            without losing a single pixel in the move.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          What Changes — and What Doesn’t — When You Convert
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Every pixel is preserved</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              PNG encoding is lossless, and the converter writes the decoded pixels at the original
              dimensions with no resizing, cropping, or re-compression. The PNG looks exactly like the
              WebP — including any artefacts the WebP already had, which conversion faithfully keeps
              rather than inventing detail that was never there.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Transparency stays transparent</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              WebP supports an alpha channel and so does PNG, so logos, stickers, product cutouts, and
              overlays keep their see-through and semi-transparent areas. This is the decisive advantage
              over converting to JPG, which has no alpha channel and must flatten transparency onto a
              background colour.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">The file gets bigger — that is the trade</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              WebP’s whole purpose is compressing better than PNG, so the PNG is normally larger,
              sometimes several times larger for photos. Convert the copy you need for an editor, a form,
              or a document — and keep the WebP as the lightweight master for anything that stays on
              the web.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Metadata is not carried over</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              As with this site’s other converters, embedded metadata — camera settings, timestamps,
              location — is not written into the output. That makes the PNG safer to share publicly.
              If you need the original metadata, export from your source app instead.
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-2">Animated WebP becomes its first frame</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              PNG is a still format, so an animated WebP converts to a PNG of its opening frame. If you
              need the full animation as separate stills, start from the source video with a frame
              extractor rather than from the animated WebP.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          WebP vs PNG vs JPG: Which Output Do You Actually Need?
        </h2>
        <p className="text-gray-400 leading-relaxed">
          Choose PNG when the image must open in older or stricter software, when it has transparency,
          or when it will be edited further — lossless files survive repeated saves without degrading.
          Choose JPG when the image is a photograph headed for email, a form with a size cap, or anywhere
          a smaller lossy file beats a perfect one; our image converters handle the AVIF and HEIC versions
          of that job. Keep WebP when the image stays on a website you control — it is the smallest of the
          three, and converting it only adds bytes. The honest rule: convert for the destination, not by
          habit.
        </p>
      </section>

      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display">
          More Free Image Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/avif-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">AVIF to JPG</h3>
            <p className="text-gray-500 text-xs">Convert AVIF images to JPG that opens anywhere.</p>
          </Link>
          <Link to="/heic-to-jpg" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">HEIC to JPG</h3>
            <p className="text-gray-500 text-xs">Convert iPhone HEIC photos to JPG.</p>
          </Link>
          <Link to="/video-to-webp" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to WebP</h3>
            <p className="text-gray-500 text-xs">Turn video frames into modern WebP images.</p>
          </Link>
          <Link to="/video-to-png" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Video to PNG</h3>
            <p className="text-gray-500 text-xs">Extract lossless PNG frames from a video.</p>
          </Link>
          <Link to="/image-crop" className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-cyan-500 transition block">
            <h3 className="text-cyan-400 font-semibold mb-2 text-sm">Freeform Image Crop</h3>
            <p className="text-gray-500 text-xs">Crop any image with a freeform polygon.</p>
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

export default WebpToPng;
