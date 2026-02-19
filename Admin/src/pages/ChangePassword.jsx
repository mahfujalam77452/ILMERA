import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminLayout from "../components/layouts/AdminLayout";
import PageHeader from "../components/common/PageHeader";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { useAuth } from "../hooks/useAuth";
import { validations } from "../utils/validations";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!validations.isPassword(oldPassword)) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!validations.isPassword(newPassword)) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (oldPassword === newPassword) {
      newErrors.newPassword =
        "New password must be different from old password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors above");
      return;
    }

    try {
      setLoading(true);
      await updatePassword(oldPassword, newPassword);
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Change Password" />

      <Card className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            error={errors.oldPassword}
            placeholder="Enter your current password"
            required
            autoFocus
          />

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            placeholder="Enter your new password"
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            placeholder="Confirm your new password"
            required
          />

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              {loading ? "Updating..." : "Change Password"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="mt-6 bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">ℹ️ Security Tip:</span> Use a strong
          password with a mix of uppercase, lowercase, numbers, and special
          characters for better security.
        </p>
      </Card>
    </AdminLayout>
  );
};

export default ChangePassword;
