import React, { useEffect, useState, useRef } from "react";
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaChevronUp,
  FaFilePdf,
  FaMoneyBillWave,
} from "react-icons/fa";
import DashBoardAside from "../components/DashBoardAside";
import { MyPDF, CombinedPDF } from "../utils/ExpensePDF";

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

const MyExpensesPage = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [expensesByGroup, setExpensesByGroup] = useState({});
  const [groupNameMap, setGroupNameMap] = useState({});
  const [groupSummary, setGroupSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const scrollRefs = useRef({});

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get("/expense/my-expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const grouped = {};
        const nameMap = {};
        res.data.expenses.forEach((exp) => {
          const groupId = exp.group?._id || "unknown";
          const groupName = exp.group?.name || "Unknown";
          nameMap[groupId] = groupName;
          if (!grouped[groupId]) grouped[groupId] = [];
          grouped[groupId].push(exp);
        });

        setExpensesByGroup(grouped);
        setGroupNameMap(nameMap);
      } catch (err) {
        console.error("Expense fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSummary = async () => {
      try {
        const { data } = await axios.get("/expense/my-group-summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroupSummary(data);
      } catch (err) {
        console.error("Summary fetch error", err);
      }
    };

    fetchExpenses();
    fetchSummary();
  }, [token]);

  const handleAccordionToggle = (id) => {
    if (expandedGroup === id) {
      setExpandedGroup(null);
    } else {
      setExpandedGroup(id);
      setTimeout(() => {
        scrollRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-teal-50 to-cyan-200 flex font-mono">
      <aside className="w-72 sticky top-0 h-screen overflow-y-auto shadow-md hidden md:block">
        <DashBoardAside />
      </aside>

      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        <div className="max-w-5xl mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-teal-800 font-serif flex items-center gap-3">
              <FaMoneyBillWave className="text-3xl p-2 bg-slate-100 rounded-full" />
              My Expense History
            </h1>

            {Object.keys(expensesByGroup).length > 0 && (
              <PDFDownloadLink
                document={
                  <CombinedPDF
                    allExpenses={expensesByGroup}
                    groupNameMap={groupNameMap}
                    userId={user._id}
                    groupSummary={groupSummary}
                  />
                }
                fileName="AllGroupExpenses.pdf"
                className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-xl shadow font-semibold"
              >
                {({ loading }) => (
                  <>
                    <FaFilePdf />
                    {loading ? "Preparing..." : "Download All as PDF"}
                  </>
                )}
              </PDFDownloadLink>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : Object.keys(expensesByGroup).length === 0 ? (
            <p className="text-center text-gray-600 text-lg">No expenses found.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(expensesByGroup).map(([groupId, groupExpenses]) => {
                const summary = groupSummary.find((g) => g.groupId === groupId);
                const isExpanded = expandedGroup === groupId;

                return (
                  <div
                    key={groupId}
                    ref={(el) => (scrollRefs.current[groupId] = el)}
                    className="bg-gradient-to-br from-cyan-100 to-teal-100 rounded-xl shadow"
                  >
                    <button
                      onClick={() => handleAccordionToggle(groupId)}
                      className="w-full text-left font-semibold flex justify-between items-center text-teal-800 text-lg sm:text-xl px-4 py-3"
                    >
                      <h2>{groupNameMap[groupId]}</h2>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden px-4 pb-4"
                        >
                          {summary && (
                            <div className="bg-white p-3 rounded shadow mb-4 text-sm">
                              <p className="font-bold text-gray-700">Group Summary</p>
                              <p>Paid: ₹{summary.paid.toFixed(2)}</p>
                              <p>Received: ₹{summary.received.toFixed(2)}</p>
                              <p
                                className={`font-semibold ${
                                  summary.balance >= 0
                                    ? "text-green-600"
                                    : "text-red-500"
                                }`}
                              >
                                Balance: ₹{summary.balance.toFixed(2)}
                              </p>
                            </div>
                          )}

                          {groupExpenses.map((exp) => (
                            <div
                              key={exp._id}
                              className="bg-white p-4 rounded shadow mb-3 text-sm sm:text-base"
                            >
                              <p className="font-semibold">
                                {exp.description} - ₹{exp.amount}
                              </p>
                              <p className="text-cyan-700 text-sm">
                                Paid by:{" "}
                                {exp.paidBy?._id === user._id
                                  ? "You"
                                  : exp.paidBy?.fullName || "Unknown"}
                              </p>
                              <p className="text-gray-500 text-xs">
                                Date:{" "}
                                {exp.createdAt
                                  ? new Date(exp.createdAt).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </p>

                              {exp.isSettled && exp.settlementDetails && (
                                <div className="bg-gray-50 border rounded mt-3 p-3 text-xs sm:text-sm">
                                  <p>
                                    Settled via{" "}
                                    <span className="font-semibold text-teal-700 capitalize">
                                      {exp.settlementDetails.paymentMode === "razorpay"
                                        ? "Online"
                                        : "Offline"}
                                    </span>
                                  </p>
                                  <p>
                                    {exp.settlementDetails.payer === user._id ? (
                                      <>
                                        You paid ₹
                                        {exp.settlementDetails.amount.toFixed(2)} to{" "}
                                        <span className="font-medium">
                                          {exp.settlementDetails.payeeName || "someone"}
                                        </span>
                                      </>
                                    ) : exp.settlementDetails.payee === user._id ? (
                                      <>
                                        <span className="font-medium">
                                          {exp.settlementDetails.payerName || "someone"}
                                        </span>{" "}
                                        paid ₹
                                        {exp.settlementDetails.amount.toFixed(2)} to You
                                      </>
                                    ) : (
                                      <>
                                        <span className="font-medium">
                                          {exp.settlementDetails.payerName || "someone"}
                                        </span>{" "}
                                        paid ₹
                                        {exp.settlementDetails.amount.toFixed(2)} to{" "}
                                        <span className="font-medium">
                                          {exp.settlementDetails.payeeName || "someone"}
                                        </span>
                                      </>
                                    )}
                                  </p>
                                  <p className="text-gray-400 text-xs">
                                    Date:{" "}
                                    {new Date(
                                      exp.settlementDetails.settledAt
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}

                          <div className="flex justify-end pt-2">
                            <PDFDownloadLink
                              document={
                                <MyPDF
                                  groupName={groupNameMap[groupId]}
                                  groupExpenses={groupExpenses}
                                  userId={user._id}
                                  summary={summary}
                                />
                              }
                              fileName={`${groupNameMap[groupId] || "Expenses"}.pdf`}
                              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-xl shadow font-semibold"
                            >
                              {({ loading }) => (
                                <>
                                  <FaFilePdf />
                                  {loading ? "Loading..." : "Export PDF"}
                                </>
                              )}
                            </PDFDownloadLink>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyExpensesPage;
