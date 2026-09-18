import { Link } from "react-router-dom";
import "../App.css";

function Register() {
  return (
    <div className="auth-page">

      <div className="auth-box">

        <h1>Create Account</h1>

        <p>Join FreelanceHub today</p>

        <form>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
          />

          <label>I want to</label>

          <select>
            <option value="freelancer">Work as a Freelancer</option>
            <option value="client">Hire a Freelancer</option>
          </select>

          <button type="submit" className="primary-btn">
            Create Account
          </button>

        </form>

        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;