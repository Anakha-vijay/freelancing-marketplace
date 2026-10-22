import API_BASE_URL from "../api";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer"
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "${API_BASE_URL}/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-box">

        <h1>Create Account</h1>

        <p>Join FreelanceHub today</p>

        <form onSubmit={handleRegister}>

          <label>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>I want to</label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="freelancer">
              Work as a Freelancer
            </option>

            <option value="client">
              Hire a Freelancer
            </option>
          </select>

          <button
            type="submit"
            className="primary-btn"
          >
            Create Account
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;
