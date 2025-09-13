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
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

For production, use `.env.production` with appropriate values.

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
1. Build the project: `npm run build`
2. Set up MongoDB database
3. Configure environment variables
4. Deploy the `dist/` folder to your hosting provider

For production deployment with Node.js server:
1. Build the project: `npm run build`
2. Install dependencies: `npm install`
3. Configure `.env.production` with your MongoDB URI and other settings
   - Replace `your_production_mongodb_uri_here` with your actual MongoDB connection string
   - Replace `your_secure_jwt_secret_here` with a strong secret key
4. Start the production server: `npm start`
5. The server will run on port 5000 by default (or the PORT specified in .env.production)

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

### Services Layer
Each model has a corresponding service file that encapsulates database operations:
- `productService.js`: Handles all product-related database operations (create, read, update, delete)
- `userService.js`: Manages user authentication and user data operations
- `bookingService.js`: Handles booking creation, retrieval, and management

### Real-time Data Synchronization
- Admin dashboard operations immediately update MongoDB
- Frontend components fetch fresh data from MongoDB on load
- Product images uploaded in admin are stored in MongoDB and displayed on frontend

### Data Flow
1. Admin uploads product image → Image converted to base64 → Saved to MongoDB
2. User visits product page → Product data fetched from MongoDB → Images displayed
3. Admin updates product info → Changes saved to MongoDB → Frontend reflects updates

## Troubleshooting

### MongoDB Connection Issues

1. Ensure MongoDB service is running:
   - Windows: `net start MongoDB`
   - macOS: `brew services start mongodb-community@7.0`
   - Linux: `sudo systemctl start mongod`

2. Check the MongoDB connection string in `.env` file

3. Verify MongoDB is accessible:
   ```
   mongo mongodb://localhost:27017
   ```

### Common Issues

1. **Port already in use**: Change the PORT value in `.env` file
2. **Permission errors**: Ensure you have proper permissions to run MongoDB
3. **Connection timeouts**: Check firewall settings and network connectivity
4. **Database initialization failed**: Check MongoDB logs for errors

## Development

### Project Structure

```
src/
├── components/         # React components
├── config/             # Configuration files
├── models/             # Mongoose models
├── services/           # Service layer for database operations
└── App.jsx             # Main application component
```

### Adding New Features

1. Create new Mongoose models in `src/models/`
2. Add service functions in `src/services/`
3. Implement components in `src/components/`
4. Update routes in `src/App.jsx` if needed

## Security Considerations

1. Passwords are hashed using bcrypt before storage
2. Admin routes are protected with authentication middleware
3. Environment variables are used for sensitive configuration
4. Input validation should be implemented for all user inputs
5. In production, enable MongoDB authentication and use SSL connections

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.