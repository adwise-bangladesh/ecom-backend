const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');

// Import middleware
const { protect } = require('../middleware/auth');
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

// Cart routes (public - works with session)
router.post('/cart', validateCart, handleValidationErrors, cartController.addToCart);
router.get('/cart', cartController.getCart);
router.delete('/cart/:slug', cartController.removeFromCart);

// Auth routes
router.post('/auth/register', validateUser, handleValidationErrors, authController.register);
router.post('/auth/login', validateLogin, handleValidationErrors, authController.login);

// Checkout route (public - works with session)
router.post('/checkout', validateOrder, handleValidationErrors, orderController.createOrder);

// Seed database endpoint (for development/production seeding)
router.post('/seed', productController.seedDatabase);

// Protected routes
router.get('/user/orders', protect, orderController.getUserOrders);

module.exports = router;
