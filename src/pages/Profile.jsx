
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

function Profile() {
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );
  const token = localStorage.getItem("token");

  const [completedProjects, setCompletedProjects] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedProjects = async () => {
      if (!user?.id || !token || user.role !== "freelancer") {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/proposals/freelancer/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          const completedIds = new Set(
            data
              .filter(
                (proposal) =>
                  proposal.status === "Accepted" &&
                  proposal.project?.status === "Completed"
              )
              .map((proposal) => proposal.project._id)
          );

          setCompletedProjects(completedIds.size);
        } else {
          console.log("Failed to fetch completed projects:", data.message);
        }
      } catch (error) {
        console.log("Error fetching completed projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedProjects();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>My Profile</h1>
          <p>View your account information.</p>
        </div>

        <Link to="/" className="secondary-btn">
          ← Home
        </Link>
      </div>

      <div className="project-details-box">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name
              ? user.name.substring(0, 2).toUpperCase()
              : "U"}
          </div>

          <div>
            <h2>{user?.name}</h2>
            <p>
              {user?.role === "client" ? "Client" : "Freelancer"}
            </p>
          </div>
        </div>

        <div className="project-detail-section">
          <h2>Personal Information</h2>

          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p>
            <strong>Role:</strong>{" "}
            {user?.role === "client" ? "Client" : "Freelancer"}
          </p>
        </div>

        <div className="project-detail-section">
          <h2>Professional Information</h2>

          <p>
            <strong>Skills:</strong>{" "}
            React, JavaScript, HTML, CSS, Node.js
          </p>

          <p>
            <strong>Experience:</strong> Beginner / Entry Level
          </p>

          <p>
            <strong>Projects Completed:</strong>{" "}
            {user?.role === "freelancer"
              ? loading
                ? "Loading..."
                : completedProjects
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
