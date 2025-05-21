import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(cartItemId, newQuantity);
    } catch (error) {
      alert('Failed to update quantity. Please try again.');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
    } catch (error) {
      alert('Failed to remove item. Please try again.');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.sellingPrice * item.quantity);
    }, 0);
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

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p>Your cart is empty</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          style={{ width: '50px', marginRight: '10px' }}
                        />
                        {item.product.name}
                      </div>
                    </td>
                    <td>₹{item.product.sellingPrice}</td>
                    <td>
                      <div className="quantity-selector">
                        <button 
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          <FaMinus />
                        </button>
                        <input 
                          type="number" 
                          className="quantity-input"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                        />
                        <button 
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </td>
                    <td>₹{item.product.sellingPrice * item.quantity}</td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row mt-4">
            <div className="col-md-6">
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </div>
            <div className="col-md-6 text-end">
              <h4>Total: ₹{calculateTotal()}</h4>
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart; 