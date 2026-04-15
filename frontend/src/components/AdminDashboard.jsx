import React, { useState, useEffect } from 'react';
import jobService from '../services/job.service';
import applicationService from '../services/application.service';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, PlusCircle, Briefcase, Users, 
  Edit3, Trash2, XCircle, CheckCircle, 
  Clock, MapPin, Building2, ExternalLink,
  ChevronRight
} from 'lucide-react';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', company: '', location: '', skills: '' });
  const [editingId, setEditingId] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [viewingJob, setViewingJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadJobs = () => {
    jobService.getAllJobs().then(res => {
      setJobs(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { loadJobs(); }, []);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      jobService.updateJob(editingId, formData).then(() => {
        setFormData({ title: '', description: '', company: '', location: '', skills: '' });
        loadJobs();
      });
    } else {
      jobService.createJob(formData).then(() => {
        setFormData({ title: '', description: '', company: '', location: '', skills: '' });
        loadJobs();
      });
    }
  };

  const handleEdit = (job) => {
    setEditingId(job.id);
    setFormData({ title: job.title, description: job.description, company: job.company, location: job.location, skills: job.skills || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this job post?')) {
      jobService.deleteJob(id).then(() => loadJobs());
    }
  };

  const viewApplications = (job) => {
    setViewingJob(job);
    applicationService.getApplicationsForJob(job.id).then(res => {
      setJobApplications(res.data);
    });
  };

  const handleStatusUpdate = (appId, status) => {
    applicationService.updateApplicationStatus(appId, status).then(() => {
      viewApplications(viewingJob);
    });
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
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', p: 10, borderRadius: 12, padding: 10 }}>
          <ShieldCheck size={28} color="#ef4444" />
        </div>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Admin Console</h2>
      </div>
      
      <div className="grid" style={{ gridTemplateColumns: 'minmax(350px, 1fr) 2fr' }}>
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {editingId ? <Edit3 size={20} /> : <PlusCircle size={20} />}
            {editingId ? 'Edit Job Posting' : 'Post New Opportunity'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title</label>
              <input type="text" name="title" className="form-control" placeholder="e.g. Senior Frontend Engineer" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" name="company" className="form-control" placeholder="e.g. TechCorp Inc." value={formData.company} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" className="form-control" placeholder="e.g. Remote / San Francisco" value={formData.location} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Job Description</label>
              <textarea name="description" className="form-control" rows="5" placeholder="Detailed job requirements..." value={formData.description} onChange={handleChange} required></textarea>
            </div>
            <div className="form-group">
              <label>Required Skills (comma separated)</label>
              <input type="text" name="skills" className="form-control" placeholder="e.g. Java, React, SQL" value={formData.skills} onChange={handleChange} />
            </div>
            <button className="btn btn-primary mt-4" style={{ width: '100%' }}>
              {editingId ? 'Update Posting' : 'Publish Job'}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="btn btn-outline mt-2" 
                style={{ width: '100%' }} 
                onClick={() => {setEditingId(null); setFormData({ title: '', description: '', company: '', location: '', skills: '' })}}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={20} /> Active Job Postings
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Job Details</th>
                  <th>Company</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{job.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {job.location}
                      </div>
                    </td>
                    <td>{job.company}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button className="btn btn-primary" title="View Applications" style={{ padding: '6px' }} onClick={() => viewApplications(job)}>
                          <Users size={16} />
                        </button>
                        <button className="btn btn-outline" title="Edit" style={{ padding: '6px' }} onClick={() => handleEdit(job)}>
                          <Edit3 size={16} />
                        </button>
                        <button className="btn btn-outline" title="Delete" style={{ padding: '6px', color: '#ef4444', borderColor: '#fee2e2' }} onClick={() => handleDelete(job.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {viewingJob && (
        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="card mt-4" 
          style={{ borderTop: '4px solid var(--primary)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Applications for {viewingJob.title}</h3>
              <p className="text-muted">{viewingJob.company} • {viewingJob.location}</p>
            </div>
            <button className="btn btn-outline" onClick={() => setViewingJob(null)}>
              <XCircle size={18} /> Close View
            </button>
          </div>
          
          {jobApplications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Users size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
              <p className="text-muted">No one has applied for this position yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Contact Info</th>
                    <th>Date Applied</th>
                    <th>Current Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobApplications.map(app => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 600 }}>{app.user.username}</td>
                      <td>
                        <div style={{ fontSize: '0.9rem' }}>{app.user.email}</div>
                        {app.user.phoneNumber && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{app.user.phoneNumber}</div>}
                        {app.user.resumeLink && (
                          <a href={app.user.resumeLink} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', marginTop: '4px' }}>
                            View Resume <ExternalLink size={12} />
                          </a>
                        )}
                      </td>
                      <td style={{ fontSize: '0.9rem' }}>{new Date(app.applicationDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-${app.status.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ChevronRight size={16} color="#94a3b8" />
                          <select 
                            value={app.status} 
                            onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                            className="form-control" 
                            style={{ width: '140px', padding: '4px 8px', fontSize: '0.85rem' }}
                          >
                            <option value="APPLIED">Applied</option>
                            <option value="REVIEWING">Reviewing</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
