import Product from '../models/Product.js';
import Category from '../models/Category.js';
import InventoryLog from '../models/InventoryLog.js';

// @desc    Get all products with search, filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStockOnly,
      isFeatured,
      includeHidden,
      sortBy = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    // Admin can request hidden items, storefront only sees visible
    if (includeHidden !== 'true') {
      filter.isVisible = true;
    }

    // Search by name, SKU or description
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { sku: regex },
        { description: regex },
      ];
    }

    // Filter by Category (accepts slug or ObjectId)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
        if (foundCategory) {
          filter.category = foundCategory._id;
        }
      }
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Filter in-stock only
    if (inStockOnly === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Filter featured
    if (isFeatured === 'true') {
      filter.isFeatured = true;
    }

    // Sorting
    let sort = {};
    switch (sortBy) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'name_asc':
        sort = { name: 1 };
        break;
      case 'name_desc':
        sort = { name: -1 };
        break;
      case 'stock_asc':
        sort = { stock: 1 };
        break;
      case 'newest':
      default:
        sort = { createdAt: -1 };
        break;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by id or slug
// @route   GET /api/products/:idOrSlug
// @access  Public
export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let product;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: idOrSlug.toLowerCase() }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Related products in same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isVisible: true,
    }).limit(4);

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      sku,
      category,
      description,
      price,
      originalPrice,
      stock = 0,
      lowStockThreshold = 10,
      packSize,
      soundLevel,
      visualEffect,
      safetyDistance,
      isGreenCracker = true,
      isFeatured = false,
      isVisible = true,
      imageUrl,
    } = req.body;

    if (!name || !sku || !category || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, SKU, category, description, and price are required fields.',
      });
    }

    // Validate SKU uniqueness
    const cleanSku = sku.toUpperCase().trim();
    const existingSku = await Product.findOne({ sku: cleanSku });
    if (existingSku) {
      return res.status(400).json({
        success: false,
        message: `Product with SKU "${cleanSku}" already exists. Each product must have a unique SKU.`,
      });
    }

    // Handle images: uploaded file or provided imageUrl
    let images = [];
    if (req.file) {
      images.push(`/uploads/${req.file.filename}`);
    } else if (imageUrl) {
      images.push(imageUrl);
    } else if (req.body.images && Array.isArray(req.body.images)) {
      images = req.body.images;
    } else {
      // Default festive placeholder if none provided
      images.push('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80');
    }

    const product = await Product.create({
      name,
      sku: cleanSku,
      category,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      images,
      packSize,
      soundLevel,
      visualEffect,
      safetyDistance,
      isGreenCracker: isGreenCracker === 'true' || isGreenCracker === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isVisible: isVisible === 'true' || isVisible === true,
    });

    // Record initial inventory log if stock is added
    if (Number(stock) > 0) {
      await InventoryLog.create({
        product: product._id,
        productName: product.name,
        sku: product.sku,
        previousStock: 0,
        newStock: Number(stock),
        change: Number(stock),
        type: 'INCREASE',
        reason: 'Initial stock setup upon product creation',
        note: 'Product catalog entry created',
        adjustedBy: req.user ? req.user.name : 'Store Admin',
      });
    }

    const populatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const {
      name,
      sku,
      category,
      description,
      price,
      originalPrice,
      stock,
      lowStockThreshold,
      packSize,
      soundLevel,
      visualEffect,
      safetyDistance,
      isGreenCracker,
      isFeatured,
      isVisible,
      imageUrl,
    } = req.body;

    // Check SKU uniqueness if changed
    if (sku && sku.toUpperCase().trim() !== product.sku) {
      const cleanSku = sku.toUpperCase().trim();
      const existingSku = await Product.findOne({ sku: cleanSku, _id: { $ne: id } });
      if (existingSku) {
        return res.status(400).json({
          success: false,
          message: `SKU "${cleanSku}" is already taken by another product.`,
        });
      }
      product.sku = cleanSku;
    }

    if (name) product.name = name;
    if (category) product.category = category;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = originalPrice ? Number(originalPrice) : null;
    if (lowStockThreshold !== undefined) product.lowStockThreshold = Number(lowStockThreshold);
    if (packSize !== undefined) product.packSize = packSize;
    if (soundLevel !== undefined) product.soundLevel = soundLevel;
    if (visualEffect !== undefined) product.visualEffect = visualEffect;
    if (safetyDistance !== undefined) product.safetyDistance = safetyDistance;
    if (isGreenCracker !== undefined) product.isGreenCracker = isGreenCracker === 'true' || isGreenCracker === true;
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (isVisible !== undefined) product.isVisible = isVisible === 'true' || isVisible === true;

    // Handle Image
    if (req.file) {
      product.images = [`/uploads/${req.file.filename}`];
    } else if (imageUrl) {
      product.images = [imageUrl];
    }

    // Handle stock update with inventory log tracking if provided
    if (stock !== undefined && Number(stock) !== product.stock) {
      const newStockVal = Math.max(0, Number(stock));
      const difference = newStockVal - product.stock;

      await InventoryLog.create({
        product: product._id,
        productName: product.name,
        sku: product.sku,
        previousStock: product.stock,
        newStock: newStockVal,
        change: difference,
        type: difference > 0 ? 'INCREASE' : 'DECREASE',
        reason: 'Direct edit from Product Management',
        note: `Stock adjusted from ${product.stock} to ${newStockVal}`,
        adjustedBy: req.user ? req.user.name : 'Store Admin',
      });

      product.stock = newStockVal;
    }

    await product.save();

    const updatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Product "${product.name}" (SKU: ${product.sku}) has been deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
