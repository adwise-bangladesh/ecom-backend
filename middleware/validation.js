const { body, validationResult, param, query } = require('express-validator');

// Enhanced validation error handler
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
      location: error.location
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: formattedErrors,
      errorCount: formattedErrors.length
    });
  }
  next();
};

// Sanitize input middleware
exports.sanitizeInput = (req, res, next) => {
  // Sanitize string inputs
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  };

  // Recursively sanitize object
  const sanitizeObject = (obj) => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') return sanitizeString(obj);
    if (Array.isArray(obj)) return obj.map(sanitizeObject);
    if (typeof obj === 'object') {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);
  
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

// Enhanced Category validation rules
exports.validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-&]+$/)
    .withMessage('Category name can only contain letters, numbers, spaces, hyphens, and ampersands'),
  body('slug')
    .optional()
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Slug must be between 2 and 120 characters')
    .matches(/^[a-z0-9\-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('parent')
    .optional()
    .isMongoId()
    .withMessage('Parent must be a valid MongoDB ObjectId'),
  body('image')
    .optional()
    .custom((value) => {
      if (!value) return true; // Allow empty
      const isBase64 = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(value);
      const isUrl = /^https?:\/\/.+\.(jpeg|jpg|png|gif|webp)(\?.*)?$/i.test(value);
      if (!isBase64 && !isUrl) {
        throw new Error('Image must be a valid base64 data URL or HTTP(S) URL');
      }
      return true;
    }),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('showOnHomepage')
    .optional()
    .isBoolean()
    .withMessage('showOnHomepage must be a boolean'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
];

// Enhanced Unit validation rules
exports.validateUnit = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Unit name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-/°]+$/)
    .withMessage('Unit name can only contain letters, numbers, spaces, hyphens, slashes, and degree symbols'),
  body('symbol')
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Unit symbol must be between 1 and 10 characters')
    .matches(/^[a-zA-Z0-9°%$€£¥]+$/)
    .withMessage('Unit symbol can only contain letters, numbers, and common currency/symbol characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

// Enhanced Attribute validation rules
exports.validateAttribute = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Attribute name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Attribute name can only contain letters, numbers, spaces, hyphens, and underscores'),
  body('values')
    .isArray({ min: 1 })
    .withMessage('At least one attribute value is required'),
  body('values.*.value')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Attribute value must be between 1 and 100 characters'),
  body('values.*.label')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Attribute label cannot exceed 100 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
];

// Enhanced Brand validation rules
exports.validateBrand = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Brand name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-&.]+$/)
    .withMessage('Brand name can only contain letters, numbers, spaces, hyphens, ampersands, and periods'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('image')
    .optional()
    .custom((value) => {
      if (!value) return true; // Allow empty
      const isBase64 = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(value);
      const isUrl = /^https?:\/\/.+\.(jpeg|jpg|png|gif|webp)(\?.*)?$/i.test(value);
      if (!isBase64 && !isUrl) {
        throw new Error('Image must be a valid base64 data URL or HTTP(S) URL');
      }
      return true;
    }),
  body('website')
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true; // Allow empty
      if (!/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(value)) {
        throw new Error('Website must be a valid URL starting with http:// or https://');
      }
      return true;
    }),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
  body('seo.title')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('SEO title cannot exceed 60 characters'),
  body('seo.description')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('SEO description cannot exceed 160 characters'),
  body('seo.keywords')
    .optional()
    .isArray()
    .withMessage('SEO keywords must be an array'),
  body('seo.keywords.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('SEO keyword cannot exceed 50 characters')
];

// Parameter validation for MongoDB ObjectIds
exports.validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`${paramName} must be a valid MongoDB ObjectId`)
];

// Query parameter validation
exports.validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search term cannot exceed 100 characters'),
  query('status')
    .optional()
    .isIn(['all', 'active', 'inactive'])
    .withMessage('Status must be one of: all, active, inactive')
];
