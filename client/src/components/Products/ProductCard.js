import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems } = useCart();
  const navigate = useNavigate();

  const isProductInCart = (productId) => {
    return cartItems.some(item => item.product.id === productId);
  };

  const getCartItemId = (productId) => {
    const cartItem = cartItems.find(item => item.product.id === productId);
    return cartItem?.id;
  };

  const handleCartAction = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    try {
      if (isProductInCart(product.id)) {
        // If item is in cart, remove it
        const cartItemId = getCartItemId(product.id);
        await removeFromCart(cartItemId);
        alert('Product removed from cart!');
      } else {
        // If item is not in cart, add it
        await addToCart(product.id, 1);
        alert('Product added to cart successfully!');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update cart. Please try again.');
    }
  };

  return (
    <div className="card h-100">
      <Link to={`/product/${product.id}`}>
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="card-img-top"
          style={{ height: '200px', objectFit: 'cover' }}
        />
      </Link>
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted">₹{product.sellingPrice}</p>
        
        {product.stockQuantity > 0 ? (
          <button
            className={`btn ${isProductInCart(product.id) ? 'btn-danger' : 'btn-primary'} w-100`}
            onClick={handleCartAction}
          >
            {isProductInCart(product.id) ? (
              <>
                <FaTrash className="me-2" />
                Remove from Cart
              </>
            ) : (
              <>
                <FaShoppingCart className="me-2" />
                Add to Cart
              </>
            )}
          </button>
        ) : (
          <button
            className="btn btn-danger w-100"
            disabled
          >
            <FaExclamationTriangle className="me-2" />
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 