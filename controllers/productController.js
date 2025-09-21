const Product = require('../models/Product');
const ProductVariation = require('../models/ProductVariation');
const ProductReview = require('../models/ProductReview');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Unit = require('../models/Unit');
const Attribute = require('../models/Attribute');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      featured,
      search,
      status = 'published'
    } = req.query;

    // Build query
    const query = { status };

    // Category filter
    if (category) {
      query.categories = category;
    }

    // Brand filter
    if (brand) {
      query.brand = brand;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query['pricing.regular'] = {};
      if (minPrice) query['pricing.regular'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.regular'].$lte = parseFloat(maxPrice);
    }

    // Rating filter
    if (rating) {
      query.averageRating = { $gte: parseFloat(rating) };
    }

    // In stock filter
    if (inStock === 'true') {
      query['stock.quantity'] = { $gt: 0 };
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Search filter
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { tags: searchRegex },
        { sku: searchRegex }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const products = await Product.find(query)
      .populate('categories', 'name slug')
      .populate('brand', 'name slug')
      .populate('unit', 'name symbol')
      .populate('attributes.attribute', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts: total,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
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
const getProduct = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug, status: 'published' })
      .populate('categories', 'name slug')
      .populate('brand', 'name slug')
      .populate('unit', 'name symbol')
      .populate('attributes.attribute', 'name')
      .populate('linkedProducts.upsells', 'title slug featuredImage pricing')
      .populate('linkedProducts.crossSells', 'title slug featuredImage pricing');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get variations if it's a variable product
    let variations = [];
    if (product.type === 'variable') {
      variations = await ProductVariation.findByProduct(product._id);
    }

    // Get approved reviews
    const reviews = await ProductReview.findApprovedByProduct(product._id)
      .limit(10)
      .populate('reviewer.user', 'name');

    // Increment view count
    await Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } });

    res.status(200).json({
      success: true,
      data: {
        product,
        variations,
        reviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/v1/admin/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Generate SKU if not provided
    if (!productData.sku) {
      const count = await Product.countDocuments();
      productData.sku = `PRD${String(count + 1).padStart(6, '0')}`;
    }

    const product = await Product.create(productData);

    // Populate references for response
    await product.populate([
      { path: 'categories', select: 'name slug' },
      { path: 'brand', select: 'name slug' },
      { path: 'unit', select: 'name symbol' },
      { path: 'attributes.attribute', select: 'name' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Product with this ${field} already exists`,
        error: error.message
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/v1/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'categories', select: 'name slug' },
      { path: 'brand', select: 'name slug' },
      { path: 'unit', select: 'name symbol' },
      { path: 'attributes.attribute', select: 'name' }
    ]);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Product with this ${field} already exists`,
        error: error.message
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete associated variations
    await ProductVariation.deleteMany({ product: id });

    // Delete associated reviews
    await ProductReview.deleteMany({ product: id });

    // Delete the product
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// @desc    Get admin products with advanced filtering
// @route   GET /api/v1/admin/products
// @access  Private/Admin
const getAdminProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = '-createdAt',
      status,
      type,
      category,
      brand,
      search,
      lowStock
    } = req.query;

    // Build query
    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (category) query.categories = category;
    if (brand) query.brand = brand;

    // Low stock filter
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$stock.quantity', '$stock.lowStockThreshold'] };
    }

    // Search filter
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { sku: searchRegex },
        { 'pricing.regular': !isNaN(search) ? parseFloat(search) : undefined }
      ].filter(condition => condition['pricing.regular'] !== undefined || condition.title || condition.sku);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const products = await Product.find(query)
      .populate('categories', 'name')
      .populate('brand', 'name')
      .populate('unit', 'name symbol')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await Product.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts: total,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin products',
      error: error.message
    });
  }
};

// @desc    Get product by ID (admin)
// @route   GET /api/v1/admin/products/:id
// @access  Private/Admin
const getAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('categories', 'name slug')
      .populate('brand', 'name slug')
      .populate('unit', 'name symbol')
      .populate('attributes.attribute', 'name values')
      .populate('linkedProducts.upsells', 'title slug')
      .populate('linkedProducts.crossSells', 'title slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get variations if variable product
    let variations = [];
    if (product.type === 'variable') {
      variations = await ProductVariation.find({ product: id }).sort({ sortOrder: 1 });
    }

    res.status(200).json({
      success: true,
      data: {
        product,
        variations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// @desc    Check slug availability
// @route   GET /api/v1/admin/products/check-slug/:slug
// @access  Private/Admin
const checkSlugAvailability = async (req, res) => {
  try {
    const { slug } = req.params;
    const { excludeId } = req.query;

    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existingProduct = await Product.findOne(query);

    res.status(200).json({
      success: true,
      available: !existingProduct,
      message: existingProduct ? 'Slug already exists' : 'Slug is available'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking slug availability',
      error: error.message
    });
  }
};

// @desc    Get product dropdown data
// @route   GET /api/v1/admin/products/dropdown
// @access  Private/Admin
const getProductDropdown = async (req, res) => {
  try {
    const { search, limit = 50 } = req.query;

    const query = { status: 'published' };
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { sku: searchRegex }
      ];
    }

    const products = await Product.find(query)
      .select('title sku featuredImage pricing')
      .limit(parseInt(limit))
      .sort('title')
      .lean();

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product dropdown',
      error: error.message
    });
  }
};


module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  getAdminProduct,
  checkSlugAvailability,
  getProductDropdown
};
