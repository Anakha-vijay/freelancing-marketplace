
const express = require("express");
const Review = require("../models/Review");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add a review
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { project, rating, comment } = req.body;
    const reviewer = req.user.id;

    // Validate required fields
    if (!project || !rating || !comment?.trim()) {
      return res.status(400).json({
        message: "Project, rating, and comment are required."
      });
    }

    // Validate rating
    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5."
      });
    }

    // Find the project
    const projectData = await Project.findById(project);
    console.log("REVIEW DEBUG:", {
  projectId: projectData?._id,
  clientId: projectData?.client?.toString(),
  selectedFreelancerId: projectData?.selectedFreelancer?.toString(),
  reviewerId: req.user.id,
  projectStatus: projectData?.status
});

    if (!projectData) {
      return res.status(404).json({
        message: "Project not found."
      });
    }

    // Reviews are allowed only after project completion
    if (projectData.status !== "Completed") {
      return res.status(400).json({
        message: "You can review only completed projects."
      });
    }

    // Identify the review recipient using the project participants
    let reviewee;

    if (String(projectData.client) === String(reviewer)) {
      reviewee = projectData.selectedFreelancer;
    } else if (
      String(projectData.selectedFreelancer) === String(reviewer)
    ) {
      reviewee = projectData.client;
    } else {
      return res.status(403).json({
        message: "Only project participants can leave a review."
      });
    }

    if (!reviewee) {
      return res.status(400).json({
        message: "Review recipient not found."
      });
    }

    // Prevent duplicate reviews by the same user for this project
    const existingReview = await Review.findOne({
      project,
      reviewer
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this project."
      });
    }

    // Create the review
    const newReview = new Review({
      project,
      reviewer,
      reviewee,
      rating: numericRating,
      comment: comment.trim()
    });

    await newReview.save();

    return res.status(201).json({
      message: "Review added successfully.",
      review: newReview
    });

  } catch (error) {
    console.log("REVIEW ERROR:", error);

    // Handle duplicate-key errors if a unique database index exists
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already reviewed this project."
      });
    }

    return res.status(500).json({
      message: "Failed to add review.",
      error: error.message
    });
  }
});

// Get reviews for a project
router.get("/:projectId", authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({
      project: req.params.projectId
    })
      .populate("reviewer", "name")
      .populate("reviewee", "name")
      .sort({ createdAt: -1 });

    return res.json(reviews);

  } catch (error) {
    console.log("FETCH REVIEW ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch reviews.",
      error: error.message
    });
  }
});

module.exports = router;
