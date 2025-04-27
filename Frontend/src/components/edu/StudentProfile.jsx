import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  User,
  Pencil,
  BookOpen,
  Award,
  Users,
  Briefcase,
  GraduationCap,
  Plus,
  X,
  Check,
  Mail,
  MessageSquare,
  Github
} from 'lucide-react';
import Navbar from './Navbar';
import GitHubConnect from './GitHubConnect';

const StudentProfile = () => {
  const user = useSelector((state) => state.data.userdata);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [connections, setConnections] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  const [educationInput, setEducationInput] = useState('');
  const [education, setEducation] = useState([]);
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Get profile data
        const response = await axios.get('http://localhost:3000/user/getprofile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          const userData = response.data.user;
          setProfileData(userData);
          setBio(userData.bio || '');
          setSkills(userData.interests || []);

          // Format education level into an array for display
          if (userData.educationLevel) {
            setEducation([userData.educationLevel]);
          }

          // Fetch enrolled courses
          if (userData.enrolledCourses && userData.enrolledCourses.length > 0) {
            try {
              const coursesResponse = await axios.get('http://localhost:3000/course/my-enrolled-courses', {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              });

              if (coursesResponse.data.success) {
                setEnrolledCourses(coursesResponse.data.courses);
              }
            } catch (error) {
              console.error('Error fetching enrolled courses:', error);
            }
          }

          // Fetch connections (following/followers)
          if (userData.following || userData.followers) {
            setConnections({
              following: userData.following || [],
              followers: userData.followers || []
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) {
      fetchProfileData();
    }
  }, [user]);

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add skill
  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  // Add education
  const addEducation = () => {
    if (educationInput.trim() && !education.includes(educationInput.trim())) {
      setEducation([...education, educationInput.trim()]);
      setEducationInput('');
    }
  };

  // Remove education
  const removeEducation = (eduToRemove) => {
    setEducation(education.filter(edu => edu !== eduToRemove));
  };

  // Save profile changes
  const saveProfile = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('bio', bio);
      formData.append('interests', JSON.stringify(skills));
      formData.append('educationLevel', education[0] || '');

      if (profileImage) {
        formData.append('profile', profileImage);
      }

      const response = await axios.post('http://localhost:3000/user/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        toast.success('Profile updated successfully');
        setEditMode(false);

        // Refresh profile data
        const updatedResponse = await axios.get('http://localhost:3000/user/getprofile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (updatedResponse.data.success) {
          setProfileData(updatedResponse.data.user);
        }
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditMode(false);
    setBio(profileData.bio || '');
    setSkills(profileData.interests || []);
    setEducation(profileData.educationLevel ? [profileData.educationLevel] : []);
    setPreviewImage(null);
    setProfileImage(null);
  };

  if (loading && !profileData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 px-4 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
              {/* Edit Button */}
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                >
                  <Pencil size={18} className="text-indigo-600" />
                </button>
              ) : (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={cancelEdit}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                  >
                    <X size={18} className="text-red-600" />
                  </button>
                  <button
                    onClick={saveProfile}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                  >
                    <Check size={18} className="text-green-600" />
                  </button>
                </div>
              )}

              {/* Profile Image */}
              <div className="absolute -bottom-16 left-8">
                <div className="relative w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                  {editMode ? (
                    <>
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={profileData.profile || "https://ui-avatars.com/api/?name=" + (profileData.username || "User") + "&background=random&size=150"}
                          alt={profileData.username || 'User'}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer">
                        <Pencil size={24} className="text-white" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </>
                  ) : (
                    <img
                      src={profileData.profile || "https://ui-avatars.com/api/?name=" + (profileData.username || "User") + "&background=random&size=150"}
                      alt={profileData.username || 'User'}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="pt-16 pb-8 px-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {profileData.fullname || profileData.username}
                  </h1>
                  <p className="text-gray-600">@{profileData.username}</p>

                  {/* User Type Badge */}
                  {profileData.userType && (
                    <span className="mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {profileData.userType.charAt(0).toUpperCase() + profileData.userType.slice(1)}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-4 md:mt-0 flex space-x-4">
                  <div className="text-center">
                    <p className="text-xl font-semibold text-gray-800">{enrolledCourses.length}</p>
                    <p className="text-sm text-gray-600">Courses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-semibold text-gray-800">{connections.following?.length || 0}</p>
                    <p className="text-sm text-gray-600">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-semibold text-gray-800">{connections.followers?.length || 0}</p>
                    <p className="text-sm text-gray-600">Followers</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">About</h2>
                {editMode ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows="3"
                    placeholder="Tell others about yourself..."
                  />
                ) : (
                  <p className="text-gray-600">
                    {profileData.bio || "No bio available"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Skills & Education Section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Award className="mr-2 text-indigo-600" size={20} />
                  Skills & Interests
                </h2>
              </div>

              {editMode && (
                <div className="mb-4 flex">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <div
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        editMode
                          ? "bg-indigo-100 text-indigo-800 pr-1"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {skill}
                      {editMode && (
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-1 text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No skills added yet</p>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <GraduationCap className="mr-2 text-indigo-600" size={20} />
                  Education
                </h2>
              </div>

              {editMode && (
                <div className="mb-4 flex">
                  <input
                    type="text"
                    value={educationInput}
                    onChange={(e) => setEducationInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Add education..."
                    onKeyPress={(e) => e.key === 'Enter' && addEducation()}
                  />
                  <button
                    onClick={addEducation}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {education.length > 0 ? (
                  education.map((edu, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <GraduationCap size={20} className="text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{edu}</p>
                        </div>
                      </div>
                      {editMode && (
                        <button
                          onClick={() => removeEducation(edu)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No education added yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Enrolled Courses Section */}
          <div className="mt-6 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <BookOpen className="mr-2 text-indigo-600" size={20} />
                Enrolled Courses
              </h2>
              <Link
                to="/edu/courses"
                className="text-sm text-indigo-600 hover:text-indigo-800 transition"
              >
                Browse more courses
              </Link>
            </div>

            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrolledCourses.map((course) => (
                  <Link
                    key={course._id}
                    to={`/edu/course/${course._id}`}
                    className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                  >
                    <div className="h-32 bg-gray-200 relative">
                      {course.image ? (
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                          <BookOpen className="text-indigo-300" size={32} />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">{course.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen size={48} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">You haven't enrolled in any courses yet</p>
                <Link
                  to="/edu/courses"
                  className="mt-2 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Explore Courses
                </Link>
              </div>
            )}
          </div>

          {/* GitHub Projects Section */}
          <div className="mt-6">
            <GitHubConnect />
          </div>

          {/* Connections Section */}
          <div className="mt-6 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Users className="mr-2 text-indigo-600" size={20} />
                Connections
              </h2>
              <Link
                to="/edu/mentors"
                className="text-sm text-indigo-600 hover:text-indigo-800 transition"
              >
                Find mentors
              </Link>
            </div>

            {(connections.following?.length > 0 || connections.followers?.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Following */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">Following</h3>
                  {connections.following?.length > 0 ? (
                    <div className="space-y-3">
                      {connections.following.slice(0, 5).map((follow, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                            {follow.profile ? (
                              <img
                                src={follow.profile}
                                alt={follow.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User size={20} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{follow.fullname || follow.username}</p>
                            <p className="text-xs text-gray-500">@{follow.username}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-1 text-indigo-600 hover:text-indigo-800 transition">
                              <Mail size={16} />
                            </button>
                            <button className="p-1 text-indigo-600 hover:text-indigo-800 transition">
                              <MessageSquare size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Not following anyone yet</p>
                  )}
                </div>

                {/* Followers */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">Followers</h3>
                  {connections.followers?.length > 0 ? (
                    <div className="space-y-3">
                      {connections.followers.slice(0, 5).map((follower, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                            {follower.profile ? (
                              <img
                                src={follower.profile}
                                alt={follower.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User size={20} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{follower.fullname || follower.username}</p>
                            <p className="text-xs text-gray-500">@{follower.username}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-1 text-indigo-600 hover:text-indigo-800 transition">
                              <Mail size={16} />
                            </button>
                            <button className="p-1 text-indigo-600 hover:text-indigo-800 transition">
                              <MessageSquare size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No followers yet</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">Connect with mentors and other students</p>
                <Link
                  to="/edu/mentors"
                  className="mt-2 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Find Mentors
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
