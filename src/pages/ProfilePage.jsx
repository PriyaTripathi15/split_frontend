// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import DashBoardAside from "../components/DashBoardAside";

const ProfilePage = () => {
  const { token } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  // 🟩 Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFullName(data.fullName);
        setEmail(data.email);
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // 🟩 Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        "/auth/profile",
        { fullName, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated successfully!");
      setPassword("");
      setFullName(data.fullName);
      setEmail(data.email);
    } catch (error) {
      toast.error("Update failed");
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
          <h2 className="text-3xl font-bold text-[#005f5f] mb-6 font-serif text-center">
  <img
    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    alt="Profile Avatar"
    className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-teal-400 shadow-md"
  />
  <span className="text-teal-700 bg-clip-text">
    My Profile
  </span>
</h2>


          {loading ? (
            <p className="text-center text-cyan-700 font-medium">
              Loading profile...
            </p>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep old password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#005f5f] text-white py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
              >
                Update Profile
              </button>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ProfilePage;
