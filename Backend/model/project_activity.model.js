import mongoose from "mongoose";

// Define project activity schema
const projectActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  activityType: {
    type: String,
    enum: ["commit", "push", "pull_request", "issue", "repo_create", "repo_update", "manual_update"],
    required: true
  },
  activityData: {
    type: Object,
    default: {}
  },
  githubRepoId: {
    type: String,
    default: null
  },
  githubRepoName: {
    type: String,
    default: null
  },
  activityDate: {
    type: Date,
    default: Date.now
  },
  contributionCount: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

// Create indexes for faster queries
projectActivitySchema.index({ user: 1, activityDate: -1 });
projectActivitySchema.index({ user: 1, githubRepoId: 1 });

const ProjectActivity = mongoose.model("ProjectActivity", projectActivitySchema);
export default ProjectActivity;
