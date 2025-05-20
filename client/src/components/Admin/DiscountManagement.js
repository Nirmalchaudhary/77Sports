import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const DiscountManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchaseAmount: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    isActive: true,
    isFirstTimeUser: false,
    applicableCategories: [],
    applicableProducts: []
  });

  // Check for admin access
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch categories
        const categoriesResponse = await axios.get('http://localhost:5000/api/categories/admin', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCategories(categoriesResponse.data);

        // Fetch products
        const productsResponse = await axios.get('http://localhost:5000/api/products/admin', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProducts(productsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch categories and products');
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:5000/api/coupons/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setCoupons(response.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError(err.response?.data?.error || 'Failed to fetch coupons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Format the data according to the backend model
      const couponData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minPurchaseAmount: formData.minPurchaseAmount ? parseFloat(formData.minPurchaseAmount) : 0,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      if (editingCoupon) {
        await axios.put(`http://localhost:5000/api/coupons/admin/${editingCoupon.id}`, couponData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.post('http://localhost:5000/api/coupons/admin', couponData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      setShowModal(false);
      setEditingCoupon(null);
      resetForm();
      fetchCoupons();
    } catch (err) {
      console.error('Error saving coupon:', err);
      setError(err.response?.data?.error || 'Failed to save coupon. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        await axios.delete(`http://localhost:5000/api/coupons/admin/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchCoupons();
      } catch (err) {
        console.error('Error deleting coupon:', err);
        setError(err.response?.data?.error || 'Failed to delete coupon. Please try again.');
      }
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      ...coupon,
      startDate: new Date(coupon.startDate).toISOString().split('T')[0],
      endDate: new Date(coupon.endDate).toISOString().split('T')[0],
      discountValue: coupon.discountValue.toString(),
      minPurchaseAmount: coupon.minPurchaseAmount?.toString() || '',
      maxDiscountAmount: coupon.maxDiscountAmount?.toString() || '',
      usageLimit: coupon.usageLimit?.toString() || '',
      applicableCategories: coupon.applicableCategories || [],
      applicableProducts: coupon.applicableProducts || []
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minPurchaseAmount: '',
      maxDiscountAmount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      isActive: true,
      isFirstTimeUser: false,
      applicableCategories: [],
      applicableProducts: []
    });
  };

  const handleCategoriesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      applicableCategories: selectedOptions
    }));
  };

  const handleProductsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      applicableProducts: selectedOptions
    }));
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Discount Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <FaPlus /> Add New Coupon
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Discount</th>
              <th>Validity</th>
              <th>Usage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length > 0 ? (
              coupons.map(coupon => (
                <tr key={coupon.id}>
                  <td>{coupon.code}</td>
                  <td>{coupon.name}</td>
                  <td>
                    {coupon.discountType === 'percentage' 
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`}
                  </td>
                  <td>
                    {new Date(coupon.startDate).toLocaleDateString()} - 
                    {new Date(coupon.endDate).toLocaleDateString()}
                  </td>
                  <td>
                    {coupon.usageCount} / {coupon.usageLimit || '∞'}
                  </td>
                  <td>
                    {coupon.isActive ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-danger">Inactive</span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEdit(coupon)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(coupon.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No coupons found. Click "Add New Coupon" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Coupon */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCoupon(null);
                    resetForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Coupon Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Discount Type</label>
                      <select
                        className="form-select"
                        value={formData.discountType}
                        onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Discount Value</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.discountValue}
                        onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                        required
                        min="0"
                        step={formData.discountType === 'percentage' ? "1" : "0.01"}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Minimum Purchase Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.minPurchaseAmount}
                        onChange={(e) => setFormData({...formData, minPurchaseAmount: e.target.value})}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Maximum Discount Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value})}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Usage Limit</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                        min="0"
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="form-check mt-4">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        />
                        <label className="form-check-label">Active</label>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={formData.isFirstTimeUser}
                          onChange={(e) => setFormData({...formData, isFirstTimeUser: e.target.checked})}
                        />
                        <label className="form-check-label">First Time User Only</label>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Applicable Categories</label>
                      <select
                        multiple
                        className="form-select"
                        value={formData.applicableCategories}
                        onChange={handleCategoriesChange}
                        size="5"
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <small className="text-muted">Hold Ctrl/Cmd to select multiple categories</small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Applicable Products</label>
                      <select
                        multiple
                        className="form-select"
                        value={formData.applicableProducts}
                        onChange={handleProductsChange}
                        size="5"
                      >
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                      <small className="text-muted">Hold Ctrl/Cmd to select multiple products</small>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowModal(false);
                        setEditingCoupon(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingCoupon ? 'Update' : 'Create'} Coupon
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountManagement; 