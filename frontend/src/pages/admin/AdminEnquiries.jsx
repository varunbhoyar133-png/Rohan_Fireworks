import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  CheckCircle,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Trash2,
} from 'lucide-react';

import { enquiriesAPI } from '../../services/api';

export const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({
    New: 0,
    Contacted: 0,
    Confirmed: 0,
    Fulfilled: 0,
    Cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected Enquiry Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusChoice, setStatusChoice] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const data = await enquiriesAPI.getAll({
        search: searchQuery,
        status: statusFilter,
        limit: 50,
      });
      setEnquiries(data.enquiries || []);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [searchQuery, statusFilter]);

  const openEnquiryDetails = (enq) => {
    setSelectedEnquiry(enq);
    setStatusChoice(enq.status);
    setAdminNotes(enq.adminNotes || '');
  };

  const handleUpdateStatusAndNotes = async () => {
    if (!selectedEnquiry) return;
    setStatusUpdating(true);
    try {
      const res = await enquiriesAPI.updateStatus(selectedEnquiry._id, {
        status: statusChoice,
        adminNotes,
      });
      setSelectedEnquiry(res.enquiry);
      setToastMessage(`Enquiry ${res.enquiry.enquiryNumber} status updated to ${statusChoice}.`);
      fetchEnquiries();
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleWhatsAppCustomer = (enq) => {
    const cleanPhone = enq.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `*🪔 Rohan Fireworks — Festive Enquiry Follow-up*\n` +
      `Namaste ${enq.customerName} ji! We have reviewed your enquiry (${enq.enquiryNumber}) for festive fireworks delivery in ${enq.city}.\n\n` +
      `Your estimated order value is ₹${enq.totalEstimatedValue?.toLocaleString('en-IN')}.\n` +
      `We have confirmed stock availability. Please let us know if you would like us to reserve this parcel for you.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleDeleteEnquiry = async (id, number) => {
    if (!window.confirm(`Are you sure you want to remove enquiry ${number}?`)) return;
    try {
      await enquiriesAPI.delete(id);
      setSelectedEnquiry(null);
      setToastMessage(`Enquiry ${number} removed.`);
      fetchEnquiries();
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      alert(`Failed to delete enquiry: ${err.message}`);
    }
  };

  const statusColors = {
    New: 'bg-festive-gold/15 text-festive-gold border-festive-gold/30',
    Contacted: 'bg-blue-950/70 text-blue-400 border-blue-500/30',
    Confirmed: 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30',
    Fulfilled: 'bg-purple-950/70 text-purple-400 border-purple-500/30',
    Cancelled: 'bg-rose-950/70 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
            Customer Festive Enquiries
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review customer wishlist enquiries, itemized quotations, and reply directly via WhatsApp.
          </p>
        </div>
      </div>

      {/* Success Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            statusFilter === 'all'
              ? 'bg-festive-gold text-midnight-950'
              : 'bg-midnight-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          All Enquiries ({enquiries.length})
        </button>

        {['New', 'Contacted', 'Confirmed', 'Fulfilled', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              statusFilter === st
                ? 'bg-festive-gold text-midnight-950'
                : 'bg-midnight-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>{st}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-midnight-950/80 text-amber-300">
              {stats[st] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search by customer name, phone, city, or Ref #..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-midnight-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
      </div>

      {/* Enquiries Table */}
      <div className="rounded-2xl bg-midnight-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-midnight-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Enquiry Ref #</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">City / Location</th>
                <th className="p-3.5 text-center">Items</th>
                <th className="p-3.5 text-right">Est. Value</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    Loading customer enquiries...
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No customer enquiries found in this view.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Ref */}
                    <td className="p-3.5 font-mono text-[11px] font-bold text-festive-gold">
                      {enq.enquiryNumber}
                    </td>

                    {/* Customer Info */}
                    <td className="p-3.5">
                      <span className="font-bold text-slate-100 block">
                        {enq.customerName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {enq.phone}
                      </span>
                    </td>

                    {/* City */}
                    <td className="p-3.5 text-slate-300">
                      {enq.city}
                    </td>

                    {/* Items Count */}
                    <td className="p-3.5 text-center font-semibold text-slate-200">
                      {enq.items?.length || 0} types
                    </td>

                    {/* Est. Total */}
                    <td className="p-3.5 text-right font-bold text-slate-100 text-sm">
                      ₹{enq.totalEstimatedValue?.toLocaleString('en-IN')}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          statusColors[enq.status] || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleWhatsAppCustomer(enq)}
                          className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-500/30 transition-colors"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openEnquiryDetails(enq)}
                          className="px-3 py-1.5 rounded-lg bg-midnight-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Inspector Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-midnight-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-midnight-900 border border-festive-gold/30 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs text-festive-gold font-bold">
                  {selectedEnquiry.enquiryNumber}
                </span>
                <h2 className="font-display font-bold text-xl text-slate-100">
                  {selectedEnquiry.customerName}
                </h2>
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Submitted on {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleWhatsAppCustomer(selectedEnquiry)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Reply on WhatsApp
                </button>
              </div>
            </div>

            {/* Customer Details Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-midnight-950 border border-slate-800 text-xs">
              <div className="space-y-1.5">
                <span className="text-slate-400 block font-semibold">Contact Info:</span>
                <p className="flex items-center gap-1.5 text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-festive-gold" />
                  <a href={`tel:${selectedEnquiry.phone}`} className="hover:underline">
                    {selectedEnquiry.phone}
                  </a>
                </p>
                {selectedEnquiry.email && (
                  <p className="flex items-center gap-1.5 text-slate-200">
                    <Mail className="w-3.5 h-3.5 text-festive-gold" />
                    <a href={`mailto:${selectedEnquiry.email}`} className="hover:underline">
                      {selectedEnquiry.email}
                    </a>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-slate-400 block font-semibold">Delivery Destination:</span>
                <p className="flex items-center gap-1.5 text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-festive-gold" />
                  <span>{selectedEnquiry.city}</span>
                </p>
                {selectedEnquiry.address && (
                  <p className="text-slate-300 text-[11px] pl-5">
                    {selectedEnquiry.address}
                  </p>
                )}
              </div>

              {selectedEnquiry.customerNotes && (
                <div className="col-span-1 sm:col-span-2 pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block font-semibold mb-0.5">
                    Customer Request Note:
                  </span>
                  <p className="text-slate-200 italic">"{selectedEnquiry.customerNotes}"</p>
                </div>
              )}
            </div>

            {/* Itemized Order List */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Requested Firework Items ({selectedEnquiry.items?.length})
              </h3>
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-midnight-950 text-slate-400 text-[10px] uppercase">
                    <tr>
                      <th className="p-2.5">Item Name</th>
                      <th className="p-2.5">SKU</th>
                      <th className="p-2.5 text-right">Unit Price</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedEnquiry.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-medium text-slate-100">{item.name}</td>
                        <td className="p-2.5 font-mono text-[11px] text-festive-gold">{item.sku}</td>
                        <td className="p-2.5 text-right">₹{item.price?.toLocaleString('en-IN')}</td>
                        <td className="p-2.5 text-center font-bold text-slate-100">{item.quantity}</td>
                        <td className="p-2.5 text-right font-bold text-festive-gold">
                          ₹{item.subtotal?.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-midnight-950 font-bold border-t border-slate-800">
                    <tr>
                      <td colSpan="4" className="p-2.5 text-right text-slate-200">
                        Total Estimated Amount:
                      </td>
                      <td className="p-2.5 text-right text-festive-gold text-sm">
                        ₹{selectedEnquiry.totalEstimatedValue?.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Status & Notes Updater */}
            <div className="p-4 rounded-2xl bg-midnight-950 border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enquiry Status
                  </label>
                  <select
                    value={statusChoice}
                    onChange={(e) => setStatusChoice(e.target.value)}
                    className="w-full bg-midnight-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted (WhatsApp/Call)</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Fulfilled">Fulfilled / Dispatched</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Internal Admin Note
                  </label>
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="e.g. Quoted 10% festival discount on WhatsApp"
                    className="w-full bg-midnight-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleDeleteEnquiry(selectedEnquiry._id, selectedEnquiry.enquiryNumber)
                  }
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Record
                </button>

                <button
                  type="button"
                  onClick={handleUpdateStatusAndNotes}
                  disabled={statusUpdating}
                  className="px-5 py-2 rounded-xl bg-festive-gradient text-midnight-950 text-xs font-bold hover:shadow-gold transition-all"
                >
                  {statusUpdating ? 'Saving...' : 'Save Status & Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
