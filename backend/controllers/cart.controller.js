import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Get user cart
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price images slug stock');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id });
    }

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// Add item to cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
console.log(req.body)
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.quantity * existingItem.price;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        totalPrice: product.price * quantity
      });
    }

    cart.calculateTotals();
    await cart.save();

    // Populate product details
    await cart.populate('items.product', 'name price images slug stock');

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Check stock
    const product = await Product.findById(item.product);
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    item.quantity = quantity;
    item.totalPrice = item.price * quantity;

    cart.calculateTotals();
    await cart.save();

    await cart.populate('items.product', 'name price images slug stock');

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    cart.calculateTotals();
    await cart.save();

    await cart.populate('items.product', 'name price images slug stock');

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// Clear cart
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    cart.calculateTotals();
    await cart.save();

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// Apply coupon
export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    const validCoupons = {
      'SAVE10': { discount: 10, discountType: 'percentage' },
      'SAVE20': { discount: 20, discountType: 'fixed' }
    };

    const coupon = validCoupons[code];
    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.coupon = {
      code,
      ...coupon
    };

    cart.calculateTotals();
    await cart.save();

    await cart.populate('items.product', 'name price images slug stock');

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};