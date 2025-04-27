import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "all"],
    default: "beginner"
  },
  mentor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  price: { 
    type: Number, 
    default: 0 
  },
  isFree: {
    type: Boolean,
    default: true
  },
  image: { 
    type: String, 
    default: "" 
  },
  videoLinks: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ["video", "playlist"],
      default: "video"
    }
  }],
  sections: [{
    title: String,
    content: [{
      title: String,
      type: {
        type: String,
        enum: ["video", "playlist"],
        default: "video"
      },
      url: String
    }]
  }],
  materials: [{
    name: String,
    url: String
  }],
  enrolledStudents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  ratings: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
