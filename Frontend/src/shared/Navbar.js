import React from "react";

const Navbar = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            JD
          </div>
          <h1 className="text-2xl font-bold text-blue-600">My Dashboard</h1>
        </div>
        <nav className="flex items-center space-x-6">
          <a href="/" className="text-gray-700 hover:text-blue-600">
            Dashboard
          </a>
          <a href="/" className="text-gray-700 hover:text-blue-600">
            Groups
          </a>
          <a href="/" className="text-gray-700 hover:text-blue-600">
            Expenses
          </a>
          <a href="/" className="text-gray-700 hover:text-blue-600">
            Budgets
          </a>
          <a href="/" className="text-gray-700 hover:text-blue-600">
            Notifications
          </a>
          <input
            type="text"
            placeholder="Search in site"
            className="border-b border-gray-300 focus:border-blue-500 px-4 py-1 focus:outline-none transition-colors duration-300"
          />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
