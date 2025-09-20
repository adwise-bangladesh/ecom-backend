const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Attribute name is required'],
    trim: true,
    unique: true
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
  }
}, {
  timestamps: true
});

// Indexes
productAttributeSchema.index({ type: 1 });
productAttributeSchema.index({ isVariation: 1 });

module.exports = mongoose.model('ProductAttribute', productAttributeSchema);
