import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import DashBoardAside from "../components/DashBoardAside";
import socket from "../socket/socket.js"; // ✅ Add this
import {
  FaTrash,
  FaBell,
  FaCheckCircle,
  FaUsers,
  FaMoneyBill,
  FaExclamationTriangle,
} from "react-icons/fa";

const NotificationPage = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/notification", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data.notifications);
      } catch (err) {
        console.error("Error fetching notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  // ✅ Join socket room and listen for notifications
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);

      socket.on("receive-notification", (data) => {
        setNotifications((prev) => [
          {
            _id: Date.now(), // temporary id
            message: data.message,
            createdAt: data.timestamp || new Date(),
            read: false,
          },
          ...prev,
        ]);
      });

      return () => {
        socket.off("receive-notification");
      };
    }
  }, [user?._id]);

  const handleMarkAsRead = async () => {
    try {
      await axios.put(
        "/notification/mark-read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/notification/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const getIcon = (message) => {
    if (message.includes("invited")) return <FaUsers className="text-indigo-600" />;
    if (message.includes("expense")) return <FaMoneyBill className="text-green-600" />;
    if (message.includes("settled")) return <FaCheckCircle className="text-yellow-600" />;
    if (message.includes("deleted")) return <FaExclamationTriangle className="text-red-600" />;
    return <FaBell className="text-cyan-700" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-cyan-200 flex">
      <div className="hidden md:block w-64">
        <DashBoardAside />
      </div>
      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-8 border border-cyan-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#005f5f] font-serif flex items-center gap-2">
              <FaBell className="text-teal-600" /> Notifications
            </h2>
           
          </div>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-gray-500">You have no notifications yet.</p>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notif) => (
                <li
                  key={notif._id}
                  className={`relative p-4 rounded-lg border shadow-sm flex items-start gap-3 ${
                    notif.read ? "bg-gray-50 border-gray-200" : "bg-white border-teal-200"
                  }`}
                >
                  <div className="text-lg">{getIcon(notif.message)}</div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(notif._id)}
                    className="text-red-500 hover:text-red-700 mt-1"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationPage;
