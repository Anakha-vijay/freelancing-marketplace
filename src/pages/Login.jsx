import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "client"
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      // Store JWT token
      localStorage.setItem("token", data.token);

      // Store user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage("Login successful!");

      // Redirect based on role
      setTimeout(() => {
        if (data.user.role === "client") {
          navigate("/client-dashboard");
        } else {
          navigate("/freelancer-dashboard");
        }
      }, 500);

    } catch (error) {
      setMessage("Unable to connect to the server.");
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
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>I am a</label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="client">
              Client
            </option>

            <option value="freelancer">
              Freelancer
            </option>
          </select>

          <button
            type="submit"
            className="primary-btn"
          >
            Login
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <p className="auth-link">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;