import React, { useState } from 'react';
import { X, Search, Upload, Users } from 'lucide-react';
import AdvancedSearch from './AdvancedSearch';

const AdvancedSearchModal = ({ isOpen, onClose, onUserSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Search className="mr-2 text-indigo-600" size={24} />
            Advanced Search
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Face Search Section */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
              <Upload className="mr-2 text-blue-600" size={20} />
              Search by Face
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Upload a photo to find users using facial recognition technology.
            </p>
            
            <div className="flex justify-center">
              <label htmlFor="face-search-upload" className="cursor-pointer bg-white border border-blue-300 hover:bg-blue-50 text-blue-700 font-medium py-2 px-4 rounded-lg flex items-center transition-colors">
                <Upload size={16} className="mr-2" />
                Upload Photo
              </label>
            </div>
            
            <div className="mt-3 text-xs text-blue-600 text-center">
              Your photo will only be used for this search and won't be stored.
            </div>
          </div>

          {/* Text Search Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Search by Name</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter a username or full name to find users.
            </p>
            
            <AdvancedSearch 
              onUserSelect={(user) => {
                if (onUserSelect) {
                  onUserSelect(user);
                }
                onClose();
              }}
            />
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">How to use advanced search:</h3>
            <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-2">
              <li>Search by name using the text input above</li>
              <li>Or upload a photo to search by facial recognition</li>
              <li>You can combine both methods for more accurate results</li>
              <li>Click on a user in the results to view their profile or posts</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchModal;
