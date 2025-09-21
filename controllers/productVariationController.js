const ProductVariation = require('../models/ProductVariation');
const Product = require('../models/Product');

// @desc    Get variations for a product
// @route   GET /api/v1/products/:productId/variations
// @access  Public
const getVariations = async (req, res) => {
  try {
    const { productId } = req.params;

    const variations = await ProductVariation.findByProduct(productId);

    res.status(200).json({
      success: true,
      data: variations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching variations',
      error: error.message
    });
  }
};

// @desc    Get single variation
// @route   GET /api/v1/variations/:id
// @access  Public
const getVariation = async (req, res) => {
  try {
    const { id } = req.params;

    const variation = await ProductVariation.findById(id)
      .populate('product', 'title slug');

    if (!variation) {
      return res.status(404).json({
        success: false,
        message: 'Variation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: variation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching variation',
      error: error.message
    });
  }
};

// @desc    Create product variation
// @route   POST /api/v1/admin/products/:productId/variations
// @access  Private/Admin
const createVariation = async (req, res) => {
  try {
    const { productId } = req.params;
    const variationData = { ...req.body, product: productId };

    // Check if product exists and is variable
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.type !== 'variable') {
      return res.status(400).json({
        success: false,
        message: 'Product must be a variable product to have variations'
      });
    }

    // Generate SKU if not provided
    if (!variationData.sku) {
      const count = await ProductVariation.countDocuments({ product: productId });
      variationData.sku = `${product.sku}-V${String(count + 1).padStart(3, '0')}`;
    }

    const variation = await ProductVariation.create(variationData);

    res.status(201).json({
      success: true,
      message: 'Variation created successfully',
      data: variation
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Variation with this SKU already exists',
        error: error.message
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error creating variation',
      error: error.message
    });
  }
};

// @desc    Update variation
// @route   PUT /api/v1/admin/variations/:id
// @access  Private/Admin
const updateVariation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const variation = await ProductVariation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!variation) {
      return res.status(404).json({
        success: false,
        message: 'Variation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Variation updated successfully',
      data: variation
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Variation with this SKU already exists',
        error: error.message
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error updating variation',
      error: error.message
    });
  }
};

// @desc    Delete variation
// @route   DELETE /api/v1/admin/variations/:id
// @access  Private/Admin
const deleteVariation = async (req, res) => {
  try {
    const { id } = req.params;

    const variation = await ProductVariation.findByIdAndDelete(id);

    if (!variation) {
      return res.status(404).json({
        success: false,
        message: 'Variation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Variation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting variation',
      error: error.message
    });
  }
};

// @desc    Find variation by attributes
// @route   POST /api/v1/products/:productId/variations/find
// @access  Public
const findVariationByAttributes = async (req, res) => {
  try {
    const { productId } = req.params;
    const { attributes } = req.body;

    const variation = await ProductVariation.findByAttributes(productId, attributes);

    if (!variation) {
      return res.status(404).json({
        success: false,
        message: 'No variation found with these attributes'
      });
    }

    res.status(200).json({
      success: true,
      data: variation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error finding variation',
      error: error.message
    });
  }
};

module.exports = {
  getVariations,
  getVariation,
  createVariation,
  updateVariation,
  deleteVariation,
  findVariationByAttributes
};
