const mongoose = require('mongoose');
const Category = require('./models/Category');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testCategories = async () => {
  try {
    console.log('🔍 Testing categories in database...');
    
    // Count total categories
    const totalCount = await Category.countDocuments();
    console.log(`📊 Total categories in database: ${totalCount}`);
    
    // Get all categories
    const categories = await Category.find({}).populate('parent', 'name slug').sort({ level: 1, displayOrder: 1, name: 1 });
    
    console.log('\n📋 All categories:');
    categories.forEach((category, index) => {
      const indent = '  '.repeat(category.level);
      const parentInfo = category.parent ? ` (under ${category.parent.name})` : ' (main category)';
      console.log(`${index + 1}. ${indent}${category.name}${parentInfo} - Level ${category.level} - Active: ${category.isActive}`);
    });
    
    // Test the query that the API uses
    console.log('\n🔍 Testing API query...');
    const apiQuery = {}; // This is what the API uses for admin
    const apiCategories = await Category.find(apiQuery)
      .populate('parent', 'name slug')
      .sort({ level: 1, displayOrder: 1, name: 1 })
      .select('name slug image banner description level parent displayOrder productCount isActive showOnHomepage createdAt updatedAt');
    
    console.log(`📊 Categories returned by API query: ${apiCategories.length}`);
    
    if (apiCategories.length > 0) {
      console.log('\n✅ API query works! Categories found:');
      apiCategories.slice(0, 5).forEach((category, index) => {
        console.log(`${index + 1}. ${category.name} (${category.isActive ? 'Active' : 'Inactive'})`);
      });
      if (apiCategories.length > 5) {
        console.log(`... and ${apiCategories.length - 5} more`);
      }
    } else {
      console.log('❌ API query returns no categories!');
    }
    
  } catch (error) {
    console.error('❌ Error testing categories:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the test
testCategories();
