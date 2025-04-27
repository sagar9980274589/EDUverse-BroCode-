import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { 
  User, 
  Mail, 
  BookOpen, 
  Calendar, 
  Award, 
  Star, 
  ChevronLeft,
  AlertCircle,
  ExternalLink
} from "lucide-react";

const MentorProfilePage = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        
        // Fetch mentor profile
        const mentorResponse = await axios.get(`http://localhost:3000/user/${mentorId}`);
        
        if (mentorResponse.status === 200 && mentorResponse.data.success) {
          setMentor(mentorResponse.data.user);
          
          // Fetch mentor's courses
          const coursesResponse = await axios.get(`http://localhost:3000/course/mentor/${mentorId}`);
          
          if (coursesResponse.status === 200) {
            // Only include published courses
            const publishedCourses = coursesResponse.data.courses.filter(course => course.isPublished);
            setCourses(publishedCourses);
          }
        } else {
          setError("Failed to load mentor profile");
        }
      } catch (error) {
        console.error("Error fetching mentor data:", error);
        setError("Failed to load mentor profile. Please try again.");
        toast.error("Failed to load mentor profile");
      } finally {
        setLoading(false);
      }
    };

    if (mentorId) {
      fetchMentorData();
    }
  }, [mentorId]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading mentor profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !mentor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 px-4 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Mentor Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The mentor profile you're looking for doesn't exist or has been removed."}</p>
            <Link
              to="/edu/mentors"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ChevronLeft className="mr-2" size={16} />
              Back to Mentors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              to="/edu/mentors"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <ChevronLeft size={18} className="mr-1" />
              Back to Mentors
            </Link>
          </div>
          
          {/* Mentor Profile Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="md:flex">
              {/* Mentor Image */}
              <div className="md:w-1/3 h-64 md:h-auto">
                {mentor.profile ? (
                  <img 
                    src={mentor.profile} 
                    alt={mentor.fullname} 
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                    <User className="text-indigo-300" size={64} />
                  </div>
                )}
              </div>
              
              {/* Mentor Info */}
              <div className="md:w-2/3 p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {mentor.fullname}
                </h1>
                
                <p className="text-gray-500 mb-4">@{mentor.username}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.expertise && mentor.expertise.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full capitalize"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6">
                  {mentor.bio || "Experienced mentor passionate about teaching and sharing knowledge."}
                </p>
                
                {/* Mentor Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {mentor.experience && (
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                      <Award className="text-indigo-500 mb-1" size={20} />
                      <span className="font-bold text-gray-800">{mentor.experience} years</span>
                      <span className="text-gray-500">Experience</span>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <BookOpen className="text-indigo-500 mb-1" size={20} />
                    <span className="font-bold text-gray-800">{courses.length}</span>
                    <span className="text-gray-500">Courses</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="text-indigo-500 mb-1" size={20} />
                    <span className="font-bold text-gray-800">{formatDate(mentor.createdAt)}</span>
                    <span className="text-gray-500">Joined</span>
                  </div>
                  
                  {mentor.email && (
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                      <Mail className="text-indigo-500 mb-1" size={20} />
                      <a 
                        href={`mailto:${mentor.email}`}
                        className="font-bold text-indigo-600 hover:text-indigo-800 truncate max-w-full"
                      >
                        Contact
                      </a>
                      <span className="text-gray-500">Email</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mentor Courses */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Courses by {mentor.fullname}</h2>
            
            {courses.length === 0 ? (
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <BookOpen className="mx-auto text-gray-300 mb-3" size={48} />
                <h3 className="text-lg font-medium text-gray-800 mb-1">No Courses Available</h3>
                <p className="text-gray-600">
                  This mentor hasn't published any courses yet. Check back later!
                </p>
              </div>
            ) : (
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
                          <User size={14} className="text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{course.enrolledStudents?.length || 0} students</span>
                        </div>
                        
                        {course.averageRating > 0 && (
                          <div className="flex items-center">
                            <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-sm text-gray-600">{course.averageRating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      
                      <Link 
                        to={`/edu/course/${course._id}`}
                        className="mt-3 inline-block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfilePage;
