import React, { useState } from 'react';
import { User, UserPlus, UserMinus } from 'lucide-react';

const SidebarRight = ({ suggestedUsers, followOrUnfollow, user }) => {
  const [followingInProgress, setFollowingInProgress] = useState({});
  return (
    <div className="w-64 hidden lg:block">
      <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
        <h3 className="font-medium text-gray-800 mb-4">Suggested Users</h3>
        <div className="space-y-4">
          {suggestedUsers.length > 0 ? (
            suggestedUsers.map((suggestedUser) => (
              user._id !== suggestedUser._id && (
                <div key={suggestedUser._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      {suggestedUser.profile ? (
                        <img
                          src={suggestedUser.profile}
                          alt={suggestedUser.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={16} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{suggestedUser.username}</p>
                      <p className="text-xs text-gray-500 capitalize">{suggestedUser.userType}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFollowingInProgress(prev => ({ ...prev, [suggestedUser._id]: true }));
                      try {
                        followOrUnfollow(suggestedUser._id);
                      } catch (error) {
                        console.error("Error following/unfollowing:", error);
                      } finally {
                        // Set a timeout to ensure the UI updates after the API call completes
                        setTimeout(() => {
                          setFollowingInProgress(prev => ({ ...prev, [suggestedUser._id]: false }));
                        }, 1000);
                      }
                    }}
                    disabled={followingInProgress[suggestedUser._id]}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center ${
                      followingInProgress[suggestedUser._id]
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : user.following && user.following.includes(suggestedUser._id)
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`}
                  >
                    {followingInProgress[suggestedUser._id] ? (
                      "Loading..."
                    ) : user.following && user.following.includes(suggestedUser._id) ? (
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
              )
            ))
          ) : (
            <p className="text-gray-500 text-sm">No suggestions available</p>
          )}
        </div>

        <div className="border-t border-gray-100 my-6 pt-6">
          <h3 className="font-medium text-gray-800 mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              #programming
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              #webdev
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              #javascript
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              #react
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
              #python
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
