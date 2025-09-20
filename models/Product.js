const mongoose = require('mongoose');

// Product Variation Schema (for variable products)
const productVariationSchema = new mongoose.Schema({
  attributes: [{
    name: String,
    value: String
  }],
  sku: String,
  price: Number,
  regularPrice: Number,
  costPrice: Number,
  wholesalePrice: Number,
  resellPrice: Number,
  stock: { type: Number, default: 0 },
  images: [String],
  isActive: { type: Boolean, default: true }
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [200, 'Product title cannot be more than 200 characters']
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
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot be more than 500 characters']
  },
  
  // Product Type
  productType: {
    type: String,
    enum: ['simple', 'variable'],
    default: 'simple',
    required: true
  },
  
  // Images
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Categories (Multiple categories support)
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  // Primary category (main category)
  primaryCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Primary category is required']
  },
  
  // Product Attributes
  attributes: [{
    name: String,
    values: [String],
    isVariation: { type: Boolean, default: false }, // Used for variations
    isVisible: { type: Boolean, default: true }
  }],
  
  // Simple Product Pricing (used when productType is 'simple')
  regularPrice: {
    type: Number,
    min: [0, 'Regular price cannot be negative']
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  wholesalePrice: {
    type: Number,
    min: [0, 'Wholesale price cannot be negative']
  },
  resellPrice: {
    type: Number,
    min: [0, 'Resell price cannot be negative']
  },
  
  // Stock Management
  stock: {
    type: Number,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  manageStock: {
    type: Boolean,
    default: true
  },
  stockStatus: {
    type: String,
    enum: ['instock', 'outofstock', 'onbackorder'],
    default: 'instock'
  },
  
  // Variable Product Variations
  variations: [productVariationSchema],
  
  // SEO
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'published', 'private'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  
  // Additional Fields
  sku: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  shippingClass: String,
  tags: [String],
  
  // Reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
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

// Generate slug from title before saving
productSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
  next();
});

// Virtual for category slug
productSchema.virtual('categorySlug', {
  ref: 'Category',
  localField: 'category',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Product', productSchema);
