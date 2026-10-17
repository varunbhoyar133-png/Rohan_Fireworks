import express from 'express';
import rateLimit from 'express-rate-limit';
import { adminLogin, getAdminProfile, changeAdminPassword } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Strict rate limiter for login to prevent brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per window
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, adminLogin);
router.get('/profile', protectAdmin, getAdminProfile);
router.put('/change-password', protectAdmin, changeAdminPassword);

export default router;
