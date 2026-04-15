import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await authService.login(username, password);
      if (user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-wrapper">
      {/* Form Side */}
      <div className="auth-form-side">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          style={{ width: '100%', maxWidth: '420px' }}
        >
          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'inline-flex', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', padding: '12px', marginBottom: '1rem' }}>
                <LogIn size={32} color="var(--primary)" />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Welcome Back</h1>
              <p className="text-muted">Enter your credentials to access your account</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '8px', 
                  background: '#fee2e2', color: '#991b1b', 
                  padding: '0.75rem', borderRadius: 'var(--radius)', 
                  marginBottom: '1.5rem', fontSize: '0.9rem' 
                }}
              >
                <AlertCircle size={18} /> {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Username</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                  <input
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                  <input
                    type="password"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                {loading ? 'Logging in...' : 'Sign In'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
              <p className="text-muted">
                Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
              </p>
            </div>
          </div>
          
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.9rem', marginTop: '1.5rem' }}>
            <ArrowLeft size={16} /> Back to home
          </Link>
        </motion.div>
      </div>

      {/* Visual Side */}
      <div className="auth-visual-side">
        <img src="/hero.png" alt="Collaborative workplace" className="auth-visual-image" />
        <div className="auth-visual-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Welcome Back!</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Your next big career move is just a few clicks away. Log in to continue your journey.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
