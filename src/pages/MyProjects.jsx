import API_BASE_URL from "../api";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

function MyProjects() {

  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/projects`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage("Failed to load projects.");
        return;
      }

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      // Show only projects posted by the logged-in client
      const myProjects = data.filter(
        (project) =>
          project.client &&
          project.client._id === user.id
      );

      setProjects(myProjects);

    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">

        <div>
          <h1>My Projects</h1>
          <p>
            Manage the projects you have posted.
          </p>
        </div>

        <Link
          to="/post-project"
          className="primary-btn"
        >
          + Post New Project
        </Link>

      </div>

      {message && (
        <p className="auth-message">
          {message}
        </p>
      )}

      <div className="project-list">

        {projects.length === 0 ? (

          <p>
            You haven't posted any projects yet.
          </p>

        ) : (

          projects.map((project) => (

            <div
              className="project-card"
              key={project._id}
            >

              <div>

                <h3>
                  {project.title}
                </h3>

                <p>
                  {project.description}
                </p>

                <span>
                  Skills: {project.skills}
                </span>

                <br />

                <span>
                  Budget: ₹{project.budget}
                </span>

                <br />

                <span>
                  Deadline:{" "}
                  {new Date(
                    project.deadline
                  ).toLocaleDateString("en-GB")}
                </span>

                <br />

                <span>
                  Proposals: 0
                </span>

              </div>

              <div>

                <div
                  className={`project-status ${
                    project.status === "Completed"
                      ? "completed"
                      : project.status === "In Progress"
                      ? "active"
                      : "open"
                  }`}
                >
                  {project.status}
                </div>

                <br />

                <Link
                  to="/view-proposals"
                  state={{ projectId: project._id }}
                  className="primary-btn"
                >
                  View Proposals
                </Link>

                <br />
                <br />

                <Link
                  to={`/project-management/${project._id}`}
                  className="secondary-btn"
                >
                  Manage Project
                </Link>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default MyProjects;
