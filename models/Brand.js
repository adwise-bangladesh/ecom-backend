const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty website
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL starting with http:// or https://'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  productCount: {
    type: Number,
    default: 0
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  seo: {
    title: {
      type: String,
      trim: true,
      maxlength: [60, 'SEO title cannot exceed 60 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [160, 'SEO description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// Index for better performance
brandSchema.index({ name: 1 });
brandSchema.index({ isActive: 1 });
brandSchema.index({ displayOrder: 1 });

// Virtual for products (if you want to populate products later)
brandSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'brand'
});

// Method to update product count
brandSchema.methods.updateProductCount = async function() {
  const Product = mongoose.model('Product');
  const count = await Product.countDocuments({ brand: this._id });
  this.productCount = count;
  return this.save();
};

// Static method to get active brands
brandSchema.statics.getActiveBrands = function() {
  return this.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
};

// Static method to search brands
brandSchema.statics.searchBrands = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { name: searchRegex },
      { description: searchRegex },
      { 'seo.keywords': { $in: [searchRegex] } }
    ]
  });
};

module.exports = mongoose.model('Brand', brandSchema);
