import { Link } from "react-router-dom";
import "../App.css";

function SubmitProposal() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Proposal submitted successfully!");
  };

  return (
    <div className="auth-page">
      <div className="auth-box proposal-box">

        <h1>Submit Proposal</h1>

        <p>Apply for React Website Development</p>

        <form onSubmit={handleSubmit}>

          <label>Proposal</label>

          <textarea
            placeholder="Explain why you are suitable for this project..."
            rows="6"
            required
          ></textarea>

          <label>Your Bid Amount</label>

          <input
            type="number"
            placeholder="Enter your bid amount"
            required
          />

          <label>Estimated Delivery Time</label>

          <input
            type="text"
            placeholder="Example: 15 days"
            required
          />

          <button type="submit" className="primary-btn">
            Submit Proposal
          </button>

        </form>

        <p className="auth-link">
          <Link to="/browse-projects">
            ← Back to Projects
          </Link>
        </p>

      </div>
    </div>
  );
}

export default SubmitProposal;