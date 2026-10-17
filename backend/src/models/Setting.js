import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'store_settings',
  },
  storeName: {
    type: String,
    default: 'Rohan Fireworks',
  },
  tagline: {
    type: String,
    default: 'Celebrate Every Moment with Rohan Fireworks',
  },
  logoText: {
    type: String,
    default: 'ROHAN FIREWORKS',
  },
  currency: {
    type: String,
    default: '₹',
  },
  announcementBar: {
    enabled: {
      type: Boolean,
      default: true,
    },
    message: {
      type: String,
      default: '✨ Festive Season Special: Explore our 100% Green Certified Fireworks & Safe Family Packs! Direct WhatsApp Enquiry Available.',
    },
    badgeText: {
      type: String,
      default: 'FESTIVE UPDATE',
    },
    link: {
      type: String,
      default: '/shop',
    }
  },
  businessInfo: {
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    whatsapp: {
      type: String,
      default: '+91 98765 43210',
    },
    email: {
      type: String,
      default: 'contact@rohanfireworks.com',
    },
    address: {
      type: String,
      default: 'Plot 42, Festive Fireworks Market, Sivakasi Main Road, Tamil Nadu - 626123, India',
    },
    businessHours: {
      type: String,
      default: 'Monday – Sunday: 9:00 AM – 9:00 PM (Extended Festive Hours)',
    },
  },
  promoBanner: {
    enabled: {
      type: Boolean,
      default: true,
    },
    badge: {
      type: String,
      default: 'FESTIVE CELEBRATIONS 2026',
    },
    title: {
      type: String,
      default: 'Grand Festive Sparkle & Family Assortment Boxes',
    },
    description: {
      type: String,
      default: 'Crafted with premium quality compositions, low smoke formulations, and brilliant color saturation for every family celebration.',
    },
    buttonText: {
      type: String,
      default: 'View Festival Combos',
    },
    buttonLink: {
      type: String,
      default: '/shop?category=festive-gift-boxes',
    }
  },
  policies: {
    safetyPolicy: {
      type: String,
      default: 'All fireworks should be ignited strictly under adult supervision in open outdoor spaces. Keep a bucket of water and sand nearby.',
    },
    complianceNotice: {
      type: String,
      default: 'We strictly comply with the Indian Explosives Act and Supreme Court directives promoting approved Green Crackers with QR verification.',
    },
    termsNotice: {
      type: String,
      default: 'Product inquiries are subject to regional regulatory permissions and stock availability at the time of order confirmation.',
    }
  },
  onlineOrdersEnabled: {
    type: Boolean,
    default: false, // Default to enquiry-based workflow as per legal compliance requirement
  }
}, {
  timestamps: true,
});

export default mongoose.model('Setting', settingSchema);
