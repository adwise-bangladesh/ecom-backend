const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Brand name cannot exceed 100 characters'],
    minlength: [2, 'Brand name must be at least 2 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9\s\-&.]+$/.test(v);
      },
      message: 'Brand name can only contain letters, numbers, spaces, hyphens, ampersands, and periods'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  image: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty
        return /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(v) || 
               /^https?:\/\/.+\.(jpeg|jpg|png|gif|webp)(\?.*)?$/i.test(v);
      },
      message: 'Image must be a valid base64 data URL or HTTP(S) URL'
    }
  },
  website: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty website
        return /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(v);
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
    default: 0,
    min: [0, 'Product count cannot be negative']
  },
  displayOrder: {
    type: Number,
    default: 0,
    min: [0, 'Display order cannot be negative']
  },
  seo: {
    title: {
      type: String,
      trim: true,
      maxlength: [60, 'SEO title cannot exceed 60 characters'],
      default: ''
    },
    description: {
      type: String,
      trim: true,
      maxlength: [160, 'SEO description cannot exceed 160 characters'],
      default: ''
    },
    keywords: [{
      type: String,
      trim: true,
      maxlength: [50, 'SEO keyword cannot exceed 50 characters']
    }]
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
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
