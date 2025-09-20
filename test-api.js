const axios = require('axios');

const testAPI = async () => {
  try {
    console.log('🔍 Testing API endpoints...');
    
    // Test public categories endpoint
    console.log('\n📡 Testing public categories endpoint...');
    try {
      const publicResponse = await axios.get('http://localhost:5000/api/v1/categories');
      console.log(`✅ Public categories: ${publicResponse.data.data.categories.length} categories found`);
    } catch (error) {
      console.log(`❌ Public categories error: ${error.response?.data?.message || error.message}`);
    }
    
    // Test admin categories endpoint without auth
    console.log('\n📡 Testing admin categories endpoint (no auth)...');
    try {
      const adminResponse = await axios.get('http://localhost:5000/api/v1/admin/categories');
      console.log(`✅ Admin categories (no auth): ${adminResponse.data.data.categories.length} categories found`);
    } catch (error) {
      console.log(`❌ Admin categories (no auth) error: ${error.response?.data?.message || error.message}`);
    }
    
    // Test admin categories endpoint with fake token
    console.log('\n📡 Testing admin categories endpoint (fake token)...');
    try {
      const adminResponseWithToken = await axios.get('http://localhost:5000/api/v1/admin/categories', {
        headers: {
          'Authorization': 'Bearer fake-token',
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ Admin categories (fake token): ${adminResponseWithToken.data.data.categories.length} categories found`);
    } catch (error) {
      console.log(`❌ Admin categories (fake token) error: ${error.response?.data?.message || error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
};

// Run the test
testAPI();
