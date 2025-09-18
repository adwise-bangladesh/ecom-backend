const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function reseedPricing() {
  try {
    console.log('🔄 Updating product pricing...');
    
    // Get all products
    const products = await Product.find({});
    
    if (products.length === 0) {
      console.log('❌ No products found. Please run the main seed script first.');
      return;
    }
    
    // Update each product with pricing structure
    for (const product of products) {
      // Only update if pricing fields are missing
      if (!product.regularPrice || !product.costPrice) {
        // Calculate pricing based on current price
        const currentPrice = product.price;
        const regularPrice = Math.round(currentPrice * 1.2); // 20% markup for regular price
        const costPrice = Math.round(currentPrice * 0.6); // 40% margin
        const wholesalePrice = Math.round(currentPrice * 0.8); // 20% margin
        const resellPrice = Math.round(currentPrice * 0.9); // 10% margin
        
        await Product.findByIdAndUpdate(product._id, {
          regularPrice,
          costPrice,
          wholesalePrice,
          resellPrice
        });
        
        console.log(`✅ Updated ${product.title}: Regular $${regularPrice}, Cost $${costPrice}`);
      } else {
        console.log(`⏭️  Skipped ${product.title} (already has pricing)`);
      }
    }
    
    console.log('🎉 Pricing update completed!');
    
  } catch (error) {
    console.error('❌ Error updating pricing:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the reseed function
reseedPricing();
