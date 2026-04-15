import React, { useState, useEffect } from 'react';
import jobService from '../services/job.service';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2, Calendar, ArrowRight, Briefcase } from 'lucide-react';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService.getAllJobs().then(
      (response) => {
        setJobs(response.data);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching jobs', error);
        setLoading(false);
      }
    );
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="page-wrapper"
    >
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hero-title"
            >
              Elevate Your Career <br /> In One Click.
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="hero-subtitle"
            >
              Connect with top companies and find the perfect role that matches your ambition. Start your journey today.
            </motion.p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ display: 'flex', gap: '1rem' }}
            >
              <button className="btn btn-primary">
                Explore Jobs <ArrowRight size={18} />
              </button>
              <button className="btn btn-outline">
                How it Works
              </button>
            </motion.div>
          </div>
          <div className="hero-image-container">
            <motion.img 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 0.9 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              src="/hero.png" 
              alt="Job Portal Meta" 
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Jobs Listing Section */}
      <div className="container" style={{ paddingBottom: '6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Latest Opportunities</h2>
            <p className="text-muted">Discover the newest roles from top-tier companies.</p>
          </div>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="form-control" 
              style={{ paddingLeft: '2.5rem', width: '300px' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ display: 'inline-block' }}
            >
              <Briefcase size={40} color="var(--primary)" />
            </motion.div>
            <p className="mt-4 text-muted">Fetching latest jobs...</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid"
          >
            {jobs.map((job) => (
              <motion.div key={job.id} variants={itemVariants} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ background: '#f1f5f9', p: 10, borderRadius: 12, padding: 10 }}>
                    <Building2 size={24} color="var(--primary)" />
                  </div>
                  <span className="badge badge-applied">Full Time</span>
                </div>
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{job.title}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#64748b' }}>
                    <Building2 size={14} /> {job.company}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#64748b' }}>
                    <MapPin size={14} /> {job.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#64748b' }}>
                    <Calendar size={14} /> {new Date(job.datePosted).toLocaleDateString()}
                  </div>
                </div>

                <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1.5rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {job.description}
                </p>

                <button className="btn btn-outline" style={{ width: '100%' }}>
                  View Details
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;
