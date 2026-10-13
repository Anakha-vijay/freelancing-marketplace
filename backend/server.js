const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/Project");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const proposalRoutes = require("./routes/Proposal");
const messageRoutes = require("./routes/Message");
const reviewRoutes = require("./routes/Review");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:");
    console.log(error.message);
  });

// Test route
app.get("/", (req, res) => {
  res.send("FreelanceHub Backend is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});