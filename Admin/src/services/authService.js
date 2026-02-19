import api from "./api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/admin/login", { email, password });
    return response.data;
  },

  updatePassword: async (oldPassword, newPassword) => {
    const response = await api.post("/admin/update-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  getToken: () => localStorage.getItem("adminToken"),

  getUser: () => {
    const user = localStorage.getItem("adminUser");
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  },

  setAuthData: (token, user) => {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(user));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("adminToken");
  },
};
