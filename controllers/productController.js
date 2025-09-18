const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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
      .select('title slug images price regularPrice category createdAt');

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
      .select('title slug description images price regularPrice stock category createdAt');

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
      .select('title slug images price regularPrice category');

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

// @desc    Seed database with sample data
// @route   POST /api/v1/seed
// @access  Public (for development/production seeding)
exports.seedDatabase = async (req, res) => {
  try {
    // Sample data
    const categories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop'
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
      },
      {
        name: 'Sports',
        slug: 'sports',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
      },
      {
        name: 'Books',
        slug: 'books',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
      }
    ];

    const products = [
      {
        title: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'The latest iPhone with advanced camera system and A17 Pro chip. Features titanium design and USB-C connectivity.',
        images: [
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop'
        ],
        price: 999,
        stock: 50
      },
      {
        title: 'Samsung Galaxy S24',
        slug: 'samsung-galaxy-s24',
        description: 'Premium Android smartphone with AI-powered features and stunning display.',
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop'
        ],
        price: 799,
        stock: 30
      },
      {
        title: 'MacBook Pro M3',
        slug: 'macbook-pro-m3',
        description: 'Powerful laptop with M3 chip, perfect for professionals and creatives.',
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop'
        ],
        price: 1999,
        stock: 20
      },
      {
        title: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        description: 'Comfortable running shoes with Max Air cushioning for all-day comfort.',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop'
        ],
        price: 150,
        stock: 100
      },
      {
        title: 'Adidas Ultraboost 22',
        slug: 'adidas-ultraboost-22',
        description: 'Premium running shoes with Boost technology for energy return.',
        images: [
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'
        ],
        price: 180,
        stock: 75
      },
      {
        title: 'Cotton T-Shirt',
        slug: 'cotton-t-shirt',
        description: 'Soft and comfortable cotton t-shirt, perfect for everyday wear.',
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop'
        ],
        price: 25,
        stock: 200
      },
      {
        title: 'Denim Jeans',
        slug: 'denim-jeans',
        description: 'Classic denim jeans with modern fit and comfort.',
        images: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop'
        ],
        price: 80,
        stock: 150
      },
      {
        title: 'Coffee Maker',
        slug: 'coffee-maker',
        description: 'Automatic coffee maker with programmable features and thermal carafe.',
        images: [
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1559056199-641a0ac8c55f?w=600&h=600&fit=crop'
        ],
        price: 120,
        stock: 40
      },
      {
        title: 'Yoga Mat',
        slug: 'yoga-mat',
        description: 'Non-slip yoga mat with excellent grip and cushioning.',
        images: [
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1506629905607-0b2b4b0b0b0b?w=600&h=600&fit=crop'
        ],
        price: 45,
        stock: 80
      },
      {
        title: 'JavaScript: The Good Parts',
        slug: 'javascript-the-good-parts',
        description: 'Essential guide to JavaScript programming by Douglas Crockford.',
        images: [
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop'
        ],
        price: 35,
        stock: 60
      }
    ];

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '1234567890',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        password: 'user123',
        role: 'customer'
      }
    ];

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create categories
    const createdCategories = await Category.insertMany(categories);

    // Create products with category references
    const electronicsCategory = createdCategories.find(cat => cat.slug === 'electronics');
    const clothingCategory = createdCategories.find(cat => cat.slug === 'clothing');
    const sportsCategory = createdCategories.find(cat => cat.slug === 'sports');
    const homeCategory = createdCategories.find(cat => cat.slug === 'home-garden');
    const booksCategory = createdCategories.find(cat => cat.slug === 'books');

    const productsWithCategories = products.map((product, index) => {
      let category;
      if (index < 3) category = electronicsCategory._id;
      else if (index < 7) category = clothingCategory._id;
      else if (index === 7) category = homeCategory._id;
      else if (index === 8) category = sportsCategory._id;
      else category = booksCategory._id;

      return { ...product, category };
    });

    const createdProducts = await Product.insertMany(productsWithCategories);

    // Hash passwords and create users
    const hashedUsers = await Promise.all(users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      return { ...user, password: hashedPassword };
    }));

    const createdUsers = await User.insertMany(hashedUsers);

    res.status(200).json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        categories: createdCategories.length,
        products: createdProducts.length,
        users: createdUsers.length
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error.message
    });
  }
};

// @desc    Update product pricing structure
// @route   POST /api/v1/update-pricing
// @access  Public (Development only)
exports.updateProductPricing = async (req, res) => {
  try {
    console.log('🔄 Updating product pricing structure...');
    
    // Product pricing mapping based on current prices
    const productPricingMap = {
      'iphone-15-pro': {
        regularPrice: 1199,
        costPrice: 800,
        wholesalePrice: 900,
        resellPrice: 950
      },
      'samsung-galaxy-s24': {
        regularPrice: 899,
        costPrice: 650,
        wholesalePrice: 720,
        resellPrice: 750
      },
      'macbook-pro-m3': {
        regularPrice: 2299,
        costPrice: 1600,
        wholesalePrice: 1800,
        resellPrice: 1900
      },
      'nike-air-max-270': {
        regularPrice: 180,
        costPrice: 100,
        wholesalePrice: 120,
        resellPrice: 130
      },
      'adidas-ultraboost-22': {
        regularPrice: 200,
        costPrice: 120,
        wholesalePrice: 140,
        resellPrice: 150
      },
      'cotton-t-shirt': {
        regularPrice: 30,
        costPrice: 15,
        wholesalePrice: 18,
        resellPrice: 20
      },
      'denim-jeans': {
        regularPrice: 100,
        costPrice: 50,
        wholesalePrice: 60,
        resellPrice: 65
      },
      'coffee-maker': {
        regularPrice: 150,
        costPrice: 80,
        wholesalePrice: 95,
        resellPrice: 105
      },
      'yoga-mat': {
        regularPrice: 60,
        costPrice: 25,
        wholesalePrice: 32,
        resellPrice: 35
      },
      'javascript-the-good-parts': {
        regularPrice: 45,
        costPrice: 20,
        wholesalePrice: 25,
        resellPrice: 28
      }
    };
    
    // Get all products
    const products = await Product.find({});
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No products found in database'
      });
    }
    
    let updatedCount = 0;
    const updatedProducts = [];
    
    // Update each product
    for (const product of products) {
      const pricing = productPricingMap[product.slug];
      
      if (pricing) {
        // Update with specific pricing
        const updatedProduct = await Product.findByIdAndUpdate(
          product._id,
          {
            regularPrice: pricing.regularPrice,
            costPrice: pricing.costPrice,
            wholesalePrice: pricing.wholesalePrice,
            resellPrice: pricing.resellPrice
          },
          { new: true }
        );
        
        updatedProducts.push({
          title: updatedProduct.title,
          slug: updatedProduct.slug,
          regularPrice: updatedProduct.regularPrice,
          price: updatedProduct.price,
          costPrice: updatedProduct.costPrice
        });
        
        updatedCount++;
      } else {
        // Calculate generic pricing for unknown products
        const currentPrice = product.price;
        const regularPrice = Math.round(currentPrice * 1.2);
        const costPrice = Math.round(currentPrice * 0.6);
        const wholesalePrice = Math.round(currentPrice * 0.8);
        const resellPrice = Math.round(currentPrice * 0.9);
        
        const updatedProduct = await Product.findByIdAndUpdate(
          product._id,
          {
            regularPrice,
            costPrice,
            wholesalePrice,
            resellPrice
          },
          { new: true }
        );
        
        updatedProducts.push({
          title: updatedProduct.title,
          slug: updatedProduct.slug,
          regularPrice: updatedProduct.regularPrice,
          price: updatedProduct.price,
          costPrice: updatedProduct.costPrice
        });
        
        updatedCount++;
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Successfully updated ${updatedCount} products with pricing structure`,
      data: {
        updatedCount,
        products: updatedProducts
      }
    });
    
  } catch (error) {
    console.error('Error updating product pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product pricing',
      error: error.message
    });
  }
};
