import { Link } from "react-router-dom";

function DashboardNavbar({ role }) {
  return (
    <nav className="dashboard-navbar">

      <div className="dashboard-logo">
        FreelanceHub
      </div>

      <div className="dashboard-nav-links">

        <Link to={role === "client" ? "/client-dashboard" : "/freelancer-dashboard"}>
          Dashboard
        </Link>

        {role === "client" ? (
          <>
            <Link to="/my-projects">
              My Projects
            </Link>

            <Link to="/post-project">
              Post Project
            </Link>
          </>
        ) : (
          <>
            <Link to="/browse-projects">
              Browse Projects
            </Link>

            <Link to="/my-applications#">
              My Applications
            </Link>
          </>
        )}

        <Link to="/messages">
          Messages
        </Link>

        <Link to="/profile#">
          Profile
        </Link>

      </div>

    </nav>
  );
}

export default DashboardNavbar;