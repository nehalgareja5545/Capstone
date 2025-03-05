import { useNavigate, useParams } from "react-router";
import React, { useEffect, useState } from "react";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import AddExpenseForm from "../../components/AddExpenseForm";
import getUser from "../../api/getUser";
import getGroupById from "../../api/getGroupById";
import getExpensesByGroupId from "../../api/getExpensesByGroupId";
import formatDate from "../../api/formatDate";

export const GroupDetails = () => {
  const { groupId } = useParams();
  const [userData, setuserData] = useState([]);
  const [group, setGroup] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const navigate = useNavigate();
  const { name, participants } = group;

  useEffect(() => {
    async function fetchData() {
      const user = await getUser();
      if (user && Object.keys(user).length > 0) {
        setuserData(user);
      }
      const group = await getGroupById(groupId);
      if (group && Object.keys(group).length > 0) {
        setGroup(group);
      }
      const expenses = await getExpensesByGroupId(groupId);
      if (expenses && expenses.length > 0) {
        setExpenses(expenses);
        calculateBalances(expenses, group.participants);
      }
    }
    fetchData();
  }, [groupId]);

  const calculateBalances = (expenses, participants) => {
    const balanceSheet = {};

    // Initialize balance for each participant
    participants.forEach((participant) => {
      balanceSheet[participant] = 0;
    });

    // Calculate balances
    expenses.forEach((expense) => {
      const { amount, payerName, splitBetween } = expense;
      const splitAmount = amount / splitBetween.length;

      // Deduct from payer
      balanceSheet[payerName] = (balanceSheet[payerName] || 0) - amount;

      // Add to each participant in splitBetween
      splitBetween.forEach((participant) => {
        balanceSheet[participant] =
          (balanceSheet[participant] || 0) + splitAmount;
      });
    });

    setBalances(balanceSheet);
  };

  if (!groupId) return <h1>No Group Found, Please try again later!!</h1>;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 flex-grow">
        <section className="bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold">{name}</h2>
          <p className="mt-2 text-2xl">
            See Detailed information about the {name} below
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/group")}
              className="px-6 py-2 rounded-md bg-white text-blue-600 font-semibold shadow-md hover:bg-gray-100 transition"
            >
              Go Back
            </button>
          </div>
        </section>

        {/* Expenses Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-blue-600 mb-6">Expenses</h3>
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

        {/* Members Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-blue-600 mb-6">Members</h3>
          <div className="space-y-6">
            {participants &&
              participants.length > 0 &&
              participants.map((participant, index) => {
                const formattedBalance =
                  typeof balances[participant] === "number" &&
                  !isNaN(balances[participant])
                    ? Number.isInteger(balances[participant])
                      ? Math.abs(balances[participant])
                      : Math.abs(balances[participant]).toFixed(2)
                    : null; // Return null or a fallback value if not a valid number

                return (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-lg p-6 flex items-center hover:shadow-lg transition"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span role="img" aria-label="person" className="text-2xl">
                        👤
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{participant}</p>
                      <p className="text-gray-600">
                        Total Balance: ${formattedBalance || 0}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* Balances Summary */}
        {balances && Object.keys(balances).length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-blue-600 mb-6">
              Balances Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(balances).map(([participant, balance]) => (
                <div
                  key={participant}
                  className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
                >
                  <p className="text-gray-700">
                    {participant} {balance < 0 ? "is owed" : "owes"} $
                    {typeof balance === "number" && !isNaN(balance)
                      ? Number.isInteger(balance)
                        ? Math.abs(balance)
                        : Math.abs(balance).toFixed(2)
                      : null}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Add Expense Form */}
        <AddExpenseForm groupId={group._id} participants={participants} />

        {/* Settle Up */}
        <section className="bg-gray-100 p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-700 mb-4">
            Ready to settle your balances with group members?
          </p>
          <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition">
            Settle Balances
          </button>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GroupDetails;
