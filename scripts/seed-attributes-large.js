const mongoose = require('mongoose');
require('dotenv').config();

const Attribute = require('../models/Attribute');

async function seedAttributesLarge() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing attributes
    await Attribute.deleteMany({});
    console.log('Cleared existing attributes');

    // Large attributes data
    const attributesData = [
      // Color Attributes
      {
        name: 'Color',
        values: [
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' },
          { value: 'green', label: 'Green' },
          { value: 'yellow', label: 'Yellow' },
          { value: 'orange', label: 'Orange' },
          { value: 'purple', label: 'Purple' },
          { value: 'pink', label: 'Pink' },
          { value: 'black', label: 'Black' },
          { value: 'white', label: 'White' },
          { value: 'gray', label: 'Gray' },
          { value: 'brown', label: 'Brown' },
          { value: 'navy', label: 'Navy' },
          { value: 'maroon', label: 'Maroon' },
          { value: 'teal', label: 'Teal' },
          { value: 'gold', label: 'Gold' },
          { value: 'silver', label: 'Silver' },
          { value: 'rose-gold', label: 'Rose Gold' },
          { value: 'copper', label: 'Copper' },
          { value: 'bronze', label: 'Bronze' },
          { value: 'platinum', label: 'Platinum' }
        ],
        isActive: true
      },

      // Size Attributes
      {
        name: 'Size',
        values: [
          { value: 'xs', label: 'Extra Small' },
          { value: 's', label: 'Small' },
          { value: 'm', label: 'Medium' },
          { value: 'l', label: 'Large' },
          { value: 'xl', label: 'Extra Large' },
          { value: 'xxl', label: '2X Large' },
          { value: 'xxxl', label: '3X Large' },
          { value: '4xl', label: '4X Large' },
          { value: '5xl', label: '5X Large' },
          { value: '6xl', label: '6X Large' }
        ],
        isActive: true
      },

      // Material Attributes
      {
        name: 'Material',
        values: [
          { value: 'cotton', label: 'Cotton' },
          { value: 'polyester', label: 'Polyester' },
          { value: 'wool', label: 'Wool' },
          { value: 'silk', label: 'Silk' },
          { value: 'leather', label: 'Leather' },
          { value: 'denim', label: 'Denim' },
          { value: 'linen', label: 'Linen' },
          { value: 'cashmere', label: 'Cashmere' },
          { value: 'alpaca', label: 'Alpaca' },
          { value: 'bamboo', label: 'Bamboo' },
          { value: 'hemp', label: 'Hemp' },
          { value: 'rayon', label: 'Rayon' },
          { value: 'spandex', label: 'Spandex' },
          { value: 'nylon', label: 'Nylon' },
          { value: 'acrylic', label: 'Acrylic' },
          { value: 'viscose', label: 'Viscose' },
          { value: 'modal', label: 'Modal' },
          { value: 'lycra', label: 'Lycra' },
          { value: 'elastane', label: 'Elastane' },
          { value: 'microfiber', label: 'Microfiber' }
        ],
        isActive: true
      },

      // Brand Attributes
      {
        name: 'Brand',
        values: [
          { value: 'apple', label: 'Apple' },
          { value: 'samsung', label: 'Samsung' },
          { value: 'nike', label: 'Nike' },
          { value: 'adidas', label: 'Adidas' },
          { value: 'sony', label: 'Sony' },
          { value: 'lg', label: 'LG' },
          { value: 'hp', label: 'HP' },
          { value: 'dell', label: 'Dell' },
          { value: 'asus', label: 'ASUS' },
          { value: 'lenovo', label: 'Lenovo' },
          { value: 'microsoft', label: 'Microsoft' },
          { value: 'google', label: 'Google' },
          { value: 'amazon', label: 'Amazon' },
          { value: 'netflix', label: 'Netflix' },
          { value: 'spotify', label: 'Spotify' },
          { value: 'uber', label: 'Uber' },
          { value: 'airbnb', label: 'Airbnb' },
          { value: 'tesla', label: 'Tesla' },
          { value: 'bmw', label: 'BMW' },
          { value: 'mercedes', label: 'Mercedes-Benz' }
        ],
        isActive: true
      },

      // Storage Capacity
      {
        name: 'Storage Capacity',
        values: [
          { value: '16gb', label: '16GB' },
          { value: '32gb', label: '32GB' },
          { value: '64gb', label: '64GB' },
          { value: '128gb', label: '128GB' },
          { value: '256gb', label: '256GB' },
          { value: '512gb', label: '512GB' },
          { value: '1tb', label: '1TB' },
          { value: '2tb', label: '2TB' },
          { value: '4tb', label: '4TB' },
          { value: '8tb', label: '8TB' },
          { value: '16tb', label: '16TB' },
          { value: '32tb', label: '32TB' }
        ],
        isActive: true
      },

      // Screen Size
      {
        name: 'Screen Size',
        values: [
          { value: '4-inch', label: '4 inch' },
          { value: '4.7-inch', label: '4.7 inch' },
          { value: '5-inch', label: '5 inch' },
          { value: '5.5-inch', label: '5.5 inch' },
          { value: '6-inch', label: '6 inch' },
          { value: '6.1-inch', label: '6.1 inch' },
          { value: '6.5-inch', label: '6.5 inch' },
          { value: '6.7-inch', label: '6.7 inch' },
          { value: '7-inch', label: '7 inch' },
          { value: '10-inch', label: '10 inch' },
          { value: '11-inch', label: '11 inch' },
          { value: '12-inch', label: '12 inch' },
          { value: '13-inch', label: '13 inch' },
          { value: '14-inch', label: '14 inch' },
          { value: '15-inch', label: '15 inch' },
          { value: '16-inch', label: '16 inch' },
          { value: '17-inch', label: '17 inch' },
          { value: '21-inch', label: '21 inch' },
          { value: '24-inch', label: '24 inch' },
          { value: '27-inch', label: '27 inch' },
          { value: '32-inch', label: '32 inch' },
          { value: '43-inch', label: '43 inch' },
          { value: '55-inch', label: '55 inch' },
          { value: '65-inch', label: '65 inch' },
          { value: '75-inch', label: '75 inch' }
        ],
        isActive: true
      },

      // Operating System
      {
        name: 'Operating System',
        values: [
          { value: 'ios', label: 'iOS' },
          { value: 'android', label: 'Android' },
          { value: 'windows', label: 'Windows' },
          { value: 'macos', label: 'macOS' },
          { value: 'linux', label: 'Linux' },
          { value: 'chrome-os', label: 'Chrome OS' },
          { value: 'ubuntu', label: 'Ubuntu' },
          { value: 'fedora', label: 'Fedora' },
          { value: 'centos', label: 'CentOS' },
          { value: 'debian', label: 'Debian' },
          { value: 'arch-linux', label: 'Arch Linux' },
          { value: 'freebsd', label: 'FreeBSD' },
          { value: 'openbsd', label: 'OpenBSD' },
          { value: 'netbsd', label: 'NetBSD' },
          { value: 'solaris', label: 'Solaris' }
        ],
        isActive: true
      },

      // Processor Type
      {
        name: 'Processor',
        values: [
          { value: 'intel-core-i3', label: 'Intel Core i3' },
          { value: 'intel-core-i5', label: 'Intel Core i5' },
          { value: 'intel-core-i7', label: 'Intel Core i7' },
          { value: 'intel-core-i9', label: 'Intel Core i9' },
          { value: 'amd-ryzen-3', label: 'AMD Ryzen 3' },
          { value: 'amd-ryzen-5', label: 'AMD Ryzen 5' },
          { value: 'amd-ryzen-7', label: 'AMD Ryzen 7' },
          { value: 'amd-ryzen-9', label: 'AMD Ryzen 9' },
          { value: 'apple-m1', label: 'Apple M1' },
          { value: 'apple-m2', label: 'Apple M2' },
          { value: 'apple-m3', label: 'Apple M3' },
          { value: 'snapdragon-8cx', label: 'Snapdragon 8cx' },
          { value: 'snapdragon-7c', label: 'Snapdragon 7c' },
          { value: 'snapdragon-6c', label: 'Snapdragon 6c' },
          { value: 'mediatek-dimensity', label: 'MediaTek Dimensity' }
        ],
        isActive: true
      },

      // RAM Memory
      {
        name: 'RAM Memory',
        values: [
          { value: '2gb', label: '2GB' },
          { value: '4gb', label: '4GB' },
          { value: '6gb', label: '6GB' },
          { value: '8gb', label: '8GB' },
          { value: '12gb', label: '12GB' },
          { value: '16gb', label: '16GB' },
          { value: '24gb', label: '24GB' },
          { value: '32gb', label: '32GB' },
          { value: '64gb', label: '64GB' },
          { value: '128gb', label: '128GB' }
        ],
        isActive: true
      },

      // Graphics Card
      {
        name: 'Graphics Card',
        values: [
          { value: 'intel-integrated', label: 'Intel Integrated' },
          { value: 'amd-integrated', label: 'AMD Integrated' },
          { value: 'nvidia-gtx-1650', label: 'NVIDIA GTX 1650' },
          { value: 'nvidia-gtx-1660', label: 'NVIDIA GTX 1660' },
          { value: 'nvidia-rtx-3050', label: 'NVIDIA RTX 3050' },
          { value: 'nvidia-rtx-3060', label: 'NVIDIA RTX 3060' },
          { value: 'nvidia-rtx-3070', label: 'NVIDIA RTX 3070' },
          { value: 'nvidia-rtx-3080', label: 'NVIDIA RTX 3080' },
          { value: 'nvidia-rtx-3090', label: 'NVIDIA RTX 3090' },
          { value: 'nvidia-rtx-4060', label: 'NVIDIA RTX 4060' },
          { value: 'nvidia-rtx-4070', label: 'NVIDIA RTX 4070' },
          { value: 'nvidia-rtx-4080', label: 'NVIDIA RTX 4080' },
          { value: 'nvidia-rtx-4090', label: 'NVIDIA RTX 4090' },
          { value: 'amd-rx-6600', label: 'AMD RX 6600' },
          { value: 'amd-rx-6700', label: 'AMD RX 6700' },
          { value: 'amd-rx-6800', label: 'AMD RX 6800' },
          { value: 'amd-rx-6900', label: 'AMD RX 6900' },
          { value: 'amd-rx-7600', label: 'AMD RX 7600' },
          { value: 'amd-rx-7700', label: 'AMD RX 7700' },
          { value: 'amd-rx-7800', label: 'AMD RX 7800' }
        ],
        isActive: true
      },

      // Connectivity
      {
        name: 'Connectivity',
        values: [
          { value: 'wifi', label: 'Wi-Fi' },
          { value: 'bluetooth', label: 'Bluetooth' },
          { value: 'ethernet', label: 'Ethernet' },
          { value: 'usb-c', label: 'USB-C' },
          { value: 'usb-a', label: 'USB-A' },
          { value: 'thunderbolt', label: 'Thunderbolt' },
          { value: 'hdmi', label: 'HDMI' },
          { value: 'displayport', label: 'DisplayPort' },
          { value: 'vga', label: 'VGA' },
          { value: 'dvi', label: 'DVI' },
          { value: 'audio-jack', label: 'Audio Jack' },
          { value: 'micro-usb', label: 'Micro USB' },
          { value: 'lightning', label: 'Lightning' },
          { value: 'wireless-charging', label: 'Wireless Charging' },
          { value: 'fast-charging', label: 'Fast Charging' }
        ],
        isActive: true
      },

      // Camera Resolution
      {
        name: 'Camera Resolution',
        values: [
          { value: '8mp', label: '8MP' },
          { value: '12mp', label: '12MP' },
          { value: '16mp', label: '16MP' },
          { value: '20mp', label: '20MP' },
          { value: '24mp', label: '24MP' },
          { value: '32mp', label: '32MP' },
          { value: '48mp', label: '48MP' },
          { value: '64mp', label: '64MP' },
          { value: '108mp', label: '108MP' },
          { value: '200mp', label: '200MP' }
        ],
        isActive: true
      },

      // Battery Capacity
      {
        name: 'Battery Capacity',
        values: [
          { value: '2000mah', label: '2000mAh' },
          { value: '2500mah', label: '2500mAh' },
          { value: '3000mah', label: '3000mAh' },
          { value: '3500mah', label: '3500mAh' },
          { value: '4000mah', label: '4000mAh' },
          { value: '4500mah', label: '4500mAh' },
          { value: '5000mah', label: '5000mAh' },
          { value: '5500mah', label: '5500mAh' },
          { value: '6000mah', label: '6000mAh' },
          { value: '7000mah', label: '7000mAh' },
          { value: '8000mah', label: '8000mAh' },
          { value: '10000mah', label: '10000mAh' }
        ],
        isActive: true
      },

      // Weight
      {
        name: 'Weight',
        values: [
          { value: 'under-100g', label: 'Under 100g' },
          { value: '100-200g', label: '100-200g' },
          { value: '200-300g', label: '200-300g' },
          { value: '300-400g', label: '300-400g' },
          { value: '400-500g', label: '400-500g' },
          { value: '500-600g', label: '500-600g' },
          { value: '600-700g', label: '600-700g' },
          { value: '700-800g', label: '700-800g' },
          { value: '800-900g', label: '800-900g' },
          { value: '900-1000g', label: '900-1000g' },
          { value: '1-1.5kg', label: '1-1.5kg' },
          { value: '1.5-2kg', label: '1.5-2kg' },
          { value: '2-3kg', label: '2-3kg' },
          { value: '3-4kg', label: '3-4kg' },
          { value: 'over-4kg', label: 'Over 4kg' }
        ],
        isActive: true
      },

      // Water Resistance
      {
        name: 'Water Resistance',
        values: [
          { value: 'ipx0', label: 'IPX0 (No protection)' },
          { value: 'ipx1', label: 'IPX1 (Drip protection)' },
          { value: 'ipx2', label: 'IPX2 (Drip protection)' },
          { value: 'ipx3', label: 'IPX3 (Spray protection)' },
          { value: 'ipx4', label: 'IPX4 (Splash protection)' },
          { value: 'ipx5', label: 'IPX5 (Water jet protection)' },
          { value: 'ipx6', label: 'IPX6 (Powerful water jet)' },
          { value: 'ipx7', label: 'IPX7 (Immersion up to 1m)' },
          { value: 'ipx8', label: 'IPX8 (Immersion beyond 1m)' },
          { value: 'ip68', label: 'IP68 (Dust and water resistant)' }
        ],
        isActive: true
      },

      // Display Type
      {
        name: 'Display Type',
        values: [
          { value: 'lcd', label: 'LCD' },
          { value: 'led', label: 'LED' },
          { value: 'oled', label: 'OLED' },
          { value: 'amoled', label: 'AMOLED' },
          { value: 'super-amoled', label: 'Super AMOLED' },
          { value: 'ips', label: 'IPS' },
          { value: 'va', label: 'VA' },
          { value: 'tn', label: 'TN' },
          { value: 'pls', label: 'PLS' },
          { value: 'quantum-dot', label: 'Quantum Dot' },
          { value: 'micro-led', label: 'Micro LED' },
          { value: 'mini-led', label: 'Mini LED' }
        ],
        isActive: true
      },

      // Resolution
      {
        name: 'Resolution',
        values: [
          { value: '720p', label: '720p (HD)' },
          { value: '1080p', label: '1080p (Full HD)' },
          { value: '1440p', label: '1440p (2K)' },
          { value: '4k', label: '4K (Ultra HD)' },
          { value: '8k', label: '8K' },
          { value: 'hd-ready', label: 'HD Ready' },
          { value: 'full-hd', label: 'Full HD' },
          { value: 'ultra-hd', label: 'Ultra HD' },
          { value: 'qhd', label: 'QHD' },
          { value: 'uhd', label: 'UHD' }
        ],
        isActive: true
      },

      // Refresh Rate
      {
        name: 'Refresh Rate',
        values: [
          { value: '60hz', label: '60Hz' },
          { value: '75hz', label: '75Hz' },
          { value: '90hz', label: '90Hz' },
          { value: '120hz', label: '120Hz' },
          { value: '144hz', label: '144Hz' },
          { value: '165hz', label: '165Hz' },
          { value: '240hz', label: '240Hz' },
          { value: '300hz', label: '300Hz' },
          { value: '360hz', label: '360Hz' }
        ],
        isActive: true
      },

      // Warranty
      {
        name: 'Warranty',
        values: [
          { value: 'no-warranty', label: 'No Warranty' },
          { value: '30-days', label: '30 Days' },
          { value: '90-days', label: '90 Days' },
          { value: '6-months', label: '6 Months' },
          { value: '1-year', label: '1 Year' },
          { value: '2-years', label: '2 Years' },
          { value: '3-years', label: '3 Years' },
          { value: '5-years', label: '5 Years' },
          { value: 'lifetime', label: 'Lifetime' }
        ],
        isActive: true
      },

      // Condition
      {
        name: 'Condition',
        values: [
          { value: 'new', label: 'New' },
          { value: 'like-new', label: 'Like New' },
          { value: 'excellent', label: 'Excellent' },
          { value: 'very-good', label: 'Very Good' },
          { value: 'good', label: 'Good' },
          { value: 'fair', label: 'Fair' },
          { value: 'poor', label: 'Poor' },
          { value: 'refurbished', label: 'Refurbished' },
          { value: 'open-box', label: 'Open Box' },
          { value: 'used', label: 'Used' }
        ],
        isActive: true
      },

      // Style
      {
        name: 'Style',
        values: [
          { value: 'casual', label: 'Casual' },
          { value: 'formal', label: 'Formal' },
          { value: 'sporty', label: 'Sporty' },
          { value: 'vintage', label: 'Vintage' },
          { value: 'modern', label: 'Modern' },
          { value: 'classic', label: 'Classic' },
          { value: 'trendy', label: 'Trendy' },
          { value: 'bohemian', label: 'Bohemian' },
          { value: 'minimalist', label: 'Minimalist' },
          { value: 'luxury', label: 'Luxury' },
          { value: 'streetwear', label: 'Streetwear' },
          { value: 'athletic', label: 'Athletic' },
          { value: 'business', label: 'Business' },
          { value: 'party', label: 'Party' },
          { value: 'wedding', label: 'Wedding' }
        ],
        isActive: true
      },

      // Gender
      {
        name: 'Gender',
        values: [
          { value: 'men', label: 'Men' },
          { value: 'women', label: 'Women' },
          { value: 'unisex', label: 'Unisex' },
          { value: 'boys', label: 'Boys' },
          { value: 'girls', label: 'Girls' },
          { value: 'baby-boys', label: 'Baby Boys' },
          { value: 'baby-girls', label: 'Baby Girls' },
          { value: 'toddler-boys', label: 'Toddler Boys' },
          { value: 'toddler-girls', label: 'Toddler Girls' }
        ],
        isActive: true
      },

      // Age Group
      {
        name: 'Age Group',
        values: [
          { value: '0-6-months', label: '0-6 Months' },
          { value: '6-12-months', label: '6-12 Months' },
          { value: '1-2-years', label: '1-2 Years' },
          { value: '2-3-years', label: '2-3 Years' },
          { value: '3-4-years', label: '3-4 Years' },
          { value: '4-5-years', label: '4-5 Years' },
          { value: '5-6-years', label: '5-6 Years' },
          { value: '6-8-years', label: '6-8 Years' },
          { value: '8-10-years', label: '8-10 Years' },
          { value: '10-12-years', label: '10-12 Years' },
          { value: '12-14-years', label: '12-14 Years' },
          { value: '14-16-years', label: '14-16 Years' },
          { value: 'adult', label: 'Adult' },
          { value: 'senior', label: 'Senior' }
        ],
        isActive: true
      },

      // Season
      {
        name: 'Season',
        values: [
          { value: 'spring', label: 'Spring' },
          { value: 'summer', label: 'Summer' },
          { value: 'fall', label: 'Fall' },
          { value: 'winter', label: 'Winter' },
          { value: 'all-season', label: 'All Season' },
          { value: 'year-round', label: 'Year Round' }
        ],
        isActive: true
      },

      // Occasion
      {
        name: 'Occasion',
        values: [
          { value: 'everyday', label: 'Everyday' },
          { value: 'work', label: 'Work' },
          { value: 'party', label: 'Party' },
          { value: 'wedding', label: 'Wedding' },
          { value: 'formal', label: 'Formal' },
          { value: 'casual', label: 'Casual' },
          { value: 'sports', label: 'Sports' },
          { value: 'travel', label: 'Travel' },
          { value: 'vacation', label: 'Vacation' },
          { value: 'date', label: 'Date' },
          { value: 'business', label: 'Business' },
          { value: 'interview', label: 'Interview' },
          { value: 'graduation', label: 'Graduation' },
          { value: 'prom', label: 'Prom' },
          { value: 'holiday', label: 'Holiday' }
        ],
        isActive: true
      },

      // Pattern
      {
        name: 'Pattern',
        values: [
          { value: 'solid', label: 'Solid' },
          { value: 'striped', label: 'Striped' },
          { value: 'polka-dot', label: 'Polka Dot' },
          { value: 'floral', label: 'Floral' },
          { value: 'geometric', label: 'Geometric' },
          { value: 'abstract', label: 'Abstract' },
          { value: 'animal-print', label: 'Animal Print' },
          { value: 'plaid', label: 'Plaid' },
          { value: 'checkered', label: 'Checkered' },
          { value: 'houndstooth', label: 'Houndstooth' },
          { value: 'paisley', label: 'Paisley' },
          { value: 'chevron', label: 'Chevron' },
          { value: 'herringbone', label: 'Herringbone' },
          { value: 'tartan', label: 'Tartan' },
          { value: 'damask', label: 'Damask' }
        ],
        isActive: true
      },

      // Fit
      {
        name: 'Fit',
        values: [
          { value: 'slim', label: 'Slim' },
          { value: 'regular', label: 'Regular' },
          { value: 'loose', label: 'Loose' },
          { value: 'tight', label: 'Tight' },
          { value: 'relaxed', label: 'Relaxed' },
          { value: 'oversized', label: 'Oversized' },
          { value: 'fitted', label: 'Fitted' },
          { value: 'straight', label: 'Straight' },
          { value: 'tapered', label: 'Tapered' },
          { value: 'wide', label: 'Wide' },
          { value: 'narrow', label: 'Narrow' },
          { value: 'standard', label: 'Standard' }
        ],
        isActive: true
      },

      // Closure Type
      {
        name: 'Closure Type',
        values: [
          { value: 'zipper', label: 'Zipper' },
          { value: 'buttons', label: 'Buttons' },
          { value: 'snaps', label: 'Snaps' },
          { value: 'velcro', label: 'Velcro' },
          { value: 'hook-and-loop', label: 'Hook and Loop' },
          { value: 'elastic', label: 'Elastic' },
          { value: 'drawstring', label: 'Drawstring' },
          { value: 'belt', label: 'Belt' },
          { value: 'tie', label: 'Tie' },
          { value: 'magnetic', label: 'Magnetic' },
          { value: 'buckle', label: 'Buckle' },
          { value: 'lacing', label: 'Lacing' }
        ],
        isActive: true
      },

      // Care Instructions
      {
        name: 'Care Instructions',
        values: [
          { value: 'machine-wash', label: 'Machine Wash' },
          { value: 'hand-wash', label: 'Hand Wash' },
          { value: 'dry-clean', label: 'Dry Clean Only' },
          { value: 'spot-clean', label: 'Spot Clean Only' },
          { value: 'no-wash', label: 'Do Not Wash' },
          { value: 'cold-water', label: 'Cold Water' },
          { value: 'warm-water', label: 'Warm Water' },
          { value: 'hot-water', label: 'Hot Water' },
          { value: 'tumble-dry', label: 'Tumble Dry' },
          { value: 'air-dry', label: 'Air Dry' },
          { value: 'line-dry', label: 'Line Dry' },
          { value: 'flat-dry', label: 'Flat Dry' },
          { value: 'iron', label: 'Iron' },
          { value: 'no-iron', label: 'Do Not Iron' },
          { value: 'bleach', label: 'Bleach' },
          { value: 'no-bleach', label: 'Do Not Bleach' }
        ],
        isActive: true
      },

      // Country of Origin
      {
        name: 'Country of Origin',
        values: [
          { value: 'usa', label: 'United States' },
          { value: 'china', label: 'China' },
          { value: 'japan', label: 'Japan' },
          { value: 'south-korea', label: 'South Korea' },
          { value: 'germany', label: 'Germany' },
          { value: 'italy', label: 'Italy' },
          { value: 'france', label: 'France' },
          { value: 'united-kingdom', label: 'United Kingdom' },
          { value: 'canada', label: 'Canada' },
          { value: 'australia', label: 'Australia' },
          { value: 'india', label: 'India' },
          { value: 'brazil', label: 'Brazil' },
          { value: 'mexico', label: 'Mexico' },
          { value: 'taiwan', label: 'Taiwan' },
          { value: 'vietnam', label: 'Vietnam' },
          { value: 'thailand', label: 'Thailand' },
          { value: 'indonesia', label: 'Indonesia' },
          { value: 'malaysia', label: 'Malaysia' },
          { value: 'philippines', label: 'Philippines' },
          { value: 'singapore', label: 'Singapore' }
        ],
        isActive: true
      },

      // Certification
      {
        name: 'Certification',
        values: [
          { value: 'fcc', label: 'FCC Certified' },
          { value: 'ce', label: 'CE Certified' },
          { value: 'ul', label: 'UL Listed' },
          { value: 'rohs', label: 'RoHS Compliant' },
          { value: 'energy-star', label: 'Energy Star' },
          { value: 'bluetooth', label: 'Bluetooth Certified' },
          { value: 'wifi', label: 'Wi-Fi Certified' },
          { value: 'usb', label: 'USB Certified' },
          { value: 'hdmi', label: 'HDMI Certified' },
          { value: 'thunderbolt', label: 'Thunderbolt Certified' },
          { value: 'apple-mfi', label: 'Apple MFi Certified' },
          { value: 'google-certified', label: 'Google Certified' },
          { value: 'microsoft-certified', label: 'Microsoft Certified' },
          { value: 'intel-certified', label: 'Intel Certified' },
          { value: 'amd-certified', label: 'AMD Certified' }
        ],
        isActive: true
      }
    ];

    // Insert attributes
    const createdAttributes = await Attribute.insertMany(attributesData);
    console.log(`✅ Created ${createdAttributes.length} attributes`);

    // Display created attributes by category
    const categories = {
      'Visual': ['Color', 'Pattern', 'Style'],
      'Physical': ['Size', 'Weight', 'Material', 'Fit'],
      'Technical': ['Storage Capacity', 'Screen Size', 'Operating System', 'Processor', 'RAM Memory', 'Graphics Card', 'Connectivity', 'Camera Resolution', 'Battery Capacity', 'Water Resistance', 'Display Type', 'Resolution', 'Refresh Rate'],
      'Product Info': ['Brand', 'Condition', 'Warranty', 'Country of Origin', 'Certification'],
      'User Specific': ['Gender', 'Age Group', 'Season', 'Occasion'],
      'Care': ['Care Instructions', 'Closure Type']
    };

    console.log('\n📊 Attributes by Category:');
    Object.entries(categories).forEach(([category, attributeNames]) => {
      const attrs = createdAttributes.filter(attr => attributeNames.includes(attr.name));
      if (attrs.length > 0) {
        console.log(`\n${category} (${attrs.length}):`);
        attrs.forEach(attr => {
          console.log(`  • ${attr.name} (${attr.values.length} values)`);
        });
      }
    });

    console.log(`\n📈 Total Values: ${createdAttributes.reduce((sum, attr) => sum + attr.values.length, 0)}`);

  } catch (error) {
    console.error('❌ Error seeding attributes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding
seedAttributesLarge();
