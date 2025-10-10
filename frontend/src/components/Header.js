import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { currentUser , logout } = useAuth();

  return (
    <header style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 0' }}>
      <nav style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
          Shri Dattatrya Fertilizers
        </Link>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', margin: 0, padding: 0 }}>
          <li><Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>Products</Link></li>
          <li><Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link></li>
          <li><Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link></li>
          {currentUser  ? (
            <>
              <li><Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>Profile</Link></li>
              {currentUser .isAdmin && <li><Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link></li>}
              <li><button onClick={logout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Logout</button></li>
            </>
          ) : (
            <li><Link to="/auth" style={{ color: 'white', textDecoration: 'none' }}>Login/Register</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;