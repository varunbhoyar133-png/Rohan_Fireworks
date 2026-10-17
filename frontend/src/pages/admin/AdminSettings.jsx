import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Lock,
  Save,
  Globe,
} from 'lucide-react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { settingsAPI, authAPI } from '../../services/api';

export const AdminSettings = () => {
  const { settings, refreshSettings, updateLocalSettings } = useStoreSettings();

  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordToast, setPasswordToast] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setToastMessage('');

    try {
      const res = await settingsAPI.update(formData);
      updateLocalSettings(res.settings);
      setToastMessage('Store settings saved successfully and persisted in database.');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordToast('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setPasswordSaving(true);

    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      setPasswordToast('Admin password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordToast(''), 4000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password. Verify your current password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-10">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
          Store Configuration & Brand Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure business details, festive announcement messages, promotional hero banners, and statutory store policies.
        </p>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Section 1: Brand & Identity */}
        <div className="rounded-3xl bg-midnight-900 border border-slate-800 p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-festive-gold" />
            Brand & Display Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Store Business Name
              </label>
              <input
                type="text"
                value={formData?.storeName || ''}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Header Text Logo Treatment
              </label>
              <input
                type="text"
                value={formData?.logoText || ''}
                onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hero Tagline
              </label>
              <input
                type="text"
                value={formData?.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Store Currency Symbol
              </label>
              <input
                type="text"
                value={formData?.currency || '₹'}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-festive-gold"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Announcement Bar */}
        <div className="rounded-3xl bg-midnight-900 border border-slate-800 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-festive-gold" />
              Top Announcement Bar
            </h2>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData?.announcementBar?.enabled ?? true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcementBar: {
                      ...formData.announcementBar,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded bg-midnight-950 border-slate-700 text-festive-gold"
              />
              <span className="font-semibold">Show Announcement Bar</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Badge Text
              </label>
              <input
                type="text"
                value={formData?.announcementBar?.badgeText || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcementBar: {
                      ...formData.announcementBar,
                      badgeText: e.target.value,
                    },
                  })
                }
                placeholder="FESTIVE 2026"
                className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Announcement Message
              </label>
              <input
                type="text"
                value={formData?.announcementBar?.message || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcementBar: {
                      ...formData.announcementBar,
                      message: e.target.value,
                    },
                  })
                }
                placeholder="Direct factory festive collection open..."
                className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Business Info */}
        <div className="rounded-3xl bg-midnight-900 border border-slate-800 p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
            <Phone className="w-4 h-4 text-festive-gold" />
            Contact Information & Store Address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Helpline Phone
              </label>
              <input
                type="text"
                value={formData?.businessInfo?.phone || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessInfo: { ...formData.businessInfo, phone: e.target.value },
                  })
                }
                placeholder="+91 98765 43210"
                className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                WhatsApp Business Number
              </label>
              <input
                type="text"
                value={formData?.businessInfo?.whatsapp || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessInfo: { ...formData.businessInfo, whatsapp: e.target.value },
                  })
                }
                placeholder="+91 98765 43210"
                className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Customer Support Email
              </label>
              <input
                type="email"
                value={formData?.businessInfo?.email || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessInfo: { ...formData.businessInfo, email: e.target.value },
                  })
                }
                placeholder="contact@rohanfireworks.com"
                className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Business & Support Hours
              </label>
              <input
                type="text"
                value={formData?.businessInfo?.businessHours || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    businessInfo: { ...formData.businessInfo, businessHours: e.target.value },
                  })
                }
                placeholder="Monday – Sunday: 9:00 AM – 9:00 PM IST"
                className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Store Physical Address
            </label>
            <input
              type="text"
              value={formData?.businessInfo?.address || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  businessInfo: { ...formData.businessInfo, address: e.target.value },
                })
              }
              placeholder="Plot 42, Festive Fireworks Market, Sivakasi Main Road..."
              className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
            />
          </div>
        </div>

        {/* Section 4: Promotional Offer Banner */}
        <div className="rounded-3xl bg-midnight-900 border border-slate-800 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-festive-gold" />
              Homepage Promotional Banner
            </h2>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData?.promoBanner?.enabled ?? true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    promoBanner: { ...formData.promoBanner, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded bg-midnight-950 border-slate-700 text-festive-gold"
              />
              <span className="font-semibold">Display Banner on Home</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Banner Headline
              </label>
              <input
                type="text"
                value={formData?.promoBanner?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    promoBanner: { ...formData.promoBanner, title: e.target.value },
                  })
                }
                className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Badge Tag
              </label>
              <input
                type="text"
                value={formData?.promoBanner?.badge || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    promoBanner: { ...formData.promoBanner, badge: e.target.value },
                  })
                }
                className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Banner Subtext
            </label>
            <textarea
              rows="2"
              value={formData?.promoBanner?.description || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  promoBanner: { ...formData.promoBanner, description: e.target.value },
                })
              }
              className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
            ></textarea>
          </div>
        </div>

        {/* Section 5: Store Policies & Compliance */}
        <div className="rounded-3xl bg-midnight-900 border border-slate-800 p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-festive-gold" />
            Statutory Policies & Fireworks Safety Notice
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Legal Compliance Disclaimer
            </label>
            <textarea
              rows="2"
              value={formData?.policies?.complianceNotice || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  policies: { ...formData.policies, complianceNotice: e.target.value },
                })
              }
              className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Customer Safety Policy Statement
            </label>
            <textarea
              rows="2"
              value={formData?.policies?.safetyPolicy || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  policies: { ...formData.policies, safetyPolicy: e.target.value },
                })
              }
              className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
            ></textarea>
          </div>
        </div>

        {/* Save Settings Button */}
        <div>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-festive-gradient text-midnight-950 hover:shadow-gold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Settings...' : 'Save & Persist All Store Settings'}
          </button>
        </div>
      </form>

      {/* Section 6: Security - Change Admin Password */}
      <div className="rounded-3xl bg-midnight-900 border border-slate-800 p-6 sm:p-8 space-y-4 pt-6">
        <h2 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
          <Lock className="w-4 h-4 text-festive-gold" />
          Security Credentials: Change Admin Password
        </h2>

        {passwordToast && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{passwordToast}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full sm:max-w-md bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordSaving}
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-midnight-950 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors"
          >
            {passwordSaving ? 'Updating Password...' : 'Update Admin Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
