const express = require("express");
const mongoose = require("mongoose");
const Message = require("../models/Message");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Send a message
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { receiver, project, message } = req.body;

    if (
      typeof project !== "string" ||
      !mongoose.isValidObjectId(project) ||
      typeof receiver !== "string" ||
      !mongoose.isValidObjectId(receiver) ||
      typeof message !== "string" ||
      !message.trim() ||
      message.trim().length > 5000
    ) {
      return res.status(400).json({
        message: "Please provide valid message details."
      });
    }

    const projectData = await Project.findById(project);

    if (!projectData) {
      return res.status(404).json({
        message: "Project not found."
      });
    }

    const userId = req.user.id;
    const clientId = projectData.client.toString();
    const freelancerId = projectData.selectedFreelancer
      ? projectData.selectedFreelancer.toString()
      : null;

    const isClient = clientId === userId;
    const isAssignedFreelancer = freelancerId === userId;

    if (!isClient && !isAssignedFreelancer) {
      return res.status(403).json({
        message: "You are not authorized to message for this project."
      });
    }

    const allowedReceiver = isClient
      ? freelancerId
      : clientId;

    if (!allowedReceiver || receiver !== allowedReceiver) {
      return res.status(403).json({
        message: "Messages can only be sent to the other project participant."
      });
    }

    const newMessage = new Message({
      sender: userId,
      receiver: allowedReceiver,
      project: projectData._id,
      message: message.trim()
    });

    await newMessage.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name")
      .populate("receiver", "name");

    return res.status(201).json({
      message: "Message sent successfully",
      newMessage: populatedMessage
    });
  } catch (error) {
    console.error("MESSAGE ERROR:", error.message);

    return res.status(500).json({
      message: "Failed to send message."
    });
  }
});

// Get messages for a project
router.get("/:projectId", authMiddleware, async (req, res) => {
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

    const userId = req.user.id;
    const isClient = project.client.toString() === userId;
    const isAssignedFreelancer =
      project.selectedFreelancer &&
      project.selectedFreelancer.toString() === userId;

    if (!isClient && !isAssignedFreelancer) {
      return res.status(403).json({
        message: "You are not authorized to view these messages."
      });
    }

    const messages = await Message.find({
      project: project._id,
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (error) {
    console.error("FETCH MESSAGES ERROR:", error.message);

    return res.status(500).json({
      message: "Failed to fetch messages."
    });
  }
});

module.exports = router;
