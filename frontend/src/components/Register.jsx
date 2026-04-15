import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    resumeLink: '',
    phoneNumber: '',
    skills: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { username, email, password, role, resumeLink, phoneNumber, skills } = formData;

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register(username, email, password, role, resumeLink, phoneNumber, skills);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                <UserPlus size={32} color="var(--primary)" />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Join Us</h1>
              <p className="text-muted">Create your account and find your next role</p>
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

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Username</label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="johndoe"
                    value={username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="john@example.com"
                    value={email}
                    onChange={handleChange}
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
                    name="password"
                    className="form-control"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  className="form-control"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Resume Link (e.g. Drive/Dropbox)</label>
                <input
                  type="url"
                  name="resumeLink"
                  className="form-control"
                  placeholder="https://..."
                  value={resumeLink}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Skills (comma separated)</label>
                <textarea
                  name="skills"
                  className="form-control"
                  placeholder="Java, React, SQL, etc."
                  value={skills}
                  onChange={handleChange}
                  rows="2"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Register As</label>
                <select name="role" className="form-control" value={role} onChange={handleChange}>
                  <option value="user">Job Seeker</option>
                  <option value="admin">Employer/Admin</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
              <p className="text-muted">
                Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
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
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Step into your future.</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Join thousands of professionals finding their dream roles every single day.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
