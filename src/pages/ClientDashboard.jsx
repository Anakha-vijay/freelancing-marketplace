import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import "../App.css";

function ClientDashboard() {

  const [projects, setProjects] = useState([]);
  const [proposalCount, setProposalCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProjects();
    fetchProposalCount();
  }, []);

  const fetchProjects = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/projects"
      );

      const data = await response.json();

      const myProjects = data.filter(
        (project) =>
          project.client &&
          project.client._id === user.id
      );

      setProjects(myProjects);

    } catch (error) {

      console.log("Error fetching projects:", error);

    }
  };

  const fetchProposalCount = async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/proposals/client/${user.id}`
    );

    const data = await response.json();

    setProposalCount(data.count);

  } catch (error) {
    console.log("Error fetching proposals:", error);
  }
};

  const activeProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  return (
    <div>

      <DashboardNavbar role="client" />

      <div className="dashboard-page">

        {/* Header */}

        <div className="dashboard-header">

          <div>

            <h1>
              Welcome, {user?.name}!
            </h1>

            <p>
              Manage your projects and find skilled freelancers.
            </p>

          </div>

          <Link
            to="/post-project"
            className="primary-btn"
          >
            + Post New Project
          </Link>

        </div>


        {/* Stats */}

        <div className="stats-container">

          <div className="stat-card">
            <h2>{projects.length}</h2>
            <p>My Projects</p>
          </div>

          <div className="stat-card">
            <h2>{activeProjects}</h2>
            <p>Active Projects</p>
          </div>

          <div className="stat-card">
            <h2>{proposalCount}</h2>
            <p>Proposals</p>
          </div>

          <div className="stat-card">
            <h2>{completedProjects}</h2>
            <p>Completed</p>
          </div>

        </div>


        {/* My Projects */}

        <div className="projects-section">

          <div className="section-heading">

            <h2>My Projects</h2>

            <Link to="/my-projects">
              View All
            </Link>

          </div>


          <div className="project-list">

            {projects.length === 0 ? (

              <p>No projects created yet.</p>

            ) : (

              projects.slice(0, 3).map((project) => (

                <div
                  className="project-card"
                  key={project._id}
                >

                  <div>

                    <h3>{project.title}</h3>

                    <p>
                      {project.description}
                    </p>

                    <span>
                      Budget: ₹{project.budget}
                    </span>

                  </div>


                  <div
                    className={`project-status ${
                      project.status === "Open"
                        ? "open"
                        : project.status === "Completed"
                        ? "completed"
                        : "active"
                    }`}
                  >
                    {project.status}
                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ClientDashboard;