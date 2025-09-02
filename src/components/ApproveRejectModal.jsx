import React from "react";
import { DialogPanel ,DialogTitle , Dialog} from "@headlessui/react";
import axios from "../utils/axios";
import { useSelector } from "react-redux";

const ApproveRejectModal = ({ isOpen, onClose, settlement, onAction }) => {
  
    const { token } = useSelector((state) => state.auth); 
    if (!settlement) return null;

 const handleResponse = async (action) => {
    try {
      const res = await axios.put(
        `/transaction/${settlement._id}/${action}`,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔐 Set token here
          },
        }
      );
      onAction(res.data);
      onClose();
    } catch (error) {
      console.error("Settlement response error:", error?.response?.data || error.message);
      alert(error?.response?.data?.message || "Something went wrong!");
    }
  };


  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen bg-black/40 px-4">
        <DialogPanel className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <DialogTitle className="text-xl font-bold text-teal-700 mb-4">
            Offline Settlement Request
          </DialogTitle>
          <p className="text-gray-700 mb-4">
            <strong>{settlement.payerName}</strong> wants to settle{" "}
            <strong>₹{settlement.amount}</strong> with you in{" "}
            <strong>{settlement.groupName}</strong>.
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200"
              onClick={() => handleResponse("reject")}
            >
              Reject
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={() => handleResponse("approve")}
            >
              Approve
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ApproveRejectModal;
