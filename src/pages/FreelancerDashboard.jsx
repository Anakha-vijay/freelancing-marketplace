import API_BASE_URL from "../api";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import "../App.css";

function FreelancerDashboard() {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {

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

if (response.ok) {
  setProposals(data);
} else {
  console.log("Failed to fetch proposals:", data.message);
  setProposals([]);
}

    } catch (error) {

      console.log("Error fetching proposals:", error);

    }
  };


  const pendingProposals = proposals.filter(
    (proposal) => proposal.status === "Pending"
  ).length;


  const activeProjects = proposals.filter(
    (proposal) =>
      proposal.status === "Accepted" &&
      proposal.project?.status === "In Progress"
  ).length;


  const completedProjects = proposals.filter(
    (proposal) =>
      proposal.status === "Accepted" &&
      proposal.project?.status === "Completed"
  ).length;


  return (
    <div>

      {/* Dashboard Navigation */}

      <DashboardNavbar role="freelancer" />


      <div className="dashboard-page">


        {/* Header */}

        <div className="dashboard-header">

          <div>

            <h1>
              Welcome, {user?.name}!
            </h1>

            <p>
              Find projects that match your skills and experience.
            </p>

          </div>


          <Link
            to="/browse-projects"
            className="primary-btn"
          >
            Browse Projects
          </Link>

        </div>


        {/* Statistics */}

        <div className="stats-container">


          <div className="stat-card">

            <h2>
              {proposals.length}
            </h2>

            <p>
              Projects Applied
            </p>

          </div>


          <div className="stat-card">

            <h2>
              {activeProjects}
            </h2>

            <p>
              Active Projects
            </p>

          </div>


          <div className="stat-card">

            <h2>
              {pendingProposals}
            </h2>

            <p>
              Pending Proposals
            </p>

          </div>


          <div className="stat-card">

            <h2>
              {completedProjects}
            </h2>

            <p>
              Completed Projects
            </p>

          </div>


        </div>


        {/* Recent Projects */}

        <div className="projects-section">


          <div className="section-heading">

            <h2>
              Recent Projects
            </h2>


            <Link to="/browse-projects">
              View All
            </Link>

          </div>


          <div className="project-list">


            {proposals.length === 0 ? (

              <p>
                You haven't applied to any projects yet.
              </p>

            ) : (

              proposals.slice(0, 3).map((proposal) => (

                <div
                  className="project-card"
                  key={proposal._id}
                >

                  <div>

                    <h3>
                      {proposal.project?.title}
                    </h3>


                    <p>
                      Your proposal for this project.
                    </p>


                    <span>
                      Budget: ₹{proposal.project?.budget}
                    </span>

                  </div>


                  <div
                    className={`project-status ${
                      proposal.status === "Accepted"
                        ? "active"
                        : proposal.status === "Rejected"
                        ? "completed"
                        : "open"
                    }`}
                  >
                    {proposal.status}
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

export default FreelancerDashboard;
