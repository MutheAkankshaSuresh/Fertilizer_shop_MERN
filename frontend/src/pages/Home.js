import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';  // Optional

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Fetch featured products (e.g., latest or in-stock from backend)
    axios.get('/api/products?sortBy=new&limit=6&stock=true')
      .then(response => {
        const data =
          response.data?.products ||
          response.data?.data ||
          response.data ||
          [];

        setFeaturedProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load featured products');
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>{error}</div>;

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Shri Dattatrya Fertilizers</h1>
        <p>Quality fertilizers for better yields in Maharashtra. Serving farmers since 1995.</p>
        <a href="/products" className="cta-button" style={{ padding: '15px 30px', fontSize: '18px' }}>
          Explore Products
        </a>
        {currentUser && (
          <p style={{ marginTop: '10px' }}>Welcome back, {currentUser.name}!</p>
        )}
      </section>

      {/* Featured Products */}
      <section style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c5f2d' }}>Featured Fertilizers</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        {featuredProducts.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>No featured products available. Check back soon!</p>
        )}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a href="/products" className="cta-button">View All Products</a>
        </div>
      </section>

      {/* Quick Stats or Tips */}
      <section style={{ backgroundColor: '#e8f5e8', padding: '40px 20px', textAlign: 'center' }}>
        <h3 style={{ color: '#2c5f2d' }}>Why Choose Us?</h3>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ margin: '10px' }}><strong>9+ Products</strong><br/>Wide variety for cotton, paddy, sugarcane</div>
          <div style={{ margin: '10px' }}><strong>Fast Delivery</strong><br/>Within 2-3 days in Maharashtra</div>
          <div style={{ margin: '10px' }}><strong>Expert Advice</strong><br/>Free crop consultation</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
