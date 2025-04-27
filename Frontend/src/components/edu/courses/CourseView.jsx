import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../layout/Navbar";
import CourseChat from "./CourseChat";
import VideoModal from "./VideoModal";
import {
  BookOpen,
  User,
  FileText,
  Download,
  Play,
  List,
  ChevronDown,
  ChevronUp,
  Star,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Film,
  Video
} from "lucide-react";

const CourseView = () => {
  const { courseId } = useParams();
  const user = useSelector((state) => state.data.userdata);
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [enrolling, setEnrolling] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/course/${courseId}`);

        if (response.status === 200) {
          setCourse(response.data.course);

          // Record course view activity if user is logged in
          if (user && user._id) {
            try {
              await axios.post(
                'http://localhost:3000/learning/record-activity',
                {
                  activityType: 'course_view',
                  courseId: response.data.course._id,
                  contentId: null,
                  contentTitle: null,
                  activityData: {},
                  activityDuration: 0,
                  activityPoints: 1
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
                }
              );
            } catch (activityError) {
              console.error("Error recording learning activity:", activityError);
              // Don't show error to user as this is a background operation
            }
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Failed to load course. Please try again.");
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, user]);

  // Toggle section expansion
  const toggleSection = (index) => {
    setExpandedSections({
      ...expandedSections,
      [index]: !expandedSections[index]
    });
  };

  // Handle enrollment
  const handleEnroll = async () => {
    if (!user || !user._id) {
      toast.info("Please log in to enroll in this course");
      navigate("/edu/login");
      return;
    }

    if (user.userType !== "student") {
      toast.info("Only students can enroll in courses");
      return;
    }

    try {
      setEnrolling(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:3000/course/${courseId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success("Successfully enrolled in the course!");
        // Refresh course data to update enrollment status
        const updatedCourse = await axios.get(`http://localhost:3000/course/${courseId}`);
        setCourse(updatedCourse.data.course);
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error(error.response?.data?.message || "Failed to enroll in the course");
    } finally {
      setEnrolling(false);
    }
  };

  // Handle publish/unpublish
  const handlePublish = async () => {
    if (!user || !user._id) {
      toast.info("Please log in to publish this course");
      navigate("/edu/login");
      return;
    }

    if (user.userType !== "mentor") {
      toast.info("Only mentors can publish courses");
      return;
    }

    if (!course || !course._id) {
      toast.error("Course data not loaded");
      return;
    }

    try {
      setPublishing(true);
      const token = localStorage.getItem("token");

      console.log("Publishing course:", courseId);
      console.log("User ID:", user._id);
      console.log("Course mentor ID:", course.mentor._id);

      const response = await axios.post(
        `http://localhost:3000/course/${courseId}/publish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        const action = course.isPublished ? "unpublished" : "published";
        toast.success(`Course ${action} successfully!`);
        // Refresh course data to update published status
        const updatedCourse = await axios.get(`http://localhost:3000/course/${courseId}`);
        setCourse(updatedCourse.data.course);
      }
    } catch (error) {
      console.error("Error publishing course:", error);
      if (error.response?.status === 403) {
        toast.error("You are not authorized to publish this course. Only the course creator can publish it.");
      } else {
        toast.error(error.response?.data?.message || "Failed to update course status");
      }
    } finally {
      setPublishing(false);
    }
  };

  // Check if user is enrolled
  const isEnrolled = () => {
    if (!user || !course) return false;
    return course.enrolledStudents.some(student => student._id === user._id);
  };

  // Check if user is the mentor of this course
  const isMentor = () => {
    if (!user || !course) return false;
    return course.mentor._id === user._id;
  };

  // Format YouTube URL for embedding
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }

    return null;
  };

  // Check if URL is a YouTube URL
  const isYoutubeUrl = (url) => {
    if (!url) return false;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 px-4 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/edu/my-courses"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Go to My Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render course not found
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 px-4 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
            <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/edu/my-courses"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Go to My Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Course Chat */}
      {(isEnrolled() || isMentor()) && course && (
        <CourseChat
          courseId={courseId}
          courseName={course.title}
          mentor={course.mentor}
        />
      )}

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <VideoModal
          video={{
            ...selectedVideo,
            courseId: courseId
          }}
          courseId={courseId}
          onClose={() => {
            setShowVideoModal(false);
            setSelectedVideo(null);
          }}
        />
      )}

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Course Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="md:flex">
              {/* Course Image */}
              <div className="md:w-2/5 h-64 md:h-auto">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                    <BookOpen className="text-indigo-300" size={64} />
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="md:w-3/5 p-6 md:p-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full capitalize">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full capitalize">
                    {course.level}
                  </span>
                  {course.isFree && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Free
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  {course.title}
                </h1>

                <p className="text-gray-600 mb-6">
                  {course.description}
                </p>

                {/* Mentor Info */}
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                    {course.mentor.profile ? (
                      <img
                        src={course.mentor.profile}
                        alt={course.mentor.fullname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <User size={20} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {course.mentor.fullname}
                    </p>
                    <p className="text-sm text-gray-500">
                      Mentor
                    </p>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    <span>{course.enrolledStudents?.length || 0} students enrolled</span>
                  </div>

                  {course.averageRating > 0 && (
                    <div className="flex items-center">
                      <div className="flex mr-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= Math.round(course.averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span>{course.averageRating.toFixed(1)}</span>
                    </div>
                  )}

                  {!course.isFree && (
                    <div className="flex items-center">
                      <DollarSign size={16} className="mr-1" />
                      <span>${course.price.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {!isMentor() && !isEnrolled() && (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center disabled:opacity-50"
                  >
                    {enrolling ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Enrolling...
                      </>
                    ) : (
                      <>
                        Enroll Now {!course.isFree && `- $${course.price.toFixed(2)}`}
                      </>
                    )}
                  </button>
                )}

                {isEnrolled() && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle size={18} className="mr-2" />
                    <span className="font-medium">You are enrolled in this course</span>
                  </div>
                )}

                {isMentor() && (
                  <div className="flex space-x-3">
                    <Link
                      to={`/edit-course/${course._id}`}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                      Edit Course
                    </Link>
                    <button
                      onClick={handlePublish}
                      disabled={publishing}
                      className={`px-4 py-2 border rounded-lg font-medium transition flex items-center ${
                        course.isPublished
                          ? "border-orange-500 text-orange-500 hover:bg-orange-50"
                          : "border-green-600 text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {publishing ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                          {course.isPublished ? "Unpublishing..." : "Publishing..."}
                        </>
                      ) : (
                        <>
                          {course.isPublished ? "Unpublish Course" : "Publish Course"}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Content */}
            <div className="lg:col-span-2">
              {/* Video Links */}
              {course.videoLinks && course.videoLinks.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <Video className="mr-2 text-indigo-600" size={24} />
                      Course Videos
                    </h2>

                    <div className="space-y-4">
                      {course.videoLinks.map((video, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          {(isEnrolled() || isMentor()) ? (
                            <div
                              className="aspect-w-16 aspect-h-9 bg-gray-100 cursor-pointer relative group"
                              onClick={() => {
                                setSelectedVideo(video);
                                setShowVideoModal(true);
                              }}
                            >
                              {video.type === "uploaded" || !isYoutubeUrl(video.url) ? (
                                // Uploaded video or direct video URL thumbnail
                                <div className="w-full h-full flex items-center justify-center bg-black">
                                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                                  <Film className="text-white opacity-80 group-hover:opacity-100 transition-opacity" size={48} />
                                  <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="font-medium">{video.title}</h3>
                                  </div>
                                </div>
                              ) : (
                                // YouTube video thumbnail
                                <>
                                  <iframe
                                    src={getYoutubeEmbedUrl(video.url)}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full pointer-events-none"
                                  ></iframe>
                                  <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="bg-white/20 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Play size={32} className="text-white" />
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center">
                              <div className="text-center p-4">
                                <Play className="mx-auto text-gray-400 mb-2" size={32} />
                                <p className="text-gray-600 font-medium">{video.title}</p>
                                {!isEnrolled() && !isMentor() && (
                                  <p className="text-sm text-gray-500 mt-1">Enroll to watch this video</p>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="p-4 bg-gray-50">
                            <h3 className="font-medium text-gray-800">{video.title}</h3>
                            {(isEnrolled() || isMentor()) && (
                              <button
                                onClick={() => {
                                  setSelectedVideo(video);
                                  setShowVideoModal(true);
                                }}
                                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
                              >
                                <Play size={14} className="mr-1" />
                                Watch Video
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Course Sections */}
              {course.sections && course.sections.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <List className="mr-2" size={24} />
                      Course Content
                    </h2>

                    <div className="space-y-4">
                      {course.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection(sectionIndex)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 text-left"
                          >
                            <h3 className="font-medium text-gray-800">{section.title}</h3>
                            {expandedSections[sectionIndex] ? (
                              <ChevronUp size={18} className="text-gray-500" />
                            ) : (
                              <ChevronDown size={18} className="text-gray-500" />
                            )}
                          </button>

                          {expandedSections[sectionIndex] && (
                            <div className="p-4 space-y-3">
                              {section.content.map((content, contentIndex) => (
                                <div key={contentIndex} className="flex items-start p-2 hover:bg-gray-50 rounded">
                                  {content.type === "uploaded" || !isYoutubeUrl(content.url) ? (
                                    <Film size={18} className="text-indigo-600 mr-3 mt-0.5" />
                                  ) : content.type === "video" ? (
                                    <Play size={18} className="text-red-500 mr-3 mt-0.5" />
                                  ) : (
                                    <Video size={18} className="text-red-500 mr-3 mt-0.5" />
                                  )}

                                  <div>
                                    <h4 className="font-medium text-gray-800">{content.title}</h4>
                                    {(isEnrolled() || isMentor()) && (
                                      <button
                                        onClick={() => {
                                          setSelectedVideo(content);
                                          setShowVideoModal(true);
                                        }}
                                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
                                      >
                                        <Play size={14} className="mr-1" />
                                        Watch Video
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              {/* Course Materials */}
              {course.materials && course.materials.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FileText className="mr-2" size={20} />
                      Course Materials
                    </h2>

                    <div className="space-y-3">
                      {course.materials.map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <FileText size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-800">{material.name}</span>
                          </div>

                          {(isEnrolled() || isMentor()) ? (
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition"
                              download
                            >
                              <Download size={16} />
                            </a>
                          ) : (
                            <span className="text-xs text-gray-500">Enroll to access</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mentor Info */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <User className="mr-2" size={20} />
                    About the Mentor
                  </h2>

                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
                      {course.mentor.profile ? (
                        <img
                          src={course.mentor.profile}
                          alt={course.mentor.fullname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <User size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{course.mentor.fullname}</h3>
                      <p className="text-sm text-gray-500">@{course.mentor.username}</p>
                    </div>
                  </div>

                  {course.mentor.expertise && course.mentor.expertise.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.mentor.expertise.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full capitalize"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {course.mentor.experience && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Experience</h4>
                      <p className="text-sm text-gray-600">{course.mentor.experience} years</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
