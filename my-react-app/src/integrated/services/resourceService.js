import api from './api';

export const resourceService = {
  // Get all resources with search/filter/sort
  getResources: async (params = {}) => {
    const response = await api.get('/resources', { params });
    return response.data;
  },

  // Get single resource
  getResourceById: async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  // Add new resource (supports FormData for PDF uploads)
  createResource: async (formData) => {
    const response = await api.post('/resources', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete resource
  deleteResource: async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  },

  // Toggle like
  likeResource: async (id) => {
    const response = await api.post(`/resources/${id}/like`);
    return response.data;
  },
};
