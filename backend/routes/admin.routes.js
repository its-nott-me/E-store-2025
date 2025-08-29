import express from 'express';
import {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getAllOrders,
  updateOrderStatus
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/product.controller.js';
import { uploadMultiple } from '../middleware/upload.middleware.js';
import { deleteReview, getAdminReviews } from '../controllers/review.controller.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

// rotuer
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.post('/products', uploadMultiple, createProduct);
router.get('/products', getProducts);
router.put('/products/:id', uploadMultiple, updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/reviews', getAdminReviews);
router.delete('/reviews/:id', deleteReview);

export default router;