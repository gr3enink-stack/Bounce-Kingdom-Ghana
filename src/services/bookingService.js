import Booking from '../models/Booking.js';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Mock data for browser environment
let mockBookings = [];

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    console.log('Creating booking with data:', bookingData);
    
    // In browser environment, return mock data
    if (isBrowser) {
      console.log('Running in browser environment, returning mock booking');
      const mockBooking = {
        ...bookingData,
        _id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to mock bookings array
      mockBookings.push(mockBooking);
      return mockBooking;
    }
    
    // Validate required fields
    if (!bookingData.bookingId) {
      throw new Error('Booking ID is required');
    }
    
    if (!bookingData.customer || !bookingData.customer.name || !bookingData.customer.phone || !bookingData.customer.email) {
      throw new Error('Customer information is incomplete');
    }
    
    if (!bookingData.product || !bookingData.product.id || !bookingData.product.name) {
      throw new Error('Product information is incomplete');
    }
    
    if (!bookingData.date) {
      throw new Error('Booking date is required');
    }
    
    if (!bookingData.totalAmount) {
      throw new Error('Total amount is required');
    }
    
    // Create a new Booking instance from the provided data
    const booking = new Booking(bookingData);
    console.log('Booking instance created:', booking);
    console.log('Booking instance type:', typeof booking);
    console.log('Booking constructor:', booking.constructor.name);
    console.log('Booking has save method:', typeof booking.save);
    
    // Check if booking has save method before calling it
    if (typeof booking.save !== 'function') {
      // Try alternative approach using Booking.create
      console.log('Using Booking.create instead of new Booking() + save()');
      const savedBooking = await Booking.create(bookingData);
      console.log('Booking created successfully:', savedBooking._id);
      return savedBooking;
    }
    
    const savedBooking = await booking.save();
    console.log('Booking saved successfully:', savedBooking._id);
    return savedBooking;
  } catch (error) {
    console.error('Error creating booking:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // More detailed error handling
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      throw new Error(`Validation error: ${validationErrors.join(', ')}`);
    } else if (error.name === 'MongoError' || error.name === 'BulkWriteError') {
      throw new Error(`Database error: ${error.message}`);
    } else {
      throw new Error(`Error creating booking: ${error.message}`);
    }
  }
};

// Get all bookings
export const getAllBookings = async () => {
  try {
    // In browser environment, return mock data
    if (isBrowser) {
      console.log('Running in browser environment, returning mock bookings');
      return mockBookings;
    }
    
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw new Error(`Error fetching bookings: ${error.message}`);
  }
};

// Get booking by ID
export const getBookingById = async (id) => {
  try {
    // In browser environment, return mock data
    if (isBrowser) {
      console.log('Running in browser environment, returning mock booking by ID');
      const booking = mockBookings.find(b => b._id === id);
      if (!booking) {
        throw new Error('Booking not found');
      }
      return booking;
    }
    
    const booking = await Booking.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  } catch (error) {
    console.error(`Error fetching booking with id ${id}:`, error);
    throw new Error(`Error fetching booking: ${error.message}`);
  }
};

// Update booking
export const updateBooking = async (id, updateData) => {
  try {
    // In browser environment, return mock data
    if (isBrowser) {
      console.log('Running in browser environment, updating mock booking');
      const bookingIndex = mockBookings.findIndex(b => b._id === id);
      if (bookingIndex === -1) {
        throw new Error('Booking not found');
      }
      
      mockBookings[bookingIndex] = {
        ...mockBookings[bookingIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      return mockBookings[bookingIndex];
    }
    
    // Remove any fields that shouldn't be updated directly
    const { _id, __v, createdAt, ...updateFields } = updateData;
    
    const booking = await Booking.findByIdAndUpdate(
      id, 
      { $set: updateFields }, 
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  } catch (error) {
    console.error(`Error updating booking with id ${id}:`, error);
    throw new Error(`Error updating booking: ${error.message}`);
  }
};

// Delete booking
export const deleteBooking = async (id) => {
  try {
    // In browser environment, return mock data
    if (isBrowser) {
      console.log('Running in browser environment, deleting mock booking');
      const bookingIndex = mockBookings.findIndex(b => b._id === id);
      if (bookingIndex === -1) {
        throw new Error('Booking not found');
      }
      
      const deletedBooking = mockBookings[bookingIndex];
      mockBookings.splice(bookingIndex, 1);
      return deletedBooking;
    }
    
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  } catch (error) {
    console.error(`Error deleting booking with id ${id}:`, error);
    throw new Error(`Error deleting booking: ${error.message}`);
  }
};