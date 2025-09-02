import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import StripePaymentForm from "../components/StripePaymentForm";

const BalanceSummary = ({ groupId }) => {
  const { token, user } = useSelector((state) => state.auth);
  const [balances, setBalances] = useState([]);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [selectedBalance, setSelectedBalance] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("offline");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBalances();
  }, [groupId, token]);

  const fetchBalances = async () => {
    try {
      const { data } = await axios.get(`/groups/balances/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalances(data);
    } catch (err) {
      console.error("Error fetching balances", err);
    }
  };

  const openSettleModal = (balance) => {
    setSelectedBalance(balance);
    setPaymentMethod("offline");
    setShowSettleModal(true);
  };

  const closeSettleModal = () => {
    setShowSettleModal(false);
    setSelectedBalance(null);
    setLoading(false);
  };

  const handleOfflineSettle = async () => {
    if (!selectedBalance) return;
    setLoading(true);
    try {
      await axios.post(
        "/transaction/settle",
        {
          groupId,
          payer: selectedBalance.from,
          payee: selectedBalance.to,
          amount: selectedBalance.amount,
          type: "settle",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Offline settlement request sent!");
      closeSettleModal();
      fetchBalances();
    } catch (err) {
      console.error(err);
      toast.error("Error settling offline payment");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Balance Summary</h2>
      </div>

      {balances.length === 0 ? (
        <p className="text-gray-500">You have no pending balances in this group.</p>
      ) : (
        <ul className="space-y-2">
          {balances.map((bal, i) => {
            const currentUserIsPayer = bal.from === user._id;
            return (
              <li key={i} className="text-gray-700 flex justify-between items-center">
                <span>
                  <span className="font-medium">{bal.fromName}</span> owes{" "}
                  <span className="font-medium">{bal.toName}</span> ₹{bal.amount}
                </span>
                {currentUserIsPayer && (
                  <button
                    className="text-sm text-green-600 hover:underline"
                    onClick={() => openSettleModal(bal)}
                  >
                    Settle
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal */}
      {showSettleModal && selectedBalance && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
          <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-teal-200 p-6">
              <button
                onClick={closeSettleModal}
                className="absolute top-2 right-3 text-2xl font-bold text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                &times;
              </button>

              <h3 className="text-2xl font-bold text-center text-teal-600 mb-2">Settle Up</h3>
              <p className="text-center text-gray-700 mb-4 text-sm">
                <span className="font-medium text-gray-900">{selectedBalance.fromName}</span> owes{" "}
                <span className="font-medium text-gray-900">{selectedBalance.toName}</span>{" "}
                <span className="text-teal-600 font-semibold">₹{selectedBalance.amount}</span>
              </p>

              {/* Payment method selector */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1 text-gray-700">Payment Method</label>
                <select
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-400"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={loading}
                >
                  <option value="offline">Offline Cash</option>
                  <option value="stripe">Stripe (Online)</option>
                </select>
              </div>

              {/* Payment options */}
              {paymentMethod === "offline" ? (
                <button
                  type="button"
                  onClick={handleOfflineSettle}
                  disabled={loading}
                  className="w-full py-2 font-semibold rounded-xl text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                >
                  {loading ? "Processing..." : "Pay & Settle"}
                </button>
              ) : (
                <StripePaymentForm
                  balance={selectedBalance}
                  onClose={closeSettleModal}
                  fetchBalances={fetchBalances} // optional
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BalanceSummary;
