# Frontend to Backend Connection Guide

## Overview
This guide will help you ensure that your frontend properly connects to your live backend when deployed to Netlify.

## Environment Variables Configuration

### Local Development (.env file)
```
VITE_API_URL=http://localhost:5001
```

### Production Deployment (.env.production file)
```
VITE_API_URL=https://bounce-kingdom-backend-app.onrender.com
```

## Netlify Configuration

### Setting Environment Variables in Netlify
1. Go to your Netlify site dashboard
2. Navigate to "Site settings" → "Build & deploy" → "Environment"
3. Add the following environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://bounce-kingdom-backend-app.onrender.com` (your actual backend URL)

### Verifying Environment Variables
After setting the environment variables:
1. Trigger a new deployment in Netlify
2. Check that the build completes successfully
3. Test the connection using browser developer tools

## Testing the Connection

### Using Browser Developer Tools
1. Visit your deployed site
2. Open browser developer tools (F12)
3. Go to the Network tab
4. Refresh the page or perform an action that makes an API call
5. Check that requests are being made to your backend URL:
   - Products: `https://bounce-kingdom-backend-app.onrender.com/api/products`
   - Bookings: `https://bounce-kingdom-backend-app.onrender.com/api/bookings`
   - Reports: `https://bounce-kingdom-backend-app.onrender.com/api/reports`

### Manual Testing
You can also test the connection by directly accessing your API endpoints:
- GET `https://bounce-kingdom-backend-app.onrender.com/api/products`
- GET `https://bounce-kingdom-backend-app.onrender.com/api/bookings`
- GET `https://bounce-kingdom-backend-app.onrender.com/api/reports`

## Troubleshooting Common Issues

### Issue: API requests still going to localhost
**Solution**:
- Verify that `VITE_API_URL` is set correctly in Netlify environment variables
- Make sure there are no typos in the variable name
- Redeploy your site after setting the environment variable

### Issue: CORS errors
**Solution**:
- Check that your backend has CORS enabled (should already be handled in server.js with `app.use(cors())`)
- Verify that the frontend is making requests to the correct backend URL

### Issue: Environment variables not taking effect
**Solution**:
- Trigger a new deployment in Netlify
- Clear cache and redeploy site

### Issue: 404 errors on API endpoints
**Solution**:
- Verify that your backend routes are correctly defined
- Check that your backend is running and accessible
- Confirm that the API endpoints exist and are working

## Code Verification

### Checking the API Base URL in Services
In your frontend service files (e.g., `src/services/productService.js`), verify that the API base URL is correctly configured:

```javascript
const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : '/api');
```

This configuration ensures that:
- In development, it uses `/api` which gets proxied to `http://localhost:5001` via vite.config.js
- In production, it uses the `VITE_API_URL` environment variable which should point to your live backend

### Verifying Proxy Configuration
In `vite.config.js`, ensure the proxy is correctly configured:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5001',
      changeOrigin: true,
      secure: false
    }
  }
}
```

## Deployment Checklist

- [ ] `VITE_API_URL` environment variable is set in Netlify
- [ ] Backend is running and accessible at the specified URL
- [ ] CORS is properly configured on the backend
- [ ] No typos in environment variable names
- [ ] Site has been redeployed after environment variable changes
- [ ] API endpoints are working correctly
- [ ] MongoDB connection is active

## Monitoring Your Connection

### Browser Console
Check the browser console for any JavaScript errors related to API calls.

### Network Tab
Monitor network requests to ensure:
1. Requests are being made to the correct backend URL
2. Responses are successful (status code 200)
3. Response times are reasonable

### Error Tracking
If you continue to experience issues:
1. Check the browser's developer console for detailed error messages
2. Monitor network requests for failed API calls
3. Verify that your backend logs show incoming requests