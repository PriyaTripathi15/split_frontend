import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";
import DashBoardAside from "../components/DashBoardAside";

const SkeletonCard = () => (
  <div className="bg-gradient-to-br from-cyan-100 to-teal-100 font-mono p-4 rounded-xl shadow-md relative overflow-hidden h-[60px]">
    <style>
      {`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
          background-size: 200% 100%;
        }
      `}
    </style>
    <div className="absolute inset-0 bg-gradient-to-r from-white via-teal-100 to-white animate-shimmer" />
    <div className="relative z-10 flex justify-between items-center h-full"></div>
  </div>
);

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("/groups/my-groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGroups(res.data.groups);
      } catch (err) {
        console.error("Error fetching groups", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [token]);

  const toggleExpand = (id) => {
    setExpandedGroups((prev) =>
      prev.includes(id) ? prev.filter((gid) => gid !== id) : [...prev, id]
    );
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      const res = await axios.delete(`/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
      alert("Group deleted successfully");
    } catch (err) {
      console.error("Error deleting group", err);
      alert(
        err?.response?.data?.message ||
          "Failed to delete group. Make sure all payments are settled."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-cyan-200 flex">
      {/* Sidebar */}
      <aside className="w-72 sticky top-0 h-screen overflow-y-auto shadow-md hidden md:block">
        <DashBoardAside />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-teal-800 font-serif">Your Groups</h1>
            <button
              onClick={() => navigate("/group/create")}
              className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl font-semibold shadow"
            >
              + Create Group
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
              {[...Array(4)].map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <p className="text-gray-600 text-center text-lg">
              You are not part of any group yet.
            </p>
          ) : (
            <div className="space-y-4">
              {groups.map((group) => {
  const isExpanded = expandedGroups.includes(group._id);
  const currentUserRole = group.members.find(
    (m) => m.userId?._id === user._id
  )?.role;

  return (
    <motion.div
      key={group._id}
      className="bg-gradient-to-br from-cyan-100 to-teal-100 font-mono p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => toggleExpand(group._id)}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-teal-800">{group.name}</h2>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-teal-700"
        >
          {isExpanded ? <FaMinus /> : <FaPlus />}
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="mt-4 text-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-1">
              Total Members (including invited):{" "}
              <strong>{group.members.length + group.invites.length}</strong>
            </p>
            <p className="mb-4">
              Your Role: <strong>{currentUserRole || "Member"}</strong>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={`/group/${group._id}`}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow"
              >
                View Group
              </Link>
              <Link
                to={`/expense/add/${group._id}`}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow"
              >
                Add Expense
              </Link>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent expand toggle
                  if (currentUserRole === "admin") {
                    if (window.confirm("Are you sure you want to delete this group?")) {
                      handleDeleteGroup(group._id);
                    }
                  }
                }}
                disabled={currentUserRole !== "admin"}
                className={`${
                  currentUserRole === "admin"
                    ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                    : "bg-red-300 cursor-not-allowed"
                } text-white px-5 py-2 rounded-lg text-sm font-semibold shadow`}
              >
                Delete Group
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
})}

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GroupList;
