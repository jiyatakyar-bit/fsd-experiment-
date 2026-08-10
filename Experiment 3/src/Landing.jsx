import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '60px 20px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2.8rem', color: '#212529', marginBottom: '10px' }}>Welcome to the Post Composer</h1>
      <p style={{ color: '#6c757d', marginBottom: '40px', fontSize: '1.2rem' }}>
        A dedicated workspace for crafting and sharing your thoughts.
      </p>
      <button 
        onClick={() => navigate('/login')}
        style={{ padding: '12px 24px', fontSize: '1.1rem', cursor: 'pointer', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
      >
        Log In to Get Started
      </button>
    </div>
  );
};

export default Landing;