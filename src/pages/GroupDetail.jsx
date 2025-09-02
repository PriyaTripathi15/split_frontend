import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import GroupExpensesPage from "./GroupExpensesPage";
import BalanceSummary from "./BalanceSummary";
import DashBoardAside from "../components/DashBoardAside";

const GroupDetails = () => {
  const { groupId } = useParams();
  const { token, user } = useSelector((state) => state.auth);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved === null ? true : JSON.parse(saved);
  });

  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [addMemberError, setAddMemberError] = useState("");
  const [sendingInvites, setSendingInvites] = useState(false);
  const [showExpenses, setShowExpenses] = useState(true);

  useEffect(() => {
    const onStorage = () => {
      const saved = localStorage.getItem("sidebarOpen");
      setSidebarOpen(saved === null ? true : JSON.parse(saved));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroup(res.data.group);
      } catch (error) {
        console.error("Failed to load group:", error);
        toast.error("Failed to load group.");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [groupId, token]);

  const isAdmin = group?.members?.some(
    (m) => m.userId?._id === user?._id && m.role === "admin"
  );

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;
    setAddingMember(true);
    setAddMemberError("");

    try {
      const res = await axios.post(
        `/groups/${groupId}/add-member`,
        { email: newMemberEmail.trim(), role: "member" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGroup((prev) => ({
        ...prev,
        members: [...prev.members, res.data.group.members.slice(-1)[0]],
      }));

      setNewMemberEmail("");
      setShowAddMemberForm(false);
      toast.success(res.data.message || "Member added successfully.");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to add member.";
      setAddMemberError(msg);
      toast.error(msg);
    } finally {
      setAddingMember(false);
    }
  };

  const handleSendInvites = async () => {
    setSendingInvites(true);
    try {
      const res = await axios.post(
        `/groups/${groupId}/send-invites`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Invites sent successfully.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send invites.");
    } finally {
      setSendingInvites(false);
    }
  };

  const getInitials = (text) =>
    text
      ? text
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "";

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-teal-50">
        <span className="text-lg font-semibold text-teal-700">Loading...</span>
      </div>
    );

  if (!group)
    return (
      <div className="flex items-center justify-center min-h-screen bg-teal-50">
        <span className="text-lg font-semibold text-red-600">Group not found.</span>
      </div>
    );

  const joinedMembers = group.members.filter((m) => m.status === "joined");
  const isCurrentUserJoined = joinedMembers.some(
    (m) => m.userId?._id === user?._id
  );

  const displayJoinedMembers = isCurrentUserJoined
    ? joinedMembers
    : [
        ...joinedMembers,
        {
          _id: user?._id || "current-user-temp-id",
          userId: user,
          role: "member",
          status: "joined",
          email: user?.email,
        },
      ];

  const admin = group.members.find((m) => m.role === "admin");
  const userMap = {};
  group?.members?.forEach((m) => {
    if (m.status === "joined" && m.userId?._id) {
      userMap[m.userId._id] = m.userId.fullName || m.email || "Unknown";
    }
  });

  const sectionCard = "bg-white rounded-xl  p-6 mb-6";
  const sectionTitle = "text-2xl font-serif text-teal-800 mb-4";

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-cyan-200">
      <DashBoardAside />
      <motion.div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } px-4 py-10`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-teal-800 font-serif">{group.name}</h1>
              {admin && (
                <p className="text-lg text-cyan-700 mt-1">
                  Admin: {admin.userId?.fullName || admin.email || "Unknown"}
                </p>
              )}
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                className="p-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                <FiPlus size={22} />
              </button>
            )}
          </div>

          {/* Pending Members */}
          {group.invites?.length > 0 && (
            <div>
              <h2 className="text-2xl font-serif text-teal-800 mb-4">Pending Members</h2>
              <div className="flex flex-wrap gap-4">
                {group.invites.map((email, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-100 text-teal-800"
                  >
                    <span className="font-medium">{email}</span>
                    <span className="text-sm">(Invited)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Send Invites Button */}
          {isAdmin && group.invites && group.invites.length > 0 && (
            <div className="mb-6">
              <button
                onClick={handleSendInvites}
                disabled={sendingInvites}
                className={`px-4 py-2 rounded font-medium text-white ${
                  sendingInvites ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {sendingInvites ? "Sending..." : "Send Invite to All Pending Members"}
              </button>
            </div>
          )}

          {/* Add Member Form */}
          {showAddMemberForm && isAdmin && (
            <form onSubmit={handleAddMemberSubmit} className="space-y-4">
              <label className="block font-semibold text-teal-700">Add Member by Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Enter member's email"
                  className="border border-teal-300 p-2 rounded flex-grow"
                />
                <button
                  type="submit"
                  disabled={addingMember}
                  className={`px-4 py-2 rounded text-white ${
                    addingMember ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
                  }`}
                >
                  {addingMember ? "Adding..." : "Add"}
                </button>
              </div>
              {addMemberError && (
                <p className="text-red-600 font-semibold">{addMemberError}</p>
              )}
            </form>
          )}

          {/* Joined Members */}
          <div>
            <h2 className="text-2xl font-serif text-teal-800 mb-4">Joined Members</h2>
            <div className="flex flex-wrap gap-6">
              {displayJoinedMembers.map((member, idx) => {
                const fullName = member.userId?.fullName || "Unknown";
                return (
                  <div key={member._id || idx} className="flex flex-col items-center w-24 text-center">
                    <div
                      className="bg-cyan-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold"
                      title={member.userId?.email}
                    >
                      {getInitials(fullName)}
                    </div>
                    <p className="text-sm font-medium mt-1 text-cyan-900">{fullName}</p>
                    <span className="text-xs text-teal-500">{member.role}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expenses Section */}
          <div>
            <h2 className="text-3xl font-serif text-teal-700 text-center mb-4">
              List of Expenses for Group
            </h2>
            {showExpenses && (
              <GroupExpensesPage
                groupName={group?.name}
                groupId={groupId}
                token={token}
              />
            )}
          </div>

          {/* Balance Summary */}
          <div>
            <h2 className="text-2xl font-serif text-teal-800 mb-4">Your Balances Summary </h2>
            <BalanceSummary
              groupId={groupId}
              currentUserId={user._id}
              userMap={userMap}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GroupDetails;
