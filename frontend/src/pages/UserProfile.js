import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const { currentUser, setCurrentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    cropPreferences: currentUser?.cropPreferences || [],
  });

  // Sync updatedData whenever currentUser changes
  useEffect(() => {
    setUpdatedData({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      cropPreferences: currentUser?.cropPreferences || [],
    });
  }, [currentUser]);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    fetchSubscriptions();
    // eslint-disable-next-line
  }, [currentUser, navigate]);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get('/api/users/subscriptions');
      setSubscriptions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load subscriptions');
      setLoading(false);
      console.error(err);
    }
  };

  const handleUpdateChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleCropChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setUpdatedData({ ...updatedData, cropPreferences: selected });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      await axios.put(
        '/api/users/profile', // relative URL works better for frontend
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update frontend state immediately using form data
      const newUser = { ...currentUser, ...updatedData };
      setCurrentUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      alert('Profile updated successfully!');
      setEditing(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error(err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading profile...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2c5f2d', marginBottom: '30px' }}>Your Profile</h1>
      
      {/* User Info */}
      <section style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ color: '#4CAF50' }}>Account Details</h2>
        {editing ? (
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={updatedData.name}
              onChange={handleUpdateChange}
              required
              style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={updatedData.phone}
              onChange={handleUpdateChange}
              style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select
              name="cropPreferences"
              multiple
              onChange={handleCropChange}
              value={updatedData.cropPreferences}
              style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', height: '100px' }}
            >
              <option value="cotton">Cotton</option>
              <option value="paddy">Paddy</option>
              <option value="sugarcane">Sugarcane</option>
              <option value="pulses">Pulses</option>
              <option value="wheat">Wheat</option>
              <option value="vegetables">Vegetables</option>
            </select>
            <small style={{ color: '#666' }}>Hold Ctrl/Cmd to select multiple crops</small>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="cta-button" style={{ padding: '10px' }}>Save Changes</button>
              <button type="button" onClick={() => setEditing(false)} style={{ padding: '10px', backgroundColor: '#ccc' }}>Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <p><strong>Name:</strong> {currentUser.name}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Phone:</strong> {currentUser.phone || 'Not provided'}</p>
            <p><strong>Crop Preferences:</strong> {currentUser.cropPreferences?.join(', ') || 'None set'}</p>
            <p><strong>Member Since:</strong> {new Date(currentUser.createdAt).toLocaleDateString()}</p>
            <button onClick={() => setEditing(true)} className="cta-button" style={{ padding: '8px 16px', marginTop: '10px' }}>
              Edit Profile
            </button>
          </div>
        )}
      </section>

      {/* Subscriptions */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#4CAF50', textAlign: 'center' }}>Your Subscriptions</h2>
        <p style={{ textAlign: 'center', color: '#666' }}>Get notified when these fertilizers are back in stock.</p>
        {subscriptions.length > 0 ? (
          <div className="products-grid" style={{ marginTop: '20px' }}>
            {subscriptions.map(sub => (
              <ProductCard key={sub._id} product={sub} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '18px' }}>
            No subscriptions yet. Subscribe to out-of-stock products on their detail pages.
          </p>
        )}
      </section>

      {/* Logout */}
      <div style={{ textAlign: 'center' }}>
        <button onClick={handleLogout} className="cta-button" style={{ padding: '15px 30px', backgroundColor: '#f44336', fontSize: '18px' }}>
          Logout
        </button>
        <p style={{ marginTop: '10px', color: '#666' }}>
          Need help? <a href="/contact">Contact Us</a>
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
