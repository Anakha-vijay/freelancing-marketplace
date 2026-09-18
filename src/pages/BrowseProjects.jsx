import { Link } from "react-router-dom";
import "../App.css";

function BrowseProjects() {
  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <div>
          <h1>Browse Projects</h1>
          <p>Find projects that match your skills.</p>
        </div>
      </div>

      <div className="project-list">

        <div className="project-card">
          <div>
            <h3>React Website Development</h3>

            <p>
              Looking for a React developer to build a responsive business website.
            </p>

            <span>Skills: React, JavaScript, CSS</span>
            <br />
            <span>Budget: ₹25,000</span>
            <br />
            <span>Deadline: 30 September 2026</span>
          </div>

          <Link to="/project-details" className="primary-btn">
  View Details
</Link>
        </div>


        <div className="project-card">
          <div>
            <h3>Python Data Analysis</h3>

            <p>
              Need a freelancer to analyze a business dataset and create visualizations.
            </p>

            <span>Skills: Python, Pandas, Data Analysis</span>
            <br />
            <span>Budget: ₹15,000</span>
            <br />
            <span>Deadline: 5 October 2026</span>
          </div>

          <Link to="/project-details" className="primary-btn">
  View Details
</Link>
        </div>


        <div className="project-card">
          <div>
            <h3>Mobile App UI/UX Design</h3>

            <p>
              Looking for a designer to create clean and user-friendly mobile app screens.
            </p>

            <span>Skills: Figma, UI/UX, Prototyping</span>
            <br />
            <span>Budget: ₹18,000</span>
            <br />
            <span>Deadline: 10 October 2026</span>
          </div>

          <Link to="/project-details" className="primary-btn">
  View Details
</Link>
        </div>

      </div>

    </div>
  );
}

export default BrowseProjects;