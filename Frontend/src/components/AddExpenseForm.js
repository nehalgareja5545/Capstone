import React, { useState } from "react";

function AddExpenseForm({ groupId, participants, userId }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payerName, setpayerName] = useState("You");
  const [splitBetween, setSplitBetween] = useState([]);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let expenseData;
    if (groupId) {
      expenseData = {
        groupId,
        description,
        amount: parseFloat(amount),
        payerName,
        splitBetween,
      };
    } else {
      expenseData = {
        userId,
        description,
        amount: parseFloat(amount),
        payerName,
        date,
      };
    }

    try {
      const response = await fetch(`http://localhost:5000/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      const data = await response.json();
      if (data.msg === "Expense Saved!") {
        setDescription("");
        setAmount("");
        setpayerName("");
        setSplitBetween("");
        setDate("");
      }
      setMessage(data.msg); // Display the message from the API
    } catch (error) {
      console.error("Error creating expense:", error);
      setMessage("Server error creating expense.");
    }
  };

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center">
        {groupId ? "Add Expense" : "Manage Your Expenses"}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8"
      >
        {message && (
          <p
            className={
              message === "Expense Saved!"
                ? "text-center font-bold mb-3 text-green-600"
                : "text-center font-bold mb-3 text-red-600"
            }
          >
            {message}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="$0.00"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Payer
            </label>
            <select
              value={payerName}
              disabled={userId}
              onChange={(e) => setpayerName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              {groupId ? (
                <>
                  <option value="">Select Payer</option>
                  <option value="You">You</option>
                  {participants &&
                    participants.map((participant, index) => (
                      <option key={index} value={participant}>
                        {participant}
                      </option>
                    ))}
                </>
              ) : (
                <option value="You">You</option>
              )}
            </select>
          </div>
          {groupId ? (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Split Between
              </label>
              <select
                multiple
                value={splitBetween}
                onChange={(e) =>
                  setSplitBetween(
                    Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    )
                  )
                }
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="You">You</option>
                {participants &&
                  participants.map((participant, index) => (
                    <option key={index} value={participant}>
                      {participant}
                    </option>
                  ))}
              </select>
              <p className="text-gray-500 text-sm mt-2">
                Hold down the Ctrl (Windows) or Command (Mac) key to select
                multiple members.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
        </div>
        <div className="text-center mt-8">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Save Expense
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddExpenseForm;
