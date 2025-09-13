const mongoose = require('mongoose');
require('dotenv').config();

// Import models and initialization functions
const Product = require('./src/models/Product.js').default;
const User = require('./src/models/User.js').default;
const { initializeDatabase } = require('./src/config/initializeDB.js');

const initDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Run database initialization
    console.log('Initializing database with default data...');
    await initializeDatabase();
    
    // Verify the initialization
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log(`\n📊 Database initialization results:`);
    console.log(`   Products: ${productCount}`);
    console.log(`   Users: ${userCount}`);
    
    if (productCount > 0) {
      console.log('✅ Products successfully initialized!');
    } else {
      console.log('⚠️  No products found after initialization');
    }
    
    if (userCount > 0) {
      const adminUser = await User.findOne({ username: 'admin' });
      if (adminUser) {
        console.log('✅ Default admin user successfully created!');
        console.log(`   Login with: ${adminUser.username} / admin123`);
      } else {
        console.log('⚠️  Admin user not found after initialization');
      }
    } else {
      console.log('⚠️  No users found after initialization');
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

initDatabase();