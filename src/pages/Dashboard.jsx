import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DashBoardAside from "../components/DashBoardAside";
import MyExpenseTracker from "../pages/MyExpenseTracker";
import ApproveRejectModal from "../components/ApproveRejectModal";

// Card for each group
const GroupCard = React.memo(({ group }) => (
  <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-200 h-45 w-100">
    <div>
      <h4 className="text-2xl font-bold text-teal-800">{group.name}</h4>
      <p className="font-medium text-gray-800 mt-1">
        Members: <span className="font-semibold">{group.members.length}</span>
      </p>
    </div>
    <div className="mt-6 flex gap-3">
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
    </div>
  </div>
));

// Skeleton for loading
const GroupCardSkeleton = () => (
  <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl shadow-md p-6 border border-cyan-100">
    <div>
      <Skeleton height={26} width={140} />
      <Skeleton height={18} width={90} className="mt-2" />
    </div>
    <div className="mt-6 flex gap-3">
      <Skeleton height={36} width={100} />
      <Skeleton height={36} width={120} />
    </div>
  </div>
);

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useSelector((state) => state.auth);

  // 🟨 Modal state for settlement approval
  const [pendingSettlements, setPendingSettlements] = useState([]);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🟩 Fetch groups
  const fetchGroups = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get("/groups/my-groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data.groups || []);
    } catch (error) {
      console.error("Error fetching user groups", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // 🟩 Fetch pending settlements
  const fetchPendingSettlements = async () => {
    try {
      const res = await axios.get("/transaction/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });

       console.log("🟢 Pending settlements fetched:", res.data);
      if (res.data.length > 0) {
        setPendingSettlements(res.data);
        setSelectedSettlement(res.data[0]);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching pending settlements:", err);
    }
  };

  // 🟩 Handle approval/rejection
  const handleSettlementAction = (result) => {
    const remaining = pendingSettlements.filter(
      (s) => s._id !== result.settlement._id
    );
    if (remaining.length > 0) {
      setPendingSettlements(remaining);
      setSelectedSettlement(remaining[0]);
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };

  // 🟦 On load
  useEffect(() => {
    fetchGroups();
    fetchPendingSettlements();
  }, [fetchGroups]);

  return (
    <div    id="main-content"  className="min-h-screen flex bg-gradient-to-br from-cyan-100 via-teal-50 to-cyan-200 ml-10">
      {/* Sidebar */}
      <div className="hidden md:block">
        <DashBoardAside />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:pl-8">
        <div className="max-w-5xl mx-auto bg-white/90 shadow-2xl rounded-3xl p-8 border border-teal-100">
          <h2 className="text-4xl font-extrabold text-teal-800 mb-3 text-center font-serif tracking-tight drop-shadow">
            Dashboard
          </h2>

          <p className="text-lg text-cyan-950 text-center mb-8 font-medium font-mono">
            Welcome,{" "}
            <span className="font-bold text-cyan-800">
              {user?.fullName || user?.name || "User"}
            </span>
            ! This is your space to manage groups and track spending.
          </p>

          {/* Expense Tracker */}
          <div className="mb-15">
            <MyExpenseTracker />
          </div>

          <h3 className="text-2xl font-bold mb-2 text-teal-700 text-center font-serif">
            My Groups
          </h3>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <GroupCardSkeleton key={i} />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <p className="text-cyan-700 text-center text-lg font-semibold">
              I haven’t joined or created any groups yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {groups.map((group) => (
                <GroupCard key={group._id} group={group} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Settlement Modal */}
      <ApproveRejectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        settlement={selectedSettlement}
        onAction={handleSettlementAction}
      />
    </div>
  );
};

export default Dashboard;
