
const express = require("express");
const mongoose = require("mongoose");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const stages = [
  "Requirements",
  "Design",
  "Development",
  "Testing",
  "Deployment",
  "Completed"
];

// Create a new project
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      skills,
      budget,
      deadline
    } = req.body;

    // Validate required fields
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof skills !== "string" ||
      !skills.trim() ||
      budget === undefined ||
      budget === null ||
      budget === "" ||
      !deadline
    ) {
      return res.status(400).json({
        message: "Please provide a title, description, skills, budget, and deadline."
      });
    }

    // Validate budget
    const numericBudget = Number(budget);

    if (!Number.isFinite(numericBudget) || numericBudget <= 0) {
      return res.status(400).json({
        message: "Budget must be greater than zero."
      });
    }

    // Validate deadline
    const parsedDeadline = new Date(deadline);

    if (Number.isNaN(parsedDeadline.getTime())) {
      return res.status(400).json({
        message: "Please provide a valid deadline."
      });
    }

    // Create project
    const project = new Project({
      title: title.trim(),
      description: description.trim(),
      skills: skills.trim(),
      budget: numericBudget,
      deadline: parsedDeadline,
      client: req.user.id
    });

    await project.save();

    return res.status(201).json({
      message: "Project created successfully",
      project
    });
  } catch (error) {
    console.error("PROJECT ERROR:", error);

    return res.status(500).json({
      message: "Project creation failed",
      error: error.message
    });
  }
});

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("client", "name email")
      .populate("selectedFreelancer", "name email");

    return res.json(projects);
  } catch (error) {
    console.error("FETCH PROJECTS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message
    });
  }
});

// Update project progress
router.put(
  "/:projectId/progress",
  authMiddleware,
  async (req, res) => {
    try {
      const { progress, currentStage } = req.body;

      if (!mongoose.isValidObjectId(req.params.projectId)) {
        return res.status(400).json({
          message: "Invalid project ID."
        });
      }

      if (
        !Number.isInteger(progress) ||
        progress < 0 ||
        progress > 100
      ) {
        return res.status(400).json({
          message: "Progress must be a whole number between 0 and 100."
        });
      }

      if (!stages.includes(currentStage)) {
        return res.status(400).json({
          message: "Please provide a valid project stage."
        });
      }

      const project = await Project.findById(
        req.params.projectId
      );

      if (!project) {
        return res.status(404).json({
          message: "Project not found."
        });
      }

      // Only the client or selected freelancer can update progress
      if (
        project.client.toString() !== req.user.id &&
        (
          !project.selectedFreelancer ||
          project.selectedFreelancer.toString() !== req.user.id
        )
      ) {
        return res.status(403).json({
          message: "You are not authorized to update this project."
        });
      }

      // Only active projects can be updated
      if (
        project.status !== "In Progress" &&
        !(project.status === "Completed" && progress === 100)
      ) {
        return res.status(400).json({
          message: "Only active projects can have their progress updated."
        });
      }

      project.progress = progress;

      if (progress === 100) {
        project.status = "Completed";
        project.currentStage = "Completed";
      } else {
        if (currentStage === "Completed") {
          return res.status(400).json({
            message: "The Completed stage requires 100% progress."
          });
        }

        project.status = "In Progress";
        project.currentStage = currentStage;
      }

      await project.save();

      return res.json({
        message: "Project progress updated successfully",
        project
      });
    } catch (error) {
      console.error("PROGRESS UPDATE ERROR:", error);

      return res.status(500).json({
        message: "Failed to update project progress",
        error: error.message
      });
    }
  }
);

module.exports = router;
