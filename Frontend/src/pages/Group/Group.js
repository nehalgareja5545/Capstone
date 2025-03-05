import React, { useEffect, useState } from "react";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import AddGroupModal from "../../components/AddGroupModal";
import getGroupsByUserId from "../../api/getGroupsByUserId";
import getUser from "../../api/getUser";
import formatDate from "../../api/formatDate";
import { useNavigate } from "react-router";

function GroupPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userGroups, setuserGroups] = useState([]);
  const [userData, setuserData] = useState([]);
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    async function fetchData() {
      const user = await getUser();
      if (Object.keys(user).length > 0) {
        setuserData(user);
      }
      const groups = await getGroupsByUserId(user._id);
      if (groups && groups.length > 0) {
        setuserGroups(groups);
      }
    }
    fetchData();
  }, [userGroups]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 flex-grow">
        <section className="bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold">Add Your Groups</h2>
          <p className="mt-2">Detailed information about the group.</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={openModal}
              className="px-6 py-2 rounded-md bg-white text-blue-600 font-semibold shadow-md hover:bg-gray-100 transition"
            >
              Add New Group
            </button>
          </div>
        </section>

        {userGroups && userGroups.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-blue-600 mb-6">Groups</h3>
            <div className="space-y-6">
              {userGroups &&
                userGroups.length > 0 &&
                userGroups.map((group) => (
                  <div
                    key={group._id}
                    className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center hover:shadow-lg transition"
                    onClick={(e) => {
                      navigate(`/groupDetails/${group._id}`);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                        <span
                          role="img"
                          aria-label="money"
                          className="text-2xl"
                        >
                          💰
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{group.name}</p>
                        <p className="text-gray-600">
                          Created By {userData.email}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-800 font-semibold">
                      Created On {formatDate(group.createdAt)}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        )}
        <AddGroupModal isOpen={isModalOpen} onClose={closeModal} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default GroupPage;
