import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// List all products
const listProducts = async () => {
  try {
    const products = await Product.find({});
    console.log('Products in database:');
    products.forEach(product => {
      console.log(`- ID: ${product._id}, Name: ${product.name}, Product ID: ${product.productId}`);
      console.log(`  Structure: ${JSON.stringify(product, null, 2)}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error listing products:', error);
    process.exit(1);
  }
};

listProducts();