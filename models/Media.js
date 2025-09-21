const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['image', 'video', 'document'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  alt: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dimensions: {
    width: Number,
    height: Number
  },
  duration: {
    type: Number // in seconds
  },
  thumbnail: {
    type: String
  },
  pages: {
    type: Number
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
mediaSchema.index({ originalName: 'text', tags: 'text', description: 'text' });
mediaSchema.index({ category: 1 });
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Media', mediaSchema);
