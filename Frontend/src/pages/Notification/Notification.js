import React, { useEffect, useState } from "react";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import getUser from "../../api/getUser";
import formatDate from "../../api/formatDate";

function Notification() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const u = await getUser();
      if (u) {
        setUser(u);
        try {
          const response = await fetch(
            `http://localhost:5000/user/notifications/${u._id}`
          );
          if (response.ok) {
            const result = await response.json();
            setNotifications(result.notifications || []);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    }

    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-6 py-12 flex-grow">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            Recent Notifications
          </h2>
          {notifications.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-gray-700">No notifications found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {notifications.map((note) => (
                <div
                  key={note._id}
                  className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center hover:shadow-lg transition"
                >
                  <div>
                    <p className="font-semibold">{note.message}</p>
                    <p className="text-gray-500 text-sm text-left">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `http://localhost:5000/user/notifications/${note._id}`,
                          {
                            method: "DELETE",
                          }
                        );
                        if (res.ok) {
                          setNotifications((prev) =>
                            prev.filter((n) => n._id !== note._id)
                          );
                        }
                      } catch (err) {
                        console.error("Error deleting notification:", err);
                      }
                    }}
                    className="text-red-500 text-xl font-bold hover:text-red-700 transition"
                    title="Dismiss"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Notification;
