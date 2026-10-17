import Product from '../models/Product.js';
import InventoryLog from '../models/InventoryLog.js';

// @desc    Adjust stock quantity for a product
// @route   POST /api/inventory/adjust
// @access  Private (Admin)
export const adjustStock = async (req, res, next) => {
  try {
    const { productId, change, type = 'INCREASE', reason, note } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Adjustment reason is required (e.g. Shipment Received, Floor Sale, Audit)',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const previousStock = product.stock;
    const amount = Number(change);

    if (isNaN(amount) || amount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Change amount must be a non-zero number',
      });
    }

    let calculatedNewStock = previousStock;
    let actualChange = 0;
    let actionType = type;

    if (type === 'INCREASE') {
      actualChange = Math.abs(amount);
      calculatedNewStock = previousStock + actualChange;
    } else if (type === 'DECREASE') {
      actualChange = -Math.abs(amount);
      calculatedNewStock = previousStock - Math.abs(amount);
    } else if (type === 'SET') {
      calculatedNewStock = Math.max(0, amount);
      actualChange = calculatedNewStock - previousStock;
      actionType = actualChange >= 0 ? 'INCREASE' : 'DECREASE';
    }

    // Critical constraint: prevent negative stock
    if (calculatedNewStock < 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot decrease stock by ${Math.abs(amount)}. Current stock is only ${previousStock}. Negative inventory is not permitted.`,
      });
    }

    product.stock = calculatedNewStock;
    await product.save();

    // Create persistent inventory audit log
    const log = await InventoryLog.create({
      product: product._id,
      productName: product.name,
      sku: product.sku,
      previousStock,
      newStock: calculatedNewStock,
      change: actualChange,
      type: actionType,
      reason,
      note: note || '',
      adjustedBy: req.user ? req.user.name : 'Store Admin',
    });

    res.status(200).json({
      success: true,
      message: `Stock updated successfully for "${product.name}". New quantity: ${calculatedNewStock}`,
      product: {
        id: product._id,
        name: product.name,
        sku: product.sku,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        isLowStock: product.stock <= product.lowStockThreshold,
      },
      log,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory adjustment history logs
// @route   GET /api/inventory/logs
// @access  Private (Admin)
export const getInventoryLogs = async (req, res, next) => {
  try {
    const { productId, limit = 50, page = 1 } = req.query;
    const filter = {};

    if (productId) {
      filter.product = productId;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      InventoryLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      InventoryLog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low stock and out of stock products
// @route   GET /api/inventory/low-stock
// @access  Private (Admin)
export const getLowStockProducts = async (req, res, next) => {
  try {
    // Find products where stock is <= lowStockThreshold
    const products = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    })
      .populate('category', 'name slug')
      .sort({ stock: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overall inventory summary
// @route   GET /api/inventory/overview
// @access  Private (Admin)
export const getInventoryOverview = async (req, res, next) => {
  try {
    const products = await Product.find({});
    
    let totalProducts = products.length;
    let totalUnits = 0;
    let totalValuation = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach(p => {
      totalUnits += p.stock;
      totalValuation += (p.stock * p.price);
      if (p.stock === 0) {
        outOfStockCount++;
      } else if (p.stock <= p.lowStockThreshold) {
        lowStockCount++;
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalUnits,
        totalValuation,
        lowStockCount,
        outOfStockCount,
      }
    });
  } catch (error) {
    next(error);
  }
};
