import Enquiry from '../models/Enquiry.js';
import Product from '../models/Product.js';

// @desc    Submit a festive catalogue enquiry / wishlist
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res, next) => {
  try {
    const { customerName, phone, email, city, address, items, customerNotes, channel } = req.body;

    if (!customerName || !phone || !city) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, phone number, and city/delivery location are required.',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please include at least one product in your festive enquiry list.',
      });
    }

    // Verify and re-calculate item prices from database to ensure price accuracy
    const verifiedItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      if (!item.productId && !item.product) {
        continue;
      }
      const prodId = item.productId || item.product;
      const product = await Product.findById(prodId);

      if (product) {
        const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
        const subtotal = product.price * qty;
        calculatedTotal += subtotal;

        verifiedItems.push({
          product: product._id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          quantity: qty,
          subtotal,
        });
      }
    }

    if (verifiedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'None of the requested products were found in our catalogue.',
      });
    }

    const enquiry = await Enquiry.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      city: city.trim(),
      address: address ? address.trim() : '',
      items: verifiedItems,
      totalEstimatedValue: calculatedTotal,
      customerNotes: customerNotes ? customerNotes.trim() : '',
      channel: channel || 'Web Catalogue Enquiry',
      status: 'New',
    });

    res.status(201).json({
      success: true,
      message: 'Your festive enquiry has been received successfully! Our team will reach out to you shortly.',
      enquiryNumber: enquiry.enquiryNumber,
      totalEstimatedValue: enquiry.totalEstimatedValue,
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries with filters and pagination
// @route   GET /api/enquiries
// @access  Private (Admin)
export const getEnquiries = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { enquiryNumber: regex },
        { customerName: regex },
        { phone: regex },
        { city: regex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Enquiry.countDocuments(filter),
    ]);

    // Status summary counts
    const statusCounts = await Enquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const stats = {
      New: 0,
      Contacted: 0,
      Confirmed: 0,
      Fulfilled: 0,
      Cancelled: 0,
    };
    statusCounts.forEach(s => {
      if (stats[s._id] !== undefined) stats[s._id] = s.count;
    });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      stats,
      enquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single enquiry by ID
// @route   GET /api/enquiries/:id
// @access  Private (Admin)
export const getEnquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id).populate('items.product', 'images isGreenCracker stock');

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry record not found',
      });
    }

    res.status(200).json({
      success: true,
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status and notes
// @route   PUT /api/enquiries/:id
// @access  Private (Admin)
export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    if (status) enquiry.status = status;
    if (adminNotes !== undefined) enquiry.adminNotes = adminNotes;

    await enquiry.save();

    res.status(200).json({
      success: true,
      message: `Enquiry ${enquiry.enquiryNumber} status updated to "${enquiry.status}"`,
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private (Admin)
export const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    await Enquiry.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Enquiry ${enquiry.enquiryNumber} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
