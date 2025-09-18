const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

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

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

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
    console.log(`Created ${createdProducts.length} products`);

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: john@example.com / user123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
