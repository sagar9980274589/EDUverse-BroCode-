import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import SocialSearchBar from './SocialSearchBar';

const FloatingSearchButton = ({ onUserSelect, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Search Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-6 md:hidden z-40 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
          aria-label="Search"
        >
          <Search size={24} />
        </button>
      )}

      {/* Search Drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-end md:hidden">
          <div className="bg-white rounded-t-xl p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Search</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            <SocialSearchBar
              onUserSelect={(user) => {
                if (onUserSelect) {
                  onUserSelect(user);
                }
                setIsOpen(false);
              }}
              onFilterChange={(value) => {
                if (onFilterChange) {
                  onFilterChange(value);
                }
              }}
            />
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingSearchButton;
