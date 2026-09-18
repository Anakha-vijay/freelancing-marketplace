import { Link } from "react-router-dom";
import "../App.css";

function ClientDashboard() {
  return (
    <div className="dashboard-page">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome, Client!</h1>
          <p>Manage your projects and find skilled freelancers.</p>
        </div>

        <Link to="#" className="primary-btn">
          + Post New Project
        </Link>
      </div>


      {/* Statistics */}
      <div className="stats-container">

        <div className="stat-card">
          <h2>3</h2>
          <p>My Projects</p>
        </div>

        <div className="stat-card">
          <h2>2</h2>
          <p>Active Projects</p>
        </div>

        <div className="stat-card">
          <h2>8</h2>
          <p>Proposals</p>
        </div>

        <div className="stat-card">
          <h2>1</h2>
          <p>Completed</p>
        </div>

      </div>


      {/* Projects */}
      <div className="projects-section">

        <div className="section-heading">
          <h2>My Projects</h2>

          <Link to="#">
            View All
          </Link>
        </div>


        <div className="project-list">

          <div className="project-card">

            <div>
              <h3>Website Development</h3>

              <p>
                Need a responsive website for a small business.
              </p>

              <span>Budget: ₹25,000</span>
            </div>

            <div className="project-status active">
              In Progress
            </div>

          </div>


          <div className="project-card">

            <div>
              <h3>Mobile App Design</h3>

              <p>
                Looking for a UI/UX designer for a mobile application.
              </p>

              <span>Budget: ₹15,000</span>
            </div>

            <div className="project-status open">
              Open
            </div>

          </div>


          <div className="project-card">

            <div>
              <h3>Content Writing</h3>

              <p>
                Articles and website content for a new business.
              </p>

              <span>Budget: ₹8,000</span>
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

export default ClientDashboard;