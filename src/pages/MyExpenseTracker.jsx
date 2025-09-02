import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MyExpenseTracker = () => {
  const { token } = useSelector((state) => state.auth);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchExpenseSummary = async () => {
      try {
        const { data } = await axios.get("/expense/my-summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(data?.summary || data);
      } catch (err) {
        console.error("Error fetching summary", err);
      }
    };

    fetchExpenseSummary();
  }, [token]);

  if (!summary) return null;

  // Bar chart data
  const barData = [
    {
      category: "Expenses",
      Spent: summary.totalSpent || 0,
      "My Expense": summary.myExpense || 0,
      "Active Owe": summary.myActiveExpenses || 0,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-cyan-50 rounded-2xl p-8 mb-10">
      <h3 className="text-2xl font-extrabold text-teal-800 mb-10 text-center font-serif tracking-tight">
        My Total Expenses
      </h3>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {/* Total Spent */}
        <div className="bg-gradient-to-br from-cyan-100 to-teal-100 rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
          <p className="text-lg text-cyan-800 font-semibold mb-2">Total Spent</p>
          <p className="text-3xl font-bold text-blue-800">
            ₹{(summary.totalSpent || 0).toFixed(2)}
          </p>
        </div>

        {/* My Expense */}
        <div className="bg-gradient-to-br from-cyan-100 to-red-100 rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
          <p className="text-lg text-cyan-800 font-semibold mb-2">My Expense</p>
          <p className="text-3xl font-bold text-red-700">
            ₹{(summary.myExpense || 0).toFixed(2)}
          </p>
        </div>

        {/* My Active Expense */}
        <div className="bg-gradient-to-br from-cyan-100 to-purple-100 rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
          <p className="text-lg text-cyan-800 font-semibold mb-2">My Active Expense</p>
          <p className="text-3xl font-bold text-purple-700">
            ₹{(summary.myActiveExpenses || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Grouped Bar Chart */}
      <div className="mt-12">
        <h4 className="text-xl font-bold text-center text-cyan-800 mb-4">
          Visual Summary (Grouped)
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={barData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(val) => `₹${val.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="Spent" fill="#0288D1" radius={[6, 6, 0, 0]} />
            <Bar dataKey="My Expense" fill="#F44336" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Active Owe" fill="#9C27B0" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* View Full Report Button */}
      <div className="mt-8 text-center">
        <Link
          to="/my-expenses"
          className="inline-block bg-teal-700 text-white px-6 py-2 rounded-xl font-semibold shadow hover:bg-cyan-700 transition"
        >
          View Full Report →
        </Link>
      </div>
    </div>
  );
};

export default MyExpenseTracker;

