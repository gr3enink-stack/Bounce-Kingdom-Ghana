import Booking from '../models/Booking.js';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Mock data for browser environment
let mockBookings = [];

// API functions for browser environment
const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : '/api');

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    console.log('Creating booking with data:', bookingData);
    
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
    
    // In browser environment, make API call to save to database
    if (isBrowser) {
      console.log('Running in browser environment, making API call to save booking');
      
      const response = await fetch(`${apiBaseUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          // If parsing fails, use the raw text
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create booking`);
      }
      
      const savedBooking = await response.json();
      console.log('Booking created successfully via API:', savedBooking);
      
      // Add to mock bookings array for consistency
      if (typeof window !== 'undefined') {
        if (!window.mockBookings) window.mockBookings = [];
        window.mockBookings.push(savedBooking);
      }
      
      return savedBooking;
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
    // In browser environment, make API call to fetch from database
    if (isBrowser) {
      console.log('Running in browser environment, making API call to fetch bookings');
      
      const response = await fetch(`${apiBaseUrl}/api/bookings`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch bookings`);
      }
      
      const bookings = await response.json();
      console.log('Bookings fetched successfully via API:', bookings.length);
      return bookings;
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
    // In browser environment, make API call
    if (isBrowser) {
      console.log('Running in browser environment, making API call to get booking by ID');
      
      const response = await fetch(`${apiBaseUrl}/api/bookings/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch booking`);
      }
      
      const booking = await response.json();
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
    // In browser environment, make API call
    if (isBrowser) {
      console.log('Running in browser environment, making API call to update booking');
      
      const response = await fetch(`${apiBaseUrl}/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          // If parsing fails, use the raw text
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update booking`);
      }
      
      const booking = await response.json();
      return booking;
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
    // In browser environment, make API call
    if (isBrowser) {
      console.log('Running in browser environment, making API call to delete booking');
      
      const response = await fetch(`${apiBaseUrl}/api/bookings/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete booking');
      }
      
      const booking = await response.json();
      return booking;
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