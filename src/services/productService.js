import Product from '../models/Product.js';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Mock data for fallback
const mockProducts = [
  {
    _id: '1',
    productId: 1,
    name: "The Pirate Ship Bounce House",
    description: "Ahoy mateys! Set sail for adventure with our pirate-themed bounce house complete with slides and climbing areas.",
    image: "/images/pirate-ship.jpg",
    category: "Bounce House",
    status: "Available",
    lastMaintenance: new Date().toISOString()
  },
  {
    _id: '2',
    productId: 2,
    name: "Tropical Thunder Water Slide",
    description: "Cool off with our tropical-themed water slide that will make a splash at any party!",
    image: "/images/water-slide.jpg",
    category: "Water Slide",
    status: "In Use",
    lastMaintenance: new Date().toISOString()
  },
  {
    _id: '3',
    productId: 3,
    name: "Rainbow Balloon Pit",
    description: "Dive into a sea of colorful balloons in our magical rainbow balloon pit.",
    image: "/images/balloon-pit.jpg",
    category: "Balloon Pit",
    status: "Available",
    lastMaintenance: new Date().toISOString()
  },
  {
    _id: '4',
    productId: 4,
    name: "Castle Adventure Combo",
    description: "Our most popular combo unit with a bounce area, slide, and climbing wall.",
    image: "/images/castle-combo.jpg",
    category: "Combo Unit",
    status: "Maintenance",
    lastMaintenance: new Date().toISOString()
  }
];

// API functions for browser environment
const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : '/api');

// Create a new product
export const createProduct = async (productData) => {
  try {
    console.log('Creating product with data:', productData);
    
    // In browser environment, make API call
    if (isBrowser) {
      console.log('Running in browser environment, making API call');
      
      const response = await fetch(`${apiBaseUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          // If parsing fails, use the raw text
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create product`);
      }
      
      const savedProduct = await response.json();
      return savedProduct;
    }
    
    // In Node.js environment, use actual database
    console.log('Product data type:', typeof productData);
    console.log('Product data constructor:', productData.constructor.name);
    
    // Validate that we have the required fields
    if (!productData.name || !productData.description || !productData.category) {
      throw new Error('Missing required fields: name, description, and category are required');
    }
    
    // Create a new Product instance from the provided data
    const product = new Product(productData);
    console.log('Product instance created:', product);
    console.log('Product instance type:', typeof product);
    console.log('Product constructor:', product.constructor.name);
    console.log('Product has save method:', typeof product.save);
    
    // Check if product has save method before calling it
    if (typeof product.save !== 'function') {
      // Try alternative approach using Product.create
      console.log('Using Product.create instead of new Product() + save()');
      const savedProduct = await Product.create(productData);
      console.log('Product created successfully:', savedProduct.name);
      return savedProduct;
    }
    
    const savedProduct = await product.save();
    console.log('Product saved successfully:', savedProduct.name);
    return savedProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // More detailed error handling
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      throw new Error(`Validation error: ${validationErrors.join(', ')}`);
    } else if (error.name === 'MongoError' || error.name === 'BulkWriteError') {
      throw new Error(`Database error: ${error.message}`);
    } else if (error.name === 'BSONError') {
      throw new Error('Image data is too large. Please use a smaller image.');
    } else {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }
};

// Get all products
export const getAllProducts = async () => {
  try {
    // In browser environment, make API call
    if (isBrowser) {
      console.log('Running in browser environment, making API call to get all products');
      
      const response = await fetch(`${apiBaseUrl}/api/products`);
      
      if (!response.ok) {
        // Fallback to mock data if API call fails
        console.log('API call failed, returning mock products');
        return mockProducts;
      }
      
      const products = await response.json();
      return products;
    }
    
    // In Node.js environment, use actual database
    const products = await Product.find({}).sort({ createdAt: -1 });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to mock data if database call fails
    console.log('Database call failed, returning mock products');
    return mockProducts;
    // throw new Error(`Error fetching products: ${error.message}`);
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    // In browser environment, make API call
    if (isBrowser) {
      console.log('Running in browser environment, making API call to get product by ID');
      
      const response = await fetch(`${apiBaseUrl}/api/products/${id}`);
      
      if (!response.ok) {
        // Fallback to mock data if API call fails
        console.log('API call failed, returning mock product by ID');
        const product = mockProducts.find(p => p._id === id || p.productId === parseInt(id));
        if (!product) {
          throw new Error('Product not found');
        }
        return product;
      }
      
      const product = await response.json();
      return product;
    }
    
    // In Node.js environment, use actual database
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    // Fallback to mock data if database call fails
    console.log('Database call failed, returning mock product by ID');
    const product = mockProducts.find(p => p._id === id || p.productId === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
    // throw new Error(`Error fetching product: ${error.message}`);
  }
};

// Update product
export const updateProduct = async (id, updateData) => {
  try {
    // In browser environment, make API call
    if (isBrowser) {
      console.log('Running in browser environment, making API call to update product');
      console.log('Update data size:', JSON.stringify(updateData).length, 'characters');
      console.log('Product ID:', id);
      
      // Check if image data is too large
      if (updateData.image && updateData.image.length > 8000000) { // 8MB limit
        throw new Error('Image is too large. Please use an image smaller than 8MB.');
      }
      
      const response = await fetch(`${apiBaseUrl}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          // If parsing fails, use the raw text
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update product`);
      }
      
      const product = await response.json();
      console.log('Product updated successfully:', product);
      return product;
    }
    
    // In Node.js environment, use actual database
    const product = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    console.error('Error name:', error.name);
    
    // More detailed error handling
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      throw new Error(`Validation error: ${validationErrors.join(', ')}`);
    } else if (error.name === 'MongoError' || error.name === 'BulkWriteError') {
      throw new Error(`Database error: ${error.message}`);
    } else if (error.name === 'BSONError') {
      throw new Error('Image data is too large. Please use a smaller image.');
    } else if (error.name === 'CastError') {
      throw new Error(`Invalid product ID format: ${error.message}`);
    } else {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    // In browser environment, make API call
    if (isBrowser) {
      console.log('Running in browser environment, making API call to delete product');
      
      const response = await fetch(`${apiBaseUrl}/api/products/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
      
      const product = await response.json();
      return product;
    }
    
    // In Node.js environment, use actual database
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw new Error(`Error deleting product: ${error.message}`);
  }
};