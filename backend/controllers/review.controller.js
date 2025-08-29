import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import mongoose from 'mongoose';

// Add review to product
export const addReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      product: productId, 
      user: userId 
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user has purchased this product
    const userOrders = await Order.find({
      user: userId,
      'items.product': productId,
      orderStatus: 'delivered'
    });

    const isVerifiedPurchase = userOrders.length > 0;

    // Create review
    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      title,
      comment,
      isVerifiedPurchase
    });

    // Add review to product
    product.reviews.push({
      user: userId,
      rating,
      title,
      comment,
      isVerifiedPurchase,
      createdAt: review.createdAt
    });

    // Update product rating
    await product.calculateAverageRating();

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    next(error);
  }
};

// Get reviews for a product
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    let sortOptions = {};
    switch (sort) {
      case 'helpful':
        sortOptions = { 'helpful.count': -1 };
        break;
      case 'rating-high':
        sortOptions = { rating: -1 };
        break;
      case 'rating-low':
        sortOptions = { rating: 1 };
        break;
      default: // newest
        sortOptions = { createdAt: -1 };
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name avatar')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ product: productId });

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      success: true,
      reviews,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      ratingDistribution
    });
  } catch (error) {
    next(error);
  }
};

// Get all reviews (Admin only)
export const getAdminReviews = async (req, res, next) => {
  try {
    const { search, rating, verified, page = 1, limit = 10 } = req.query;

    let filter = {};

    // Apply the 'rating' filter only if it's not empty
    if (rating) {
      filter.rating = rating;
    }

    // Apply the 'verified' filter only if it's not empty
    if (verified !== undefined && verified !== '') {
      filter.isVerifiedPurchase = verified === 'true';
    }

    // Fetch the reviews based on the filter and pagination
    const reviews = await Review.find(filter)
      .populate('user', 'name email avatar')
      .populate('product', 'name slug images')  // Populate the product data (name, slug, images)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    // If there's a search term, filter reviews based on title or product name
    let filteredReviews = reviews;
    if (search && search.trim()) {
      const searchRegex = new RegExp(search, 'i');  // Case-insensitive regex

      // Filter reviews to match either title or product name
      filteredReviews = reviews.filter(review => {
        const matchesTitle = review.title && review.title.match(searchRegex);
        const matchesProductName = review.product && review.product.name && review.product.name.match(searchRegex);
        return matchesTitle || matchesProductName;
      });
    }

    // Get the total count of filtered reviews
    const total = filteredReviews.length;

    // Pagination after filtering
    const paginatedReviews = filteredReviews.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));

    // Get the rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: filter },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    res.json({
      success: true,
      reviews: paginatedReviews,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      ratingDistribution,
    });
  } catch (error) {
    next(error);
  }
};

// Update review
export const updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own reviews'
      });
    }

    // Update review
    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    await review.save();

    // Update product reviews and rating
    const product = await Product.findById(review.product);
    const reviewIndex = product.reviews.findIndex(
      r => r.user.toString() === userId
    );
    
    if (reviewIndex !== -1) {
      product.reviews[reviewIndex] = {
        ...product.reviews[reviewIndex].toObject(),
        rating,
        title,
        comment
      };
      await product.calculateAverageRating();
    }

    res.json({
      success: true,
      review
    });
  } catch (error) {
    next(error);
  }
};

// Delete review
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    // Remove review from product
    const product = await Product.findById(review.product);
    product.reviews = product.reviews.filter(
      r => r.user.toString() !== review.user.toString()
    );
    await product.calculateAverageRating();

    // Delete review
    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Mark review as helpful
export const markReviewHelpful = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already marked this review as helpful
    const alreadyMarked = review.helpful.users.includes(userId);
    
    if (alreadyMarked) {
      // Remove user from helpful list
      review.helpful.users = review.helpful.users.filter(
        u => u.toString() !== userId
      );
      review.helpful.count = Math.max(0, review.helpful.count - 1);
    } else {
      // Add user to helpful list
      review.helpful.users.push(userId);
      review.helpful.count += 1;
    }

    await review.save();

    res.json({
      success: true,
      helpful: review.helpful,
      marked: !alreadyMarked
    });
  } catch (error) {
    next(error);
  }
};