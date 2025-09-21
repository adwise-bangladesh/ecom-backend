const mongoose = require('mongoose');
require('dotenv').config();

const Brand = require('../models/Brand');

async function seedBrandsLarge() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing brands
    await Brand.deleteMany({});
    console.log('Cleared existing brands');

    // Large brands data
    const brandsData = [
      // Technology Brands
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
        name: 'Google',
        description: 'Technology company specializing in internet-related services',
        image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=200&h=200&fit=crop',
        website: 'https://google.com',
        isActive: true,
        displayOrder: 3
      },
      {
        name: 'Microsoft',
        description: 'Technology corporation developing computer software and hardware',
        image: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=200&h=200&fit=crop',
        website: 'https://microsoft.com',
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
      },
      {
        name: 'LG',
        description: 'South Korean multinational electronics company',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=200&fit=crop',
        website: 'https://lg.com',
        isActive: true,
        displayOrder: 6
      },
      {
        name: 'HP',
        description: 'American multinational information technology company',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=200&fit=crop',
        website: 'https://hp.com',
        isActive: true,
        displayOrder: 7
      },
      {
        name: 'Dell',
        description: 'American multinational computer technology company',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=200&fit=crop',
        website: 'https://dell.com',
        isActive: true,
        displayOrder: 8
      },
      {
        name: 'ASUS',
        description: 'Taiwanese multinational computer hardware and electronics company',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=200&fit=crop',
        website: 'https://asus.com',
        isActive: true,
        displayOrder: 9
      },
      {
        name: 'Lenovo',
        description: 'Chinese multinational technology company',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=200&fit=crop',
        website: 'https://lenovo.com',
        isActive: true,
        displayOrder: 10
      },

      // Fashion Brands
      {
        name: 'Nike',
        description: 'World leader in athletic footwear, apparel, and equipment',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
        website: 'https://nike.com',
        isActive: true,
        displayOrder: 11
      },
      {
        name: 'Adidas',
        description: 'German multinational corporation that designs and manufactures shoes',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop',
        website: 'https://adidas.com',
        isActive: true,
        displayOrder: 12
      },
      {
        name: 'Puma',
        description: 'German multinational corporation that designs and manufactures athletic and casual footwear',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop',
        website: 'https://puma.com',
        isActive: true,
        displayOrder: 13
      },
      {
        name: 'Under Armour',
        description: 'American company that manufactures footwear, sports and casual apparel',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop',
        website: 'https://underarmour.com',
        isActive: true,
        displayOrder: 14
      },
      {
        name: 'Reebok',
        description: 'American fitness footwear and clothing company',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop',
        website: 'https://reebok.com',
        isActive: true,
        displayOrder: 15
      },
      {
        name: 'New Balance',
        description: 'American multinational corporation that designs and manufactures athletic footwear',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop',
        website: 'https://newbalance.com',
        isActive: true,
        displayOrder: 16
      },
      {
        name: 'Converse',
        description: 'American shoe company that designs, distributes, and licenses sneakers',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop',
        website: 'https://converse.com',
        isActive: true,
        displayOrder: 17
      },
      {
        name: 'Vans',
        description: 'American manufacturer of skateboarding shoes and related apparel',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop',
        website: 'https://vans.com',
        isActive: true,
        displayOrder: 18
      },
      {
        name: 'Jordan',
        description: 'Brand of basketball footwear, athletic, casual, and style clothing',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop',
        website: 'https://jordan.com',
        isActive: true,
        displayOrder: 19
      },
      {
        name: 'Champion',
        description: 'American manufacturer of clothing, specializing in sportswear',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop',
        website: 'https://champion.com',
        isActive: true,
        displayOrder: 20
      },

      // Luxury Fashion Brands
      {
        name: 'Gucci',
        description: 'Italian luxury brand of fashion and leather goods',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
        website: 'https://gucci.com',
        isActive: true,
        displayOrder: 21
      },
      {
        name: 'Louis Vuitton',
        description: 'French luxury fashion house and company',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
        website: 'https://louisvuitton.com',
        isActive: true,
        displayOrder: 22
      },
      {
        name: 'Chanel',
        description: 'French luxury fashion house founded by Gabrielle Chanel',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
        website: 'https://chanel.com',
        isActive: true,
        displayOrder: 23
      },
      {
        name: 'Hermès',
        description: 'French luxury goods manufacturer established in 1837',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
        website: 'https://hermes.com',
        isActive: true,
        displayOrder: 24
      },
      {
        name: 'Prada',
        description: 'Italian luxury fashion house founded in 1913',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
        website: 'https://prada.com',
        isActive: true,
        displayOrder: 25
      },
      {
        name: 'Versace',
        description: 'Italian luxury fashion company founded by Gianni Versace',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
        website: 'https://versace.com',
        isActive: true,
        displayOrder: 26
      },
      {
        name: 'Armani',
        description: 'Italian luxury fashion house founded by Giorgio Armani',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
        website: 'https://armani.com',
        isActive: true,
        displayOrder: 27
      },
      {
        name: 'Burberry',
        description: 'British luxury fashion house founded in 1856',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
        website: 'https://burberry.com',
        isActive: true,
        displayOrder: 28
      },
      {
        name: 'Dior',
        description: 'French luxury goods company controlled by LVMH',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
        website: 'https://dior.com',
        isActive: true,
        displayOrder: 29
      },
      {
        name: 'Balenciaga',
        description: 'French luxury fashion house founded in 1917',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
        website: 'https://balenciaga.com',
        isActive: true,
        displayOrder: 30
      },

      // Automotive Brands
      {
        name: 'BMW',
        description: 'German multinational corporation which produces automobiles and motorcycles',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=200&fit=crop',
        website: 'https://bmw.com',
        isActive: true,
        displayOrder: 31
      },
      {
        name: 'Mercedes-Benz',
        description: 'German luxury automotive brand',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=200&fit=crop',
        website: 'https://mercedes-benz.com',
        isActive: true,
        displayOrder: 32
      },
      {
        name: 'Audi',
        description: 'German luxury automotive manufacturer',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=200&fit=crop',
        website: 'https://audi.com',
        isActive: true,
        displayOrder: 33
      },
      {
        name: 'Volkswagen',
        description: 'German automotive manufacturer',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=200&fit=crop',
        website: 'https://volkswagen.com',
        isActive: true,
        displayOrder: 34
      },
      {
        name: 'Toyota',
        description: 'Japanese multinational automotive manufacturer',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=200&fit=crop',
        website: 'https://toyota.com',
        isActive: true,
        displayOrder: 35
      },
      {
        name: 'Honda',
        description: 'Japanese public multinational conglomerate manufacturer',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=200&fit=crop',
        website: 'https://honda.com',
        isActive: true,
        displayOrder: 36
      },
      {
        name: 'Nissan',
        description: 'Japanese multinational automobile manufacturer',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=200&fit=crop',
        website: 'https://nissan.com',
        isActive: true,
        displayOrder: 37
      },
      {
        name: 'Hyundai',
        description: 'South Korean multinational automotive manufacturer',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=200&fit=crop',
        website: 'https://hyundai.com',
        isActive: true,
        displayOrder: 38
      },
      {
        name: 'Kia',
        description: 'South Korean multinational automotive manufacturer',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=200&fit=crop',
        website: 'https://kia.com',
        isActive: true,
        displayOrder: 39
      },
      {
        name: 'Tesla',
        description: 'American electric vehicle and clean energy company',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=200&fit=crop',
        website: 'https://tesla.com',
        isActive: true,
        displayOrder: 40
      },

      // Beauty & Cosmetics Brands
      {
        name: 'L\'Oréal',
        description: 'French personal care company headquartered in Clichy',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
        website: 'https://loreal.com',
        isActive: true,
        displayOrder: 41
      },
      {
        name: 'Estée Lauder',
        description: 'American multinational manufacturer and marketer of prestige skincare',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
        website: 'https://esteelauder.com',
        isActive: true,
        displayOrder: 42
      },
      {
        name: 'MAC Cosmetics',
        description: 'Canadian cosmetics manufacturer founded in Toronto',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
        website: 'https://maccosmetics.com',
        isActive: true,
        displayOrder: 43
      },
      {
        name: 'Clinique',
        description: 'American manufacturer of skincare, cosmetics, toiletries and fragrances',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
        website: 'https://clinique.com',
        isActive: true,
        displayOrder: 44
      },
      {
        name: 'Maybelline',
        description: 'American multinational cosmetics, skincare, perfume and personal care company',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
        website: 'https://maybelline.com',
        isActive: true,
        displayOrder: 45
      },
      {
        name: 'Revlon',
        description: 'American multinational cosmetics, skin care, fragrance, and personal care company',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
        website: 'https://revlon.com',
        isActive: true,
        displayOrder: 46
      },
      {
        name: 'CoverGirl',
        description: 'American cosmetics brand owned by Coty',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
        website: 'https://covergirl.com',
        isActive: true,
        displayOrder: 47
      },
      {
        name: 'Urban Decay',
        description: 'American cosmetics brand headquartered in Newport Beach',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
        website: 'https://urbandecay.com',
        isActive: true,
        displayOrder: 48
      },
      {
        name: 'Too Faced',
        description: 'American cosmetics company founded in 1998',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
        website: 'https://toofaced.com',
        isActive: true,
        displayOrder: 49
      },
      {
        name: 'Fenty Beauty',
        description: 'Cosmetics brand founded by Rihanna in 2017',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
        website: 'https://fentybeauty.com',
        isActive: true,
        displayOrder: 50
      },

      // Home & Furniture Brands
      {
        name: 'IKEA',
        description: 'Swedish multinational group that designs and sells ready-to-assemble furniture',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
        website: 'https://ikea.com',
        isActive: true,
        displayOrder: 51
      },
      {
        name: 'West Elm',
        description: 'American home furnishings retailer',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
        website: 'https://westelm.com',
        isActive: true,
        displayOrder: 52
      },
      {
        name: 'Crate & Barrel',
        description: 'American retail chain specializing in housewares, furniture and home decor',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
        website: 'https://crateandbarrel.com',
        isActive: true,
        displayOrder: 53
      },
      {
        name: 'Pottery Barn',
        description: 'American home furnishing store chain and e-commerce company',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
        website: 'https://potterybarn.com',
        isActive: true,
        displayOrder: 54
      },
      {
        name: 'Williams Sonoma',
        description: 'American publicly traded consumer retail company',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
        website: 'https://williams-sonoma.com',
        isActive: true,
        displayOrder: 55
      },
      {
        name: 'Restoration Hardware',
        description: 'American upscale home-furnishings company',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
        website: 'https://rh.com',
        isActive: true,
        displayOrder: 56
      },
      {
        name: 'Wayfair',
        description: 'American e-commerce company that sells furniture and home goods',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
        website: 'https://wayfair.com',
        isActive: true,
        displayOrder: 57
      },
      {
        name: 'CB2',
        description: 'American home furnishing retailer',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
        website: 'https://cb2.com',
        isActive: true,
        displayOrder: 58
      },
      {
        name: 'Article',
        description: 'Canadian online furniture retailer',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
        website: 'https://article.com',
        isActive: true,
        displayOrder: 59
      },
      {
        name: 'AllModern',
        description: 'American online retailer of modern furniture and home decor',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop',
        website: 'https://allmodern.com',
        isActive: true,
        displayOrder: 60
      },

      // Sports & Outdoor Brands
      {
        name: 'Patagonia',
        description: 'American clothing company that markets and distributes outdoor clothing',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        website: 'https://patagonia.com',
        isActive: true,
        displayOrder: 61
      },
      {
        name: 'The North Face',
        description: 'American outdoor recreation products company',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        website: 'https://thenorthface.com',
        isActive: true,
        displayOrder: 62
      },
      {
        name: 'Columbia',
        description: 'American multinational corporation that manufactures and distributes outerwear',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        website: 'https://columbia.com',
        isActive: true,
        displayOrder: 63
      },
      {
        name: 'Arc\'teryx',
        description: 'Canadian outdoor recreation company',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        website: 'https://arcteryx.com',
        isActive: true,
        displayOrder: 64
      },
      {
        name: 'Mammut',
        description: 'Swiss outdoor company that manufactures mountaineering equipment',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        website: 'https://mammut.com',
        isActive: true,
        displayOrder: 65
      },
      {
        name: 'Salomon',
        description: 'French sports equipment manufacturing company',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        website: 'https://salomon.com',
        isActive: true,
        displayOrder: 66
      },
      {
        name: 'Merrell',
        description: 'American manufacturer of hiking footwear and clothing',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        website: 'https://merrell.com',
        isActive: true,
        displayOrder: 67
      },
      {
        name: 'Timberland',
        description: 'American manufacturer and retailer of outdoors wear',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        website: 'https://timberland.com',
        isActive: true,
        displayOrder: 68
      },
      {
        name: 'Keens',
        description: 'American footwear company known for its sandals and hiking boots',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        website: 'https://keen.com',
        isActive: true,
        displayOrder: 69
      },
      {
        name: 'Osprey',
        description: 'American company that designs and manufactures backpacks',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
        website: 'https://osprey.com',
        isActive: true,
        displayOrder: 70
      },

      // Food & Beverage Brands
      {
        name: 'Coca-Cola',
        description: 'American multinational beverage corporation',
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704f6d5?w=200&h=200&fit=crop',
        website: 'https://coca-cola.com',
        isActive: true,
        displayOrder: 71
      },
      {
        name: 'Pepsi',
        description: 'American multinational food, snack, and beverage corporation',
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704f6d5?w=200&h=200&fit=crop',
        website: 'https://pepsi.com',
        isActive: true,
        displayOrder: 72
      },
      {
        name: 'Starbucks',
        description: 'American multinational chain of coffeehouses and roastery reserves',
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704f6d5?w=200&h=200&fit=crop',
        website: 'https://starbucks.com',
        isActive: true,
        displayOrder: 73
      },
      {
        name: 'McDonald\'s',
        description: 'American fast food company',
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704f6d5?w=200&h=200&fit=crop',
        website: 'https://mcdonalds.com',
        isActive: true,
        displayOrder: 74
      },
      {
        name: 'KFC',
        description: 'American fast food restaurant chain',
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704f6d5?w=200&h=200&fit=crop',
        website: 'https://kfc.com',
        isActive: true,
        displayOrder: 75
      },
      {
        name: 'Subway',
        description: 'American multinational fast food restaurant franchise',
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704f6d5?w=200&h=200&fit=crop',
        website: 'https://subway.com',
        isActive: true,
        displayOrder: 76
      },
      {
        name: 'Pizza Hut',
        description: 'American multinational restaurant chain and international franchise',
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704f6d5?w=200&h=200&fit=crop',
        website: 'https://pizzahut.com',
        isActive: true,
        displayOrder: 77
      },
      {
        name: 'Domino\'s',
        description: 'American multinational pizza restaurant chain',
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704f6d5?w=200&h=200&fit=crop',
        website: 'https://dominos.com',
        isActive: true,
        displayOrder: 78
      },
      {
        name: 'Burger King',
        description: 'American multinational chain of hamburger fast food restaurants',
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704f6d5?w=200&h=200&fit=crop',
        website: 'https://burgerking.com',
        isActive: true,
        displayOrder: 79
      },
      {
        name: 'Taco Bell',
        description: 'American chain of fast food restaurants',
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704f6d5?w=200&h=200&fit=crop',
        website: 'https://tacobell.com',
        isActive: true,
        displayOrder: 80
      },

      // Entertainment Brands
      {
        name: 'Netflix',
        description: 'American subscription streaming service and production company',
        image: 'https://images.unsplash.com/photo-1489599807906-5b9b4b4b4b4b?w=200&h=200&fit=crop',
        website: 'https://netflix.com',
        isActive: true,
        displayOrder: 81
      },
      {
        name: 'Disney',
        description: 'American multinational mass media and entertainment conglomerate',
        image: 'https://images.unsplash.com/photo-1489599807906-5b9b4b4b4b4b?w=200&h=200&fit=crop',
        website: 'https://disney.com',
        isActive: true,
        displayOrder: 82
      },
      {
        name: 'Amazon Prime',
        description: 'American subscription service offered by Amazon',
        image: 'https://images.unsplash.com/photo-1489599807906-5b9b4b4b4b4b?w=200&h=200&fit=crop',
        website: 'https://amazon.com/prime',
        isActive: true,
        displayOrder: 83
      },
      {
        name: 'HBO',
        description: 'American premium cable and satellite television network',
        image: 'https://images.unsplash.com/photo-1489599807906-5b9b4b4b4b4b?w=200&h=200&fit=crop',
        website: 'https://hbo.com',
        isActive: true,
        displayOrder: 84
      },
      {
        name: 'Spotify',
        description: 'Swedish audio streaming and media services provider',
        image: 'https://images.unsplash.com/photo-1489599807906-5b9b4b4b4b4b?w=200&h=200&fit=crop',
        website: 'https://spotify.com',
        isActive: true,
        displayOrder: 85
      },
      {
        name: 'Apple Music',
        description: 'Music and video streaming service developed by Apple',
        image: 'https://images.unsplash.com/photo-1489599807906-5b9b4b4b4b4b?w=200&h=200&fit=crop',
        website: 'https://music.apple.com',
        isActive: true,
        displayOrder: 86
      },
      {
        name: 'YouTube',
        description: 'American online video sharing and social media platform',
        image: 'https://images.unsplash.com/photo-1489599807906-5b9b4b4b4b4b?w=200&h=200&fit=crop',
        website: 'https://youtube.com',
        isActive: true,
        displayOrder: 87
      },
      {
        name: 'Twitch',
        description: 'American video live streaming service',
        image: 'https://images.unsplash.com/photo-1489599807906-5b9b4b4b4b4b?w=200&h=200&fit=crop',
        website: 'https://twitch.tv',
        isActive: true,
        displayOrder: 88
      },
      {
        name: 'TikTok',
        description: 'Chinese short-form video hosting service',
        image: 'https://images.unsplash.com/photo-1489599807906-5b9b4b4b4b4b?w=200&h=200&fit=crop',
        website: 'https://tiktok.com',
        isActive: true,
        displayOrder: 89
      },
      {
        name: 'Instagram',
        description: 'American photo and video sharing social networking service',
        image: 'https://images.unsplash.com/photo-1489599807906-5b9b4b4b4b4b?w=200&h=200&fit=crop',
        website: 'https://instagram.com',
        isActive: true,
        displayOrder: 90
      },

      // Gaming Brands
      {
        name: 'PlayStation',
        description: 'Japanese video game brand and series of video game consoles',
        image: 'https://images.unsplash.com/photo-1606144042634-9815c7b1b4b0?w=200&h=200&fit=crop',
        website: 'https://playstation.com',
        isActive: true,
        displayOrder: 91
      },
      {
        name: 'Xbox',
        description: 'Video gaming brand created and owned by Microsoft',
        image: 'https://images.unsplash.com/photo-1606144042634-9815c7b1b4b0?w=200&h=200&fit=crop',
        website: 'https://xbox.com',
        isActive: true,
        displayOrder: 92
      },
      {
        name: 'Nintendo',
        description: 'Japanese multinational video game company',
        image: 'https://images.unsplash.com/photo-1606144042634-9815c7b1b4b0?w=200&h=200&fit=crop',
        website: 'https://nintendo.com',
        isActive: true,
        displayOrder: 93
      },
      {
        name: 'Steam',
        description: 'Digital distribution service for video games',
        image: 'https://images.unsplash.com/photo-1606144042634-9815c7b1b4b0?w=200&h=200&fit=crop',
        website: 'https://store.steampowered.com',
        isActive: true,
        displayOrder: 94
      },
      {
        name: 'Epic Games',
        description: 'American video game and software developer',
        image: 'https://images.unsplash.com/photo-1606144042634-9815c7b1b4b0?w=200&h=200&fit=crop',
        website: 'https://epicgames.com',
        isActive: true,
        displayOrder: 95
      },
      {
        name: 'Ubisoft',
        description: 'French video game publisher',
        image: 'https://images.unsplash.com/photo-1606144042634-9815c7b1b4b0?w=200&h=200&fit=crop',
        website: 'https://ubisoft.com',
        isActive: true,
        displayOrder: 96
      },
      {
        name: 'Electronic Arts',
        description: 'American video game company',
        image: 'https://images.unsplash.com/photo-1606144042634-9815c7b1b4b0?w=200&h=200&fit=crop',
        website: 'https://ea.com',
        isActive: true,
        displayOrder: 97
      },
      {
        name: 'Activision',
        description: 'American video game publisher',
        image: 'https://images.unsplash.com/photo-1606144042634-9815c7b1b4b0?w=200&h=200&fit=crop',
        website: 'https://activision.com',
        isActive: true,
        displayOrder: 98
      },
      {
        name: 'Blizzard Entertainment',
        description: 'American video game developer and publisher',
        image: 'https://images.unsplash.com/photo-1606144042634-9815c7b1b4b0?w=200&h=200&fit=crop',
        website: 'https://blizzard.com',
        isActive: true,
        displayOrder: 99
      },
      {
        name: 'Riot Games',
        description: 'American video game developer and publisher',
        image: 'https://images.unsplash.com/photo-1606144042634-9815c7b1b4b0?w=200&h=200&fit=crop',
        website: 'https://riotgames.com',
        isActive: true,
        displayOrder: 100
      }
    ];

    // Insert brands
    const createdBrands = await Brand.insertMany(brandsData);
    console.log(`✅ Created ${createdBrands.length} brands`);

    // Display created brands by category
    const categories = {
      'Technology': ['Apple', 'Samsung', 'Google', 'Microsoft', 'Sony', 'LG', 'HP', 'Dell', 'ASUS', 'Lenovo'],
      'Fashion': ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Reebok', 'New Balance', 'Converse', 'Vans', 'Jordan', 'Champion'],
      'Luxury Fashion': ['Gucci', 'Louis Vuitton', 'Chanel', 'Hermès', 'Prada', 'Versace', 'Armani', 'Burberry', 'Dior', 'Balenciaga'],
      'Automotive': ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'Tesla'],
      'Beauty & Cosmetics': ['L\'Oréal', 'Estée Lauder', 'MAC Cosmetics', 'Clinique', 'Maybelline', 'Revlon', 'CoverGirl', 'Urban Decay', 'Too Faced', 'Fenty Beauty'],
      'Home & Furniture': ['IKEA', 'West Elm', 'Crate & Barrel', 'Pottery Barn', 'Williams Sonoma', 'Restoration Hardware', 'Wayfair', 'CB2', 'Article', 'AllModern'],
      'Sports & Outdoor': ['Patagonia', 'The North Face', 'Columbia', 'Arc\'teryx', 'Mammut', 'Salomon', 'Merrell', 'Timberland', 'Keens', 'Osprey'],
      'Food & Beverage': ['Coca-Cola', 'Pepsi', 'Starbucks', 'McDonald\'s', 'KFC', 'Subway', 'Pizza Hut', 'Domino\'s', 'Burger King', 'Taco Bell'],
      'Entertainment': ['Netflix', 'Disney', 'Amazon Prime', 'HBO', 'Spotify', 'Apple Music', 'YouTube', 'Twitch', 'TikTok', 'Instagram'],
      'Gaming': ['PlayStation', 'Xbox', 'Nintendo', 'Steam', 'Epic Games', 'Ubisoft', 'Electronic Arts', 'Activision', 'Blizzard Entertainment', 'Riot Games']
    };

    console.log('\n📊 Brands by Category:');
    Object.entries(categories).forEach(([category, brandNames]) => {
      const brands = createdBrands.filter(brand => brandNames.includes(brand.name));
      if (brands.length > 0) {
        console.log(`\n${category} (${brands.length}):`);
        brands.forEach(brand => {
          console.log(`  • ${brand.name}`);
        });
      }
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
seedBrandsLarge();
