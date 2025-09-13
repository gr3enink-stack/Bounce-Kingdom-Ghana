# Deployment Instructions for Bounce Kingdom Ghana

## Overview
This application consists of two parts:
1. **Frontend**: React application built with Vite
2. **Backend**: Node.js/Express server with MongoDB

## Deployment Options

### Option 1: Deploy Backend to Render.com (Recommended)

1. Create an account at [Render.com](https://render.com/)

2. Create a new Web Service:
   - Connect your GitHub repository
   - Set Build Command: `npm install`
   - Set Start Command: `node server.js`
   - Add Environment Variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
     - `PORT`: 5001 (or any port you prefer)

3. After deployment, note the URL of your backend service (e.g., `https://your-app-name.onrender.com`)

### Option 2: Deploy Backend to Heroku

1. Create an account at [Heroku](https://heroku.com/)

2. Install Heroku CLI and login

3. Create a new app:
   ```
   heroku create your-app-name
   ```

4. Set environment variables:
   ```
   heroku config:set MONGO_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set PORT=5001
   ```

5. Deploy:
   ```
   git push heroku main
   ```

## Frontend Deployment to Netlify

1. Create an account at [Netlify](https://netlify.com/)

2. Connect your GitHub repository

3. Set Build Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

4. Set Environment Variables in Netlify:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-app-name.onrender.com`)

## Environment Configuration

### Development (.env)
```
MONGO_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
VITE_API_URL=http://localhost:5001
```

### Production (.env.production)
```
MONGO_URI=your_production_mongodb_connection_string
PORT=5001
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
VITE_API_URL=https://your-live-backend-url.onrender.com
```

**Important**: Replace `https://your-live-backend-url.onrender.com` with the actual URL of your deployed backend.

## Troubleshooting

### HTTP 405: Method Not Allowed Error
This error occurs when the frontend cannot reach the backend API. To fix this:

1. Ensure your backend is deployed and running
2. Verify the `VITE_API_URL` environment variable is set correctly in Netlify
3. Check that CORS is properly configured in your backend (already handled in server.js)
4. Make sure all API endpoints are implemented in your backend routes

### Common Issues
1. **CORS Errors**: Should be handled by the cors middleware in server.js
2. **MongoDB Connection**: Ensure your MongoDB URI is correct and the database is accessible
3. **Environment Variables**: Make sure all required environment variables are set in your deployment platform
4. **Module Not Found Errors**: Check import paths in server.js (see BACKEND_DEPLOYMENT_FIX.md for details)

## Testing Your Deployment

1. Visit your frontend URL
2. Try to create/update/delete a product
3. Check that bookings are saved to the database
4. Verify that reports and activities are working

If you encounter any issues, check the browser console and network tab for error messages.

## Backend Deployment Fix
If you encounter module not found errors when deploying to Render.com, check the BACKEND_DEPLOYMENT_FIX.md file for detailed instructions on fixing import paths and repository structure issues.