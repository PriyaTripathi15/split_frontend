import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import authImage from "../../assets/auth.png";
import instance from "../../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.password || !formData.confirm) {
      toast.error("All fields are required");
      return;
    }
    if (formData.password !== formData.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await instance.post("/auth/reset-password", {
        token,
        password: formData.password,
      });
      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-teal-100 p-6">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="flex flex-col md:flex-row max-w-5xl w-full shadow-2xl rounded-2xl overflow-hidden bg-white">
        <div className="w-full md:w-1/2 p-6 bg-teal-200 hidden md:flex">
          <img src={authImage} alt="Reset Visual" className="w-full h-auto object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-teal-900 text-center mb-6 font-serif">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-4 border border-teal-400 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="confirm"
                placeholder="Confirm Password"
                value={formData.confirm}
                onChange={handleChange}
                required
                className="w-full p-4 border border-teal-400 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-teal-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 text-white py-3 px-4 rounded-lg hover:bg-teal-800 transition duration-300"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          <p className="text-center text-teal-900 mt-4">
            Back to{" "}
            <Link to="/login" className="text-teal-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;