import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../features/authSlice";
import instance from "../../utils/axios";
import authImage from "../../assets/auth.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && token) navigate("/dashboard");
  }, [user, token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) return toast.error("All fields are required");

    dispatch(loginStart());
    try {
      const res = await instance.post("/auth/login", formData);
      dispatch(loginSuccess(res.data));
      toast.success("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
      dispatch(loginFailure(msg));
    }
  };

const handleGoogleLogin = async (credentialResponse) => {
  try {
    dispatch(loginStart());

    const res = await instance.post("/auth/google-login", {
      credential: credentialResponse.credential,
    });

    if (!res.status || res.status !== 200) {
      toast.error(res.data?.message || "Google Sign-In failed");
      dispatch(loginFailure("Google Sign-In failed"));
      return;
    }

    dispatch(loginSuccess(res.data)); // stores token + user in Redux
  toast.success("Google Sign-In successful! 🎉", {
  position: "top-right", 
  autoClose: 5000,     
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

    setTimeout(() => navigate("/dashboard"), 1500);
  } catch (err) {
    console.error("Google Sign-In Error:", err);
    toast.error("Something went wrong. Try again later.");
    dispatch(loginFailure("Google Sign-In failed"));
  }
};

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error("Please enter your email in the email field.");
      return;
    }
    try {
      await instance.post("/auth/forgot-password", { email: formData.email });
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send reset link.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-teal-100 p-6">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="flex flex-col md:flex-row max-w-5xl w-full shadow-2xl rounded-2xl overflow-hidden bg-white">
        <div className="w-full md:w-1/2 p-6 bg-teal-200 hidden md:flex">
          <img src={authImage} alt="Login Visual" className="w-full h-auto object-cover" />
        </div>

        <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-teal-900 text-center mb-6 font-serif">Login to Split-It</h2>

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
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google Sign-in failed")}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-teal-600"
              >
                {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-3 px-4 rounded-lg hover:bg-teal-800 transition duration-300"
            >
              Login
            </button>
          </form>

          <div className="flex justify-end mt-3">
            <button
              onClick={handleForgotPassword}
              className="text-sm text-teal-700 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <p className="text-center text-teal-900 mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-teal-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

