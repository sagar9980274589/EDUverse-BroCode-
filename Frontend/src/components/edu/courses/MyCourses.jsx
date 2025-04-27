import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../../AxiosInstance";
import { toast } from "react-toastify";
import Navbar from "../layout/Navbar";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Eye,
  AlertCircle,
  BookOpenCheck
} from "lucide-react";

const MyCourses = () => {
  const user = useSelector((state) => state.data.userdata);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, published, draft
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [publishingCourse, setPublishingCourse] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    if (!user || !user._id) {
      navigate("/edu/login");
    }
  }, [user, navigate]);

  // Fetch user's courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user || !user._id) return;

      try {
        setLoading(true);

        // Different endpoints for mentors and students
        const endpoint = user.userType === "mentor"
          ? `/course/mentor/${user._id}`
          : `/course/student/${user._id}`;

        // Use the API instance which already has the token in the headers
        const response = await api.get(endpoint);

        if (response.status === 200) {
          setCourses(response.data.courses || []);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  // Handle course deletion
  const handleDeleteCourse = async (courseId) => {
    try {
      // Use the API instance which already has the token in the headers
      const response = await api.delete(`/course/${courseId}`);

      if (response.status === 200) {
        setCourses(courses.filter(course => course._id !== courseId));
        toast.success("Course deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting course:", error);

      // Provide more specific error messages based on the error status
      if (error.response) {
        if (error.response.status === 403) {
          toast.error("You are not authorized to delete this course. Only the course creator can delete it.");
        } else if (error.response.status === 404) {
          toast.error("Course not found. It may have been already deleted.");
          // Remove the course from the local state if it's not found on the server
          setCourses(courses.filter(course => course._id !== courseId));
        } else {
          toast.error(error.response.data?.message || "Failed to delete course. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection and try again.");
      }
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Handle course publish/unpublish
  const handlePublishCourse = async (courseId) => {
    try {
      setPublishingCourse(courseId);

      console.log("Publishing course:", courseId);

      // Use the API instance which already has the token in the headers
      const response = await api.post(`/course/${courseId}/publish`, {});

      if (response.status === 200) {
        // Get the updated course from the response
        const updatedCourse = response.data.course;

        // Update the course in the local state
        setCourses(courses.map(course => {
          if (course._id === courseId) {
            const action = course.isPublished ? "unpublished" : "published";
            toast.success(`Course ${action} successfully`);
            return { ...course, isPublished: !course.isPublished };
          }
          return course;
        }));
      }
    } catch (error) {
      console.error("Error publishing course:", error);
      if (error.response?.status === 403) {
        toast.error("You are not authorized to publish this course. Only the course creator can publish it.");
      } else {
        toast.error(error.response?.data?.message || "Failed to update course status");
      }
    } finally {
      setPublishingCourse(null);
    }
  };

  // Filter courses based on search term and filter
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "published") return matchesSearch && course.isPublished;
    if (filter === "draft") return matchesSearch && !course.isPublished;

    return matchesSearch;
  });

  // Render empty state
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
        <BookOpen className="text-indigo-600" size={32} />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {user.userType === "mentor" ? "You haven't created any courses yet" : "You haven't enrolled in any courses yet"}
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        {user.userType === "mentor"
          ? "Start creating engaging courses for your students. Share your knowledge and expertise with the world."
          : "Explore our course catalog and enroll in courses to start learning new skills."}
      </p>
      {user.userType === "mentor" && (
        <Link
          to="/edu/create-course"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="mr-2" size={16} />
          Create Your First Course
        </Link>
      )}
      {user.userType === "student" && (
        <Link
          to="/edu/courses"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <BookOpenCheck className="mr-2" size={16} />
          Browse Courses
        </Link>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                {user.userType === "mentor" ? (
                  <>
                    <BookOpen className="mr-3 text-indigo-600" size={28} />
                    My Courses
                  </>
                ) : (
                  <>
                    <BookOpenCheck className="mr-3 text-indigo-600" size={28} />
                    My Enrolled Courses
                  </>
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                {user.userType === "mentor"
                  ? "Manage and create courses for your students"
                  : "Track your learning progress"}
              </p>
            </div>

            {user.userType === "mentor" && (
              <Link
                to="/edu/create-course"
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="mr-2" size={16} />
                Create New Course
              </Link>
            )}
          </div>

          {/* Search and Filter */}
          {courses.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="relative flex-grow max-w-md mb-4 md:mb-0">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    filter === "all"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {user.userType === "mentor" && (
                  <>
                    <button
                      onClick={() => setFilter("published")}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        filter === "published"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Published
                    </button>
                    <button
                      onClick={() => setFilter("draft")}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        filter === "draft"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Drafts
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading courses...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && courses.length === 0 && renderEmptyState()}

          {/* Course List */}
          {!loading && courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <div key={course._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition">
                  {/* Course Image */}
                  <div className="h-40 bg-gray-200 relative">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                        <BookOpen className="text-indigo-300" size={48} />
                      </div>
                    )}

                    {/* Status Badge */}
                    {user.userType === "mentor" && (
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                        course.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {course.isPublished ? "Published" : "Draft"}
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                      {course.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <div className="flex items-center mr-4">
                        <Users size={14} className="mr-1" />
                        <span>{course.enrolledStudents?.length || 0} students</span>
                      </div>

                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                          course.level === "beginner" ? "bg-green-500" :
                          course.level === "intermediate" ? "bg-yellow-500" :
                          "bg-red-500"
                        }`}></span>
                        <span className="capitalize">{course.level}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <Link
                        to={`/edu/course/${course._id}`}
                        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        <Eye size={16} className="mr-1" />
                        {user.userType === "mentor" ? "Preview" : "Continue Learning"}
                      </Link>

                      {user.userType === "mentor" && (
                        <div className="flex space-x-2">
                          <Link
                            to={`/edit-course/${course._id}`}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                            title="Edit Course"
                          >
                            <Edit size={16} />
                          </Link>

                          <button
                            onClick={() => handlePublishCourse(course._id)}
                            disabled={publishingCourse === course._id}
                            className={`p-1.5 rounded-full transition ${
                              publishingCourse === course._id
                                ? "text-gray-400"
                                : course.isPublished
                                  ? "text-green-500 hover:text-orange-500 hover:bg-orange-50"
                                  : "text-yellow-500 hover:text-green-600 hover:bg-green-50"
                            }`}
                            title={course.isPublished ? "Unpublish Course" : "Publish Course"}
                          >
                            {publishingCourse === course._id ? (
                              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                            ) : course.isPublished ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="12" y1="18" x2="12" y2="12"></line>
                                <line x1="9" y1="15" x2="15" y2="15"></line>
                              </svg>
                            )}
                          </button>

                          <button
                            onClick={() => setDeleteConfirm(course._id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                            title="Delete Course"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && courses.length > 0 && filteredCourses.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Course</h3>
              <p className="text-gray-500">
                Are you sure you want to delete this course? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCourse(deleteConfirm)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
