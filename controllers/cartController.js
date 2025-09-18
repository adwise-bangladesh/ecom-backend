const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to get or create cart
const getOrCreateCart = async (userId, sessionId) => {
  let cart = await Cart.findOne({
    $or: [
      { user: userId },
      { sessionId: sessionId }
    ]
  });

  if (!cart) {
    cart = await Cart.create({
      user: userId || null,
      sessionId: sessionId || null,
      items: []
    });
  }

  return cart;
};

// @desc    Add/Update item in cart
// @route   POST /api/v1/cart
// @access  Public
exports.addToCart = async (req, res) => {
  try {
    const { productSlug, quantity } = req.body;
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || null;

    // Check if product exists
    const product = await Product.findOne({ slug: productSlug });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    // Get or create cart
    const cart = await getOrCreateCart(userId, sessionId);

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productSlug === productSlug
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity = quantity;
    } else {
      // Add new item
      cart.items.push({ productSlug, quantity });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// @desc    Get cart items
// @route   GET /api/v1/cart
// @access  Public
exports.getCart = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || null;

    const cart = await Cart.findOne({
      $or: [
        { user: userId },
        { sessionId: sessionId }
      ]
    }).populate('items.productSlug');

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
          total: 0
        }
      });
    }

    // Get product details for each cart item
    const cartItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findOne({ slug: item.productSlug })
          .populate('category', 'name slug')
          .select('title slug images price stock category');
        
        return {
          productSlug: item.productSlug,
          quantity: item.quantity,
          product
        };
      })
    );

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        items: cartItems,
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:slug
// @access  Public
exports.removeFromCart = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || null;

    const cart = await Cart.findOne({
      $or: [
        { user: userId },
        { sessionId: sessionId }
      ]
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove item from cart
    cart.items = cart.items.filter(item => item.productSlug !== slug);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};
