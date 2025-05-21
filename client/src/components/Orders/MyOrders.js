import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBox, FaSpinner } from 'react-icons/fa';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));
        
        if (!userData?.id) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/orders/user/${userData.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

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
          {error}
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
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="row">
          {orders.map(order => (
            <div key={order.id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">Order #{order.id}</h5>
                    <span className={`badge bg-${order.status === 'delivered' ? 'success' : 'primary'}`}>
                      {order.status || 'Placed'}
                    </span>
                  </div>
                  
                  <p className="text-muted mb-2">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                  
                  <div className="mb-3">
                    <strong>Items:</strong>
                    <ul className="list-unstyled mt-2">
                      {order.orderItems.map((item, index) => (
                        <li key={index} className="mb-1">
                          {item.product?.name} x {item.quantity}
                          <span className="float-end">₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between">
                      <strong>Total Amount:</strong>
                      <strong>₹{order.totalAmount}</strong>
                    </div>
                    <div className="mt-2">
                      <small className="text-muted">
                        <strong>Shipping Address:</strong> {order.shippingAddress}
                      </small>
                    </div>
                    <div className="mt-1">
                      <small className="text-muted">
                        <strong>Payment Method:</strong> {order.paymentMethod}
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