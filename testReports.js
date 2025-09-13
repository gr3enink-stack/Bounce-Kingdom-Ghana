import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Report from './src/models/Report.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test report creation
const testReports = async () => {
  try {
    // Create test reports
    const testReport1 = new Report({
      type: 'revenue',
      period: 'monthly',
      date: new Date(),
      value: 4250,
      metadata: {
        currency: 'GHS',
        bookingCount: 25
      }
    });
    
    const testReport2 = new Report({
      type: 'bookings',
      period: 'monthly',
      date: new Date(),
      value: 25,
      metadata: {}
    });
    
    const testReport3 = new Report({
      type: 'equipment-utilization',
      period: 'monthly',
      date: new Date(),
      value: 85,
      metadata: {
        totalProducts: 10,
        inUseProducts: 8
      }
    });
    
    // Save reports
    const savedReport1 = await testReport1.save();
    const savedReport2 = await testReport2.save();
    const savedReport3 = await testReport3.save();
    
    console.log('Test reports created successfully:');
    console.log('- Revenue report:', savedReport1._id);
    console.log('- Bookings report:', savedReport2._id);
    console.log('- Equipment utilization report:', savedReport3._id);
    
    // Fetch all reports
    const reports = await Report.find({}).sort({ date: -1 });
    console.log('\nAll reports in database:');
    reports.forEach(report => {
      console.log(`- ${report.type}: ${report.value} (${report.period})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing reports:', error);
    process.exit(1);
  }
};

testReports();