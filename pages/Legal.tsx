import React, { useEffect } from 'react';
import SEOHead from '../components/SEOHead';

const LegalLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 font-sans">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl legal-content">
        <h1 className="font-display">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export const PrivacyPolicy: React.FC = () => (
  <>
    <SEOHead
      title="Privacy Policy | Video to Image Sequence Online"
      description="Our privacy policy. Your videos never leave your device. No data is collected, stored, or transmitted to any server."
      canonical="https://videotoimagesequence.online/privacy-policy"
      noindex={false}
    />
    <LegalLayout title="Privacy Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      
      <h2>1. Data Processing and Privacy</h2>
      <p>Video to Image Sequence Online operates strictly as a local, client-side web application. All video extraction and image processing occurs directly within your web browser using modern web APIs. Your files are <strong>never uploaded to our servers</strong>. We do not have access to your video content, nor could we even if we wanted to. Your privacy is mathematically guaranteed by the architecture of the platform.</p>

      <h2>2. Cookies, Analytics & Advertising</h2>
      <p>We use standard local storage to save basic UI preferences. We may use privacy-respecting analytics to understand high-level website traffic patterns. Our advertising partners (such as Adsterra) use cookies to display relevant advertisements to keep this tool completely free.</p>

      <h2>3. Your Data, Your Rights</h2>
      <p>Because we do not store, process, or transmit your files, we inherently comply with GDPR, CCPA, and strict data protection laws regarding your media content. You retain full copyright and ownership of all output generated using the tool.</p>
    </LegalLayout>
  </>
);

export const TermsOfService: React.FC = () => (
  <>
    <SEOHead
      title="Terms of Service | Video to Image Sequence Online"
      description="Terms of service for Video to Image Sequence Online. Free to use, no account required."
      canonical="https://videotoimagesequence.online/terms-of-service"
      noindex={false}
    />
    <LegalLayout title="Terms of Service">
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing Video to Image Sequence Online, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not use our service.</p>

      <h2>2. Use License</h2>
      <p>Video to Image Sequence Online is completely free to use for personal, academic, and commercial purposes. You may use the extracted frames in any capacity without restriction or attribution.</p>

      <h2>3. Disclaimer & Reliability</h2>
      <p>The service is provided "as is". Because the processing burden falls entirely on your device's local hardware (RAM/CPU) rather than our cloud servers, the performance and stability of the extraction depends on your machine. We are not responsible for browser crashes due to lack of memory when processing exceptionally large 4K files.</p>
    </LegalLayout>
  </>
);

export const AboutUs: React.FC = () => (
  <>
    <SEOHead
      title="About Us | Video to Image Sequence Online"
      description="Learn about Video to Image Sequence Online — a free, private, browser-based tool for extracting frames from videos."
      canonical="https://videotoimagesequence.online/about-us"
      noindex={false}
    />
    <LegalLayout title="About Us">
      <p>Video to Image Sequence Online was built to solve a simple problem: extracting high-quality frames from videos shouldn't require paying for heavy desktop software or uploading 5GB files to slow, limit-restricted servers.</p>
      
      <h2>Our Mission</h2>
      <p>To provide fast, secure, and completely private multimedia tools that leverage the power of the modern browser to democratize video editing workflows.</p>

      <h2>Technology</h2>
      <p>We utilize cutting-edge web technologies including the Canvas API, MediaElement, and Web Workers to deliver native-app processing speeds directly in the browser.</p>
      
    </LegalLayout>
  </>
);