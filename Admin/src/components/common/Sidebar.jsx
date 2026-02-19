import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  Image,
  Video,
  Activity,
  BookOpen,
  Users,
  Heart,
  MessageSquare,
  DollarSign,
  AlertCircle,
  Zap,
} from "lucide-react";
import { ROUTES } from "../../utils/constants";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
    { path: ROUTES.CATEGORIES, label: "Categories", icon: Layers },
    { path: ROUTES.PICTURES, label: "Pictures", icon: Image },
    { path: ROUTES.VIDEOS, label: "Videos", icon: Video },
    { path: ROUTES.ACTIVITIES, label: "Activities", icon: Activity },
    { path: ROUTES.BLOGS, label: "Blogs", icon: BookOpen },
    {
      path: ROUTES.VOLUNTEER_REQUESTS,
      label: "Volunteer Requests",
      icon: Users,
    },
    { path: ROUTES.VOLUNTEER_LIST, label: "Volunteer List", icon: Heart },
    { path: ROUTES.CONTACTS, label: "Contacts", icon: MessageSquare },
    { path: ROUTES.DONATIONS, label: "Donations", icon: DollarSign },
    { path: ROUTES.APPEALS, label: "Appeals", icon: AlertCircle },
    { path: ROUTES.CURRENT_PROJECT, label: "Current Project", icon: Zap },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white fixed left-0 top-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">ILMERA</h1>
        <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
      </div>

      {/* Menu Items */}
      <nav className="px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
