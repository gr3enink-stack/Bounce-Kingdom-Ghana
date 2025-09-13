import Report from '../models/Report.js';
import Booking from '../models/Booking.js';
import Product from '../models/Product.js';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Generate and save revenue report
export const generateRevenueReport = async (period = 'monthly') => {
  try {
    // In browser environment, this would typically make an API call
    if (isBrowser) {
      // For now, we'll return mock data
      // In a real implementation, this would call an API endpoint
      return {
        type: 'revenue',
        period,
        date: new Date(),
        value: 4250,
        metadata: {
          currency: 'GHS',
          previousPeriod: 3750
        }
      };
    }
    
    // Calculate revenue from bookings
    const startDate = getStartDate(period);
    const endDate = new Date();
    
    const bookings = await Booking.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    
    // Save to database
    const report = new Report({
      type: 'revenue',
      period,
      date: endDate,
      value: totalRevenue,
      metadata: {
        bookingCount: bookings.length,
        currency: 'GHS'
      }
    });
    
    await report.save();
    return report;
  } catch (error) {
    console.error('Error generating revenue report:', error);
    throw new Error(`Error generating revenue report: ${error.message}`);
  }
};

// Generate and save bookings report
export const generateBookingsReport = async (period = 'monthly') => {
  try {
    // In browser environment, this would typically make an API call
    if (isBrowser) {
      // For now, we'll return mock data
      // In a real implementation, this would call an API endpoint
      return {
        type: 'bookings',
        period,
        date: new Date(),
        value: 25,
        metadata: {
          previousPeriod: 23
        }
      };
    }
    
    // Count bookings
    const startDate = getStartDate(period);
    const endDate = new Date();
    
    const bookingCount = await Booking.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Save to database
    const report = new Report({
      type: 'bookings',
      period,
      date: endDate,
      value: bookingCount,
      metadata: {}
    });
    
    await report.save();
    return report;
  } catch (error) {
    console.error('Error generating bookings report:', error);
    throw new Error(`Error generating bookings report: ${error.message}`);
  }
};

// Generate and save equipment utilization report
export const generateEquipmentUtilizationReport = async (period = 'monthly') => {
  try {
    // In browser environment, this would typically make an API call
    if (isBrowser) {
      // For now, we'll return mock data
      // In a real implementation, this would call an API endpoint
      return {
        type: 'equipment-utilization',
        period,
        date: new Date(),
        value: 85,
        metadata: {
          previousPeriod: 88
        }
      };
    }
    
    // Calculate equipment utilization
    const products = await Product.find({});
    const totalProducts = products.length;
    
    if (totalProducts === 0) {
      return {
        type: 'equipment-utilization',
        period,
        date: new Date(),
        value: 0,
        metadata: {}
      };
    }
    
    // Count products in use
    const inUseProducts = products.filter(product => product.status === 'In Use').length;
    const utilization = Math.round((inUseProducts / totalProducts) * 100);
    
    // Save to database
    const report = new Report({
      type: 'equipment-utilization',
      period,
      date: new Date(),
      value: utilization,
      metadata: {
        totalProducts,
        inUseProducts
      }
    });
    
    await report.save();
    return report;
  } catch (error) {
    console.error('Error generating equipment utilization report:', error);
    throw new Error(`Error generating equipment utilization report: ${error.message}`);
  }
};

// Get all reports
export const getAllReports = async (type = null, period = null) => {
  try {
    // In browser environment, this would typically make an API call
    if (isBrowser) {
      // For now, we'll return mock data
      // In a real implementation, this would call an API endpoint
      return [
        {
          type: 'revenue',
          period: 'monthly',
          date: new Date(),
          value: 4250,
          metadata: {
            currency: 'GHS',
            previousPeriod: 3750
          }
        },
        {
          type: 'bookings',
          period: 'monthly',
          date: new Date(),
          value: 25,
          metadata: {
            previousPeriod: 23
          }
        },
        {
          type: 'equipment-utilization',
          period: 'monthly',
          date: new Date(),
          value: 85,
          metadata: {
            previousPeriod: 88
          }
        }
      ];
    }
    
    // Query reports from database
    let query = {};
    if (type) query.type = type;
    if (period) query.period = period;
    
    const reports = await Report.find(query).sort({ date: -1 }).limit(50);
    return reports;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw new Error(`Error fetching reports: ${error.message}`);
  }
};

// Helper function to get start date based on period
const getStartDate = (period) => {
  const date = new Date();
  switch (period) {
    case 'daily':
      date.setDate(date.getDate() - 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() - 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() - 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      date.setMonth(date.getMonth() - 1);
  }
  return date;
};