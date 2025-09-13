const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.production' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongoDB: mongoStatus,
    uptime: process.uptime(),
    port: PORT
  });
});

// Connect to MongoDB with error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bouncekingdom');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Only connect to MongoDB if MONGO_URI is provided
if (process.env.MONGO_URI && process.env.MONGO_URI !== 'your_production_mongodb_uri_here') {
  connectDB();
} else {
  console.log('MongoDB URI not configured. Skipping MongoDB connection.');
}

// Serve the main index.html for all routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Function to start server with port fallback (max 3 attempts)
const startServer = (port, attempts = 0) => {
  if (attempts > 3) {
    console.error('Unable to find available port after 3 attempts');
    process.exit(1);
  }

  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Production build served from ${path.join(__dirname, 'dist')}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}`);
      startServer(port + 1, attempts + 1);
    } else {
      console.error(err);
    }
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
};

// Start server
startServer(PORT);