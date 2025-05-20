import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Fetch orders from your API
    // This is a placeholder for demonstration
    setOrders([
      { 
        id: 1, 
        customerName: 'John Doe', 
        total: 299.97, 
        status: 'Pending',
        date: '2024-03-20'
      },
      { 
        id: 2, 
        customerName: 'Jane Smith', 
        total: 149.99, 
        status: 'Completed',
        date: '2024-03-19'
      },
    ]);
    setLoading(false);
  }, []);

  const handleViewDetails = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    // TODO: Implement update order status API call
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="container py-5">
      <h1 className="mb-4">Order Management</h1>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>${order.total}</td>
                <td>
                  <select 
                    className="form-select form-select-sm"
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{order.date}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-info"
                    onClick={() => handleViewDetails(order.id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement; 