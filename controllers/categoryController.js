const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories with hierarchy
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const { includeHierarchy, parentId, level } = req.query;
    
    let query = { isActive: true };
    
    // Filter by parent
    if (parentId) {
      query.parent = parentId === 'null' ? null : parentId;
    }
    
    // Filter by level
    if (level !== undefined) {
      query.level = parseInt(level);
    }
    
    let categories = await Category.find(query)
      .populate('parent', 'name slug')
      .sort({ level: 1, displayOrder: 1, name: 1 })
      .select('name slug image banner description level parent displayOrder productCount isActive showOnHomepage');

    // Build hierarchy if requested
    if (includeHierarchy === 'true') {
      categories = buildCategoryHierarchy(categories);
    }

    res.status(200).json({
      success: true,
      data: {
        categories: categories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// @desc    Get single category
// @route   GET /api/v1/categories/:slug
// @access  Public
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true })
      .populate('parent', 'name slug')
      .populate('children');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get ancestors for breadcrumb
    const ancestors = await category.getAncestors();
    
    // Get children
    const children = await Category.find({ parent: category._id, isActive: true })
      .sort({ displayOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: {
        category: {
          ...category.toObject(),
          ancestors,
          children
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// @desc    Create new category
// @route   POST /api/v1/admin/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    
    await category.populate('parent', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name or slug already exists'
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
      message: 'Error creating category',
      error: error.message
    });
  }
};

// @desc    Update category
// @route   PUT /api/v1/admin/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('parent', 'name slug');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/v1/admin/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has children
    const children = await Category.find({ parent: category._id });
    if (children.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories. Please delete subcategories first.'
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ 
      $or: [
        { primaryCategory: category._id },
        { categories: category._id }
      ]
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${productCount} products. Please move or delete products first.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

// @desc    Check slug availability
// @route   GET /api/v1/admin/categories/check-slug/:slug
// @access  Private/Admin
exports.checkSlugAvailability = async (req, res) => {
  try {
    const { slug } = req.params;
    const { excludeId } = req.query;
    
    let query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existingCategory = await Category.findOne(query);
    
    res.status(200).json({
      success: true,
      data: {
        available: !existingCategory,
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

// Helper function to build category hierarchy
function buildCategoryHierarchy(categories) {
  const categoryMap = new Map();
  const rootCategories = [];

  // Create a map for quick lookup
  categories.forEach(category => {
    categoryMap.set(category._id.toString(), { ...category.toObject(), children: [] });
  });

  // Build the hierarchy
  categories.forEach(category => {
    const categoryObj = categoryMap.get(category._id.toString());
    
    if (category.parent) {
      const parent = categoryMap.get(category.parent._id.toString());
      if (parent) {
        parent.children.push(categoryObj);
      }
    } else {
      rootCategories.push(categoryObj);
    }
  });

  return rootCategories;
}
