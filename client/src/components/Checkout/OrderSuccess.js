import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaBox, FaUser, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:5000/api/orders',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (user?.role === 'admin') {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <FaSpinner className="spinner" size={40} />
        <p className="mt-3">Loading...</p>
      </div>
    );
  }

  // Admin View
  if (user?.role === 'admin') {
    return (
      <div className="container mt-5">
        <h2 className="mb-4">
          <FaBox className="me-2" />
          All Orders
        </h2>
        
        {orders.length === 0 ? (
          <div className="alert alert-info">No orders found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      <FaUser className="me-2" />
                      {order.user?.username || 'N/A'}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span className={`badge bg-${getStatusColor(order.status)}`}>
                        {order.status || 'Placed'}
                      </span>
                    </td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                      >
                        View Details
                      </button>
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleUpdateStatus(order.id)}
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Regular User View
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <FaCheckCircle className="text-success" style={{ fontSize: '5rem' }} />
              <h2 className="mt-4 mb-3">Order Placed Successfully!</h2>
              <p className="text-muted mb-4">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
              <button 
                className="btn btn-primary btn-lg mb-4"
                onClick={() => navigate('/')}
              >
                <FaShoppingBag className="me-2" />
                Continue Shopping
              </button>
              <hr />
              {state?.order && (
                <>
                  <h4 className="mb-3">Order Details</h4>
                  <div className="text-start">
                    <p><strong>Order ID:</strong> #{state.order.id}</p>
                    <p><strong>Date:</strong> {new Date(state.order.createdAt).toLocaleString()}</p>
                    <p><strong>Total Amount:</strong> ₹{state.order.totalAmount}</p>
                    <p><strong>Shipping Address:</strong> {state.order.shippingAddress}</p>
                    <p><strong>Payment Method:</strong> {state.order.paymentMethod}</p>
                    <h5>Items:</h5>
                    <ul className="list-unstyled">
                      {state.order.items.map((item, idx) => (
                        <li key={idx} className="mb-2">
                          {item.productName || item.product?.name} x {item.quantity} @ ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'success';
    case 'processing':
      return 'warning';
    case 'cancelled':
      return 'danger';
    default:
      return 'primary';
  }
};

// Helper function to update order status
const handleUpdateStatus = async (orderId) => {
  // Implement status update logic here
  // This could open a modal or navigate to a status update page
};

export default OrderSuccess; 