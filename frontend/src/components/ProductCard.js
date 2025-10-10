import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css'; // Import CSS file

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
          }}
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">Brand: {product.brand}</p>
        <p className="product-price">₹{product.price} / {product.unit}</p>
        <p className="product-category">{product.category}</p>
        
        <span className={`stock-status ${product.stock ? 'in-stock' : 'out-of-stock'}`}>
          {product.stock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <div className="product-actions">
        <Link to={`/product/${product._id}`} className="view-details-btn">
          View Details
        </Link>
        <button
          onClick={() => addToCart(product)}
          className="add-to-cart-btn"
          disabled={!product.stock}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;