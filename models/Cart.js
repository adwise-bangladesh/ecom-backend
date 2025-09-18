const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productSlug: {
    type: String,
    required: [true, 'Product slug is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous carts
  },
  sessionId: {
    type: String,
    required: false // For anonymous users
  },
  items: [cartItemSchema]
}, {
  timestamps: true
});

// Index for better performance
cartSchema.index({ user: 1 });
cartSchema.index({ sessionId: 1 });

module.exports = mongoose.model('Cart', cartSchema);
