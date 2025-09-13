import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Activity from './src/models/Activity.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test activity creation
const testActivities = async () => {
  try {
    // Create test activities
    const testActivity1 = new Activity({
      action: 'New booking created',
      user: 'Admin',
      details: {
        bookingId: 'BK-2025-001234',
        customer: 'John Doe'
      }
    });
    
    const testActivity2 = new Activity({
      action: 'Product maintenance completed',
      user: 'Admin',
      details: {
        productId: 1,
        productName: 'The Pirate Ship Bounce House'
      }
    });
    
    const testActivity3 = new Activity({
      action: 'Payment received',
      user: 'System',
      details: {
        amount: 150,
        currency: 'GHS'
      }
    });
    
    const testActivity4 = new Activity({
      action: 'Booking confirmed',
      user: 'Admin',
      details: {
        bookingId: 'BK-2025-001235',
        customer: 'Jane Smith'
      }
    });
    
    // Save activities
    const savedActivity1 = await testActivity1.save();
    const savedActivity2 = await testActivity2.save();
    const savedActivity3 = await testActivity3.save();
    const savedActivity4 = await testActivity4.save();
    
    console.log('Test activities created successfully:');
    console.log('- Booking activity:', savedActivity1._id);
    console.log('- Maintenance activity:', savedActivity2._id);
    console.log('- Payment activity:', savedActivity3._id);
    console.log('- Confirmation activity:', savedActivity4._id);
    
    // Fetch all activities
    const activities = await Activity.find({}).sort({ timestamp: -1 });
    console.log('\nAll activities in database:');
    activities.forEach(activity => {
      console.log(`- ${activity.action} by ${activity.user} (${activity.timestamp})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing activities:', error);
    process.exit(1);
  }
};

testActivities();