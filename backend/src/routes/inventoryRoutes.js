import express from 'express';
import {
  adjustStock,
  getInventoryLogs,
  getLowStockProducts,
  getInventoryOverview,
} from '../controllers/inventoryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/adjust', protectAdmin, adjustStock);
router.get('/logs', protectAdmin, getInventoryLogs);
router.get('/low-stock', protectAdmin, getLowStockProducts);
router.get('/overview', protectAdmin, getInventoryOverview);

export default router;
