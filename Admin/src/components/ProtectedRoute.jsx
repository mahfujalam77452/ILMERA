import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AdminLayout from "./layouts/AdminLayout";
import LoadingSpinner from "./common/LoadingSpinner";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner text="Loading..." />
      </AdminLayout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

export default ProtectedRoute;
