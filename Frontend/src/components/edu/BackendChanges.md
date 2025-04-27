# Backend Changes Required for EDUverse Educational Platform

## User Model Updates

The current user model needs to be extended to support the educational platform's features. Here are the necessary changes:

```javascript
// Add these fields to the existing user schema in Backend/model/user.model.js

// User type field to distinguish between students and mentors
userType: { 
  type: String, 
  enum: ["student", "mentor"],
  default: "student"
},

// Fields specific to mentors
expertise: {
  type: [String], // Array of subjects/topics they can teach
  default: []
},
experience: {
  type: String, // Years of experience range (e.g., "1-3", "3-5", "5-10", "10+")
},
qualifications: {
  type: String, // Educational qualifications
},
hourlyRate: {
  type: Number, // Pricing for sessions
},

// Fields specific to students
interests: {
  type: [String], // Array of subjects/topics they're interested in
  default: []
},
educationLevel: {
  type: String, // Current education level
  enum: ["high_school", "undergraduate", "graduate", "postgraduate", "professional"]
},

// Fields for both user types
courses: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Course'
}],
enrolledCourses: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Course'
}],
```

## Controller Updates

The registration controller needs to be updated to handle the new fields:

```javascript
// Update the register function in Backend/controller/user.controller.js

export const register = async (req, res) => {
  try {
    const { 
      fullname, 
      email, 
      password, 
      username, 
      facialEmbeddings,
      userType,
      // Mentor-specific fields
      expertise,
      experience,
      qualifications,
      hourlyRate,
      // Student-specific fields
      interests,
      educationLevel,
      bio
    } = req.body;

    // Basic validation
    if (!fullname || !email || !password || !username || !facialEmbeddings) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please log in.",
      });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object with common fields
    const userData = {
      fullname,
      email,
      password: hashedPassword,
      username,
      facialEmbeddings,
      userType: userType || "student", // Default to student if not specified
      bio: bio || ""
    };

    // Add user type specific fields
    if (userType === "mentor") {
      userData.expertise = expertise || [];
      userData.experience = experience || "";
      userData.qualifications = qualifications || "";
      userData.hourlyRate = hourlyRate || 0;
    } else {
      userData.interests = interests || [];
      userData.educationLevel = educationLevel || "";
    }

    // Create new user in the database
    const newUser = await User.create(userData);

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      userId: newUser._id,
    });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: err.message,
    });
  }
};
```

## New Models Required

### Course Model

```javascript
// Create a new file: Backend/model/course.model.js

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
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  price: { 
    type: Number, 
    default: 0 
  },
  discountPrice: { 
    type: Number, 
    default: 0 
  },
  thumbnail: { 
    type: String, 
    default: "" 
  },
  lessons: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Lesson' 
  }],
  students: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  rating: { 
    type: Number, 
    default: 0 
  },
  reviews: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Review' 
  }],
  duration: { 
    type: Number, // in minutes
    default: 0 
  },
  level: { 
    type: String, 
    enum: ["beginner", "intermediate", "advanced"], 
    default: "beginner" 
  },
  published: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
```

### Lesson Model

```javascript
// Create a new file: Backend/model/lesson.model.js

import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: "" 
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  videoUrl: { 
    type: String, 
    default: "" 
  },
  duration: { 
    type: Number, // in minutes
    default: 0 
  },
  order: { 
    type: Number, 
    required: true 
  },
  resources: [{ 
    title: String, 
    url: String 
  }],
  quiz: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quiz' 
  }
}, { timestamps: true });

export default mongoose.model("Lesson", lessonSchema);
```

### Review Model

```javascript
// Create a new file: Backend/model/review.model.js

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    default: "" 
  }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
```

## New Routes Required

Add these routes to handle educational platform functionality:

```javascript
// Add to Backend/route/user.route.js or create a new file for edu routes

// Mentor routes
router.post('/courses', auth, upload.single('thumbnail'), createCourse);
router.put('/courses/:courseId', auth, upload.single('thumbnail'), updateCourse);
router.delete('/courses/:courseId', auth, deleteCourse);
router.post('/courses/:courseId/lessons', auth, createLesson);
router.put('/courses/:courseId/lessons/:lessonId', auth, updateLesson);
router.delete('/courses/:courseId/lessons/:lessonId', auth, deleteLesson);
router.get('/mentor/dashboard', auth, getMentorDashboard);
router.get('/mentor/students', auth, getMentorStudents);

// Student routes
router.get('/courses', getCourses);
router.get('/courses/:courseId', getCourseDetails);
router.post('/courses/:courseId/enroll', auth, enrollCourse);
router.post('/courses/:courseId/reviews', auth, addReview);
router.get('/student/dashboard', auth, getStudentDashboard);
router.get('/student/courses', auth, getEnrolledCourses);

// Common routes
router.get('/mentors', getMentors);
router.get('/mentors/:mentorId', getMentorProfile);
```

## Implementation Notes

1. The existing facial recognition registration flow should be maintained, but with the additional fields for the educational platform.

2. The backend should validate the user type and only process the relevant fields for each type.

3. When implementing the course creation functionality, ensure that only users with the "mentor" type can create courses.

4. For course enrollment, implement a check to ensure that only users with the "student" type can enroll in courses.

5. Consider implementing a payment system for paid courses in the future.

6. Add appropriate indexes to the database for efficient querying, especially for course searches and user type filtering.
