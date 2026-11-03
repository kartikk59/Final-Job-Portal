import api from './api';

export const jobService = {
  // Get jobs/internships with filters
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  // Get single job by ID
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create job (Recruiter)
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update job (Recruiter)
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete job (Recruiter)
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Toggle save/unsave
  toggleSaveJob: async (id) => {
    const response = await api.post(`/jobs/${id}/save`);
    return response.data;
  },

  // Get saved jobs list
  getSavedJobs: async () => {
    const response = await api.get('/jobs/saved');
    return response.data;
  },

  // Submit job application
  applyForJob: async (id, applicationData) => {
    const response = await api.post(`/jobs/${id}/apply`, applicationData);
    return response.data;
  },

  // Get student application history
  getMyApplications: async () => {
    const response = await api.get('/jobs/applications');
    return response.data;
  },

  // Get student job alerts
  getJobAlerts: async () => {
    const response = await api.get('/jobs/alerts');
    return response.data;
  },

  // Create new job alert
  createJobAlert: async (alertData) => {
    const response = await api.post('/jobs/alerts', alertData);
    return response.data;
  },

  // Delete job alert
  deleteJobAlert: async (id) => {
    const response = await api.delete(`/jobs/alerts/${id}`);
    return response.data;
  },
};
