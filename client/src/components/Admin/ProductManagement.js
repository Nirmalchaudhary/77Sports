import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    mrp: '',
    discount: '',
    sellingPrice: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',
    isReturn: false,
    isExchange: false
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  // Define calculateSellingPrice function
  const calculateSellingPrice = useCallback((mrp, discount) => {
    const m = parseFloat(mrp) || 0;
    const d = parseFloat(discount) || 0;
    return (m - (m * d / 100)).toFixed(2);
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/categories/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
    }
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const url = selectedCategory 
        ? `http://localhost:5000/api/products/admin?categoryId=${selectedCategory}`
        : 'http://localhost:5000/api/products/admin';
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/products/admin', newProduct, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNewProduct({
        name: '',
        description: '',
        mrp: '',
        discount: '',
        sellingPrice: '',
        stockQuantity: '',
        categoryId: '',
        imageUrl: '',
        isReturn: false,
        isExchange: false
      });
      fetchProducts();
    } catch (err) {
      setError('Failed to create product');
      console.error('Error creating product:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/products/admin/${editingProduct.id}`, editingProduct, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      setError('Failed to update product');
      console.error('Error updating product:', err);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/products/admin/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Product Management</h1>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <select 
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Create Product Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Product</h5>
          <form onSubmit={handleCreate}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="productName" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="productName"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="productCategory" className="form-label">Category</label>
                <select
                  className="form-select"
                  id="productCategory"
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="productDescription" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="productDescription"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">MRP</label>
                <input
                  type="number"
                  className="form-control"
                  value={newProduct.mrp}
                  onChange={e => {
                    const mrp = e.target.value;
                    setNewProduct(np => ({
                      ...np,
                      mrp,
                      sellingPrice: calculateSellingPrice(mrp, np.discount)
                    }));
                  }}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Discount (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newProduct.discount}
                  onChange={e => {
                    const discount = e.target.value;
                    setNewProduct(np => ({
                      ...np,
                      discount,
                      sellingPrice: calculateSellingPrice(np.mrp, discount)
                    }));
                  }}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Selling Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={newProduct.sellingPrice}
                  readOnly
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="productStock" className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  id="productStock"
                  value={newProduct.stockQuantity}
                  onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                  required
                  min="0"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="productImage" className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  id="productImage"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                />
              </div>
              <div className="col-md-2 mb-3">
                <div className="form-check mt-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="productReturn"
                    checked={newProduct.isReturn}
                    onChange={(e) => setNewProduct({ ...newProduct, isReturn: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="productReturn">Returnable</label>
                </div>
              </div>
              <div className="col-md-2 mb-3">
                <div className="form-check mt-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="productExchange"
                    checked={newProduct.isExchange}
                    onChange={(e) => setNewProduct({ ...newProduct, isExchange: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="productExchange">Exchangeable</label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Add Product</button>
          </form>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button type="button" className="btn-close" onClick={() => setEditingProduct(null)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdate}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editName" className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editName"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editCategory" className="form-label">Category</label>
                      <select
                        className="form-select"
                        id="editCategory"
                        value={editingProduct.categoryId}
                        onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                        required
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDescription" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="editDescription"
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">MRP</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingProduct.mrp}
                        onChange={e => setEditingProduct({ ...editingProduct, mrp: e.target.value })}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Discount (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingProduct.discount}
                        onChange={e => setEditingProduct({ ...editingProduct, discount: e.target.value })}
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Selling Price</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingProduct.sellingPrice}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="editStock" className="form-label">Stock Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        id="editStock"
                        value={editingProduct.stockQuantity}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: e.target.value })}
                        required
                        min="0"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="editImage" className="form-label">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        id="editImage"
                        value={editingProduct.imageUrl}
                        onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                      />
                    </div>
                    <div className="col-md-2 mb-3">
                      <div className="form-check mt-4">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="editReturn"
                          checked={editingProduct.isReturn}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isReturn: e.target.checked })}
                        />
                        <label className="form-check-label" htmlFor="editReturn">Returnable</label>
                      </div>
                    </div>
                    <div className="col-md-2 mb-3">
                      <div className="form-check mt-4">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="editExchange"
                          checked={editingProduct.isExchange}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isExchange: e.target.checked })}
                        />
                        <label className="form-check-label" htmlFor="editExchange">Exchangeable</label>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>MRP</th>
              <th>Discount (%)</th>
              <th>Selling Price</th>
              <th>Stock</th>
              <th>Return</th>
              <th>Exchange</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  {product.imageUrl && (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  )}
                </td>
                <td>{product.name}</td>
                <td>{categories.find(c => c.id === product.categoryId)?.name}</td>
                <td>${product.mrp}</td>
                <td>{product.discount}%</td>
                <td>${product.sellingPrice}</td>
                <td>{product.stockQuantity}</td>
                <td>{product.isReturn ? 'Yes' : 'No'}</td>
                <td>{product.isExchange ? 'Yes' : 'No'}</td>
                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-info me-2"
                    onClick={() => setEditingProduct(product)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default ProductManagement; 