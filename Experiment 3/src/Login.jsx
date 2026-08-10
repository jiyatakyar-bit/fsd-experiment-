import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // Added 'role' to the state with a default value of 'Viewer'
  const [credentials, setCredentials] = useState({ username: '', password: '', role: 'Viewer' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      // Save both the authentication token AND the selected role
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', credentials.role);
      navigate('/create-post');
    } else {
      alert('Please fill in both the username and password fields.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#e9ecef', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '12px', width: '100%', maxWidth: '350px', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>Sign In</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="text" 
            name="username"
            placeholder="Username" 
            value={credentials.username}
            onChange={handleChange}
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '1rem' }}
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={credentials.password}
            onChange={handleChange}
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '1rem' }}
          />
          
          {/* New Role Selection Dropdown */}
          <select 
            name="role" 
            value={credentials.role} 
            onChange={handleChange}
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '1rem', backgroundColor: 'white' }}
          >
            <option value="Viewer">Viewer</option>
            <option value="Editor">Editor</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="submit" style={{ padding: '12px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;