const mongoose = require('mongoose');

const productAttributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Attribute name is required'],
    trim: true,
    unique: true
  },
  
  // Values for the attribute
  values: [{
    value: String,
    label: String
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
productAttributeSchema.index({ isActive: 1 });

module.exports = mongoose.model('ProductAttribute', productAttributeSchema);
