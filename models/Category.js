const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  image: {
    type: String,
    required: [true, 'Category image is required']
  }
}, {
  timestamps: true
});

// Index for better performance
categorySchema.index({ slug: 1 });

module.exports = mongoose.model('Category', categorySchema);
