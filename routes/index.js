const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const attributeController = require('../controllers/attributeController');
const brandController = require('../controllers/brandController');
const unitController = require('../controllers/unitController');
const categoryController = require('../controllers/categoryController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const adminController = require('../controllers/adminController');

// Import middleware
const { protect, optionalAuth, rateLimit } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
const {
  validateUser,
  validateLogin,
  validateCart,
  validateOrder,
  validateCategory,
  validateUnit,
  validateAttribute,
  validateBrand,
  validateObjectId,
  validatePagination,
  handleValidationErrors,
  sanitizeInput
} = require('../middleware/validation');
const {
  generalRateLimit,
  authRateLimit,
  adminRateLimit,
  requestLogger,
  requestSizeLimit,
  securityAudit
} = require('../middleware/security');

// Apply global middleware
router.use(requestLogger);
router.use(securityAudit);
router.use(requestSizeLimit('10mb'));

// Public routes with general rate limiting
router.get('/home', generalRateLimit, productController.getHomeData);
router.get('/brands', generalRateLimit, validatePagination, handleValidationErrors, brandController.getBrands);
router.get('/brands/dropdown', generalRateLimit, brandController.getBrandsDropdown);
router.get('/brands/:id', generalRateLimit, validateObjectId('id'), handleValidationErrors, brandController.getBrand);
router.get('/categories', generalRateLimit, validatePagination, handleValidationErrors, categoryController.getCategories);
router.get('/categories/:slug', generalRateLimit, categoryController.getCategory);
router.get('/units', generalRateLimit, validatePagination, handleValidationErrors, unitController.getUnits);
router.get('/units/dropdown', generalRateLimit, unitController.getUnitsDropdown);
router.get('/units/:id', generalRateLimit, validateObjectId('id'), handleValidationErrors, unitController.getUnit);
router.get('/products', generalRateLimit, validatePagination, handleValidationErrors, productController.getProducts);
router.get('/products/:slug', generalRateLimit, productController.getProduct);
router.get('/products/:slug/related', generalRateLimit, productController.getRelatedProducts);

// Development/Admin routes (restricted)
router.post('/update-pricing', adminAuth, productController.updateProductPricing);

// Cart routes (optional auth - works with both user and session)
router.post('/cart', generalRateLimit, optionalAuth, sanitizeInput, validateCart, handleValidationErrors, cartController.addToCart);
router.get('/cart', generalRateLimit, optionalAuth, cartController.getCart);
router.delete('/cart/:slug', generalRateLimit, optionalAuth, cartController.removeFromCart);

// Auth routes with strict rate limiting
router.post('/auth/register', authRateLimit, sanitizeInput, validateUser, handleValidationErrors, authController.register);
router.post('/auth/login', authRateLimit, sanitizeInput, validateLogin, handleValidationErrors, authController.login);

// Checkout route (optional auth - works with both user and session)
router.post('/checkout', generalRateLimit, optionalAuth, sanitizeInput, validateOrder, handleValidationErrors, orderController.createOrder);

// Seed database endpoint (for development/production seeding - admin only)
router.post('/seed', adminAuth, productController.seedDatabase);

// Protected routes
router.get('/user/orders', generalRateLimit, optionalAuth, validatePagination, handleValidationErrors, orderController.getUserOrders);

// Admin routes - Products
router.get('/admin/dashboard', adminAuth, adminController.getDashboardStats);
router.get('/admin/products', adminAuth, validatePagination, handleValidationErrors, adminController.getProducts);
router.post('/admin/products', adminAuth, sanitizeInput, adminController.createProduct);
router.put('/admin/products/:id', adminAuth, validateObjectId('id'), handleValidationErrors, sanitizeInput, adminController.updateProduct);
router.delete('/admin/products/:id', adminAuth, validateObjectId('id'), handleValidationErrors, adminController.deleteProduct);
router.get('/admin/products/check-slug/:slug', adminAuth, adminController.checkProductSlugAvailability);

// Admin routes - Attributes
router.get('/admin/attributes', adminAuth, validatePagination, handleValidationErrors, attributeController.getAttributes);
router.post('/admin/attributes', adminAuth, sanitizeInput, validateAttribute, handleValidationErrors, attributeController.createAttribute);
router.get('/admin/attributes/:id', adminAuth, validateObjectId('id'), handleValidationErrors, attributeController.getAttribute);
router.put('/admin/attributes/:id', adminAuth, validateObjectId('id'), handleValidationErrors, sanitizeInput, validateAttribute, handleValidationErrors, attributeController.updateAttribute);
router.delete('/admin/attributes/:id', adminAuth, validateObjectId('id'), handleValidationErrors, attributeController.deleteAttribute);

// Admin routes - Categories
router.get('/admin/categories', adminAuth, validatePagination, handleValidationErrors, categoryController.getAdminCategories);
router.post('/admin/categories', adminAuth, sanitizeInput, validateCategory, handleValidationErrors, categoryController.createCategory);
router.get('/admin/categories/:id', adminAuth, validateObjectId('id'), handleValidationErrors, categoryController.getCategory);
router.put('/admin/categories/:id', adminAuth, validateObjectId('id'), handleValidationErrors, sanitizeInput, validateCategory, handleValidationErrors, categoryController.updateCategory);
router.delete('/admin/categories/:id', adminAuth, validateObjectId('id'), handleValidationErrors, categoryController.deleteCategory);
router.get('/admin/categories/check-slug/:slug', adminAuth, categoryController.checkSlugAvailability);

// Admin routes - Orders
router.get('/admin/orders', adminAuth, validatePagination, handleValidationErrors, adminController.getOrders);
router.get('/admin/orders/:id', adminAuth, validateObjectId('id'), handleValidationErrors, adminController.getOrderDetails);
router.put('/admin/orders/:id/status', adminAuth, validateObjectId('id'), handleValidationErrors, sanitizeInput, adminController.updateOrderStatus);
router.put('/admin/orders/:id', adminAuth, validateObjectId('id'), handleValidationErrors, sanitizeInput, adminController.updateOrder);
router.post('/admin/orders/:id/log', adminAuth, validateObjectId('id'), handleValidationErrors, sanitizeInput, adminController.addOrderLog);
router.post('/admin/orders/bulk-assign-courier', adminAuth, sanitizeInput, adminController.bulkAssignCourier);

// Admin routes - Brands
router.get('/admin/brands', adminAuth, validatePagination, handleValidationErrors, brandController.getBrands);
router.post('/admin/brands', adminAuth, sanitizeInput, validateBrand, handleValidationErrors, brandController.createBrand);
router.get('/admin/brands/:id', adminAuth, validateObjectId('id'), handleValidationErrors, brandController.getBrand);
router.put('/admin/brands/:id', adminAuth, validateObjectId('id'), handleValidationErrors, sanitizeInput, validateBrand, handleValidationErrors, brandController.updateBrand);
router.delete('/admin/brands/:id', adminAuth, validateObjectId('id'), handleValidationErrors, brandController.deleteBrand);
router.put('/admin/brands/:id/update-product-count', adminAuth, validateObjectId('id'), handleValidationErrors, brandController.updateProductCount);

// Admin routes - Units
router.get('/admin/units', adminAuth, validatePagination, handleValidationErrors, unitController.getUnits);
router.post('/admin/units', adminAuth, sanitizeInput, validateUnit, handleValidationErrors, unitController.createUnit);
router.get('/admin/units/:id', adminAuth, validateObjectId('id'), handleValidationErrors, unitController.getUnit);
router.put('/admin/units/:id', adminAuth, validateObjectId('id'), handleValidationErrors, sanitizeInput, validateUnit, handleValidationErrors, unitController.updateUnit);
router.delete('/admin/units/:id', adminAuth, validateObjectId('id'), handleValidationErrors, unitController.deleteUnit);

// Admin routes - Users
router.get('/admin/users', adminAuth, validatePagination, handleValidationErrors, adminController.getUsers);

module.exports = router;
