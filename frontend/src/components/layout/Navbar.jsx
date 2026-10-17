import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  ShieldCheck,
  UserCheck,
  Sparkles,
} from 'lucide-react';

import AnnouncementBar from './AnnouncementBar';
import BrandLogo from '../common/BrandLogo';
import { useEnquiry } from '../../context/EnquiryContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const { totalItemsCount, openDrawer } = useEnquiry();
  const { settings } = useStoreSettings();
  const { isAuthenticated } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Catalogue', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'Safety Guidelines', path: '/safety' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      <AnnouncementBar />

      <nav className="bg-midnight-950/85 backdrop-blur-md border-b border-festive-gold/15 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <BrandLogo size="navbar" />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-festive-gold bg-festive-gold/10 border border-festive-gold/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Actions: Search, Wishlist/Enquiry Cart, WhatsApp, Admin */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Toggle */}
              <div className="relative">
                {searchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search fireworks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-44 sm:w-64 bg-midnight-900 border border-festive-gold/40 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-festive-gold"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="ml-1 text-slate-400 hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-slate-300 hover:text-festive-gold hover:bg-midnight-850 rounded-lg transition-colors"
                    title="Search Catalogue"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Enquiry Wishlist Button */}
              <button
                onClick={openDrawer}
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-festive-gold/20 to-festive-orange/20 border border-festive-gold/40 text-festive-gold hover:border-festive-gold hover:shadow-gold transition-all duration-300"
                title="View Festive Enquiry List"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-semibold tracking-wide">
                  Enquiry List
                </span>
                {totalItemsCount > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-festive-orange text-white text-[11px] font-bold shadow-sm">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Admin Portal Link */}
              <Link
                to="/admin"
                className={`p-2 rounded-lg border text-xs font-medium transition-colors hidden sm:flex items-center gap-1.5 ${
                  isAuthenticated
                    ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400'
                    : 'border-slate-800 hover:border-festive-gold/30 text-slate-400 hover:text-slate-200'
                }`}
                title="Admin Dashboard"
              >
                <UserCheck className="w-4 h-4" />
                <span className="hidden md:inline">
                  {isAuthenticated ? 'Admin Active' : 'Admin'}
                </span>
              </Link>

              {/* Mobile menu button */}
              <div className="flex lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-midnight-850 transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-midnight-900 border-b border-festive-gold/20 px-4 pt-3 pb-6 space-y-2">
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search fireworks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-midnight-950 border border-festive-gold/30 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </form>

            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-festive-gold bg-festive-gold/15 font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/40'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-slate-400 hover:text-festive-gold flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                Admin Dashboard Portal
              </Link>
              <span className="text-[11px] text-amber-400/80 font-medium">
                100% Green Certified
              </span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
