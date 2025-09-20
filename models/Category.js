const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  
  // Parent-Child Relationship for Subcategories
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  
  // Images
  image: {
    type: String
  },
  banner: {
    type: String
  },
  
  // SEO
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  
  // Display
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  showOnHomepage: {
    type: Boolean,
    default: false
  },
  
  // Hierarchy Level (calculated field)
  level: {
    type: Number,
    default: 0
  },
  
  // Product Count (will be calculated)
  productCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ displayOrder: 1 });

// Generate slug from name before saving
categorySchema.pre('save', async function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  // Calculate level based on parent hierarchy
  if (this.parent) {
    const parent = await mongoose.model('Category').findById(this.parent);
    this.level = parent ? parent.level + 1 : 0;
  } else {
    this.level = 0;
  }
  
  next();
});

// Virtual to get children categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Method to get all descendants
categorySchema.methods.getDescendants = async function() {
  const descendants = [];
  
  const findChildren = async (categoryId) => {
    const children = await mongoose.model('Category').find({ parent: categoryId });
    for (const child of children) {
      descendants.push(child);
      await findChildren(child._id);
    }
  };
  
  await findChildren(this._id);
  return descendants;
};

// Method to get ancestors (parent hierarchy)
categorySchema.methods.getAncestors = async function() {
  const ancestors = [];
  let current = this;
  
  while (current.parent) {
    current = await mongoose.model('Category').findById(current.parent);
    if (current) {
      ancestors.unshift(current);
    }
  }
  
  return ancestors;
};

module.exports = mongoose.model('Category', categorySchema);
