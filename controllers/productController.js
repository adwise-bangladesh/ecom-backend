const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get home page data
// @route   GET /api/v1/home
// @access  Public
exports.getHomeData = async (req, res) => {
  try {
    // Get featured products (latest 8 products)
    const featuredProducts = await Product.find()
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(8)
      .select('title slug images price category createdAt');

    // Get all categories
    const categories = await Category.find()
      .sort({ name: 1 })
      .select('name slug image');

    // Mock slider data (you can replace this with actual slider data)
    const slider = [
      {
        id: 1,
        title: 'Welcome to Our Store',
        subtitle: 'Discover amazing products',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
        link: '/products'
      },
      {
        id: 2,
        title: 'New Arrivals',
        subtitle: 'Check out our latest collection',
        image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=400&fit=crop',
        link: '/products?sort=newest'
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        slider,
        categories,
        featuredProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home data',
      error: error.message
    });
  }
};

// @desc    Get all products with filters
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = {};
    
    if (req.query.category) {
      const category = await Category.findOne({ slug: req.query.category });
      if (category) {
        filter.category = category._id;
      }
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Build sort object
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low':
          sort = { price: 1 };
          break;
        case 'price-high':
          sort = { price: -1 };
          break;
        case 'name':
          sort = { title: 1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
      }
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('title slug description images price stock category createdAt');

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get single product by slug
// @route   GET /api/v1/products/:slug
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Get related products
// @route   GET /api/v1/products/:slug/related
// @access  Public
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    })
      .populate('category', 'name slug')
      .limit(4)
      .select('title slug images price category');

    res.status(200).json({
      success: true,
      data: relatedProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching related products',
      error: error.message
    });
  }
};
