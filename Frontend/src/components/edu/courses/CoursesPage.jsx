import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import {
  BookOpen,
  Search,
  Filter,
  User,
  Star,
  ChevronDown,
  AlertCircle,
  BookOpenCheck
} from "lucide-react";

const CoursesPage = () => {
  const user = useSelector((state) => state.data.userdata);
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Extract search parameters from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get('search');
    const categoryParam = queryParams.get('category');
    const levelParam = queryParams.get('level');

    if (searchParam) setSearchTerm(searchParam);
    if (categoryParam) setCategoryFilter(categoryParam);
    if (levelParam) setLevelFilter(levelParam);
  }, [location.search]);

  // Fetch all published courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        // Build query parameters
        const params = new URLSearchParams();
        if (categoryFilter) params.append('category', categoryFilter);
        if (levelFilter) params.append('level', levelFilter);
        if (searchTerm) params.append('search', searchTerm);

        const queryString = params.toString() ? `?${params.toString()}` : '';

        const response = await axios.get(`http://localhost:3000/course${queryString}`);

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
  }, [categoryFilter, levelFilter, searchTerm]);

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already triggered by the useEffect dependency
  };

  // Reset all filters
  const resetFilters = () => {
    setCategoryFilter("");
    setLevelFilter("");
    setSearchTerm("");
  };

  // Check if a course is in the user's enrolled courses
  const isEnrolled = (courseId) => {
    if (!user || !user.enrolledCourses) return false;
    return user.enrolledCourses.includes(courseId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <BookOpen className="mr-3 text-indigo-600" size={28} />
                Explore Courses
              </h1>
              <p className="text-gray-600 mt-1">
                Discover courses from our talented mentors
              </p>
            </div>

            {user && user.userType === "student" && (
              <Link
                to="/edu/my-courses"
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none"
              >
                <BookOpenCheck className="mr-2" size={16} />
                My Enrolled Courses
              </Link>
            )}
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />

                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-3 top-2 p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                >
                  <Filter size={18} />
                </button>
              </div>
            </form>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Categories</option>
                    <option value="programming">Programming</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                    <option value="personal">Personal Development</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    id="level"
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all">All Levels</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-indigo-600"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading courses...</p>
            </div>
          )}

          {/* No Results */}
          {!loading && courses.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm || categoryFilter || levelFilter
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "There are no published courses available at the moment. Please check back later."}
              </p>

              {(searchTerm || categoryFilter || levelFilter) && (
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Course Grid */}
          {!loading && courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition">
                  {/* Course Image */}
                  <Link to={`/edu/course/${course._id}`} className="block h-40 bg-gray-200 relative">
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

                    {/* Price Badge */}
                    <div className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium bg-white shadow-sm">
                      {course.isFree
                        ? <span className="text-green-600">Free</span>
                        : <span className="text-indigo-600">${course.price.toFixed(2)}</span>
                      }
                    </div>
                  </Link>

                  {/* Course Info */}
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full capitalize">
                        {course.category}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full capitalize">
                        {course.level}
                      </span>
                    </div>

                    <Link to={`/edu/course/${course._id}`}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-indigo-600 transition line-clamp-1">
                        {course.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2">
                          {course.mentor.profile ? (
                            <img
                              src={course.mentor.profile}
                              alt={course.mentor.fullname}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <User size={16} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{course.mentor.fullname}</span>
                      </div>

                      {course.averageRating > 0 && (
                        <div className="flex items-center">
                          <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">{course.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Enrollment Status */}
                    {isEnrolled(course._id) && (
                      <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                        <span className="text-sm text-green-600 font-medium">
                          You are enrolled in this course
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
