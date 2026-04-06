import React, { useState, useEffect } from 'react';
import jobService from '../services/job.service';
import applicationService from '../services/application.service';

const UserDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');

  const loadData = () => {
    jobService.getAllJobs().then((res) => setJobs(res.data));
    applicationService.getMyApplications().then((res) => setApplications(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApply = (jobId) => {
    applicationService.applyForJob(jobId).then(
      (res) => {
        setMessage(res.data.message);
        loadData();
      },
      (err) => {
        setMessage(err.response?.data?.message || 'Error applying');
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
    <div className="container">
      <h2 className="mb-4 text-primary">My Dashboard</h2>
      {message && <div style={{padding: '10px', backgroundColor: '#e9ecef', marginBottom: '20px', borderRadius: '4px'}}>{message}</div>}
      
      <div className="grid">
        <div className="card" style={{gridColumn: '1 / -1'}}>
          <h3>My Applications</h3>
          {applications.length === 0 ? <p className="text-muted">No applications yet.</p> : (
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
                    <td>{app.job?.title}</td>
                    <td>{app.job?.company}</td>
                    <td>{new Date(app.applicationDate).toLocaleDateString()}</td>
                    <td>{getStatusBadge(app.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <h3 className="mt-4">Available Jobs</h3>
      <div className="grid">
        {jobs.map((job) => (
          <div key={job.id} className="card">
            <h4 style={{ color: '#0056b3' }}>{job.title}</h4>
            <p><strong>{job.company}</strong> | {job.location}</p>
            <p className="text-muted">{job.description.substring(0, 80)}...</p>
            <div className="mt-4">
              {hasApplied(job.id) ? (
                <button className="btn btn-outline" disabled>Applied</button>
              ) : (
                <button className="btn btn-primary" onClick={() => handleApply(job.id)}>Apply Now</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
