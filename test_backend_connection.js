// Test script to verify backend connection
// Run this script to check if your frontend can communicate with your live backend

async function testBackendConnection() {
  try {
    // Get the API base URL from environment variables
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    console.log('Testing connection to backend at:', apiBaseUrl);
    
    // Test products endpoint
    console.log('Testing /api/products endpoint...');
    const productsResponse = await fetch(`${apiBaseUrl}/api/products`);
    
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      console.log('✅ Successfully connected to products endpoint');
      console.log('📦 Found', products.length, 'products');
    } else {
      console.log('❌ Failed to connect to products endpoint');
      console.log('Status:', productsResponse.status);
      console.log('Status Text:', productsResponse.statusText);
    }
    
    // Test bookings endpoint
    console.log('Testing /api/bookings endpoint...');
    const bookingsResponse = await fetch(`${apiBaseUrl}/api/bookings`);
    
    if (bookingsResponse.ok) {
      const bookings = await bookingsResponse.json();
      console.log('✅ Successfully connected to bookings endpoint');
      console.log('📅 Found', bookings.length, 'bookings');
    } else {
      console.log('❌ Failed to connect to bookings endpoint');
      console.log('Status:', bookingsResponse.status);
      console.log('Status Text:', bookingsResponse.statusText);
    }
    
    // Test reports endpoint
    console.log('Testing /api/reports endpoint...');
    const reportsResponse = await fetch(`${apiBaseUrl}/api/reports`);
    
    if (reportsResponse.ok) {
      const reports = await reportsResponse.json();
      console.log('✅ Successfully connected to reports endpoint');
      console.log('📊 Found', reports.length, 'reports');
    } else {
      console.log('❌ Failed to connect to reports endpoint');
      console.log('Status:', reportsResponse.status);
      console.log('Status Text:', reportsResponse.statusText);
    }
    
    console.log('🎉 Backend connection test completed!');
  } catch (error) {
    console.log('❌ Error during backend connection test:');
    console.log(error.message);
  }
}

// Run the test
testBackendConnection();