const ProductAttribute = require('../models/ProductAttribute');

// @desc    Get all product attributes
// @route   GET /api/v1/admin/product-attributes
// @access  Private/Admin
exports.getProductAttributes = async (req, res) => {
  try {
    const { type, isVariation, group } = req.query;
    
    let query = {};
    
    if (type) query.type = type;
    if (isVariation !== undefined) query.isVariation = isVariation === 'true';
    if (group) query.group = group;
    
    const attributes = await ProductAttribute.find(query)
      .sort({ group: 1, displayOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: {
        attributes: attributes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product attributes',
      error: error.message
    });
  }
};

// @desc    Get single product attribute
// @route   GET /api/v1/admin/product-attributes/:id
// @access  Private/Admin
exports.getProductAttribute = async (req, res) => {
  try {
    const attribute = await ProductAttribute.findById(req.params.id);

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Product attribute not found'
      });
    }

    res.status(200).json({
      success: true,
      data: attribute
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product attribute',
      error: error.message
    });
  }
};

// @desc    Create new product attribute
// @route   POST /api/v1/admin/product-attributes
// @access  Private/Admin
exports.createProductAttribute = async (req, res) => {
  try {
    const attribute = await ProductAttribute.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product attribute created successfully',
      data: attribute
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product attribute with this name or slug already exists'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating product attribute',
      error: error.message
    });
  }
};

// @desc    Update product attribute
// @route   PUT /api/v1/admin/product-attributes/:id
// @access  Private/Admin
exports.updateProductAttribute = async (req, res) => {
  try {
    const attribute = await ProductAttribute.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Product attribute not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product attribute updated successfully',
      data: attribute
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating product attribute',
      error: error.message
    });
  }
};

// @desc    Delete product attribute
// @route   DELETE /api/v1/admin/product-attributes/:id
// @access  Private/Admin
exports.deleteProductAttribute = async (req, res) => {
  try {
    const attribute = await ProductAttribute.findByIdAndDelete(req.params.id);

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Product attribute not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product attribute deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product attribute',
      error: error.message
    });
  }
};

// @desc    Check slug availability for product attribute
// @route   GET /api/v1/admin/product-attributes/check-slug/:slug
// @access  Private/Admin
exports.checkSlugAvailability = async (req, res) => {
  try {
    const { slug } = req.params;
    const { excludeId } = req.query;
    
    let query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existingAttribute = await ProductAttribute.findOne(query);
    
    res.status(200).json({
      success: true,
      data: {
        available: !existingAttribute,
        slug: slug
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking slug availability',
      error: error.message
    });
  }
};
