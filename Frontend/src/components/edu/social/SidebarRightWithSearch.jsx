import React, { useState } from 'react';
import { Search, User, Users, UserPlus, UserMinus, Loader } from 'lucide-react';
import SocialSearchBar from './SocialSearchBar';
import { toast } from 'react-toastify';

const SidebarRightWithSearch = ({ suggestedUsers, followOrUnfollow, user, onUserSelect, onFilterChange }) => {
  const [showFullSearch, setShowFullSearch] = useState(false);
  const [followingInProgress, setFollowingInProgress] = useState({});

  // Enhanced follow/unfollow with loading state and feedback
  const handleFollowUnfollow = async (userId, username) => {
    try {
      // Set loading state for this specific user
      setFollowingInProgress(prev => ({ ...prev, [userId]: true }));

      // Call the original followOrUnfollow function
      await followOrUnfollow(userId);

      // Show success message
      const isFollowing = user?.following?.includes(userId);
      toast.success(
        isFollowing
          ? `You are no longer following ${username}`
          : `You are now following ${username}`,
        { position: "top-right", autoClose: 3000 }
      );
    } catch (error) {
      toast.error("Failed to update follow status. Please try again.");
      console.error("Error in follow/unfollow:", error);
    } finally {
      // Clear loading state
      setFollowingInProgress(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="w-full md:w-80 lg:w-96 space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        {showFullSearch ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Advanced Search</h3>
              <button
                onClick={() => setShowFullSearch(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <SocialSearchBar
              onUserSelect={(user) => {
                if (onUserSelect) {
                  onUserSelect(user);
                }
                setShowFullSearch(false);
              }}
              onFilterChange={onFilterChange}
            />
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Search className="mr-2 text-indigo-600" size={20} />
              Search
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts, people..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => setShowFullSearch(true)}
                className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
              >
                Advanced Search
              </button>
            </div>
          </>
        )}
      </div>

      {/* Suggested Users */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Users className="mr-2 text-indigo-600" size={20} />
            Suggested Users
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {suggestedUsers.length} users
          </span>
        </div>

        {suggestedUsers.length > 0 ? (
          <div className="space-y-4">
            {suggestedUsers.map((suggestedUser) => {
              const isFollowing = user?.following?.includes(suggestedUser._id);
              const isLoading = followingInProgress[suggestedUser._id];

              return (
                <div key={suggestedUser._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      if (onUserSelect) {
                        onUserSelect(suggestedUser);
                      }
                    }}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-indigo-100">
                      {suggestedUser.profile ? (
                        <img
                          src={suggestedUser.profile}
                          alt={suggestedUser.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                          <User size={24} className="text-indigo-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{suggestedUser.username}</p>
                      <p className="text-xs text-gray-500">{suggestedUser.fullname || "EDUverse User"}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleFollowUnfollow(suggestedUser._id, suggestedUser.username)}
                    disabled={isLoading}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center ${
                      isLoading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : isFollowing
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader size={12} className="animate-spin mr-1" />
                        <span>Loading...</span>
                      </>
                    ) : isFollowing ? (
                      <>
                        <UserMinus size={12} className="mr-1" />
                        <span>Unfollow</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={12} className="mr-1" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Users size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No suggested users at the moment.</p>
            <p className="text-xs text-gray-400 mt-1">Check back later for new suggestions</p>
          </div>
        )}

        {suggestedUsers.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800">
              See More Suggestions
            </button>
          </div>
        )}
      </div>

      {/* EDUverse Info */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">About EDUverse</h3>
        <p className="text-sm text-gray-600 mb-3">
          EDUverse is an educational platform created by Team 'BROcode' from Adichunchanagiri Institute of Technology.
        </p>
        <div className="text-xs text-gray-500">
          <p>© 2023 EDUverse</p>
          <div className="flex space-x-2 mt-1">
            <a href="/terms" className="hover:text-indigo-600">Terms</a>
            <span>•</span>
            <a href="/privacy" className="hover:text-indigo-600">Privacy</a>
            <span>•</span>
            <a href="/about" className="hover:text-indigo-600">About</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarRightWithSearch;
