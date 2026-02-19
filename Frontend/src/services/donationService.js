import api from './api';

export const donationService = {
  // Initiate donation and get Client Secret
  initiateDonation: async (donationData) => {
    try {
      // POST request to /donations
      const response = await api.post('/donations', donationData);
      return response.data;
    } catch (error) {
      console.error("Donation Error:", error);
      throw error;
    }
  }
};