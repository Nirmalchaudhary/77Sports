import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { products, categories } from '../../data/staticData';

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(categoryId || 'all');
  const navigate = useNavigate();

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.categoryId === parseInt(selectedCategory));

  const handleAddToCart = (product) => {
    // Implementation of handleAddToCart function
  };

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
      <div className="row">
        {filteredProducts.map(product => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img 
                src={product.imageUrl} 
                className="card-img-top" 
                alt={product.name}
                style={{ height: '200px', objectFit: 'contain' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-primary mb-0">₹{product.sellingPrice}</h6>
                    <small className="text-muted text-decoration-line-through">
                      ₹{product.mrp}
                    </small>
                  </div>
                  <div className="btn-group">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
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