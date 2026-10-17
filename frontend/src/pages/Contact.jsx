import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Sparkles,
  Send,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const Contact = () => {
  const { settings } = useStoreSettings();
  const info = settings?.businessInfo || {};
  const cleanWhatsApp = (info.whatsapp || '+919699976114').replace(/[^0-9]/g, '');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `*🪔 Store Inquiry — Rohan Fireworks*\n` +
      `Name: ${form.name || 'Customer'}\n` +
      `Phone: ${form.phone || 'Not provided'}\n` +
      `Message: ${form.message || 'I would like to inquire about festive fireworks.'}`
    );
    window.open(`https://wa.me/${cleanWhatsApp}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-festive-gold/15 border border-festive-gold/40 text-festive-gold text-xs font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Get In Touch
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-100">
          Contact & Store Visit
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          We are here to assist with festive orders, product inquiries, safety instructions, and bulk celebration requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact Cards */}
        <div className="space-y-4">
          {/* Phone */}
          <div className="p-6 rounded-2xl bg-midnight-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-festive-gold/15 text-festive-gold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Call Us Directly
                </h3>
                <a
                  href={`tel:${info.phone}`}
                  className="font-display font-bold text-base text-slate-100 hover:text-festive-gold transition-colors"
                >
                  {info.phone || '+91 96999 76114'}
                </a>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pl-12">
              Assistance available during standard working hours.
            </p>
          </div>

          {/* WhatsApp */}
          <div className="p-6 rounded-2xl bg-midnight-900 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  WhatsApp Support
                </h3>
                <span className="font-display font-bold text-base text-slate-100">
                  {info.whatsapp || '+91 96999 76114'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-300">
              Fastest channel for catalogue quotations and instant item confirmation.
            </p>
            <a
              href={`https://wa.me/${cleanWhatsApp}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open WhatsApp Chat</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Email */}
          <div className="p-6 rounded-2xl bg-midnight-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-festive-orange/15 text-festive-orange">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Email Inquiries
                </h3>
                <a
                  href={`mailto:${info.email}`}
                  className="font-display font-bold text-sm text-slate-100 hover:text-festive-gold transition-colors break-all"
                >
                  {info.email || 'contact@rohanfireworks.com'}
                </a>
              </div>
            </div>
          </div>

          {/* Store Hours & Address */}
          <div className="p-6 rounded-2xl bg-midnight-900 border border-slate-800 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300 flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Business Hours
                </h3>
                <p className="text-xs text-slate-200">
                  {info.businessHours || 'Monday – Sunday: 9:00 AM – 9:00 PM IST'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-slate-800">
              <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Retail Store Address
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {info.address || 'Plot 42, Festive Fireworks Market, Sivakasi Main Road, Tamil Nadu - 626123, India'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-2 rounded-3xl bg-midnight-900 border border-slate-800 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-100 mb-2">
              Send an Online Message
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Fill in your details below and our customer support team will get in touch with you.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-midnight-950 border border-emerald-500/40 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="font-display font-bold text-xl text-slate-100">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thank you for reaching out, {form.name || 'Friend'}. We have received your inquiry and will contact you promptly.
                </p>
                <button
                  onClick={handleWhatsAppDirect}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Continue On WhatsApp
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Rahul Mehta"
                      className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. +91 96999 76114"
                      className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="e.g. Diwali Booking / Product Query"
                      className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what fireworks or celebration assistance you require..."
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-festive-gradient text-midnight-950 hover:shadow-gold flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
