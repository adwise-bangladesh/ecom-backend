require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Create sample categories
    const categories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop',
        isActive: true
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
        isActive: true
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and garden supplies',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
        isActive: true
      },
      {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Sports equipment and outdoor gear',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        isActive: true
      },
      {
        name: 'Books',
        slug: 'books',
        description: 'Books and educational materials',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
        isActive: true
      }
    ];

    // Create parent categories first
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} parent categories`);

    // Create subcategories
    const subcategories = [
      {
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Mobile phones and accessories',
        parent: createdCategories[0]._id, // Electronics
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop',
        isActive: true
      },
      {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Laptop computers and accessories',
        parent: createdCategories[0]._id, // Electronics
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop',
        isActive: true
      },
      {
        name: 'Men\'s Clothing',
        slug: 'mens-clothing',
        description: 'Clothing for men',
        parent: createdCategories[1]._id, // Clothing
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
        isActive: true
      },
      {
        name: 'Women\'s Clothing',
        slug: 'womens-clothing',
        description: 'Clothing for women',
        parent: createdCategories[1]._id, // Clothing
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=200&fit=crop',
        isActive: true
      },
      {
        name: 'Furniture',
        slug: 'furniture',
        description: 'Home furniture and decor',
        parent: createdCategories[2]._id, // Home & Garden
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
        isActive: true
      },
      {
        name: 'Kitchen & Dining',
        slug: 'kitchen-dining',
        description: 'Kitchen appliances and dining supplies',
        parent: createdCategories[2]._id, // Home & Garden
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
        isActive: true
      }
    ];

    const createdSubcategories = await Category.insertMany(subcategories);
    console.log(`Created ${createdSubcategories.length} subcategories`);

    // Create some third-level categories
    const thirdLevelCategories = [
      {
        name: 'iPhone',
        slug: 'iphone',
        description: 'Apple iPhone smartphones',
        parent: createdSubcategories[0]._id, // Smartphones
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop',
        isActive: true
      },
      {
        name: 'Android Phones',
        slug: 'android-phones',
        description: 'Android smartphones',
        parent: createdSubcategories[0]._id, // Smartphones
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop',
        isActive: true
      },
      {
        name: 'MacBooks',
        slug: 'macbooks',
        description: 'Apple MacBook laptops',
        parent: createdSubcategories[1]._id, // Laptops
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop',
        isActive: true
      },
      {
        name: 'Windows Laptops',
        slug: 'windows-laptops',
        description: 'Windows-based laptops',
        parent: createdSubcategories[1]._id, // Laptops
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop',
        isActive: true
      }
    ];

    const createdThirdLevel = await Category.insertMany(thirdLevelCategories);
    console.log(`Created ${createdThirdLevel.length} third-level categories`);

    console.log('\n✅ Categories seeded successfully!');
    console.log(`Total categories created: ${createdCategories.length + createdSubcategories.length + createdThirdLevel.length}`);
    
    // Display the hierarchy
    console.log('\n📁 Category Hierarchy:');
    const allCategories = await Category.find({}).populate('parentCategory', 'name').sort({ level: 1, name: 1 });
    
    allCategories.forEach(category => {
      const indent = '  '.repeat(category.level);
      const parentInfo = category.parentCategory ? ` (under ${category.parentCategory.name})` : '';
      console.log(`${indent}${category.name}${parentInfo}`);
    });

  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seed function
seedCategories();