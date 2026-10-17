import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product must belong to a category'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  originalName: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative'],
  },
  priceNeedsReview: {
    type: Boolean,
    default: false,
  },
  originalPrice: {
    type: Number,
    default: null,
  },
  stock: {
    type: Number,
    required: [true, 'Stock count is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [1, 'Threshold must be at least 1'],
  },
  images: [{
    type: String,
    required: true,
  }],
  packSize: {
    type: String,
    default: '1 Pack',
  },
  soundLevel: {
    type: String,
    enum: ['Low / Sparkle Only', 'Mild Crackle', 'Medium Boom', 'High Aerial Thud', 'Soundless'],
    default: 'Mild Crackle',
  },
  visualEffect: {
    type: String,
    default: 'Golden Sparks & Colorful Burst',
  },
  safetyDistance: {
    type: String,
    default: '5 Meters minimum in open ground',
  },
  isGreenCracker: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isVisible: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

productSchema.index({ name: 'text', description: 'text', sku: 'text' });

productSchema.pre('validate', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

export default mongoose.model('Product', productSchema);
