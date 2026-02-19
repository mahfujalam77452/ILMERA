import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Pictures from "./pages/Pictures";
import Videos from "./pages/Videos";
import Activities from "./pages/Activities";
import Blogs from "./pages/Blogs";
import VolunteerRequests from "./pages/VolunteerRequests";
import VolunteerList from "./pages/VolunteerList";
import Contacts from "./pages/Contacts";
import Donations from "./pages/Donations";
import ChangePassword from "./pages/ChangePassword";
import Appeals from "./pages/Appeals";
import CurrentProject from "./pages/CurrentProject";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner text="Loading..." />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/pictures" element={<Pictures />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route
                path="/volunteer-requests"
                element={<VolunteerRequests />}
              />
              <Route path="/volunteer-list" element={<VolunteerList />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/appeals" element={<Appeals />} />
              <Route path="/current-project" element={<CurrentProject />} />
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#000",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            },
            success: {
              style: {
                background: "#10b981",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#10b981",
              },
            },
            error: {
              style: {
                background: "#ef4444",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#ef4444",
              },
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
};

export default App;
