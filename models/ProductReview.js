const mongoose = require('mongoose');

// Schema for review images
const reviewImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Image URL is required']
  },
  alt: {
    type: String,
    default: ''
  },
  caption: {
    type: String,
    default: ''
  }
}, { _id: true });

// Schema for admin response to review
const adminResponseSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Admin response message is required'],
    trim: true
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Admin responder is required']
  },
  respondedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Product Review Schema
const productReviewSchema = new mongoose.Schema({
  // Product reference
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  
  // Product variation (if applicable)
  variation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariation'
  },
  
  // Reviewer information
  reviewer: {
    name: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true,
      maxlength: [100, 'Reviewer name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Reviewer email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    // Optional: Link to registered user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Review content
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Review title cannot exceed 200 characters']
  },
  
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    minlength: [10, 'Review comment must be at least 10 characters'],
    maxlength: [2000, 'Review comment cannot exceed 2000 characters']
  },
  
  // Review images
  images: [reviewImageSchema],
  
  // Verification
  verified: {
    type: Boolean,
    default: false
  },
  
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  
  // Order reference (for verified purchases)
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  
  // Approval system
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'spam'],
    default: 'pending'
  },
  
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  moderatedAt: {
    type: Date
  },
  
  moderationNote: {
    type: String,
    trim: true
  },
  
  // Admin response
  adminResponse: adminResponseSchema,
  
  // Helpful votes
  helpfulVotes: {
    up: {
      type: Number,
      default: 0
    },
    down: {
      type: Number,
      default: 0
    },
    voters: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      vote: {
        type: String,
        enum: ['up', 'down']
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Flags and reports
  flagged: {
    type: Boolean,
    default: false
  },
  
  flags: [{
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'fake', 'offensive', 'other'],
      required: true
    },
    description: String,
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    flaggedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // SEO and display
  featured: {
    type: Boolean,
    default: false
  },
  
  displayOrder: {
    type: Number,
    default: 0
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productReviewSchema.index({ product: 1, status: 1 });
productReviewSchema.index({ 'reviewer.email': 1 });
productReviewSchema.index({ status: 1 });
productReviewSchema.index({ rating: 1 });
productReviewSchema.index({ verified: 1 });
productReviewSchema.index({ createdAt: -1 });
productReviewSchema.index({ helpfulVotes: -1 });

// Virtual for total helpful votes
productReviewSchema.virtual('totalHelpfulVotes').get(function() {
  return this.helpfulVotes.up - this.helpfulVotes.down;
});

// Virtual for review age in days
productReviewSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for reviewer display name
productReviewSchema.virtual('reviewerDisplayName').get(function() {
  return this.reviewer.name || 'Anonymous';
});

// Method to approve review
productReviewSchema.methods.approve = function(moderatorId, note = '') {
  this.status = 'approved';
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
  this.moderationNote = note;
  return this.save();
};

// Method to reject review
productReviewSchema.methods.reject = function(moderatorId, note = '') {
  this.status = 'rejected';
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
  this.moderationNote = note;
  return this.save();
};

// Method to mark as spam
productReviewSchema.methods.markAsSpam = function(moderatorId, note = '') {
  this.status = 'spam';
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
  this.moderationNote = note;
  return this.save();
};

// Method to add helpful vote
productReviewSchema.methods.addHelpfulVote = function(userId, voteType) {
  // Remove existing vote from this user
  this.helpfulVotes.voters = this.helpfulVotes.voters.filter(
    voter => !voter.user.equals(userId)
  );
  
  // Add new vote
  this.helpfulVotes.voters.push({
    user: userId,
    vote: voteType,
    votedAt: new Date()
  });
  
  // Recalculate vote counts
  const upVotes = this.helpfulVotes.voters.filter(v => v.vote === 'up').length;
  const downVotes = this.helpfulVotes.voters.filter(v => v.vote === 'down').length;
  
  this.helpfulVotes.up = upVotes;
  this.helpfulVotes.down = downVotes;
  
  return this.save();
};

// Method to flag review
productReviewSchema.methods.flag = function(userId, reason, description = '') {
  this.flagged = true;
  this.flags.push({
    reason,
    description,
    flaggedBy: userId,
    flaggedAt: new Date()
  });
  return this.save();
};

// Static method to find approved reviews for a product
productReviewSchema.statics.findApprovedByProduct = function(productId) {
  return this.find({ 
    product: productId, 
    status: 'approved' 
  }).sort({ featured: -1, createdAt: -1 });
};

// Static method to find pending reviews
productReviewSchema.statics.findPending = function() {
  return this.find({ status: 'pending' }).sort({ createdAt: 1 });
};

// Static method to calculate average rating for a product
productReviewSchema.statics.calculateAverageRating = async function(productId) {
  const result = await this.aggregate([
    { $match: { product: mongoose.Types.ObjectId(productId), status: 'approved' } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  
  return result.length > 0 ? {
    average: Math.round(result[0].averageRating * 10) / 10,
    count: result[0].totalReviews
  } : { average: 0, count: 0 };
};

// Post-save middleware to update product rating
productReviewSchema.post('save', async function() {
  if (this.status === 'approved') {
    const Product = mongoose.model('Product');
    const stats = await this.constructor.calculateAverageRating(this.product);
    
    await Product.findByIdAndUpdate(this.product, {
      averageRating: stats.average,
      reviewCount: stats.count
    });
  }
});

module.exports = mongoose.model('ProductReview', productReviewSchema);
