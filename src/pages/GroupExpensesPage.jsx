import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { motion } from "framer-motion";

// Skeleton loader for loading state
const SkeletonCard = () => (
  <div className="bg-gradient-to-br from-cyan-100 to-teal-100 p-3 rounded-lg shadow-md relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-white via-teal-100 to-white animate-pulse" />
    <div className="relative z-10 flex justify-between items-center h-12" />
  </div>
);

const GroupExpensesPage = ({ groupId, groupName, token }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!groupId) return;

    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/expense/group/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        // Ensure createdAt exists
        const expensesWithDates = res.data.expenses.map((exp) => ({
          ...exp,
          createdAt: exp.createdAt || new Date().toISOString(),
        }));

        setExpenses(expensesWithDates);
      } catch (err) {
        setError("Failed to load expenses.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [groupId, token]);

  return (
    <div className="bg-gradient-to-br from-cyan-100 via-teal-50 to-cyan-200 p-4 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-xl space-y-3">
        <h2 className="text-center text-2xl mb-4 text-teal-800 font-serif font-bold">
          Group: {groupName || groupId}
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">No expenses found.</p>
        ) : (
          <div className="space-y-2">
            {expenses.map((expense) => {
              const payerName = expense.paidBy?.fullName || expense.paidBy?.email || "Unknown";

              return (
                <motion.div
                  key={expense._id}
                  className="bg-cyan-50 p-4 rounded-lg shadow hover:shadow-md transition flex justify-between items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col justify-center">
                    <span className="text-teal-800 font-semibold">{expense.description}</span>
                    <span className="text-teal-600 text-sm">Paid by: {payerName}</span>
                  </div>
                  <span className="text-teal-700 font-medium text-lg">₹{expense.amount.toFixed(2)}</span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupExpensesPage;
