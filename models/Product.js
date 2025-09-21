const mongoose = require('mongoose');

// Schema for product images
const productImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Image URL is required']
  },
  alt: {
    type: String,
    default: ''
  },
  isMain: {
    type: Boolean,
    default: false
  }
}, { _id: true });

// Schema for pricing
const pricingSchema = new mongoose.Schema({
  regular: {
    type: Number,
    required: [true, 'Regular price is required'],
    min: [0, 'Price cannot be negative']
  },
  sale: {
    type: Number,
    min: [0, 'Sale price cannot be negative'],
    validate: {
      validator: function(value) {
        return !value || value < this.regular;
      },
      message: 'Sale price must be less than regular price'
    }
  },
  cost: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  wholesale: {
    type: Number,
    min: [0, 'Wholesale price cannot be negative']
  },
  resell: {
    type: Number,
    min: [0, 'Resell price cannot be negative']
  }
}, { _id: false });

// Schema for stock management
const stockSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  status: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'on-backorder'],
    default: 'in-stock'
  },
  allowBackorders: {
    type: String,
    enum: ['yes', 'notify', 'no'],
    default: 'no'
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: [0, 'Low stock threshold cannot be negative']
  }
}, { _id: false });

// Schema for dimensions
const dimensionsSchema = new mongoose.Schema({
  length: {
    type: Number,
    min: [0, 'Length cannot be negative']
  },
  width: {
    type: Number,
    min: [0, 'Width cannot be negative']
  },
  height: {
    type: Number,
    min: [0, 'Height cannot be negative']
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  }
}, { _id: false });

// Schema for SEO
const seoSchema = new mongoose.Schema({
  title: String,
  description: String,
  keywords: [String],
  focusKeyword: String
}, { _id: false });

// Main Product Schema
const productSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [200, 'Product title cannot exceed 200 characters']
  },
  
  slug: {
    type: String,
    required: [true, 'Product slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  
  // Product Type
  type: {
    type: String,
    enum: ['simple', 'variable'],
    default: 'simple'
  },
  
  // SKU
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  
  // Categories and Tags
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Brand and Unit
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  },
  
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit'
  },
  
  // Images
  featuredImage: {
    type: String,
    default: ''
  },
  
  gallery: [productImageSchema],
  
  // Pricing (for simple products)
  pricing: pricingSchema,
  
  // Stock Management
  stock: stockSchema,
  
  // Physical Properties
  dimensions: dimensionsSchema,
  
  // Attributes (for simple products and variation attributes)
  attributes: [{
    attribute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attribute',
      required: true
    },
    values: [{
      value: {
        type: String,
        required: true
      },
      image: String // Optional image for attribute value
    }]
  }],
  
  // Linked Products
  linkedProducts: {
    upsells: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    crossSells: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  },
  
  // Status and Visibility
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  
  featured: {
    type: Boolean,
    default: false
  },
  
  visibility: {
    type: String,
    enum: ['public', 'private', 'password-protected'],
    default: 'public'
  },
  
  password: {
    type: String,
    select: false
  },
  
  // SEO
  seo: seoSchema,
  
  // Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  
  salesCount: {
    type: Number,
    default: 0
  },
  
  // Reviews
  reviewsEnabled: {
    type: Boolean,
    default: true
  },
  
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ categories: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ 'pricing.regular': 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ salesCount: -1 });
productSchema.index({ createdAt: -1 });

// Virtual for effective price (sale price if available, otherwise regular price)
productSchema.virtual('effectivePrice').get(function() {
  return this.pricing.sale && this.pricing.sale > 0 ? this.pricing.sale : this.pricing.regular;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.pricing.sale && this.pricing.sale > 0 && this.pricing.regular > 0) {
    return Math.round(((this.pricing.regular - this.pricing.sale) / this.pricing.regular) * 100);
  }
  return 0;
});

// Virtual for stock status based on quantity
productSchema.virtual('stockStatus').get(function() {
  if (this.stock.quantity <= 0) {
    return this.stock.allowBackorders !== 'no' ? 'on-backorder' : 'out-of-stock';
  } else if (this.stock.quantity <= this.stock.lowStockThreshold) {
    return 'low-stock';
  }
  return 'in-stock';
});

// Pre-save middleware to generate slug from title if not provided
productSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Pre-save middleware to update stock status (only for simple products)
productSchema.pre('save', function(next) {
  if (this.type === 'simple' && this.stock) {
    if (this.stock.quantity <= 0) {
      this.stock.status = this.stock.allowBackorders !== 'no' ? 'on-backorder' : 'out-of-stock';
    } else {
      this.stock.status = 'in-stock';
    }
  }
  next();
});

// Method to check if product is in stock
productSchema.methods.isInStock = function() {
  if (this.type === 'variable') {
    // For variable products, check if any variation is in stock
    // This would need to be handled at the application level with variations
    return true; // Default to true for variable products
  }
  return this.stock && (this.stock.quantity > 0 || this.stock.allowBackorders !== 'no');
};

// Method to check if product is on sale
productSchema.methods.isOnSale = function() {
  if (this.type === 'variable') {
    // For variable products, this would need to be checked at variation level
    return false; // Default to false for variable products
  }
  return this.pricing && this.pricing.sale && this.pricing.sale > 0 && this.pricing.sale < this.pricing.regular;
};

// Static method to find products by category
productSchema.statics.findByCategory = function(categoryId) {
  return this.find({ categories: categoryId, status: 'published' });
};

// Static method to find featured products
productSchema.statics.findFeatured = function() {
  return this.find({ featured: true, status: 'published' });
};

module.exports = mongoose.model('Product', productSchema);
