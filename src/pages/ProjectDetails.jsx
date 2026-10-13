import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

function ProjectDetails() {

  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {

      const response = await fetch(
        "http://localhost:5000/api/projects"
      );

      const data = await response.json();

      const foundProject = data.find(
        (item) => item._id === id
      );

      if (!foundProject) {
        setMessage("Project not found.");
        return;
      }

      setProject(foundProject);

    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  if (message) {
    return (
      <div className="dashboard-page">
        <p>{message}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="dashboard-page">
        <p>Loading project...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <div className="project-details-box">

        <h1>{project.title}</h1>

        <p className="project-description">
          {project.description}
        </p>

        <div className="project-info">

          <div>
            <h3>Budget</h3>
            <p>₹{project.budget}</p>
          </div>

          <div>
            <h3>Deadline</h3>
            <p>
              {new Date(
                project.deadline
              ).toLocaleDateString("en-GB")}
            </p>
          </div>

          <div>
            <h3>Project Status</h3>
            <p>{project.status}</p>
          </div>

        </div>

        <div className="project-detail-section">

          <h2>Required Skills</h2>

          <p>
            {project.skills}
          </p>

        </div>

        <div className="project-detail-section">

          <h2>About the Client</h2>

          <p>
            {project.client?.name}
          </p>

        </div>

        <Link
          to={`/submit-proposal/${project._id}`}
          className="primary-btn"
        >
          Apply Now
        </Link>

      </div>

    </div>
  );
}

export default ProjectDetails;