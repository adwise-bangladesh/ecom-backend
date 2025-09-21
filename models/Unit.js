const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Unit name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Unit name cannot exceed 50 characters'],
    minlength: [1, 'Unit name must be at least 1 character'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9\s\-/°]+$/.test(v);
      },
      message: 'Unit name can only contain letters, numbers, spaces, hyphens, slashes, and degree symbols'
    }
  },
  symbol: {
    type: String,
    required: [true, 'Unit symbol is required'],
    trim: true,
    unique: true,
    maxlength: [10, 'Unit symbol cannot exceed 10 characters'],
    minlength: [1, 'Unit symbol must be at least 1 character'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9°%$€£¥]+$/.test(v);
      },
      message: 'Unit symbol can only contain letters, numbers, and common currency/symbol characters'
    }
  },
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

// Index for better performance
unitSchema.index({ name: 1 });
unitSchema.index({ symbol: 1 });
unitSchema.index({ isActive: 1 });

// Static method to get active units
unitSchema.statics.getActiveUnits = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

module.exports = mongoose.model('Unit', unitSchema);
