const express = require("express");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Send a message
router.post("/",authMiddleware, async (req, res) => {
  try {
    const {
      sender,
      receiver,
      project,
      message
    } = req.body;

    const newMessage = new Message({
      sender,
      receiver,
      project,
      message
    });

    await newMessage.save();

    res.status(201).json({
      message: "Message sent successfully",
      newMessage
    });

  } catch (error) {
    console.log("MESSAGE ERROR:", error);

    res.status(500).json({
      message: "Failed to send message",
      error: error.message
    });
  }
});


// Get messages for a project
router.get("/:projectId",authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      project: req.params.projectId
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message
    });
  }
});


module.exports = router;