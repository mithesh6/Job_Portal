import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          JobPortal
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          
          {currentUser ? (
            <>
              {currentUser.role === 'ROLE_ADMIN' ? (
                <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
              ) : (
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              )}
              <span style={{ cursor: 'pointer' }} className="nav-link text-danger" onClick={handleLogout}>
                Logout ({currentUser.username})
              </span>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
              <Link to="/admin-login" className="nav-link">Admin</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
