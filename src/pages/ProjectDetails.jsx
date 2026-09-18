import { Link } from "react-router-dom";
import "../App.css";

function ProjectDetails() {
  return (
    <div className="dashboard-page">

      <div className="project-details-box">

        <h1>React Website Development</h1>

        <p className="project-description">
          Looking for a React developer to build a responsive business
          website with a clean and user-friendly interface.
        </p>

        <div className="project-info">
          <div>
            <h3>Budget</h3>
            <p>₹25,000</p>
          </div>

          <div>
            <h3>Deadline</h3>
            <p>30 September 2026</p>
          </div>

          <div>
            <h3>Project Status</h3>
            <p>Open</p>
          </div>
        </div>

        <div className="project-detail-section">
          <h2>Required Skills</h2>

          <p>
            React, JavaScript, HTML, CSS, Responsive Design
          </p>
        </div>

        <div className="project-detail-section">
          <h2>About the Client</h2>

          <p>
            The client is looking for a skilled freelancer to develop
            a professional website for their business.
          </p>
        </div>

        <Link to="/submit-proposal" className="primary-btn">
          Apply Now
        </Link>

      </div>

    </div>
  );
}

export default ProjectDetails;