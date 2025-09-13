# Deployment Checklist - Frontend to Backend Connection

## Backend Configuration
- [x] Backend deployed to Render.com
- [x] Backend URL: https://bounce-kingdom-backend-app.onrender.com
- [x] Backend is running and accessible
- [x] MongoDB connection is active
- [x] All API endpoints are working

## Frontend Configuration
- [ ] Netlify site created
- [ ] Repository connected to Netlify
- [ ] Build settings configured:
  - Build command: `npm run build`
  - Publish directory: `dist`
- [ ] Environment variables set in Netlify:
  - [ ] `VITE_API_URL=https://bounce-kingdom-backend-app.onrender.com`

## Code Configuration
- [x] `vite.config.js` proxy port set to 5001
- [x] `server.js` port set to 5001
- [x] `.env` file configured for development
- [x] `.env.production` file configured for production
- [x] Service files use `import.meta.env.VITE_API_URL` correctly

## Deployment Process
- [ ] Initial deployment to Netlify completed
- [ ] Environment variables added to Netlify
- [ ] New deployment triggered after environment variable setup
- [ ] Site is accessible

## Connection Verification
- [ ] Visit deployed site
- [ ] Check browser console for errors
- [ ] Check network tab for API requests
- [ ] Verify requests are made to https://bounce-kingdom-backend-app.onrender.com
- [ ] Test all functionality:
  - [ ] Product listing
  - [ ] Product details
  - [ ] Booking process
  - [ ] Admin dashboard
  - [ ] Reports page
  - [ ] Activities page

## Post-Deployment
- [ ] Test connection using /connection-test.html
- [ ] Verify all data loads correctly
- [ ] Test CRUD operations for products
- [ ] Test booking creation
- [ ] Verify admin functionality