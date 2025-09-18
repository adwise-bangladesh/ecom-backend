const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

async function updateExistingProducts() {
  try {
    console.log('🔄 Updating existing products with pricing structure...');
    
    // Get all products
    const products = await Product.find({});
    
    if (products.length === 0) {
      console.log('❌ No products found in database.');
      return;
    }
    
    console.log(`📦 Found ${products.length} products to update`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    // Update each product
    for (const product of products) {
      const pricing = productPricingMap[product.slug];
      
      if (pricing) {
        // Update with specific pricing
        await Product.findByIdAndUpdate(product._id, {
          regularPrice: pricing.regularPrice,
          costPrice: pricing.costPrice,
          wholesalePrice: pricing.wholesalePrice,
          resellPrice: pricing.resellPrice
        });
        
        console.log(`✅ Updated ${product.title}: Regular $${pricing.regularPrice}, Offer $${product.price}, Cost $${pricing.costPrice}`);
        updatedCount++;
      } else {
        // Calculate generic pricing for unknown products
        const currentPrice = product.price;
        const regularPrice = Math.round(currentPrice * 1.2);
        const costPrice = Math.round(currentPrice * 0.6);
        const wholesalePrice = Math.round(currentPrice * 0.8);
        const resellPrice = Math.round(currentPrice * 0.9);
        
        await Product.findByIdAndUpdate(product._id, {
          regularPrice,
          costPrice,
          wholesalePrice,
          resellPrice
        });
        
        console.log(`✅ Updated ${product.title}: Regular $${regularPrice}, Offer $${currentPrice}, Cost $${costPrice}`);
        updatedCount++;
      }
    }
    
    console.log(`\n🎉 Update completed!`);
    console.log(`✅ Updated: ${updatedCount} products`);
    console.log(`⏭️  Skipped: ${skippedCount} products`);
    
  } catch (error) {
    console.error('❌ Error updating products:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the update function
updateExistingProducts();
