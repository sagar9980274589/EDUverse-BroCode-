import React, { useState, useEffect } from "react";
import { Menu, X, Search, BookOpen, ChevronDown, User, Code } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setuser } from "../../../UserSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get user data from Redux store
  const user = useSelector((state) => state.data.userdata);
  const isLoggedIn = user && user._id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/edu/courses?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  // Debug user data
  useEffect(() => {
    if (isLoggedIn) {
      console.log("User data in Navbar:", user);
      console.log("Profile image URL:", user.profile);
    }
  }, [user, isLoggedIn]);

  // Function to get a valid profile image URL
  const getProfileImageUrl = () => {
    if (!user || !user.profile) {
      return null;
    }

    // If the profile is already a valid URL, return it
    if (user.profile.startsWith('http://') || user.profile.startsWith('https://')) {
      return user.profile;
    }

    // If it's a relative path, make it absolute
    if (user.profile.startsWith('/')) {
      return `http://localhost:3000${user.profile}`;
    }

    // Otherwise, return as is
    return user.profile;
  };

  // Handle logout
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");

    // Clear persisted Redux state
    localStorage.removeItem("persist:root");

    // Reset user in Redux state
    dispatch(setuser({}));

    // Redirect to edu path
    navigate("/edu");
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user menu if clicking outside
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }

      // Close categories dropdown if clicking outside
      if (dropdownOpen && !event.target.closest('.categories-dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen, dropdownOpen]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white text-gray-800 shadow-md"
          : "bg-gradient-to-b from-black/50 to-transparent backdrop-blur-[2px] text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold tracking-tight flex items-center">
            <BookOpen className="mr-2" size={28} />
            <Link to="/edu" className="flex items-center">
              <span className="text-indigo-600 font-extrabold">EDU</span>
              <span className={isScrolled ? "text-gray-800" : "text-white"}>verse</span>
            </Link>
          </div>

          {/* Desktop Menu - Simplified with Dropdowns */}
          <div className="hidden md:flex space-x-4 items-center">
            {/* Primary Navigation - Always visible */}
            <div className="flex space-x-1">
              <Link to="/edu" className={`px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-indigo-500 transition font-medium ${isScrolled ? "text-gray-700" : "text-white"}`}>
                Home
              </Link>

              <Link to="/edu/courses" className={`px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-indigo-500 transition font-medium ${isScrolled ? "text-gray-700" : "text-white"}`}>
                Courses
              </Link>

              <Link to="/edu/mentors" className={`px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-indigo-500 transition font-medium ${isScrolled ? "text-gray-700" : "text-white"}`}>
                Mentors
              </Link>

              <Link to="/edu/social" className={`px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-indigo-500 transition font-medium ${isScrolled ? "text-gray-700" : "text-white"}`}>
                Social
              </Link>

              <Link to="/edu/coding" className={`px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-indigo-500 transition font-medium ${isScrolled ? "text-gray-700" : "text-white"} flex items-center`}>
                <Code size={16} className="mr-1" />
                Coding
              </Link>

              <Link to="/edu/about" className={`px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-indigo-500 transition font-medium ${isScrolled ? "text-gray-700" : "text-white"}`}>
                About
              </Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className={`relative rounded-full overflow-hidden transition-all ${isScrolled ? "bg-gray-100" : "bg-white/30"}`}>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`py-2 pl-10 pr-4 w-40 focus:w-64 transition-all outline-none ${
                  isScrolled
                    ? "bg-gray-100 text-gray-800 placeholder:text-gray-500"
                    : "bg-white/30 text-white placeholder:text-white/80"
                }`}
              />
              <Search size={18} className={`absolute left-3 top-2.5 ${isScrolled ? "text-gray-500" : "text-white"}`} />
              <button
                type="submit"
                className="absolute right-3 top-2.5 focus:outline-none"
                aria-label="Search"
              >
                {/* <Search size={16} className={`${isScrolled ? "text-indigo-500" : "text-white"}`} /> */}
              </button>
            </form>
          </div>

          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3 relative user-menu-container">
                {/* User Type Badge */}
                {user.userType && (
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    isScrolled
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-indigo-800/40 text-white"
                  }`}>
                    {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                  </span>
                )}

                {/* User Profile Button with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    {/* Username */}
                    <span className={`font-medium hover:text-indigo-500 transition ${isScrolled ? "text-gray-800" : "text-white"}`}>
                      {user.username || user.fullname || "User"}
                    </span>

                    {/* User Profile Image */}
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-white border-2 border-indigo-500">
                      {user.profile ? (
                        <img
                          src={getProfileImageUrl()}
                          alt={user.username || 'User'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log("Image failed to load:", e);
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = "https://ui-avatars.com/api/?name=" + (user.username || "User") + "&background=random";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <User size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    <ChevronDown size={16} className={isScrolled ? "text-gray-600" : "text-white"} />
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                      <Link
                        to="/edu/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>

                      <Link
                        to="/edu/my-courses"
                        className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Courses
                      </Link>

                      <Link
                        to="/edu/coding"
                        className="px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600 flex items-center"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Code size={16} className="mr-2 text-indigo-600" />
                        Coding Challenges
                      </Link>

                      {user.userType === 'mentor' && (
                        <Link
                          to="/edu/create-course"
                          className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Create Course
                        </Link>
                      )}

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/edu/login"
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    isScrolled
                      ? "text-indigo-600 border border-indigo-600 hover:bg-indigo-50"
                      : "text-white border border-white hover:bg-white/10"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/edu/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${isScrolled ? "text-gray-800" : "text-white"}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden px-4 pb-6 pt-2 space-y-3 ${
          isScrolled
            ? "bg-white text-gray-800"
            : "bg-indigo-900/95 text-white"
        }`}>
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full py-2 pl-10 pr-10 rounded-lg ${
                isScrolled
                  ? "bg-gray-100 text-gray-800 placeholder:text-gray-500"
                  : "bg-indigo-800/50 text-white placeholder:text-white/80"
              }`}
            />
            <Search size={18} className={`absolute left-3 top-2.5 ${isScrolled ? "text-gray-500" : "text-white/80"}`} />
            <button
              type="submit"
              className="absolute right-3 top-2.5 focus:outline-none"
              aria-label="Search"
            >
              <Search size={16} className={`${isScrolled ? "text-indigo-500" : "text-white/80"}`} />
            </button>
          </form>

          {/* Main Navigation Links */}
          <div className="space-y-2 border-b border-gray-200 pb-3">
            <Link to="/edu" className="block py-2 font-medium">
              Home
            </Link>

            <Link to="/edu/courses" className="block py-2 font-medium">
              Courses
            </Link>

            <Link to="/edu/mentors" className="block py-2 font-medium">
              Mentors
            </Link>

            <Link to="/edu/social" className="block py-2 font-medium">
              Social Hub
            </Link>

            <Link to="/edu/coding" className="py-2 font-medium flex items-center">
              <Code size={16} className="mr-2" />
              Coding Challenges
            </Link>

            <Link to="/edu/about" className="block py-2 font-medium">
              About
            </Link>
          </div>

          {/* User-specific Links (only shown when logged in) */}
          {isLoggedIn && (
            <div className="space-y-2 border-b border-gray-200 pb-3">
              <Link to="/edu/profile" className="block py-2 font-medium">
                My Profile
              </Link>

              <Link to="/edu/my-courses" className="block py-2 font-medium">
                My Courses
              </Link>

              <Link to="/edu/coding" className="py-2 font-medium flex items-center">
                <Code size={18} className="mr-2 text-indigo-600" />
                Coding Challenges
              </Link>

              {user.userType === 'mentor' && (
                <Link to="/edu/create-course" className="block py-2 font-medium">
                  Create Course
                </Link>
              )}
            </div>
          )}

          {/* User Profile or Auth Buttons */}
          <div className="pt-2 flex flex-col space-y-3">
            {isLoggedIn ? (
              <>
                {/* User Profile Card */}
                <div className={`px-4 py-3 rounded-lg ${
                  isScrolled ? "bg-gray-100" : "bg-indigo-800/50"
                }`}>
                  <div className="flex items-center">
                    {/* User Profile Image */}
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white mr-3 border-2 border-indigo-500">
                      {user.profile ? (
                        <img
                          src={getProfileImageUrl()}
                          alt={user.username || 'User'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log("Mobile image failed to load:", e);
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = "https://ui-avatars.com/api/?name=" + (user.username || "User") + "&background=random&size=150";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <User size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div>
                      <div className="font-bold text-lg">
                        {user.fullname || user.username}
                      </div>
                      {user.username && <p className="text-sm opacity-75">@{user.username}</p>}
                      {user.userType && (
                        <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                          isScrolled ? "bg-indigo-100 text-indigo-800" : "bg-indigo-700/60 text-white"
                        }`}>
                          {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded-lg font-semibold text-center ${
                    isScrolled
                      ? "text-red-600 border border-red-600"
                      : "text-white border border-red-400 bg-red-500/20"
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login/Signup Buttons */}
                <Link
                  to="/edu/login"
                  className={`px-4 py-2 rounded-lg font-semibold text-center ${
                    isScrolled
                      ? "text-indigo-600 border border-indigo-600"
                      : "text-white border border-white"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/edu/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
