import api from './api';

export const volunteerService = {
  register: async (formData) => {
    try {
      // FIX: Do NOT set headers manually. 
      // Axios automatically sets 'Content-Type: multipart/form-data; boundary=...'
      const response = await api.post('/volunteers', formData,{
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      return response.data;
    } catch (error) {
      console.error("Volunteer registration error:", error);
      throw error;
    }
  }
};