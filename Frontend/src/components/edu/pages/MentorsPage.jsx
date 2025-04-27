import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { 
  Search, 
  User, 
  BookOpen, 
  Star, 
  Filter,
  ChevronDown,
  AlertCircle
} from "lucide-react";

const MentorsPage = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch all mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (expertiseFilter) params.append('expertise', expertiseFilter);
        if (experienceFilter) params.append('experience', experienceFilter);
        if (searchTerm) params.append('search', searchTerm);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        
        const response = await axios.get(`http://localhost:3000/user/mentors${queryString}`);
        
        if (response.status === 200) {
          setMentors(response.data.mentors || []);
        }
      } catch (error) {
        console.error("Error fetching mentors:", error);
        toast.error("Failed to load mentors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [expertiseFilter, experienceFilter, searchTerm]);

  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already triggered by the useEffect dependency
  };

  // Reset all filters
  const resetFilters = () => {
    setExpertiseFilter("");
    setExperienceFilter("");
    setSearchTerm("");
  };
  
  // Get expertise options
  const expertiseOptions = [
    "Programming",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "UI/UX Design",
    "Graphic Design",
    "Digital Marketing",
    "Business",
    "Finance",
    "Language Learning",
    "Music",
    "Photography",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <User className="mr-3 text-indigo-600" size={28} />
                Our Mentors
              </h1>
              <p className="text-gray-600 mt-1">
                Learn from experienced professionals in various fields
              </p>
            </div>
            
            <Link
              to="/edu/signup"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Become a Mentor
            </Link>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search mentors by name or expertise..."
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-1">
                    Expertise
                  </label>
                  <select
                    id="expertise"
                    value={expertiseFilter}
                    onChange={(e) => setExpertiseFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Expertise</option>
                    {expertiseOptions.map((expertise, index) => (
                      <option key={index} value={expertise.toLowerCase()}>
                        {expertise}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <select
                    id="experience"
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Experience Levels</option>
                    <option value="1">1+ years</option>
                    <option value="3">3+ years</option>
                    <option value="5">5+ years</option>
                    <option value="10">10+ years</option>
                  </select>
                </div>
                
                <div className="md:col-span-2 flex justify-end">
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
              <p className="mt-4 text-gray-600">Loading mentors...</p>
            </div>
          )}
          
          {/* No Results */}
          {!loading && mentors.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm || expertiseFilter || experienceFilter 
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "There are no mentors available at the moment. Please check back later."}
              </p>
              
              {(searchTerm || expertiseFilter || experienceFilter) && (
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
          
          {/* Mentors Grid */}
          {!loading && mentors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map(mentor => (
                <div key={mentor._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition">
                  {/* Mentor Image */}
                  <div className="h-48 bg-gray-200 relative flex items-center justify-center">
                    {mentor.profile ? (
                      <img 
                        src={mentor.profile} 
                        alt={mentor.fullname} 
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="text-indigo-300" size={48} />
                      </div>
                    )}
                  </div>
                  
                  {/* Mentor Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {mentor.fullname}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {mentor.bio || "Experienced mentor passionate about teaching and sharing knowledge."}
                    </p>
                    
                    {/* Expertise Tags */}
                    {mentor.expertise && mentor.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {mentor.expertise.slice(0, 3).map((skill, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full capitalize"
                          >
                            {skill}
                          </span>
                        ))}
                        {mentor.expertise.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                            +{mentor.expertise.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      {/* Experience */}
                      {mentor.experience && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{mentor.experience}</span> years experience
                        </div>
                      )}
                      
                      {/* Courses Count */}
                      {mentor.courses && (
                        <div className="flex items-center text-sm text-gray-600">
                          <BookOpen size={14} className="mr-1" />
                          <span>{mentor.courses.length} courses</span>
                        </div>
                      )}
                    </div>
                    
                    {/* View Profile Button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        to={`/edu/mentor/${mentor._id}`}
                        className="w-full block text-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                      >
                        View Profile
                      </Link>
                    </div>
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

export default MentorsPage;
