import mongoose from 'mongoose';

const enquiryItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  subtotal: {
    type: Number,
    required: true,
  }
}, { _id: false });

const enquirySchema = new mongoose.Schema({
  enquiryNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Customer phone number is required'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  city: {
    type: String,
    required: [true, 'City/Location is required'],
    trim: true,
  },
  address: {
    type: String,
    default: '',
    trim: true,
  },
  items: [enquiryItemSchema],
  totalEstimatedValue: {
    type: Number,
    required: true,
    min: 0,
  },
  customerNotes: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Confirmed', 'Fulfilled', 'Cancelled'],
    default: 'New',
  },
  adminNotes: {
    type: String,
    default: '',
  },
  channel: {
    type: String,
    enum: ['Web Catalogue Enquiry', 'WhatsApp Direct', 'Phone Enquiry'],
    default: 'Web Catalogue Enquiry',
  }
}, {
  timestamps: true,
});

enquirySchema.pre('validate', function(next) {
  if (!this.enquiryNumber) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.enquiryNumber = `RF-ENQ-${Date.now().toString().slice(-4)}${randomSuffix}`;
  }
  next();
});

export default mongoose.model('Enquiry', enquirySchema);
