import React from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import EnquiryDrawer from './components/enquiry/EnquiryDrawer';
import EnquirySubmitModal from './components/enquiry/EnquirySubmitModal';

// Storefront Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import About from './pages/About';
import Contact from './pages/Contact';
import SafetyGuidelines from './pages/SafetyGuidelines';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminProducts from './pages/admin/AdminProducts';
import AdminInventory from './pages/admin/AdminInventory';
import AdminCategories from './pages/admin/AdminCategories';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminSettings from './pages/admin/AdminSettings';

// Public Storefront Layout
const StorefrontLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-midnight-950 text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <EnquiryDrawer />
      <EnquirySubmitModal />
    </div>
  );
};

// 404 Not Found Page
const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <h1 className="font-display font-bold text-4xl sm:text-6xl text-festive-gold">
        404
      </h1>
      <h2 className="font-display font-semibold text-xl text-slate-200">
        Page Not Found
      </h2>
      <p className="text-xs text-slate-400 max-w-sm">
        The festive page you requested does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-xl bg-festive-gold text-midnight-950 font-bold text-xs uppercase tracking-wider"
      >
        Return to Storefront
      </Link>
    </div>
  );
};

export const App = () => {
  return (
    <Routes>
      {/* Public Storefront Routes */}
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:idOrSlug" element={<ProductDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/safety" element={<SafetyGuidelines />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Login Route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Portal Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
};

export default App;
