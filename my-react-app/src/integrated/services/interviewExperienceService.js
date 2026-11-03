import api from './api';

export const interviewExperienceService = {
  getExperiences: async (params = {}) => {
    const response = await api.get('/interview-experiences', { params });
    return response.data;
  },

  createExperience: async (data) => {
    const response = await api.post('/interview-experiences', data);
    return response.data;
  },

  toggleHelpful: async (id) => {
    const response = await api.post(`/interview-experiences/${id}/vote`);
    return response.data;
  },

  getResources: async (params = {}) => {
    const response = await api.get('/interview-experiences/resources', { params });
    return response.data;
  },

  addResource: async (data) => {
    const response = await api.post('/interview-experiences/resources', data);
    return response.data;
  },
};
