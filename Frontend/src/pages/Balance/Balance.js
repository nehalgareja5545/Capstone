import React, { useEffect, useState } from "react";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import getUser from "../../api/getUser";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function BalancesPage() {
  const [userData, setUserData] = useState({});
  const [budgets, setBudgets] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({ totalOwed: 0, totalDue: 0 });
  const [newBudgetCategory, setNewBudgetCategory] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");

  useEffect(() => {
    const fetchBudgetsAndExpenses = async () => {
      try {
        const user = await getUser();
        if (user && Object.keys(user).length > 0) {
          setUserData(user);

          const budgetsResponse = await fetch(
            `http://localhost:5000/budgets/user/${user?._id}`
          );
          const budgetsData = await budgetsResponse.json();

          // Ensure budgetsData is an array
          if (Array.isArray(budgetsData)) {
            setBudgets(budgetsData);

            // Calculate total budget
            const total = budgetsData.reduce(
              (acc, budget) => acc + budget.amount,
              0
            );
            setTotalBudget(total);
          } else {
            console.error(
              "Unexpected response format for budgets:",
              budgetsData
            );
          }

          const expensesResponse = await fetch(
            `http://localhost:5000/expenses/user/${user._id}`
          );
          const expensesData = await expensesResponse.json();
          setExpenses(expensesData);

          const totalSpentAmount = expensesData.reduce(
            (acc, expense) => acc + expense.amount,
            0
          );
          setTotalSpent(totalSpentAmount);

          const balancesResponse = await fetch(
            `http://localhost:5000/balances/user/${user._id}`
          );
          const balancesData = await balancesResponse.json();
          setBalances(balancesData);
        }
      } catch (error) {
        console.error("Error fetching budgets, expenses, and balances:", error);
      }
    };

    fetchBudgetsAndExpenses();
  }, []);

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData._id,
          category: newBudgetCategory,
          amount: parseFloat(newBudgetAmount),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setBudgets([...budgets, data.budget]);
        setNewBudgetCategory("");
        setNewBudgetAmount("");
      } else {
        console.error("Error adding budget:", data.msg);
      }
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  const calculateRemainingForCategory = (category) => {
    const budget = budgets.find((b) => b.category === category);
    const spent = expenses
      .filter((expense) => expense.category === category)
      .reduce((acc, expense) => acc + expense.amount, 0);
    return budget ? budget.amount - spent : 0;
  };

  const calculateSpentForCategory = (category) => {
    return expenses
      .filter((expense) => expense.category === category)
      .reduce((acc, expense) => acc + expense.amount, 0);
  };

  // Prepare data for the chart
  const chartData = {
    labels: [
      ...(Array.isArray(budgets)
        ? budgets.map((budget) => budget.category)
        : []),
      "Other",
    ],
    datasets: [
      {
        data: [
          ...(Array.isArray(budgets)
            ? budgets.map((budget) =>
                calculateSpentForCategory(budget.category)
              )
            : []),
          expenses.reduce(
            (acc, expense) =>
              acc +
              (budgets.some((b) => b.category === expense.category)
                ? 0
                : expense.amount),
            0
          ),
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
        ],
      },
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-6 py-12 flex-grow">
        <section className="flex justify-around items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">
              Manage Your Budgets and Balances
            </h2>
            <p className="text-gray-600">Keep track of your finances easily</p>
          </div>
        </section>

        {/* Add Budget Form */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-blue-600 mb-6">
            Add New Budget
          </h3>
          <form
            onSubmit={handleAddBudget}
            className="bg-white shadow-md rounded-lg p-6 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={newBudgetCategory}
                  onChange={(e) => setNewBudgetCategory(e.target.value)}
                  placeholder="Enter category"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={newBudgetAmount}
                  onChange={(e) => setNewBudgetAmount(e.target.value)}
                  min={1}
                  placeholder="$0.00"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="text-center mt-6">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
                Add Budget
              </button>
            </div>
          </form>
        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-bold text-blue-600 mb-6">Budgets</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white shadow-md rounded-lg flex flex-col">
              <div className="flex-grow">
                <div className="bg-gray-100 h-full flex items-center justify-center rounded-t-lg">
                  <div style={{ width: "300px", height: "300px" }}>
                    <Pie
                      data={chartData}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="font-bold text-lg">
                  Total Budget: ${totalBudget}
                </p>
                <p className="text-gray-700 text-lg font-semibold">
                  Spending Till Now: ${totalSpent}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 gap-6">
              {Array.isArray(budgets) &&
                budgets.map((budget, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg flex flex-col"
                  >
                    <div className="p-6">
                      <p className="font-bold text-lg">
                        {budget.category} Expenses
                      </p>
                      <p className="text-gray-700 text-lg font-semibold">
                        Remaining: $
                        {calculateRemainingForCategory(budget.category)}
                      </p>
                      <p className="text-gray-700 text-lg font-semibold">
                        Spent: ${calculateSpentForCategory(budget.category)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-bold text-blue-600 mb-6">
            Budgets List
          </h3>
          <div className="space-y-6">
            {Array.isArray(budgets) &&
              budgets.map((budget, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center hover:shadow-lg transition"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 bg-yellow-100`}
                    >
                      <span role="img" aria-label="money" className="text-2xl">
                        💰
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{budget.category}</p>
                      <p className="text-gray-500">
                        Remaining: $
                        {calculateRemainingForCategory(budget.category)}
                      </p>
                      <p className="text-gray-500">
                        Spent: ${calculateSpentForCategory(budget.category)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default BalancesPage;
