# MongoDB Setup Guide for Bounce Kingdom Ghana

This guide will help you set up MongoDB and fully connect your entire site to the database.

## Prerequisites

1. Node.js installed (already present in your project)
2. MongoDB Community Edition

## Step 1: Install MongoDB

### Windows Installation

1. Download MongoDB Community Server:
   - Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select "Windows x64" platform
   - Download the MSI installer

2. Install MongoDB:
   - Run the downloaded MSI file
   - Choose "Complete" setup type
   - Select "Run service as Network Service user" (default)
   - Choose "Install MongoDB Compass" (optional but recommended)
   - Complete the installation

### Verify Installation

Open a new PowerShell window and run:
```bash
mongod --version
```

You should see version information if MongoDB is installed correctly.

## Step 2: Start MongoDB Service

### Method 1: Using Services (Recommended)
1. Press `Win + R`, type `services.msc`, and press Enter
2. Find "MongoDB Server" in the list
3. Right-click and select "Start"

### Method 2: Using Command Line
```bash
net start MongoDB
```

### Method 3: Using the provided batch file
Run `start-mongodb.bat` as Administrator from your project directory.

## Step 3: Verify MongoDB Connection

1. Open a new PowerShell window
2. Run the MongoDB shell:
```bash
mongosh
```

3. You should see a MongoDB prompt:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017
Using MongoDB: ...
Using Mongosh: ...

For mongosh info see: https://docs.mongodb.com/mongodb-shell/

------
   The server generated these startup warnings when booting
------
...
```

4. Exit the shell:
```bash
exit
```

## Step 4: Environment Configuration

Your project already has the correct environment configuration in the `.env` file:
```
MONGO_URI=mongodb://localhost:27017/bouncekingdom
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Step 5: Initialize the Database

The application will automatically initialize the database with default data when you start it. The initialization includes:

1. Creating a default admin user (username: admin, password: admin123)
2. Adding default products to the database

## Step 6: Start the Application

1. Make sure MongoDB is running
2. Run the development server:
```bash
npm run dev
```

Or use the provided batch file:
```bash
start-dev.bat
```

## How the Application Uses MongoDB

### Data Models
The application uses three main models:
1. **Product** - Bounce house products with details and images
2. **User** - User accounts including admin users
3. **Booking** - Customer bookings for products

### Services
Each model has a corresponding service file that handles database operations:
- `productService.js` - Product CRUD operations
- `userService.js` - User CRUD operations
- `bookingService.js` - Booking CRUD operations

### Components Using MongoDB
1. **AdminDashboard** - Fetches and manages products and bookings from MongoDB
2. **Products** - Displays products fetched from MongoDB
3. **ProductDetail** - Shows detailed product information from MongoDB

## Troubleshooting

### Common Issues

1. **MongoDB service won't start**
   - Make sure you're running the command as Administrator
   - Check if another MongoDB instance is already running
   - Verify the MongoDB data directory exists and has proper permissions

2. **Connection refused errors**
   - Ensure MongoDB service is running
   - Check if the port (27017) is correct in your .env file
   - Verify that no firewall is blocking the connection

3. **Authentication errors**
   - Check your MONGO_URI in the .env file
   - Ensure the database name is correct

### Checking Database Content

You can verify that your data is properly stored in MongoDB:

1. Open MongoDB shell:
```bash
mongosh mongodb://localhost:27017/bouncekingdom
```

2. List collections:
```bash
show collections
```

3. View products:
```bash
db.products.find().pretty()
```

4. View users:
```bash
db.users.find().pretty()
```

5. Exit:
```bash
exit
```

## Security Considerations

1. **Change the default admin password** after first login
2. **Update the JWT_SECRET** in your .env file with a strong secret
3. **In production**, enable MongoDB authentication and use a more secure connection string

## Next Steps

1. Start MongoDB service
2. Run the application with `npm run dev`
3. Navigate to the admin dashboard at `/admin/login`
4. Login with the default credentials (admin / admin123)
5. Add or modify products, which will be immediately visible on the frontend

The application is now fully connected to MongoDB and will persist all data between sessions.