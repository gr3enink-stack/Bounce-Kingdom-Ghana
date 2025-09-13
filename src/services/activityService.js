// Helper function to convert timestamp to "time ago" format
const getTimeAgo = (timestamp) => {
  const now = new Date();
  const diffMs = now - new Date(timestamp);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
  const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHrs > 0) {
    return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
  } else {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  }
};

import Activity from '../models/Activity.js';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a new activity
export const createActivity = async (activityData) => {
  try {
    // In browser environment, this would typically make an API call
    if (isBrowser) {
      // For now, we'll just log to console
      console.log('Activity created:', activityData);
      return activityData;
    }
    
    // Create a new Activity instance from the provided data
    const activity = new Activity(activityData);
    const savedActivity = await activity.save();
    return savedActivity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw new Error(`Error creating activity: ${error.message}`);
  }
};

// Get recent activities
export const getActivities = async (limit = 10) => {
  try {
    // In browser environment, make API call to fetch from database
    if (isBrowser) {
      console.log('Running in browser environment, making API call to fetch activities');
      
      const response = await fetch(`/api/activities?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch activities`);
      }
      
      const activities = await response.json();
      console.log('Activities fetched successfully via API:', activities.length);
      return activities;
    }
    
    const activities = await Activity.find({}).sort({ timestamp: -1 }).limit(limit);
    return activities.map(activity => ({
      id: activity._id,
      action: activity.action,
      user: activity.user,
      time: getTimeAgo(activity.timestamp)
    }));
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw new Error(`Error fetching activities: ${error.message}`);
  }
};