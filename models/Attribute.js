const mongoose = require('mongoose');

const attributeValueSchema = new mongoose.Schema({
  value: {
    type: String,
    required: [true, 'Attribute value is required'],
    trim: true,
    maxlength: [100, 'Attribute value cannot exceed 100 characters'],
    minlength: [1, 'Attribute value must be at least 1 character']
  },
  label: {
    type: String,
    trim: true,
    maxlength: [100, 'Attribute label cannot exceed 100 characters'],
    default: function() {
      return this.value;
    }
  }
}, { _id: false });

const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Attribute name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Attribute name cannot exceed 100 characters'],
    minlength: [2, 'Attribute name must be at least 2 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9\s\-_]+$/.test(v);
      },
      message: 'Attribute name can only contain letters, numbers, spaces, hyphens, and underscores'
    }
  },
  
  // Values for the attribute
  values: {
    type: [attributeValueSchema],
    required: [true, 'At least one attribute value is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one attribute value is required'
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
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

// Indexes
attributeSchema.index({ isActive: 1 });

module.exports = mongoose.model('Attribute', attributeSchema);
