import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newBanner, setNewBanner] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    isActive: true,
    order: 0
  });
  const [editingBanner, setEditingBanner] = useState(null);

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/banners', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBanners(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching banners:', err);
      setError('Failed to fetch banners');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/banners', newBanner, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNewBanner({
        title: '',
        description: '',
        imageUrl: '',
        link: '',
        isActive: true,
        order: 0
      });
      fetchBanners();
    } catch (err) {
      setError('Failed to create banner');
      console.error('Error creating banner:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/banners/${editingBanner.id}`, editingBanner, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEditingBanner(null);
      fetchBanners();
    } catch (err) {
      setError('Failed to update banner');
      console.error('Error updating banner:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/banners/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchBanners();
      } catch (err) {
        setError('Failed to delete banner');
        console.error('Error deleting banner:', err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Banner Management</h1>
      </div>

      {/* Create Banner Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Banner</h5>
          <form onSubmit={handleCreate}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="bannerTitle" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="bannerTitle"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="bannerImageUrl" className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  id="bannerImageUrl"
                  value={newBanner.imageUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="bannerDescription" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="bannerDescription"
                value={newBanner.description}
                onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="bannerLink" className="form-label">Link</label>
                <input
                  type="url"
                  className="form-control"
                  id="bannerLink"
                  value={newBanner.link}
                  onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label htmlFor="bannerOrder" className="form-label">Order</label>
                <input
                  type="number"
                  className="form-control"
                  id="bannerOrder"
                  value={newBanner.order}
                  onChange={(e) => setNewBanner({ ...newBanner, order: parseInt(e.target.value) })}
                />
              </div>
              <div className="col-md-3 mb-3">
                <div className="form-check mt-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="bannerActive"
                    checked={newBanner.isActive}
                    onChange={(e) => setNewBanner({ ...newBanner, isActive: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="bannerActive">Active</label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Create Banner</button>
          </form>
        </div>
      </div>

      {/* Banners List */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Order</th>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Link</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(banner => (
              <tr key={banner.id}>
                <td>{banner.order}</td>
                <td>
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title} 
                    style={{ width: '100px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
                <td>{banner.title}</td>
                <td>{banner.description}</td>
                <td>
                  {banner.link && (
                    <a href={banner.link} target="_blank" rel="noopener noreferrer">
                      View Link
                    </a>
                  )}
                </td>
                <td>{banner.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => setEditingBanner(banner)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(banner.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingBanner && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Banner</h5>
                <button type="button" className="btn-close" onClick={() => setEditingBanner(null)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdate}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editTitle" className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editTitle"
                        value={editingBanner.title}
                        onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editImageUrl" className="form-label">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        id="editImageUrl"
                        value={editingBanner.imageUrl}
                        onChange={(e) => setEditingBanner({ ...editingBanner, imageUrl: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDescription" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="editDescription"
                      value={editingBanner.description}
                      onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editLink" className="form-label">Link</label>
                      <input
                        type="url"
                        className="form-control"
                        id="editLink"
                        value={editingBanner.link}
                        onChange={(e) => setEditingBanner({ ...editingBanner, link: e.target.value })}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="editOrder" className="form-label">Order</label>
                      <input
                        type="number"
                        className="form-control"
                        id="editOrder"
                        value={editingBanner.order}
                        onChange={(e) => setEditingBanner({ ...editingBanner, order: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="form-check mt-4">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="editActive"
                          checked={editingBanner.isActive}
                          onChange={(e) => setEditingBanner({ ...editingBanner, isActive: e.target.checked })}
                        />
                        <label className="form-check-label" htmlFor="editActive">Active</label>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">Update Banner</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement; 