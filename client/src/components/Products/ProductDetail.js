import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/admin/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning" role="alert">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="img-fluid rounded"
            style={{ maxHeight: '500px', objectFit: 'contain' }}
          />
        </div>
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>
          <p className="text-muted mb-4">{product.description}</p>
          
          <div className="mb-4">
            <h3 className="text-primary mb-2">₹{product.sellingPrice}</h3>
            {product.mrp > product.sellingPrice && (
              <span className="text-muted text-decoration-line-through">
                ₹{product.mrp}
              </span>
            )}
          </div>

          <div className="mb-4">
            <h5>Product Details</h5>
            <ul className="list-unstyled">
              <li><strong>Category:</strong> {product.category?.name}</li>
              <li><strong>Stock:</strong> {product.stockQuantity} units</li>
              {product.isReturn && <li><strong>Return Policy:</strong> Available</li>}
              {product.isExchange && <li><strong>Exchange Policy:</strong> Available</li>}
            </ul>
          </div>

          <div className="d-flex gap-3">
            <button className="btn btn-primary">
              <FaShoppingCart className="me-2" />
              Add to Cart
            </button>
            <button className="btn btn-outline-danger">
              <FaHeart className="me-2" />
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 