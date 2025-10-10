import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';  // Optional

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);  // Toggle between login/register
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    cropPreferences: []  // Multi-select for crops
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, currentUser  } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (currentUser ) {
    navigate('/profile');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCropChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setFormData({ ...formData, cropPreferences: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register({ ...formData, cropPreferences: formData.cropPreferences });
      }

      if (result.success) {
        navigate('/products');  // Redirect to products after success
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: '#2c5f2d', marginBottom: '20px' }}>
        {isLogin ? 'Login' : 'Register'}
      </h1>
      <p style={{ marginBottom: '30px' }}>
        {isLogin ? 'Access your account' : 'Join our community of farmers'}
      </p>

      {error && <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select
              name="cropPreferences"
              multiple
              onChange={handleCropChange}
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
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 chars)"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="cta-button" 
          style={{ padding: '12px', fontSize: '16px' }}
        >
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>

      <p style={{ marginTop: '20px' }}>
        {isLogin ? 'New farmer?' : 'Already registered?'}{' '}
        <button 
          type="button" 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ background: 'none', border: 'none', color: '#4CAF50', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </p>
      <Link to="/products" style={{ color: '#666' }}>Or browse products without account</Link>
    </div>
  );
};

export default Auth;