import React from "react";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main className="flex-1 ml-40 mt-10 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
