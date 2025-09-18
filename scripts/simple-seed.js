const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('../models/Category');
const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect('mongodb+srv://adwisebangladesh_db_user:ut6MSoplW7izBU88@cluster0.ser5cva.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
    regularPrice: 1199,
    price: 999,
    costPrice: 800,
    wholesalePrice: 900,
    resellPrice: 950,
    stock: 50,
    category: 'electronics'
  },
  {
    title: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Premium Android smartphone with S Pen, advanced AI features, and professional-grade camera system.',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop'
    ],
    regularPrice: 1299,
    price: 1099,
    costPrice: 900,
    wholesalePrice: 1000,
    resellPrice: 1050,
    stock: 30,
    category: 'electronics'
  },
  {
    title: 'MacBook Pro M3',
    slug: 'macbook-pro-m3',
    description: 'Powerful laptop with M3 chip, perfect for professionals and creatives. Features stunning Liquid Retina XDR display.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop'
    ],
    regularPrice: 1999,
    price: 1799,
    costPrice: 1500,
    wholesalePrice: 1600,
    resellPrice: 1700,
    stock: 25,
    category: 'electronics'
  },
  {
    title: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    description: 'Comfortable running shoes with Max Air cushioning. Perfect for daily wear and athletic activities.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop'
    ],
    regularPrice: 150,
    price: 120,
    costPrice: 80,
    wholesalePrice: 100,
    resellPrice: 110,
    stock: 100,
    category: 'sports'
  },
  {
    title: 'Adidas Ultraboost 22',
    slug: 'adidas-ultraboost-22',
    description: 'High-performance running shoes with Boost midsole technology for maximum energy return.',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop'
    ],
    regularPrice: 180,
    price: 150,
    costPrice: 100,
    wholesalePrice: 120,
    resellPrice: 135,
    stock: 75,
    category: 'sports'
  },
  {
    title: 'Levi\'s 501 Original Jeans',
    slug: 'levis-501-original-jeans',
    description: 'Classic straight-fit jeans made from 100% cotton denim. Timeless style that never goes out of fashion.',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop'
    ],
    regularPrice: 89,
    price: 69,
    costPrice: 45,
    wholesalePrice: 55,
    resellPrice: 62,
    stock: 200,
    category: 'clothing'
  },
  {
    title: 'Uniqlo Heattech T-Shirt',
    slug: 'uniqlo-heattech-t-shirt',
    description: 'Lightweight thermal t-shirt that generates heat to keep you warm in cold weather.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop'
    ],
    regularPrice: 19,
    price: 15,
    costPrice: 8,
    wholesalePrice: 12,
    resellPrice: 13,
    stock: 300,
    category: 'clothing'
  },
  {
    title: 'IKEA FADO Table Lamp',
    slug: 'ikea-fado-table-lamp',
    description: 'Minimalist table lamp with soft, diffused light. Perfect for creating a cozy atmosphere in any room.',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop'
    ],
    regularPrice: 35,
    price: 29,
    costPrice: 18,
    wholesalePrice: 22,
    resellPrice: 25,
    stock: 150,
    category: 'home-garden'
  },
  {
    title: 'Philips Hue Smart Bulb',
    slug: 'philips-hue-smart-bulb',
    description: 'Smart LED bulb with millions of colors and white tones. Control with your smartphone or voice assistant.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop'
    ],
    regularPrice: 49,
    price: 39,
    costPrice: 25,
    wholesalePrice: 30,
    resellPrice: 35,
    stock: 80,
    category: 'home-garden'
  },
  {
    title: 'The Great Gatsby',
    slug: 'the-great-gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald. A timeless story of the Jazz Age and the American Dream.',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop'
    ],
    regularPrice: 12,
    price: 9,
    costPrice: 5,
    wholesalePrice: 7,
    resellPrice: 8,
    stock: 500,
    category: 'books'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create category map for products
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Update products with category IDs
    const productsWithCategories = products.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }));

    // Create products
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Categories: ${createdCategories.length}`);
    console.log(`- Products: ${createdProducts.length}`);
    console.log('\n💰 Pricing Structure Applied:');
    console.log('- Regular Price (crossed out)');
    console.log('- Offer Price (highlighted)');
    console.log('- Cost Price (internal)');
    console.log('- Wholesale Price (internal)');
    console.log('- Resell Price (internal)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
