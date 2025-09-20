const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Attribute name is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  
  // Attribute Type
  type: {
    type: String,
    enum: ['text', 'number', 'select', 'multiselect', 'boolean', 'color', 'image'],
    default: 'text',
    required: true
  },
  
  // Predefined Values (for select/multiselect types)
  values: [{
    value: String,
    label: String,
    colorCode: String, // For color type
    image: String      // For image type
  }],
  
  // Display Settings
  isVisible: {
    type: Boolean,
    default: true
  },
  isVariation: {
    type: Boolean,
    default: false  // True if used for product variations
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  
  // Validation
  validation: {
    min: Number,
    max: Number,
    pattern: String,
    message: String
  },
  
  // Grouping
  group: {
    type: String,
    default: 'general'
  }
}, {
  timestamps: true
});

// Indexes
productAttributeSchema.index({ slug: 1 });
productAttributeSchema.index({ type: 1 });
productAttributeSchema.index({ isVariation: 1 });

// Generate slug from name before saving
productAttributeSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('ProductAttribute', productAttributeSchema);
