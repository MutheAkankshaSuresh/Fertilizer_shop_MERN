const mongoose = require('mongoose');
const Product = require('../models/Product');  // Import the Product model
require('dotenv').config();  // Load .env variables

// Initial 9 fertilizer products (as per requirements)
const initialProducts = [
  {
    name: 'Urea',
    brand: 'IFFCO',
    category: 'Nitrogen',
    price: 250,
    unit: '50kg',
    description: 'High-nitrogen fertilizer used for cotton, paddy, and wheat crops.',
    tags: ['cotton', 'paddy', 'wheat', 'kharif'],
    stock: true,
    image: 'https://images.unsplash.com/photo-1589924691995-b681cc95e7e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'  // Placeholder farm/fertilizer image
  },
  {
    name: 'Mahadhan (DAP/NPK)',
    brand: 'Mahadhan',
    category: 'Phosphatic',
    price: 1200,
    unit: '50kg',
    description: 'Diammonium phosphate (DAP) and NPK mix, ideal for sugarcane and cotton.',
    tags: ['sugarcane', 'cotton', 'rabi'],
    stock: true,
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d6942ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'IFFCO DAP/NPK Mix',
    brand: 'IFFCO',
    category: 'Complex',
    price: 1300,
    unit: '50kg',
    description: 'Complex fertilizer blend suitable for paddy and pulses.',
    tags: ['paddy', 'pulses', 'kharif'],
    stock: false,  // Out of stock example
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Bio-fertilizer (Rhizobium)',
    brand: 'Organic',
    category: 'Organic',
    price: 300,
    unit: '1kg',
    description: 'Organic bio-fertilizer with Rhizobium for pulses and vegetables.',
    tags: ['pulses', 'vegetables', 'organic'],
    stock: true,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Potassium Sulphate (SOP) 00:00:50',
    brand: 'Generic',
    category: 'Potassic',
    price: 800,
    unit: '25kg',
    description: 'Sulphate of potash (SOP) for fruits, vegetables, and cotton.',
    tags: ['fruits', 'vegetables', 'cotton', 'summer'],
    stock: true,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7e87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Single Super Phosphate (SSP)',
    brand: 'Generic',
    category: 'Phosphatic',
    price: 400,
    unit: '50kg',
    description: 'Phosphatic fertilizer for oilseeds and pulses.',
    tags: ['oilseeds', 'pulses', 'rabi'],
    stock: false,  // Out of stock example
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d6942ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Zinc Sulphate',
    brand: 'Micronutrient',
    category: 'Micronutrient',
    price: 150,
    unit: '5kg',
    description: 'Micronutrient fertilizer for paddy and maize crops.',
    tags: ['paddy', 'maize', 'kharif'],
    stock: true,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'NPK 20:20:0:13 (Sulphur enriched)',
    brand: 'Generic',
    category: 'Balanced',
    price: 900,
    unit: '50kg',
    description: 'Sulphur-enriched NPK fertilizer for cotton and sugarcane.',
    tags: ['cotton', 'sugarcane', 'summer'],
    stock: true,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7e87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Vermicompost',
    brand: 'Organic',
    category: 'Organic',
    price: 200,
    unit: '25kg',
    description: 'Organic vermicompost for vegetables and fruits.',
    tags: ['vegetables', 'fruits', 'organic'],
    stock: true,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing products (optional - comment out if you want to append)
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Insert initial products
    await Product.insertMany(initialProducts);
    console.log(`✅ Seeded ${initialProducts.length} products successfully!`);

    // Close connection
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();


