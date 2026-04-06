import React, { useState, useEffect } from 'react';
import jobService from '../services/job.service';
import applicationService from '../services/application.service';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', company: '', location: '' });
  const [editingId, setEditingId] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [viewingJob, setViewingJob] = useState(null);

  const loadJobs = () => jobService.getAllJobs().then(res => setJobs(res.data));

  useEffect(() => { loadJobs(); }, []);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      jobService.updateJob(editingId, formData).then(() => {
        setEditingId(null);
        setFormData({ title: '', description: '', company: '', location: '' });
        loadJobs();
      });
    } else {
      jobService.createJob(formData).then(() => {
        setFormData({ title: '', description: '', company: '', location: '' });
        loadJobs();
      });
    }
  };

  const handleEdit = (job) => {
    setEditingId(job.id);
    setFormData({ title: job.title, description: job.description, company: job.company, location: job.location });
  };

  const handleDelete = (id) => {
    if(window.confirm('Delete this job post?')) {
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
    <div className="container">
      <h2 className="mb-4" style={{color: '#dc3545'}}>Admin Dashboard</h2>
      
      <div className="grid">
        <div className="card">
          <h3>{editingId ? 'Edit Job' : 'Post New Job'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input type="text" name="company" className="form-control" value={formData.company} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange} required></textarea>
            </div>
            <button className="btn btn-success mt-4" style={{width: '100%'}}>{editingId ? 'Update' : 'Post Job'}</button>
            {editingId && <button type="button" className="btn btn-outline mt-2" style={{width: '100%'}} onClick={() => {setEditingId(null); setFormData({ title: '', description: '', company: '', location: '' })}}>Cancel</button>}
          </form>
        </div>

        <div className="card" style={{gridColumn: 'span 2'}}>
          <h3>Manage Jobs</h3>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>
                    <button className="btn btn-primary" style={{padding: '5px 10px', marginRight: '5px'}} onClick={() => viewApplications(job)}>Apps</button>
                    <button className="btn btn-outline" style={{padding: '5px 10px', marginRight: '5px'}} onClick={() => handleEdit(job)}>Edit</button>
                    <button className="btn btn-danger" style={{padding: '5px 10px'}} onClick={() => handleDelete(job.id)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewingJob && (
        <div className="card mt-4">
          <h3>Applications for: {viewingJob.title} ({viewingJob.company})</h3>
          <button className="btn btn-outline mb-4" onClick={() => setViewingJob(null)}>Close</button>
          
          {jobApplications.length === 0 ? <p className="text-muted">No applications yet.</p> : (
            <table>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Contact Info</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobApplications.map(app => (
                  <tr key={app.id}>
                    <td>{app.user.username}</td>
                    <td>{app.user.email}</td>
                    <td>
                      {app.user.phoneNumber && <div>{app.user.phoneNumber}</div>}
                      {app.user.resumeLink && <a href={app.user.resumeLink} target="_blank" rel="noreferrer">View Resume</a>}
                    </td>
                    <td>{new Date(app.applicationDate).toLocaleDateString()}</td>
                    <td><span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span></td>
                    <td>
                      <select 
                        value={app.status} 
                        onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                        className="form-control" style={{width: '120px', padding: '5px'}}
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="REVIEWING">Reviewing</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
