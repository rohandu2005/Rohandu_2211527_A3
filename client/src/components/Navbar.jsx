import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-16">
          <div className="mr-auto">
            <Link
              to="/todos"
              className="text-black hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
          </div>
          <div>
            <Link
              to="/profile"
              className="text-black hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Profile
            </Link>
          </div>
          <div>
            <div
              className="text-black hover:bg-purple-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
