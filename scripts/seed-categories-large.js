const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('../models/Category');

async function seedCategoriesLarge() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Large categories data with hierarchical structure
    const categoriesData = [
      // Electronics & Technology
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 1
      },
      {
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Mobile phones and accessories',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 1
      },
      {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Portable computers and accessories',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 2
      },
      {
        name: 'Tablets',
        slug: 'tablets',
        description: 'Tablet computers and accessories',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 3
      },
      {
        name: 'Audio & Headphones',
        slug: 'audio-headphones',
        description: 'Audio equipment and headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 4
      },
      {
        name: 'Cameras',
        slug: 'cameras',
        description: 'Digital cameras and photography equipment',
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 5
      },
      {
        name: 'Gaming',
        slug: 'gaming',
        description: 'Gaming consoles and accessories',
        image: 'https://images.unsplash.com/photo-1606144042634-9815c7b1b4b0?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 6
      },
      {
        name: 'Smart Home',
        slug: 'smart-home',
        description: 'Smart home devices and automation',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 7
      },
      {
        name: 'Wearables',
        slug: 'wearables',
        description: 'Smartwatches and fitness trackers',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 8
      },
      {
        name: 'Computer Accessories',
        slug: 'computer-accessories',
        description: 'Keyboards, mice, and computer peripherals',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: false,
        order: 9
      },

      // Fashion & Clothing
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing and fashion accessories',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 2
      },
      {
        name: 'Men\'s Clothing',
        slug: 'mens-clothing',
        description: 'Clothing for men',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 1
      },
      {
        name: 'Women\'s Clothing',
        slug: 'womens-clothing',
        description: 'Clothing for women',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 2
      },
      {
        name: 'Kids\' Clothing',
        slug: 'kids-clothing',
        description: 'Clothing for children',
        image: 'https://images.unsplash.com/photo-1503944583220-79d8926adca1?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 3
      },
      {
        name: 'Shoes',
        slug: 'shoes',
        description: 'Footwear for all ages',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 4
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Fashion accessories and jewelry',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 5
      },
      {
        name: 'Bags & Handbags',
        slug: 'bags-handbags',
        description: 'Handbags, backpacks, and luggage',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 6
      },
      {
        name: 'Watches',
        slug: 'watches',
        description: 'Wristwatches and timepieces',
        image: 'https://images.unsplash.com/photo-1523170335258-f5b6c6e54dbb?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 7
      },
      {
        name: 'Jewelry',
        slug: 'jewelry',
        description: 'Rings, necklaces, and jewelry',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 8
      },
      {
        name: 'Sunglasses',
        slug: 'sunglasses',
        description: 'Eyewear and sunglasses',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0c84?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: false,
        order: 9
      },

      // Home & Garden
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and garden supplies',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 3
      },
      {
        name: 'Furniture',
        slug: 'furniture',
        description: 'Home and office furniture',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 1
      },
      {
        name: 'Kitchen & Dining',
        slug: 'kitchen-dining',
        description: 'Kitchen appliances and dining accessories',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 2
      },
      {
        name: 'Bedroom',
        slug: 'bedroom',
        description: 'Bedroom furniture and accessories',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 3
      },
      {
        name: 'Living Room',
        slug: 'living-room',
        description: 'Living room furniture and decor',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 4
      },
      {
        name: 'Bathroom',
        slug: 'bathroom',
        description: 'Bathroom fixtures and accessories',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 5
      },
      {
        name: 'Garden & Outdoor',
        slug: 'garden-outdoor',
        description: 'Garden tools and outdoor furniture',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 6
      },
      {
        name: 'Home Decor',
        slug: 'home-decor',
        description: 'Decorative items and home accessories',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 7
      },
      {
        name: 'Lighting',
        slug: 'lighting',
        description: 'Light fixtures and lamps',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 8
      },
      {
        name: 'Storage & Organization',
        slug: 'storage-organization',
        description: 'Storage solutions and organization tools',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: false,
        order: 9
      },

      // Sports & Fitness
      {
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Sports equipment and fitness gear',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 4
      },
      {
        name: 'Fitness Equipment',
        slug: 'fitness-equipment',
        description: 'Exercise equipment and fitness gear',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 1
      },
      {
        name: 'Outdoor Sports',
        slug: 'outdoor-sports',
        description: 'Outdoor sports equipment and gear',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 2
      },
      {
        name: 'Team Sports',
        slug: 'team-sports',
        description: 'Team sports equipment and accessories',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 3
      },
      {
        name: 'Water Sports',
        slug: 'water-sports',
        description: 'Swimming and water sports equipment',
        image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 4
      },
      {
        name: 'Winter Sports',
        slug: 'winter-sports',
        description: 'Skiing, snowboarding, and winter gear',
        image: 'https://images.unsplash.com/photo-1551524164-6cf2ac5313c9?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 5
      },
      {
        name: 'Cycling',
        slug: 'cycling',
        description: 'Bicycles and cycling accessories',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 6
      },
      {
        name: 'Running',
        slug: 'running',
        description: 'Running gear and accessories',
        image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 7
      },
      {
        name: 'Yoga & Pilates',
        slug: 'yoga-pilates',
        description: 'Yoga mats and Pilates equipment',
        image: 'https://images.unsplash.com/photo-1506629905607-4b2b4b4b4b4b?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 8
      },
      {
        name: 'Sports Apparel',
        slug: 'sports-apparel',
        description: 'Athletic clothing and sportswear',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: false,
        order: 9
      },

      // Beauty & Personal Care
      {
        name: 'Beauty & Personal Care',
        slug: 'beauty-personal-care',
        description: 'Beauty products and personal care items',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 5
      },
      {
        name: 'Skincare',
        slug: 'skincare',
        description: 'Facial and body skincare products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 1
      },
      {
        name: 'Makeup',
        slug: 'makeup',
        description: 'Cosmetics and makeup products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 2
      },
      {
        name: 'Hair Care',
        slug: 'hair-care',
        description: 'Shampoo, conditioner, and hair styling products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 3
      },
      {
        name: 'Fragrance',
        slug: 'fragrance',
        description: 'Perfumes and colognes',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 4
      },
      {
        name: 'Bath & Body',
        slug: 'bath-body',
        description: 'Soaps, lotions, and bath products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 5
      },
      {
        name: 'Men\'s Grooming',
        slug: 'mens-grooming',
        description: 'Men\'s personal care and grooming products',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 6
      },
      {
        name: 'Oral Care',
        slug: 'oral-care',
        description: 'Toothbrushes, toothpaste, and oral hygiene',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 7
      },
      {
        name: 'Health & Wellness',
        slug: 'health-wellness',
        description: 'Health supplements and wellness products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 8
      },
      {
        name: 'Baby Care',
        slug: 'baby-care',
        description: 'Baby products and infant care',
        image: 'https://images.unsplash.com/photo-1503944583220-79d8926adca1?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: false,
        order: 9
      },

      // Books & Media
      {
        name: 'Books & Media',
        slug: 'books-media',
        description: 'Books, movies, and digital media',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 6
      },
      {
        name: 'Books',
        slug: 'books',
        description: 'Fiction, non-fiction, and educational books',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 1
      },
      {
        name: 'Movies & TV',
        slug: 'movies-tv',
        description: 'DVDs, Blu-rays, and streaming content',
        image: 'https://images.unsplash.com/photo-1489599807906-5b9b4b4b4b4b?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 2
      },
      {
        name: 'Music',
        slug: 'music',
        description: 'CDs, vinyl records, and digital music',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 3
      },
      {
        name: 'Video Games',
        slug: 'video-games',
        description: 'Console and PC video games',
        image: 'https://images.unsplash.com/photo-1606144042634-9815c7b1b4b0?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 4
      },
      {
        name: 'Educational',
        slug: 'educational',
        description: 'Educational materials and courses',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 5
      },
      {
        name: 'Magazines',
        slug: 'magazines',
        description: 'Periodicals and magazines',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 6
      },
      {
        name: 'Audiobooks',
        slug: 'audiobooks',
        description: 'Audio books and spoken word content',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 7
      },
      {
        name: 'E-books',
        slug: 'e-books',
        description: 'Digital books and e-readers',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 8
      },
      {
        name: 'Art & Crafts',
        slug: 'art-crafts',
        description: 'Art supplies and craft materials',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: false,
        order: 9
      },

      // Automotive
      {
        name: 'Automotive',
        slug: 'automotive',
        description: 'Car parts, accessories, and automotive supplies',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 7
      },
      {
        name: 'Car Parts',
        slug: 'car-parts',
        description: 'Engine parts, brakes, and car components',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 1
      },
      {
        name: 'Car Accessories',
        slug: 'car-accessories',
        description: 'Interior and exterior car accessories',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 2
      },
      {
        name: 'Tools & Equipment',
        slug: 'tools-equipment',
        description: 'Automotive tools and repair equipment',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 3
      },
      {
        name: 'Motorcycle',
        slug: 'motorcycle',
        description: 'Motorcycle parts and accessories',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 4
      },
      {
        name: 'Tires & Wheels',
        slug: 'tires-wheels',
        description: 'Tires, rims, and wheel accessories',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 5
      },
      {
        name: 'Car Care',
        slug: 'car-care',
        description: 'Car cleaning and maintenance products',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 6
      },
      {
        name: 'Electronics',
        slug: 'automotive-electronics',
        description: 'Car audio, GPS, and electronic accessories',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 7
      },
      {
        name: 'Safety',
        slug: 'automotive-safety',
        description: 'Car safety equipment and accessories',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: true,
        order: 8
      },
      {
        name: 'Performance',
        slug: 'automotive-performance',
        description: 'Performance parts and upgrades',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop',
        isActive: true,
        showOnHomepage: false,
        order: 9
      }
    ];

    // Insert categories
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Now set up parent-child relationships
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Define parent-child relationships
    const relationships = [
      // Electronics subcategories
      { child: 'smartphones', parent: 'electronics' },
      { child: 'laptops', parent: 'electronics' },
      { child: 'tablets', parent: 'electronics' },
      { child: 'audio-headphones', parent: 'electronics' },
      { child: 'cameras', parent: 'electronics' },
      { child: 'gaming', parent: 'electronics' },
      { child: 'smart-home', parent: 'electronics' },
      { child: 'wearables', parent: 'electronics' },
      { child: 'computer-accessories', parent: 'electronics' },

      // Fashion subcategories
      { child: 'mens-clothing', parent: 'fashion' },
      { child: 'womens-clothing', parent: 'fashion' },
      { child: 'kids-clothing', parent: 'fashion' },
      { child: 'shoes', parent: 'fashion' },
      { child: 'accessories', parent: 'fashion' },
      { child: 'bags-handbags', parent: 'fashion' },
      { child: 'watches', parent: 'fashion' },
      { child: 'jewelry', parent: 'fashion' },
      { child: 'sunglasses', parent: 'fashion' },

      // Home & Garden subcategories
      { child: 'furniture', parent: 'home-garden' },
      { child: 'kitchen-dining', parent: 'home-garden' },
      { child: 'bedroom', parent: 'home-garden' },
      { child: 'living-room', parent: 'home-garden' },
      { child: 'bathroom', parent: 'home-garden' },
      { child: 'garden-outdoor', parent: 'home-garden' },
      { child: 'home-decor', parent: 'home-garden' },
      { child: 'lighting', parent: 'home-garden' },
      { child: 'storage-organization', parent: 'home-garden' },

      // Sports & Fitness subcategories
      { child: 'fitness-equipment', parent: 'sports-fitness' },
      { child: 'outdoor-sports', parent: 'sports-fitness' },
      { child: 'team-sports', parent: 'sports-fitness' },
      { child: 'water-sports', parent: 'sports-fitness' },
      { child: 'winter-sports', parent: 'sports-fitness' },
      { child: 'cycling', parent: 'sports-fitness' },
      { child: 'running', parent: 'sports-fitness' },
      { child: 'yoga-pilates', parent: 'sports-fitness' },
      { child: 'sports-apparel', parent: 'sports-fitness' },

      // Beauty & Personal Care subcategories
      { child: 'skincare', parent: 'beauty-personal-care' },
      { child: 'makeup', parent: 'beauty-personal-care' },
      { child: 'hair-care', parent: 'beauty-personal-care' },
      { child: 'fragrance', parent: 'beauty-personal-care' },
      { child: 'bath-body', parent: 'beauty-personal-care' },
      { child: 'mens-grooming', parent: 'beauty-personal-care' },
      { child: 'oral-care', parent: 'beauty-personal-care' },
      { child: 'health-wellness', parent: 'beauty-personal-care' },
      { child: 'baby-care', parent: 'beauty-personal-care' },

      // Books & Media subcategories
      { child: 'books', parent: 'books-media' },
      { child: 'movies-tv', parent: 'books-media' },
      { child: 'music', parent: 'books-media' },
      { child: 'video-games', parent: 'books-media' },
      { child: 'educational', parent: 'books-media' },
      { child: 'magazines', parent: 'books-media' },
      { child: 'audiobooks', parent: 'books-media' },
      { child: 'e-books', parent: 'books-media' },
      { child: 'art-crafts', parent: 'books-media' },

      // Automotive subcategories
      { child: 'car-parts', parent: 'automotive' },
      { child: 'car-accessories', parent: 'automotive' },
      { child: 'tools-equipment', parent: 'automotive' },
      { child: 'motorcycle', parent: 'automotive' },
      { child: 'tires-wheels', parent: 'automotive' },
      { child: 'car-care', parent: 'automotive' },
      { child: 'automotive-electronics', parent: 'automotive' },
      { child: 'automotive-safety', parent: 'automotive' },
      { child: 'automotive-performance', parent: 'automotive' }
    ];

    // Update categories with parent relationships
    for (const rel of relationships) {
      if (categoryMap[rel.child] && categoryMap[rel.parent]) {
        await Category.findByIdAndUpdate(categoryMap[rel.child], {
          parent: categoryMap[rel.parent]
        });
      }
    }

    console.log(`✅ Set up ${relationships.length} parent-child relationships`);

    // Display created categories
    const mainCategories = createdCategories.filter(cat => !cat.parent);
    console.log(`\n📁 Main Categories (${mainCategories.length}):`);
    mainCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (${category.slug})`);
    });

    const subCategories = createdCategories.filter(cat => cat.parent);
    console.log(`\n📂 Sub Categories (${subCategories.length}):`);
    subCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (${category.slug})`);
    });

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding
seedCategoriesLarge();
