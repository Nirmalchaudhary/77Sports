import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ 
    name: '', 
    description: '', 
    imageUrl: '' 
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/categories/admin', newCategory, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNewCategory({ name: '', description: '', imageUrl: '' });
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setError('Failed to create category');
      console.error('Error creating category:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/categories/admin/${editingCategory.id}`, editingCategory, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEditingCategory(null);
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setError('Failed to update category');
      console.error('Error updating category:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:5000/api/categories/admin/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchCategories();
      } catch (err) {
        setError('Failed to delete category');
        console.error('Error deleting category:', err);
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Category Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingCategory(null);
            setNewCategory({ name: '', description: '', imageUrl: '' });
            setShowModal(true);
          }}
        >
          <FaPlus /> Add New Category
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>
                  {category.imageUrl && (
                    <img 
                      src={category.imageUrl} 
                      alt={category.name}
                      className="category-image"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  )}
                </td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(category)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(category.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={editingCategory ? handleUpdate : handleCreate}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingCategory ? editingCategory.name : newCategory.name}
                      onChange={(e) => editingCategory 
                        ? setEditingCategory({...editingCategory, name: e.target.value})
                        : setNewCategory({...newCategory, name: e.target.value})
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={editingCategory ? editingCategory.description : newCategory.description}
                      onChange={(e) => editingCategory
                        ? setEditingCategory({...editingCategory, description: e.target.value})
                        : setNewCategory({...newCategory, description: e.target.value})
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={editingCategory ? editingCategory.imageUrl : newCategory.imageUrl}
                      onChange={(e) => editingCategory
                        ? setEditingCategory({...editingCategory, imageUrl: e.target.value})
                        : setNewCategory({...newCategory, imageUrl: e.target.value})
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                    {(editingCategory?.imageUrl || newCategory.imageUrl) && (
                      <img 
                        src={editingCategory?.imageUrl || newCategory.imageUrl}
                        alt="Preview"
                        className="image-preview mt-2"
                      />
                    )}
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowModal(false);
                        setEditingCategory(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingCategory ? 'Update' : 'Create'} Category
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

export default CategoryManagement; 