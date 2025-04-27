import CourseMessage from "../model/courseMessage.model.js";
import Course from "../model/course.model.js";
import User from "../model/user.model.js";

// Get all messages for a course
export const getCourseMessages = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;
    
    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    
    // Find the course
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    
    // Check if user is enrolled in the course or is the mentor
    const isEnrolled = course.enrolledStudents.includes(userId);
    const isMentor = course.mentor.toString() === userId.toString();
    
    if (!isEnrolled && !isMentor) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this course's messages"
      });
    }
    
    // Get messages for the course
    const messages = await CourseMessage.find({ courseId })
      .sort({ timestamp: 1 });
    
    return res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error("Error getting course messages:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while getting course messages",
      error: error.message
    });
  }
};

// Send a message in a course
export const sendCourseMessage = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;
    const { message } = req.body;
    
    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    
    // Find the course
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    
    // Check if user is enrolled in the course or is the mentor
    const isEnrolled = course.enrolledStudents.includes(userId);
    const isMentor = course.mentor.toString() === userId.toString();
    
    if (!isEnrolled && !isMentor) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to send messages in this course"
      });
    }
    
    // Get user details
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Create new message
    const newMessage = new CourseMessage({
      courseId,
      senderId: userId,
      senderName: user.username,
      senderType: user.userType,
      senderProfile: user.profile,
      message
    });
    
    await newMessage.save();
    
    // Emit the message to all users in the course room
    // This will be handled by the socket.io server
    
    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      newMessage
    });
  } catch (error) {
    console.error("Error sending course message:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending the message",
      error: error.message
    });
  }
};
