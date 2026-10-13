
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

function Reviews() {
  const { id } = useParams();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [project, setProject] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchProject = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/projects"
      );

      const projects = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const currentProject = projects.find(
        (item) => String(item._id) === String(id)
      );

      setProject(currentProject || null);
    } catch (error) {
      console.log("Error fetching project:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setReviews(data);

        const alreadyReviewed = data.some(
          (review) =>
            String(
              review.reviewer?._id || review.reviewer
            ) === String(user?.id || user?._id)
        );

        setHasReviewed(alreadyReviewed);
      } else {
        console.log("Failed to fetch reviews:", data.message);
      }
    } catch (error) {
      console.log("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchReviews();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      alert("Please log in to submit a review.");
      return;
    }

    if (hasReviewed) {
      alert("You have already reviewed this project.");
      return;
    }

    if (!comment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    if (!project) {
      alert("Project details could not be loaded. Please refresh.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            project: id,
            rating: Number(rating),
            comment: comment.trim()
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Review added successfully!");
        setComment("");
        setRating(5);
        await fetchReviews();
      } else {
        alert(data.message || "Failed to submit review.");
      }
    } catch (error) {
      console.log("Error adding review:", error);
      alert("Unable to submit review. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Ratings & Reviews</h1>
          <p>Share your experience about the project.</p>
        </div>

        <Link
          to={`/project-management/${id}`}
          className="secondary-btn"
        >
          ← Back to Project
        </Link>
      </div>

      <div className="project-details-box">
        <h2>
          {hasReviewed ? "Review Submitted" : "Leave a Review"}
        </h2>

        {hasReviewed ? (
          <p>
            You have already submitted a review for this project.
          </p>
        ) : project?.status === "Completed" ? (
          <form onSubmit={submitReview}>
            <div className="project-detail-section">
              <h3>Rating</h3>

              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="5">★★★★★ - 5</option>
                <option value="4">★★★★☆ - 4</option>
                <option value="3">★★★☆☆ - 3</option>
                <option value="2">★★☆☆☆ - 2</option>
                <option value="1">★☆☆☆☆ - 1</option>
              </select>
            </div>

            <div className="project-detail-section">
              <h3>Comment</h3>

              <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="primary-btn">
              Submit Review
            </button>
          </form>
        ) : (
          <p>
            Reviews can be submitted after the project is completed.
          </p>
        )}

        <div className="project-detail-section">
          <h2>Reviews</h2>

          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="message received"
              >
                <h3>{review.reviewer?.name || "User"}</h3>

                <p>
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </p>

                <p>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Reviews;
