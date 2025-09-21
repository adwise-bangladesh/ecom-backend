const mongoose = require('mongoose');

// Schema for variation pricing
const variationPricingSchema = new mongoose.Schema({
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

// Schema for variation stock
const variationStockSchema = new mongoose.Schema({
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

// Schema for variation dimensions
const variationDimensionsSchema = new mongoose.Schema({
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

// Product Variation Schema
const productVariationSchema = new mongoose.Schema({
  // Parent product reference
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Parent product is required']
  },
  
  // Variation attributes (e.g., {color: 'red', size: 'large'})
  attributes: {
    type: Map,
    of: String,
    required: [true, 'Variation attributes are required']
  },
  
  // SKU for this variation
  sku: {
    type: String,
    required: [true, 'Variation SKU is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  
  // Pricing for this variation
  pricing: {
    type: variationPricingSchema,
    required: [true, 'Variation pricing is required']
  },
  
  // Stock management for this variation
  stock: variationStockSchema,
  
  // Physical properties for this variation
  dimensions: variationDimensionsSchema,
  
  // Variation-specific image
  image: {
    type: String,
    default: ''
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  
  // Display order
  sortOrder: {
    type: Number,
    default: 0
  },
  
  // Analytics
  salesCount: {
    type: Number,
    default: 0
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productVariationSchema.index({ product: 1 });
productVariationSchema.index({ sku: 1 });
productVariationSchema.index({ status: 1 });
productVariationSchema.index({ 'pricing.regular': 1 });
productVariationSchema.index({ sortOrder: 1 });

// Virtual for effective price
productVariationSchema.virtual('effectivePrice').get(function() {
  return this.pricing.sale && this.pricing.sale > 0 ? this.pricing.sale : this.pricing.regular;
});

// Virtual for discount percentage
productVariationSchema.virtual('discountPercentage').get(function() {
  if (this.pricing.sale && this.pricing.sale > 0 && this.pricing.regular > 0) {
    return Math.round(((this.pricing.regular - this.pricing.sale) / this.pricing.regular) * 100);
  }
  return 0;
});

// Virtual for stock status
productVariationSchema.virtual('stockStatus').get(function() {
  if (this.stock.quantity <= 0) {
    return this.stock.allowBackorders !== 'no' ? 'on-backorder' : 'out-of-stock';
  } else if (this.stock.quantity <= this.stock.lowStockThreshold) {
    return 'low-stock';
  }
  return 'in-stock';
});

// Virtual for attribute display name (e.g., "Red, Large")
productVariationSchema.virtual('attributeDisplayName').get(function() {
  if (!this.attributes) return '';
  
  return Array.from(this.attributes.values()).join(', ');
});

// Pre-save middleware to update stock status
productVariationSchema.pre('save', function(next) {
  if (this.stock.quantity <= 0) {
    this.stock.status = this.stock.allowBackorders !== 'no' ? 'on-backorder' : 'out-of-stock';
  } else {
    this.stock.status = 'in-stock';
  }
  next();
});

// Method to check if variation is in stock
productVariationSchema.methods.isInStock = function() {
  return this.stock.quantity > 0 || this.stock.allowBackorders !== 'no';
};

// Method to check if variation is on sale
productVariationSchema.methods.isOnSale = function() {
  return this.pricing.sale && this.pricing.sale > 0 && this.pricing.sale < this.pricing.regular;
};

// Static method to find variations by product
productVariationSchema.statics.findByProduct = function(productId) {
  return this.find({ product: productId, status: 'active' }).sort({ sortOrder: 1 });
};

// Static method to find variation by attributes
productVariationSchema.statics.findByAttributes = function(productId, attributes) {
  const query = { product: productId, status: 'active' };
  
  // Add attribute filters
  Object.keys(attributes).forEach(key => {
    query[`attributes.${key}`] = attributes[key];
  });
  
  return this.findOne(query);
};

module.exports = mongoose.model('ProductVariation', productVariationSchema);
