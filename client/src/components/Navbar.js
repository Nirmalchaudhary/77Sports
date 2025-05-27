import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShoppingBag, FaUser, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';
import ballImg from '../assets/images/ball.png'; // Assuming you have an image for the logo

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="">
      <div className="nav-head">
        <div className="nav-logo">
          <Link className="navbar-brand d-flex align-items-center" to="/home">
            <FaShoppingBag className="me-2" />
            77Sports
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <div className="Nav-main" id="navbarNav">
          <ul className="nav-list">
          <img src={ballImg} alt="" />
            <li className="">
              <Link className="nav-link" to="/products">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories">Categories</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" to="/orders">
                <FaShoppingBag className="me-1" />
                My Orders
              </Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center" to="/cart">
                    <FaShoppingCart className="me-1" />
                    Cart
                  </Link>
                </li>
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center" to="/admin">
                      <FaUser className="me-1" />
                      Admin Panel
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="btn btn-link nav-link d-flex align-items-center" onClick={handleLogout}>
                    <FaSignOutAlt className="me-1" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 