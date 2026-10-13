const express = require("express");
const Proposal = require("../models/Proposal");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Submit a proposal
router.post("/",authMiddleware, async (req, res) => {
  try {
    const {
      project,
      coverLetter,
      bidAmount,
      deliveryTime
    } = req.body;
    const freelancer = req.user.id;

    const proposal = new Proposal({
      project,
      freelancer,
      coverLetter,
      bidAmount,
      deliveryTime
    });

    await proposal.save();

    res.status(201).json({
      message: "Proposal submitted successfully",
      proposal
    });

  } catch (error) {
    console.log("PROPOSAL ERROR:", error);

    res.status(500).json({
      message: "Proposal submission failed",
      error: error.message
    });
  }
});

// Get proposals for a project
router.get("/project/:projectId",authMiddleware, async (req, res) => {
  try {
    const proposals = await Proposal.find({
      project: req.params.projectId
    }).populate("freelancer", "name email");

    res.json(proposals);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch proposals",
      error: error.message
    });
  }
});
// Get proposals submitted by a freelancer
router.get("/freelancer/:freelancerId",authMiddleware, async (req, res) => {
  try {
    const proposals = await Proposal.find({
      freelancer: req.params.freelancerId
    }).populate("project", "title budget deadline status");

    res.json(proposals);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message
    });
  }
});

// Get proposals received by a client
router.get("/client/:clientId", async (req, res) => {
  try {

    const projects = await Project.find({
      client: req.params.clientId
    });

    const projectIds = projects.map(
      (project) => project._id
    );

    const proposalCount = await Proposal.countDocuments({
      project: { $in: projectIds }
    });

    res.json({
      count: proposalCount
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch client proposals",
      error: error.message
    });

  }
});
// Accept a proposal
router.put("/:proposalId/accept",authMiddleware, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.proposalId);

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found"
      });
    }
    const project = await Project.findById(proposal.project);

if (!project) {
  return res.status(404).json({
    message: "Project not found"
  });
}

if (project.client.toString() !== req.user.id) {
  return res.status(403).json({
    message: "Only the project owner can accept proposals"
  });
}

    // Accept selected proposal
    proposal.status = "Accepted";
    await proposal.save();

    // Reject all other proposals for the same project
    await Proposal.updateMany(
      {
        project: proposal.project,
        _id: { $ne: proposal._id }
      },
      {
        status: "Rejected"
      }
    );

    // Update project status
    await Project.findByIdAndUpdate(
      proposal.project,
      {
        selectedFreelancer: proposal.freelancer,
        status: "In Progress",
        progress: 0,
        currentStage: "Requirements"
      }
    );

    res.json({
      message: "Proposal accepted and project started successfully",
      proposal
    });

  } catch (error) {
    console.log("ACCEPT PROPOSAL ERROR:", error);

    res.status(500).json({
      message: "Failed to accept proposal",
      error: error.message
    });
  }
});

module.exports = router;