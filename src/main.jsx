import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import ToastProvider from './components/Toast'
import ResponsiveMeta from './components/ResponsiveMeta'
import App from './App.jsx'
import './index.css'

// Connect to MongoDB asynchronously without blocking app render
const initializeApp = async () => {
  try {
    // Only initialize database in Node.js environment, not in browser
    if (typeof window === 'undefined') {
      const dbModule = await import('./config/db.js');
      const { initializeDatabase } = await import('./config/initializeDB.js');
      
      // Connect to database
      await dbModule.default();
      console.log('✅ MongoDB connected successfully');
      
      // Initialize database with default data
      await initializeDatabase();
      console.log('✅ Database initialized successfully');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    // Don't block the app if database fails
  }
};

// Initialize app but don't wait for it
initializeApp().catch(console.error);

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <ResponsiveMeta />
          <App />
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)