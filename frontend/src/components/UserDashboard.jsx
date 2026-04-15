import React, { useState, useEffect } from 'react';
import jobService from '../services/job.service';
import applicationService from '../services/application.service';
import { motion } from 'framer-motion';
import { LayoutDashboard, Briefcase, CheckCircle2, Building2, MapPin, Search } from 'lucide-react';

const UserDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'recommended'
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        jobService.getAllJobs(search || location ? { search, location } : null),
        applicationService.getMyApplications()
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
      
      // Separate fetch for recommendations to prevent blocking
      try {
        const recRes = await jobService.getRecommendations();
        setRecommendations(recRes.data);
      } catch (recErr) {
        console.warn("Could not fetch recommendations", recErr);
        setRecommendations([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, location]);

  const handleApply = (jobId) => {
    applicationService.applyForJob(jobId).then(
      (res) => {
        setMessage({ text: res.data.message, type: 'success' });
        loadData();
      },
      (err) => {
        setMessage({ text: err.response?.data?.message || 'Error applying', type: 'error' });
      }
    );
  };

  const getStatusBadge = (status) => {
    const cls = `badge badge-${status.toLowerCase()}`;
    return <span className={cls}>{status}</span>;
  };

  const hasApplied = (jobId) => {
    return applications.some(app => app.job?.id === jobId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="container mt-4"
      style={{ paddingBottom: '6rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem' }}>
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', p: 10, borderRadius: 12, padding: 10 }}>
          <LayoutDashboard size={28} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>My Dashboard</h2>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            padding: '1rem', 
            background: message.type === 'success' ? '#d1fae5' : '#fee2e2', 
            color: message.type === 'success' ? '#065f46' : '#991b1b',
            borderRadius: 'var(--radius)', 
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <Search size={18} />}
          {message.text}
        </motion.div>
      )}

      <div className="card" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={18} /> Find Your Next Role
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by title, role or keywords..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Location (e.g. Remote, NY)..." 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('all')}
        >
          All Jobs
        </button>
        <button 
          className={`btn ${activeTab === 'recommended' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('recommended')}
        >
          Recommended for You ✨
        </button>
      </div>
      
      <div className="card" style={{ marginBottom: '3rem', overflow: 'hidden' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={20} /> My Applications
        </h3>
        {applications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p className="text-muted">No applications yet. Start exploring jobs!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 600 }}>{app.job?.title}</td>
                    <td>{app.job?.company}</td>
                    <td>{new Date(app.applicationDate).toLocaleDateString()}</td>
                    <td>{getStatusBadge(app.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid">
        {(activeTab === 'all' ? jobs : recommendations).map((job) => (
          <motion.div 
            key={job.id} 
            whileHover={{ y: -4 }}
            className="card"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{job.title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} /> {job.company}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} /> {job.location}
                </div>
              </div>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {job.description}
              </p>
              {job.skills && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem' }}>
                  {job.skills.split(',').map((skill, i) => (
                    <span key={i} style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '12px', fontWeight: 500 }}>
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-auto">
              {hasApplied(job.id) ? (
                <button className="btn btn-outline" style={{ width: '100%' }} disabled>
                  <CheckCircle2 size={16} /> Applied
                </button>
              ) : (
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleApply(job.id)}>
                  Apply Now
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UserDashboard;
