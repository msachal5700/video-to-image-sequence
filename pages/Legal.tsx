import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import AboutPage from './AboutPage';

const LAST_UPDATED = 'September 8, 2026';

const LegalLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 font-sans text-gray-300">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl legal-content space-y-6 leading-relaxed">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h1>
        {children}
      </div>
    </div>
  );
};

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xl font-bold text-white font-display border-b border-gray-800 pb-2 mt-8">{children}</h2>
);

const ExtLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline break-words">
    {children}
  </a>
);

export const PrivacyPolicy: React.FC = () => (
  <>
    <SEOHead
      title="Privacy Policy | Video to Image Sequence Online"
      description="How Video to Image Sequence Online handles your data: videos are processed locally in your browser and never uploaded. Details on cookies, Google Analytics, Google AdSense advertising, and your GDPR/CCPA rights."
      canonical="https://www.videotoimagesequence.online/privacy"
    />
    <LegalLayout title="Privacy Policy">
      <p className="text-xs font-mono text-cyan-400">Last updated: {LAST_UPDATED} · Operated by Muhammad Sachal (SachalSpeaks)</p>

      <p>
        This Privacy Policy explains what information Video to Image Sequence Online (the "Service", "we", "us"), available at{' '}
        <code>https://www.videotoimagesequence.online</code>, collects when you use the website, how that information is used, and the
        choices you have. The Service is owned and operated by <strong>Muhammad Sachal (SachalSpeaks)</strong>, an independent developer
        based in Pakistan. The short version: your video files stay on your device, and the only data that leaves your browser is
        anonymous usage analytics and the standard information that advertising partners use to show and measure ads.
      </p>

      <H2>1. Your Video Files Never Leave Your Device</H2>
      <p>
        Every tool on this site — the video-to-image converter, MP4 to JPG, video to PNG, screenshot from video, the AI frame picker, and
        the images-to-video encoder — runs entirely inside your web browser. Decoding, frame capture, scoring, image encoding, and ZIP
        packaging are performed with the HTML5 <code>&lt;video&gt;</code> element, the Canvas API, the MediaRecorder API, and Web Workers
        on your own CPU and memory.
      </p>
      <p>
        Because of this design, <strong>we do not upload, receive, store, view, or have any technical ability to access</strong> the
        videos you load or the images you export. There is no server-side processing queue, no temporary cloud storage, and no file
        retention window. When you close the tab, the browser releases the memory used for your media and nothing remains on our side.
      </p>

      <H2>2. Information We Do Collect</H2>
      <p>We collect a limited amount of non-file data in three categories:</p>
      <ul className="list-disc list-inside space-y-2 text-sm">
        <li>
          <strong>Preferences stored in your browser (local storage).</strong> We save interface choices such as your selected language,
          light or dark theme, and whether you have dismissed the cookie notice. These values are stored only in your browser's local
          storage, are never transmitted to us, and can be deleted at any time by clearing site data.
        </li>
        <li>
          <strong>Aggregate usage analytics.</strong> We use Google Analytics 4 to understand how the site is used — for example which
          pages are visited, approximate country and device category, and how visitors arrive. Google Analytics sets cookies
          (such as <code>_ga</code>) to distinguish returning sessions. IP addresses are truncated by Google before storage. We also
          use Microsoft Clarity to understand how visitors interact with the site through session recordings and heatmaps (for
          example which buttons are clicked and how far pages are scrolled). Clarity sets cookies to distinguish sessions; recordings
          mask text inputs by default. We do not send file names, video content, or any personal identifiers to Google Analytics or
          Microsoft Clarity. Both tools load only after you choose "Accept All" in our consent notice.
        </li>
        <li>
          <strong>Contact form submissions.</strong> If you choose to write to us through the <Link to="/contact" className="text-cyan-400 hover:underline">contact page</Link>,
          the name, email address, and message you enter are forwarded to our inbox by the form-processing provider FormSubmit and are
          used only to reply to you. We keep this correspondence for as long as needed to resolve your request and then delete it.
        </li>
      </ul>

      <H2>3. Advertising and the Google AdSense Program</H2>
      <p>
        The Service is free to use and is supported by advertising. We use <strong>Google AdSense</strong> to display ads. Google, as a
        third-party vendor, uses cookies to serve ads on this site. Google's use of advertising cookies enables it and its partners to
        serve ads to you based on your visit to this site and/or other sites on the Internet.
      </p>
      <ul className="list-disc list-inside space-y-2 text-sm">
        <li>
          Third-party vendors, including Google, use cookies (such as the DoubleClick <code>IDE</code> cookie) and similar technologies
          to serve ads based on a user's prior visits to this website or other websites and to measure ad performance.
        </li>
        <li>
          You may opt out of personalised advertising by visiting{' '}
          <ExtLink href="https://adssettings.google.com/">Google Ads Settings</ExtLink>. You can opt out of some other third-party
          vendors' use of cookies for personalised advertising at{' '}
          <ExtLink href="https://www.aboutads.info/choices/">www.aboutads.info</ExtLink> or{' '}
          <ExtLink href="https://www.youronlinechoices.com/">www.youronlinechoices.com</ExtLink> (EU).
        </li>
        <li>
          For details on how Google collects and uses data in the ads and content network, see{' '}
          <ExtLink href="https://policies.google.com/technologies/ads">Google's Advertising Technologies policy</ExtLink> and{' '}
          <ExtLink href="https://policies.google.com/technologies/partner-sites">How Google uses information from sites that use its services</ExtLink>.
        </li>
        <li>
          Visitors in the European Economic Area, the United Kingdom, and Switzerland are shown a consent notice before advertising
          cookies are set. Until you accept, Google Consent Mode keeps ad storage and personalisation denied and only non-personalised
          ads may be served.
        </li>
      </ul>

      <H2>4. Cookies Used on This Site</H2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-gray-950 text-gray-400">
            <tr>
              <th className="text-left px-4 py-2">Category</th>
              <th className="text-left px-4 py-2">Set by</th>
              <th className="text-left px-4 py-2">Purpose</th>
              <th className="text-left px-4 py-2">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            <tr><td className="px-4 py-2 text-white">Essential</td><td className="px-4 py-2">This site (local storage)</td><td className="px-4 py-2">Theme, language, consent choice</td><td className="px-4 py-2">Until cleared</td></tr>
            <tr><td className="px-4 py-2 text-white">Analytics</td><td className="px-4 py-2">Google Analytics</td><td className="px-4 py-2">Aggregate traffic measurement</td><td className="px-4 py-2">Up to 2 years</td></tr>
            <tr><td className="px-4 py-2 text-white">Analytics</td><td className="px-4 py-2">Microsoft Clarity</td><td className="px-4 py-2">Session recordings, heatmaps, interaction measurement</td><td className="px-4 py-2">Up to 1 year</td></tr>
            <tr><td className="px-4 py-2 text-white">Advertising</td><td className="px-4 py-2">Google AdSense / DoubleClick</td><td className="px-4 py-2">Ad delivery, frequency capping, measurement, personalisation (with consent)</td><td className="px-4 py-2">Up to 13 months</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm">
        You can control cookies through your browser settings. Blocking cookies does not affect the converters themselves, which do not
        depend on cookies to function.
      </p>

      <H2>5. Legal Basis and Your Rights (GDPR, UK GDPR, CCPA/CPRA)</H2>
      <p>
        If you are in the EU, EEA, or UK, we rely on your <strong>consent</strong> for advertising and analytics cookies, and on our
        <strong> legitimate interest</strong> in operating a secure, functioning website for essential storage. You have the right to
        access, correct, erase, or restrict processing of personal data we hold about you, to object to processing, to data
        portability, and to withdraw consent at any time without affecting the lawfulness of processing before withdrawal. You may also
        lodge a complaint with your local supervisory authority.
      </p>
      <p>
        If you are a California resident, you have the right to know what personal information is collected, to request deletion, and
        to opt out of the "sale" or "sharing" of personal information as those terms are defined by the CCPA/CPRA. We do not sell
        personal information for money. Interest-based advertising through Google may be considered "sharing"; you can opt out via the
        Google Ads Settings link above or by declining advertising cookies in our consent notice. We do not discriminate against users
        who exercise their privacy rights.
      </p>
      <p>
        Because we do not maintain user accounts or a database of personal records, most requests can be satisfied by clearing your
        browser's site data. For anything else, contact us using the details in Section 9 and we will respond within 30 days.
      </p>

      <H2>6. Children's Privacy</H2>
      <p>
        The Service is a general-audience tool and is not directed to children under 13 (or under 16 where that is the applicable age of
        digital consent). We do not knowingly collect personal information from children. If you believe a child has provided us with
        personal information through the contact form, please email us and we will delete it promptly.
      </p>

      <H2>7. Data Retention and Security</H2>
      <p>
        Video and image data are never retained because they never reach us. Analytics data is retained by Google Analytics for 14
        months under our configured retention setting. Contact form messages are kept only for as long as needed to answer them. The
        site is served exclusively over HTTPS with HSTS enabled, and third-party scripts are limited to Google Analytics, Microsoft Clarity, Google
        AdSense, and Google Fonts.
      </p>

      <H2>8. Third-Party Links</H2>
      <p>
        Articles on this site may link to external resources such as documentation for FFmpeg, Blender, or Adobe products. We are not
        responsible for the privacy practices of those websites, and we encourage you to review their policies.
      </p>

      <H2>9. Changes to This Policy and How to Contact Us</H2>
      <p>
        We may update this policy when the site's features or legal requirements change. The "Last updated" date at the top of this
        page reflects the current version. Questions, data requests, or complaints can be sent to the site owner directly:
      </p>
      <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 font-mono text-xs space-y-1">
        <div>Data controller: Muhammad Sachal (SachalSpeaks), Pakistan</div>
        <div>Email: <a href="mailto:sachalmahar5700@gmail.com" className="text-cyan-400 font-bold hover:underline">sachalmahar5700@gmail.com</a></div>
        <div>Contact form: <Link to="/contact" className="text-cyan-400 hover:underline">https://www.videotoimagesequence.online/contact</Link></div>
      </div>
    </LegalLayout>
  </>
);

export const TermsOfService: React.FC = () => (
  <>
    <SEOHead
      title="Terms of Service | Video to Image Sequence Online"
      description="Terms of use for Video to Image Sequence Online: free browser-based video frame extraction, your rights to the frames you export, acceptable use, and limitation of liability."
      canonical="https://www.videotoimagesequence.online/terms"
    />
    <LegalLayout title="Terms of Service">
      <p className="text-xs font-mono text-cyan-400">Last updated: {LAST_UPDATED} · Operated by Muhammad Sachal (SachalSpeaks)</p>

      <p>
        These Terms of Service ("Terms") govern your use of Video to Image Sequence Online at{' '}
        <code>https://www.videotoimagesequence.online</code> (the "Service"), operated by <strong>Muhammad Sachal (SachalSpeaks)</strong>.
        By using the Service you agree to these Terms. If you do not agree, please do not use the Service.
      </p>

      <H2>1. What the Service Does</H2>
      <p>
        The Service provides free, browser-based tools that extract still frames from video files (MP4, MOV, WEBM and other formats
        your browser can decode), export them as JPG or PNG images, score frames for use as social-media thumbnails, and assemble image
        sequences into short WEBM videos. All processing happens on your device. We do not host, receive, or store your files.
      </p>

      <H2>2. Free Use and Licence to the Output</H2>
      <p>
        The Service is free for personal, educational, commercial, and research use. You retain <strong>all rights</strong> to the
        videos you process and to every image or video you export. We claim no ownership of, and add no watermark or licence
        restriction to, your output. Attribution is appreciated but never required.
      </p>

      <H2>3. Your Responsibilities and Acceptable Use</H2>
      <p>You are solely responsible for the content you process. By using the Service you confirm that you:</p>
      <ul className="list-disc list-inside space-y-2 text-sm">
        <li>own the video or have the necessary rights or permission from the copyright holder to extract and use frames from it;</li>
        <li>will not use the Service to create or distribute material that is unlawful, infringing, defamatory, or that violates another person's privacy or publicity rights;</li>
        <li>will not attempt to interfere with the operation of the site, scrape it at abusive rates, reverse-engineer the ad delivery, or use automated means to generate fraudulent ad impressions or clicks;</li>
        <li>will not misrepresent the Service as your own or remove notices of ownership from the website itself.</li>
      </ul>
      <p className="text-sm">
        Because your files never reach our servers, we cannot and do not monitor what you process. Responsibility for compliance with
        copyright law and platform rules (for example YouTube's or TikTok's terms) rests entirely with you.
      </p>

      <H2>4. Device Requirements and Performance</H2>
      <p>
        Frame extraction runs on your own CPU, GPU, and RAM. Speed, maximum file size, and format support therefore depend on your
        device and browser rather than on us. Very long or high-resolution videos may exhaust browser memory; extracting fewer frames per
        second or splitting the source file are the recommended workarounds. We recommend a current version of Chrome, Edge, Firefox,
        or Safari.
      </p>

      <H2>5. Availability and Changes</H2>
      <p>
        We aim to keep the Service available at all times but do not guarantee uninterrupted access. We may add, change, or remove
        features, and may update these Terms, at any time. Material changes will be reflected in the "Last updated" date above.
        Continued use after a change constitutes acceptance of the revised Terms.
      </p>

      <H2>6. Advertising</H2>
      <p>
        The Service is funded by advertising served through Google AdSense. Ads are labelled as such and are separate from the tools
        and editorial content. How advertising cookies are used, and how to opt out of personalisation, is described in our{' '}
        <Link to="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link>.
      </p>

      <H2>7. Intellectual Property of the Site</H2>
      <p>
        The website design, articles, and original text are the property of the operator and are protected by copyright. You may quote
        short excerpts with a link back to the source page. The underlying processing code is developed by the operator; where
        third-party open-source libraries are used, they remain subject to their own licences.
      </p>

      <H2>8. Disclaimer of Warranties</H2>
      <p>
        The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied, including
        implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that extracted
        frames will meet any particular quality standard or that the Service will be error-free.
      </p>

      <H2>9. Limitation of Liability</H2>
      <p>
        To the maximum extent permitted by law, the operator shall not be liable for any indirect, incidental, special, consequential,
        or punitive damages, or for any loss of data, revenue, or profits, arising out of or related to your use of the Service — even
        if advised of the possibility of such damages. Our total liability for any claim relating to the Service shall not exceed the
        amount you paid to use it, which is zero.
      </p>

      <H2>10. Governing Law</H2>
      <p>
        These Terms are governed by the laws of Pakistan, without regard to conflict-of-law principles. Nothing in these Terms limits
        any consumer rights you may have under the mandatory laws of your country of residence.
      </p>

      <H2>11. Contact</H2>
      <p>
        Questions about these Terms, copyright notices, or support requests can be sent via the{' '}
        <Link to="/contact" className="text-cyan-400 underline">Contact Page</Link> or by email to{' '}
        <a href="mailto:sachalmahar5700@gmail.com" className="text-cyan-400 font-mono">sachalmahar5700@gmail.com</a>.
      </p>
    </LegalLayout>
  </>
);

export const AboutUs: React.FC = () => <AboutPage />;
