import API_BASE_URL from "../api";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../App.css";

function PostProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    budget: "",
    deadline: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setMessage("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            skills: formData.skills,
            budget: Number(formData.budget),
            deadline: formData.deadline
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to post project.");
        return;
      }

      setMessage("Project posted successfully!");

      setTimeout(() => {
        navigate("/my-projects");
      }, 1000);

    } catch (error) {
      console.error("POST PROJECT ERROR:", error);
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-box proposal-box">

        <h1>Post a New Project</h1>

        <p>Tell freelancers what you need.</p>

        <form onSubmit={handleSubmit}>

          <label>Project Title</label>

          <input
            type="text"
            name="title"
            placeholder="Example: E-Commerce Website Development"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Project Description</label>

          <textarea
            name="description"
            placeholder="Describe your project requirements..."
            rows="6"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>

          <label>Required Skills</label>

          <input
            type="text"
            name="skills"
            placeholder="Example: React, JavaScript, CSS"
            value={formData.skills}
            onChange={handleChange}
            required
          />

          <label>Budget</label>

          <input
            type="number"
            name="budget"
            placeholder="Enter your budget"
            value={formData.budget}
            onChange={handleChange}
            required
          />

          <label>Deadline</label>

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="primary-btn"
          >
            Post Project
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <p className="auth-link">
          <Link to="/client-dashboard">
            ← Back to Dashboard
          </Link>
        </p>

      </div>

    </div>
  );
}

export default PostProject;
