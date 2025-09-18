const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');

// Import middleware
const { protect, optionalAuth } = require('../middleware/auth');
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

module.exports = router;
