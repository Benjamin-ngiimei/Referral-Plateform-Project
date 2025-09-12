import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import API_URL from '../config';

const Login = ({ setLoggedInUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setLoggedInUser(data.name);
        localStorage.setItem('loggedInUser', data.name);
        localStorage.setItem('loggedInUserEmail', email);
        localStorage.setItem('referral_key', data.referral_key);
        localStorage.setItem('admin', data.admin);
        console.log('Login: referral_key from backend', data.referral_key);
        setEmail('');
        setPassword('');

        const pendingOpportunityId = localStorage.getItem('pending_opportunity_id');
        console.log('Login: pendingOpportunityId from localStorage', pendingOpportunityId);
        if (pendingOpportunityId) {
          localStorage.removeItem('pending_opportunity_id');
          try {
            const applyResponse = await fetch(`${API_URL}/api/user/${data.referral_key}/opportunities`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ opportunity_ids: [parseInt(pendingOpportunityId)] }),
            });

            if (applyResponse.ok) {
              console.log('Login: Application successful');
              alert('Applied successfully!');
            } else {
              const applyData = await applyResponse.json();
              console.error('Login: Application failed', applyData);
              alert(`Error applying: ${applyData.detail || 'Failed to apply.'}`);
            }
          } catch (applyError) {
            console.error('Login: Application network error', applyError);
            alert(`Error applying: ${applyError.message || 'Network error.'}`);
          }
        }

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setMessage(`Error: ${data.detail}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.toString()}`);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
        <p>Don't have an account? <span className="link" onClick={() => navigate('/register')}>Register here</span></p>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;