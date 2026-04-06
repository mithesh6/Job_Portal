import api from './api';

const applyForJob = (jobId) => {
  return api.post(`/applications/${jobId}`);
};

const getMyApplications = () => {
  return api.get('/applications/my');
};

const getApplicationsForJob = (jobId) => {
  return api.get(`/applications/job/${jobId}`);
};

const updateApplicationStatus = (applicationId, status) => {
  return api.put(`/applications/${applicationId}/status`, { status });
};

const applicationService = {
  applyForJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
};

export default applicationService;
