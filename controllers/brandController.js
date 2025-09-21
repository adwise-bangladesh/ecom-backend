const Brand = require('../models/Brand');
const Product = require('../models/Product');

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status = 'all',
      sortBy = 'displayOrder',
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
        { name: searchRegex },
        { description: searchRegex },
        { website: searchRegex }
      ];
    }

    if (status !== 'all') {
      query.isActive = status === 'active';
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    if (sortBy !== 'name') {
      sortObj.name = 1; // Secondary sort by name
    }

    // Execute query
    const brands = await Brand.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNumber)
      .lean();

    const totalBrands = await Brand.countDocuments(query);
    const totalPages = Math.ceil(totalBrands / limitNumber);

    res.json({
      success: true,
      data: {
        brands,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalBrands,
          hasNextPage: pageNumber < totalPages,
          hasPrevPage: pageNumber > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching brands',
      error: error.message
    });
  }
};

// @desc    Get single brand
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      data: { brand }
    });
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching brand',
      error: error.message
    });
  }
};

// @desc    Create brand
// @route   POST /api/v1/admin/brands
// @access  Private/Admin
exports.createBrand = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      website,
      isActive,
      displayOrder,
      seo
    } = req.body;

    // Input sanitization and validation
    const sanitizedName = name?.trim();
    const sanitizedDescription = description?.trim() || '';
    const sanitizedImage = image?.trim() || '';
    const sanitizedWebsite = website?.trim() || '';
    const sanitizedDisplayOrder = Math.max(0, parseInt(displayOrder) || 0);

    // Validate required fields
    if (!sanitizedName || sanitizedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Brand name is required and must be at least 2 characters',
        errors: ['Brand name is required and must be at least 2 characters']
      });
    }

    // Validate name format
    if (!/^[a-zA-Z0-9\s\-&.]+$/.test(sanitizedName)) {
      return res.status(400).json({
        success: false,
        message: 'Brand name contains invalid characters',
        errors: ['Brand name can only contain letters, numbers, spaces, hyphens, ampersands, and periods']
      });
    }

    // Validate website URL if provided
    if (sanitizedWebsite && !/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(sanitizedWebsite)) {
      return res.status(400).json({
        success: false,
        message: 'Website must be a valid URL starting with http:// or https://',
        errors: ['Website must be a valid URL starting with http:// or https://']
      });
    }

    // Validate image URL if provided
    if (sanitizedImage && !/^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(sanitizedImage) && 
        !/^https?:\/\/.+\.(jpeg|jpg|png|gif|webp)(\?.*)?$/i.test(sanitizedImage)) {
      return res.status(400).json({
        success: false,
        message: 'Image must be a valid base64 data URL or HTTP(S) URL',
        errors: ['Image must be a valid base64 data URL or HTTP(S) URL']
      });
    }

    // Validate SEO data if provided
    if (seo) {
      if (seo.title && seo.title.length > 60) {
        return res.status(400).json({
          success: false,
          message: 'SEO title cannot exceed 60 characters',
          errors: ['SEO title cannot exceed 60 characters']
        });
      }
      if (seo.description && seo.description.length > 160) {
        return res.status(400).json({
          success: false,
          message: 'SEO description cannot exceed 160 characters',
          errors: ['SEO description cannot exceed 160 characters']
        });
      }
      if (seo.keywords && Array.isArray(seo.keywords)) {
        for (const keyword of seo.keywords) {
          if (keyword && keyword.length > 50) {
            return res.status(400).json({
              success: false,
              message: 'SEO keyword cannot exceed 50 characters',
              errors: ['SEO keyword cannot exceed 50 characters']
            });
          }
        }
      }
    }

    // Check if brand name already exists (case-insensitive)
    const existingBrand = await Brand.findOne({ 
      name: { $regex: new RegExp(`^${sanitizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } 
    });

    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: 'Brand with this name already exists',
        errors: ['Brand with this name already exists']
      });
    }

    const brand = new Brand({
      name: sanitizedName,
      description: sanitizedDescription,
      image: sanitizedImage,
      website: sanitizedWebsite,
      isActive: Boolean(isActive !== undefined ? isActive : true),
      displayOrder: sanitizedDisplayOrder,
      seo: seo || {}
    });

    await brand.save();

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: { brand }
    });
  } catch (error) {
    console.error('Error creating brand:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Brand with this ${field} already exists`,
        errors: [`Brand with this ${field} already exists`]
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating brand',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update brand
// @route   PUT /api/v1/admin/brands/:id
// @access  Private/Admin
exports.updateBrand = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      website,
      isActive,
      displayOrder,
      seo
    } = req.body;

    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Check if name is being changed and if new name already exists
    if (name && name !== brand.name) {
      const existingBrand = await Brand.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });

      if (existingBrand) {
        return res.status(400).json({
          success: false,
          message: 'Brand with this name already exists'
        });
      }
    }

    // Update fields
    if (name !== undefined) brand.name = name;
    if (description !== undefined) brand.description = description;
    if (image !== undefined) brand.image = image;
    if (website !== undefined) brand.website = website;
    if (isActive !== undefined) brand.isActive = isActive;
    if (displayOrder !== undefined) brand.displayOrder = displayOrder;
    if (seo !== undefined) brand.seo = seo;

    await brand.save();

    res.json({
      success: true,
      message: 'Brand updated successfully',
      data: { brand }
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    
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
        message: 'Brand with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating brand',
      error: error.message
    });
  }
};

// @desc    Delete brand
// @route   DELETE /api/v1/admin/brands/:id
// @access  Private/Admin
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Check if brand has associated products
    const productCount = await Product.countDocuments({ brand: req.params.id });
    
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete brand. It has ${productCount} associated product(s). Please reassign or delete the products first.`
      });
    }

    await Brand.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting brand',
      error: error.message
    });
  }
};

// @desc    Check brand slug availability

// @desc    Get brands for dropdown/select
// @route   GET /api/v1/brands/dropdown
// @access  Public
exports.getBrandsDropdown = async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true })
      .select('_id name')
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    res.json({
      success: true,
      data: { brands }
    });
  } catch (error) {
    console.error('Error fetching brands dropdown:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching brands dropdown',
      error: error.message
    });
  }
};

// @desc    Update brand product count
// @route   PUT /api/v1/admin/brands/:id/update-product-count
// @access  Private/Admin
exports.updateProductCount = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    await brand.updateProductCount();

    res.json({
      success: true,
      message: 'Product count updated successfully',
      data: { 
        brand: {
          _id: brand._id,
          name: brand.name,
          productCount: brand.productCount
        }
      }
    });
  } catch (error) {
    console.error('Error updating product count:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product count',
      error: error.message
    });
  }
};

