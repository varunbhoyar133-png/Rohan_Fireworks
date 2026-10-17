import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Send,
  Sparkles,
  CheckCircle,
  MessageCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useEnquiry } from '../../context/EnquiryContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { enquiriesAPI } from '../../services/api';

export const EnquirySubmitModal = () => {
  const {
    items,
    isSubmitModalOpen,
    closeSubmitModal,
    totalEstimatedAmount,
    clearEnquiry,
  } = useEnquiry();
  const { settings } = useStoreSettings();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    customerNotes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedEnquiry, setSubmittedEnquiry] = useState(null);

  if (!isSubmitModalOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.customerName.trim() || !formData.phone.trim() || !formData.city.trim()) {
      setErrorMessage('Please fill in your name, contact phone number, and city.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your festive enquiry list is empty.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        address: formData.address,
        customerNotes: formData.customerNotes,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        channel: 'Web Catalogue Enquiry',
      };

      const result = await enquiriesAPI.submit(payload);

      // Trigger festive sparkle confetti effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#EA580C', '#FEF08A', '#10B981'],
        });
      } catch (cErr) {
        // Confetti optional
      }

      setSubmittedEnquiry(result);
      clearEnquiry();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again or WhatsApp us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendToWhatsApp = () => {
    const rawPhone = settings?.businessInfo?.whatsapp || '+919876543210';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const enqNum = submittedEnquiry?.enquiryNumber || 'RF-ENQ';

    const message = encodeURIComponent(
      `*🪔 Festive Enquiry Reference: ${enqNum}*\n` +
      `Namaste Rohan Fireworks! I have just submitted my festive enquiry online.\n` +
      `Name: ${formData.customerName}\n` +
      `City: ${formData.city}\n` +
      `Estimated Amount: ₹${submittedEnquiry?.totalEstimatedValue || totalEstimatedAmount}\n\n` +
      `Kindly review and confirm stock allotment & delivery details. Thank you!`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleModalClose = () => {
    setSubmittedEnquiry(null);
    setFormData({
      customerName: '',
      phone: '',
      email: '',
      city: '',
      address: '',
      customerNotes: '',
    });
    closeSubmitModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-midnight-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-midnight-900 border border-festive-gold/30 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedEnquiry ? (
          // Success State
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-gold">
              <CheckCircle className="w-9 h-9" />
            </div>

            <h3 className="font-display font-bold text-2xl text-slate-100">
              Enquiry Received!
            </h3>

            <div className="p-4 rounded-xl bg-midnight-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Enquiry Reference:</span>
                <span className="font-mono font-bold text-festive-gold text-sm">
                  {submittedEnquiry.enquiryNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Estimated Total:</span>
                <span className="font-bold text-slate-100">
                  ₹{submittedEnquiry.totalEstimatedValue?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Thank you, <strong className="text-slate-100">{formData.customerName}</strong>! Our sales team will review stock availability and contact you on <strong className="text-slate-100">{formData.phone}</strong>.
            </p>

            <div className="pt-2 space-y-2.5">
              <button
                onClick={handleSendToWhatsApp}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Notify Store via WhatsApp
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleModalClose}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Close & Return to Store
              </button>
            </div>
          </div>
        ) : (
          // Form State
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-festive-gold" />
              <h3 className="font-display font-bold text-xl text-slate-100">
                Submit Festive Enquiry
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Enter your details to request an official quotation for your selected fireworks. No immediate payment required.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Vikram Sharma"
                  className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. vikram@example.com"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Delivery City / Town *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Chennai / Bengaluru / Sivakasi"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Delivery Area / Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. Anna Nagar West"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Festive Occasion or Custom Notes
                </label>
                <textarea
                  name="customerNotes"
                  rows="2"
                  value={formData.customerNotes}
                  onChange={handleChange}
                  placeholder="e.g. Diwali family celebration, delivery needed before Nov 10"
                  className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
                ></textarea>
              </div>

              {/* Estimate Summary */}
              <div className="p-3 rounded-xl bg-midnight-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {items.length} item types in wishlist:
                </span>
                <span className="font-bold text-festive-gold text-sm">
                  Est. ₹{totalEstimatedAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase bg-festive-gradient text-midnight-950 hover:shadow-gold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <span>Submitting Enquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Enquiry Request
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquirySubmitModal;
