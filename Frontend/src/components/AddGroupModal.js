import React, { useState, useEffect } from "react";
import getUser from "../api/getUser";

const AddGroupModal = ({ isOpen, onClose, onGroupAdded }) => {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getUserDetails() {
      const user = await getUser();
      if (Object.keys(user).length > 0) {
        setUserData(user);
      }
    }
    getUserDetails();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/search?query=${searchQuery}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleSelectUser = (user) => {
    if (!selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const handleCreateGroup = async () => {
    const groupData = {
      name: groupName,
      participants: selectedUsers.map((user) => user._id),
      userId: userData._id || "",
    };

    try {
      const response = await fetch("http://localhost:5000/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });

      if (response.ok) {
        setMessage("Group created successfully!");
        setGroupName("");
        setSelectedUsers([]);
        onClose(); // Close the modal after successful creation

        // Call the callback function to update the group list
        if (onGroupAdded) {
          onGroupAdded();
        }
      } else {
        setMessage("Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      setMessage("Server error creating group.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Add New Group</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
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
              <li key={user._id} className="flex justify-between items-center">
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
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Create
          </button>
        </div>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default AddGroupModal;
