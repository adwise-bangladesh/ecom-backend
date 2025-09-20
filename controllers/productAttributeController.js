const ProductAttribute = require('../models/ProductAttribute');

// @desc    Get all product attributes
// @route   GET /api/v1/admin/product-attributes
// @access  Private/Admin
exports.getProductAttributes = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status = 'all',
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Build query
    let query = {};
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex }
      ];
    }

    if (status !== 'all') query.isActive = status === 'active';

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    if (sortBy !== 'name') {
      sortObj.name = 1; // Secondary sort by name
    }

    // Execute query
    const attributes = await ProductAttribute.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNumber)
      .lean();

    const totalAttributes = await ProductAttribute.countDocuments(query);
    const totalPages = Math.ceil(totalAttributes / limitNumber);

    res.status(200).json({
      success: true,
      data: {
        attributes,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalAttributes,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching product attributes:', error);
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
    const { name, values, isActive } = req.body;

    // Input validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Attribute name is required'
      });
    }

    if (!values || !Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one attribute value is required'
      });
    }

    // Sanitize input
    const sanitizedName = name.trim();
    const sanitizedValues = values.filter(val => val.value && val.value.trim()).map(val => ({
      value: val.value.trim(),
      label: val.label ? val.label.trim() : val.value.trim()
    }));

    if (sanitizedValues.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one valid attribute value is required'
      });
    }

    // Check if attribute name already exists
    const existingAttribute = await ProductAttribute.findOne({ 
      name: { $regex: new RegExp(`^${sanitizedName}$`, 'i') } 
    });

    if (existingAttribute) {
      return res.status(400).json({
        success: false,
        message: 'Attribute with this name already exists'
      });
    }

    const attribute = await ProductAttribute.create({
      name: sanitizedName,
      values: sanitizedValues,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Product attribute created successfully',
      data: { attribute }
    });
  } catch (error) {
    console.error('Error creating product attribute:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product attribute with this name already exists'
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
    const attribute = await ProductAttribute.findById(req.params.id);

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Product attribute not found'
      });
    }

    // Check if name is being changed and if new name already exists
    if (req.body.name && req.body.name !== attribute.name) {
      const existingAttribute = await ProductAttribute.findOne({ 
        name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (existingAttribute) {
        return res.status(400).json({
          success: false,
          message: 'Attribute with this name already exists'
        });
      }
    }

    // Update the attribute
    Object.assign(attribute, req.body);
    await attribute.save();

    res.status(200).json({
      success: true,
      message: 'Product attribute updated successfully',
      data: { attribute }
    });
  } catch (error) {
    console.error('Error updating product attribute:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product attribute with this name already exists'
      });
    }

    res.status(500).json({
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
    const attribute = await ProductAttribute.findById(req.params.id);

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Product attribute not found'
      });
    }

    // TODO: Check if attribute is being used by any products
    // For now, we'll allow deletion but this should be enhanced later

    await ProductAttribute.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product attribute deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product attribute:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product attribute',
      error: error.message
    });
  }
};

