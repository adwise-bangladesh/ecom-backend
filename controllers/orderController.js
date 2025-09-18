const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/v1/checkout
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingInfo } = req.body;
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || null;
    

    // Validate items and calculate total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOne({ slug: item.productSlug });
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productSlug} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}. Available: ${product.stock}`
        });
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        productSlug: item.productSlug,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Calculate shipping cost
    const shippingCost = shippingInfo.shippingMethod === 'inside-dhaka' ? 80 : 130;
    const finalTotal = total + shippingCost;

    // Create order with simplified shipping info
    const order = await Order.create({
      user: userId,
      sessionId: sessionId,
      items: orderItems,
      subtotal: total,
      shippingCost: shippingCost,
      shippingMethod: shippingInfo.shippingMethod,
      total: finalTotal,
      shippingInfo: {
        name: shippingInfo.name,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city || 'Dhaka', // Default city
        pincode: shippingInfo.pincode || '1000' // Default pincode
      },
      paymentMethod: 'COD',
      status: 'pending'
    });

    // Update product stock
    for (const item of items) {
      await Product.findOneAndUpdate(
        { slug: item.productSlug },
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    if (userId || sessionId) {
      await Cart.findOneAndDelete({
        $or: [
          { user: userId },
          { sessionId: sessionId }
        ]
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Get user orders
// @route   GET /api/v1/user/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query to find orders by user ID or session ID
    let query = {};
    if (userId) {
      query = { user: userId };
    } else if (sessionId) {
      query = { sessionId: sessionId };
    } else {
      return res.status(400).json({
        success: false,
        message: 'No user or session found'
      });
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};
