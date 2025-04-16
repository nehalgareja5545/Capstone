import React, { useEffect, useState } from "react";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import getUser from "../../api/getUser";
import AddExpenseForm from "../../components/AddExpenseForm";
import getExpensesByUserId from "../../api/getExpensesByUserId";
import formatDate from "../../api/formatDate";
import { useNavigate } from "react-router";
import { getCloudinaryImageUrl } from "../../api/getCloudinaryImageUrl";

function ExpensePage() {
  const [userData, setUserData] = useState({});
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    const user = await getUser();
    if (user && Object.keys(user).length > 0) {
      setUserData(user);
      const expenses = await getExpensesByUserId(user._id);
      if (expenses && Array.isArray(expenses)) {
        setExpenses(expenses);
      }
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleExpenseAdded = () => {
    // Re-fetch expenses when a new expense is added
    fetchExpenses();
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 flex-grow">
        {/* Header Section */}
        <section className="flex flex-wrap justify-center items-center mb-12 bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md rounded-lg p-4 sm:p-8">
          <div className="flex flex-col items-center sm:flex-row sm:items-center">
            <div
              className="relative group cursor-pointer"
              onClick={() => document.getElementById("imageUpload").click()}
            >
              {/* Image or Initials */}
              {userData?.profilePicture ? (
                <img
                  src={getCloudinaryImageUrl(userData.profilePicture)}
                  alt="Profile"
                  className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-full border-4 border-white"
                />
              ) : (
                <div className="bg-white rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center">
                  <span className="text-2xl sm:text-4xl font-bold text-blue-500">
                    {userData?.email?.split("@")[0].slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("image", file);

                  try {
                    const res = await fetch(
                      `http://localhost:5000/expenses/api/profile-picture/${userData._id}`,
                      {
                        method: "POST",
                        body: formData,
                        credentials: "include", // important if you're using cookies/session
                      }
                    );

                    const result = await res.json();
                    if (result.success && result.data) {
                      setUserData(result.data); // update state with new image info
                    } else {
                      alert(result.message || "Failed to upload image.");
                    }
                  } catch (error) {
                    console.error("Error uploading image", error);
                    alert("Error uploading image.");
                  }
                }}
              />
            </div>

            <div className="text-center sm:text-left mt-4 sm:mt-0 sm:ml-6">
              <h2 className="text-xl sm:text-3xl font-bold">
                {userData.email}
              </h2>
              <p className="capitalize text-lg sm:text-xl font-bold mt-1">
                {userData?.role || "User"} Account
              </p>
            </div>
          </div>
        </section>

        {/* Add Expense Form */}
        <AddExpenseForm
          userId={userData?._id}
          onExpenseAdded={handleExpenseAdded}
        />

        {/* Expenses Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-blue-600 mb-6">
            Your Expenses
          </h3>
          <div className="space-y-6">
            {expenses && expenses.length > 0 ? (
              expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center hover:shadow-lg transition"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                      <span role="img" aria-label="money" className="text-2xl">
                        💰
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{expense.description}</p>
                      <p className="text-gray-600">
                        Paid By {expense.payerName}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    {expense.amount}$, {formatDate(expense.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center hover:shadow-lg transition">
                <h4>No Expenses Added Yet!</h4>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ExpensePage;
