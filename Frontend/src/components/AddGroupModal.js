import React, { useEffect, useState } from "react";
import getUser from "../api/getUser";

const AddGroupModal = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function getUserDetails() {
      const user = await getUser();
      if (Object.keys(user).length > 0) {
        setUserData(user);
      }
    }
    getUserDetails();
  }, []);

  const handleCreate = async () => {
    console.log(userData);
    const participantList = participants.split(",").map((p) => p.trim());
    const groupData = {
      name: groupName,
      participants: participantList,
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
        console.log("Group created successfully");
        onClose(); // Close the modal
      } else {
        console.error("Failed to create group");
      }
    } catch (error) {
      console.error("Error:", error);
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
            Participants
          </label>
          <input
            type="text"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder="Enter participants separated by commas"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGroupModal;
