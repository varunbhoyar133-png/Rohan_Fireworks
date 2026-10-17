import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Plus, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import { useEnquiry } from '../../context/EnquiryContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addItem } = useEnquiry();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 10);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const primaryImage =
    (product.images && product.images.length > 0 && product.images[0])
      ? product.images[0]
      : '/placeholder-firework.svg';

  return (
    <div className="group relative rounded-2xl bg-midnight-900 border border-slate-800/90 hover:border-festive-gold/40 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-gold">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-1 pointer-events-none">
        <div className="flex flex-col gap-1">
          {product.isGreenCracker && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-semibold text-emerald-300 backdrop-blur-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Green Cracker
            </span>
          )}
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-[10px] font-bold text-amber-300 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-festive-gold" />
              Festive Best
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div>
          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded-full bg-rose-950/90 border border-rose-500/40 text-[10px] font-bold text-rose-300 backdrop-blur-sm">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/40 text-[10px] font-bold text-amber-300 backdrop-blur-sm animate-pulse">
              Only {product.stock} Left!
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-[10px] font-medium text-slate-300 backdrop-blur-sm">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Image & Quick Actions */}
      <div className="relative aspect-square w-full overflow-hidden bg-midnight-950">
        <img
          src={primaryImage}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-transparent to-transparent opacity-60"></div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-midnight-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="p-2.5 rounded-xl bg-midnight-900/90 border border-festive-gold/30 text-white hover:text-festive-gold hover:border-festive-gold transition-colors shadow-lg"
              title="Quick View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium text-amber-400/80 uppercase tracking-wider text-[10px]">
              {product.category?.name || 'Festive Cracker'}
            </span>
            <span className="font-mono text-[10px] text-slate-400">{product.sku}</span>
          </div>

          <Link
            to={`/product/${product.slug || product._id}`}
            className="block font-display font-semibold text-slate-100 hover:text-festive-gold transition-colors line-clamp-1 text-base sm:text-lg mb-1.5"
            title={product.name}
          >
            {product.name}
          </Link>

          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
            {product.description}
          </p>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3">
            <span className="px-2 py-0.5 rounded bg-midnight-800 border border-slate-800">
              {product.packSize || '1 Pack'}
            </span>
            <span className="px-2 py-0.5 rounded bg-midnight-800 border border-slate-800 text-amber-300/80">
              {product.soundLevel || 'Safe'}
            </span>
          </div>
        </div>

        {/* Price & Add to Enquiry */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              {product.priceNeedsReview || !product.price ? (
                <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                  Price on Enquiry
                </span>
              ) : (
                <>
                  <span className="text-lg font-bold text-festive-gold">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-400">Catalogue Rate</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-festive-gold/15 hover:bg-festive-gold text-festive-gold hover:text-midnight-950 border border-festive-gold/40 hover:border-festive-gold'
            }`}
          >
            {addedAnimation ? (
              <span>Added!</span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Enquire</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
