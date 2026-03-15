// src/services/appealService.js
import api from "./api"; // Assuming this exports your axios instance

export const appealService = {
  // Fetch the list of all appeals
  getAllAppeals: async () => {
    const response = await api.get("/appeals");
    return response.data;
  },

  // Fetch a single appeal details by slug
  getAppealBySlug: async (slug) => {
    const response = await api.get(`/appeals/${slug}`);
    return response.data;
  },
};
