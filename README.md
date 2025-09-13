# Bounce Kingdom Ghana

A web application for booking bounce houses and party rentals in Ghana.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd "Bounce Gh"

# Install dependencies
npm install
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
MONGO_URI=mongodb://localhost:27017/bouncekingdom
PORT=5001
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
VITE_API_URL=http://localhost:5001
```

For production, use `.env.production` with appropriate values:
```
MONGO_URI=your_production_mongodb_uri_here
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=production
VITE_API_URL=https://your-live-backend-url.onrender.com
```

**Important**: Replace `https://your-live-backend-url.onrender.com` with the actual URL of your deployed backend.

## Project Structure
- `src/` - Source code
- `public/` - Static assets
- `dist/` - Production build output

## Features
- Product catalog with bounce houses, water slides, and balloon pits
- Booking system with multi-step process
- Admin dashboard for managing products and bookings
- Responsive design for all device sizes
- Dark mode support
- SEO optimization with sitemap and meta tags

## Deployment

### Backend Deployment
The backend can be deployed to services like Render.com or Heroku:

1. **Render.com Deployment**:
   - Create a new Web Service
   - Connect your GitHub repository
   - Set Build Command: `npm install`
   - Set Start Command: `node server.js`
   - Add Environment Variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
     - `PORT`: 5001 (or any port you prefer)

2. **Heroku Deployment**:
   - Create a new app
   - Connect your GitHub repository
   - Set environment variables using `heroku config:set`
   - Deploy using `git push heroku main`

### Frontend Deployment to Netlify
1. Create an account at [Netlify](https://netlify.com/)
2. Connect your GitHub repository
3. Set Build Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set Environment Variables in Netlify:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-app-name.onrender.com`)

### Frontend to Backend Connection

To ensure your frontend properly connects to your backend:

1. **Local Development**:
   - The frontend uses a proxy to forward API requests to your backend
   - API requests to `/api/*` are automatically forwarded to `http://localhost:5001`
   - This is configured in `vite.config.js`

2. **Production Deployment**:
   - Set the `VITE_API_URL` environment variable in Netlify to point to your live backend
   - This variable is used by all frontend services to make API calls
   - Example: `VITE_API_URL=https://bounce-kingdom-backend-app.onrender.com`

3. **Testing the Connection**:
   - You can test the connection by visiting `/connection-test.html` on your deployed site
   - This page will show the status of connections to all API endpoints

### Production Verification
The site has been verified and is ready for production deployment. See [DEPLOYMENT_VERIFICATION.md](DEPLOYMENT_VERIFICATION.md) for details.

## Default Admin Credentials
- Username: admin
- Password: admin123

## Technologies Used
- React 19
- Vite
- MongoDB with Mongoose
- React Router DOM
- bcryptjs for password hashing

# Bounce Kingdom Ghana - MongoDB Integration

This document provides instructions on how to set up and run the Bounce Kingdom Ghana website with MongoDB integration.

## Prerequisites

1. Node.js (version 14 or higher)
2. MongoDB Community Server

## MongoDB Installation

### Windows

1. Download MongoDB Community Server:
   - Visit https://www.mongodb.com/try/download/community
   - Select "Windows x64" as the platform
   - Download the MSI installer

2. Run the installer:
   - Choose "Complete" setup type
   - Select "Run service as Network Service user" (default)
   - Choose "Install MongoDB Compass" (optional)
   - Complete the installation

3. Start MongoDB service:
   - Open Command Prompt as Administrator
   - Run: `net start MongoDB`

4. Verify installation:
   - Run: `mongo --version`

### macOS

1. Install Homebrew if you haven't already:
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install MongoDB:
   ```
   brew tap mongodb/brew
   brew install mongodb-community@7.0
   ```

3. Start MongoDB service:
   ```
   brew services start mongodb-community@7.0
   ```

### Linux (Ubuntu)

1. Import the MongoDB public GPG key:
   ```
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   ```

2. Create a list file for MongoDB:
   ```
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. Reload local package database:
   ```
   sudo apt-get update
   ```

4. Install MongoDB packages:
   ```
   sudo apt-get install -y mongodb-org
   ```

5. Start MongoDB service:
   ```
   sudo systemctl start mongod
   ```

## Project Setup

1. Clone or download the project repository

2. Install dependencies:
   ```
   npm install
   ```

3. Environment Configuration:
   - The project includes a `.env` file with default configuration
   - Modify the `MONGO_URI` in `.env` if your MongoDB instance is running on a different host or port
   - Set the `VITE_API_URL` to point to your backend server

## Running the Application

1. Ensure MongoDB is running on your system

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Admin Access

- Admin Login URL: `http://localhost:5173/admin/login`
- Default credentials: 
  - Username: `admin`
  - Password: `admin123`

## Database Structure

The application uses three main collections:

1. **Bookings**: Stores all booking information
2. **Products**: Stores product information including images
3. **Users**: Stores user information (admin users)

## Features

- Full CRUD operations for bookings and products
- Admin authentication and protected routes
- Data persistence using MongoDB
- Responsive design for all device sizes
- Real-time data synchronization between admin and frontend
- Image upload and storage in MongoDB

## How MongoDB Integration Works

### Data Models
The application uses Mongoose ODM with three main models:
- **Product Model**: Stores product details, descriptions, images (as base64 strings), specifications, categories, and status
- **User Model**: Stores user credentials with bcrypt password hashing and role-based access control
- **Booking Model**: Stores customer booking information including product details, customer information, and booking status

## Troubleshooting Deployment Issues

If you encounter deployment issues, particularly "Module Not Found" errors when deploying to Render.com, check the BACKEND_DEPLOYMENT_FIX.md file for detailed instructions on fixing import paths and repository structure issues.