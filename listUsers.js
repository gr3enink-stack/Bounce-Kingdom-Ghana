import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// List all users
const listUsers = async () => {
  try {
    const users = await User.find({});
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error listing users:', error);
    process.exit(1);
  }
};

listUsers();