import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  FileText,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useEnquiry } from '../../context/EnquiryContext';

export const EnquiryDrawer = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    clearEnquiry,
    totalItemsCount,
    totalEstimatedAmount,
    openSubmitModal,
    openWhatsAppEnquiry,
  } = useEnquiry();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-midnight-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeDrawer} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-midnight-900 border-l border-festive-gold/25 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-midnight-950">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-festive-gold/15 border border-festive-gold/30 text-festive-gold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-slate-100 text-lg">
                  Festive Enquiry List
                </h2>
                <p className="text-[11px] text-amber-300/80">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected for quotation
                </p>
              </div>
            </div>

            <button
              onClick={closeDrawer}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="p-4 rounded-full bg-midnight-950 border border-slate-800 mb-3 text-slate-500">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-display font-semibold text-slate-200 text-base mb-1">
                  Your festive list is empty
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mb-4">
                  Browse our fireworks collection and add products to generate an instant enquiry quote.
                </p>
                <button
                  onClick={closeDrawer}
                  className="px-4 py-2 rounded-xl bg-festive-gold/15 hover:bg-festive-gold text-festive-gold hover:text-midnight-950 border border-festive-gold/40 text-xs font-bold transition-all"
                >
                  Explore Catalogue
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="p-3.5 rounded-xl bg-midnight-950 border border-slate-800/80 flex items-center gap-3.5 hover:border-slate-700 transition-colors"
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-midnight-900 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-100 truncate mb-0.5">
                      {item.name}
                    </h4>
                    <span className="font-mono text-[10px] text-slate-400 block mb-1">
                      {item.sku} • {item.packSize || '1 pack'}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-festive-gold">
                      <span>₹{item.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        = ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Adjustment */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5 bg-midnight-900 border border-slate-800 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 rounded text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 rounded text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-midnight-950 space-y-3.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Estimated Items:</span>
                <span className="font-semibold text-slate-200">{totalItemsCount} units</span>
              </div>

              <div className="flex items-baseline justify-between pt-1 border-t border-slate-800/80">
                <span className="font-display font-semibold text-sm text-slate-200">
                  Total Estimated Value:
                </span>
                <span className="text-xl font-bold text-festive-gold">
                  ₹{totalEstimatedAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-midnight-900 border border-slate-800 text-[10px] text-slate-400 flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-festive-gold flex-shrink-0 mt-0.5" />
                <span>
                  Final quotation & safe doorstep dispatch confirmed upon order inquiry submission. No online payment required upfront.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    closeDrawer();
                    openSubmitModal();
                  }}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase bg-festive-gradient text-midnight-950 hover:shadow-gold flex items-center justify-center gap-2 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Submit Festive Enquiry
                </button>

                <button
                  onClick={() => openWhatsAppEnquiry()}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-wider uppercase bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  Direct WhatsApp Quotation
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  onClick={clearEnquiry}
                  className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Clear All Selected Items
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnquiryDrawer;
