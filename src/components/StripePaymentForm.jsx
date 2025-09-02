import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "../utils/axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const StripeCheckoutForm = ({ balance, onClose, fetchBalances }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useSelector((state) => state.auth); // user.email is already available
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      // ✅ Use the user's actual email from profile
      const payerEmail = user?.email; 
      const payerName = balance.fromName;

      if (!payerEmail) {
        toast.error("User email is missing!");
        setLoading(false);
        return;
      }

      const { data } = await axios.post("/stripe/create-payment", {
        amount: Number(balance.amount),
        payerEmail,
        payerName,
        currency: "INR",
      });

      const clientSecret = data.clientSecret;

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: payerName,
            email: payerEmail, // ✅ use the profile email here
          },
        },
      });

      if (error) {
        console.error(error);
        toast.error(error.message || "Stripe payment failed.");
      } else if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        onClose();
        fetchBalances(); // refresh balances
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Stripe payment error.");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-xl">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <button
        type="button"
        onClick={handlePayment}
        disabled={!stripe || loading}
        className="w-full py-2 font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
      >
        {loading ? "Processing Stripe..." : `Pay ₹${balance.amount} via Stripe`}
      </button>
    </div>
  );
};

const StripePaymentForm = ({ balance, onClose, fetchBalances }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm balance={balance} onClose={onClose} fetchBalances={fetchBalances} />
    </Elements>
  );
};

export default StripePaymentForm;
