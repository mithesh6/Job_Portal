import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';

const Login = () => {
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
          navigate('/dashboard');
        }
      },
      (error) => {
        setError('Invalid username or password');
      }
    );
  };

  return (
    <div className="container">
      <div className="card auth-container">
        <h2 className="text-center mb-4 text-primary">User Login</h2>
        {error && <div className="badge badge-rejected" style={{display: 'block', marginBottom: '15px'}}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group text-center mt-4">
            <button className="btn btn-primary" style={{width: '100%'}}>Login</button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
