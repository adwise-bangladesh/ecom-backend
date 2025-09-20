const mongoose = require('mongoose');
const ProductAttribute = require('../models/ProductAttribute');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleAttributes = [
  {
    name: 'Size',
    slug: 'size',
    description: 'Product size options',
    type: 'select',
    values: [
      { value: 'xs', label: 'Extra Small' },
      { value: 's', label: 'Small' },
      { value: 'm', label: 'Medium' },
      { value: 'l', label: 'Large' },
      { value: 'xl', label: 'Extra Large' },
      { value: 'xxl', label: '2X Large' }
    ],
    isVisible: true,
    isVariation: true,
    isRequired: false,
    displayOrder: 1,
    group: 'general'
  },
  {
    name: 'Color',
    slug: 'color',
    description: 'Product color options',
    type: 'color',
    values: [
      { value: 'red', label: 'Red', colorCode: '#FF0000' },
      { value: 'blue', label: 'Blue', colorCode: '#0000FF' },
      { value: 'green', label: 'Green', colorCode: '#00FF00' },
      { value: 'black', label: 'Black', colorCode: '#000000' },
      { value: 'white', label: 'White', colorCode: '#FFFFFF' },
      { value: 'yellow', label: 'Yellow', colorCode: '#FFFF00' },
      { value: 'purple', label: 'Purple', colorCode: '#800080' },
      { value: 'orange', label: 'Orange', colorCode: '#FFA500' }
    ],
    isVisible: true,
    isVariation: true,
    isRequired: false,
    displayOrder: 2,
    group: 'general'
  },
  {
    name: 'Material',
    slug: 'material',
    description: 'Product material',
    type: 'select',
    values: [
      { value: 'cotton', label: 'Cotton' },
      { value: 'polyester', label: 'Polyester' },
      { value: 'wool', label: 'Wool' },
      { value: 'silk', label: 'Silk' },
      { value: 'leather', label: 'Leather' },
      { value: 'denim', label: 'Denim' },
      { value: 'linen', label: 'Linen' }
    ],
    isVisible: true,
    isVariation: false,
    isRequired: false,
    displayOrder: 3,
    group: 'specifications'
  },
  {
    name: 'Brand',
    slug: 'brand',
    description: 'Product brand',
    type: 'text',
    values: [],
    isVisible: true,
    isVariation: false,
    isRequired: false,
    displayOrder: 4,
    group: 'general'
  },
  {
    name: 'Weight',
    slug: 'weight',
    description: 'Product weight in grams',
    type: 'number',
    values: [],
    isVisible: true,
    isVariation: false,
    isRequired: false,
    displayOrder: 5,
    group: 'specifications',
    validation: {
      min: 0,
      max: 50000,
      message: 'Weight must be between 0 and 50000 grams'
    }
  },
  {
    name: 'Storage',
    slug: 'storage',
    description: 'Storage capacity (for electronics)',
    type: 'select',
    values: [
      { value: '16gb', label: '16 GB' },
      { value: '32gb', label: '32 GB' },
      { value: '64gb', label: '64 GB' },
      { value: '128gb', label: '128 GB' },
      { value: '256gb', label: '256 GB' },
      { value: '512gb', label: '512 GB' },
      { value: '1tb', label: '1 TB' }
    ],
    isVisible: true,
    isVariation: true,
    isRequired: false,
    displayOrder: 6,
    group: 'specifications'
  }
];

async function seedAttributes() {
  try {
    console.log('🌱 Starting product attributes seeding...');
    
    // Clear existing attributes
    await ProductAttribute.deleteMany({});
    console.log('🗑️ Cleared existing product attributes');
    
    // Create new attributes
    const createdAttributes = await ProductAttribute.insertMany(sampleAttributes);
    console.log(`✅ Created ${createdAttributes.length} product attributes`);
    
    console.log('🎉 Product attributes seeding completed successfully!');
    
    console.log('\n📊 Summary:');
    console.log(`- Total Attributes: ${createdAttributes.length}`);
    console.log(`- Variation Attributes: ${createdAttributes.filter(a => a.isVariation).length}`);
    console.log(`- Visible Attributes: ${createdAttributes.filter(a => a.isVisible).length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding product attributes:', error);
    process.exit(1);
  }
}

seedAttributes();
