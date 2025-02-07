import React from "react";
import logo from "../assets/images/Nav1.png"

const Navbar = () => {
  return (
    <div className="bg-black text-white py-4 px-6 flex items-center justify-between">
      {/* Logo Section */}
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Logo" className="w-25 h-auto" />
      </div>

    
    </div>
  );
};

export default Navbar;