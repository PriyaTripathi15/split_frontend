import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import DashBoardAside from "../components/DashBoardAside";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, LineChart, Line,
  Legend
} from "recharts";
import Loader from "../components/Loader";

const COLORS = ["#00ACC1", "#26C6DA", "#4DD0E1", "#0097A7", "#00B8D4", "#00838F", "#80DEEA"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow text-sm border border-teal-400">
        <p className="font-semibold text-teal-700">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-gray-600">
            {entry.name}: ₹{entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ExpenseInsights = () => {
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;

  const [summary, setSummary] = useState(null);
  const [groupData, setGroupData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [paidVsOwed, setPaidVsOwed] = useState([]);
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const s = await axios.get(`/stats/user/${userId}`);
        const m = await axios.get(`/stats/user/${userId}/monthly`);
        const p = await axios.get(`/stats/user/${userId}/paid-vs-owed`);

        setSummary(s.data);

        setGroupData(
          Object.entries(s.data.groupBreakdown).map(([k, v]) => ({ name: k, value: v }))
        );

        setPieData(
          Object.entries(s.data.categoryBreakdown).map(([k, v]) => ({ name: k, value: v }))
        );

        // Ensure current month is added even if no expense
        const currentMonth = new Date().toLocaleString('default', { month: 'short' });
        let monthlyData = m.data;
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (!monthlyData.some(item => item.name === currentMonth)) {
          monthlyData.push({ name: currentMonth, spent: 0 });
        }

        monthlyData.sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));

        setMonthly(monthlyData);
        setPaidVsOwed(p.data);
      } catch (err) {
        console.error("Failed to fetch insights:", err.message);
      }
    })();
  }, [userId]);

  if (!userId) return <div className="p-4 text-red-600">User not logged in.</div>;
  if (!summary) return <div className="p-4"><Loader/></div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-cyan-100 to-teal-100 ">
      <DashBoardAside />
      <div className="flex-1 p-6 space-y-16 flex flex-col items-center overflow-y-auto">

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-cyan-700 text-white p-4 rounded-xl text-center">
            <h3 className="text-xl font-bold">₹{summary.totalSpent}</h3>
            <p>Total Spent</p>
          </div>
          <div className="bg-teal-600 text-white p-4 rounded-xl text-center">
            <h3 className="text-xl font-bold">{summary.totalGroups}</h3>
            <p>Total Groups</p>
          </div>
          <div className="bg-cyan-500 text-white p-4 rounded-xl text-center">
            <h3 className="text-xl font-bold">{summary.totalExpenses}</h3>
            <p>Total Expenses</p>
          </div>
        </div>

        {/* 1. Category-wise Pie Chart */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Category-wise Spending</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name }) => name}
              isAnimationActive={true}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </div>

        {/* 2. Group-wise Bar Chart */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Group-wise Spending</h2>
          <BarChart width={500} height={300} data={groupData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#00ACC1" isAnimationActive />
          </BarChart>
        </div>

        {/* 3. Paid vs Owed Histogram */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Paid vs Owed</h2>
          <BarChart width={500} height={300} data={paidVsOwed} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#26C6DA" />
          </BarChart>
        </div>

        {/* 4. Monthly Spending Trend (Dotted Line Chart) */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-cyan-800 mb-3">Monthly Spending Trend</h2>
          <LineChart width={600} height={300} data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="spent"
              stroke="#00ACC1"
              strokeWidth={2}
              strokeDasharray="5 5"
              isAnimationActive
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default ExpenseInsights;
