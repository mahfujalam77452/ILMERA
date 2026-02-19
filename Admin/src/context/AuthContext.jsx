import React, { createContext, useState, useCallback } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      const { token: newToken, admin } = response.data;

      authService.setAuthData(newToken, admin);
      setToken(newToken);
      setUser(admin);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const updatePassword = useCallback(async (oldPassword, newPassword) => {
    setLoading(true);
    try {
      const response = await authService.updatePassword(
        oldPassword,
        newPassword,
      );
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
