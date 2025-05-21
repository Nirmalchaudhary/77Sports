import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import axios from 'axios';

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(categoryId || 'all');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await axios.get('http://localhost:5000/api/categories/admin');
        setCategories(categoriesResponse.data);

        // Fetch products
        const url = selectedCategory === 'all' 
          ? 'http://localhost:5000/api/products/admin'
          : `http://localhost:5000/api/products/admin?categoryId=${selectedCategory}`;
        
        const productsResponse = await axios.get(url);
        setProducts(productsResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleAddToCart = (product) => {
    // Implementation of handleAddToCart function
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Categories Filter */}
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-2">
          <button 
            className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Products
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              className={`btn ${selectedCategory === category.id.toString() ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedCategory(category.id.toString())}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="row g-4">
        {products.map(product => (
          <div key={product.id} className="col-md-4 col-lg-3">
            <div className="card h-100 product-card">
              <img 
                src={product.imageUrl} 
                className="card-img-top" 
                alt={product.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted small">{product.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="h5 mb-0">₹{product.sellingPrice}</span>
                    {product.mrp > product.sellingPrice && (
                      <span className="text-muted text-decoration-line-through ms-2">
                        ₹{product.mrp}
                      </span>
                    )}
                  </div>
                  <Link to={`/products/${product.id}`} className="btn btn-primary btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList; 