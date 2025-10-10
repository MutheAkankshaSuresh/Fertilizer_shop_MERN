import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // <-- import CartProvider
import { ToastContainer } from 'react-toastify';       // <-- import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import UserProfile from './pages/UserProfile';
import AdminPanel from './pages/AdminPanel';
import CartPage from './pages/CartPage';             // <-- new cart page
import CheckoutPage from './pages/CheckoutPage';  
import AdminLogin from './pages/AdminLogin';   // <-- new checkout page
//import './styles/App.css';
import PaymentPage from "./pages/PaymentPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>   {/* <-- wrap your app with CartProvider */}
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/cart" element={<CartPage />} />           {/* <-- cart route */}
                <Route path="/checkout" element={<CheckoutPage />} />   {/* <-- checkout route */}
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/payment" element={<PaymentPage />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={2000} /> {/* <-- toast container */}
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
