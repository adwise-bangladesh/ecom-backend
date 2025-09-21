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
// Apply minimal global middleware
// router.use(securityHeaders);
// router.use(requestLogger);
// router.use(securityAudit);
// router.use(requestSizeLimit('10mb'));

// Public routes
router.get('/home', productController.getHomeData);
router.get('/brands', brandController.getBrands);
router.get('/brands/dropdown', brandController.getBrandsDropdown);
router.get('/brands/:id', brandController.getBrand);
router.get('/categories', categoryController.getCategories);
router.get('/categories/:slug', categoryController.getCategory);
router.get('/units', unitController.getUnits);
router.get('/units/dropdown', unitController.getUnitsDropdown);
router.get('/units/:id', unitController.getUnit);
router.get('/products', productController.getProducts);
router.get('/products/:slug', productController.getProduct);
router.get('/products/:slug/related', productController.getRelatedProducts);

// Development/Admin routes (restricted)
router.post('/update-pricing', adminAuth, productController.updateProductPricing);

// Cart routes (optional auth - works with both user and session)
router.post('/cart', optionalAuth, validateCart, handleValidationErrors, cartController.addToCart);
router.get('/cart', optionalAuth, cartController.getCart);
router.delete('/cart/:slug', optionalAuth, cartController.removeFromCart);

// Auth routes
router.post('/auth/register', validateUser, handleValidationErrors, authController.register);
router.post('/auth/login', validateLogin, handleValidationErrors, authController.login);

// Checkout route (optional auth - works with both user and session)
router.post('/checkout', optionalAuth, validateOrder, handleValidationErrors, orderController.createOrder);

// Seed database endpoint (for development/production seeding - admin only)
router.post('/seed', adminAuth, productController.seedDatabase);

// Protected routes
router.get('/user/orders', optionalAuth, orderController.getUserOrders);

// Admin routes - Products
router.get('/admin/dashboard', adminAuth, adminController.getDashboardStats);
router.get('/admin/products', adminAuth, adminController.getProducts);
router.post('/admin/products', adminAuth, adminController.createProduct);
router.put('/admin/products/:id', adminAuth, adminController.updateProduct);
router.delete('/admin/products/:id', adminAuth, adminController.deleteProduct);
router.get('/admin/products/check-slug/:slug', adminAuth, adminController.checkProductSlugAvailability);

// Admin routes - Attributes
router.get('/admin/attributes', adminAuth, attributeController.getAttributes);
router.post('/admin/attributes', adminAuth, attributeController.createAttribute);
router.get('/admin/attributes/:id', adminAuth, attributeController.getAttribute);
router.put('/admin/attributes/:id', adminAuth, attributeController.updateAttribute);
router.delete('/admin/attributes/:id', adminAuth, attributeController.deleteAttribute);

// Admin routes - Categories
router.get('/admin/categories', adminAuth, categoryController.getAdminCategories);
router.post('/admin/categories', adminAuth, categoryController.createCategory);
router.get('/admin/categories/:id', adminAuth, categoryController.getCategory);
router.put('/admin/categories/:id', adminAuth, categoryController.updateCategory);
router.delete('/admin/categories/:id', adminAuth, categoryController.deleteCategory);
router.get('/admin/categories/check-slug/:slug', adminAuth, categoryController.checkSlugAvailability);

// Admin routes - Orders
router.get('/admin/orders', adminAuth, adminController.getOrders);
router.get('/admin/orders/:id', adminAuth, adminController.getOrderDetails);
router.put('/admin/orders/:id/status', adminAuth, adminController.updateOrderStatus);
router.put('/admin/orders/:id', adminAuth, adminController.updateOrder);
router.post('/admin/orders/:id/log', adminAuth, adminController.addOrderLog);
router.post('/admin/orders/bulk-assign-courier', adminAuth, adminController.bulkAssignCourier);

// Admin routes - Brands
router.get('/admin/brands', adminAuth, brandController.getBrands);
router.post('/admin/brands', adminAuth, brandController.createBrand);
router.get('/admin/brands/:id', adminAuth, brandController.getBrand);
router.put('/admin/brands/:id', adminAuth, brandController.updateBrand);
router.delete('/admin/brands/:id', adminAuth, brandController.deleteBrand);
router.put('/admin/brands/:id/update-product-count', adminAuth, brandController.updateProductCount);

// Admin routes - Units
router.get('/admin/units', adminAuth, unitController.getUnits);
router.post('/admin/units', adminAuth, unitController.createUnit);
router.get('/admin/units/:id', adminAuth, unitController.getUnit);
router.put('/admin/units/:id', adminAuth, unitController.updateUnit);
router.delete('/admin/units/:id', adminAuth, unitController.deleteUnit);

// Admin routes - Users
router.get('/admin/users', adminAuth, adminController.getUsers);

module.exports = router;
