import React, { useState } from "react";
import API from "../../utils/axios";
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime } from "react-icons/md";
import img from "../../assets/contact.avif";
import { toast } from "react-toastify";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    submitted: false,
    loading: false,
    error: null,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitted: false, loading: true, error: null });

    try {
      await API.post("/general/contact", formData);
      setStatus({ submitted: true, loading: false, error: null });
      setFormData({ name: "", email: "", message: "" });
      toast.success("Your message has been sent!");
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to send message";
      setStatus({ submitted: false, loading: false, error: message });
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-teal-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Image */}
        <div className="md:w-1/2">
          <img
            src={img}
            alt="Contact Us"
            className="h-full w-full object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
          />
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-teal-900 mb-6 text-center md:text-left font-serif">
            Contact Us
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 mb-10">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 bg-teal-50"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 bg-teal-50"
                placeholder="Your Email"
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-1 font-medium text-gray-700">
                Ask any Query or Just drop a message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-400 bg-teal-50"
                placeholder="Write your message here..."
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className={`w-full bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition font-semibold shadow ${
                status.loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {status.loading ? "Sending..." : "Send Message"}
            </button>

            {status.submitted && (
              <p className="mt-4 text-green-600 font-semibold text-center">
                Thank you! Your message has been sent.
              </p>
            )}

            {status.error && (
              <p className="mt-4 text-red-600 font-semibold text-center">
                {status.error}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Contact Info */}
     {/* Contact Info Boxes with Shadow */}
<div className="w-full max-w-5xl mt-10 p-8">
  <h3 className="text-2xl font-semibold text-teal-800 mb-6 text-center font-serif">
    Contact Us Here
  </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-700">
    <div
      onClick={() => window.location.href = "mailto:support@spliteit.com"}
      className="cursor-pointer flex flex-col items-center gap-3 bg-white rounded-xl shadow-lg p-8 hover:text-teal-700 hover:scale-105 transition"
    >
      <MdEmail className="text-4xl text-teal-600" />
      <span className="text-lg font-semibold break-all">support@spliteit.com</span>
      <span className="text-xs text-gray-800">Email Us</span>
    </div>
    <div
      onClick={() => window.location.href = "tel:+919876543210"}
      className="cursor-pointer flex flex-col items-center gap-3 bg-white rounded-xl shadow-lg p-8 hover:text-teal-700 hover:scale-105 transition"
    >
      <MdPhone className="text-4xl text-teal-600" />
      <span className="text-lg font-semibold">+91 98765 43210</span>
      <span className="text-xs text-gray-400">Call Us</span>
    </div>
    <div className="flex flex-col items-center gap-3 bg-white rounded-xl shadow-lg p-8">
      <MdLocationOn className="text-4xl text-teal-600" />
      <span className="text-lg font-semibold text-center">123 Tech Park, Bhopal, India</span>
      <span className="text-xs text-gray-400">Visit Us</span>
    </div>
  </div>
</div>


      {/* Embedded Map */}
      <div className="w-full max-w-5xl mt-8">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117653.55018756388!2d77.36994986950566!3d23.258485801041132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c426c97bb3f9f%3A0x82f1f4f9d8a4fc58!2sBhopal%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          className="rounded-lg shadow-lg"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;
