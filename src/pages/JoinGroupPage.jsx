// pages/JoinGroupPage.jsx

import React, { useEffect, useState } from "react";
import axios from '../utils/axios';
import { useParams, useNavigate } from "react-router-dom";

const JoinGroupPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const joinGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/groups/join/${groupId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
      setTimeout(() => navigate("/dashboard"), 2000); // Or group details page
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    joinGroup();
  }, [groupId]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 rounded-lg shadow-lg bg-white">
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default JoinGroupPage;
