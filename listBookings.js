import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Booking from './src/models/Booking.js';
import { formatCurrency } from './src/utils/currency.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// List all bookings
const listBookings = async () => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    console.log('Bookings in database:');
    if (bookings.length === 0) {
      console.log('No bookings found in database');
    } else {
      bookings.forEach(booking => {
        console.log(`- ID: ${booking._id}, Booking ID: ${booking.bookingId}, Customer: ${booking.customer.name}, Date: ${booking.date}`);
        console.log(`  Status: ${booking.status}, Total Amount: ${formatCurrency(booking.totalAmount)}`);
      });
    }
    process.exit(0);
  } catch (error) {
    console.error('Error listing bookings:', error);
    process.exit(1);
  }
};

listBookings();