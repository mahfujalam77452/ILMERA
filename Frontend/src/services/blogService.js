import api from "./api";

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

  // Fetch single blog by slug
  getBlogBySlug: async (slug) => {
    try {
      const response = await api.get(`/blogs/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog ${slug}:`, error);
      throw error;
    }
  },
};
