import React, { useState } from 'react';
import { Search, Upload, Users, Filter, BookOpen, Code, Briefcase, Lightbulb } from 'lucide-react';
import AdvancedSearch from './AdvancedSearch';

const SocialSearchBar = ({ onUserSelect, onFilterChange }) => {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Main Search Bar */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Search className="mr-2 text-indigo-600" size={20} />
            Find People & Content
          </h3>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
                showAdvancedSearch
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Filter size={14} className="mr-1.5" />
              Advanced Search
            </button>
          </div>
        </div>

        {/* Search Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts, projects, skills..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => {
                  if (onFilterChange) {
                    onFilterChange(e.target.value);
                  }
                }}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div className="col-span-1">
            <div className="grid grid-cols-2 gap-2">
              <button
                className="bg-indigo-600 text-white py-3 px-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
                onClick={() => setShowAdvancedSearch(true)}
              >
                <Users size={18} className="mr-2" />
                Find People
              </button>

              <button
                className="bg-gray-100 text-gray-700 py-3 px-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">Filter Content</h4>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
                  activeFilter === 'all'
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <BookOpen size={14} className="mr-1.5" />
                All Content
              </button>

              <button
                onClick={() => setActiveFilter('projects')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
                  activeFilter === 'projects'
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Briefcase size={14} className="mr-1.5" />
                Projects
              </button>

              <button
                onClick={() => setActiveFilter('skills')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
                  activeFilter === 'skills'
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Lightbulb size={14} className="mr-1.5" />
                Skills
              </button>

              <button
                onClick={() => setActiveFilter('coding')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
                  activeFilter === 'coding'
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Code size={14} className="mr-1.5" />
                Coding
              </button>
            </div>
          </div>
        )}

        {/* Advanced Search Panel */}
        {showAdvancedSearch && (
          <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700">Advanced People Search</h4>
              <button
                onClick={() => setShowAdvancedSearch(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h5 className="text-blue-800 font-medium mb-2 flex items-center">
                <Upload className="mr-2 text-blue-600" size={18} />
                Search by Face
              </h5>
              <p className="text-sm text-blue-700 mb-3">
                Upload a photo to find users using facial recognition technology.
              </p>

              <div className="flex justify-center">
                <label htmlFor="face-search-upload" className="cursor-pointer bg-white border border-blue-300 hover:bg-blue-50 text-blue-700 font-medium py-2 px-4 rounded-lg flex items-center transition-colors">
                  <Upload size={16} className="mr-2" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="face-search-upload"
                    onChange={(e) => {
                      // This will be handled by the AdvancedSearch component
                      // We're just making the button more prominent here
                    }}
                  />
                </label>
              </div>

              <div className="mt-2 text-xs text-blue-600 text-center">
                Your photo will only be used for this search and won't be stored.
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-gray-700 font-medium mb-2">Search by Name</h5>
              <p className="text-sm text-gray-600 mb-3">
                Enter a username or full name to find users.
              </p>
            </div>

            <AdvancedSearch
              onUserSelect={(user) => {
                if (onUserSelect) {
                  onUserSelect(user);
                }
                setShowAdvancedSearch(false);
              }}
            />

            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <h5 className="text-sm font-medium text-gray-700 mb-1">How to use image search:</h5>
              <ol className="text-xs text-gray-600 list-decimal pl-4 space-y-1">
                <li>Click "Upload Photo" above</li>
                <li>Select a clear photo with a face</li>
                <li>The system will find users with similar facial features</li>
                <li>Click on a user to view their profile or posts</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialSearchBar;
