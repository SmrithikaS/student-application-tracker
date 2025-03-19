import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import "./timeline.css"; 

const ALL_STATUSES = ["Applied", "Pending", "Interview Scheduled", "Accepted", "Rejected"];

const getColor = (status) => {
  if (!status) return "gray";
  switch (status.toLowerCase()) {
    case "applied": return "blue";
    case "pending": return "orange";
    case "interview scheduled":
    case "interview": return "purple";
    case "accepted":
    case "success": return "green";
    case "rejected":
    case "declined": return "red";
    default: return "gray";
  }
};

const getStatusColor = (status, currentStatus) => {
  return status.toLowerCase() === currentStatus.toLowerCase() ? getColor(currentStatus) : "gray";
};

const TimelinePage = () => {
  const [applications, setApplications] = useState([]);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) {
      console.warn("User email not found in localStorage.");
      return;
    }

    axios
      .get(`http://18.211.153.46:8080/application?email=${userEmail}`)
      .then((response) => {
        console.log("API Response:", response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setApplications(response.data);
        } else {
          console.warn("No valid applications found.");
          setApplications([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setApplications([]);
      });
  }, [userEmail]);

  return (
    <div className="container">
      <h1>Application Status Timelines</h1>

      {applications.length === 0 ? (
        <Typography>No applications found.</Typography>
      ) : (
        applications.map((app) => (
          <div key={app.id} className="timeline-section">
            <h2>{app.name}</h2>

            <Timeline position="alternate">
              {ALL_STATUSES.map((status, index) => (
                <TimelineItem key={index} className="TimelineItem">
                  <TimelineSeparator>
                    <TimelineDot
                      className="TimelineDot"
                      style={{ backgroundColor: getStatusColor(status, app.status) }}
                    />
                    {index !== ALL_STATUSES.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent className="TimelineContent">
                    <Typography variant="h6">{status}</Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        ))
      )}
    </div>
  );
};

export default TimelinePage;
