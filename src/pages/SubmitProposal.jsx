import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import "../App.css";

function SubmitProposal() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    coverLetter: "",
    bidAmount: "",
    deliveryTime: ""
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

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const token = localStorage.getItem("token");

    if (!user || !token) {
      setMessage("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/proposals",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            project: id,
            coverLetter: formData.coverLetter,
            bidAmount: Number(formData.bidAmount),
            deliveryTime: Number(formData.deliveryTime)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to submit proposal.");
        return;
      }

      setMessage(
        "Proposal submitted successfully!"
      );

      setTimeout(() => {
        navigate("/my-applications");
      }, 1000);

    } catch (error) {
      console.error("PROPOSAL ERROR:", error);

      setMessage(
        "Unable to connect to the server."
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-box proposal-box">

        <h1>Submit Proposal</h1>

        <p>
          Tell the client why you're the right person
          for this project.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Cover Letter</label>

          <textarea
            name="coverLetter"
            placeholder="Explain your experience and approach..."
            rows="6"
            value={formData.coverLetter}
            onChange={handleChange}
            required
          ></textarea>

          <label>Bid Amount</label>

          <input
            type="number"
            name="bidAmount"
            placeholder="Enter your bid amount"
            value={formData.bidAmount}
            onChange={handleChange}
            required
          />

          <label>Delivery Time (days)</label>

          <input
            type="number"
            name="deliveryTime"
            placeholder="Example: 10"
            value={formData.deliveryTime}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="primary-btn"
          >
            Submit Proposal
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <p className="auth-link">

          <Link to={`/project-details/${id}`}>
            ← Back to Project
          </Link>

        </p>

      </div>

    </div>
  );
}

export default SubmitProposal;