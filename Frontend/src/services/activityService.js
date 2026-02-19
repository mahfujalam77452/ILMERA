import api from './api';

export const activityService = {
  // Fetch paginated activities
  getAllActivities: async (page = 1, limit = 9) => {
    try {
      const response = await api.get(`/activities?page=${page}&limit=${limit}`);
      console.log('Fetched activities:', response.data); // Debugging line to check the response
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error; // Let the component handle the error state/toast
    }
  },

  // We can add fetch single activity later
  getActivityById: async (id) => {
    try {
      const response = await api.get(`/activities/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error);
      throw error;
    }
  }
};