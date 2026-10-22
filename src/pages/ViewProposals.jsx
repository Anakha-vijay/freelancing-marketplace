import API_BASE_URL from "../api";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

function ViewProposals() {
  const navigate = useNavigate();
  const location = useLocation();

  const [proposals, setProposals] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    // Get project ID passed from My Projects
    const projectId = location.state?.projectId;

    if (!projectId) {
      setMessage("Project ID not found.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/proposals/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to fetch proposals.");
        return;
      }

      setProposals(data);

    } catch (error) {
      console.error("VIEW PROPOSALS ERROR:", error);

      setMessage(
        "Unable to connect to the server."
      );
    }
  };

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">

        <div>
          <h1>View Proposals</h1>

          <p>
            Review proposals submitted by freelancers.
          </p>
        </div>

      </div>

      {message && (
        <p className="auth-message">
          {message}
        </p>
      )}

      <div className="project-list">

        {proposals.length === 0 ? (

          <p>
            No proposals submitted yet.
          </p>

        ) : (

          proposals.map((proposal) => (

            <div
              className="project-card"
              key={proposal._id}
            >

              <div>

                <h3>
                  {proposal.freelancer?.name}
                </h3>

                <p>
                  {proposal.freelancer?.email}
                </p>

                <p>
                  {proposal.coverLetter}
                </p>

                <span>
                  Bid Amount: ₹{proposal.bidAmount}
                </span>

                <br />

                <span>
                  Delivery Time: {proposal.deliveryTime} days
                </span>

                <br />

                <span>
                  Status: {proposal.status}
                </span>

              </div>

              <div>

                {(proposal.status === "Pending" ||
                  proposal.status === "Accepted") && (

                  <button
                    className="primary-btn"
                    onClick={async () => {

                      const token =
                        localStorage.getItem("token");

                      try {

                        const response = await fetch(
                          `${API_BASE_URL}/api/proposals/${proposal._id}/accept`,
                          {
                            method: "PUT",

                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`
                            }
                          }
                        );

                        const data =
                          await response.json();

                        if (!response.ok) {
                          alert(data.message);
                          return;
                        }

                        alert(
                          "Proposal accepted successfully!"
                        );

                        fetchProposals();

                      } catch (error) {

                        alert(
                          "Unable to connect to the server."
                        );

                      }

                    }}
                  >
                    Start Project
                  </button>

                )}

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default ViewProposals;
