const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [100, 'Product title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  images: [{
    type: String,
    required: true
  }],
  // Customer-facing prices
  regularPrice: {
    type: Number,
    required: [true, 'Regular price is required'],
    min: [0, 'Regular price cannot be negative']
  },
  price: {
    type: Number,
    required: [true, 'Product price (offer price) is required'],
    min: [0, 'Price cannot be negative']
  },
  
  // Business pricing (internal use)
  costPrice: {
    type: Number,
    required: [true, 'Cost price is required'],
    min: [0, 'Cost price cannot be negative']
  },
  wholesalePrice: {
    type: Number,
    required: [true, 'Wholesale price is required'],
    min: [0, 'Wholesale price cannot be negative']
  },
  resellPrice: {
    type: Number,
    required: [true, 'Resell price is required'],
    min: [0, 'Resell price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ regularPrice: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for category slug
productSchema.virtual('categorySlug', {
  ref: 'Category',
  localField: 'category',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Product', productSchema);
