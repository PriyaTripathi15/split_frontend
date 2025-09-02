// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Menu, X, Info, Phone, MessageSquare } from "lucide-react";
import { FaHome, FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import logo from "../assets/logo.png";
import { ToastContainer, toast, Slide } from "react-toastify";
import axios from "../utils/axios";
import socket from "../socket/socket.js";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;

  const getInitials = (user) => {
    if (!user) return "U";
    if (user.name) return user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
    if (user.email) return user.email.slice(0, 2).toUpperCase();
    return "U";
  };
  const initials = getInitials(user);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await axios.get("/notification/unread-count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnreadCount(res.data.count || 0);
      } catch (err) {
        console.error("Failed to fetch unread count", err);
      }
    };
    if (token) fetchUnreadCount();
  }, [token]);

  useEffect(() => {
    if (!user?._id) return;

    const joinRoom = () => {
      socket.emit("join", user._id);
    };

    joinRoom();
    socket.on("connect", joinRoom);
    socket.on("receive-notification", (notif) => {
      setUnreadCount((prev) => prev + 1);
      toast.info(notif.message);
    });

    return () => {
      socket.off("receive-notification");
      socket.off("connect", joinRoom);
    };
  }, [user?._id]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleBellClick = async () => {
    try {
      await axios.put(
        "/notification/mark-read",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadCount(0);
      navigate("/notifications");
    } catch (err) {
      console.error("Error marking notifications as read", err);
    }
  };

  return (
    <header className="bg-teal-800 text-white shadow-md sticky top-0 z-50 w-full">
      <ToastContainer autoClose={3000} hideProgressBar={false} transition={Slide} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-20 w-22 object-cover" />
           
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 font-mono font-bold">
            <Link to="/" className="hover:text-blue-400 flex items-center">
              <FaHome className="mr-2" /> Home
            </Link>
            <Link to="/about" className="hover:text-blue-400 flex items-center">
              <Info className="mr-2" /> About
            </Link>
            <Link to="/contact" className="hover:text-blue-400 flex items-center">
              <Phone className="mr-2" /> Contact
            </Link>
            <Link to="/feedback" className="hover:text-blue-400 flex items-center">
              <MessageSquare className="mr-2" /> Feedback
            </Link>

            {isLoggedIn && (
              <div
                className="relative cursor-pointer hover:text-yellow-300"
                onClick={handleBellClick}
                title="Notifications"
              >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </div>
            )}

            {!isLoggedIn ? (
              <Link
                to="/login"
                className="bg-white text-teal-800 px-3 py-1 rounded hover:bg-gray-200"
              >
                Sign In
              </Link>
            ) : (
              <>
                <Link to="/dashboard">
                  <div
                    title={user?.name || user?.email || "User"}
                    className="bg-white text-teal-800 w-8 h-8 rounded-full flex items-center justify-center font-bold ml-4 cursor-pointer"
                  >
                    {initials}
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-teal-800 px-3 py-1 rounded hover:bg-gray-200 ml-2"
                >
                  Logout
                </button>
              </>
            )}
          </nav>

          {/* Hamburger for Mobile */}
          <div className="md:hidden relative">
            <button
              className="p-2 rounded-md hover:bg-gray-800"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Dropdown Menu (Right-Aligned) */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-teal-900 text-white py-4 px-6 space-y-3 shadow-lg font-mono font-bold rounded-md z-50 w-56">
                <Link to="/" onClick={() => setMenuOpen(false)} className="block hover:text-blue-300">
                  <FaHome className="inline mr-2" /> Home
                </Link>
                <Link to="/about" onClick={() => setMenuOpen(false)} className="block hover:text-blue-300">
                  <Info className="inline mr-2" /> About
                </Link>
                <Link to="/contact" onClick={() => setMenuOpen(false)} className="block hover:text-blue-300">
                  <Phone className="inline mr-2" /> Contact
                </Link>
                <Link to="/feedback" onClick={() => setMenuOpen(false)} className="block hover:text-blue-300">
                  <MessageSquare className="inline mr-2" /> Feedback
                </Link>

                {isLoggedIn && (
                  <div
                    className="relative cursor-pointer hover:text-yellow-300"
                    onClick={() => {
                      handleBellClick();
                      setMenuOpen(false);
                    }}
                  >
                    <FaBell className="inline mr-2" /> Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full inline-flex items-center justify-center animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                )}

                {!isLoggedIn ? (
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block bg-white text-teal-800 px-3 py-1 rounded hover:bg-gray-200"
                  >
                    Sign Up
                  </Link>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                      <div
                        title={user?.name || user?.email || "User"}
                        className="bg-white text-teal-800 w-8 h-8 rounded-full flex items-center justify-center font-bold mt-2"
                      >
                        {initials}
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="block bg-white text-teal-800 px-3 py-1 rounded hover:bg-gray-200 mt-2"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
