const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');
const adminController = require('../controllers/adminController');

// Import middleware
const { protect, optionalAuth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
const {
  validateUser,
  validateLogin,
  validateCart,
  validateOrder,
  handleValidationErrors
} = require('../middleware/validation');

// Public routes
router.get('/home', productController.getHomeData);
router.get('/categories', categoryController.getCategories);
router.get('/products', productController.getProducts);
router.get('/products/:slug', productController.getProduct);
router.get('/products/:slug/related', productController.getRelatedProducts);

// Development/Admin routes
router.post('/update-pricing', productController.updateProductPricing);

// Cart routes (optional auth - works with both user and session)
router.post('/cart', optionalAuth, validateCart, handleValidationErrors, cartController.addToCart);
router.get('/cart', optionalAuth, cartController.getCart);
router.delete('/cart/:slug', optionalAuth, cartController.removeFromCart);

// Auth routes
router.post('/auth/register', validateUser, handleValidationErrors, authController.register);
router.post('/auth/login', validateLogin, handleValidationErrors, authController.login);

// Checkout route (optional auth - works with both user and session)
router.post('/checkout', optionalAuth, validateOrder, handleValidationErrors, orderController.createOrder);

// Seed database endpoint (for development/production seeding)
router.post('/seed', productController.seedDatabase);

// Protected routes
router.get('/user/orders', optionalAuth, orderController.getUserOrders);

// Admin routes
router.get('/admin/dashboard', adminAuth, adminController.getDashboardStats);
router.get('/admin/products', adminAuth, adminController.getProducts);
router.post('/admin/products', adminAuth, adminController.createProduct);
router.put('/admin/products/:id', adminAuth, adminController.updateProduct);
router.delete('/admin/products/:id', adminAuth, adminController.deleteProduct);
router.get('/admin/orders', adminAuth, adminController.getOrders);
router.get('/admin/orders/:id', adminAuth, adminController.getOrderDetails);
router.put('/admin/orders/:id/status', adminAuth, adminController.updateOrderStatus);

module.exports = router;
