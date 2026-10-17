import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  previousStock: {
    type: Number,
    required: true,
  },
  newStock: {
    type: Number,
    required: true,
  },
  change: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['INCREASE', 'DECREASE', 'SET'],
    required: true,
  },
  reason: {
    type: String,
    required: [true, 'Adjustment reason is required'],
    trim: true,
  },
  note: {
    type: String,
    default: '',
    trim: true,
  },
  adjustedBy: {
    type: String,
    default: 'Store Administrator',
  }
}, {
  timestamps: true,
});

inventoryLogSchema.index({ product: 1, createdAt: -1 });

export default mongoose.model('InventoryLog', inventoryLogSchema);
