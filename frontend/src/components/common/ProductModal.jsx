import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  ShieldCheck,
  Sparkles,
  Volume2,
  Eye,
  AlertTriangle,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { useEnquiry } from '../../context/EnquiryContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';

export const ProductModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useEnquiry();
  const { settings } = useStoreSettings();

  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock <= 0;
  const primaryImage =
    (product.images && product.images.length > 0 && product.images[0])
      ? product.images[0]
      : '/placeholder-firework.svg';

  const handleAdd = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    onClose();
  };

  const handleDirectWhatsApp = () => {
    const rawPhone = settings?.businessInfo?.whatsapp || '+919699976114';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `*🪔 Direct Product Enquiry — Rohan Fireworks*\n` +
      `Product: *${product.name}* (${product.sku})\n` +
      `Price: ₹${product.price} | Qty: ${quantity}\n` +
      `Category: ${product.category?.name || 'Fireworks'}\n\n` +
      `Please let me know if this item is in stock and available for festive booking. Thank you!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-midnight-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl rounded-2xl bg-midnight-900 border border-festive-gold/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-midnight-950/70 border border-slate-700 text-slate-300 hover:text-white hover:border-festive-gold transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div className="relative aspect-square md:aspect-auto h-72 md:h-full bg-midnight-950">
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-900 md:hidden opacity-80"></div>
          </div>

          {/* Details Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-festive-gold/20 border border-festive-gold/40 text-[11px] font-bold text-festive-gold tracking-wider uppercase">
                  {product.category?.name || 'Fireworks'}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  SKU: {product.sku}
                </span>
                {product.isGreenCracker && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-semibold text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Green Cracker
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-100 mb-2">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                {product.priceNeedsReview || !product.price ? (
                  <span className="text-sm font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-500/30">
                    Price on Enquiry (Under Review)
                  </span>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-festive-gold">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </>
                )}
                <span className="text-xs text-slate-400">/ {product.packSize || 'pack'}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-midnight-950 border border-slate-800 text-xs mb-6">
                <div>
                  <span className="text-slate-400 block mb-0.5">Sound Level:</span>
                  <span className="font-semibold text-amber-300 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" />
                    {product.soundLevel || 'Standard'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Visual Effect:</span>
                  <span className="font-semibold text-slate-200 line-clamp-1">
                    {product.visualEffect || 'Sparks'}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 block mb-0.5">Safe Viewing Distance:</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-emerald-400" />
                    {product.safetyDistance || '5 Meters in open outdoor ground'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions & Quantity */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  Enquiry Quantity:
                </span>
                <div className="flex items-center gap-3 bg-midnight-950 border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-slate-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={`py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-festive-gradient text-midnight-950 hover:shadow-gold'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Enquiry'}
                </button>

                <button
                  onClick={handleDirectWhatsApp}
                  className="py-3 px-4 rounded-xl font-semibold text-xs tracking-wider uppercase bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  WhatsApp Query
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
