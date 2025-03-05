import React, { useEffect, useState } from "react";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import getUser from "../../api/getUser";
import AddExpenseForm from "../../components/AddExpenseForm";
import getExpensesByGroupId from "../../api/getExpensesByGroupId";
import formatDate from "../../api/formatDate";
import getExpensesByUserId from "../../api/getExpensesByUserId";
import { useNavigate } from "react-router";

function ExpensePage() {
  const [userData, setUserData] = useState({});
  const [expenses, setExpenses] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      const user = await getUser();
      if (user && Object.keys(user).length > 0) {
        setUserData(user);
        const expenses = await getExpensesByUserId(user._id);
        if (expenses && expenses.length > 0) {
          setExpenses(expenses);
        }
      }
    }
    fetchData();
  }, [expenses]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 flex-grow">
        {/* Header Section */}
        <section className="flex flex-wrap justify-center items-center mb-12 bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md rounded-lg p-4 sm:p-8">
          <div className="flex flex-col items-center sm:flex-row sm:items-center">
            <div className="bg-white rounded-full w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-0 sm:mr-6 flex items-center justify-center">
              <span className="text-2xl sm:text-4xl font-bold text-blue-500">
                {userData?.email?.split("@")[0].slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-3xl font-bold">
                {userData.email}
              </h2>
              <p className="capitalize text-lg sm:text-xl font-bold mt-1">
                {userData?.role} Account
              </p>
            </div>
          </div>
        </section>

        {/* Add Expense Form */}
        <AddExpenseForm userId={userData?._id} />

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

        {/* <section className="mb-12">
          <h3 className="text-2xl font-bold text-blue-600 mb-6">
            Participants
          </h3>
          <div className="flex items-center mb-6">
            <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition">
              Select All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="bg-white shadow-md rounded-lg p-6 flex items-center hover:shadow-lg transition"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-semibold text-blue-600">
                    {item}
                  </span>
                </div>
                <div className="flex-grow">
                  <p className="font-semibold">
                    {item === 1 ? "Alice Smith" : "Bob Johnson"}
                  </p>
                  <p className="text-gray-500">Member</p>
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">$40</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-bold text-blue-600 mb-6">
            Split Method
          </h3>
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition">
              Even Split
            </button>
            <button className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-md shadow-md hover:bg-gray-100 transition">
              Custom Split
            </button>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </section> */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ExpensePage;
