# Backend Deployment Fix for Render.com

## Issue Description
When deploying the backend to Render.com, you're encountering the following error:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/opt/render/project/src/src/routes/productRoutes.js' imported from /opt/render/project/src/server.js
```

This error occurs because the import paths in the server.js file are incorrect for the deployment environment.

## Solution

### 1. Fix the server.js File
Update the import paths in your backend repository's server.js file:

**Incorrect paths (causing the error):**
```javascript
// Import routes
import productRoutes from './src/routes/productRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';
import activityRoutes from './src/routes/activityRoutes.js';
```

**Correct paths (should be):**
```javascript
// Import routes
import productRoutes from './routes/productRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
```

### 2. Repository Structure
Ensure your backend repository has the following structure:
```
backend-repo/
├── server.js
├── routes/
│   ├── productRoutes.js
│   ├── bookingRoutes.js
│   ├── reportRoutes.js
│   └── activityRoutes.js
├── controllers/
│   ├── productController.js
│   ├── bookingController.js
│   ├── reportController.js
│   └── activityController.js
├── models/
│   ├── Product.js
│   ├── Booking.js
│   ├── Report.js
│   ├── Activity.js
│   └── User.js
├── package.json
└── .env
```

### 3. Render.com Deployment Settings
When deploying to Render.com, make sure to set the following:

1. **Build Command**: `npm install`
2. **Start Command**: `node server.js`
3. **Environment Variables**:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `PORT`: 5001 (or any port you prefer)

### 4. Alternative Solution: Separate Backend Repository
If you continue to have issues, consider creating a separate backend repository with only the backend files:

1. Create a new GitHub repository for the backend
2. Copy only the backend files:
   - server.js
   - src/routes/
   - src/controllers/
   - src/models/
   - package.json
   - .env (for local development)
3. Update the import paths in server.js as shown above
4. Deploy this separate repository to Render.com

### 5. Testing Locally
Before deploying, test the backend locally:

1. Make sure you're in the backend directory
2. Run `npm install`
3. Run `npm start` or `node server.js`
4. Verify that the server starts without import errors

### 6. Common Issues and Solutions

1. **Double src path issue**: 
   - Make sure your server.js file is in the root directory, not inside a src folder
   - The routes folder should be in the same directory as server.js

2. **ES Module issues**:
   - Ensure your package.json has `"type": "module"`
   - Use `.js` extensions in all import statements

3. **Path resolution issues**:
   - Use relative paths from the server.js file location
   - Don't include `src` in the import paths if server.js is already in the src directory

## Verification
After making these changes, redeploy to Render.com. The deployment should succeed without the module not found error.