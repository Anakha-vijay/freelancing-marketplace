
const express = require("express");
const mongoose = require("mongoose");
const Proposal = require("../models/Proposal");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Submit a proposal
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({
        message: "Only freelancers can submit proposals."
      });
    }

    const { project, coverLetter, bidAmount, deliveryTime } = req.body;

    if (
      !project ||
      !mongoose.isValidObjectId(project) ||
      typeof coverLetter !== "string" ||
      !coverLetter.trim() ||
      coverLetter.trim().length > 5000 ||
      !Number.isFinite(Number(bidAmount)) ||
      Number(bidAmount) <= 0 ||
      !Number.isInteger(Number(deliveryTime)) ||
      Number(deliveryTime) <= 0
    ) {
      return res.status(400).json({
        message: "Please provide valid proposal details."
      });
    }

    const projectData = await Project.findById(project);

    if (!projectData) {
      return res.status(404).json({
        message: "Project not found."
      });
    }

    if (projectData.status !== "Open") {
      return res.status(400).json({
        message: "This project is no longer accepting proposals."
      });
    }

    if (projectData.client.toString() === req.user.id) {
      return res.status(403).json({
        message: "You cannot submit a proposal to your own project."
      });
    }

    const existingProposal = await Proposal.findOne({
      project,
      freelancer: req.user.id
    });

    if (existingProposal) {
      return res.status(409).json({
        message: "You have already submitted a proposal for this project."
      });
    }

    const newProposal = new Proposal({
      project,
      freelancer: req.user.id,
      coverLetter: coverLetter.trim(),
      bidAmount: Number(bidAmount),
      deliveryTime: Number(deliveryTime),
      status: "Pending"
    });

    await newProposal.save();

    return res.status(201).json({
      message: "Proposal submitted successfully.",
      proposal: newProposal
    });
  } catch (error) {
    console.error("SUBMIT PROPOSAL ERROR:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already submitted a proposal for this project."
      });
    }

    return res.status(500).json({
      message: "Failed to submit proposal."
    });
  }
});

// Get proposals for a project (project owner only)
router.get("/project/:projectId", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(400).json({
        message: "Invalid project ID."
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found."
      });
    }

    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to view these proposals."
      });
    }

    const proposals = await Proposal.find({ project: projectId })
      .populate("freelancer", "name email")
      .populate({
        path: "project",
        model: Project
      });

    return res.json(proposals);
  } catch (error) {
    console.error("GET PROJECT PROPOSALS ERROR:", error.message);

    return res.status(500).json({
      message: "Failed to fetch proposals."
    });
  }
});

// Get a freelancer's proposals (that freelancer only)
router.get("/freelancer/:freelancerId", authMiddleware, async (req, res) => {
  try {
    const { freelancerId } = req.params;

    if (!mongoose.isValidObjectId(freelancerId)) {
      return res.status(400).json({
        message: "Invalid freelancer ID."
      });
    }

    if (
      req.user.role !== "freelancer" ||
      req.user.id !== freelancerId
    ) {
      return res.status(403).json({
        message: "You are not authorized to view these proposals."
      });
    }

    const proposals = await Proposal.find({
      freelancer: freelancerId
    })
      .populate({
        path: "project",
        model: Project,
        select: "title budget deadline status"
      })
      .populate("freelancer", "name email");

    return res.json(proposals);
  } catch (error) {
    console.error("GET FREELANCER PROPOSALS ERROR:", error.message);

    return res.status(500).json({
      message: "Failed to fetch freelancer proposals."
    });
  }
});

// Get accepted proposals for the client's Messages inbox
router.get(
  "/client/:clientId/accepted",
  authMiddleware,
  async (req, res) => {
    try {
      const { clientId } = req.params;

      if (!mongoose.isValidObjectId(clientId)) {
        return res.status(400).json({
          message: "Invalid client ID."
        });
      }

      if (
        req.user.role !== "client" ||
        req.user.id !== clientId
      ) {
        return res.status(403).json({
          message: "You are not authorized to view these proposals."
        });
      }

      const clientProjects = await Project.find({
        client: clientId
      }).select("_id");

      const projectIds = clientProjects.map(
        (project) => project._id
      );

      const proposals = await Proposal.find({
        project: { $in: projectIds },
        status: "Accepted"
      }).populate({
        path: "project",
        model: Project,
        select: "title budget deadline status selectedFreelancer client"
      });

      return res.json(proposals);
    } catch (error) {
      console.error(
        "GET CLIENT ACCEPTED PROPOSALS ERROR:",
        error.message
      );

      return res.status(500).json({
        message: "Failed to fetch accepted projects."
      });
    }
  }
);

// Count proposals for a client's projects (that client only)
router.get("/client/:clientId", authMiddleware, async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!mongoose.isValidObjectId(clientId)) {
      return res.status(400).json({
        message: "Invalid client ID."
      });
    }

    if (
      req.user.role !== "client" ||
      req.user.id !== clientId
    ) {
      return res.status(403).json({
        message: "You are not authorized to view these proposal counts."
      });
    }

    const clientProjects = await Project.find({
      client: clientId
    }).select("_id");

    const projectIds = clientProjects.map(
      (project) => project._id
    );

    const count = await Proposal.countDocuments({
      project: { $in: projectIds }
    });

    return res.json({ count });
  } catch (error) {
    console.error("COUNT CLIENT PROPOSALS ERROR:", error.message);

    return res.status(500).json({
      message: "Failed to fetch proposal counts."
    });
  }
});

// Accept a proposal (project owner only)
router.put("/:proposalId/accept", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({
        message: "Only clients can accept proposals."
      });
    }

    const { proposalId } = req.params;

    if (!mongoose.isValidObjectId(proposalId)) {
      return res.status(400).json({
        message: "Invalid proposal ID."
      });
    }

    const proposal = await Proposal.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found."
      });
    }

    const project = await Project.findById(proposal.project);

    if (!project) {
      return res.status(404).json({
        message: "Project not found."
      });
    }

    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You cannot accept proposals for another client's project."
      });
    }

    if (project.status !== "Open") {
      return res.status(400).json({
        message: "This project is no longer open for proposals."
      });
    }

    proposal.status = "Accepted";
    await proposal.save();

    await Proposal.updateMany(
      {
        project: project._id,
        _id: { $ne: proposal._id }
      },
      {
        $set: { status: "Rejected" }
      }
    );

    project.selectedFreelancer = proposal.freelancer;
    project.status = "In Progress";
    project.progress = 0;
    project.currentStage = "Requirements";

    await project.save();

    const updatedProposal = await Proposal.findById(proposal._id)
      .populate("freelancer", "name email")
      .populate({
        path: "project",
        model: Project
      });

    return res.json({
      message: "Proposal accepted successfully.",
      proposal: updatedProposal,
      project
    });
  } catch (error) {
    console.error("ACCEPT PROPOSAL ERROR:", error.message);

    return res.status(500).json({
      message: "Failed to accept proposal."
    });
  }
});

module.exports = router;
