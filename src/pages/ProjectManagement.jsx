import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

function ProjectManagement() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/projects"
      );

      const data = await response.json();

      const foundProject = data.find(
        (project) => project._id === id
      );

      setProject(foundProject);
      setLoading(false);

    } catch (error) {
      console.log("Error fetching project:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const updateProgress = async (progress, currentStage) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/projects/${id}/progress`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            progress,
            currentStage
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProject(data.project);
        alert("Project progress updated!");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log("Progress update error:", error);
      alert("Unable to connect to the server.");
    }
  };

  if (loading) {
    return <h2>Loading project...</h2>;
  }

  if (!project) {
    return <h2>Project not found</h2>;
  }

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">

        <div>
          <h1>Project Management</h1>
          <p>Track the progress of your project.</p>
        </div>

        <Link
          to="/my-projects"
          className="secondary-btn"
        >
          ← Back to Projects
        </Link>

      </div>

      <div className="project-details-box">

        <h2>{project.title}</h2>

        <p className="project-description">
          {project.description}
        </p>

        <div className="project-info">

          <div>
            <h3>Freelancer</h3>
            <p>
              {project.selectedFreelancer
                ? project.selectedFreelancer.name
                : "Not selected yet"}
            </p>
          </div>

          <div>
            <h3>Budget</h3>
            <p>₹{project.budget}</p>
          </div>

          <div>
            <h3>Deadline</h3>
            <p>
              {new Date(
                project.deadline
              ).toLocaleDateString()}
            </p>
          </div>

        </div>

        <div className="project-detail-section">

          <h2>Project Status</h2>

          <div className="project-status active">
            {project.status}
          </div>

        </div>

        <div className="project-detail-section">

          <h2>Project Progress</h2>

          <div className="progress-container">

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${project.progress}%`
                }}
              ></div>

            </div>

            <p>
              {project.progress}% Completed
            </p>

          </div>

        </div>

        <div className="project-detail-section">

          <h2>Current Stage</h2>

          <p>{project.currentStage}</p>

        </div>

        <div className="project-detail-section">

          <h2>Update Progress</h2>

          <div className="hero-buttons">

            <button
              className="secondary-btn"
              onClick={() =>
                updateProgress(0, "Requirements")
              }
            >
              Requirements – 0%
            </button>

            <button
              className="secondary-btn"
              onClick={() =>
                updateProgress(25, "Design")
              }
            >
              Design – 25%
            </button>

            <button
              className="secondary-btn"
              onClick={() =>
                updateProgress(50, "Development")
              }
            >
              Development – 50%
            </button>

            <button
              className="secondary-btn"
              onClick={() =>
                updateProgress(75, "Testing")
              }
            >
              Testing – 75%
            </button>

            <button
              className="primary-btn"
              onClick={() =>
                updateProgress(100, "Completed")
              }
            >
              Completed – 100%
            </button>

          </div>

        </div>

        <div className="project-detail-section">

          <h2>Project Requirements</h2>

          <p>
            {project.description}
          </p>

        </div>

        <Link
          to={`/messages/${id}`}
          className="primary-btn"
        >
          View Messages
        </Link>

        <br />
        <br />

        <Link
          to={`/reviews/${id}`}
          className="secondary-btn"
        >
          Ratings & Reviews
        </Link>

      </div>

    </div>
  );
}

export default ProjectManagement;