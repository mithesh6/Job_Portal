import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, LogIn, UserPlus, Home, LayoutDashboard, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="navbar-brand">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Briefcase size={28} strokeWidth={2.5} />
          </motion.div>
          <span>JobPortal</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            <motion.div whileHover={{ y: -2 }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Home size={18} /> Home
            </motion.div>
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="nav-link">
                <motion.div whileHover={{ y: -2 }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LogIn size={18} /> Login
                </motion.div>
              </Link>
              <Link to="/register" className="btn btn-primary">
                <UserPlus size={18} /> Register
              </Link>
            </>
          ) : (
            <>
              <Link to={user.roles?.includes('ROLE_ADMIN') ? "/admin/dashboard" : "/dashboard"} className="nav-link">
                <motion.div whileHover={{ y: -2 }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LayoutDashboard size={18} /> Dashboard
                </motion.div>
              </Link>
              <button onClick={logout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
