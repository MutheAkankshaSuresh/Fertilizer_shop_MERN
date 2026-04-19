import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/About.css';  // Optional: Create for page-specific styles

const About = () => {
  const { currentUser  } = useAuth();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2c5f2d', marginBottom: '30px' }}>About Shri Dattatrya Fertilizers</h1>
      
      
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#4CAF50', textAlign: 'center' }}>Our Story</h2>
        <p style={{ fontSize: '18px', lineHeight: '1.6', textAlign: 'justify' }}>
          Founded in 1995 in Maharashtra, Shri Dattatrya Fertilizers has been a trusted partner for farmers across the region. 
          We specialize in high-quality fertilizers tailored for local crops like cotton, sugarcane, paddy, and pulses. 
          Our commitment to sustainable agriculture ensures that every product promotes healthy soil and bountiful harvests.
        </p>
        <p style={{ fontSize: '18px', lineHeight: '1.6', textAlign: 'justify' }}>
          With over 25 years of experience, we source from leading brands like IFFCO and Mahadhan, offering both chemical and organic options. 
          Our team of agronomists provides free advice on crop nutrition, helping farmers optimize yields while minimizing environmental impact.
        </p>
      </section>

      <section style={{ backgroundColor: '#e8f5e8', padding: '30px', borderRadius: '8px', marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#2c5f2d' }}>Our Mission</h2>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>
          Empowering Maharashtra's farmers with affordable, effective fertilizers for sustainable farming.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ margin: '10px' }}>
            <strong>Quality Assurance</strong><br/>ISO-certified products
          </div>
          <div style={{ margin: '10px' }}>
            <strong>Local Expertise</strong><br/>Tailored for Maharashtra crops
          </div>
          <div style={{ margin: '10px' }}>
            <strong>Customer First</strong><br/>24/7 support and fast delivery
          </div>
        </div>
      </section>

      <section style={{ textAlign: 'center' }}>
        {currentUser  ? (
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>
            Ready to get started, {currentUser.name}? Explore our range!
          </p>
        ) : (
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>
            Join thousands of satisfied farmers. Register today!
          </p>
        )}
        <Link to="/products" className="cta-button" style={{ padding: '15px 30px', fontSize: '18px' }}>
          View Our Fertilizers
        </Link>
      </section>
    </div>
  );
};

export default About;
