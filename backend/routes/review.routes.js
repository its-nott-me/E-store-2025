import express from 'express';
import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
  markReviewHelpful
} from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { reviewValidation } from '../utils/validator.js';

const router = express.Router();
router.get('/product/:productId', getProductReviews);

router.use(protect);
router.post('/product/:productId', reviewValidation, addReview);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);
router.post('/:reviewId/helpful', markReviewHelpful);

export default router;