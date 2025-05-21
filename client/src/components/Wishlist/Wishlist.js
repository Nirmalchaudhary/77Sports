import React, { useEffect, useState } from 'react';
import { useWishlist } from '../../contexts/WishlistContext';

const Wishlist = () => {
  const { wishlistItems, loading, fetchWishlist } = useWishlist();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Wishlist</h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {products.map(product => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">₹{product.sellingPrice}</span>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-secondary">View</button>
                      <button className="btn btn-sm btn-outline-secondary">Edit</button>
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

export default Wishlist; 