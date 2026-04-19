import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const { currentUser } = useAuth();

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      setError('Product not found');
      setLoading(false);
      console.error(err);
    }
  }, [id]);

  const fetchRelatedProducts = useCallback(async () => {
    if (!product) {
      return;
    }

    try {
      const response = await axios.get(
        `/api/products?category=${product.category || ''}&limit=4&exclude=${id}`
      );
      setRelatedProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  }, [id, product]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [fetchProduct, id]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
    }
  }, [fetchRelatedProducts, product]);

  const handleSubscribe = async () => {
    if (!currentUser) return alert('Please login to subscribe.');

    try {
      await axios.post('/api/users/subscribe', { productId: id });
      setSubscribed(true);
      alert("Subscribed! You'll be notified when stock is available.");
    } catch (err) {
      console.error(err);
      alert('Subscription failed.');
    }
  };

  const handleAddToCart = async () => {
    if (!currentUser) return alert('Please login to add products to cart.');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/cart/add',
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Product added to cart!');
    } catch (err) {
      console.error(err);
      alert('Failed to add product to cart.');
    }
  };

const handleBuyNow = async () => {
  if (!currentUser) return alert("Please login to buy the product.");

  try {
    // Create order for product
    const { data } = await axios.post("/api/payment/create-product-order", // Use relative URL if frontend proxy is set
  { productId: product._id },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  }
);


    const options = {
      key: data.key_id,
      amount: data.amount,
      currency: data.currency,
      name: "Fertilizer Shop",
      description: product.name,
      order_id: data.id,
      handler: function (response) {
        alert("Payment successful ✅ " + response.razorpay_payment_id);
      },
      prefill: {
        name: currentUser.name,
        email: currentUser.email,
        contact: currentUser.contact || "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment failed:", err.response || err);
    alert("Payment failed ❌ Check console for details");
  }
};

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading product details...</div>;
  if (error || !product)
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
        {error || 'Product not found.'} <Link to="/products">Back to Products</Link>
      </div>
    );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/products" className="cta-button" style={{ display: 'inline-block', marginBottom: '20px' }}>
        ← Back to Products
      </Link>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'start' }}>
        {/* Product Image */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
            }}
          />
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            {product.stock ? (
              <span style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '18px' }}>In Stock</span>
            ) : (
              <span style={{ color: '#f44336', fontWeight: 'bold', fontSize: '18px' }}>Out of Stock</span>
            )}
            {product.stock === false && currentUser && (
              <button onClick={handleSubscribe} className="cta-button" style={{ marginLeft: '10px', padding: '8px 16px' }}>
                {subscribed ? 'Subscribed!' : 'Subscribe for Alerts'}
              </button>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h1 style={{ color: '#2c5f2d', marginBottom: '10px' }}>{product.name}</h1>
          <p style={{ fontSize: '20px', color: '#d32f2f', marginBottom: '10px' }}>
            ₹{product.price} / {product.unit}
          </p>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Suitable For:</strong> {product.tags?.join(', ') || 'General crops'}</p>
          <div style={{ marginTop: '20px' }}>
            <button onClick={handleAddToCart} className="cta-button" style={{ padding: '15px 30px', fontSize: '18px' }}>
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              style={{
                padding: '15px 30px',
                fontSize: '18px',
                background: '#2c5f2d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                marginLeft: '20px',
                cursor: 'pointer',
              }}
            >
              Buy Now
            </button>
            {!currentUser && <p style={{ marginTop: '10px', color: '#666' }}>Login to subscribe for stock updates.</p>}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '50px' }}>
          <h2 style={{ textAlign: 'center', color: '#2c5f2d', marginBottom: '30px' }}>Related Fertilizers</h2>
          <div className="products-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
