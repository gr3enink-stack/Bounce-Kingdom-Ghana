import React, { useState } from 'react';
import './ProductComparison.css';

const ProductComparison = ({ products }) => {
  const [selectedProducts, setSelectedProducts] = useState([0, 1]);
  const [features] = useState([
    'Dimensions',
    'Age Group',
    'Capacity',
    'Setup Time',
    'Price (4 hrs)',
    'Price (8 hrs)',
    'Price (Full Day)'
  ]);

  const toggleProductSelection = (index) => {
    if (selectedProducts.includes(index)) {
      // Deselect if already selected
      setSelectedProducts(selectedProducts.filter(i => i !== index));
    } else if (selectedProducts.length < 3) {
      // Select if less than 3 products are selected
      setSelectedProducts([...selectedProducts, index]);
    }
  };

  return (
    <div className="product-comparison">
      <h2>Compare Our Products</h2>
      <p>Select up to 3 products to compare their features</p>
      
      <div className="product-selector">
        {products.map((product, index) => (
          <div 
            key={index}
            className={`product-option ${selectedProducts.includes(index) ? 'selected' : ''}`}
            onClick={() => toggleProductSelection(index)}
          >
            <h3>{product.name}</h3>
          </div>
        ))}
      </div>
      
      {selectedProducts.length > 0 && (
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                {selectedProducts.map(index => (
                  <th key={index}>{products[index].name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Image</td>
                {selectedProducts.map(index => (
                  <td key={index}>
                    <div className="product-image-placeholder">
                      <span>{products[index].name.charAt(0)}</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td>Dimensions</td>
                {selectedProducts.map(index => (
                  <td key={index}>{products[index].specs.dimensions}</td>
                ))}
              </tr>
              <tr>
                <td>Age Group</td>
                {selectedProducts.map(index => (
                  <td key={index}>{products[index].specs.ageGroup}</td>
                ))}
              </tr>
              <tr>
                <td>Capacity</td>
                {selectedProducts.map(index => (
                  <td key={index}>{products[index].specs.capacity}</td>
                ))}
              </tr>
              <tr>
                <td>Setup Time</td>
                {selectedProducts.map(index => (
                  <td key={index}>30-45 min</td>
                ))}
              </tr>
              <tr>
                <td>Price (4 hrs)</td>
                {selectedProducts.map(index => (
                  <td key={index}>$150</td>
                ))}
              </tr>
              <tr>
                <td>Price (8 hrs)</td>
                {selectedProducts.map(index => (
                  <td key={index}>$250</td>
                ))}
              </tr>
              <tr>
                <td>Price (Full Day)</td>
                {selectedProducts.map(index => (
                  <td key={index}>$350</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductComparison;