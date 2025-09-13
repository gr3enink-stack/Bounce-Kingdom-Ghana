# Netlify Deployment Guide for Bounce Kingdom Ghana

## Setting Up Netlify Deployment

### 1. Connect Your Repository
1. Go to [Netlify](https://netlify.com/) and sign in or create an account
2. Click "New site from Git"
3. Connect to your GitHub account
4. Select your Bounce Kingdom Ghana repository

### 2. Configure Build Settings
In the deploy settings, set the following:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 3. Set Environment Variables
Go to "Site settings" → "Build & deploy" → "Environment" and add the following variables:

```
VITE_API_URL=https://your-live-backend-url.onrender.com
```

Replace `https://your-live-backend-url.onrender.com` with the actual URL of your deployed backend.

### 4. Deploy
Click "Deploy site" to start the deployment process.

## Verifying Your Deployment

### 1. Check Deployment Status
- Go to your Netlify dashboard
- Check the deployment logs for any errors
- Verify that the build completes successfully

### 2. Test API Connectivity
After deployment:
1. Visit your site URL
2. Open browser developer tools (F12)
3. Go to the Network tab
4. Try to load products or make a booking
5. Check that API requests are being made to your backend URL

### 3. Common Issues and Solutions

#### Issue: API requests still going to localhost
**Solution**: 
- Verify that `VITE_API_URL` is set correctly in Netlify environment variables
- Make sure there are no typos in the variable name
- Redeploy your site after setting the environment variable

#### Issue: CORS errors
**Solution**:
- Check that your backend has CORS enabled (should already be handled in server.js)
- Verify that the frontend is making requests to the correct backend URL

#### Issue: Environment variables not taking effect
**Solution**:
- Trigger a new deployment in Netlify
- Clear cache and redeploy site

## Updating Your Backend URL

If you change your backend URL:
1. Update the `VITE_API_URL` environment variable in Netlify
2. Trigger a new deployment
3. Test the connection

## Monitoring Your Site

### Netlify Analytics
- Use Netlify Analytics to monitor site performance
- Check form submissions if you're using Netlify Forms
- Monitor deploy previews for pull requests

### Error Tracking
- Check browser console for JavaScript errors
- Monitor network requests for failed API calls
- Use Netlify's error tracking features

## Troubleshooting Checklist

- [ ] `VITE_API_URL` environment variable is set in Netlify
- [ ] Backend is running and accessible
- [ ] CORS is properly configured on the backend
- [ ] No typos in environment variable names
- [ ] Site has been redeployed after environment variable changes
- [ ] API endpoints are working correctly
- [ ] MongoDB connection is active

If you continue to experience issues, check the browser's developer console and network tab for detailed error messages.