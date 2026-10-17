import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  PackageCheck,
  ChevronRight,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Eye,
  CheckCircle2,
  Flame,
} from 'lucide-react';

import ProductCard from '../components/common/ProductCard';
import ProductModal from '../components/common/ProductModal';
import { productsAPI, categoriesAPI } from '../services/api';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const Home = () => {
  const { settings } = useStoreSettings();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          productsAPI.getAll({ isFeatured: 'true', limit: 8 }),
          categoriesAPI.getAll(),
        ]);
        setFeaturedProducts(prodData.products || []);
        setCategories(catData.categories || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const promo = settings?.promoBanner || {};
  const business = settings?.businessInfo || {};
  const cleanWhatsApp = (business.whatsapp || '+919699976114').replace(/[^0-9]/g, '');

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden bg-midnight-950 border-b border-festive-gold/15">
        {/* Subtle Decorative Fireworks Ambient Glow */}
        <div className="absolute inset-0 bg-midnight-radial pointer-events-none"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-festive-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-festive-orange/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Ambient Subtle Sparks Background Image */}
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-screen"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=1600&auto=format&fit=crop&q=80')`,
          }}
        ></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-24">
          {/* Festive Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-festive-gold/15 border border-festive-gold/40 text-festive-gold text-xs font-bold tracking-widest uppercase mb-6 shadow-gold">
            <Sparkles className="w-4 h-4 text-festive-gold animate-pulse" />
            <span>Official Festive Catalogue 2026</span>
          </div>

          {/* Headline strictly matching prompt */}
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-slate-100 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Celebrate Every Moment with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-festive-gold via-amber-300 to-festive-orange">
              Rohan Fireworks
            </span>
          </h1>

          {/* Supporting text strictly matching prompt */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Make every celebration memorable with our festive collection.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm tracking-wider uppercase bg-festive-gradient text-midnight-950 hover:shadow-gold-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/categories"
              className="w-full sm:w-auto px-6 py-4 rounded-xl font-semibold text-sm tracking-wider uppercase bg-midnight-900/80 hover:bg-midnight-800 text-slate-200 hover:text-white border border-slate-700/80 hover:border-festive-gold/50 flex items-center justify-center gap-2 transition-all"
            >
              <span>View Categories</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-800/80 text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-midnight-900/40 border border-slate-800/60">
              <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Green Certified</h4>
                <p className="text-[11px] text-slate-400">CSIR-NEERI Approved</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-midnight-900/40 border border-slate-800/60">
              <PackageCheck className="w-6 h-6 text-festive-gold flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Direct Sourcing</h4>
                <p className="text-[11px] text-slate-400">Authentic Formulations</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-midnight-900/40 border border-slate-800/60">
              <Flame className="w-6 h-6 text-festive-orange flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Vibrant Visuals</h4>
                <p className="text-[11px] text-slate-400">Rich Color Bursts</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-midnight-900/40 border border-slate-800/60">
              <CheckCircle2 className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Family Safe</h4>
                <p className="text-[11px] text-slate-400">Clear Safety Distance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-festive-gold uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Festive Varieties
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
              Explore Our Product Categories
            </h2>
          </div>
          <Link
            to="/categories"
            className="mt-3 md:mt-0 inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-festive-gold hover:text-white transition-colors"
          >
            All Categories
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-midnight-900 border border-slate-800 hover:border-festive-gold/40 transition-all duration-300 hover:shadow-gold flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-midnight-950">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/40 to-transparent"></div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-slate-100 group-hover:text-festive-gold transition-colors text-sm sm:text-base mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-semibold text-amber-400">
                  <span>{cat.productCount ? `${cat.productCount} Items` : 'Explore'}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-festive-gold uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Handpicked Selections
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
              Featured Festive Fireworks
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-3 md:mt-0 inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase text-festive-gold hover:text-white transition-colors"
          >
            Explore Complete Catalogue ({featuredProducts.length}+)
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-2xl bg-midnight-900 border border-slate-800 h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. PROMOTIONAL BANNER SECTION */}
      {promo.enabled && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-midnight-900 via-amber-950/70 to-midnight-900 border border-festive-gold/30 p-8 sm:p-12 shadow-gold">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-cover bg-center opacity-15 hidden lg:block pointer-events-none"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80')` }}
            ></div>

            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-festive-gold/20 border border-festive-gold/40 text-[11px] font-bold text-festive-gold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-festive-gold" />
                {promo.badge || 'FESTIVE CELEBRATIONS 2026'}
              </span>

              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-100 leading-tight">
                {promo.title || 'Grand Festive Sparkle & Family Assortment Boxes'}
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                {promo.description || 'Crafted with approved low smoke compositions, rich color saturation, and strict compliance for joyful family milestones.'}
              </p>

              <div className="pt-2">
                <Link
                  to={promo.buttonLink || '/shop?category=festive-gift-boxes'}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-festive-gradient text-midnight-950 hover:shadow-gold transition-all"
                >
                  <span>{promo.buttonText || 'View Festival Combos'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. ABOUT SECTION (Strictly grounded, no invented claims) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-midnight-900/70 border border-slate-800 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-festive-gold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              About Rohan Fireworks
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-100 leading-snug">
              A Customer-Focused Fireworks Business Dedicated to Safe Celebrations
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              At Rohan Fireworks, our mission is to bring light, color, and festive joy into your family celebrations while upholding the highest standards of safety and compliance.
            </p>

            <p className="text-sm text-slate-300 leading-relaxed">
              We exclusively stock certified Green Crackers formulated to minimize emissions while delivering vibrant colors and traditional festive charm. Our catalogue allows customers to inspect product specifications, safe viewing distances, and sound levels before placing an enquiry.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>100% Genuine Green Formulations</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Direct Factory Quality Checks</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Clear Safe Viewing Distances</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Transparent Catalogue Pricing</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-festive-gold/30 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80"
              alt="Festive family celebration with sparklers"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-midnight-950/85 backdrop-blur-md border border-slate-800 text-xs">
              <span className="font-semibold text-slate-100 block mb-0.5">
                Responsible Festive Celebrations
              </span>
              <span className="text-slate-400 text-[11px]">
                Always observe adult supervision and designated safety clearings during ignition.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT & STORE VISIT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-midnight-900 border border-slate-800 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-festive-gold uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Store Assistance
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
              Visit Us or Enquire Directly
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Have questions regarding festive orders, corporate booking, or category availability? Reach out directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phone */}
            <div className="p-6 rounded-2xl bg-midnight-950 border border-slate-800/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-festive-gold/15 text-festive-gold flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-100 text-base">Phone Assistance</h3>
              <p className="text-xs text-slate-400">Direct helpline for festive inquiries</p>
              <a
                href={`tel:${business.phone}`}
                className="inline-block text-sm font-bold text-festive-gold hover:underline"
              >
                {business.phone || '+91 96999 76114'}
              </a>
            </div>

            {/* WhatsApp */}
            <div className="p-6 rounded-2xl bg-midnight-950 border border-emerald-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-100 text-base">WhatsApp Quotations</h3>
              <p className="text-xs text-slate-400">Instant catalogue queries & bill estimates</p>
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Hours & Address */}
            <div className="p-6 rounded-2xl bg-midnight-950 border border-slate-800/80 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-festive-orange/15 text-festive-orange flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-slate-100 text-base">Business Hours</h3>
              <p className="text-xs text-slate-300">
                {business.businessHours || 'Mon – Sun: 9:00 AM – 9:00 PM IST'}
              </p>
              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-festive-gold" />
                {business.address || 'Sivakasi, Tamil Nadu'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Product Modal */}
      <ProductModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Home;
