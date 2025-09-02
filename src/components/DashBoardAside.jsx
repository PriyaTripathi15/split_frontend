import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { 
  MdDashboard, MdGroupAdd, MdGroup, MdHistory, 
  MdNotificationsActive, MdAccountCircle, 
  MdOutlineAlignHorizontalRight
} from 'react-icons/md';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";

import { use } from 'react';

const DashBoardAside = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
   const dispatch = useDispatch();

  // Auto-collapse when footer is visible
useEffect(() => {
  const footerElement = document.getElementById("page-footer");

  const handleResize = () => {
    if (window.innerWidth < 1300) {
      setIsOpen(false); // Collapse on small screens
    } else {
      setIsOpen(true); // Expand on larger screens
    }
  };

  handleResize(); // Call once on mount

  window.addEventListener("resize", handleResize);

  const observer = footerElement
    ? new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setIsOpen(false);
          else if (window.innerWidth >= 768) setIsOpen(true);
        },
        { threshold: 0.1 }
      )
    : null;

  if (observer && footerElement) observer.observe(footerElement);

  return () => {
    window.removeEventListener("resize", handleResize);
    if (observer && footerElement) observer.unobserve(footerElement);
  };
}, []);


 const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", icon: <MdDashboard size={22} />, label: "Dashboard" },
    { to: "/group/create", icon: <MdGroupAdd size={22} />, label: "Create Group" },
    { to: "/grouplist", icon: <MdGroup size={22} />, label: "My Groups" },
    { to: "/my-expenses", icon: <MdHistory size={22} />, label: "Expense History" },
    { to: "/notifications", icon: <MdNotificationsActive size={22} />, label: "New Notifications" },
    { to: "/expense-insight", icon: <MdOutlineAlignHorizontalRight size={22} />, label: "Expense Insight" },
    { to: "/profile", icon: <MdAccountCircle size={22} />, label: "Profile"},
  ];

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed top-28 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 bg-white rounded shadow hover:bg-gray-100 transition"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed top-29 left-0 bg-white/90 backdrop-blur shadow-lg p-4 text-teal-900 transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <nav className="space-y-3 mt-6">
          {navItems.map(({ to, icon, label }) => (
            <Link 
              to={to} 
              key={label} 
              className={`flex items-center gap-2 p-2 rounded transition-all ${
                location.pathname === to ? 'bg-teal-200 font-semibold' : 'hover:bg-teal-100'
              }`}
            >
              {icon}
              <span 
                className={`transition-all duration-200 ${
                  isOpen ? 'opacity-100' : 'opacity-0 hidden'
                }`}
              >
                {label}
              </span>
            </Link>
          ))}

          <div 
            onClick={handleLogout} 
            className="flex items-center gap-3 p-2 hover:bg-teal-100 rounded cursor-pointer transition-all mt-4"
          >
            <FiLogOut size={20} />
            <span 
              className={`transition-all duration-200 ${
                isOpen ? 'opacity-100' : 'opacity-0 hidden'
              }`}
            >
              Logout
            </span>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default DashBoardAside;
