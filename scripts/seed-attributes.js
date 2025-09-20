const mongoose = require('mongoose');
const ProductAttribute = require('../models/ProductAttribute');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample attributes data (simplified)
const sampleAttributes = [
  {
    name: 'Size',
    values: [
      { value: 'xs', label: 'Extra Small' },
      { value: 's', label: 'Small' },
      { value: 'm', label: 'Medium' },
      { value: 'l', label: 'Large' },
      { value: 'xl', label: 'Extra Large' },
      { value: 'xxl', label: 'Double Extra Large' }
    ],
    isActive: true
  },
  {
    name: 'Color',
    values: [
      { value: 'red', label: 'Red' },
      { value: 'blue', label: 'Blue' },
      { value: 'green', label: 'Green' },
      { value: 'black', label: 'Black' },
      { value: 'white', label: 'White' },
      { value: 'yellow', label: 'Yellow' },
      { value: 'purple', label: 'Purple' },
      { value: 'orange', label: 'Orange' }
    ],
    isActive: true
  },
  {
    name: 'Material',
    values: [
      { value: 'cotton', label: 'Cotton' },
      { value: 'polyester', label: 'Polyester' },
      { value: 'wool', label: 'Wool' },
      { value: 'silk', label: 'Silk' },
      { value: 'leather', label: 'Leather' },
      { value: 'denim', label: 'Denim' },
      { value: 'linen', label: 'Linen' }
    ],
    isActive: true
  },
  {
    name: 'Storage Capacity',
    values: [
      { value: '32gb', label: '32 GB' },
      { value: '64gb', label: '64 GB' },
      { value: '128gb', label: '128 GB' },
      { value: '256gb', label: '256 GB' },
      { value: '512gb', label: '512 GB' },
      { value: '1tb', label: '1 TB' }
    ],
    isActive: true
  }
];

async function seedAttributes() {
  try {
    console.log('🌱 Starting attribute seeding...');

    // Clear existing attributes
    await ProductAttribute.deleteMany({});
    console.log('✅ Cleared existing attributes');

    // Insert sample attributes
    const createdAttributes = await ProductAttribute.insertMany(sampleAttributes);
    console.log(`✅ Created ${createdAttributes.length} attributes`);

    // List created attributes
    createdAttributes.forEach(attr => {
      console.log(`  - ${attr.name}: ${attr.values.length} values`);
    });

    console.log('🎉 Attribute seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding attributes:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the seeding function
seedAttributes();