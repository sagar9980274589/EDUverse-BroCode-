import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Lightbulb, Code, GraduationCap, User } from 'lucide-react';

const SidebarLeft = ({ user, activeTab, setActiveTab }) => {
  return (
    <div className="w-64 hidden lg:block">
      <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            {user.profile ? (
              <img
                src={user.profile}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={24} className="text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{user.username}</h3>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg ${
              activeTab === "all"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <BookOpen size={18} />
            <span>All Posts</span>
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg ${
              activeTab === "following"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Users size={18} />
            <span>Following</span>
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg ${
              activeTab === "projects"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Code size={18} />
            <span>Projects</span>
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg ${
              activeTab === "skills"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Award size={18} />
            <span>Skills</span>
          </button>
        </div>

        <div className="border-t border-gray-100 my-6 pt-6">
          <h4 className="font-medium text-gray-800 mb-3">Education</h4>
          <div className="space-y-2">
            <Link
              to="/edu/courses"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <GraduationCap size={18} />
              <span>Courses</span>
            </Link>
            <Link
              to="/edu/mentors"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Lightbulb size={18} />
              <span>Mentors</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
