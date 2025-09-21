const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters'],
    minlength: [2, 'Category name must be at least 2 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9\s\-&]+$/.test(v);
      },
      message: 'Category name can only contain letters, numbers, spaces, hyphens, and ampersands'
    }
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [120, 'Slug cannot exceed 120 characters'],
    validate: {
      validator: function(v) {
        return /^[a-z0-9\-]+$/.test(v);
      },
      message: 'Slug can only contain lowercase letters, numbers, and hyphens'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
    validate: {
      validator: function(v) {
        return !v || mongoose.Types.ObjectId.isValid(v);
      },
      message: 'Invalid parent category ID'
    }
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
  isActive: {
    type: Boolean,
    default: true
  },
  showOnHomepage: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0,
    min: [0, 'Order cannot be negative']
  },
  level: {
    type: Number,
    default: 0,
    min: [0, 'Level cannot be negative'],
    max: [10, 'Maximum category depth is 10 levels']
  },
  path: {
    type: String,
    default: '',
    maxlength: [500, 'Path cannot exceed 500 characters']
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

// Virtual for children
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for parent category
categorySchema.virtual('parentCategory', {
  ref: 'Category',
  localField: 'parent',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Pre-save middleware to set level and path
categorySchema.pre('save', async function(next) {
  if (this.isModified('parent')) {
    if (this.parent) {
      const parentCategory = await this.constructor.findById(this.parent);
      if (parentCategory) {
        this.level = parentCategory.level + 1;
        this.path = parentCategory.path ? `${parentCategory.path}/${this.slug}` : this.slug;
      }
    } else {
      this.level = 0;
      this.path = this.slug;
    }
  }
  next();
});

// Index for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ order: 1 });

module.exports = mongoose.model('Category', categorySchema);
