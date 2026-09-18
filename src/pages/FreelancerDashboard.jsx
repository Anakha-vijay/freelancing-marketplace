import { Link } from "react-router-dom";
import "../App.css";

function FreelancerDashboard() {
  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <div>
          <h1>Welcome, Freelancer!</h1>
          <p>Find projects that match your skills and experience.</p>
        </div>

        <Link to="/browse-projects" className="primary-btn">
  Browse Projects
</Link>
      </div>

      <div className="stats-container">

        <div className="stat-card">
          <h2>12</h2>
          <p>Projects Applied</p>
        </div>

        <div className="stat-card">
          <h2>3</h2>
          <p>Active Projects</p>
        </div>

        <div className="stat-card">
          <h2>5</h2>
          <p>Pending Proposals</p>
        </div>

        <div className="stat-card">
          <h2>4</h2>
          <p>Completed Projects</p>
        </div>

      </div>

      <div className="projects-section">

        <div className="section-heading">
          <h2>Recent Projects</h2>

          <Link to="#">
            View All
          </Link>
        </div>

        <div className="project-list">

          <div className="project-card">
            <div>
              <h3>E-Commerce Website</h3>
              <p>
                Looking for a developer to build a responsive online store.
              </p>
              <span>Budget: ₹30,000</span>
            </div>

            <div className="project-status open">
              Open
            </div>
          </div>

          <div className="project-card">
            <div>
              <h3>Mobile App UI Design</h3>
              <p>
                Need a UI/UX designer for a mobile application.
              </p>
              <span>Budget: ₹18,000</span>
            </div>

            <div className="project-status active">
              Applied
            </div>
          </div>

          <div className="project-card">
            <div>
              <h3>Python Data Analysis</h3>
              <p>
                Analyze and visualize business data using Python.
              </p>
              <span>Budget: ₹12,000</span>
            </div>

            <div className="project-status completed">
              Completed
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default FreelancerDashboard;