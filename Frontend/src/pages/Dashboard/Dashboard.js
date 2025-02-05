import React, { useState } from "react";
import Navbar from "../../shared/Navbar";
const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = ["Food", "Travel", "Utilities"];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <section className="container mx-auto px-8 py-12">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md rounded-lg p-6 mb-12">
          <h2 className="text-3xl font-bold">Welcome back, John!</h2>
          <p className="mt-2">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Overall Balance with Pie Chart */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-blue-600 mb-8 text-center">
            Overall Balance
          </h3>
          <div className="bg-white shadow-md rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="text-center md:text-left">
                <h4 className="font-bold text-xl">Balance Overview</h4>
                <p className="text-gray-600 mt-2">
                  Your current financial status at a glance.
                </p>
              </div>
              <div className="flex justify-center">
                {/* Replace with actual pie chart component or image */}
                <img
                  src="Images/pie_chart.png"
                  alt="Balance Pie Chart"
                  className="w-64 h-64"
                />
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-600 mb-2">Net Balance</p>
                <p className="text-4xl font-bold text-green-500">$500</p>
              </div>
            </div>
            <div className="flex justify-between border-t mt-8 pt-4">
              <div className="flex-1 text-center border-r">
                <p className="text-gray-600 mb-2">Amount Owed</p>
                <p className="text-2xl font-bold text-red-500">$2,000</p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-gray-600 mb-2">Amount Due</p>
                <p className="text-2xl font-bold text-green-500">$1,500</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activities and Upcoming Settlements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Recent Activities */}
          <section>
            <h3 className="text-2xl font-bold text-blue-600 mb-4">
              Recent Activities
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white shadow-md rounded-lg p-4 flex items-center hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 7H7v6h6V7z" />
                      <path
                        fillRule="evenodd"
                        d="M5 3a2 2 0 00-2 2v4h2V5h10v10h-4v2h4a2 2 0 002-2V5a2 2 0 00-2-2H5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold">Expense Name</p>
                    <p className="text-gray-600">Category</p>
                  </div>
                  <p className="font-bold text-red-500">$50</p>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Settlements */}
          <section>
            <h3 className="text-2xl font-bold text-blue-600 mb-4">
              Upcoming Settlements
            </h3>
            <div className="space-y-4">
              <div className="bg-white shadow-md rounded-lg p-6 flex items-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 4.5C9 3.67 9.67 3 10.5 3h3a.5.5 0 010 1h-3a.5.5 0 00-.5.5v3a.5.5 0 01-1 0v-3z" />
                    <path d="M13 7H7v6h6V7z" />
                    <path
                      fillRule="evenodd"
                      d="M5 3a2 2 0 00-2 2v4h2V5h10v10h-4v2h4a2 2 0 002-2V5a2 2 0 00-2-2H5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Next Payment</p>
                  <p className="text-gray-600">Settle up with Jane by Friday</p>
                </div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6 flex items-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 8a1 1 0 100 2h5a1 1 0 100-2h-5z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a1 1 0 011-1h9a1 1 0 100-2H5a3 3 0 00-3 3v9a1 1 0 102 0V5z"
                      clipRule="evenodd"
                    />
                    <path d="M7 15a1 1 0 012 0v2.586L8.293 17.293a1 1 0 00-1.414 1.414l2.707 2.707A1 1 0 0010 21a1 1 0 00.707-.293l2.707-2.707a1 1 0 00-1.414-1.414L11 17.586V15a1 1 0 00-2 0v2.586L8.293 17.293a1 1 0 00-1.414 1.414l2.707 2.707A1 1 0 0010 21a1 1 0 00.707-.293l2.707-2.707a1 1 0 00-1.414-1.414L11 17.586V15a1 1 0 00-2 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Overdue</p>
                  <p className="text-gray-600">
                    Reminder to settle up with Mark
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Groups Overview */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-blue-600 mb-8 text-center">
            Groups Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Group Card */}
            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <img
                  src="Images/icon3.png"
                  alt="Family Group Icon"
                  className="w-8 h-8"
                />
              </div>
              <p className="font-semibold">Family Group</p>
              <p className="text-gray-600 text-sm">Last activity: Today</p>
              <p className="text-2xl font-bold text-green-500 mt-2">$500</p>
            </div>

            {/* Repeat for other groups */}
            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                <img
                  src="Images/icon1.png"
                  alt="Friends Group Icon"
                  className="w-8 h-8"
                />
              </div>
              <p className="font-semibold">Friends Group</p>
              <p className="text-gray-600 text-sm">Last activity: 2 days ago</p>
              <p className="text-2xl font-bold text-green-500 mt-2">$300</p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                <img
                  src="Images/icon2.png"
                  alt="Party Planning Icon"
                  className="w-8 h-8"
                />
              </div>
              <p className="font-semibold">Party Planning</p>
              <p className="text-gray-600 text-sm">Last activity: 1 week ago</p>
              <p className="text-2xl font-bold text-green-500 mt-2">$150</p>
            </div>
          </div>
        </section>

        {/* Add Expense */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-blue-600 text-center mb-8">
            Add Expense
          </h3>
          <div className="bg-white shadow-md rounded-lg p-8 w-full md:w-1/2 mx-auto">
            <form className="space-y-6">
              {/* Amount Field */}
              <div className="relative">
                <input
                  type="number"
                  placeholder=" "
                  className="peer block w-full appearance-none focus:outline-none bg-transparent border-b border-gray-400 focus:border-blue-600 py-2"
                  required
                />
                <label
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                  peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                >
                  Amount
                </label>
              </div>

              {/* Category Selection */}
              <div>
                <p className="text-gray-600 text-left mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategorySelect(category)}
                      className={`px-4 py-2 rounded-md border ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300"
                      } transition-colors duration-300`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description Field */}
              <div className="relative">
                <input
                  type="text"
                  placeholder=" "
                  className="peer block w-full appearance-none focus:outline-none bg-transparent border-b border-gray-400 focus:border-blue-600 py-2"
                  required
                />
                <label
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                  peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                >
                  Description
                </label>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded-md px-6 py-2 font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Budgets Overview */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-blue-600 mb-8 text-center">
            Budgets Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Budget Card */}
            <div className="bg-white shadow-md rounded-lg p-6 flex items-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <img
                  src="Images/budget.png"
                  alt="Monthly Budget Icon"
                  className="w-8 h-8"
                />
              </div>
              <div>
                <p className="font-semibold">Monthly Budget</p>
                <p className="text-gray-600">Current: $1000 | Spent: $800</p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 flex items-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <img
                  src="Images/vacation.png"
                  alt="Vacation Fund Icon"
                  className="w-8 h-8"
                />
              </div>
              <div>
                <p className="font-semibold">Vacation Fund</p>
                <p className="text-gray-600">Current: $500 | Goal: $1000</p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
