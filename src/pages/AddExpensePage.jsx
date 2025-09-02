import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import DashboardAside from "../components/DashBoardAside";

const AddExpensePage = () => {
  const { groupId } = useParams();
  const { token, user } = useSelector((state) => state.auth);
  const [group, setGroup] = useState(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [splitBetween, setSplitBetween] = useState([]);
  const [paidBy, setPaidBy] = useState("");
  const navigate = useNavigate();

  // 🔹 Fetch Group Members
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const members = res.data.group.members;
        setGroup(res.data.group);
        setPaidBy(user._id);

        const initialSplit = members.map((member) => ({
          userId: member.userId._id,
          fullName: member.userId.fullName,
          checked: true,
          amount: 0,
          percentage: 0,
        }));
        setSplitBetween(initialSplit);
      } catch (err) {
        console.error("Failed to fetch group:", err);
      }
    };

    if (token) fetchGroup();
  }, [groupId, token, user._id]);

  // 🔹 Update Splits
  useEffect(() => {
    const amt = parseFloat(amount);
    if (!amt || splitBetween.length === 0) return;

    const selected = splitBetween.filter((m) => m.checked);

    if (splitType === "equal") {
      const perHead = amt / selected.length;
      setSplitBetween((prev) =>
        prev.map((m) =>
          m.checked
            ? { ...m, amount: perHead, percentage: 0 }
            : { ...m, amount: 0, percentage: 0 }
        )
      );
    } else if (splitType === "percentage") {
      setSplitBetween((prev) =>
        prev.map((m) =>
          m.checked
            ? {
                ...m,
                amount: parseFloat(
                  ((amt * (m.percentage || 0)) / 100).toFixed(2)
                ),
              }
            : { ...m, amount: 0 }
        )
      );
    }
  }, [amount, splitType]);

  // 🔹 Checkbox Toggle
  const handleCheckboxChange = (userId) => {
    setSplitBetween((prev) =>
      prev.map((m) => (m.userId === userId ? { ...m, checked: !m.checked } : m))
    );
  };

  // 🔹 Percentage Change
  const handlePercentageChange = (userId, value) => {
    let val = parseFloat(value);
    if (isNaN(val) || val < 0) val = 0;
    if (val > 100) val = 100;

    setSplitBetween((prev) =>
      prev.map((m) => (m.userId === userId ? { ...m, percentage: val } : m))
    );
  };

  // 🔹 Exact Amount Change
  const handleExactAmountChange = (userId, value) => {
    let val = parseFloat(value);
    if (isNaN(val) || val < 0) val = 0;

    setSplitBetween((prev) =>
      prev.map((m) => (m.userId === userId ? { ...m, amount: val } : m))
    );
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selected = splitBetween
      .filter((m) => m.checked)
      .map(({ userId, amount, percentage }) => {
        return splitType === "percentage"
          ? {
              userId,
              amount: parseFloat(amount.toFixed(2)),
              percentage: parseFloat(percentage.toFixed(2)),
            }
          : {
              userId,
              amount: parseFloat(amount.toFixed(2)),
            };
      });

    if (
      !description.trim() ||
      !amount ||
      !category ||
      selected.length === 0 ||
      !paidBy
    ) {
      toast.info("Please fill all required fields and select at least one member.");
      return;
    }

    if (splitType === "exact") {
      const totalExact = selected.reduce((acc, m) => acc + m.amount, 0);
      if (Math.abs(totalExact - parseFloat(amount)) > 0.01) {
        toast.error(
          `Sum of exact amounts ₹${totalExact.toFixed(
            2
          )} doesn't match total ₹${parseFloat(amount).toFixed(2)}`
        );
        return;
      }
    } else if (splitType === "percentage") {
      const totalPercent = selected.reduce((acc, m) => acc + m.percentage, 0);
      if (Math.abs(totalPercent - 100) > 0.1) {
        toast.error(`Sum of percentages ${totalPercent.toFixed(2)}% must be 100%`);
        return;
      }
    }

    try {
      await axios.post(
        `/expense/add/${groupId}`,
        {
          description,
          amount: parseFloat(amount),
          category,
          paidBy,
          splitType,
          participants: selected,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/group/${groupId}`);
    } catch (err) {
      console.error("Error adding expense:", err);
      toast.error("Failed to add expense. Try again.");
    }
  };

  // 🔹 Summary
  const renderSummary = () => {
    const selectedMembers = splitBetween.filter((m) => m.checked);
    const payer = splitBetween.find((m) => m.userId === paidBy);
    const payerName = payer?.fullName || "Someone";

    return (
      <div className="bg-white border border-teal-200 text-gray-700 shadow-sm p-4 rounded-xl mt-6">
        <h3 className="text-lg font-semibold mb-2 text-teal-700">Summary:</h3>
        <p className="mb-2">
          <span className="font-medium">{payerName}</span> paid ₹
          {parseFloat(amount || 0).toFixed(2)}
        </p>
        <ul className="text-sm list-disc pl-5 text-gray-600">
          {selectedMembers.map((m) => (
            <li key={m.userId}>
              {m.fullName} owes ₹{m.amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-cyan-50 via-teal-50 to-cyan-100 ml-10">
      {/* Sidebar */}
      <DashboardAside />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md shadow-lg p-8 rounded-2xl border border-cyan-200">
          {group && (
            <h2 className="text-2xl font-serif font-bold mb-4 text-teal-800">
              Add Expense for:{" "}
              <span className="text-cyan-600">{group.name}</span>
            </h2>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Expense description"
              className="w-full p-2 rounded border border-cyan-200 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Total amount"
              className="w-full p-2 rounded border border-cyan-200 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 rounded border border-cyan-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Groceries">Groceries</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Others">Others</option>
            </select>

            {/* Paid By */}
            <label className="block font-medium text-teal-800">Who paid?</label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full p-2 rounded border border-cyan-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              {splitBetween.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.fullName}
                </option>
              ))}
            </select>

            {/* Split Type */}
            <label className="block font-medium text-teal-800">Split Type</label>
            <select
              value={splitType}
              onChange={(e) => setSplitType(e.target.value)}
              className="w-full p-2 rounded border border-cyan-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="equal">Equal</option>
              <option value="exact">Exact Amount</option>
              <option value="percentage">Percentage</option>
            </select>

            {/* Split Between */}
            <div>
              <label className="block font-medium text-teal-800 mb-2">
                Split Between:
              </label>
              {splitBetween.map((m) => (
                <div key={m.userId} className="flex items-center mb-2 gap-2">
                  <input
                    type="checkbox"
                    checked={m.checked}
                    onChange={() => handleCheckboxChange(m.userId)}
                  />
                  <span className="w-24 text-gray-700">{m.fullName}</span>
                  {splitType === "exact" && m.checked && (
                    <input
                      type="number"
                      placeholder="Amount"
                      value={m.amount}
                      onChange={(e) =>
                        handleExactAmountChange(m.userId, e.target.value)
                      }
                      className="w-24 p-1 rounded border border-cyan-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  )}
                  {splitType === "percentage" && m.checked && (
                    <input
                      type="number"
                      placeholder="%"
                      value={m.percentage}
                      onChange={(e) =>
                        handlePercentageChange(m.userId, e.target.value)
                      }
                      className="w-24 p-1 rounded border border-cyan-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  )}
                  {splitType === "equal" && m.checked && (
                    <span className="text-sm text-cyan-700">
                      ₹{m.amount.toFixed(2)}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:from-teal-600 hover:to-cyan-600 transition"
            >
              Add Expense
            </button>
          </form>

          {renderSummary()}
        </div>
      </div>
    </div>
  );
};

export default AddExpensePage;
