const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Unit name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Unit name cannot exceed 50 characters']
  },
  symbol: {
    type: String,
    required: [true, 'Unit symbol is required'],
    trim: true,
    unique: true,
    maxlength: [10, 'Unit symbol cannot exceed 10 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
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
