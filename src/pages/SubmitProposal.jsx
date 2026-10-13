
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
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (
      !formData.coverLetter.trim() ||
      Number(formData.bidAmount) <= 0 ||
      !Number.isFinite(Number(formData.bidAmount)) ||
      !Number.isInteger(Number(formData.deliveryTime)) ||
      Number(formData.deliveryTime) <= 0
    ) {
      setMessage(
        "Enter a cover letter, a positive bid amount, and delivery time in whole days."
      );
      return;
    }

    let user;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {
      user = null;
    }

    const token = localStorage.getItem("token");

    if (!user || !token) {
      setMessage("Please login first.");
      return;
    }

    setSubmitting(true);
    setMessage("");

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
            coverLetter: formData.coverLetter.trim(),
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

      setMessage("Proposal submitted successfully!");

      setTimeout(() => {
        navigate("/my-applications");
      }, 1000);
    } catch (error) {
      console.error("PROPOSAL ERROR:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setSubmitting(false);
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
          />

          <label>Bid Amount</label>

          <input
            type="number"
            name="bidAmount"
            placeholder="Enter your bid amount"
            min="0.01"
            step="any"
            value={formData.bidAmount}
            onChange={handleChange}
            required
          />

          <label>Delivery Time (days)</label>

          <input
            type="number"
            name="deliveryTime"
            placeholder="Example: 10"
            min="1"
            step="1"
            value={formData.deliveryTime}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="primary-btn"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Proposal"}
          </button>
        </form>

        {message && (
          <p className="auth-message" role="status">
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
