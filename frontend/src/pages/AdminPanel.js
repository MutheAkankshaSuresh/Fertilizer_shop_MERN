import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import '../styles/AdminPanel.css';  // Optional: Create for page-specific styles

const AdminPanel = () => {
  const { currentUser  } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
   const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');  // 'products' or 'users'
  const [newProduct, setNewProduct] = useState({
    name: '', brand: '', category: '', price: '', unit: 'kg', description: '', image: '', stock: true, tags: []
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!currentUser  || !currentUser .isAdmin) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [currentUser , navigate]);

const fetchData = async () => {
  try {
    const [usersRes, productsRes, paymentsRes] = await Promise.all([
      axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }),
      axios.get('/api/admin/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }),
      axios.get('/api/admin/payments', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
    ]);
    setUsers(usersRes.data);
    setProducts(productsRes.data);
    setPayments(paymentsRes.data);
    setLoading(false);
  } catch (err) {
    setError('Failed to load admin data');
    setLoading(false);
    console.error(err);
  }
};


  const handleNewProductChange = (e) => {
    if (e.target.name === 'tags') {
      // Handle tags as comma-separated string
      setNewProduct({ ...newProduct, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) });
    } else if (e.target.name === 'stock') {
      setNewProduct({ ...newProduct, stock: e.target.checked });
    } else {
      setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/products', newProduct);
      alert('Product added successfully!');
      setNewProduct({ name: '', brand: '', category: '', price: '', unit: 'kg', description: '', image: '', stock: true, tags: [] });
      fetchData();  // Refresh list
    } catch (err) {
      alert('Failed to add product: ' + (err.response?.data?.message || 'Unknown error'));
      console.error(err);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setEditingProduct({ ...product, tags: product.tags.join(', ') });  // Convert tags to string for input
  };

  const handleUpdateProductChange = (e) => {
    if (e.target.name === 'tags') {
      setEditingProduct({ ...editingProduct, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) });
    } else if (e.target.name === 'stock') {
      setEditingProduct({ ...editingProduct, stock: e.target.checked });
    } else {
      setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/products/${editingProductId}`, editingProduct);
      alert('Product updated successfully!');
      setEditingProductId(null);
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      alert('Failed to update product: ' + (err.response?.data?.message || 'Unknown error'));
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This cannot be undone.')) {
      try {
        await axios.delete(`/api/admin/products/${id}`);
        alert('Product deleted successfully!');
        fetchData();
      } catch (err) {
        alert('Failed to delete product: ' + (err.response?.data?.message || 'Unknown error'));
        console.error(err);
      }
    }
  };

  const handleDeleteUser  = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      try {
        await axios.delete(`/api/admin/users/${id}`);
        alert('User  deleted successfully!');
        fetchData();
      } catch (err) {
        alert('Failed to delete user: ' + (err.response?.data?.message || 'Unknown error'));
        console.error(err);
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading admin panel...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2c5f2d', marginBottom: '30px' }}>Admin Panel - Shri Dattatrya Fertilizers</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>Welcome, Admin {currentUser .name}. Use the tabs below to manage the shop.</p>

      {/* Tabs */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('products')} 
          style={{ 
            padding: '10px 20px', 
            margin: '0 5px', 
            backgroundColor: activeTab === 'products' ? '#4CAF50' : '#ccc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Manage Products ({products.length})
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          style={{ 
            padding: '10px 20px', 
            margin: '0 5px', 
            backgroundColor: activeTab === 'users' ? '#4CAF50' : '#ccc', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Manage Users ({users.length})
        </button>

              <button 
        onClick={() => setActiveTab('payments')} 
        style={{ 
          padding: '10px 20px', 
          margin: '0 5px', 
          backgroundColor: activeTab === 'payments' ? '#4CAF50' : '#ccc', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer' 
        }}
      >
        Payments ({payments.length})
      </button>

      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          {/* Add New Product Form */}
          <section style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h2 style={{ color: '#4CAF50', marginBottom: '15px' }}>Add New Fertilizer Product</h2>
            <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <input 
                name="name" 
                placeholder="Name (e.g., Urea 46%)" 
                value={newProduct.name} 
                onChange={handleNewProductChange} 
                required 
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
              />
              <input 
                name="brand" 
                placeholder="Brand (e.g., IFFCO)" 
                value={newProduct.brand} 
                onChange={handleNewProductChange} 
                required 
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
              />
              <select 
                name="category" 
                value={newProduct.category} 
                onChange={handleNewProductChange} 
                required 
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Category</option>
                <option value="Nitrogen">Nitrogen</option>
                <option value="Phosphatic">Phosphatic</option>
                <option value="Organic">Organic</option>
                <option value="Potassic">Potassic</option>
                <option value="Micronutrient">Micronutrient</option>
                <option value="Complex">Complex</option>
              </select>
              <input 
                name="price" 
                type="number" 
                placeholder="Price (₹)" 
                value={newProduct.price} 
                onChange={handleNewProductChange} 
                required 
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
              />
              <input 
                name="unit" 
                placeholder="Unit (e.g., kg, bag)" 
                value={newProduct.unit} 
                onChange={handleNewProductChange} 
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
              />
              <textarea 
                name="description" 
                placeholder="Description (e.g., High-nitrogen for paddy)" 
                value={newProduct.description} 
                onChange={handleNewProductChange} 
                rows="3" 
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', gridColumn: '1 / -1' }} 
              />
              <input 
                name="image" 
                placeholder="Image URL (e.g., https://example.com/urea.jpg)" 
                value={newProduct.image} 
                onChange={handleNewProductChange} 
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
              />
              <input 
                name="tags" 
                placeholder="Tags (comma-separated, e.g., cotton,paddy,kharif)" 
                value={newProduct.tags.join(', ')} 
                onChange={handleNewProductChange} 
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="checkbox" 
                  name="stock"
                  checked={newProduct.stock} 
                  onChange={handleNewProductChange} 
                />
                In Stock
              </label>
              <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                <button type="submit" className="cta-button" style={{ padding: '12px 24px' }}>Add Product</button>
              </div>
            </form>
          </section>

          {/* Edit Product Form (if editing) */}
          {editingProductId && editingProduct && (
            <section style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
              <h2 style={{ color: '#4CAF50', marginBottom: '15px' }}>Edit Product: {editingProduct.name}</h2>
              <form onSubmit={handleUpdateProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <input 
                  name="name" 
                  placeholder="Name" 
                  value={editingProduct.name} 
                  onChange={handleUpdateProductChange} 
                  required 
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
                />
                <input 
                  name="brand" 
                  placeholder="Brand" 
                  value={editingProduct.brand} 
                  onChange={handleUpdateProductChange} 
                  required 
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
                />
                <select 
                  name="category" 
                  value={editingProduct.category} 
                  onChange={handleUpdateProductChange} 
                  required 
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">Select Category</option>
                  <option value="Nitrogen">Nitrogen</option>
                  <option value="Phosphatic">Phosphatic</option>
                  <option value="Organic">Organic</option>
                  <option value="Potassic">Potassic</option>
                  <option value="Micronutrient">Micronutrient</option>
                  <option value="Complex">Complex</option>
                </select>
                <input 
                  name="price" 
                  type="number" 
                  placeholder="Price (₹)" 
                  value={editingProduct.price} 
                  onChange={handleUpdateProductChange} 
                  required 
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
                />
                <input 
                  name="unit" 
                  placeholder="Unit" 
                  value={editingProduct.unit} 
                  onChange={handleUpdateProductChange} 
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
                />
                <textarea 
                  name="description" 
                  placeholder="Description" 
                  value={editingProduct.description} 
                  onChange={handleUpdateProductChange} 
                  rows="3" 
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', gridColumn: '1 / -1' }} 
                />
                <input 
                  name="image" 
                  placeholder="Image URL" 
                  value={editingProduct.image} 
                  onChange={handleUpdateProductChange} 
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
                />
                <input 
                  name="tags" 
                  placeholder="Tags (comma-separated)" 
                  value={Array.isArray(editingProduct.tags) ? editingProduct.tags.join(', ') : editingProduct.tags} 
                  onChange={handleUpdateProductChange} 
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} 
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="checkbox" 
                    name="stock"
                    checked={editingProduct.stock} 
                    onChange={handleUpdateProductChange} 
                  />
                  In Stock
                </label>
                <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                  <button type="submit" className="cta-button" style={{ padding: '12px 24px', marginRight: '10px' }}>Update Product</button>
                  <button 
                    type="button" 
                    onClick={() => { setEditingProductId(null); setEditingProduct(null); }} 
                    style={{ padding: '12px 24px', backgroundColor: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

 

          {/* Products List */}
          <section>
            <h2 style={{ color: '#4CAF50', textAlign: 'center', marginBottom: '20px' }}>Current Products ({products.length})</h2>
            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} style={{ position: 'relative' }}>
                  <ProductCard product={product} />
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleEditProduct(product)} 
                      className="cta-button" 
                      style={{ padding: '8px 16px', marginRight: '5px', backgroundColor: '#2196F3' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)} 
                      style={{ padding: '8px 16px', backgroundColor: '#f44336', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {products.length === 0 && (
              <p style={{ textAlign: 'center', color: '#666', fontSize: '18px' }}>No products yet. Add one above!</p>
            )}
          </section>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <section style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ color: '#4CAF50', textAlign: 'center', marginBottom: '20px' }}>User Management ({users.length})</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>View and manage registered farmers and admins.</p>
            {users.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                 <thead>
                  <tr style={{ backgroundColor: '#e0e0e0' }}>
                    <th style={{ padding: '10px', border: '1px solid #ccc' }}>Name</th>
                    <th style={{ padding: '10px', border: '1px solid #ccc' }}>Email</th>
                    <th style={{ padding: '10px', border: '1px solid #ccc' }}>Role</th>
                    <th style={{ padding: '10px', border: '1px solid #ccc' }}>Cart Products</th>
                    <th style={{ padding: '10px', border: '1px solid #ccc' }}>Subscribed Products</th>
                    <th style={{ padding: '10px', border: '1px solid #ccc' }}>Actions</th>
                  </tr>
                </thead>

                  <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.name}</td>
                      <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.email}</td>
                      <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </td>

                      {/* Cart Products */}
                      <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                        {user.cart && user.cart.length > 0 ? (
                          user.cart.map((item) => (
                            <div key={item._id}>
                              {item.product?.name} ({item.quantity})
                            </div>
                          ))
                        ) : (
                          <span style={{ color: '#888' }}>No items</span>
                        )}
                      </td>

                      {/* Subscribed Products */}
                      <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                        {user.subscriptions && user.subscriptions.length > 0 ? (
                          user.subscriptions.map((sub) => (
                            <div key={sub._id}>
                              {sub.product?.name}
                            </div>
                          ))
                        ) : (
                          <span style={{ color: '#888' }}>Not Subscribed</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                        {!user.isAdmin && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

                </table>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#666', fontSize: '18px' }}>No users found.</p>
            )}
          </section>
        </div>
      )}

               {/* Payments Tab */}
{activeTab === 'payments' && (
  <div>
    <section style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ color: '#4CAF50', textAlign: 'center', marginBottom: '20px' }}>All Payments ({payments.length})</h2>
      {payments.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#e0e0e0' }}>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Payment ID</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Order ID</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>User</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Amount (₹)</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Currency</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Status</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay) => (
                <tr key={pay._id}>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{pay.razorpay_payment_id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{pay.razorpay_order_id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{pay.user?.name} ({pay.user?.email})</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{pay.amount / 100}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{pay.currency}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc', color: pay.status === 'success' ? 'green' : 'red' }}>
                    {pay.status}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{new Date(pay.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#666', fontSize: '18px' }}>No payments yet.</p>
      )}
    </section>
  </div>
)}

    </div>
  );
};

export default AdminPanel;
