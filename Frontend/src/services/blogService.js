import api from './api';

export const blogService = {
  getBlogs: async (page = 1, limit = 9) => {
    try {
      const response = await api.get(`/blogs?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw error;
    }
  },

  // We didn't use it
  getBlogById: async (id) => {
    try {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog ${id}:`, error);
      throw error;
    }
  }
};