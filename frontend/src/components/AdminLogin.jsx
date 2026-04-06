import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    authService.login(username, password).then(
      (data) => {
        if (data.role === 'ROLE_ADMIN') {
          navigate('/admin/dashboard');
        } else {
          setError('Access Denied. You are not an admin.');
          authService.logout();
        }
      },
      (error) => {
        setError('Invalid admin credentials');
      }
    );
  };

  return (
    <div className="container">
      <div className="card auth-container" style={{ borderTop: '4px solid #dc3545' }}>
        <h2 className="text-center mb-4" style={{color: '#dc3545'}}>Admin Secure Login</h2>
        {error && <div className="badge badge-rejected" style={{display: 'block', marginBottom: '15px'}}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Admin Username</label>
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group text-center mt-4">
            <button className="btn btn-danger" style={{width: '100%'}}>Admin Authentication</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
