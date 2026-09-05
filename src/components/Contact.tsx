import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Instagram, MessageCircle, MapPin, Send, CheckCircle, ExternalLink, ShieldCheck, ArrowRight, Copy, Check } from 'lucide-react';
import { db, collection, addDoc } from '../firebase';

const TARGET_GMAIL = 'usradiia9@gmail.com';

interface SentSummary {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  gmailComposeUrl?: string;
  mailtoUrl?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sentSummary, setSentSummary] = useState<SentSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const subjectText = formData.subject.trim() || `Inquiry from ${formData.name.trim() || 'Visitor'}`;
  const bodyText = `Sender: ${formData.name.trim()} (${formData.email.trim()})\nSubject: ${subjectText}\n\nMessage:\n${formData.message.trim()}`;
  const liveGmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TARGET_GMAIL)}&su=${encodeURIComponent(`[USRA Direct] ${subjectText}`)}&body=${encodeURIComponent(bodyText)}`;
  const liveMailtoUrl = `mailto:${encodeURIComponent(TARGET_GMAIL)}?subject=${encodeURIComponent(`[USRA Direct] ${subjectText}`)}&body=${encodeURIComponent(bodyText)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const subjectFinal = formData.subject.trim() || `Inquiry from ${formData.name.trim()}`;
    const bodyFinal = `Sender: ${formData.name.trim()} (${formData.email.trim()})\nSubject: ${subjectFinal}\n\nMessage:\n${formData.message.trim()}`;

    const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TARGET_GMAIL)}&su=${encodeURIComponent(`[USRA Portal] ${subjectFinal}`)}&body=${encodeURIComponent(bodyFinal)}`;
    const mailto = `mailto:${encodeURIComponent(TARGET_GMAIL)}?subject=${encodeURIComponent(`[USRA Portal] ${subjectFinal}`)}&body=${encodeURIComponent(bodyFinal)}`;

    try {
      // 1. Log directly to Firebase Firestore
      const firestorePromise = addDoc(collection(db, 'inquiries'), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: subjectFinal,
        message: formData.message.trim(),
        targetEmail: TARGET_GMAIL,
        createdAt: new Date().toISOString(),
        source: 'contact_section'
      }).catch((err) => {
        console.warn('Firestore inquiry log notice:', err);
        return null;
      });

      // 2. Send via local server endpoint (persists to inquiries.json + relays)
      const serverPromise = fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: subjectFinal,
          message: formData.message.trim(),
          targetEmail: TARGET_GMAIL,
        }),
      }).catch((err) => {
        console.warn('Server contact dispatch warning:', err);
        return null;
      });

      // 3. Dispatch via FormSubmit AJAX endpoint configured for usradiia9@gmail.com
      const formSubmitPromise = fetch(`https://formsubmit.co/ajax/${TARGET_GMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: `[USRA Direct] ${subjectFinal}`,
          message: formData.message.trim(),
          _subject: `[USRA Direct] ${subjectFinal} from ${formData.name.trim()}`,
          _replyto: formData.email.trim(),
          _captcha: 'false',
          _template: 'table',
        }),
      }).catch((err) => {
        console.warn('FormSubmit external dispatch warning:', err);
        return null;
      });

      // Wait for dispatch attempts
      await Promise.allSettled([firestorePromise, serverPromise, formSubmitPromise]);

      setSentSummary({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: subjectFinal,
        message: formData.message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        gmailComposeUrl: gmailCompose,
        mailtoUrl: mailto,
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error('Contact submission error:', err);
      // Even if network fails, still allow user to open in Gmail compose
      setSentSummary({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: subjectFinal,
        message: formData.message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        gmailComposeUrl: gmailCompose,
        mailtoUrl: mailto,
      });
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyMessage = () => {
    if (!sentSummary) return;
    const textToCopy = `To: ${TARGET_GMAIL}\nFrom: ${sentSummary.name} (${sentSummary.email})\nSubject: ${sentSummary.subject}\n\n${sentSummary.message}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="relative py-28 bg-[#050505] overflow-hidden">
      {/* Background soft color glow spots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-blue-600/5 via-indigo-600/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        
        {/* Section Heading */}
        <div className="text-center mb-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold mb-3">Initiate Connection</p>
          <h2 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight">Connect With USRA</h2>
          <div className="h-1 bg-gradient-to-r from-blue-600 to-cyan-400 w-20 mx-auto mt-6 rounded-full" />
        </div>

        {/* Master Double-Pane Glass Container */}
        <div className="glass-panel-heavy rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative shadow-2xl border-white/10">
          {/* Top gloss */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Left Pane: Information Desk */}
          <div className="md:col-span-5 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between relative bg-neutral-950/40">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-blue-400 font-bold mb-6 block">
                Office Coordinates
              </span>
              <h3 className="font-display font-extrabold text-2xl text-white tracking-wide mb-4">
                Let&#39;s collaborate on something extraordinary.
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed mb-8">
                Whether you have an event requiring coverage, a graphic brand setup, or you want to register for our creative cohort, reach out!
              </p>

              {/* Coordinates List */}
              <div className="space-y-6">
                {/* Email */}
                <a 
                  href="mailto:usradiia9@gmail.com" 
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-blue-500/30 transition-all duration-300">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">General Inquiry</span>
                    <span className="text-xs text-neutral-300 group-hover:text-white transition-colors duration-200">usradiia9@gmail.com</span>
                  </div>
                </a>

                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/usra_media/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-blue-500/30 transition-all duration-300">
                    <Instagram className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">Instagram Feed</span>
                    <span className="text-xs text-neutral-300 group-hover:text-white transition-colors duration-200">@usra_media</span>
                  </div>
                </a>

                {/* WhatsApp */}
                <a 
                  href="https://wa.me" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-blue-500/30 transition-all duration-300">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">Hotline Support</span>
                    <span className="text-xs text-neutral-300 group-hover:text-white transition-colors duration-200">+1 (555) 019-2831</span>
                  </div>
                </a>

                {/* Location */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">Location</span>
                    <span className="text-xs text-neutral-300 font-sans">Darul Irfan Islamic Academy, Pandikkad</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro details at bottom */}
            <div className="mt-12 pt-6 border-t border-white/5 font-mono text-[9px] uppercase tracking-widest text-neutral-600">
              Response SLA: &lt; 24 Hours
            </div>
          </div>

          {/* Right Pane: Contact Form */}
          <div className="md:col-span-7 p-8 md:p-12 relative bg-neutral-900/10">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">Your Identity</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Liam Vance"
                        className="w-full px-4 py-3.5 rounded-xl border border-white/5 bg-white/5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">Secure Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. liam@example.com"
                        className="w-full px-4 py-3.5 rounded-xl border border-white/5 bg-white/5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">Campaign Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="e.g. Media coverage proposal"
                      className="w-full px-4 py-3.5 rounded-xl border border-white/5 bg-white/5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">Brief Message Description</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Share your concepts or proposal notes..."
                      className="w-full px-4 py-3.5 rounded-xl border border-white/5 bg-white/5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Destination Routing Indicator */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-500/30 text-xs">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300">Direct Message Channel</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] border border-blue-500/30">
                        Direct to Inbox
                      </span>
                    </div>
                    <p className="text-neutral-300 text-xs leading-relaxed">
                      Every message typed here is instantly dispatched directly to{' '}
                      <span className="text-white font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                        {TARGET_GMAIL}
                      </span>
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="space-y-3">
                    {/* Primary Glass Submit CTA */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative group overflow-hidden w-full py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest text-white border border-blue-500/40 bg-blue-600/20 hover:bg-blue-600/30 hover:border-blue-400 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] shadow-lg cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Routing directly to {TARGET_GMAIL}...
                        </span>
                      ) : (
                        <span className="relative z-10 flex items-center gap-2">
                          <span>Send Message Direct to {TARGET_GMAIL}</span>
                          <Send className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                        </span>
                      )}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-20 transition-transform duration-500 ease-out" />
                    </button>

                    {/* Direct Quick Launch Fallbacks */}
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <a
                        href={liveGmailComposeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-[11px] font-mono text-neutral-300 hover:text-cyan-300 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Mail className="w-3 h-3 text-cyan-400" />
                        <span>Pre-fill in Gmail</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                      <a
                        href={liveMailtoUrl}
                        className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 text-[11px] font-mono text-neutral-300 hover:text-blue-300 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3 h-3 text-blue-400" />
                        <span>System Mail App</span>
                      </a>
                    </div>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success-banner"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center p-6 sm:p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.6, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-5 shadow-2xl shadow-emerald-500/10"
                  >
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </motion.div>
                  <h3 className="font-display font-black text-2xl text-white tracking-wide mb-2">
                    Message Dispatched Direct
                  </h3>
                  <p className="text-neutral-300 text-xs max-w-md leading-relaxed mb-6">
                    Your message has been received and routed directly to{' '}
                    <span className="text-cyan-300 font-mono font-bold">{TARGET_GMAIL}</span>.
                  </p>

                  {/* Summary Card */}
                  {sentSummary && (
                    <div className="w-full max-w-md p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left mb-6 space-y-2.5 font-mono text-[11px]">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2 text-neutral-400">
                        <span>Direct Target:</span>
                        <span className="text-cyan-400 font-bold">{TARGET_GMAIL}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2 text-neutral-400">
                        <span>Sender:</span>
                        <span className="text-white truncate max-w-[220px]">{sentSummary.name} ({sentSummary.email})</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2 text-neutral-400">
                        <span>Subject:</span>
                        <span className="text-neutral-200 truncate max-w-[200px]">{sentSummary.subject}</span>
                      </div>
                      <div className="flex justify-between items-center text-neutral-400 pt-1">
                        <span>Transmission Time:</span>
                        <span className="text-emerald-400">{sentSummary.timestamp}</span>
                      </div>
                    </div>
                  )}

                  {/* Action CTA buttons */}
                  <div className="space-y-3 w-full max-w-md">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {sentSummary?.gmailComposeUrl && (
                        <a
                          href={sentSummary.gmailComposeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="py-3 px-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-xs font-semibold text-cyan-300 tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Open in Gmail</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      )}
                      <button
                        onClick={handleCopyMessage}
                        className="py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
                        <span>{copied ? 'Copied to Clipboard!' : 'Copy Message'}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setSubmitted(false)}
                      className="w-full py-3 px-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-semibold text-neutral-300 hover:text-white tracking-wide transition-all duration-200 cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
