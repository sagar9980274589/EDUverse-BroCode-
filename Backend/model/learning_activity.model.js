import mongoose from "mongoose";

// Define learning activity schema
const learningActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  activityType: {
    type: String,
    enum: [
      "course_view", 
      "video_watch", 
      "course_complete", 
      "section_complete", 
      "material_download", 
      "quiz_attempt", 
      "assignment_submit",
      "note_create",
      "discussion_participate"
    ],
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    default: null
  },
  courseName: {
    type: String,
    default: ""
  },
  contentId: {
    type: String,
    default: null
  },
  contentTitle: {
    type: String,
    default: ""
  },
  activityData: {
    type: Object,
    default: {}
  },
  activityDate: {
    type: Date,
    default: Date.now
  },
  activityDuration: {
    type: Number, // Duration in seconds
    default: 0
  },
  activityPoints: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

// Create indexes for faster queries
learningActivitySchema.index({ user: 1, activityDate: -1 });
learningActivitySchema.index({ user: 1, courseId: 1 });

const LearningActivity = mongoose.model("LearningActivity", learningActivitySchema);
export default LearningActivity;
