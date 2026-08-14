import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import AboutPage from './AboutPage';

const LegalLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 font-sans text-gray-300">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl legal-content space-y-6">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export const PrivacyPolicy: React.FC = () => (
  <>
    <SEOHead
      title="Privacy Policy | Video to Image Sequence Online"
      description="Our privacy policy. Operated by Muhammad Sachal (SachalSpeaks). Your videos never leave your device."
      canonical="https://www.videotoimagesequence.online/privacy"
      noindex={true}
      nofollow={true}
    />
    <LegalLayout title="Privacy Policy">
      <p className="text-xs font-mono text-cyan-400">Last updated: August 14, 2026 · Operated by Muhammad Sachal (SachalSpeaks)</p>
      
      <h2 className="text-xl font-bold text-white font-display border-b border-gray-800 pb-2 mt-6">1. Data Ownership & Local Processing Architecture</h2>
      <p>
        Video to Image Sequence Online (accessible at <code>https://www.videotoimagesequence.online</code>) is owned and operated by <strong>Muhammad Sachal (SachalSpeaks)</strong>, based in Pakistan.
      </p>
      <p>
        Our core platform operates on a zero-trust, client-side architecture. All video file decoding, frame extractions, image rendering, and ZIP archiving occur <strong>100% locally within your web browser</strong> using WebAssembly, Web Workers, and HTML5 Canvas APIs. 
      </p>
      <p>
        Your uploaded video files and generated image frames are <strong>never transmitted or stored on any external web server</strong>. We do not collect, view, copy, or retain your video content under any circumstances.
      </p>

      <h2 className="text-xl font-bold text-white font-display border-b border-gray-800 pb-2 mt-6">2. Cookies, Storage & Third-Party Analytics</h2>
      <p>We categorize data storage into three distinct operational layers:</p>
      <ul className="list-disc list-inside space-y-2 text-sm">
        <li><strong>Essential Local Storage:</strong> Used strictly to save user interface preferences (such as selected theme, preferred FPS rate, and cookie consent state).</li>
        <li><strong>Performance & Traffic Analytics:</strong> We use privacy-preserving analytics to track aggregate website usage metrics (e.g., daily page views, country distribution, device types). No personal data or media content is tracked.</li>
        <li><strong>Advertising Partners:</strong> To maintain this service free for all users, we partner with advertising networks (such as Google AdSense). These third-party vendors use cookies to serve non-intrusive, relevant ads based on prior visits to our website or other sites. You may opt out of personalized advertising by visiting Google's Ad Settings.</li>
      </ul>

      <h2 className="text-xl font-bold text-white font-display border-b border-gray-800 pb-2 mt-6">3. GDPR, CCPA & International Data Rights</h2>
      <p>
        If you reside in the European Union (EU), European Economic Area (EEA), United Kingdom (UK), or California (USA), you possess data protection rights regarding personal data. Because we do not process or store personal file data, your media rights are guaranteed. You may clear your browser cookies and local storage at any time to delete all locally stored preferences.
      </p>

      <h2 className="text-xl font-bold text-white font-display border-b border-gray-800 pb-2 mt-6">4. Contact & Inquiries</h2>
      <p>
        If you have questions regarding this Privacy Policy or wish to submit a data inquiry, please contact founder <strong>Muhammad Sachal</strong> directly:
      </p>
      <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 font-mono text-xs">
        <div>Email: <a href="mailto:sachalmahar5700@gmail.com" className="text-cyan-400 font-bold hover:underline">sachalmahar5700@gmail.com</a></div>
        <div>Contact Form: <Link to="/contact" className="text-cyan-400 hover:underline">https://www.videotoimagesequence.online/contact</Link></div>
      </div>
    </LegalLayout>
  </>
);

export const TermsOfService: React.FC = () => (
  <>
    <SEOHead
      title="Terms of Service | Video to Image Sequence Online"
      description="Terms of service for Video to Image Sequence Online. Operated by Muhammad Sachal."
      canonical="https://www.videotoimagesequence.online/terms"
      noindex={true}
      nofollow={true}
    />
    <LegalLayout title="Terms of Service">
      <p className="text-xs font-mono text-cyan-400">Last updated: August 14, 2026 · Operated by Muhammad Sachal (SachalSpeaks)</p>

      <h2 className="text-xl font-bold text-white font-display border-b border-gray-800 pb-2 mt-6">1. Acceptance & Ownership</h2>
      <p>
        By accessing and using Video to Image Sequence Online, you agree to these Terms of Service. The service is operated by <strong>Muhammad Sachal (SachalSpeaks)</strong>.
      </p>

      <h2 className="text-xl font-bold text-white font-display border-b border-gray-800 pb-2 mt-6">2. Permitted Usage & Licensing</h2>
      <p>
        The platform is completely free to use for personal, educational, commercial, and research purposes. You retain 100% full copyright, ownership, and rights to all image frames extracted using our software. No attribution or royalty fees are required.
      </p>

      <h2 className="text-xl font-bold text-white font-display border-b border-gray-800 pb-2 mt-6">3. Technical Hardware Disclaimer</h2>
      <p>
        Because frame processing occurs entirely inside your web browser using your local CPU and RAM hardware, system performance depends on your device. We are not liable for local browser slowdowns or memory limits when processing extremely large or uncompressed 4K video files.
      </p>

      <h2 className="text-xl font-bold text-white font-display border-b border-gray-800 pb-2 mt-6">4. Contact & Support</h2>
      <p>
        For questions or technical support, visit our <Link to="/contact" className="text-cyan-400 underline">Contact Page</Link> or email <a href="mailto:sachalmahar5700@gmail.com" className="text-cyan-400 font-mono">sachalmahar5700@gmail.com</a>.
      </p>
    </LegalLayout>
  </>
);

export const AboutUs: React.FC = () => <AboutPage />;