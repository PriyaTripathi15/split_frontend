import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import aboutImg from "../../assets/about1.jpg";
import featuresImg from "../../assets/about.jpg";
import storyImg from "../../assets/about2.png";

// Animation variants
const slideFromLeft = {
  hidden: { opacity: 0, x: -150 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 150 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};


const About = () => {
  return (
    <div className="min-h-screen  from-cyan-100 to-teal-50 text-gray-800 px-6 lg:px-20 py-10 space-y-24">

      {/* What is Split-It Section */}
      <motion.div
        className="flex flex-col lg:flex-row items-center gap-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={slideFromLeft}
      >
        <div className="flex-1 ">
          <h1 className="text-4xl font-bold text-teal-800 mb-6 font-serif">What is Split-It?</h1>
          <p className="text-lg leading-relaxed font-mono text-gray-700">
            <span className="font-semibold text-teal-700">Split-It</span> is a smart and simple app that helps you split expenses with friends and family. Whether you're going on a trip, living with roommates, or just sharing food — Split-It makes it easy to track who paid what and who owes whom.
          </p>
        </div>
        <motion.div
          className="flex-1"
          variants={slideFromRight}
        >
          <img
            src={aboutImg}
            alt="About Split-It"
            className="w-full max-w-md mx-auto rounded-xl shadow-md transition-transform duration-500 hover:scale-105 hover:shadow-lg"
          />
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="flex flex-col-reverse lg:flex-row items-center gap-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={slideFromRight}
      >
        <motion.div
          className="flex-1"
          variants={slideFromLeft}
        >
          <img
            src={featuresImg}
            alt="Split-It Features"
            className="w-full max-w-md mx-auto rounded-xl shadow-md transition-transform duration-500 hover:scale-105 hover:shadow-lg"
          />
        </motion.div>
        <div className="flex-1">
          <h2 className="text-3xl font-semibold text-teal-800 mb-4 font-serif"> Features</h2>
          <ul className="list-disc text-xl list-inside text-gray-700 font-mono font-semibold space-y-2">
            <li>Create groups and invite members by email</li>
            <li>Add and split expenses with ease</li>
            <li>Real-time chat with message likes</li>
            <li>Login using email or Google</li>
            <li>Minimalist, user-friendly design</li>
          </ul>
        </div>
      </motion.div>

      {/* Why We Built It Section */}
      <motion.div
        className="flex flex-col lg:flex-row items-center gap-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={slideFromLeft}
      >
        <div className="flex-1">
         <h2 className="text-3xl font-semibold text-teal-800 mb-4 font-serif">💡 Why We Built It</h2>
<p className="text-gray-700 font-mono leading-relaxed">
  The idea of Split-It was born during a trip where my brother and I got into a small argument about splitting bills. We both had paid for different things, but when it came time to settle up — it turned into a confusing and frustrating mess.
  <br /><br />
  We tried a few apps, but none of them felt right for us — they were either too complicated or not user-friendly. That’s when we decided, as siblings, to build our own solution. Something clean, intuitive, and tailor-made for real-life situations like this.
  <br /><br />
  And that’s how <span className="italic text-teal-700">Split-It</span> came to life — an app built from a real sibling moment, now here to make sharing expenses simple and stress-free for everyone.
</p>

        </div>
        <motion.div
          className="flex-1"
          variants={slideFromRight}
        >
          <img
            src={storyImg}
            alt="Our Story"
            className="w-full max-w-md mx-auto rounded-xl shadow-md transition-transform duration-500 hover:scale-105 hover:shadow-lg"
          />
        </motion.div>
      </motion.div>

      {/* Call to Action */}
      <div className="text-center mt-10">
        <Link to="/register">
          <button className="bg-teal-700 text-white px-6 py-4 rounded-lg font-semibold hover:bg-teal-500 transition-all duration-300 text-lg">
            Start Splitting Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default About;
