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
      canonical="https://www.videotoimagesequence.online/privacy"
      noindex={true}
      nofollow={true}
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
      canonical="https://www.videotoimagesequence.online/terms"
      noindex={true}
      nofollow={true}
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
      canonical="https://www.videotoimagesequence.online/about"
      noindex={false}
      ogTitle="About Us — Video to Image Sequence"
      ogDescription="Learn about Video to Image Sequence Online — a free, private, browser-based tool for extracting frames from videos locally in your browser."
      keywords="about video to image sequence online, free video frame extractor details, private browser processing"
    />
    <LegalLayout title="About Video to Image Sequence Online">
      <p>Video to Image Sequence Online was built to solve a fundamental problem in modern digital media workflows: extracting high-precision image frames from video files should not require downloading heavy desktop software, paying expensive subscriptions, or uploading sensitive multi-gigabyte video files to cloud servers.</p>
      
      <h2>Our Mission & Purpose</h2>
      <p>Our mission is to provide fast, reliable, zero-trust media processing utilities accessible directly inside any web browser. By bringing WebAssembly, Web Workers, and modern Canvas rendering pipelines directly to the client side, we eliminate server latency, eliminate file size caps, and guarantee absolute privacy for content creators, video editors, researchers, and developers worldwide.</p>

      <h2>Our Core Technology</h2>
      <p>Unlike traditional online converters that upload your video files to remote cloud servers, our platform processes <strong>100% of your video locally on your own machine</strong>. We leverage native browser capabilities including:</p>
      <ul>
        <li><strong>Web Workers & HTML5 Video Decoding:</strong> Offloading heavy frame extraction routines off the main UI thread.</li>
        <li><strong>Canvas 2D Rendering Engine:</strong> Preserving pixel-perfect color depth and alpha transparency for PNG exports.</li>
        <li><strong>Client-side Computer Vision:</strong> Scoring keyframe sharpness, motion blur, and exposure balance directly in JavaScript.</li>
      </ul>

      <h2>Editorial & Technical Support</h2>
      <p>Video to Image Sequence Online is maintained by an independent engineering team dedicated to web performance, computer vision, and privacy-first web software.</p>
      
      <p>If you have feature requests, bug reports, or media inquiries, you can reach our team directly:</p>
      <div className="my-6 p-6 rounded-2xl bg-gray-950 border border-gray-800 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-mono">Official Support Contact</p>
        <a href="mailto:support@videotoimagesequence.online" className="text-cyan-400 font-bold font-mono text-lg hover:underline">
          support@videotoimagesequence.online
        </a>
        <p className="text-xs text-gray-500 mt-2">We typically respond to technical inquiries within 24–48 business hours.</p>
      </div>
    </LegalLayout>
  </>
);