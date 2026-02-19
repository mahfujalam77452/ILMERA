import React from "react";
import AccountDropdown from "./AccountDropdown";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 right-0 left-64 z-40">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Welcome back!</p>
        </div>
        <AccountDropdown />
      </div>
    </nav>
  );
};

export default Navbar;
