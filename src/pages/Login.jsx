import { Link } from "react-router-dom";
import "../App.css";

function Login() {

  const handleLogin = (e) => {
    e.preventDefault();

    const role = e.target.role.value;

    if (role === "client") {
      window.location.href = "/client-dashboard";
    } else {
      window.location.href = "/freelancer-dashboard";
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">

        <h1>Welcome Back</h1>

        <p>Login to your FreelanceHub account</p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            required
          />

          <label>I am a</label>

          <select name="role">
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>

          <button type="submit" className="primary-btn">
            Login
          </button>

        </form>

        <p className="auth-link">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;