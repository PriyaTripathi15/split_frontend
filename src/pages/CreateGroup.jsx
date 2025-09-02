// src/pages/CreateGroup.jsx
import React, { useState } from "react";
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrashAlt, FaUserPlus } from "react-icons/fa";
import DashBoardAside from "../components/DashBoardAside";
import {toast} from "react-toastify"
const CreateGroup = () => {
  const { user, token } = useSelector((state) => state.auth);

  const [groupName, setGroupName] = useState("");
  const [emails, setEmails] = useState([user?.email || ""]);

  const navigate = useNavigate();

  const handleEmailChange = (index, value) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  const removeEmailField = (index) => {
    if (emails.length > 1) {
      const updated = emails.filter((_, i) => i !== index);
      setEmails(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/groups/create",
        {
          name: groupName,
          membersEmails: emails.filter((email) => email.trim() !== ""),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Group created successfully");
      navigate("/grouplist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create group");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-cyan-200 flex">
      {/* Sidebar */}
      <div className="hidden md:block w-64 border-r border-teal-200 min-h-screen">
        <DashBoardAside />
      </div>

      {/* Main */}
      <main className="flex-1 p-6 md:pl-8 mt-10">
        <motion.div
          className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold text-[#005f5f] mb-6 flex items-center gap-2 text-serif">
            <FaUserPlus className="bg-slate-100  text-4xl rounded-full text-[#005f5f]" />
            Create a New Group
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Goa Trip"
                className="w-142 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            {/* Emails */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Invite Members
              </label>
              {emails.map((email, index) => (
                <div key={index} className="flex items-center gap-3 mb-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="example@example.com"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeEmailField(index)}
                    className="text-red-500 hover:text-red-800 p-1 rounded-full transition"
                    disabled={emails.length === 1}
                    aria-label="Remove email"
                    title="Remove email"
                  >
                    <FaTrashAlt size={22} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addEmailField}
                className="mt-2 text-lg font-semibold text-cyan-600 hover:underline font-mono"
              >
                + Add another email
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#005f5f] text-white py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
            >
              Create Group
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateGroup;
