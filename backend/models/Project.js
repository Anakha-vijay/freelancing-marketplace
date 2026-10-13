
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    skills: {
      type: String,
      required: true
    },
    budget: {
      type: Number,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    selectedFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed"],
      default: "Open"
    },
    progress: {
      type: Number,
      default: 0
    },
    currentStage: {
      type: String,
      default: "Not Started"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
