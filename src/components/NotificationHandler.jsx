// components/NotificationHandler.jsx
import React, { useEffect, useState } from "react";
import socket from "../socket/socket";
import { toast } from "react-toastify";
import axios from "../utils/axios";

const NotificationHandler = () => {
  const [settlementRequest, setSettlementRequest] = useState(null);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))?._id;
    if (userId) {
      socket.emit("join", userId);

      socket.on("receive-notification", (notif) => {
        console.log("🔔 Socket Notification Received:", notif);

        if (notif.type === "offline-settlement") {
          setSettlementRequest(notif);
        } else {
          toast.info(notif.message, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      });
    }

    return () => {
      socket.off("receive-notification");
    };
  }, []);

  const handleApprove = async () => {
    try {
      await axios.put(`/api/settlements/approve/${settlementRequest.settlementId}`);
      toast.success("Settlement approved!");
      setSettlementRequest(null);
    } catch (err) {
      toast.error("Error approving settlement.");
    }
  };

  const handleReject = async () => {
    try {
      await axios.delete(`/api/settlements/reject/${settlementRequest.settlementId}`);
      toast.info("Settlement rejected.");
      setSettlementRequest(null);
    } catch (err) {
      toast.error("Error rejecting settlement.");
    }
  };

  if (!settlementRequest) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md text-center">
        <h2 className="text-lg font-semibold mb-4">Offline Settlement Request</h2>
        <p className="mb-6">{settlementRequest.message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleApprove}
          >
            Approve
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationHandler;
