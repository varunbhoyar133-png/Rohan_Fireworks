import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry,
} from '../controllers/enquiryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const enquirySubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many enquiry requests from this IP. Please try again after a few minutes.',
  },
});

router.post('/', enquirySubmitLimiter, createEnquiry);
router.get('/', protectAdmin, getEnquiries);
router.get('/:id', protectAdmin, getEnquiryById);
router.put('/:id', protectAdmin, updateEnquiryStatus);
router.delete('/:id', protectAdmin, deleteEnquiry);

export default router;
