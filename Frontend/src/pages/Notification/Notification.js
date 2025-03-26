import React from "react";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";

function Notification() {
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: "message",
      content: "You have a new message from John Doe.",
      time: "Just now",
    },
    {
      id: 2,
      type: "payment",
      content: "Your payment of $50 has been received.",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "alert",
      content: "Reminder: Settle your balance with Alice Smith.",
      time: "Yesterday",
    },
    // Add more notifications as needed
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 flex-grow">
        {/* Page Header */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            Notifications
          </h2>
          <p className="text-gray-700">
            Stay updated with the latest activities and alerts.
          </p>
        </section>

        {/* Notifications List */}
        <section className="mb-12">
          <div className="space-y-6">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white shadow-md rounded-lg p-6 flex items-center hover:shadow-lg transition"
              >
                {/* Icon based on notification type */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  {notification.type === "message" && (
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6l-4 4V5z" />
                      </svg>
                    </div>
                  )}
                  {notification.type === "payment" && (
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M12 8c0-1.1-.9-2-2-2H8l-2 2H4v2h2l2-2h2v6h2V8z" />
                      </svg>
                    </div>
                  )}
                  {notification.type === "alert" && (
                    <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-yellow-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 14a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v5a1 1 0 002 0V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Notification Content */}
                <div className="flex-grow">
                  <p className="text-gray-700">{notification.content}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {notification.time}
                  </p>
                </div>

                {/* Action Button (optional) */}
                {notification.type === "alert" && (
                  <div className="ml-4">
                    <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">
                      View Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Notification;
