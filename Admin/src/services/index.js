import api from "./api";

export const categoryService = {
  getAll: async (page = 1, limit = 100) => {
    const response = await api.get("/categories", { params: { page, limit } });
    return response.data;
  },

  add: async (categoryName) => {
    const response = await api.post("/categories", { category: categoryName });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const pictureService = {
  getAll: async (page = 1, limit = 20, categoryId = "") => {
    const params = { page, limit };
    if (categoryId) {
      params.category = categoryId;
    }
    const response = await api.get("/pictures", { params });
    return response.data;
  },

  add: async (categoryId, file) => {
    const formData = new FormData();
    formData.append("category", categoryId);
    formData.append("image", file);

    const response = await api.post("/pictures", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/pictures/${id}`);
    return response.data;
  },
};

export const videoService = {
  getAll: async (page = 1, limit = 20) => {
    const response = await api.get("/videos", { params: { page, limit } });
    return response.data;
  },

  add: async (title, videoLink) => {
    const response = await api.post("/videos", {
      title,
      video_link: videoLink,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  },
};

export const activityService = {
  getAll: async (page = 1, limit = 20) => {
    const response = await api.get("/activities", { params: { page, limit } });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },

  add: async (formData) => {
    const response = await api.post("/activities", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/activities/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  },
};

export const blogService = {
  getAll: async (page = 1, limit = 20) => {
    const response = await api.get("/blogs", { params: { page, limit } });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  add: async (formData) => {
    const response = await api.post("/blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/blogs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },
};

export const volunteerService = {
  getAll: function (params = {}, limit, isMember) {
    // Support both old API (page, limit, isMember) and new API (params object)
    let queryParams = {};

    if (typeof params === "object" && !Number.isInteger(params)) {
      // New API: object with all parameters
      queryParams = params;
    } else {
      // Old API: (page, limit, isMember) - for backward compatibility
      const page = params;
      queryParams = { page, limit };
      if (isMember !== null && isMember !== undefined) {
        queryParams.is_member = isMember;
      }
    }

    return (async () => {
      const response = await api.get("/volunteers", { params: queryParams });
      return response.data;
    })();
  },

  setMember: async (id) => {
    const response = await api.patch(`/volunteers/${id}/member`, {});
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/volunteers/${id}`);
    return response.data;
  },
};

export const donationService = {
  getAll: async (params = {}) => {
    const response = await api.get("/donations", { params });
    return response.data;
  },

  updateStatus: async (id, status, chargeId) => {
    const response = await api.patch(`/donations/${id}/status`, {
      payment_status: status,
      stripe_charge_id: chargeId,
    });
    return response.data;
  },
};

export const contactService = {
  get: async () => {
    const response = await api.get("/contact");
    return response.data;
  },

  update: async (contactData) => {
    const response = await api.patch("/contact", contactData);
    return response.data;
  },
};

export const appealService = {
  getAll: async (page = 1, limit = 20) => {
    const response = await api.get("/appeals", { params: { page, limit } });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/appeals/${id}`);
    return response.data;
  },

  add: async (formData) => {
    const response = await api.post("/appeals", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/appeals/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/appeals/${id}`);
    return response.data;
  },
};

export const currentProjectService = {
  get: async () => {
    const response = await api.get("/current-project");
    return response.data;
  },

  update: async (formData) => {
    const response = await api.put("/current-project", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
