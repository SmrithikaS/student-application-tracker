import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./home.css";
import Chatbot from "./chatbot.js";

const Home = () => {
  const [applications, setApplications] = useState([]);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    axios
      .get(`http://18.211.153.46:8080/application?email=${userEmail}`)
      .then((response) => {
        setApplications(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setApplications([]);
      });
  }, [userEmail]);

  return (
    <div className="containerhome">
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="card-grid">
          {applications.map((item) => (
            <div key={item.id} className="card">
              <h2>{item.name}</h2>
              <p>Status: {item.status}</p>
              <p>Interview Date: {item.interview ? item.interview : "Not Scheduled"}</p>
              <p>Result: {item.result || "Pending"}</p>
            </div>
          ))}
        </div>
      )}

      <Chatbot />
    </div>
  );
};

export default Home;
