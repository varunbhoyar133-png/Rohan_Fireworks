import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'rohan_fireworks_festive_jwt_secret_token_key_2026',
    { expiresIn: '7d' }
  );
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful. Welcome back to Rohan Fireworks Portal.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in admin user
// @route   GET /api/auth/profile
// @access  Private (Admin)
export const getAdminProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      admin: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change admin password
// @route   PUT /api/auth/change-password
// @access  Private (Admin)
export const changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both current password and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const admin = await AdminUser.findById(req.user._id).select('+password');
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password',
      });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
