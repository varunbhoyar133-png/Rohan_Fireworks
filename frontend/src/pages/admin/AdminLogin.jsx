import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/common/BrandLogo';

export const AdminLogin = () => {
  const [email, setEmail] = useState('admin@rohanfireworks.com');
  const [password, setPassword] = useState('Admin@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(
        err.message || 'Invalid email or password. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-midnight-radial pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-festive-gold/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-festive-orange/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-4">
        <BrandLogo showTagline={false} size="large" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-festive-gold/15 border border-festive-gold/30 text-festive-gold text-xs font-bold uppercase tracking-widest shadow-gold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Protected Administration Portal
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="rounded-3xl bg-midnight-900 border border-festive-gold/25 p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl text-slate-100">
              Admin Authentication
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Sign in with your administrator credentials to manage products, categories, stock, and customer enquiries.
            </p>
          </div>

          {/* Quick Development Credentials Box */}
          <div className="p-3.5 rounded-xl bg-midnight-950 border border-festive-gold/30 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-festive-gold text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-festive-gold" />
              Default Administrator Credentials
            </span>
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 pt-1">
              <span>Email:</span>
              <strong className="text-slate-200">admin@rohanfireworks.com</strong>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
              <span>Password:</span>
              <strong className="text-slate-200">Admin@12345</strong>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rohanfireworks.com"
                  className="w-full bg-midnight-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                />
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-midnight-950 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                />
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase bg-festive-gradient text-midnight-950 hover:shadow-gold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In To Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-800">
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-festive-gold transition-colors inline-flex items-center gap-1"
            >
              ← Return to Rohan Fireworks Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
