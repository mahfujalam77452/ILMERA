import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { useAuth } from "../hooks/useAuth";
import { validations } from "../utils/validations";

const Login = () => {
  const [email, setEmail] = useState("admin@ilmera.com");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!validations.isEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!validations.isPassword(password)) {
      newErrors.password = "Password must be at least 6 characters";
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
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <Card className="w-full max-w-md shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">ILMERA</h1>
          <p className="text-gray-600">Admin Panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Default credentials:
            <br />
            <span className="font-mono text-xs">
              admin@ilmera.com / admin@123
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
