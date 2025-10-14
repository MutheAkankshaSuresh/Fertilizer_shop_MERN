import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Contact.css';  // Optional
 import axios from 'axios';  // <-- Add this at the top


const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { currentUser  } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post('http://localhost:5000/api/contact', formData);

    if (res.data.success) {
      setSubmitted(true);
    } else {
      alert('Something went wrong: ' + res.data.message);
    }
  } catch (err) {
    console.error('Failed to send contact message:', err);
    alert('Failed to send message. Please try again later.');
  }
};


  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#4CAF50' }}>
        <h2>Thank you for your message!</h2>
        <p>We'll get back to you within 24 hours.</p>
        <button onClick={() => setSubmitted(false)} className="cta-button">Send Another</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2c5f2d', marginBottom: '30px' }}>Contact Us</h1>
      
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center', marginBottom: '40px' }}>
        {/* Shop Details */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ color: '#4CAF50' }}>Get in Touch</h2>
          <p><strong>Address:</strong> Plot No. 123, Agri Market, Nashik, Maharashtra 422001</p>
          <p><strong>Phone:</strong> +91-253-XXXXXXX | +91-98XXXXXXX</p>
          <p><strong>Email:</strong> info@shridattatrya.com</p>
          <p><strong>Hours:</strong> Mon-Sat: 8 AM - 7 PM | Sun: 9 AM - 2 PM</p>
          <p><strong>Services:</strong> Fertilizer delivery, crop consultation, soil testing.</p>
        </div>

        {/* Contact Form */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h2 style={{ color: '#4CAF50' }}>Send a Message</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email || (currentUser  ? currentUser .email : '')}
              onChange={handleChange}
              required
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone"
              value={formData.phone || (currentUser  ? currentUser .phone : '')}
              onChange={handleChange}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <textarea
              name="message"
              placeholder="Your Message (e.g., Inquiry about Urea for cotton crop)"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
            />
            <button type="submit" className="cta-button" style={{ padding: '12px' }}>
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Map Placeholder */}
      <section style={{ textAlign: 'center' }}>
        <h2>Location</h2>
        <div style={{ 
          height: '300px', 
          backgroundColor: '#e0e0e0', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          <p>Google Maps Embed Placeholder (Add real map via iframe)</p>
          {/* Real integration: <iframe src="https://maps.google.com/..."></iframe> */}
        </div>
      </section>
    </div>
  );
};

export default Contact;