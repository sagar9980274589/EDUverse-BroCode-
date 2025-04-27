import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { setuser } from "../../UserSlice";
import Navbar from "./Navbar";
import { User, Mail, BookOpen, Award, DollarSign, Save, Camera } from "lucide-react";

const ProfileSettings = () => {
  const user = useSelector((state) => state.data.userdata);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    bio: "",
    // Mentor-specific fields
    expertise: [],
    experience: "",
    qualifications: "",
    hourlyRate: "",
    // Student-specific fields
    interests: [],
    educationLevel: "",
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user && user._id) {
      setFormData({
        fullname: user.fullname || "",
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        expertise: user.expertise || [],
        experience: user.experience || "",
        qualifications: user.qualifications || "",
        hourlyRate: user.hourlyRate || "",
        interests: user.interests || [],
        educationLevel: user.educationLevel || "",
      });

      if (user.profile) {
        setPreviewImage(user.profile);
      }
    } else {
      // Redirect to login if not logged in
      navigate("/edu/login");
    }
  }, [user, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle checkbox changes for arrays (expertise, interests)
  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value],
      });
    } else {
      setFormData({
        ...formData,
        [field]: formData[field].filter((item) => item !== value),
      });
    }
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create form data for multipart/form-data (for image upload)
      const data = new FormData();
      
      // Add profile image if selected
      if (profileImage) {
        data.append("profile", profileImage);
      }
      
      // Add other form fields
      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key])) {
          // Handle arrays (expertise, interests)
          formData[key].forEach((value) => {
            data.append(key, value);
          });
        } else {
          data.append(key, formData[key]);
        }
      });

      // Get token from localStorage
      const token = localStorage.getItem("token");
      
      // Make API request to update profile
      const response = await axios.post(
        "http://localhost:3000/user/editprofile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // Update user data in Redux
        const updatedUser = response.data.user || user;
        dispatch(setuser(updatedUser));
        
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "An error occurred while updating your profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-indigo-100">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <User size={64} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor="profile-image" 
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition"
                  >
                    <Camera size={16} />
                  </label>
                  <input 
                    type="file" 
                    id="profile-image" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Click the camera icon to change your profile picture</p>
              </div>
              
              {/* Basic Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="mr-2" size={20} />
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-2" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                        disabled
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                  </div>
                </div>
              </div>
              
              {/* Mentor-specific fields */}
              {user.userType === "mentor" && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <BookOpen className="mr-2" size={20} />
                    Mentor Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">
                        Qualifications
                      </label>
                      <input
                        type="text"
                        id="qualifications"
                        name="qualifications"
                        value={formData.qualifications}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., MSc Computer Science, Certified Teacher"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select years of experience</option>
                        <option value="0-1">Less than 1 year</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">More than 10 years</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                        Hourly Rate (USD)
                      </label>
                      <div className="flex items-center">
                        <DollarSign size={16} className="text-gray-400 mr-2" />
                        <input
                          type="number"
                          id="hourlyRate"
                          name="hourlyRate"
                          value={formData.hourlyRate}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="25"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Areas of Expertise
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {["Programming", "Design", "Business", "Marketing", "Science", "Languages"].map((area) => (
                          <div key={area} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`expertise-${area.toLowerCase()}`}
                              value={area.toLowerCase()}
                              checked={formData.expertise.includes(area.toLowerCase())}
                              onChange={(e) => handleCheckboxChange(e, "expertise")}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`expertise-${area.toLowerCase()}`} className="ml-2 block text-sm text-gray-700">
                              {area}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Student-specific fields */}
              {user.userType === "student" && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Award className="mr-2" size={20} />
                    Student Information
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1">
                        Education Level
                      </label>
                      <select
                        id="educationLevel"
                        name="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select your education level</option>
                        <option value="high_school">High School</option>
                        <option value="undergraduate">Undergraduate</option>
                        <option value="graduate">Graduate</option>
                        <option value="postgraduate">Postgraduate</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interests
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {["Programming", "Design", "Business", "Marketing", "Science", "Languages"].map((interest) => (
                          <div key={interest} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`interest-${interest.toLowerCase()}`}
                              value={interest.toLowerCase()}
                              checked={formData.interests.includes(interest.toLowerCase())}
                              onChange={(e) => handleCheckboxChange(e, "interests")}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`interest-${interest.toLowerCase()}`} className="ml-2 block text-sm text-gray-700">
                              {interest}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
