import React from 'react';
import { User, Plus } from 'lucide-react';

const SidebarRight = ({ suggestedUsers, followOrUnfollow, user }) => {
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
                    onClick={() => followOrUnfollow(suggestedUser._id)}
                    className={`p-1.5 rounded-full ${
                      user.following && user.following.includes(suggestedUser._id)
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Plus size={16} />
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
