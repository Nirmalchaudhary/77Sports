import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { categories } from '../../data/staticData';

const CategoryList = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Categories</h1>
      <div className="row g-4">
        {categories.map(category => (
          <div key={category.id} className="col-md-4 col-lg-3">
            <Link to={`/products?category=${category.id}`} className="text-decoration-none">
              <div className="card h-100 category-card">
                <img 
                  src={category.image} 
                  className="card-img-top" 
                  alt={category.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{category.name}</h5>
                  <p className="card-text text-muted">{category.description}</p>
                  <FaArrowRight className="text-primary" />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList; 