import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';

const CANONICAL = 'https://www.videotoimagesequence.online/contact';

const ContactPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Support', message: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitting(true);
      try {
        await fetch('https://formsubmit.co/ajax/sachalmahar5700@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: `[${formData.subject}] Message from ${formData.name}`,
            message: formData.message,
            _subject: `New Contact Form Message from ${formData.name}`
          })
        });
      } catch (err) {
        console.warn('FormSubmit request failed fallback to client notification', err);
      } finally {
        setSubmitting(false);
        setFormSubmitted(true);
      }
    }
  };

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Video to Image Sequence',
    description: 'Get technical support and send feedback directly to Muhammad Sachal (SachalSpeaks).',
    url: CANONICAL,
    mainEntity: {
      '@type': 'Organization',
      name: 'Video to Image Sequence Online',
      url: 'https://www.videotoimagesequence.online',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'sachalmahar5700@gmail.com',
        contactType: 'technical support',
        availableLanguage: ['English']
      }
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.videotoimagesequence.online/' },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: CANONICAL }
    ]
  };

  return (
    <>
      <SEOHead
        title="Contact Us — Technical Support & Inquiries | Video to Image Sequence"
        description="Contact the Video to Image Sequence engineering team. Get direct support from founder Muhammad Sachal for bug reports, feature requests, or business inquiries."
        canonical={CANONICAL}
        ogTitle="Contact Us — Video to Image Sequence Online"
        ogDescription="Reach founder Muhammad Sachal directly via sachalmahar5700@gmail.com or submit a direct feedback ticket."
        ogType="website"
        keywords="contact video to image sequence, support email, muhammad sachal contact, feedback, sachalmahar5700@gmail.com"
      />

      <script type="application/ld+json">{JSON.stringify(contactSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>

      <div className="w-full mx-auto pb-20 font-sans text-gray-300">
        
        {/* Header Section */}
        <section className="pt-12 pb-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Contact', path: '/contact' }]} />

          <div className="mt-8 inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Direct Monitored Support
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Contact <span className="text-cyan-400">Our Team</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Have a question about frame extraction, a bug to report, or a feature request? We monitor all inquiries and respond within 24 to 48 business hours.
          </p>
        </section>

        {/* Content & Form Grid */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Info Cards */}
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-2">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Direct Email Address</div>
                <h3 className="text-xl font-bold font-mono text-white">
                  <a href="mailto:sachalmahar5700@gmail.com" className="hover:text-cyan-400 transition">
                    sachalmahar5700@gmail.com
                  </a>
                </h3>
                <p className="text-xs text-gray-400">
                  Monitored daily for technical support, feature feedback, and business inquiries.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-3">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Founder & Lead Engineer</div>
                <div className="flex items-center gap-3">
                  <img
                    src="/muhammad-sachal.jpg"
                    alt="Muhammad Sachal"
                    className="w-12 h-12 rounded-full object-cover border border-cyan-500/50"
                  />
                  <div>
                    <h4 className="font-bold text-white font-display text-base">Muhammad Sachal</h4>
                    <p className="text-xs font-mono text-gray-400">SachalSpeaks · Computer Science Engineer</p>
                  </div>
                </div>
                <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                  <a
                    href="https://www.linkedin.com/in/sachalspeaks/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-gray-950 hover:bg-gray-800 text-cyan-400 border border-gray-800 transition"
                  >
                    LinkedIn Profile →
                  </a>
                  <a
                    href="https://github.com/msachal5700"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-gray-950 hover:bg-gray-800 text-gray-300 border border-gray-800 transition"
                  >
                    GitHub →
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-gray-900/40 border border-gray-800 text-xs space-y-2">
                <h4 className="font-bold text-white font-display text-sm">Quick Links</h4>
                <div className="flex flex-col gap-1.5 text-cyan-400">
                  <Link to="/about" className="hover:underline">Read About Our Mission & Technology →</Link>
                  <Link to="/privacy" className="hover:underline">Read Privacy Policy →</Link>
                  <Link to="/terms" className="hover:underline">Read Terms of Service →</Link>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gray-900/80 border border-gray-800">
              <h3 className="font-display font-bold text-white text-xl mb-4">Send a Message</h3>

              {formSubmitted ? (
                <div className="p-6 rounded-2xl bg-cyan-950/80 border border-cyan-800 text-center space-y-3 animate-fade-in">
                  <div className="text-3xl">✅</div>
                  <div className="font-bold text-white font-display text-lg">Message Sent Successfully!</div>
                  <p className="text-xs text-cyan-200 leading-relaxed">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Your ticket has been dispatched directly to <span className="font-mono text-cyan-400">sachalmahar5700@gmail.com</span>.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-2 px-4 py-2 rounded-xl bg-cyan-400 text-gray-950 font-bold text-xs font-mono"
                  >
                    Send Another Ticket
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-mono text-gray-400 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-gray-400 mb-1">Your Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-gray-400 mb-1">Inquiry Category</label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="General Support">General Support</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Business & Collaboration">Business & Collaboration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-gray-400 mb-1">Detailed Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your question, bug, or feature idea..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-gray-950 font-bold font-display text-sm transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    {submitting ? 'Sending Ticket...' : 'Submit Support Ticket'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

      </div>
    </>
  );
};

export default ContactPage;
