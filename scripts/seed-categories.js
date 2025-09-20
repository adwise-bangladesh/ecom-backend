const mongoose = require('mongoose');
const Category = require('../models/Category');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleCategories = [
  // Main Categories (Level 0)
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    parent: null,
    level: 0,
    displayOrder: 1,
    isActive: true,
    showOnHomepage: true,
    productCount: 0
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion and apparel for all ages',
    parent: null,
    level: 0,
    displayOrder: 2,
    isActive: true,
    showOnHomepage: true,
    productCount: 0
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home improvement and gardening supplies',
    parent: null,
    level: 0,
    displayOrder: 3,
    isActive: true,
    showOnHomepage: true,
    productCount: 0
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment and outdoor gear',
    parent: null,
    level: 0,
    displayOrder: 4,
    isActive: true,
    showOnHomepage: false,
    productCount: 0
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Books, magazines, and educational materials',
    parent: null,
    level: 0,
    displayOrder: 5,
    isActive: true,
    showOnHomepage: false,
    productCount: 0
  }
];

const seedCategories = async () => {
  try {
    console.log('🌱 Starting category seeding...');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('✅ Cleared existing categories');

    // Create main categories first
    const createdCategories = [];
    for (const categoryData of sampleCategories) {
      const category = await Category.create(categoryData);
      createdCategories.push(category);
      console.log(`✅ Created main category: ${category.name}`);
    }

    // Create subcategories (Level 1)
    const electronicsId = createdCategories.find(c => c.name === 'Electronics')._id;
    const clothingId = createdCategories.find(c => c.name === 'Clothing')._id;
    const homeId = createdCategories.find(c => c.name === 'Home & Garden')._id;
    const sportsId = createdCategories.find(c => c.name === 'Sports & Outdoors')._id;
    const booksId = createdCategories.find(c => c.name === 'Books')._id;

    const subcategories = [
      // Electronics subcategories
      {
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Mobile phones and accessories',
        parent: electronicsId,
        level: 1,
        displayOrder: 1,
        isActive: true,
        showOnHomepage: true,
        productCount: 0
      },
      {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Portable computers and accessories',
        parent: electronicsId,
        level: 1,
        displayOrder: 2,
        isActive: true,
        showOnHomepage: true,
        productCount: 0
      },
      {
        name: 'Audio & Headphones',
        slug: 'audio-headphones',
        description: 'Speakers, headphones, and audio equipment',
        parent: electronicsId,
        level: 1,
        displayOrder: 3,
        isActive: true,
        showOnHomepage: false,
        productCount: 0
      },
      // Clothing subcategories
      {
        name: 'Men\'s Clothing',
        slug: 'mens-clothing',
        description: 'Clothing for men',
        parent: clothingId,
        level: 1,
        displayOrder: 1,
        isActive: true,
        showOnHomepage: true,
        productCount: 0
      },
      {
        name: 'Women\'s Clothing',
        slug: 'womens-clothing',
        description: 'Clothing for women',
        parent: clothingId,
        level: 1,
        displayOrder: 2,
        isActive: true,
        showOnHomepage: true,
        productCount: 0
      },
      {
        name: 'Kids\' Clothing',
        slug: 'kids-clothing',
        description: 'Clothing for children',
        parent: clothingId,
        level: 1,
        displayOrder: 3,
        isActive: true,
        showOnHomepage: false,
        productCount: 0
      },
      // Home & Garden subcategories
      {
        name: 'Furniture',
        slug: 'furniture',
        description: 'Home and office furniture',
        parent: homeId,
        level: 1,
        displayOrder: 1,
        isActive: true,
        showOnHomepage: true,
        productCount: 0
      },
      {
        name: 'Kitchen & Dining',
        slug: 'kitchen-dining',
        description: 'Kitchen appliances and dining accessories',
        parent: homeId,
        level: 1,
        displayOrder: 2,
        isActive: true,
        showOnHomepage: false,
        productCount: 0
      },
      {
        name: 'Garden Tools',
        slug: 'garden-tools',
        description: 'Gardening equipment and tools',
        parent: homeId,
        level: 1,
        displayOrder: 3,
        isActive: true,
        showOnHomepage: false,
        productCount: 0
      },
      // Sports subcategories
      {
        name: 'Fitness Equipment',
        slug: 'fitness-equipment',
        description: 'Exercise and fitness gear',
        parent: sportsId,
        level: 1,
        displayOrder: 1,
        isActive: true,
        showOnHomepage: false,
        productCount: 0
      },
      {
        name: 'Outdoor Gear',
        slug: 'outdoor-gear',
        description: 'Camping and outdoor equipment',
        parent: sportsId,
        level: 1,
        displayOrder: 2,
        isActive: true,
        showOnHomepage: false,
        productCount: 0
      },
      // Books subcategories
      {
        name: 'Fiction',
        slug: 'fiction',
        description: 'Fiction books and novels',
        parent: booksId,
        level: 1,
        displayOrder: 1,
        isActive: true,
        showOnHomepage: false,
        productCount: 0
      },
      {
        name: 'Non-Fiction',
        slug: 'non-fiction',
        description: 'Non-fiction books and educational materials',
        parent: booksId,
        level: 1,
        displayOrder: 2,
        isActive: true,
        showOnHomepage: false,
        productCount: 0
      }
    ];

    // Create subcategories
    for (const subcategoryData of subcategories) {
      const subcategory = await Category.create(subcategoryData);
      console.log(`✅ Created subcategory: ${subcategory.name} (under ${subcategoryData.parent ? 'parent' : 'main'})`);
    }

    // Create some level 2 subcategories (sub-subcategories)
    const smartphonesId = await Category.findOne({ slug: 'smartphones' }).select('_id');
    const laptopsId = await Category.findOne({ slug: 'laptops' }).select('_id');
    const mensClothingId = await Category.findOne({ slug: 'mens-clothing' }).select('_id');

    const level2Categories = [
      {
        name: 'iPhone',
        slug: 'iphone',
        description: 'Apple iPhone smartphones',
        parent: smartphonesId._id,
        level: 2,
        displayOrder: 1,
        isActive: true,
        showOnHomepage: false,
        productCount: 0
      },
      {
        name: 'Android Phones',
        slug: 'android-phones',
        description: 'Android smartphones',
        parent: smartphonesId._id,
        level: 2,
        displayOrder: 2,
        isActive: true,
        showOnHomepage: false,
        productCount: 0
      },
      {
        name: 'Gaming Laptops',
        slug: 'gaming-laptops',
        description: 'High-performance gaming laptops',
        parent: laptopsId._id,
        level: 2,
        displayOrder: 1,
        isActive: true,
        showOnHomepage: false,
        productCount: 0
      },
      {
        name: 'Business Laptops',
        slug: 'business-laptops',
        description: 'Professional business laptops',
        parent: laptopsId._id,
        level: 2,
        displayOrder: 2,
        isActive: true,
        showOnHomepage: false,
        productCount: 0
      },
      {
        name: 'Men\'s Shirts',
        slug: 'mens-shirts',
        description: 'Men\'s shirts and tops',
        parent: mensClothingId._id,
        level: 2,
        displayOrder: 1,
        isActive: true,
        showOnHomepage: false,
        productCount: 0
      },
      {
        name: 'Men\'s Pants',
        slug: 'mens-pants',
        description: 'Men\'s pants and trousers',
        parent: mensClothingId._id,
        level: 2,
        displayOrder: 2,
        isActive: true,
        showOnHomepage: false,
        productCount: 0
      }
    ];

    // Create level 2 categories
    for (const level2Data of level2Categories) {
      const level2Category = await Category.create(level2Data);
      console.log(`✅ Created level 2 category: ${level2Category.name}`);
    }

    console.log('🎉 Category seeding completed successfully!');
    console.log(`📊 Created ${sampleCategories.length} main categories, ${subcategories.length} subcategories, and ${level2Categories.length} level 2 categories`);

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
seedCategories();
