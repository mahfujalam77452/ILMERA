// src/services/projectService.js
import api from './api';

export const projectService = {
  getCurrentProject: async () => {
    const response = await api.get('/current-project');
    return response.data;
  }
};