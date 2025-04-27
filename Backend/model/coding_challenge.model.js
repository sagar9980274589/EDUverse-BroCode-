import mongoose from "mongoose";

// Schema for storing daily coding challenges
const codingChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true
  },
  problemId: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  tags: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  source: {
    type: String,
    enum: ["LeetCode", "HackerRank", "EDUverse", "Custom"],
    default: "EDUverse"
  },
  testCases: [{
    input: {
      type: String,
      required: true
    },
    output: {
      type: String,
      required: true
    }
  }],
  starterCode: {
    python: String,
    javascript: String,
    java: String,
    cpp: String,
    c: String
  },
  solutionCode: {
    python: String,
    javascript: String,
    java: String,
    cpp: String,
    c: String
  }
}, { timestamps: true });

// Schema for tracking student submissions
const challengeSubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingChallenge',
    required: true
  },
  status: {
    type: String,
    enum: ["Attempted", "Solved", "Failed"],
    required: true
  },
  language: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  testResults: [{
    input: String,
    expected_output: String,
    actual_output: String,
    status: {
      id: Number,
      description: String
    },
    passed: Boolean,
    error: String
  }],
  executionTime: {
    type: Number
  },
  memoryUsed: {
    type: Number
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Schema for student ranking
const studentRankingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalSolved: {
    type: Number,
    default: 0
  },
  easyCount: {
    type: Number,
    default: 0
  },
  mediumCount: {
    type: Number,
    default: 0
  },
  hardCount: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  lastSolvedDate: {
    type: Date
  },
  score: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number
  },
  solvedChallenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingChallenge'
  }]
}, { timestamps: true });

export const CodingChallenge = mongoose.model("CodingChallenge", codingChallengeSchema);
export const ChallengeSubmission = mongoose.model("ChallengeSubmission", challengeSubmissionSchema);
export const StudentRanking = mongoose.model("StudentRanking", studentRankingSchema);
