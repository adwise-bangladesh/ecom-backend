const mongoose = require('mongoose');
require('dotenv').config();

const Brand = require('../models/Brand');

async function seedBrands() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing brands
    await Brand.deleteMany({});
    console.log('Cleared existing brands');

    // Sample brands data
    const brandsData = [
      {
        name: 'Apple',
        description: 'Innovative technology company known for premium products',
        image: 'https://images.unsplash.com/photo-1564466809058-bf25f82f34e1?w=200&h=200&fit=crop',
        website: 'https://apple.com',
        isActive: true,
        displayOrder: 1
      },
      {
        name: 'Samsung',
        description: 'Global technology leader in electronics and mobile devices',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop',
        website: 'https://samsung.com',
        isActive: true,
        displayOrder: 2
      },
      {
        name: 'Nike',
        description: 'World leader in athletic footwear, apparel, and equipment',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
        website: 'https://nike.com',
        isActive: true,
        displayOrder: 3
      },
      {
        name: 'Adidas',
        description: 'German multinational corporation that designs and manufactures shoes',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop',
        website: 'https://adidas.com',
        isActive: true,
        displayOrder: 4
      },
      {
        name: 'Sony',
        description: 'Japanese multinational conglomerate corporation',
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=200&fit=crop',
        website: 'https://sony.com',
        isActive: true,
        displayOrder: 5
      }
    ];

    // Insert brands
    const createdBrands = await Brand.insertMany(brandsData);
    console.log(`✅ Created ${createdBrands.length} brands`);

    // Display created brands
    createdBrands.forEach((brand, index) => {
      console.log(`${index + 1}. ${brand.name} - ${brand.description}`);
    });

  } catch (error) {
    console.error('❌ Error seeding brands:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding
seedBrands();
