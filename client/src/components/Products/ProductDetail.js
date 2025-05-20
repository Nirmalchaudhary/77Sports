import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../../data/staticData';
import { useAuth } from '../../context/AuthContext';
import { FaShoppingCart, FaHeart, FaStar } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Find the product from static data
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Product not found</div>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if product already exists in cart
      const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Update quantity if product exists
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if product doesn't exist
        existingCart.push({
          id: product.id,
          name: product.name,
          price: product.sellingPrice,
          image: product.imageUrl,
          quantity: quantity,
          stockQuantity: product.stockQuantity
        });
      }

      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Show success message
      setAddedToCart(true);

      // Reset added to cart message after 2 seconds
      setTimeout(() => setAddedToCart(false), 2000);

      // Optional: Show a toast or notification
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="img-fluid rounded shadow"
            style={{ maxHeight: '500px', objectFit: 'contain' }}
          />
        </div>
        <div className="col-md-6">
          <h1 className="mb-4">{product.name}</h1>
          <div className="mb-4">
            <h4 className="text-primary">₹{product.sellingPrice}</h4>
            <p className="text-muted text-decoration-line-through">MRP: ₹{product.mrp}</p>
            <p className="text-success">
              Save: ₹{product.mrp - product.sellingPrice} ({Math.round((1 - product.sellingPrice/product.mrp) * 100)}% off)
            </p>
          </div>
          <div className="mb-4">
            <h5>Description</h5>
            <p>{product.description}</p>
          </div>
          <div className="mb-4">
            <h5>Stock Status</h5>
            <p className={product.stockQuantity > 0 ? 'text-success' : 'text-danger'}>
              {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
            </p>
          </div>
          <div className="mb-4">
            <h5>Quantity</h5>
            <div className="quantity-selector">
              <button 
                className="quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <i className="fas fa-minus"></i>
              </button>
              <input 
                type="number" 
                className="quantity-input" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stockQuantity}
              />
              <button 
                className="quantity-btn"
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div className="d-grid gap-2">
            <button 
              className={`btn btn-lg ${addedToCart ? 'btn-success' : 'btn-primary'}`}
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
            >
              {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 