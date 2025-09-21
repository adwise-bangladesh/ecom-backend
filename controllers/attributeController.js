const Attribute = require('../models/Attribute');

// @desc    Get all attributes
// @route   GET /api/v1/admin/attributes
// @access  Private/Admin
exports.getAttributes = async (req, res) => {
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
    const attributes = await Attribute.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNumber)
      .lean();

    const totalAttributes = await Attribute.countDocuments(query);
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
    console.error('Error fetching attributes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attributes',
      error: error.message
    });
  }
};

// @desc    Get single attribute
// @route   GET /api/v1/admin/attributes/:id
// @access  Private/Admin
exports.getAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Attribute not found'
      });
    }

    res.status(200).json({
      success: true,
      data: attribute
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attribute',
      error: error.message
    });
  }
};

// @desc    Create new attribute
// @route   POST /api/v1/admin/attributes
// @access  Private/Admin
exports.createAttribute = async (req, res) => {
  try {
    const { name, values, isActive } = req.body;

    // Input sanitization and validation
    const sanitizedName = name?.trim();

    // Validate required fields
    if (!sanitizedName || sanitizedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Attribute name is required and must be at least 2 characters',
        errors: ['Attribute name is required and must be at least 2 characters']
      });
    }

    if (!values || !Array.isArray(values) || values.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one attribute value is required',
        errors: ['At least one attribute value is required']
      });
    }

    // Validate name format
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(sanitizedName)) {
      return res.status(400).json({
        success: false,
        message: 'Attribute name contains invalid characters',
        errors: ['Attribute name can only contain letters, numbers, spaces, hyphens, and underscores']
      });
    }

    // Sanitize and validate values
    const sanitizedValues = values
      .filter(val => val && val.value && val.value.trim())
      .map(val => ({
        value: val.value.trim(),
        label: val.label ? val.label.trim() : val.value.trim()
      }))
      .filter((val, index, arr) => 
        // Remove duplicates based on value
        arr.findIndex(v => v.value.toLowerCase() === val.value.toLowerCase()) === index
      );

    if (sanitizedValues.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one valid attribute value is required',
        errors: ['At least one valid attribute value is required']
      });
    }

    // Validate each value
    for (const val of sanitizedValues) {
      if (val.value.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Attribute value cannot exceed 100 characters',
          errors: ['Attribute value cannot exceed 100 characters']
        });
      }
      if (val.label && val.label.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Attribute label cannot exceed 100 characters',
          errors: ['Attribute label cannot exceed 100 characters']
        });
      }
    }

    // Check if attribute name already exists (case-insensitive)
    const existingAttribute = await Attribute.findOne({ 
      name: { $regex: new RegExp(`^${sanitizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } 
    });

    if (existingAttribute) {
      return res.status(400).json({
        success: false,
        message: 'Attribute with this name already exists',
        errors: ['Attribute with this name already exists']
      });
    }

    const attribute = await Attribute.create({
      name: sanitizedName,
      values: sanitizedValues,
      isActive: Boolean(isActive !== undefined ? isActive : true)
    });

    res.status(201).json({
      success: true,
      message: 'Attribute created successfully',
      data: { attribute }
    });
  } catch (error) {
    console.error('Error creating attribute:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Attribute with this name already exists',
        errors: ['Attribute with this name already exists']
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
      message: 'Error creating attribute',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update attribute
// @route   PUT /api/v1/admin/attributes/:id
// @access  Private/Admin
exports.updateAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Attribute not found'
      });
    }

    // Check if name is being changed and if new name already exists
    if (req.body.name && req.body.name !== attribute.name) {
      const existingAttribute = await Attribute.findOne({ 
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
      message: 'Attribute updated successfully',
      data: { attribute }
    });
  } catch (error) {
    console.error('Error updating attribute:', error);
    
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
        message: 'Attribute with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating attribute',
      error: error.message
    });
  }
};

// @desc    Delete attribute
// @route   DELETE /api/v1/admin/attributes/:id
// @access  Private/Admin
exports.deleteAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);

    if (!attribute) {
      return res.status(404).json({
        success: false,
        message: 'Attribute not found'
      });
    }

    // TODO: Check if attribute is being used by any products
    // For now, we'll allow deletion but this should be enhanced later

    await Attribute.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Attribute deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting attribute:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting attribute',
      error: error.message
    });
  }
};
