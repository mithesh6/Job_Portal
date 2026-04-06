import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    resumeLink: '',
    phoneNumber: '',
    role: 'user'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = (e) => {
    e.preventDefault();
    authService.register(formData.username, formData.email, formData.password, formData.role, formData.resumeLink, formData.phoneNumber)
      .then(
        (response) => {
          setMessage(response.data.message || 'Registration successful');
          setError('');
          setTimeout(() => navigate('/login'), 2000);
        },
        (error) => {
          setError(error.response?.data?.message || 'Registration failed');
          setMessage('');
        }
      );
  };

  return (
    <div className="container">
      <div className="card auth-container" style={{maxWidth: '500px'}}>
        <h2 className="text-center mb-4 text-primary">Create an Account</h2>
        {message && <div className="badge badge-accepted" style={{display: 'block', marginBottom: '15px'}}>{message}</div>}
        {error && <div className="badge badge-rejected" style={{display: 'block', marginBottom: '15px'}}>{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" className="form-control" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="form-control" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number (Optional)</label>
            <input type="text" name="phoneNumber" className="form-control" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Resume Link (Optional)</label>
            <input type="url" name="resumeLink" className="form-control" onChange={handleChange} />
          </div>
          <div className="form-group text-center mt-4">
            <button className="btn btn-primary" style={{width: '100%'}}>Register</button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
