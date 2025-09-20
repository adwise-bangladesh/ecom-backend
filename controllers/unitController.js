const Unit = require('../models/Unit');

// @desc    Get all units
// @route   GET /api/v1/admin/units
// @access  Private/Admin
exports.getUnits = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status = 'all', // 'all', 'active', 'inactive'
      sortBy = 'name', 
      sortOrder = 'asc' 
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { symbol: searchRegex }
      ];
    }

    if (status !== 'all') {
      query.isActive = status === 'active';
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    if (sortBy !== 'name') {
      sortObj.name = 1; // Secondary sort by name
    }

    const units = await Unit.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNumber);

    const totalUnits = await Unit.countDocuments(query);
    const totalPages = Math.ceil(totalUnits / limitNumber);

    res.status(200).json({
      success: true,
      data: {
        units,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalUnits,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching units',
      error: error.message
    });
  }
};

// @desc    Get units for dropdown (name and _id)
// @route   GET /api/v1/units/dropdown
// @access  Public
exports.getUnitsDropdown = async (req, res) => {
  try {
    const units = await Unit.find({ isActive: true }).select('_id name symbol').sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: { units }
    });
  } catch (error) {
    console.error('Error fetching units for dropdown:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching units for dropdown',
      error: error.message
    });
  }
};

// @desc    Get single unit
// @route   GET /api/v1/admin/units/:id
// @access  Private/Admin
exports.getUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { unit }
    });
  } catch (error) {
    console.error('Error fetching unit:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unit',
      error: error.message
    });
  }
};

// @desc    Create new unit
// @route   POST /api/v1/admin/units
// @access  Private/Admin
exports.createUnit = async (req, res) => {
  try {
    const { name, symbol, isActive } = req.body;

    // Input validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Unit name is required'
      });
    }

    if (!symbol || !symbol.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Unit symbol is required'
      });
    }

    // Sanitize input
    const sanitizedName = name.trim();
    const sanitizedSymbol = symbol.trim();

    // Check if unit name or symbol already exists
    const existingUnit = await Unit.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${sanitizedName}$`, 'i') } },
        { symbol: { $regex: new RegExp(`^${sanitizedSymbol}$`, 'i') } }
      ]
    });

    if (existingUnit) {
      return res.status(400).json({
        success: false,
        message: 'Unit with this name or symbol already exists'
      });
    }

    const unit = await Unit.create({
      name: sanitizedName,
      symbol: sanitizedSymbol,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Unit created successfully',
      data: { unit }
    });
  } catch (error) {
    console.error('Error creating unit:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Unit with this name already exists'
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
      message: 'Error creating unit',
      error: error.message
    });
  }
};

// @desc    Update unit
// @route   PUT /api/v1/admin/units/:id
// @access  Private/Admin
exports.updateUnit = async (req, res) => {
  try {
    let unit = await Unit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    // Check if name is being changed and if new name already exists
    if (req.body.name && req.body.name !== unit.name) {
      const existingUnit = await Unit.findOne({ 
        name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (existingUnit) {
        return res.status(400).json({
          success: false,
          message: 'Unit with this name already exists'
        });
      }
    }

    unit = await Unit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Unit updated successfully',
      data: { unit }
    });
  } catch (error) {
    console.error('Error updating unit:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Unit name already exists'
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
      message: 'Error updating unit',
      error: error.message
    });
  }
};

// @desc    Delete unit
// @route   DELETE /api/v1/admin/units/:id
// @access  Private/Admin
exports.deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id);

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    await Unit.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Unit deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting unit:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting unit',
      error: error.message
    });
  }
};
