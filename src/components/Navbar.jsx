import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        FreelanceHub
      </div>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="#">
          Browse Projects
        </Link>

        <Link to="#">
          How It Works
        </Link>

        <Link to="/login">
          Login
        </Link>

        <Link to="/register" className="register-btn">
  Register
</Link>

      </div>

    </nav>
  );
}

export default Navbar;