import api from './api';

export const galleryService = {
  // Fetch all categories
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      // Based on your JSON: response.data.data.data contains the array
      return response.data; 
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Fetch pictures (supports category filter via API)
  getPictures: async (page = 1, limit = 500, categoryId = null) => {
    try {
      let url = `/pictures?page=${page}&limit=${limit}`;
      // We pass the category ID to the server to ensure we get the right images across all pages
      if (categoryId) {
        url += `&category=${categoryId}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching pictures:", error);
      throw error;
    }
  },
  getVideos: async (page = 1, limit = 500) => {
    try {
      let url = `/videos?page=${page}&limit=${limit}`;
      // We pass the category ID to the server to ensure we get the right images across all pages
    
      const response = await api.get(url);
      console.log("Videos response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  }
};