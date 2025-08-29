import Product from '../models/Product.js';
import { deleteImage } from '../middleware/upload.middleware.js';

// Get all products with filtering, sorting, and pagination
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      brand,
      sort,
      page = 1,
      limit = 12,
      featured
    } = req.query;

    // Build query
    // const query = { isActive: true };
    const isAdminRoute = req.baseUrl.startsWith('/api/admin');

    const query = {};

    // If NOT admin route, only show active products
    if (!isAdminRoute) {
      query.isActive = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (brand) {
      query.brand = brand;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sorting
    let sortOptions = {};
    switch (sort) {
      case 'price-asc':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { 'ratings.average': -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Execute query with pagination
    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-reviews');

    res.json({
      success: true,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    next(error);
  }
};

// Get single product
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ 
      slug: req.params.slug,
      isActive: true 
    }).populate({
      path: 'reviews.user',
      select: 'name avatar'
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// Create product (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user.id
    };
    // Handle multiple images if uploaded
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => ({
        url: `${process.env.BASE_URL}/uploads/${file.filename}`,
        fileName: file.filename,
        alt: req.body.name
      }));
    }

    if (req.body.specifications) {
      productData.specifications = req.body.specifications.map((spec) => {
        try {
          return JSON.parse(spec); 
        } catch (error) {
          throw new Error('Invalid specification format');
        }
      });
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// Update product (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (typeof req.body.images === "string") {
      try {
        req.body.images = JSON.parse(req.body.images);
      } catch (err) {
        req.body.images = [];
      }
    }

    // Handle image updates
    if (req.files && req.files.length > 0) {
      // Delete old images if replacing
      if (req.body.replaceImages === 'true' && product.images.length > 0) {
        for (const image of product.images) {
          await deleteImage(image.fileName)
          product.images = product.images.filter(img => img.fileName !== image.fileName)
        }
        req.body.images = [];
      }

      // Add new images
      const newImages = req.files.map(file => ({
        url: `${process.env.BASE_URL}/uploads/${file.filename}`,
        fileName: file.filename,
        alt: req.body.name || product.name
      }));

      req.body.images = [...product.images, ...newImages];
    } else {
      if (req.body.replaceImages === 'false' && product.images.length > 0) {
        req.body.images = product.images; // Preserve old images
      }
    }

    if (typeof req.body.specifications === 'string') {
      try {
        req.body.specifications = JSON.parse(req.body.specifications);
      } catch (err) {
        req.body.specifications = [];
      }
    }

    if (!Array.isArray(req.body.specifications)) {
      req.body.specifications = [req.body.specifications]; 
    }

    req.body.specifications = req.body.specifications.map(spec => {
      if (typeof spec === 'string') {
        try {
          return JSON.parse(spec);
        } catch {
          return {}; 
        }
      }
      return spec;
    })

    const sanitizedBody = {
      ...req.body,
      images: req.body.images,
      price: Number(req.body.price),
      comparePrice: Number(req.body.comparePrice),
      stock: Number(req.body.stock),
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      ratings: product.ratings,
      tags: typeof req.body.tags === 'string' && req.body.tags.trim() !== ''
        ? req.body.tags.split(',').map(tag => tag.trim())
        : req.body.tags,
      specifications: req.body.specifications,
      __v: req.body.__v !== undefined ? Number(req.body.__v) : undefined,
      createdAt: req.body.createdAt ? new Date(req.body.createdAt) : undefined,
      updatedAt: req.body.updatedAt ? new Date(req.body.updatedAt) : new Date(),
    };
    
    product = await Product.findByIdAndUpdate(
      req.params.id,
      sanitizedBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// Delete product (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Prodcut not found'
      });
    }

    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        await deleteImage(image.fileName);
      }
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add product review
export const addReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user purchased this product
    const Order = mongoose.model('Order');
    const userOrders = await Order.find({
      user: req.user.id,
      'items.product': req.params.id,
      orderStatus: 'delivered'
    });

    const review = {
      user: req.user.id,
      rating,
      title,
      comment,
      isVerifiedPurchase: userOrders.length > 0
    };

    product.reviews.push(review);
    await product.calculateAverageRating();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get featured products
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ 
      isFeatured: true, 
      isActive: true 
    }).limit(8);

    res.json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
};