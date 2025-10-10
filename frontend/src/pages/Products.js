import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Products.css';  // Optional

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    crop: '',
    category: '',
    season: '',
    price: '',
    sortBy: 'new'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser  } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = () => {
    let query = `/api/products?sortBy=${filters.sortBy}`;
    
    // Build query params for backend filters
    if (filters.crop) query += `&crop=${filters.crop}`;
    if (filters.category) query += `&category=${filters.category}`;
    if (filters.season) query += `&season=${filters.season}`;
    if (filters.price) query += `&price=${filters.price}`;
    
    axios.get(query)
      .then(response => {
        let filtered = response.data;
        // Client-side search (for name/brand)
        if (searchTerm) {
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        setProducts(filtered);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load products');
        setLoading(false);
        console.error(err);
      });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setLoading(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Debounce or refetch if needed; here we filter client-side after fetch
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading products...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2c5f2d', marginBottom: '30px' }}>All Fertilizers</h1>
      
      {/* Filters and Search */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Search by name or brand (e.g., Urea, IFFCO)..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ padding: '10px', marginRight: '10px', width: '200px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        
        <select name="crop" value={filters.crop} onChange={handleFilterChange} style={{ padding: '10px', marginRight: '10px' }}>
          <option value="">All Crops</option>
          <option value="cotton">Cotton</option>
          <option value="paddy">Paddy</option>
          <option value="sugarcane">Sugarcane</option>
          <option value="pulses">Pulses</option>
          <option value="wheat">Wheat</option>
          <option value="vegetables">Vegetables</option>
        </select>
        
        <select name="category" value={filters.category} onChange={handleFilterChange} style={{ padding: '10px', marginRight: '10px' }}>
          <option value="">All Categories</option>
          <option value="Nitrogen">Nitrogen</option>
          <option value="Phosphatic">Phosphatic</option>
          <option value="Organic">Organic</option>
          <option value="Potassic">Potassic</option>
          <option value="Micronutrient">Micronutrient</option>
          <option value="Complex">Complex</option>
        </select>
        
        <select name="season" value={filters.season} onChange={handleFilterChange} style={{ padding: '10px', marginRight: '10px' }}>
          <option value="">All Seasons</option>
          <option value="kharif">Kharif</option>
          <option value="rabi">Rabi</option>
          <option value="summer">Summer</option>
        </select>
        
        <select name="price" value={filters.price} onChange={handleFilterChange} style={{ padding: '10px', marginRight: '10px' }}>
          <option value="">All Prices</option>
          <option value="0-500">₹0 - ₹500</option>
          <option value="500-1000">₹500 - ₹1000</option>
          <option value="1000+">₹1000+</option>
        </select>
        
        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} style={{ padding: '10px' }}>
          <option value="new">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name A-Z</option>
        </select>
        
        <button onClick={fetchProducts} className="cta-button" style={{ padding: '10px', marginLeft: '10px' }}>Apply Filters</button>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => <ProductCard key={product._id} product={product} />)
        ) : (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '18px' }}>No products found. Try adjusting filters or search.</p>
        )}
      </div>

      {currentUser  && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#4CAF50' }}>
          Logged in as {currentUser .name}. <Link to="/profile">Manage Your Profile & Subscriptions</Link>
        </p>
      )}
    </div>
  );
};

export default Products;