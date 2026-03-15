import api from "./api";

export const activityService = {
  // Fetch paginated activities
  getAllActivities: async (page = 1, limit = 9) => {
    try {
      const response = await api.get(`/activities?page=${page}&limit=${limit}`);
      console.log("Fetched activities:", response.data); // Debugging line to check the response
      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error; // Let the component handle the error state/toast
    }
  },

  // Fetch single activity by slug
  getActivityBySlug: async (slug) => {
    try {
      const response = await api.get(`/activities/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${slug}:`, error);
      throw error;
    }
  },
};
