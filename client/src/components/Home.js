import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowRight } from 'react-icons/fa';
import axios from 'axios';

const Home = () => {
  const { user } = useAuth();
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch banners
        const bannersResponse = await axios.get('http://localhost:5000/api/banners/admin');
        setBanners(bannersResponse.data);

        // Fetch categories
        const categoriesResponse = await axios.get('http://localhost:5000/api/categories/admin');
        setCategories(categoriesResponse.data);

        // Fetch featured products
        const productsResponse = await axios.get('http://localhost:5000/api/products/admin');
        setProducts(productsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div className="container py-5">
      {/* Banners Section */}
      <div className="mb-5">
        <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner rounded">
            {banners.map((banner, index) => (
              <div key={banner.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <img 
                  src={banner.imageUrl} 
                  className="d-block w-100" 
                  alt={banner.title}
                  style={{ height: '400px', objectFit: 'cover' }}
                />
                <div className="carousel-caption d-none d-md-block">
                  <h2>{banner.title}</h2>
                  <p>{banner.description}</p>
                  <Link to={banner.link} className="btn btn-primary">
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8 text-center">
          <div className="card shadow p-5">
            <h1 className="mb-3">Welcome to 77Sports, {user?.username}!</h1>
            <p className="lead">Your ultimate destination for cricket equipment and gear. Explore our wide range of products and find everything you need for your cricketing journey.</p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-5">
        <h2 className="mb-4">Shop by Category</h2>
        <div className="row g-4">
          {categories.map(category => (
            <div key={category.id} className="col-md-4 col-lg-3">
              <Link to={`/products?category=${category.id}`} className="text-decoration-none">
                <div className="card h-100 category-card">
                  <img 
                    src={category.imageUrl} 
                    className="card-img-top" 
                    alt={category.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{category.name}</h5>
                    <p className="card-text text-muted">{category.description}</p>
                    <FaArrowRight className="text-primary" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Featured Products</h2>
          <Link to="/products" className="btn btn-primary">
            View All Products
          </Link>
        </div>
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
    </div>
  );
};

export default Home; 