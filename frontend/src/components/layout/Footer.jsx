import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { useStoreSettings } from '../../context/StoreSettingsContext';

export const Footer = () => {
  const { settings } = useStoreSettings();
  const info = settings?.businessInfo || {};
  const policies = settings?.policies || {};

  const cleanWhatsApp = (info.whatsapp || '+919699976114').replace(/[^0-9]/g, '');

  return (
    <footer className="bg-midnight-950 border-t border-festive-gold/15 pt-16 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand & Safety Mission */}
          <div className="space-y-4">
            <BrandLogo size="footer" />
            <p className="text-xs text-slate-300 leading-relaxed">
              Rohan Fireworks is committed to illuminating your festive celebrations with certified, safe, and quality-tested Green Crackers adhering strictly to Indian regulatory guidelines.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-medium text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                CSIR-NEERI Approved Compositions
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="font-display text-sm font-bold tracking-wider uppercase text-slate-100 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-festive-gold" />
              Quick Explore
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-festive-gold transition-colors">
                  Home & Festive Highlights
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-festive-gold transition-colors">
                  Complete Catalogue
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-festive-gold transition-colors">
                  Browse by Category
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-festive-gold transition-colors text-amber-300/90 font-medium">
                  Safety Guidelines & Precautions
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-festive-gold transition-colors">
                  About Rohan Fireworks
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-festive-gold transition-colors">
                  Store Locator & Contact
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-festive-gold transition-colors text-slate-500">
                  Staff Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h3 className="font-display text-sm font-bold tracking-wider uppercase text-slate-100 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-festive-gold" />
              Product Categories
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=sparklers" className="hover:text-festive-gold transition-colors">
                  Sparklers (Phuljhadi)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=flower-pots" className="hover:text-festive-gold transition-colors">
                  Flower Pots (Anar)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=ground-chakkars" className="hover:text-festive-gold transition-colors">
                  Ground Chakkars
                </Link>
              </li>
              <li>
                <Link to="/shop?category=sky-rockets" className="hover:text-festive-gold transition-colors">
                  Sky Rockets & Parachutes
                </Link>
              </li>
              <li>
                <Link to="/shop?category=aerial-repeaters" className="hover:text-festive-gold transition-colors">
                  Aerial Repeaters (Sky Shots)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=festive-gift-boxes" className="hover:text-festive-gold transition-colors">
                  Diwali Festive Gift Boxes
                </Link>
              </li>
              <li>
                <Link to="/shop?category=kids-special" className="hover:text-festive-gold transition-colors">
                  Kids Special Novelties
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Contact & Hours */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold tracking-wider uppercase text-slate-100 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-festive-gold" />
              Store Information
            </h3>
            <div className="flex items-start gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-festive-gold flex-shrink-0 mt-0.5" />
              <span>{info.address || 'Festive Fireworks Market, India'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Phone className="w-4 h-4 text-festive-gold flex-shrink-0" />
              <a href={`tel:${info.phone}`} className="hover:text-white transition-colors">
                {info.phone || '+91 96999 76114'}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
              >
                WhatsApp Instant Chat
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Mail className="w-4 h-4 text-festive-gold flex-shrink-0" />
              <a href={`mailto:${info.email}`} className="hover:text-white transition-colors">
                {info.email || 'contact@rohanfireworks.com'}
              </a>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-400 pt-1">
              <Clock className="w-4 h-4 text-festive-gold flex-shrink-0 mt-0.5" />
              <span>{info.businessHours || 'Mon - Sun: 9:00 AM - 9:00 PM'}</span>
            </div>
          </div>
        </div>

        {/* Regulatory & Safety Notice Box */}
        <div className="my-8 p-4 rounded-xl bg-midnight-900 border border-slate-800 text-[11px] leading-relaxed text-slate-400">
          <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-festive-gold" />
            Statutory Legal Compliance & Safety Notice:
          </p>
          <p>
            {policies.complianceNotice ||
              'We strictly comply with the Indian Explosives Act and Supreme Court directives promoting approved Green Crackers with QR verification.'}
            {' '}
            {policies.safetyPolicy ||
              'Always ignite fireworks in open outdoor areas under competent adult supervision.'}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Rohan Fireworks. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/safety" className="hover:text-slate-300 transition-colors">
              Safety First
            </Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">
              Support
            </Link>
            <Link to="/admin" className="hover:text-slate-300 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
