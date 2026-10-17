import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';

const defaultSettings = {
  storeName: 'Rohan Fireworks',
  tagline: 'Celebrate Every Moment with Rohan Fireworks',
  logoText: 'ROHAN FIREWORKS',
  currency: '₹',
  announcementBar: {
    enabled: true,
    badgeText: 'FESTIVE 2026',
    message: '✨ Direct Factory Festive Collection Now Open! 100% Green Certified Fireworks & Family Assortments. Quick WhatsApp Quotations.',
    link: '/shop',
  },
  businessInfo: {
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'contact@rohanfireworks.com',
    address: 'Plot 42, Festive Fireworks Market, Sivakasi Main Road, Tamil Nadu - 626123, India',
    businessHours: 'Monday – Sunday: 9:00 AM – 9:00 PM IST (Special Festive Extended Hours)',
  },
  promoBanner: {
    enabled: true,
    badge: 'FESTIVE CELEBRATIONS 2026',
    title: 'Grand Festive Sparkle & Family Assortment Boxes',
    description: 'Handcrafted with approved low-smoke compositions, vibrant color bursts, and stringent safety standards for Diwali and family milestones.',
    buttonText: 'Explore Festive Combos',
    buttonLink: '/shop?category=festive-gift-boxes',
  },
  policies: {
    safetyPolicy: 'Fireworks must be used strictly under adult supervision in open outdoor spaces. Maintain safe distances and keep water/sand on standby.',
    complianceNotice: 'Rohan Fireworks strictly retails licensed Green Crackers adhering to CSIR-NEERI formulations with verifiable QR barcodes.',
    termsNotice: 'Online catalogue orders are processed via quotation inquiry in strict accordance with local municipal guidelines.',
  },
  onlineOrdersEnabled: false,
};

const StoreSettingsContext = createContext();

export const StoreSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await settingsAPI.get();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.warn('Could not load live settings, using defaults:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateLocalSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
        updateLocalSettings,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return context;
};
