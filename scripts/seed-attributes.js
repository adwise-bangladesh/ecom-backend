const mongoose = require('mongoose');
require('dotenv').config();

const Attribute = require('../models/Attribute');

async function seedAttributes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing attributes
    await Attribute.deleteMany({});
    console.log('Cleared existing attributes');

    // Sample attributes data
    const attributesData = [
      {
        name: 'Color',
        values: [
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' },
          { value: 'green', label: 'Green' },
          { value: 'black', label: 'Black' },
          { value: 'white', label: 'White' }
        ],
        isActive: true
      },
      {
        name: 'Size',
        values: [
          { value: 'xs', label: 'Extra Small' },
          { value: 's', label: 'Small' },
          { value: 'm', label: 'Medium' },
          { value: 'l', label: 'Large' },
          { value: 'xl', label: 'Extra Large' }
        ],
        isActive: true
      },
      {
        name: 'Material',
        values: [
          { value: 'cotton', label: 'Cotton' },
          { value: 'polyester', label: 'Polyester' },
          { value: 'wool', label: 'Wool' },
          { value: 'leather', label: 'Leather' },
          { value: 'silk', label: 'Silk' }
        ],
        isActive: true
      },
      {
        name: 'Brand',
        values: [
          { value: 'apple', label: 'Apple' },
          { value: 'samsung', label: 'Samsung' },
          { value: 'nike', label: 'Nike' },
          { value: 'adidas', label: 'Adidas' },
          { value: 'sony', label: 'Sony' }
        ],
        isActive: true
      },
      {
        name: 'Storage',
        values: [
          { value: '64gb', label: '64GB' },
          { value: '128gb', label: '128GB' },
          { value: '256gb', label: '256GB' },
          { value: '512gb', label: '512GB' },
          { value: '1tb', label: '1TB' }
        ],
        isActive: true
      }
    ];

    // Insert attributes
    const createdAttributes = await Attribute.insertMany(attributesData);
    console.log(`✅ Created ${createdAttributes.length} attributes`);

    // Display created attributes
    createdAttributes.forEach((attribute, index) => {
      console.log(`${index + 1}. ${attribute.name} - ${attribute.values.length} values`);
    });

  } catch (error) {
    console.error('❌ Error seeding attributes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding
seedAttributes();