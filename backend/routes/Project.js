const express = require("express");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


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

    const client = req.user.id;

    const project = new Project({
      title,
      description,
      skills,
      budget,
      deadline,
      client
    });

    await project.save();

    res.status(201).json({
      message: "Project created successfully",
      project
    });

  } catch (error) {
    console.log("PROJECT ERROR:", error);

    res.status(500).json({
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

    res.json(projects);

  } catch (error) {
    res.status(500).json({
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

      const project = await Project.findById(
        req.params.projectId
      );

      // Check if project exists
      if (!project) {
        return res.status(404).json({
          message: "Project not found"
        });
      }

      // Only client or selected freelancer can update progress
      if (
        project.client.toString() !== req.user.id &&
        (
          !project.selectedFreelancer ||
          project.selectedFreelancer.toString() !== req.user.id
        )
      ) {
        return res.status(403).json({
          message: "You are not authorized to update this project"
        });
      }

      // Update progress and stage
      project.progress = progress;
      project.currentStage = currentStage;

      // Mark project as completed at 100%
      if (progress === 100) {
        project.status = "Completed";
        project.currentStage = "Completed";
      } else {
        project.status = "In Progress";
      }

      await project.save();

      res.json({
        message: "Project progress updated successfully",
        project
      });

    } catch (error) {

      console.log("PROGRESS UPDATE ERROR:", error);

      res.status(500).json({
        message: "Failed to update project progress",
        error: error.message
      });
    }
  }
);


module.exports = router;