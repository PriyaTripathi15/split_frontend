import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import authImage from "../../assets/auth.png";
import { GoogleLogin } from "@react-oauth/google";
import API from "../../utils/axios.js";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../features/authSlice.js";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await API.post("/auth/register", {
        fullName,
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      dispatch(
        loginSuccess({
          token: response.data.token,
          user: response.data.user,
        })
      );

      toast.success("Registration successful! 🎉 Logging in...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-teal-100 p-6">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="flex flex-col md:flex-row max-w-5xl w-full shadow-2xl rounded-2xl overflow-hidden bg-white">
        <div className="w-full md:w-1/2 p-6 bg-teal-200 hidden md:flex">
          <img
            src={authImage}
            alt="Decorative Illustration"
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-teal-900 text-center mb-6 font-serif">
            Register in Split-It
          </h2>

          <div className="flex items-center mb-6">
            <hr className="flex-grow border-t border-black" />
            <span className="mx-3 text-teal-500 font-semibold">OR</span>
            <hr className="flex-grow border-t border-black" />
          </div>

          <div className="mb-4 flex justify-center">
            <div className="w-full max-w-xs">
              <GoogleLogin
                width="300"
                size="large"
                theme="outline"
                shape="rectangular"
                onSuccess={async (credentialResponse) => {
                  try {
                    dispatch(loginStart());

                    const res = await API.post("/auth/google-login", {
                      credential: credentialResponse.credential,
                    });

                    if (!res.status || res.status !== 200) {
                      toast.error(res.data?.message || "Google Sign-In failed");
                      dispatch(loginFailure("Google Sign-In failed"));
                      return;
                    }

                    dispatch(loginSuccess(res.data)); // stores token + user in Redux
                    toast.success("Google Sign-In successful! 🎉");

                    setTimeout(() => navigate("/dashboard"), 1500);
                  } catch (err) {
                    console.error("Google Sign-In Error:", err);
                    toast.error("Something went wrong. Try again later.");
                    dispatch(loginFailure("Google Sign-In failed"));
                  }
                }}
              />
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full p-4 border border-teal-400 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-4 border border-teal-400 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-4 border border-teal-400 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-teal-600"
              >
                {showPassword ? (
                  <AiFillEyeInvisible size={24} />
                ) : (
                  <AiFillEye size={24} />
                )}
              </span>
            </div>

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-4 border border-teal-400 rounded-lg focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />

            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-3 px-4 rounded-lg hover:bg-teal-800 transition duration-300"
            >
              Register
            </button>
          </form>

          <p className="text-center text-teal-900 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-teal-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
