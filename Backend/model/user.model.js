import mongoose from "mongoose";

// Define user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  gender: { type: String, enum: ["m", "f"] },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  unreadMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  bio: { type: String, default: "" },
  profile: { type: String, default: "" },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] }],

  // ✅ Added Facial Embeddings Field
  facialEmbeddings: {
    type: [Number], // Array of numbers (128D face vector)
    default: [],
  },

  // ✅ Educational Platform Fields
  userType: {
    type: String,
    enum: ["student", "mentor", "regular"],
    default: "regular"
  },

  // Mentor-specific fields
  expertise: {
    type: [String], // Array of subjects/topics they can teach
    default: []
  },
  experience: {
    type: String, // Years of experience range (e.g., "1-3", "3-5", "5-10", "10+")
    default: ""
  },
  qualifications: {
    type: String, // Educational qualifications
    default: ""
  },
  hourlyRate: {
    type: Number, // Pricing for sessions
    default: 0
  },

  // Student-specific fields
  interests: {
    type: [String], // Array of subjects/topics they're interested in
    default: []
  },
  educationLevel: {
    type: String, // Current education level
    default: ""
  },

  // GitHub integration
  githubUsername: {
    type: String,
    default: ""
  },
  githubRepos: {
    type: Array,
    default: []
  },
  githubData: {
    type: Object,
    default: null
  },
  githubLastUpdated: {
    type: Date,
    default: null
  },
  githubConnected: {
    type: Boolean,
    default: false
  },

  // Course-related fields
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],

  // Project streak-related fields
  projectStreak: {
    type: Number,
    default: 0
  },
  projectStreakLastUpdated: {
    type: Date,
    default: null
  },
  longestProjectStreak: {
    type: Number,
    default: 0
  },
  totalProjectContributions: {
    type: Number,
    default: 0
  },
  projectContributionHistory: {
    type: Map,
    of: Number,
    default: {}
  },

  // Learning streak-related fields
  learningStreak: {
    type: Number,
    default: 0
  },
  learningStreakLastUpdated: {
    type: Date,
    default: null
  },
  longestLearningStreak: {
    type: Number,
    default: 0
  },
  totalLearningActivities: {
    type: Number,
    default: 0
  },
  learningActivityHistory: {
    type: Map,
    of: Number,
    default: {}
  },

}, { timestamps: true });

export default mongoose.model("User", userSchema);
