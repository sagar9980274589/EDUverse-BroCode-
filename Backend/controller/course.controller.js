import Course from "../model/course.model.js";
import User from "../model/user.model.js";
import { uploadToCloudinary } from "../service/multer.js";

// Create a new course
export const createCourse = async (req, res) => {
  try {
    console.log("Create course request received");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("Request user ID:", req.id);

    const userId = req.id;

    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Find the user and check if they are a mentor
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.userType !== "mentor") {
      return res.status(403).json({
        success: false,
        message: "Only mentors can create courses",
      });
    }

    // Extract course data from request body
    const {
      title,
      description,
      category,
      level,
      price,
      isFree,
      videoLinks,
      sections
    } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and category are required",
      });
    }

    // Parse JSON strings if they are strings
    let parsedVideoLinks = videoLinks;
    let parsedSections = sections;

    if (typeof videoLinks === 'string') {
      parsedVideoLinks = JSON.parse(videoLinks);
    }

    if (typeof sections === 'string') {
      parsedSections = JSON.parse(sections);
    }

    // Create course object
    const courseData = {
      title,
      description,
      category,
      level: level || "beginner",
      mentor: userId,
      price: isFree === "true" || isFree === true ? 0 : parseFloat(price) || 0,
      isFree: isFree === "true" || isFree === true,
      videoLinks: parsedVideoLinks || [],
      sections: parsedSections || [],
      materials: [],
      isPublished: false // Default to draft mode
    };

    // Upload course image if provided
    console.log("Files received:", req.files);

    if (req.files && req.files.courseImage && req.files.courseImage.length > 0) {
      console.log("Processing course image:", req.files.courseImage[0].path);
      try {
        const imageUrl = await uploadToCloudinary(req.files.courseImage[0].path);
        courseData.image = imageUrl;
        console.log("Course image uploaded:", imageUrl);
      } catch (imageError) {
        console.error("Error uploading course image:", imageError);
        // Continue without the image
      }
    }

    // Handle course materials if provided
    if (req.files && req.files.materials && req.files.materials.length > 0) {
      console.log("Processing course materials:", req.files.materials.length, "files");

      const materialNames = req.body.materialNames
        ? (Array.isArray(req.body.materialNames)
            ? req.body.materialNames
            : [req.body.materialNames])
        : [];

      const materials = [];

      for (let i = 0; i < req.files.materials.length; i++) {
        const file = req.files.materials[i];
        console.log("Processing material file:", file.originalname);

        try {
          const fileUrl = await uploadToCloudinary(file.path);
          materials.push({
            name: materialNames[i] || file.originalname,
            url: fileUrl
          });
          console.log("Material uploaded:", fileUrl);
        } catch (materialError) {
          console.error("Error uploading material:", materialError);
          // Continue with the next file
        }
      }

      courseData.materials = materials;
    }

    // Handle uploaded videos if provided
    if (req.files && req.files.videos && req.files.videos.length > 0) {
      console.log("Processing videos:", req.files.videos.length, "files");

      const videoTitles = req.body.videoTitles
        ? (Array.isArray(req.body.videoTitles)
            ? req.body.videoTitles
            : [req.body.videoTitles])
        : [];

      const videos = [];

      for (let i = 0; i < req.files.videos.length; i++) {
        const file = req.files.videos[i];
        console.log("Processing video file:", file.originalname);

        try {
          const fileUrl = await uploadToCloudinary(file.path);
          videos.push({
            title: videoTitles[i] || file.originalname,
            url: fileUrl,
            type: "uploaded"
          });
          console.log("Video uploaded:", fileUrl);
        } catch (videoError) {
          console.error("Error uploading video:", videoError);
          // Continue with the next file
        }
      }

      // Add uploaded videos to videoLinks
      courseData.videoLinks = [...courseData.videoLinks, ...videos];
    }

    // Handle content videos if provided
    if (req.files && req.files.contentVideos && req.files.contentVideos.length > 0) {
      console.log("Processing content videos:", req.files.contentVideos.length, "files");

      const contentVideoTitles = req.body.contentVideoTitles
        ? (Array.isArray(req.body.contentVideoTitles)
            ? req.body.contentVideoTitles
            : [req.body.contentVideoTitles])
        : [];

      const contentVideoSectionIndexes = req.body.contentVideoSectionIndexes
        ? (Array.isArray(req.body.contentVideoSectionIndexes)
            ? req.body.contentVideoSectionIndexes
            : [req.body.contentVideoSectionIndexes])
        : [];

      const contentVideoContentIndexes = req.body.contentVideoContentIndexes
        ? (Array.isArray(req.body.contentVideoContentIndexes)
            ? req.body.contentVideoContentIndexes
            : [req.body.contentVideoContentIndexes])
        : [];

      for (let i = 0; i < req.files.contentVideos.length; i++) {
        const file = req.files.contentVideos[i];
        console.log("Processing content video file:", file.originalname);

        try {
          const fileUrl = await uploadToCloudinary(file.path);
          const sectionIndex = parseInt(contentVideoSectionIndexes[i]);
          const contentIndex = parseInt(contentVideoContentIndexes[i]);

          // Make sure the section and content exist
          if (courseData.sections[sectionIndex] && courseData.sections[sectionIndex].content[contentIndex]) {
            // Update the content with the uploaded video URL
            courseData.sections[sectionIndex].content[contentIndex].url = fileUrl;
            courseData.sections[sectionIndex].content[contentIndex].title = contentVideoTitles[i] || file.originalname;
            console.log("Content video uploaded:", fileUrl);
          }
        } catch (videoError) {
          console.error("Error uploading content video:", videoError);
          // Continue with the next file
        }
      }
    }

    // Create the course
    const newCourse = await Course.create(courseData);

    // Add course to mentor's courses
    await User.findByIdAndUpdate(userId, {
      $push: { courses: newCourse._id }
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse
    });
  } catch (error) {
    console.error("Error creating course:", error);
    console.error("Error stack:", error.stack);

    // Log more detailed information
    console.error("Request body:", req.body);
    console.error("Request files:", req.files ? Object.keys(req.files) : "No files");

    if (req.files && req.files.videos) {
      console.error("Videos count:", req.files.videos.length);
    }

    if (req.files && req.files.contentVideos) {
      console.error("Content videos count:", req.files.contentVideos.length);
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the course",
      error: error.message,
      stack: error.stack
    });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;

    // Build filter object
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (level) {
      filter.level = level;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Only show published courses
    filter.isPublished = true;

    const courses = await Course.find(filter)
      .populate('mentor', 'username fullname profile')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      courses
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching courses",
      error: error.message
    });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate('mentor', 'username fullname profile expertise experience')
      .populate('enrolledStudents', 'username fullname profile');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    return res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the course",
      error: error.message
    });
  }
};

// Get courses by mentor ID
export const getCoursesByMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const courses = await Course.find({ mentor: mentorId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      courses
    });
  } catch (error) {
    console.error("Error fetching mentor courses:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching mentor courses",
      error: error.message
    });
  }
};

// Get courses enrolled by student
export const getCoursesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const courses = await Course.find({ enrolledStudents: studentId })
      .populate('mentor', 'username fullname profile')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      courses
    });
  } catch (error) {
    console.error("Error fetching student courses:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching student courses",
      error: error.message
    });
  }
};

// Update course
export const updateCourse = async (req, res) => {
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

    // Check if user is the mentor of the course
    if (course.mentor.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this course"
      });
    }

    // Extract course data from request body
    const {
      title,
      description,
      category,
      level,
      price,
      isFree,
      videoLinks,
      sections,
      isPublished
    } = req.body;

    // Parse JSON strings if they are strings
    let parsedVideoLinks = videoLinks;
    let parsedSections = sections;

    if (typeof videoLinks === 'string') {
      parsedVideoLinks = JSON.parse(videoLinks);
    }

    if (typeof sections === 'string') {
      parsedSections = JSON.parse(sections);
    }

    // Update course object
    const courseData = {
      title: title || course.title,
      description: description || course.description,
      category: category || course.category,
      level: level || course.level,
      price: isFree === "true" || isFree === true ? 0 : parseFloat(price) || course.price,
      isFree: isFree === "true" || isFree === true ? true : isFree === "false" || isFree === false ? false : course.isFree,
      videoLinks: parsedVideoLinks || course.videoLinks,
      sections: parsedSections || course.sections,
      isPublished: isPublished !== undefined ? isPublished : course.isPublished
    };

    // Upload course image if provided
    if (req.files && req.files.courseImage && req.files.courseImage.length > 0) {
      try {
        const imageUrl = await uploadToCloudinary(req.files.courseImage[0].path);
        courseData.image = imageUrl;
      } catch (imageError) {
        console.error("Error uploading course image:", imageError);
        // Continue without updating the image
      }
    }

    // Handle course materials if provided
    if (req.files && req.files.materials && req.files.materials.length > 0) {
      const materialNames = req.body.materialNames
        ? (Array.isArray(req.body.materialNames)
            ? req.body.materialNames
            : [req.body.materialNames])
        : [];

      const materials = [...course.materials];

      for (let i = 0; i < req.files.materials.length; i++) {
        const file = req.files.materials[i];

        try {
          const fileUrl = await uploadToCloudinary(file.path);
          materials.push({
            name: materialNames[i] || file.originalname,
            url: fileUrl
          });
        } catch (materialError) {
          console.error("Error uploading material:", materialError);
          // Continue with the next file
        }
      }

      courseData.materials = materials;
    }

    // Handle uploaded videos if provided
    if (req.files && req.files.videos && req.files.videos.length > 0) {
      console.log("Processing videos:", req.files.videos.length, "files");

      const videoTitles = req.body.videoTitles
        ? (Array.isArray(req.body.videoTitles)
            ? req.body.videoTitles
            : [req.body.videoTitles])
        : [];

      const videos = [];

      for (let i = 0; i < req.files.videos.length; i++) {
        const file = req.files.videos[i];
        console.log("Processing video file:", file.originalname);

        try {
          const fileUrl = await uploadToCloudinary(file.path);
          videos.push({
            title: videoTitles[i] || file.originalname,
            url: fileUrl,
            type: "uploaded"
          });
          console.log("Video uploaded:", fileUrl);
        } catch (videoError) {
          console.error("Error uploading video:", videoError);
          // Continue with the next file
        }
      }

      // Add uploaded videos to videoLinks
      courseData.videoLinks = [...courseData.videoLinks, ...videos];
    }

    // Handle content videos if provided
    if (req.files && req.files.contentVideos && req.files.contentVideos.length > 0) {
      console.log("Processing content videos:", req.files.contentVideos.length, "files");

      const contentVideoTitles = req.body.contentVideoTitles
        ? (Array.isArray(req.body.contentVideoTitles)
            ? req.body.contentVideoTitles
            : [req.body.contentVideoTitles])
        : [];

      const contentVideoSectionIndexes = req.body.contentVideoSectionIndexes
        ? (Array.isArray(req.body.contentVideoSectionIndexes)
            ? req.body.contentVideoSectionIndexes
            : [req.body.contentVideoSectionIndexes])
        : [];

      const contentVideoContentIndexes = req.body.contentVideoContentIndexes
        ? (Array.isArray(req.body.contentVideoContentIndexes)
            ? req.body.contentVideoContentIndexes
            : [req.body.contentVideoContentIndexes])
        : [];

      for (let i = 0; i < req.files.contentVideos.length; i++) {
        const file = req.files.contentVideos[i];
        console.log("Processing content video file:", file.originalname);

        try {
          const fileUrl = await uploadToCloudinary(file.path);
          const sectionIndex = parseInt(contentVideoSectionIndexes[i]);
          const contentIndex = parseInt(contentVideoContentIndexes[i]);

          // Make sure the section and content exist
          if (courseData.sections[sectionIndex] && courseData.sections[sectionIndex].content[contentIndex]) {
            // Update the content with the uploaded video URL
            courseData.sections[sectionIndex].content[contentIndex].url = fileUrl;
            courseData.sections[sectionIndex].content[contentIndex].title = contentVideoTitles[i] || file.originalname;
            console.log("Content video uploaded:", fileUrl);
          }
        } catch (videoError) {
          console.error("Error uploading content video:", videoError);
          // Continue with the next file
        }
      }
    }

    // Update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      courseData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the course",
      error: error.message
    });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
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

    // Check if user is the mentor of the course
    if (course.mentor.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course"
      });
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    // Remove course from mentor's courses
    await User.findByIdAndUpdate(userId, {
      $pull: { courses: courseId }
    });

    // Remove course from enrolled students
    for (const studentId of course.enrolledStudents) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { enrolledCourses: courseId }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the course",
      error: error.message
    });
  }
};

// Enroll in a course
export const enrollCourse = async (req, res) => {
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

    // Find the user and check if they are a student
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.userType !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can enroll in courses",
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

    // Check if student is already enrolled
    if (course.enrolledStudents.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course"
      });
    }

    // Check if course is published
    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: "This course is not available for enrollment"
      });
    }

    // Enroll the student
    await Course.findByIdAndUpdate(courseId, {
      $push: { enrolledStudents: userId }
    });

    // Add course to student's enrolled courses
    await User.findByIdAndUpdate(userId, {
      $push: { enrolledCourses: courseId }
    });

    return res.status(200).json({
      success: true,
      message: "Successfully enrolled in the course"
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while enrolling in the course",
      error: error.message
    });
  }
};

// Publish or unpublish a course
export const togglePublishCourse = async (req, res) => {
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

    // Check if user is the mentor of the course
    console.log("Course mentor ID:", course.mentor);
    console.log("User ID:", userId);
    console.log("Comparison:", course.mentor.toString() === userId);

    // Convert both to strings for comparison
    if (course.mentor.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to publish this course"
      });
    }

    // Toggle the published status
    const newPublishedStatus = !course.isPublished;

    // Update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { isPublished: newPublishedStatus },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: newPublishedStatus ? "Course published successfully" : "Course unpublished successfully",
      course: updatedCourse
    });
  } catch (error) {
    console.error("Error toggling course publish status:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the course",
      error: error.message
    });
  }
};

// Rate and review a course
export const rateCourse = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;
    const { rating, review } = req.body;

    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
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

    // Check if student is enrolled in the course
    if (!course.enrolledStudents.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in the course to rate it"
      });
    }

    // Check if student has already rated the course
    const existingRatingIndex = course.ratings.findIndex(
      r => r.student.toString() === userId
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      course.ratings[existingRatingIndex].rating = rating;
      course.ratings[existingRatingIndex].review = review || "";
    } else {
      // Add new rating
      course.ratings.push({
        student: userId,
        rating,
        review: review || ""
      });
    }

    // Calculate average rating
    const totalRating = course.ratings.reduce((sum, r) => sum + r.rating, 0);
    course.averageRating = totalRating / course.ratings.length;

    // Save the course
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course rated successfully",
      averageRating: course.averageRating
    });
  } catch (error) {
    console.error("Error rating course:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while rating the course",
      error: error.message
    });
  }
};
