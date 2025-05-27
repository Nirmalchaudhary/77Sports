import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaSpinner, FaShoppingBag, FaMapMarkerAlt } from 'react-icons/fa';
import { getUserOrders } from '../../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        
        console.log('User Data:', userData);
        console.log('Token:', token);
        
        if (!userData?.id) {
          console.log('No user data found, redirecting to login');
          navigate('/login');
          return;
        }

        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('Fetching orders for user:', userData.id);
        const response = await getUserOrders(userData.id);
        console.log('Orders response:', response);
        
        if (response.data) {
          setOrders(response.data);
        } else {
          setError('No orders data received');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.response?.data?.error || 'Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'processing':
        return 'warning';
      case 'shipped':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'primary';
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <FaSpinner className="spinner" size={40} />
        <p className="mt-3">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            Please try refreshing the page or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        <FaBox className="me-2" />
        My Orders
      </h2>
      
      {orders.length === 0 ? (
        <div className="alert alert-info">
          <FaShoppingBag className="me-2" />
          You haven't placed any orders yet.
          <button 
            className="btn btn-primary ms-3"
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="row">
          {orders.map(order => (
            <div key={order.id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">Order #{order.id}</h5>
                    <span className={`badge bg-${getStatusColor(order.status)}`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Placed'}
                    </span>
                  </div>
                  
                  <p className="text-muted mb-2">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  
                  <div className="mb-3">
                    <strong>Items:</strong>
                    <ul className="list-unstyled mt-2">
                      {order.orderItems?.map((item, index) => (
                        <li key={index} className="mb-2 d-flex justify-content-between align-items-center">
                          <div>
                            <img 
                              src={item.product?.imageUrl} 
                              alt={item.product?.name}
                              className="me-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <span>{item.product?.name}</span>
                          </div>
                          <div className="text-end">
                            <div>₹{item.price} x {item.quantity}</div>
                            <small className="text-muted">₹{item.price * item.quantity}</small>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-3 pt-3 border-top">
                    <div className="d-flex justify-content-between mb-2">
                      <strong>Total Amount:</strong>
                      <strong>₹{order.totalAmount}</strong>
                    </div>
                    <div className="mt-2">
                      <small className="text-muted d-block mb-1">
                        <FaMapMarkerAlt className="me-1" />
                        <strong>Shipping Address:</strong> {order.shippingAddress}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders; 