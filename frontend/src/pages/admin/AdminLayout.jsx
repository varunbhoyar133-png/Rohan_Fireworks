import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Bell,
  Sparkles,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/common/BrandLogo';

export const AdminLayout = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If session check in progress, show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center text-slate-400">
        <Sparkles className="w-8 h-8 text-festive-gold animate-spin mb-2" />
      </div>
    );
  }

  // If unauthenticated, redirect to admin login
  if (!isAuthenticated) {
    navigate('/admin/login', { replace: true, state: { from: location } });
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Product Management', path: '/admin/products', icon: Package },
    { name: 'Inventory & Stock Logs', path: '/admin/inventory', icon: Boxes },
    { name: 'Category Management', path: '/admin/categories', icon: Layers },
    { name: 'Customer Enquiries', path: '/admin/enquiries', icon: FileText },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-midnight-900 border-b border-slate-800">
        <BrandLogo showTagline={false} size="default" />
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-midnight-900 border-r border-slate-800/90 flex-shrink-0 flex flex-col justify-between z-30`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800/80 hidden md:block">
            <BrandLogo size="default" />
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-festive-gold/10 border border-festive-gold/30 text-[10px] font-bold text-festive-gold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Owner Admin Portal
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-festive-gold text-midnight-950 shadow-gold'
                      : 'text-slate-300 hover:text-white hover:bg-midnight-850'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User details and shortcuts */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-midnight-950/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-festive-gold/20 border border-festive-gold/40 text-festive-gold flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">
                {user?.name || 'Rohan Sharma'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'admin@rohanfireworks.com'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="py-2 px-2.5 rounded-lg bg-midnight-850 hover:bg-midnight-800 border border-slate-700/80 text-[11px] font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              title="Open Live Storefront"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3 text-festive-gold" />
            </Link>

            <button
              onClick={handleLogout}
              className="py-2 px-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-[11px] font-medium text-rose-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-midnight-950 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
