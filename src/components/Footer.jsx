import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaHome,
  FaPhoneAlt,
  FaEnvelope,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-teal-900 text-white py-10" id="page-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* Brand & Tagline */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold font-serif mb-2">SPLIT-IT</h2>
            <p className="text-sm text-gray-300 mb-2">
              Split your expenses, avoid awkward talks. Manage group bills easily with transparency.
            </p>
            <div className="flex space-x-2 mt-4">
              <a
                href="#"
                className="flex items-center bg-black px-2 py-1 rounded hover:bg-gray-800"
              >
                <FaGooglePlay className="mr-2" />{" "}
                <span className="text-xs">Google Play</span>
              </a>
              <a
                href="#"
                className="flex items-center bg-black px-2 py-1 rounded hover:bg-gray-800"
              >
                <FaApple className="mr-2" />{" "}
                <span className="text-xs">App Store</span>
              </a>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h2 className="text-lg underline font-semibold mb-3">About Us</h2>
            <p className="text-sm text-gray-300">
              SPLIT-IT is dedicated to making group expense management simple and stress-free. Whether it's trips, dinners, or shared living, we help you keep things fair and transparent.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg underline font-semibold mb-3">Quick Links</h2>
            <div className="flex flex-col space-y-2 font-mono font-bold">
              <Link to="/" className="hover:text-blue-400">Home</Link>
              <Link to="/about" className="hover:text-blue-400">About</Link>
              <Link to="/contact" className="hover:text-blue-400">Contact</Link>
              <Link to="/feedback" className="hover:text-blue-400">Feedback</Link>
              <Link to="/register" className="hover:text-blue-400">Sign Up</Link>
              <Link to="/login" className="hover:text-blue-400">Log In</Link>
            
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-lg underline font-semibold mb-3">Contact Us</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <p className="flex items-center gap-2">
                <FaHome /> 123 Tech Park, Bhopal, India
              </p>
              <p className="flex items-center gap-2">
                <FaPhoneAlt /> +91 9876543210
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope /> support@splitit.com
              </p>
            </div>
          </div>

          {/* Newsletter (static UI only) */}
          <div>
            <h2 className="text-lg underline font-semibold mb-3">Newsletter</h2>
            <p className="text-sm text-gray-300 mb-3">
              Stay updated! Join our newsletter.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-2 py-1 rounded-l bg-white text-black w-full"
              />
              <button className="bg-blue-500 px-3 rounded-r hover:bg-blue-600">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 my-6" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SPLIT-IT. All rights reserved.
          </p>
          <div className="flex space-x-5 text-2xl text-gray-400 mt-4 md:mt-0">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <FaGithub />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <FaLinkedin />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <FaTwitter />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;