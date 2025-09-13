import React, { useState, useEffect } from 'react';
import { getAllBookings, createBooking, updateBooking, deleteBooking } from '../services/bookingService.js';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../services/productService.js';
import DeleteConfirmation from './DeleteConfirmation.jsx';
import './AdminDashboard.css';

// Modal component for viewing booking details
const ViewBookingModal = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Booking Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="booking-detail">
            <label>Booking ID:</label>
            <span>{booking.bookingId}</span>
          </div>
          <div className="booking-detail">
            <label>Customer:</label>
            <span>{booking.customer.name}</span>
          </div>
          <div className="booking-detail">
            <label>Product:</label>
            <span>{booking.product.name}</span>
          </div>
          <div className="booking-detail">
            <label>Date:</label>
            <span>{new Date(booking.date).toLocaleDateString()}</span>
          </div>
          <div className="booking-detail">
            <label>Status:</label>
            <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span>
          </div>
          <div className="booking-detail">
            <label>Special Requests:</label>
            <span>None specified</span>
          </div>
          <div className="booking-detail">
            <label>Total Amount:</label>
            <span>${booking.totalAmount}.00</span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="action-btn edit" onClick={onClose}>Edit Booking</button>
          <button className="action-btn view" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// Modal component for editing booking details
const EditBookingModal = ({ booking, onClose, onSave }) => {
  const [editedBooking, setEditedBooking] = useState({ 
    ...booking,
    date: new Date(booking.date).toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested properties like customer.name
      const [parent, child] = name.split('.');
      setEditedBooking(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditedBooking(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    onSave(editedBooking);
    onClose();
  };

  if (!booking) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Booking</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Booking ID:</label>
            <input 
              type="text" 
              name="bookingId" 
              value={editedBooking.bookingId} 
              onChange={handleChange} 
              disabled 
            />
          </div>
          <div className="form-group">
            <label>Customer Name:</label>
            <input 
              type="text" 
              name="customer.name" 
              value={editedBooking.customer.name} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Product:</label>
            <input 
              type="text" 
              name="product.name" 
              value={editedBooking.product.name} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input 
              type="date" 
              name="date" 
              value={editedBooking.date} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select 
              name="status" 
              value={editedBooking.status} 
              onChange={handleChange}
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="action-btn edit" onClick={handleSave}>Save Changes</button>
          <button className="action-btn view" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Modal component for creating a new booking
const NewBookingModal = ({ products, onClose, onSave }) => {
  const [newBooking, setNewBooking] = useState({
    bookingId: '', // Will be generated on save
    customer: {
      name: '',
      phone: '',
      email: ''
    },
    product: {
      id: products.length > 0 ? products[0].productId : '',
      name: products.length > 0 ? products[0].name : ''
    },
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: {
      id: '4-hours',
      name: '4 Hours',
      price: 150
    },
    address: '',
    status: 'Pending',
    totalAmount: 150
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested properties like customer.name
      const [parent, child] = name.split('.');
      setNewBooking(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setNewBooking(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    // Generate a new booking ID
    const bookingId = `BK-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0')}`;
    
    const bookingToSave = {
      ...newBooking,
      bookingId: bookingId
    };
    
    onSave(bookingToSave);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Booking</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Customer Name:</label>
            <input 
              type="text" 
              name="customer.name" 
              value={newBooking.customer.name} 
              onChange={handleChange} 
              placeholder="Enter customer name"
            />
          </div>
          <div className="form-group">
            <label>Customer Phone:</label>
            <input 
              type="text" 
              name="customer.phone" 
              value={newBooking.customer.phone} 
              onChange={handleChange} 
              placeholder="Enter customer phone"
            />
          </div>
          <div className="form-group">
            <label>Customer Email:</label>
            <input 
              type="email" 
              name="customer.email" 
              value={newBooking.customer.email} 
              onChange={handleChange} 
              placeholder="Enter customer email"
            />
          </div>
          <div className="form-group">
            <label>Product:</label>
            <select 
              name="product.id" 
              value={newBooking.product.id} 
              onChange={(e) => {
                const selectedProduct = products.find(p => p.productId == e.target.value);
                if (selectedProduct) {
                  setNewBooking(prev => ({
                    ...prev,
                    product: {
                      id: selectedProduct.productId,
                      name: selectedProduct.name
                    }
                  }));
                }
              }}
            >
              {products.map(product => (
                <option key={product._id} value={product.productId}>{product.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input 
              type="date" 
              name="date" 
              value={newBooking.date} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Time:</label>
            <input 
              type="time" 
              name="time" 
              value={newBooking.time} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <textarea 
              name="address" 
              value={newBooking.address} 
              onChange={handleChange} 
              placeholder="Enter delivery address"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select 
              name="status" 
              value={newBooking.status} 
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="action-btn edit" onClick={handleSave}>Create Booking</button>
          <button className="action-btn view" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Modal component for viewing product details
const ViewProductModal = ({ product, onClose, onDelete }) => {
  if (!product) return null;

  // Handle both base64 data URLs and regular image paths
  const getImageSrc = (image) => {
    if (!image) return '/images/placeholder.jpg';
    
    // If it's already a data URL, use it directly
    if (typeof image === 'string' && image.startsWith('data:image')) {
      return image;
    }
    
    // Otherwise, assume it's a path
    return image;
  };

  // Format additional specifications as a list
  const renderAdditionalSpecs = (specsText) => {
    if (!specsText) return null;
    
    const specsArray = specsText.split('\n').filter(spec => spec.trim() !== '');
    return (
      <ul className="specs-list">
        {specsArray.map((spec, index) => {
          // Clean the spec by removing any existing bullet points and trimming
          const cleanSpec = spec.trim().replace(/^•\s*/, '');
          return <li key={index}>{cleanSpec}</li>;
        })}
      </ul>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content view-product-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Product Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="booking-detail">
            <label>Product ID:</label>
            <span>{product.productId}</span>
          </div>
          <div className="booking-detail">
            <label>Product Name:</label>
            <span>{product.name}</span>
          </div>
          <div className="booking-detail">
            <label>Category:</label>
            <span>{product.category}</span>
          </div>
          <div className="booking-detail">
            <label>Status:</label>
            <span className={`status ${product.status.toLowerCase().replace(' ', '-')}`}>{product.status}</span>
          </div>
          <div className="booking-detail">
            <label>Size (Dimensions):</label>
            <span>{product.specs?.dimensions || 'N/A'}</span>
          </div>
          <div className="booking-detail">
            <label>Age Group:</label>
            <span>{product.specs?.ageGroup || 'N/A'}</span>
          </div>
          <div className="booking-detail">
            <label>Capacity:</label>
            <span>{product.specs?.capacity || 'N/A'}</span>
          </div>
          {product.additionalSpecs && (
            <div className="booking-detail">
              <label>Additional Specifications:</label>
              <div className="additional-specs-content">{renderAdditionalSpecs(product.additionalSpecs)}</div>
            </div>
          )}
          <div className="booking-detail">
            <label>Last Maintenance:</label>
            <span>{product.lastMaintenance ? new Date(product.lastMaintenance).toLocaleDateString() : 'N/A'}</span>
          </div>
          {product.image && (
            <div className="booking-detail">
              <label>Product Image:</label>
              <div className="image-preview-container">
                <img src={getImageSrc(product.image)} alt={product.name} className="product-image-preview" />
              </div>
            </div>
          )}
          <div className="booking-detail">
            <label>Description:</label>
            <span className="product-description">{product.description}</span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="action-btn delete" onClick={() => onDelete(product)}>Delete Product</button>
          <button className="action-btn edit" onClick={onClose}>Edit Product</button>
          <button className="action-btn view" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// Modal component for editing product details
const EditProductModal = ({ product, onClose, onSave }) => {
  const [editedProduct, setEditedProduct] = useState({ 
    ...product,
    specs: product.specs || { dimensions: '', ageGroup: '', capacity: '' }
  });
  const [imagePreview, setImagePreview] = useState(product.image || null);
  const [additionalSpecs, setAdditionalSpecs] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('specs.')) {
      const specField = name.split('.')[1];
      setEditedProduct(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specField]: value
        }
      }));
    } else {
      setEditedProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAdditionalSpecsChange = (e) => {
    setAdditionalSpecs(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditedProduct(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Combine additional specs with the main product data
    const productToSave = {
      ...editedProduct,
      additionalSpecs: additionalSpecs
    };
    onSave(productToSave);
    onClose();
  };

  // Initialize additional specs when product loads
  useEffect(() => {
    if (product.additionalSpecs) {
      setAdditionalSpecs(product.additionalSpecs);
    }
  }, [product]);

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Product ID:</label>
            <input 
              type="text" 
              name="productId" 
              value={editedProduct.productId} 
              onChange={handleChange} 
              disabled 
            />
          </div>
          <div className="form-group">
            <label>Product Name:</label>
            <input 
              type="text" 
              name="name" 
              value={editedProduct.name} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea 
              name="description" 
              value={editedProduct.description} 
              onChange={handleChange} 
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Size (Dimensions):</label>
            <input 
              type="text" 
              name="specs.dimensions" 
              value={editedProduct.specs?.dimensions || ''} 
              onChange={handleChange} 
              placeholder="e.g., 15' x 15'"
            />
          </div>
          <div className="form-group">
            <label>Age Group:</label>
            <input 
              type="text" 
              name="specs.ageGroup" 
              value={editedProduct.specs?.ageGroup || ''} 
              onChange={handleChange} 
              placeholder="e.g., 3-10 years"
            />
          </div>
          <div className="form-group">
            <label>Capacity:</label>
            <input 
              type="text" 
              name="specs.capacity" 
              value={editedProduct.specs?.capacity || ''} 
              onChange={handleChange} 
              placeholder="e.g., 8-10 kids"
            />
          </div>
          <div className="form-group">
            <label>Additional Specifications:</label>
            <textarea 
              name="additionalSpecs" 
              value={additionalSpecs} 
              onChange={handleAdditionalSpecsChange} 
              rows="4"
              placeholder="Enter additional specifications, one per line:
• Various sizes available
• Safety nets included
• Colorful designs
• Age-appropriate options"
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select 
              name="category" 
              value={editedProduct.category} 
              onChange={handleChange}
            >
              <option value="Bounce House">Bounce House</option>
              <option value="Water Slide">Water Slide</option>
              <option value="Balloon Pit">Balloon Pit</option>
              <option value="Combo Unit">Combo Unit</option>
              <option value="Obstacle Course">Obstacle Course</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select 
              name="status" 
              value={editedProduct.status} 
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="form-group">
            <label>Last Maintenance:</label>
            <input 
              type="date" 
              name="lastMaintenance" 
              value={editedProduct.lastMaintenance ? new Date(editedProduct.lastMaintenance).toISOString().split('T')[0] : ''} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Product Image:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
            {imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="action-btn edit" onClick={handleSave}>Save Changes</button>
          <button className="action-btn view" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Modal component for adding a new product
const NewProductModal = ({ onClose, onSave }) => {
  const [newProduct, setNewProduct] = useState({
    productId: Math.floor(1000 + Math.random() * 9000),
    name: '',
    description: '',
    specs: {
      dimensions: '',
      ageGroup: '',
      capacity: ''
    },
    category: 'Bounce House',
    status: 'Available',
    lastMaintenance: new Date().toISOString().split('T')[0],
    image: null,
    additionalSpecs: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('specs.')) {
      const specField = name.split('.')[1];
      setNewProduct(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specField]: value
        }
      }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
      
      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleAdditionalSpecsChange = (e) => {
    setNewProduct(prev => ({ ...prev, additionalSpecs: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewProduct(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newProduct.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!newProduct.description.trim()) {
      newErrors.description = 'Product description is required';
    }
    
    if (!newProduct.category) {
      newErrors.category = 'Product category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    console.log('NewProductModal handleSave called with:', newProduct);
    console.log('newProduct type:', typeof newProduct);
    console.log('newProduct constructor:', newProduct.constructor.name);
    
    if (validateForm()) {
      onSave(newProduct);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Product Name:</label>
            <input 
              type="text" 
              name="name" 
              value={newProduct.name} 
              onChange={handleChange} 
              placeholder="Enter product name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea 
              name="description" 
              value={newProduct.description} 
              onChange={handleChange} 
              placeholder="Enter product description"
              rows="3"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          <div className="form-group">
            <label>Size (Dimensions):</label>
            <input 
              type="text" 
              name="specs.dimensions" 
              value={newProduct.specs?.dimensions || ''} 
              onChange={handleChange} 
              placeholder="e.g., 15' x 15'"
            />
          </div>
          <div className="form-group">
            <label>Age Group:</label>
            <input 
              type="text" 
              name="specs.ageGroup" 
              value={newProduct.specs?.ageGroup || ''} 
              onChange={handleChange} 
              placeholder="e.g., 3-10 years"
            />
          </div>
          <div className="form-group">
            <label>Capacity:</label>
            <input 
              type="text" 
              name="specs.capacity" 
              value={newProduct.specs?.capacity || ''} 
              onChange={handleChange} 
              placeholder="e.g., 8-10 kids"
            />
          </div>
          <div className="form-group">
            <label>Additional Specifications:</label>
            <textarea 
              name="additionalSpecs" 
              value={newProduct.additionalSpecs || ''} 
              onChange={handleAdditionalSpecsChange} 
              rows="4"
              placeholder="Enter additional specifications, one per line:
• Various sizes available
• Safety nets included
• Colorful designs
• Age-appropriate options"
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select 
              name="category" 
              value={newProduct.category} 
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="Bounce House">Bounce House</option>
              <option value="Water Slide">Water Slide</option>
              <option value="Balloon Pit">Balloon Pit</option>
              <option value="Combo Unit">Combo Unit</option>
              <option value="Obstacle Course">Obstacle Course</option>
            </select>
            {errors.category && <div className="error-message">{errors.category}</div>}
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select 
              name="status" 
              value={newProduct.status} 
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="form-group">
            <label>Last Maintenance:</label>
            <input 
              type="date" 
              name="lastMaintenance" 
              value={newProduct.lastMaintenance} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Product Image:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
            {imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="action-btn edit" onClick={handleSave}>Add Product</button>
          <button className="action-btn view" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [viewBooking, setViewBooking] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [newBooking, setNewBooking] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load bookings and products from MongoDB
  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch data from MongoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching data from service...');
        
        // Add a small delay to ensure database is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('Calling getAllBookings()...');
        const bookingsData = await getAllBookings().catch(err => {
          console.error('Error fetching bookings:', err);
          return []; // Return empty array on error
        });
        console.log('Bookings data received:', bookingsData);
        
        console.log('Calling getAllProducts()...');
        const productsData = await getAllProducts().catch(err => {
          console.error('Error fetching products:', err);
          return []; // Return empty array on error
        });
        console.log('Products data received:', productsData);
        
        console.log('Bookings data:', bookingsData);
        console.log('Products data:', productsData);
        console.log('Number of products fetched:', productsData.length);
        
        setBookings(bookingsData || []);
        setProducts(productsData || []);
        
        console.log('Products state updated with', (productsData || []).length, 'products');
        console.log('Bookings state updated with', (bookingsData || []).length, 'bookings');
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'Pending').length,
    revenue: bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0),
    customerSatisfaction: 4.8
  };

  const recentActivity = [
    { id: 1, action: 'New booking created', user: 'Admin', time: '2 hours ago' },
    { id: 2, action: 'Product maintenance completed', user: 'Admin', time: '5 hours ago' },
    { id: 3, action: 'Payment received', user: 'System', time: '1 day ago' },
    { id: 4, action: 'Booking confirmed', user: 'Admin', time: '1 day ago' }
  ];

  // Handle viewing a booking
  const handleViewBooking = (booking) => {
    setViewBooking(booking);
  };

  // Handle editing a booking
  const handleEditBooking = (booking) => {
    setEditBooking(booking);
  };

  // Handle saving edited booking
  const handleSaveBooking = async (updatedBooking) => {
    try {
      const savedBooking = await updateBooking(updatedBooking._id, updatedBooking);
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === savedBooking._id ? savedBooking : booking
        )
      );
    } catch (err) {
      console.error('Error updating booking:', err);
      setError('Failed to update booking');
    }
  };

  // Handle creating a new booking
  const handleCreateBooking = () => {
    setNewBooking(true);
  };

  // Handle saving a new booking
  const handleSaveNewBooking = async (booking) => {
    try {
      console.log('Creating booking with data:', booking);
      const savedBooking = await createBooking(booking);
      setBookings(prevBookings => [...prevBookings, savedBooking]);
    } catch (err) {
      console.error('Error creating booking:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      
      // More detailed error message
      let errorMessage = 'Failed to create booking';
      if (err.message) {
        // Check if it's a validation error and format it nicely
        if (err.message.includes('Validation error:')) {
          errorMessage = err.message;
        } else {
          errorMessage += ': ' + err.message;
        }
      }
      
      setError(errorMessage);
    }
  };

  // Handle viewing a product
  const handleViewProduct = (product) => {
    setViewProduct(product);
  };

  // Handle editing a product
  const handleEditProduct = (product) => {
    setEditProduct(product);
  };

  // Handle saving edited product
  const handleSaveProduct = async (updatedProduct) => {
    try {
      const savedProduct = await updateProduct(updatedProduct._id, updatedProduct);
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === savedProduct._id ? savedProduct : product
        )
      );
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product');
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = (productToDelete) => {
    setProductToDelete(productToDelete);
  };

  // Confirm delete product
  const confirmDeleteProduct = async () => {
    try {
      await deleteProduct(productToDelete._id);
      setProducts(prevProducts => 
        prevProducts.filter(product => product._id !== productToDelete._id)
      );
      setViewProduct(null); // Close the view modal
      setProductToDelete(null); // Close the confirmation modal
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
      setProductToDelete(null); // Close the confirmation modal
    }
  };

  // Cancel delete product
  const cancelDeleteProduct = () => {
    setProductToDelete(null);
  };

  // Handle adding a new product
  const handleAddProduct = () => {
    setNewProduct(true);
  };

  // Handle saving a new product
  const handleSaveNewProduct = async (product) => {
    try {
      console.log('handleSaveNewProduct called with:', product);
      console.log('Product type:', typeof product);
      console.log('Product constructor:', product.constructor.name);
      
      // Validate product data before sending to service
      if (!product || typeof product !== 'object') {
        throw new Error('Invalid product data provided');
      }
      
      if (!product.name || !product.name.trim()) {
        throw new Error('Product name is required');
      }
      
      if (!product.description || !product.description.trim()) {
        throw new Error('Product description is required');
      }
      
      if (!product.category) {
        throw new Error('Product category is required');
      }
      
      const savedProduct = await createProduct(product);
      setProducts(prevProducts => [...prevProducts, savedProduct]);
      setNewProduct(false); // Close the modal
    } catch (err) {
      console.error('Error creating product:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      // More detailed error message
      let errorMessage = 'Failed to create product';
      if (err.message) {
        // Check if it's a validation error and format it nicely
        if (err.message.includes('Validation error:')) {
          errorMessage = err.message;
        } else {
          errorMessage += ': ' + err.message;
        }
      }
      
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, Admin!</p>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
        <button 
          className={activeTab === 'activity' ? 'active' : ''}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Bookings</h3>
                <p className="stat-value">{stats.totalBookings}</p>
                <p className="stat-description">All time</p>
              </div>
              <div className="stat-card">
                <h3>Pending Bookings</h3>
                <p className="stat-value pending">{stats.pendingBookings}</p>
                <p className="stat-description">Need attention</p>
              </div>
              <div className="stat-card">
                <h3>Revenue</h3>
                <p className="stat-value revenue">${stats.revenue.toLocaleString()}</p>
                <p className="stat-description">Total</p>
              </div>
              <div className="stat-card">
                <h3>Satisfaction</h3>
                <p className="stat-value satisfaction">{stats.customerSatisfaction}/5</p>
                <p className="stat-description">Average rating</p>
              </div>
            </div>
            
            <div className="overview-content">
              <div className="recent-bookings">
                <h3>Recent Bookings</h3>
                <div className="bookings-table">
                  <div className="table-header">
                    <div>Booking ID</div>
                    <div>Customer</div>
                    <div>Product</div>
                    <div>Date</div>
                    <div>Status</div>
                  </div>
                  {bookings.slice(0, 5).map(booking => (
                    <div className="table-row" key={booking._id}>
                      <div title={booking.bookingId}>{booking.bookingId}</div>
                      <div title={booking.customer.name}>{booking.customer.name}</div>
                      <div title={booking.product.name}>{booking.product.name}</div>
                      <div>{new Date(booking.date).toLocaleDateString()}</div>
                      <div className={`status ${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="product-status">
                <h3>Product Status</h3>
                <div className="products-table">
                  <div className="table-header">
                    <div>Product Name</div>
                    <div>Status</div>
                    <div>Last Maintenance</div>
                  </div>
                  {products.slice(0, 5).map(product => (
                    <div className="table-row" key={product._id}>
                      <div title={product.name}>{product.name}</div>
                      <div className={`status ${product.status.toLowerCase().replace(' ', '-')}`}>
                        {product.status}
                      </div>
                      <div>{product.lastMaintenance ? new Date(product.lastMaintenance).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <div className="section-header">
              <h2>Bookings Management</h2>
              <button className="add-btn" onClick={handleCreateBooking}>+ New Booking</button>
            </div>
            <div className="bookings-table">
              <div className="table-header">
                <div>Booking ID</div>
                <div>Customer</div>
                <div>Product</div>
                <div>Date</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              {bookings.map(booking => (
                <div className="table-row" key={booking._id}>
                  <div title={booking.bookingId}>{booking.bookingId}</div>
                  <div title={booking.customer.name}>{booking.customer.name}</div>
                  <div title={booking.product.name}>{booking.product.name}</div>
                  <div>{new Date(booking.date).toLocaleDateString()}</div>
                  <div className={`status ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </div>
                  <div>
                    <button className="action-btn view" onClick={() => handleViewBooking(booking)}>View</button>
                    <button className="action-btn edit" onClick={() => handleEditBooking(booking)}>Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h2>Product Inventory</h2>
              <button className="add-btn" onClick={handleAddProduct}>+ Add Product</button>
            </div>
            <div className="products-table">
              <div className="table-header">
                <div>Product Name</div>
                <div>Category</div>
                <div>Status</div>
                <div>Last Maintenance</div>
                <div>Actions</div>
              </div>
              {console.log('Rendering products section, products:', products)}
              {products && products.length > 0 ? (
                products.map(product => (
                  <div className="table-row" key={product._id}>
                    <div title={product.name}>{product.name}</div>
                    <div>{product.category}</div>
                    <div className={`status ${product.status.toLowerCase().replace(' ', '-')}`}>
                      {product.status}
                    </div>
                    <div>{product.lastMaintenance ? new Date(product.lastMaintenance).toLocaleDateString() : 'N/A'}</div>
                    <div>
                      <button className="action-btn view" onClick={() => handleViewProduct(product)}>View</button>
                      <button className="action-btn edit" onClick={() => handleEditProduct(product)}>Edit</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>No products found in database</p>
                  <p><small>Products array length: {products ? products.length : 'null'}</small></p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="reports-section">
            <h2>Business Reports</h2>
            <div className="reports-grid">
              <div className="report-card">
                <h3>Monthly Revenue</h3>
                <p className="report-value">$4,250</p>
                <p className="report-change positive">+12% from last month</p>
              </div>
              <div className="report-card">
                <h3>Bookings</h3>
                <p className="report-value">{bookings.length}</p>
                <p className="report-change positive">+8% from last month</p>
              </div>
              <div className="report-card">
                <h3>Customer Satisfaction</h3>
                <p className="report-value">4.8/5</p>
                <p className="report-change positive">+0.2 from last month</p>
              </div>
              <div className="report-card">
                <h3>Equipment Utilization</h3>
                <p className="report-value">85%</p>
                <p className="report-change negative">-3% from last month</p>
              </div>
            </div>
            
            <div className="chart-placeholder">
              <h3>Revenue Trend</h3>
              <div className="chart-container">
                <div className="chart-bar" style={{height: '70%'}}></div>
                <div className="chart-bar" style={{height: '85%'}}></div>
                <div className="chart-bar" style={{height: '60%'}}></div>
                <div className="chart-bar" style={{height: '90%'}}></div>
                <div className="chart-bar" style={{height: '75%'}}></div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div className="activity-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.map(activity => (
                <div className="activity-item" key={activity.id}>
                  <div className="activity-icon">🔔</div>
                  <div className="activity-content">
                    <p>{activity.action}</p>
                    <p className="activity-meta">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View Booking Modal */}
      {viewBooking && (
        <ViewBookingModal 
          booking={viewBooking} 
          onClose={() => setViewBooking(null)} 
        />
      )}

      {/* Edit Booking Modal */}
      {editBooking && (
        <EditBookingModal 
          booking={editBooking} 
          onClose={() => setEditBooking(null)} 
          onSave={handleSaveBooking}
        />
      )}

      {/* New Booking Modal */}
      {newBooking && (
        <NewBookingModal 
          products={products} 
          onClose={() => setNewBooking(false)} 
          onSave={handleSaveNewBooking}
        />
      )}

      {/* View Product Modal */}
      {viewProduct && (
        <ViewProductModal 
          product={viewProduct} 
          onClose={() => setViewProduct(null)} 
          onDelete={handleDeleteProduct}
        />
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <EditProductModal 
          product={editProduct} 
          onClose={() => setEditProduct(null)} 
          onSave={handleSaveProduct}
        />
      )}

      {/* New Product Modal */}
      {newProduct && (
        <NewProductModal 
          onClose={() => setNewProduct(false)} 
          onSave={handleSaveNewProduct}
        />
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <DeleteConfirmation 
          productName={productToDelete.name}
          onConfirm={confirmDeleteProduct}
          onCancel={cancelDeleteProduct}
        />
      )}
    </div>
  );
};

export default AdminDashboard;