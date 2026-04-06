import api from './api';

const getAllJobs = () => {
  return api.get('/jobs');
};

const getJob = (id) => {
  return api.get(`/jobs/${id}`);
};

const createJob = (data) => {
  return api.post('/jobs', data);
};

const updateJob = (id, data) => {
  return api.put(`/jobs/${id}`, data);
};

const deleteJob = (id) => {
  return api.delete(`/jobs/${id}`);
};

const jobService = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};

export default jobService;
