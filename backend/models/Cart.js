import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1
    },
    price: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate cart totals
cartSchema.methods.calculateTotals = function() {

  if(!this.items || this.items.length === 0) {
    this.subtotal = 0;
    this.tax = 0;
    this.shipping = 0;
    this.total = 0;
    return;
  }

  this.subtotal = this.items.reduce((sum, item) => {
    if (item.totalPrice && typeof item.totalPrice === 'number') {
      return sum + item.totalPrice;
    }
    return sum;
  }, 0);
  
  // Calculate tax (10% example)
  this.tax = typeof this.subtotal === 'number' && !isNaN(this.subtotal) ? this.subtotal * 0.1 : 0;
  
  // Free shipping over $50
  this.shipping = this.subtotal > 50 ? 0 : 10;
  
  if (isNaN(this.tax)) this.tax = 0;
  if (isNaN(this.shipping)) this.shipping = 0;

  this.total = this.subtotal + this.tax + this.shipping;

  // ensure total is a valid number
  if (isNaN(this.total)) {
    this.total = 0;
  }
};

export default mongoose.model('Cart', cartSchema);