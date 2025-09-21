const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productSlug: {
    type: String,
    required: [true, 'Product slug is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  }
});

const shippingInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    match: [/^[0-9]{10,11}$/, 'Please enter a valid phone number (10-11 digits)']
  },
  secondaryPhone: {
    type: String,
    match: [/^[0-9]{10,11}$/, 'Please enter a valid phone number (10-11 digits)']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous orders
  },
  sessionId: {
    type: String,
    required: false // For anonymous users
  },
  orderNumber: {
    type: String,
    unique: true,
    sparse: true // Allow null values but ensure uniqueness when present
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: [true, 'Subtotal amount is required'],
    min: [0, 'Subtotal cannot be negative']
  },
  shippingCost: {
    type: Number,
    required: [true, 'Shipping cost is required'],
    min: [0, 'Shipping cost cannot be negative']
  },
  shippingMethod: {
    type: String,
    enum: ['inside-dhaka', 'outside-dhaka'],
    required: [true, 'Shipping method is required']
  },
  total: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total cannot be negative']
  },
  shippingInfo: shippingInfoSchema,
  paymentMethod: {
    type: String,
    enum: ['COD'],
    default: 'COD'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  notes: {
    type: String,
    trim: true
  },
  courierName: {
    type: String,
    trim: true
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  courierNotes: {
    type: String,
    trim: true
  },
  history: [{
    action: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    changes: [String],
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }]
}, {
  timestamps: true
});

// Pre-save hook to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    // Generate order number: ORD-YYYYMMDD-XXXX
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Find the highest order number for today
    const todayOrders = await this.constructor.find({
      orderNumber: new RegExp(`^ORD-${dateStr}-`)
    }).sort({ orderNumber: -1 }).limit(1);
    
    let sequence = 1;
    if (todayOrders.length > 0) {
      const lastOrderNumber = todayOrders[0].orderNumber;
      const lastSequence = parseInt(lastOrderNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `ORD-${dateStr}-${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Index for better performance
orderSchema.index({ user: 1 });
orderSchema.index({ sessionId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
