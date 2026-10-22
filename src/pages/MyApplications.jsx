import API_BASE_URL from "../api";


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    const token = localStorage.getItem("token");

    if (!user || !token) {
      setMessage("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/proposals/freelancer/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to fetch applications."
        );
        return;
      }

      setApplications(data);
      setMessage("");
    } catch (error) {
      console.error("APPLICATION ERROR:", error);
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>My Applications</h1>
          <p>Track the proposals you have submitted.</p>
        </div>
      </div>

      {message && (
        <p className="auth-message">{message}</p>
      )}

      <div className="project-list">
        {applications.length === 0 ? (
          <p>You haven't submitted any proposals yet.</p>
        ) : (
          applications.map((application) => (
            <div
              className="project-card"
              key={application._id}
            >
              <div>
                <h3>
                  {application.project?.title ||
                    "Project details unavailable"}
                </h3>

                <p>{application.coverLetter}</p>

                <span>
                  Bid Amount: ₹{application.bidAmount}
                </span>
                <br />

                <span>
                  Delivery Time: {application.deliveryTime} days
                </span>
                <br />

                <span>
                  Project Budget: ₹{application.project?.budget}
                </span>
                <br />

                <span>
                  Deadline:{" "}
                  {application.project?.deadline
                    ? new Date(
                        application.project.deadline
                      ).toLocaleDateString("en-GB")
                    : "N/A"}
                </span>
              </div>

              <div className="application-actions">
                <div
                  className={`project-status ${
                    application.status === "Accepted"
                      ? "completed"
                      : application.status === "Rejected"
                      ? "open"
                      : "active"
                  }`}
                >
                  {application.status}
                </div>

                {application.status === "Accepted" &&
                  application.project?._id && (
                    <Link
                      to={`/project-management/${application.project._id}`}
                      className="primary-btn"
                    >
                      Manage Project
                    </Link>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyApplications;
