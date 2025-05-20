import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUsers, FaBox, FaShoppingCart, FaTags, FaImages, FaTicketAlt } from 'react-icons/fa';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const handleCardClick = (path) => {
    navigate(path);
  };

  const adminCards = [
    {
      title: 'User Management',
      description: 'Manage users and their roles',
      icon: <FaUsers className="admin-card-icon" />,
      path: '/admin/users'
    },
    {
      title: 'Category Management',
      description: 'Manage product categories',
      icon: <FaTags className="admin-card-icon" />,
      path: '/admin/categories'
    },
    {
      title: 'Product Management',
      description: 'Manage products by category',
      icon: <FaBox className="admin-card-icon" />,
      path: '/admin/products'
    },
    {
      title: 'Banner Management',
      description: 'Manage website banners and promotions',
      icon: <FaImages className="admin-card-icon" />,
      path: '/admin/banners'
    },
    {
      title: 'Order Management',
      description: 'View and manage orders',
      icon: <FaShoppingCart className="admin-card-icon" />,
      path: '/admin/orders'
    },
    {
      title: 'Discount Management',
      description: 'Manage coupons and discounts',
      icon: <FaTicketAlt className="admin-card-icon" />,
      path: '/admin/discounts'
    }
  ];

  return (
    <div className="container py-5">
      <h1 className="mb-5 text-center fw-bold">Admin Dashboard</h1>
      <div className="row g-4">
        {adminCards.map((card, index) => (
          <div className="col-md-4" key={index}>
            <div 
              className="admin-card"
              onClick={() => handleCardClick(card.path)}
            >
              {card.icon}
              <h5 className="admin-card-title">{card.title}</h5>
              <p className="admin-card-text">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;