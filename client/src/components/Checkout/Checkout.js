import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, loading, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [deliveryCharges, setDeliveryCharges] = useState(0);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.sellingPrice * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal() - discount;
    return subtotal + deliveryCharges;
  };

  const handleApplyCoupon = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/coupons/validate',
        { 
          code: couponCode,
          amount: calculateSubtotal()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDiscount(response.data.discount);
      setCouponSuccess('Coupon applied successfully!');
      setCouponError('');
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Invalid coupon code');
      setCouponSuccess('');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setDiscount(0);
    setCouponSuccess('');
    setCouponError('');
  };

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setSelectedPaymentMethod(method);
    setDeliveryCharges(method === 'cod' ? 200 : 0);
  };

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method first');
      return;
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      alert('Please fill in all shipping address details');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData?.id;

      if (!userId) {
        alert('Please login to place an order');
        navigate('/login');
        return;
      }

      // Create a single string from the address components
      const fullAddress = `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.pincode}, ${shippingAddress.country}`;

      await axios.post(
        'http://localhost:5000/api/orders',
        {
          userId,
          items: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.sellingPrice
          })),
          totalAmount: calculateTotal(),
          shippingAddress: fullAddress,  // Send as single string instead of object
          paymentMethod: selectedPaymentMethod,
          couponCode: couponCode || undefined
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Order placed successfully!');
      clearCart();
      navigate('/');
    } catch (error) {
      alert('Failed to place order. Please try again.');
    }
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
      <button 
        className="btn btn-outline-primary mb-4"
        onClick={() => navigate('/cart')}
      >
        <FaArrowLeft className="me-2" />
        Back to Cart
      </button>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title mb-4">Order Summary</h3>
              {cartItems.map(item => (
                <div key={item.id} className="mb-4 pb-4 border-bottom">
                  <div className="d-flex">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      className="me-3"
                    />
                    <div>
                      <h5>{item.product.name}</h5>
                      <p className="text-muted mb-2">Quantity: {item.quantity}</p>
                      <p className="mb-2">Price: ₹{item.product.sellingPrice}</p>
                      <div className="d-flex gap-3">
                        {item.product.isReturn && (
                          <span className="badge bg-success">
                            <FaCheck className="me-1" />
                            Returnable
                          </span>
                        )}
                        {item.product.isExchange && (
                          <span className="badge bg-info">
                            <FaCheck className="me-1" />
                            Exchangeable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title mb-4">Price Details</h3>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal()}</span>
                </div>
                {discount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                {deliveryCharges > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>Delivery Charges</span>
                    <span>₹{deliveryCharges}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-2">
                  <strong>Total</strong>
                  <strong>₹{calculateTotal()}</strong>
                </div>
              </div>

              <div className="mb-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  {discount > 0 ? (
                    <button 
                      className="btn btn-outline-danger"
                      onClick={handleRemoveCoupon}
                    >
                      Remove
                    </button>
                  ) : (
                    <button 
                      className="btn btn-outline-primary"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </button>
                  )}
                </div>
                {couponError && (
                  <div className="text-danger mt-2">{couponError}</div>
                )}
                {couponSuccess && (
                  <div className="text-success mt-2">{couponSuccess}</div>
                )}
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="card-title mb-4">Shipping Address</h3>
                  <div className="mb-3">
                    <label htmlFor="street" className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="street"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="city" className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="state" className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="pincode" className="form-label">Pincode</label>
                    <input
                      type="text"
                      className="form-control"
                      id="pincode"
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="card-title mb-4">Payment Method</h3>
                  
                  <div className="mb-4">
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="upi"
                        value="upi"
                        checked={selectedPaymentMethod === 'upi'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="upi">
                        UPI
                      </label>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cod"
                        value="cod"
                        checked={selectedPaymentMethod === 'cod'}
                        onChange={handlePaymentMethodChange}
                      />
                      <label className="form-check-label" htmlFor="cod">
                        Cash on Delivery (COD)
                      </label>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="netbanking"
                        value="netbanking"
                        checked={selectedPaymentMethod === 'netbanking'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="netbanking">
                        Net Banking
                      </label>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="card"
                        value="card"
                        checked={selectedPaymentMethod === 'card'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="card">
                        Credit/Debit Card
                      </label>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary w-100"
                    onClick={handlePlaceOrder}
                    disabled={!selectedPaymentMethod}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 