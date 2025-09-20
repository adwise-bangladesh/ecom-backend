const mongoose = require('mongoose');
const Category = require('./models/Category');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testCategories = async () => {
  try {
    console.log('🔍 Checking categories in database...');
    
    const categories = await Category.find({});
    console.log(`📊 Found ${categories.length} categories in database`);
    
    if (categories.length > 0) {
      console.log('📋 Categories:');
      categories.forEach((cat, index) => {
        console.log(`${index + 1}. ${cat.name} (${cat.slug}) - Level: ${cat.level} - Active: ${cat.isActive}`);
      });
    } else {
      console.log('❌ No categories found in database');
      console.log('🌱 Creating sample categories...');
      
      // Create a simple category
      const sampleCategory = await Category.create({
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        parent: null,
        level: 0,
        displayOrder: 1,
        isActive: true,
        showOnHomepage: true,
        productCount: 0
      });
      
      console.log(`✅ Created sample category: ${sampleCategory.name}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

testCategories();
