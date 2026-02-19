import React, { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AccountDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleChangePassword = () => {
    setIsOpen(false);
    navigate("/change-password");
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
          {user?.email?.[0]?.toUpperCase() || "A"}
        </div>
        <ChevronDown
          size={18}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm text-gray-600">Logged in as</p>
            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
          </div>

          <button
            onClick={handleChangePassword}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm"
          >
            Change Password
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm border-t border-gray-200 flex items-center gap-2 text-red-600"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
