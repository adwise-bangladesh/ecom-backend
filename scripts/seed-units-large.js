const mongoose = require('mongoose');
require('dotenv').config();

const Unit = require('../models/Unit');

async function seedUnitsLarge() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing units
    await Unit.deleteMany({});
    console.log('Cleared existing units');

    // Large units data
    const unitsData = [
      // Weight Units
      { name: 'Kilogram', symbol: 'kg', isActive: true },
      { name: 'Gram', symbol: 'g', isActive: true },
      { name: 'Pound', symbol: 'lb', isActive: true },
      { name: 'Ounce', symbol: 'oz', isActive: true },
      { name: 'Ton', symbol: 't', isActive: true },
      { name: 'Stone', symbol: 'st', isActive: true },
      { name: 'Milligram', symbol: 'mg', isActive: true },
      { name: 'Microgram', symbol: 'μg', isActive: true },
      { name: 'Carat', symbol: 'ct', isActive: true },
      { name: 'Troy Ounce', symbol: 'ozt', isActive: true },

      // Length Units
      { name: 'Meter', symbol: 'm', isActive: true },
      { name: 'Centimeter', symbol: 'cm', isActive: true },
      { name: 'Millimeter', symbol: 'mm', isActive: true },
      { name: 'Kilometer', symbol: 'km', isActive: true },
      { name: 'Inch', symbol: 'in', isActive: true },
      { name: 'Foot', symbol: 'ft', isActive: true },
      { name: 'Yard', symbol: 'yd', isActive: true },
      { name: 'Mile', symbol: 'mi', isActive: true },
      { name: 'Micrometer', symbol: 'μm', isActive: true },
      { name: 'Nanometer', symbol: 'nm', isActive: true },

      // Volume Units
      { name: 'Liter', symbol: 'L', isActive: true },
      { name: 'Milliliter', symbol: 'ml', isActive: true },
      { name: 'Gallon', symbol: 'gal', isActive: true },
      { name: 'Quart', symbol: 'qt', isActive: true },
      { name: 'Pint', symbol: 'pt', isActive: true },
      { name: 'Cup', symbol: 'cup', isActive: true },
      { name: 'Fluid Ounce', symbol: 'fl oz', isActive: true },
      { name: 'Tablespoon', symbol: 'tbsp', isActive: true },
      { name: 'Teaspoon', symbol: 'tsp', isActive: true },
      { name: 'Cubic Meter', symbol: 'm³', isActive: true },

      // Area Units
      { name: 'Square Meter', symbol: 'm²', isActive: true },
      { name: 'Square Centimeter', symbol: 'cm²', isActive: true },
      { name: 'Square Kilometer', symbol: 'km²', isActive: true },
      { name: 'Square Inch', symbol: 'in²', isActive: true },
      { name: 'Square Foot', symbol: 'ft²', isActive: true },
      { name: 'Square Yard', symbol: 'yd²', isActive: true },
      { name: 'Acre', symbol: 'ac', isActive: true },
      { name: 'Hectare', symbol: 'ha', isActive: true },
      { name: 'Square Mile', symbol: 'mi²', isActive: true },
      { name: 'Square Millimeter', symbol: 'mm²', isActive: true },

      // Temperature Units
      { name: 'Celsius', symbol: '°C', isActive: true },
      { name: 'Fahrenheit', symbol: '°F', isActive: true },
      { name: 'Kelvin', symbol: 'K', isActive: true },
      { name: 'Rankine', symbol: '°R', isActive: true },

      // Time Units
      { name: 'Second', symbol: 's', isActive: true },
      { name: 'Minute', symbol: 'min', isActive: true },
      { name: 'Hour', symbol: 'h', isActive: true },
      { name: 'Day', symbol: 'd', isActive: true },
      { name: 'Week', symbol: 'wk', isActive: true },
      { name: 'Month', symbol: 'mo', isActive: true },
      { name: 'Year', symbol: 'yr', isActive: true },
      { name: 'Millisecond', symbol: 'ms', isActive: true },
      { name: 'Microsecond', symbol: 'μs', isActive: true },
      { name: 'Nanosecond', symbol: 'ns', isActive: true },

      // Electrical Units
      { name: 'Ampere', symbol: 'A', isActive: true },
      { name: 'Volt', symbol: 'V', isActive: true },
      { name: 'Watt', symbol: 'W', isActive: true },
      { name: 'Ohm', symbol: 'Ω', isActive: true },
      { name: 'Farad', symbol: 'F', isActive: true },
      { name: 'Henry', symbol: 'H', isActive: true },
      { name: 'Coulomb', symbol: 'C', isActive: true },
      { name: 'Joule', symbol: 'J', isActive: true },
      { name: 'Kilowatt Hour', symbol: 'kWh', isActive: true },
      { name: 'Megawatt', symbol: 'MW', isActive: true },

      // Pressure Units
      { name: 'Pascal', symbol: 'Pa', isActive: true },
      { name: 'Bar', symbol: 'bar', isActive: true },
      { name: 'Atmosphere', symbol: 'atm', isActive: true },
      { name: 'Pound per Square Inch', symbol: 'psi', isActive: true },
      { name: 'Torr', symbol: 'Torr', isActive: true },
      { name: 'Millibar', symbol: 'mbar', isActive: true },
      { name: 'Kilopascal', symbol: 'kPa', isActive: true },
      { name: 'Megapascal', symbol: 'MPa', isActive: true },

      // Energy Units
      { name: 'Calorie', symbol: 'cal', isActive: true },
      { name: 'Kilocalorie', symbol: 'kcal', isActive: true },
      { name: 'British Thermal Unit', symbol: 'BTU', isActive: true },
      { name: 'Therm', symbol: 'thm', isActive: true },
      { name: 'Electron Volt', symbol: 'eV', isActive: true },
      { name: 'Foot Pound', symbol: 'ft⋅lbf', isActive: true },

      // Frequency Units
      { name: 'Hertz', symbol: 'Hz', isActive: true },
      { name: 'Kilohertz', symbol: 'kHz', isActive: true },
      { name: 'Megahertz', symbol: 'MHz', isActive: true },
      { name: 'Gigahertz', symbol: 'GHz', isActive: true },
      { name: 'Terahertz', symbol: 'THz', isActive: true },

      // Data Storage Units
      { name: 'Byte', symbol: 'B', isActive: true },
      { name: 'Kilobyte', symbol: 'KB', isActive: true },
      { name: 'Megabyte', symbol: 'MB', isActive: true },
      { name: 'Gigabyte', symbol: 'GB', isActive: true },
      { name: 'Terabyte', symbol: 'TB', isActive: true },
      { name: 'Petabyte', symbol: 'PB', isActive: true },
      { name: 'Exabyte', symbol: 'EB', isActive: true },
      { name: 'Zettabyte', symbol: 'ZB', isActive: true },
      { name: 'Yottabyte', symbol: 'YB', isActive: true },

      // Speed Units
      { name: 'Meter per Second', symbol: 'm/s', isActive: true },
      { name: 'Kilometer per Hour', symbol: 'km/h', isActive: true },
      { name: 'Mile per Hour', symbol: 'mph', isActive: true },
      { name: 'Foot per Second', symbol: 'ft/s', isActive: true },
      { name: 'Knot', symbol: 'kn', isActive: true },
      { name: 'Mach', symbol: 'Ma', isActive: true },

      // Force Units
      { name: 'Newton', symbol: 'N', isActive: true },
      { name: 'Dyne', symbol: 'dyn', isActive: true },
      { name: 'Pound Force', symbol: 'lbf', isActive: true },
      { name: 'Kilogram Force', symbol: 'kgf', isActive: true },
      { name: 'Poundal', symbol: 'pdl', isActive: true },

      // Power Units
      { name: 'Horsepower', symbol: 'hp', isActive: true },
      { name: 'Metric Horsepower', symbol: 'PS', isActive: true },
      { name: 'Foot Pound per Second', symbol: 'ft⋅lbf/s', isActive: true },
      { name: 'Kilowatt', symbol: 'kW', isActive: true },
      { name: 'Megawatt', symbol: 'MW', isActive: true },

      // Angle Units
      { name: 'Degree', symbol: '°', isActive: true },
      { name: 'Radian', symbol: 'rad', isActive: true },
      { name: 'Gradian', symbol: 'grad', isActive: true },
      { name: 'Minute of Arc', symbol: 'arcmin', isActive: true },
      { name: 'Second of Arc', symbol: 'arcsec', isActive: true },

      // Luminous Intensity
      { name: 'Candela', symbol: 'cd', isActive: true },
      { name: 'Lumen', symbol: 'lm', isActive: true },
      { name: 'Lux', symbol: 'lx', isActive: true },
      { name: 'Foot Candle', symbol: 'fc', isActive: true },

      // Radioactivity
      { name: 'Becquerel', symbol: 'Bq', isActive: true },
      { name: 'Curie', symbol: 'Ci', isActive: true },
      { name: 'Gray', symbol: 'Gy', isActive: true },
      { name: 'Sievert', symbol: 'Sv', isActive: true },
      { name: 'Rem', symbol: 'rem', isActive: true },

      // Viscosity
      { name: 'Pascal Second', symbol: 'Pa⋅s', isActive: true },
      { name: 'Poise', symbol: 'P', isActive: true },
      { name: 'Centipoise', symbol: 'cP', isActive: true },
      { name: 'Stokes', symbol: 'St', isActive: true },

      // Concentration
      { name: 'Mole per Liter', symbol: 'mol/L', isActive: true },
      { name: 'Parts per Million', symbol: 'ppm', isActive: true },
      { name: 'Parts per Billion', symbol: 'ppb', isActive: true },
      { name: 'Percentage', symbol: '%', isActive: true },
      { name: 'Parts per Trillion', symbol: 'ppt', isActive: true },

      // Currency (Common ones)
      { name: 'US Dollar', symbol: 'USD', isActive: true },
      { name: 'Euro', symbol: 'EUR', isActive: true },
      { name: 'British Pound', symbol: 'GBP', isActive: true },
      { name: 'Japanese Yen', symbol: 'JPY', isActive: true },
      { name: 'Canadian Dollar', symbol: 'CAD', isActive: true },
      { name: 'Australian Dollar', symbol: 'AUD', isActive: true },
      { name: 'Swiss Franc', symbol: 'CHF', isActive: true },
      { name: 'Chinese Yuan', symbol: 'CNY', isActive: true },
      { name: 'Indian Rupee', symbol: 'INR', isActive: true },
      { name: 'Brazilian Real', symbol: 'BRL', isActive: true },

      // Miscellaneous
      { name: 'Piece', symbol: 'pcs', isActive: true },
      { name: 'Set', symbol: 'set', isActive: true },
      { name: 'Pair', symbol: 'pair', isActive: true },
      { name: 'Dozen', symbol: 'doz', isActive: true },
      { name: 'Gross', symbol: 'gr', isActive: true },
      { name: 'Ream', symbol: 'ream', isActive: true },
      { name: 'Bundle', symbol: 'bundle', isActive: true },
      { name: 'Pack', symbol: 'pack', isActive: true },
      { name: 'Box', symbol: 'box', isActive: true },
      { name: 'Case', symbol: 'case', isActive: true }
    ];

    // Insert units
    const createdUnits = await Unit.insertMany(unitsData);
    console.log(`✅ Created ${createdUnits.length} units`);

    // Display created units by category
    const categories = {
      'Weight': createdUnits.filter(u => ['kg', 'g', 'lb', 'oz', 't', 'st', 'mg', 'μg', 'ct', 'ozt'].includes(u.symbol)),
      'Length': createdUnits.filter(u => ['m', 'cm', 'mm', 'km', 'in', 'ft', 'yd', 'mi', 'μm', 'nm'].includes(u.symbol)),
      'Volume': createdUnits.filter(u => ['L', 'ml', 'gal', 'qt', 'pt', 'cup', 'fl oz', 'tbsp', 'tsp', 'm³'].includes(u.symbol)),
      'Area': createdUnits.filter(u => ['m²', 'cm²', 'km²', 'in²', 'ft²', 'yd²', 'ac', 'ha', 'mi²', 'mm²'].includes(u.symbol)),
      'Temperature': createdUnits.filter(u => ['°C', '°F', 'K', '°R'].includes(u.symbol)),
      'Time': createdUnits.filter(u => ['s', 'min', 'h', 'd', 'wk', 'mo', 'yr', 'ms', 'μs', 'ns'].includes(u.symbol)),
      'Electrical': createdUnits.filter(u => ['A', 'V', 'W', 'Ω', 'F', 'H', 'C', 'J', 'kWh', 'MW'].includes(u.symbol)),
      'Pressure': createdUnits.filter(u => ['Pa', 'bar', 'atm', 'psi', 'Torr', 'mbar', 'kPa', 'MPa'].includes(u.symbol)),
      'Energy': createdUnits.filter(u => ['cal', 'kcal', 'BTU', 'thm', 'eV', 'ft⋅lbf'].includes(u.symbol)),
      'Frequency': createdUnits.filter(u => ['Hz', 'kHz', 'MHz', 'GHz', 'THz'].includes(u.symbol)),
      'Data Storage': createdUnits.filter(u => ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'].includes(u.symbol)),
      'Speed': createdUnits.filter(u => ['m/s', 'km/h', 'mph', 'ft/s', 'kn', 'Ma'].includes(u.symbol)),
      'Force': createdUnits.filter(u => ['N', 'dyn', 'lbf', 'kgf', 'pdl'].includes(u.symbol)),
      'Power': createdUnits.filter(u => ['hp', 'PS', 'ft⋅lbf/s', 'kW', 'MW'].includes(u.symbol)),
      'Angle': createdUnits.filter(u => ['°', 'rad', 'grad', 'arcmin', 'arcsec'].includes(u.symbol)),
      'Luminous': createdUnits.filter(u => ['cd', 'lm', 'lx', 'fc'].includes(u.symbol)),
      'Radioactivity': createdUnits.filter(u => ['Bq', 'Ci', 'Gy', 'Sv', 'rem'].includes(u.symbol)),
      'Viscosity': createdUnits.filter(u => ['Pa⋅s', 'P', 'cP', 'St'].includes(u.symbol)),
      'Concentration': createdUnits.filter(u => ['mol/L', 'ppm', 'ppb', '%', 'ppt'].includes(u.symbol)),
      'Currency': createdUnits.filter(u => ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL'].includes(u.symbol)),
      'Miscellaneous': createdUnits.filter(u => ['pcs', 'set', 'pair', 'doz', 'gr', 'ream', 'bundle', 'pack', 'box', 'case'].includes(u.symbol))
    };

    console.log('\n📊 Units by Category:');
    Object.entries(categories).forEach(([category, units]) => {
      if (units.length > 0) {
        console.log(`\n${category} (${units.length}):`);
        units.forEach(unit => {
          console.log(`  • ${unit.name} (${unit.symbol})`);
        });
      }
    });

  } catch (error) {
    console.error('❌ Error seeding units:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding
seedUnitsLarge();
