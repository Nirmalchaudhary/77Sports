import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaArrowRight, FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import '../App.css'
import stump from '../assets/images/stump.png'

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
    <>
    <div className="container py-5">
      {/* Banners Section */}
      <div className="mb-5 main-banner w-80">
        <div id="homeCarousel" className="carousel slide w-80" data-bs-ride="carousel">
          <div className="carousel-inner rounded w-80">
            {banners.map((banner, index) => (
              <div key={banner.id} className={`carousel-item ${index === 0 ? 'active' : ''} w-60`}>
                <img 
                  src={banner.imageUrl} 
                  className="d-block carousel-image w-100" 
                  alt={banner.title}
                  style={{ height: '300px', objectFit: 'cover' }}
                />
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
<div className="banner-img">
      <img src={stump} alt="" />
      </div>

      {/* Welcome Section */}
      <div className='main-description'>
        <div className="text-center ">
          <div className="card shadow p-4 discription-main">
            <h1 className="mb-3 font-monospace">Welcome to 77Sports</h1>
            <p className="lead font-monospace">Your ultimate destination for cricket equipment and gear. Explore our wide range of products and find everything you need for your cricketing journey.</p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-5 mt-5">
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
                <div className="card-body card-body-class">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted small">{product.description}</p>
                  <div>
                    <div>
                      <span className="h5 mb-0">₹{product.sellingPrice}</span>
                      {product.mrp > product.sellingPrice && (
                        <span className="text-muted text-decoration-line-through ms-2">
                          ₹{product.mrp}
                        </span>
                      )}
                    </div>
                    <Link to={`/products/${product.id}`} className="btn btn-primary btn-sm button-list">
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
    {/* Footer Section */}
    <footer className="bg-dark text-light py-5 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5>About 77Sports</h5>
            <p className="text-light">Your trusted destination for premium cricket equipment and sports gear. We are committed to providing quality products and excellent service to cricket enthusiasts.</p>
            <div className="social-links mt-3">
              <a href="https://facebook.com/77sports" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                <FaFacebook size={24} />
              </a>
              <a href="https://instagram.com/77sports" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                <FaInstagram size={24} />
              </a>
              <a href="https://twitter.com/77sports" target="_blank" rel="noopener noreferrer" className="text-light me-3">
                <FaTwitter size={24} />
              </a>
              <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="text-light">
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none">Home</Link></li>
              <li><Link to="/products" className="text-light text-decoration-none">Products</Link></li>
              <li><Link to="/about" className="text-light text-decoration-none">About Us</Link></li>
              <li><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h5>Contact Us</h5>
            <ul className="list-unstyled text-light">
              <li className="mb-2">
                <FaEnvelope className="me-2" />
                <a href="mailto:info@77sports.com" className="text-light text-decoration-none">info@77sports.com</a>
              </li>
              <li className="mb-2">
                <FaPhone className="me-2" />
                <a href="tel:+911234567890" className="text-light text-decoration-none">+91 1234567890</a>
              </li>
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2" />
                <span>123 Sports Street, Cricket City, India</span>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="text-center text-light">
          <p className="mb-0">&copy; {new Date().getFullYear()} 77Sports. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Home; 