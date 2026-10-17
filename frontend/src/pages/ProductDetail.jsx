import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  MessageCircle,
  AlertTriangle,
  Volume2,
  Package,
  Eye,
  CheckCircle2,
  Share2,
} from 'lucide-react';

import ProductCard from '../components/common/ProductCard';
import { productsAPI } from '../services/api';
import { useEnquiry } from '../context/EnquiryContext';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const ProductDetail = () => {
  const { idOrSlug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(false);

  const { addItem } = useEnquiry();
  const { settings } = useStoreSettings();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productsAPI.getByIdOrSlug(idOrSlug);
        if (data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.images?.[0] || '');
        }
        setRelatedProducts(data.relatedProducts || []);
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        <Sparkles className="w-8 h-8 text-festive-gold animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading festive product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-display font-bold text-slate-100">Product Not Found</h2>
        <p className="text-xs text-slate-400">
          The product you are looking for might have been retired or does not exist.
        </p>
        <Link
          to="/shop"
          className="inline-block px-5 py-2.5 rounded-xl bg-festive-gold text-midnight-950 font-bold text-xs"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 10);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleDirectWhatsApp = () => {
    const rawPhone = settings?.businessInfo?.whatsapp || '+919876543210';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
        <Link to="/" className="hover:text-festive-gold transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-festive-gold transition-colors">
          Catalogue
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {product.category && (
          <>
            <Link
              to={`/shop?category=${product.category.slug}`}
              className="hover:text-festive-gold transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="text-slate-200 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Gallery Column */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-midnight-900 border border-festive-gold/30 shadow-2xl">
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isGreenCracker && (
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-semibold text-emerald-300 backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Green Cracker Certified
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails if multiple images exist */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img
                      ? 'border-festive-gold shadow-gold scale-95'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions Column */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-festive-gold/20 border border-festive-gold/40 text-xs font-bold text-festive-gold uppercase tracking-wider">
                {product.category?.name || 'Festive Fireworks'}
              </span>
              <span className="font-mono text-xs text-slate-400">SKU: {product.sku}</span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-4xl text-slate-100 leading-tight">
              {product.name}
            </h1>

            {/* Price & Stock Badge */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-extrabold text-festive-gold">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-slate-400">/ {product.packSize || '1 Pack'}</span>

              <div className="ml-auto">
                {isOutOfStock ? (
                  <span className="px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse">
                    Only {product.stock} Left!
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium">
                    In Stock ({product.stock} units)
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Specifications Cards */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="p-3.5 rounded-xl bg-midnight-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Sound Rating:</span>
                <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-festive-gold" />
                  {product.soundLevel || 'Standard Festive'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-midnight-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Pack Size / Units:</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-festive-gold" />
                  {product.packSize || '1 Pack'}
                </span>
              </div>

              <div className="col-span-2 p-3.5 rounded-xl bg-midnight-900 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Visual Effect:</span>
                <span className="font-semibold text-slate-200">
                  {product.visualEffect || 'Multi-Color Sparkling Embers'}
                </span>
              </div>
            </div>

            {/* Safety Clearance Box */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5">
                  Safe Ignition Advisory:
                </strong>
                <span>
                  Maintain at least <strong>{product.safetyDistance || '5 Meters'}</strong> safe clearance. Always ignite on flat outdoor open ground under adult supervision.
                </span>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Quantity for Enquiry:
              </span>
              <div className="flex items-center gap-3 bg-midnight-900 border border-slate-700 rounded-xl p-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-100">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`py-3.5 px-6 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-festive-gradient text-midnight-950 hover:shadow-gold'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {addedToast ? 'Added to Enquiry!' : 'Add to Festive Enquiry'}
              </button>

              <button
                onClick={handleDirectWhatsApp}
                className="py-3.5 px-6 rounded-xl font-semibold text-xs tracking-wider uppercase bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Enquire via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-slate-100">
              Related In {product.category?.name || 'This Category'}
            </h3>
            <Link
              to={`/shop?category=${product.category?.slug}`}
              className="text-xs text-festive-gold hover:underline font-semibold"
            >
              View More
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
