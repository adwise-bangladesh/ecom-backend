const mongoose = require('mongoose');
const ProductReview = require('../models/ProductReview');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get reviews for a product
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt', rating } = req.query;

    // Build query
    const query = { product: productId, status: 'approved' };
    
    if (rating) {
      query.rating = parseInt(rating);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get reviews
    const reviews = await ProductReview.find(query)
      .populate('reviewer.user', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await ProductReview.countDocuments(query);

    // Get rating distribution
    const ratingStats = await ProductReview.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId), status: 'approved' } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalReviews: total,
          hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
          hasPrevPage: parseInt(page) > 1
        },
        ratingStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Create product review
// @route   POST /api/v1/products/:productId/reviews
// @access  Public
const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, reviewer, images = [] } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if reviews are enabled for this product
    if (!product.reviewsEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Reviews are not enabled for this product'
      });
    }

    // Check for duplicate review from same email
    const existingReview = await ProductReview.findOne({
      product: productId,
      'reviewer.email': reviewer.email
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if it's a verified purchase (if user is logged in)
    let verifiedPurchase = false;
    let orderRef = null;

    if (reviewer.user) {
      const order = await Order.findOne({
        user: reviewer.user,
        'items.productSlug': product.slug,
        status: { $in: ['delivered', 'completed'] }
      });

      if (order) {
        verifiedPurchase = true;
        orderRef = order._id;
      }
    }

    // Create review
    const reviewData = {
      product: productId,
      reviewer,
      rating,
      title,
      comment,
      images,
      verifiedPurchase,
      order: orderRef,
      status: 'pending' // Always require admin approval
    };

    const review = await ProductReview.create(reviewData);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully and is pending approval',
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/v1/admin/reviews
// @access  Private/Admin
const getAdminReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      rating,
      verified,
      search,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = {};
    
    if (status) query.status = status;
    if (rating) query.rating = parseInt(rating);
    if (verified !== undefined) query.verifiedPurchase = verified === 'true';

    // Search filter
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { 'reviewer.name': searchRegex },
        { 'reviewer.email': searchRegex },
        { title: searchRegex },
        { comment: searchRegex }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get reviews
    const reviews = await ProductReview.find(query)
      .populate('product', 'title slug featuredImage')
      .populate('moderatedBy', 'name')
      .populate('reviewer.user', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await ProductReview.countDocuments(query);

    // Get status counts
    const statusCounts = await ProductReview.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalReviews: total,
          hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
          hasPrevPage: parseInt(page) > 1
        },
        statusCounts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin reviews',
      error: error.message
    });
  }
};

// @desc    Get single review (admin)
// @route   GET /api/v1/admin/reviews/:id
// @access  Private/Admin
const getAdminReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await ProductReview.findById(id)
      .populate('product', 'title slug featuredImage')
      .populate('moderatedBy', 'name email')
      .populate('reviewer.user', 'name email')
      .populate('order', 'orderNumber createdAt');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching review',
      error: error.message
    });
  }
};

// @desc    Approve review
// @route   PUT /api/v1/admin/reviews/:id/approve
// @access  Private/Admin
const approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { note = '' } = req.body;
    const moderatorId = req.user.id;

    const review = await ProductReview.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.approve(moderatorId, note);

    res.status(200).json({
      success: true,
      message: 'Review approved successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving review',
      error: error.message
    });
  }
};

// @desc    Reject review
// @route   PUT /api/v1/admin/reviews/:id/reject
// @access  Private/Admin
const rejectReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { note = '' } = req.body;
    const moderatorId = req.user.id;

    const review = await ProductReview.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.reject(moderatorId, note);

    res.status(200).json({
      success: true,
      message: 'Review rejected successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting review',
      error: error.message
    });
  }
};

// @desc    Mark review as spam
// @route   PUT /api/v1/admin/reviews/:id/spam
// @access  Private/Admin
const markAsSpam = async (req, res) => {
  try {
    const { id } = req.params;
    const { note = '' } = req.body;
    const moderatorId = req.user.id;

    const review = await ProductReview.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.markAsSpam(moderatorId, note);

    res.status(200).json({
      success: true,
      message: 'Review marked as spam successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking review as spam',
      error: error.message
    });
  }
};

// @desc    Add helpful vote to review
// @route   POST /api/v1/reviews/:id/vote
// @access  Private
const addHelpfulVote = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body; // 'up' or 'down'
    const userId = req.user.id;

    if (!['up', 'down'].includes(vote)) {
      return res.status(400).json({
        success: false,
        message: 'Vote must be either "up" or "down"'
      });
    }

    const review = await ProductReview.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot vote on unapproved reviews'
      });
    }

    await review.addHelpfulVote(userId, vote);

    res.status(200).json({
      success: true,
      message: 'Vote added successfully',
      data: {
        helpfulVotes: review.helpfulVotes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding vote',
      error: error.message
    });
  }
};

// @desc    Flag review
// @route   POST /api/v1/reviews/:id/flag
// @access  Private
const flagReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, description = '' } = req.body;
    const userId = req.user.id;

    const validReasons = ['spam', 'inappropriate', 'fake', 'offensive', 'other'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid flag reason'
      });
    }

    const review = await ProductReview.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.flag(userId, reason, description);

    res.status(200).json({
      success: true,
      message: 'Review flagged successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error flagging review',
      error: error.message
    });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  getAdminReviews,
  getAdminReview,
  approveReview,
  rejectReview,
  markAsSpam,
  addHelpfulVote,
  flagReview
};
