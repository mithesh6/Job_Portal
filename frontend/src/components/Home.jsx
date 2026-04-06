import React, { useState, useEffect } from 'react';
import jobService from '../services/job.service';

const Home = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    jobService.getAllJobs().then(
      (response) => {
        setJobs(response.data);
      },
      (error) => {
        console.error('Error fetching jobs', error);
      }
    );
  }, []);

  return (
    <div className="container">
      <div className="text-center mb-4">
        <h1 style={{ color: '#007bff' }}>Welcome to JobPortal</h1>
        <p className="text-muted">Find your dream job today. Browse our latest listings below.</p>
      </div>

      <div className="grid">
        {jobs.map((job) => (
          <div key={job.id} className="card">
            <h3 style={{ color: '#0056b3' }}>{job.title}</h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              Posted on: {new Date(job.datePosted).toLocaleDateString()}
            </p>
            <p>{job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
