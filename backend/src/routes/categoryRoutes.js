import express from 'express';
import {
  getCategories,
  getCategoryByIdOrSlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:idOrSlug', getCategoryByIdOrSlug);
router.post('/', protectAdmin, uploadSingleImage, createCategory);
router.put('/:id', protectAdmin, uploadSingleImage, updateCategory);
router.delete('/:id', protectAdmin, deleteCategory);

export default router;
