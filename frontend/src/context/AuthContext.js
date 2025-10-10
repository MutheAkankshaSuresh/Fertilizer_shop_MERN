import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token/user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Sync whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
      const token = localStorage.getItem('token');
      if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [currentUser]);

const login = async (email, password, navigate) => {
  try {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token, user } = response.data;

    // save token + user
    localStorage.setItem('token', token);
    setCurrentUser(user);

    // redirect based on role
if (user.isAdmin) {
  navigate('/admin');       // 👈 AdminPanel route
} else {
  navigate('/profile');     // 👈 UserProfile route
}


    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed'
    };
  }
};


  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const value = { currentUser, setCurrentUser, login, register, logout, loading };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
