import React, { useState } from "react";
import { motion } from "framer-motion";
import feedbackImg from "../../assets/feedback.png";
import { Star } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API from "../../utils/axios";

const slideFromLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  // Handle feedback change with word limit
  const handleFeedbackChange = (e) => {
    const value = e.target.value;
    const words = value.trim().split(/\s+/);
    if (words[0] === "") {
      setFeedback("");
      setWordCount(0);
    } else if (words.length <= 50) {
      setFeedback(value);
      setWordCount(words.length);
    } else {
      // Prevent typing more than 50 words
      setFeedback(words.slice(0, 50).join(" "));
      setWordCount(50);
      toast.error("Maximum 50 words allowed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback || rating === 0) {
      toast.error("Please provide both feedback and a rating.");
      return;
    }
    if (wordCount > 50) {
      toast.error("Feedback must be 50 words or less.");
      return;
    }
    try {
      await API.post("/general/submit-feedback", { feedback, rating });
      toast.success("Thanks for your feedback and story 😊");
      setFeedback("");
      setRating(0);
      setWordCount(0);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send feedback."
      );
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen px-6 lg:px-20 py-12 from-cyan-100 to-teal-50 text-gray-800 space-y-16">
      <Toaster position="top-center" />

      {/* Header */}
      <motion.div
        className="flex flex-col lg:flex-row items-center gap-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideFromLeft}
      >
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-teal-800 mb-6 font-serif">
            Share Your Experience
          </h2>
          <p className="text-lg text-gray-700 font-mono leading-relaxed">
            We’d love to hear your story! What made you try{" "}
            <span className="text-teal-700 font-semibold">Split-It</span>, and how did it help you?
          </p>
          <p className="text-lg text-gray-700 font-mono leading-relaxed mt-4">
            Whether you split bills with friends, managed expenses with roommates, or just made settling up easier, your feedback helps us improve.
          </p>
        </div>
        <motion.div className="flex-1" variants={slideFromRight}>
          <img
            src={feedbackImg}
            alt="User feedback"
            className="w-full max-w-md mx-auto rounded-xl shadow-md transition-transform duration-500 hover:scale-105 hover:shadow-lg"
          />
        </motion.div>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-gray-100 p-8 rounded-xl shadow-md space-y-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideFromRight}
      >
        {/* Rating */}
        <div>
          <span className="text-lg text-teal-800 font-semibold">Your Rating</span>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <Star
                key={num}
                size={28}
                onClick={() => setRating(num)}
                className={`cursor-pointer transition-transform ${
                  num <= rating ? "text-black fill-teal-400" : "text-gray-400"
                } hover:scale-110`}
              />
            ))}
          </div>
        </div>

        {/* Feedback */}
        <label className="block">
          <span className="text-lg text-teal-800 font-semibold">Your Experience</span>
          <textarea
            className="mt-2 w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-800"
            rows="5"
            placeholder="Tell us how Split-It helped you..."
            value={feedback}
            onChange={handleFeedbackChange}
            required
          />
          <div className="text-right text-sm mt-1">
            {wordCount}/50 words
            {wordCount > 50 && (
              <span className="text-red-600 ml-2">Max 50 words allowed</span>
            )}
          </div>
        </label>

        <button
          type="submit"
          className="bg-teal-700 text-white px-6 py-3 rounded-md font-semibold hover:bg-teal-600 transition-all"
        >
          Submit Feedback
        </button>
      </motion.form>
    </div>
  );
};

export default Feedback;