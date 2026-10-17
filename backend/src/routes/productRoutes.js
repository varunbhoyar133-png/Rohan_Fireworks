import express from 'express';
import {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:idOrSlug', getProductByIdOrSlug);
router.post('/', protectAdmin, uploadSingleImage, createProduct);
router.put('/:id', protectAdmin, uploadSingleImage, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
