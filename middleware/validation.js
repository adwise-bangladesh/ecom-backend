const { body, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
exports.validateUser = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Login validation rules
exports.validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Category validation rules
exports.validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),
  body('image')
    .notEmpty()
    .withMessage('Category image is required')
];

// Product validation rules
exports.validateProduct = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product title must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Product description must be between 10 and 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('category')
    .isMongoId()
    .withMessage('Please provide a valid category ID'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required')
];

// Cart validation rules
exports.validateCart = [
  body('productSlug')
    .notEmpty()
    .withMessage('Product slug is required'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer')
];

// Order validation rules
exports.validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('shippingInfo.name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('shippingInfo.phone')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Please provide a valid phone number (10-11 digits)'),
  body('shippingInfo.address')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Address must be at least 10 characters')
];
