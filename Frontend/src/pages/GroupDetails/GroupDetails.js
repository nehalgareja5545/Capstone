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
  const [userData, setUserData] = useState({});
  const [group, setGroup] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [participantDetails, setParticipantDetails] = useState({});
  const [settledPayments, setSettledPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();
  const { name, participants } = group;

  const fetchData = async () => {
    try {
      // Get current user
      const user = await getUser();
      if (user && Object.keys(user).length > 0) {
        setUserData(user);
      }

      // Get group details
      const grp = await getGroupById(groupId);
      if (grp && Object.keys(grp).length > 0) {
        setGroup(grp);
        await fetchParticipantDetails(grp.participants);
      }

      // Get all expenses (settled + unsettled)
      const response = await fetch(
        `http://localhost:5000/expenses/group/${groupId}`
      );
      const allExpenses = await response.json();

      if (Array.isArray(allExpenses)) {
        const unsettled = allExpenses.filter((e) => !e.settled);
        const settled = allExpenses.filter((e) => e.settled);

        setExpenses(unsettled);
        setSettledPayments(settled);
        calculateBalances(unsettled, grp.participants);
      }
    } catch (error) {
      console.error("Error in fetchData:", error);
    }
  };

  // const fetchSettledPayments = async () => {
  //   if (userData && userData._id) {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:5000/payments/settled?groupId=${groupId}&userId=${userData._id}`
  //       );
  //       if (response.ok) {
  //         const data = await response.json();
  //         setSettledPayments(data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching settled payments:", error);
  //     }
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, [groupId]);

  // useEffect(() => {
  //   fetchSettledPayments();
  // }, [groupId, userData]);

  const fetchParticipantDetails = async (participantIds) => {
    try {
      const details = await Promise.all(
        participantIds.map(async (id) => {
          try {
            const response = await fetch(
              `http://localhost:5000/user/userid/${id}`
            );
            if (response.ok) {
              const user = await response.json();
              return { id, name: user.username || user.email };
            }
            const emailResponse = await fetch(
              `http://localhost:5000/user/email/${id}`
            );
            if (emailResponse.ok) {
              const user = await emailResponse.json();
              return { id, name: user.username || user.email };
            }
            throw new Error("User not found");
          } catch (userError) {
            return { id, name: null };
          }
        })
      );
      const detailsMap = details.reduce((acc, { id, name }) => {
        acc[id] = name;
        return acc;
      }, {});
      setParticipantDetails(detailsMap);
    } catch (error) {}
  };

  const calculateBalances = (expenses, participants) => {
    const balanceSheet = {};
    participants.forEach((participant) => {
      balanceSheet[participant] = 0;
    });
    expenses.forEach((expense) => {
      const { amount, payerName, splitBetween } = expense;
      const splitAmount = amount / splitBetween.length;
      balanceSheet[payerName] = (balanceSheet[payerName] || 0) - amount;
      splitBetween.forEach((participant) => {
        balanceSheet[participant] =
          (balanceSheet[participant] || 0) + splitAmount;
      });
    });
    setBalances(balanceSheet);
  };

  const handleExpenseAdded = () => {
    fetchData();
    // fetchSettledPayments();
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/search?query=${searchQuery}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {}
  };

  const handleSelectUser = (user) => {
    if (!selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const handleAddMembers = async () => {
    const newMembers = selectedUsers.map((user) => user._id);
    try {
      const response = await fetch(
        `http://localhost:5000/groups/${groupId}/addMembers`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newMembers }),
        }
      );
      if (response.ok) {
        const updatedGroup = await response.json();
        setGroup(updatedGroup);
        await fetchParticipantDetails(updatedGroup.participants);
        setIsModalOpen(false);
        setSelectedUsers([]);
      }
    } catch (error) {}
  };

  const handleSettleBalances = async () => {
    if (groupId && userData._id) {
      try {
        const response = await fetch(
          `http://localhost:5000/balances/settle/${groupId}/${userData._id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userData._id }),
          }
        );
        if (response.ok) {
          alert("Balance settled successfully!");
          fetchData();
        } else {
          alert("Failed to settle balance. Please try again.");
        }
      } catch (error) {
        alert("Error settling balance.");
      }
    }
  };

  if (!groupId) return <h1>No Group Found, Please try again later!!</h1>;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 rounded-md bg-white text-blue-600 font-semibold shadow-md hover:bg-gray-100 transition"
            >
              Add Members
            </button>
          </div>
        </section>
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
                        Paid By{" "}
                        {participantDetails[expense.payerName] ||
                          expense.payerName}
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
                    : null;
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
                      <p className="font-semibold">
                        {participantDetails[participant] || participant}
                      </p>
                      <p className="text-gray-600">
                        Total Balance: ${formattedBalance || 0}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
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
                    {participantDetails[participant] || participant}{" "}
                    {balance < 0 ? "is owed" : "owes"} $
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
        <AddExpenseForm
          groupId={group._id}
          participants={participants}
          onExpenseAdded={handleExpenseAdded}
        />
        <section className="bg-gray-100 p-8 rounded-lg shadow-md text-center mb-6">
          <p className="text-gray-700 mb-4">
            Ready to settle your balances with group members?
          </p>
          <button
            onClick={handleSettleBalances}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition"
          >
            Settle Balances
          </button>
        </section>
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-blue-600 mb-4">
            Settled Balances History
          </h3>
          {settledPayments.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-gray-700">No settled balances found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {settledPayments.map((expense) => (
                <div
                  key={expense._id}
                  className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center hover:shadow-lg transition"
                >
                  <div>
                    <p className="font-semibold">{expense.description}</p>
                    <p className="text-gray-600">
                      Paid By{" "}
                      {participantDetails[expense.payerName] ||
                        expense.payerName}
                    </p>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    ${expense.amount}, {formatDate(expense.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Add Members</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Search Users
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by name or email"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSearch}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Search
              </button>
              <ul className="mt-2">
                {searchResults.map((user) => (
                  <li
                    key={user._id}
                    className="flex justify-between items-center"
                  >
                    {user.name} ({user.email})
                    <button
                      onClick={() => handleSelectUser(user)}
                      className="ml-2 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <h3 className="text-lg font-bold mb-2">Selected Users</h3>
            <ul className="mb-4">
              {selectedUsers.map((user) => (
                <li key={user._id}>
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMembers}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Add Members
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default GroupDetails;
