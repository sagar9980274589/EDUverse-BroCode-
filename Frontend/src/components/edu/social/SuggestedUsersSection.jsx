import React, { useState } from 'react';
import { Users, User, UserPlus, UserMinus, Loader, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';

const SuggestedUsersSection = ({ suggestedUsers, followOrUnfollow, user, onUserSelect }) => {
  const [followingInProgress, setFollowingInProgress] = useState({});
  const [showAll, setShowAll] = useState(false);
  
  // Display only 4 users initially, or all if showAll is true
  const displayedUsers = showAll ? suggestedUsers : suggestedUsers.slice(0, 4);
  
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
        { position: "top-center", autoClose: 3000 }
      );
    } catch (error) {
      toast.error("Failed to update follow status. Please try again.");
      console.error("Error in follow/unfollow:", error);
    } finally {
      // Clear loading state
      setFollowingInProgress(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (!suggestedUsers || suggestedUsers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Users className="mr-2 text-indigo-600" size={20} />
          People You May Know
        </h2>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center"
        >
          {showAll ? 'Show Less' : 'View All'}
          <ChevronRight size={16} className={`ml-1 transition-transform ${showAll ? 'rotate-90' : ''}`} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedUsers.map((suggestedUser) => {
          const isFollowing = user?.following?.includes(suggestedUser._id);
          const isLoading = followingInProgress[suggestedUser._id];
          
          return (
            <div 
              key={suggestedUser._id} 
              className="border border-gray-100 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div 
                className="cursor-pointer"
                onClick={() => {
                  if (onUserSelect) {
                    onUserSelect(suggestedUser);
                  }
                }}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-indigo-100">
                  {suggestedUser.profile ? (
                    <img
                      src={suggestedUser.profile}
                      alt={suggestedUser.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                      <User size={32} className="text-indigo-400" />
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-800 mb-1">{suggestedUser.username}</h3>
                <p className="text-xs text-gray-500 mb-3">{suggestedUser.fullname || "EDUverse User"}</p>
              </div>
              
              <button
                onClick={() => handleFollowUnfollow(suggestedUser._id, suggestedUser.username)}
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center ${
                  isLoading 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                    : isFollowing
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader size={14} className="animate-spin mr-2" />
                    <span>Loading...</span>
                  </>
                ) : isFollowing ? (
                  <>
                    <UserMinus size={14} className="mr-2" />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={14} className="mr-2" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
      
      {suggestedUsers.length > 4 && !showAll && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => setShowAll(true)}
            className="text-indigo-600 font-medium hover:text-indigo-800"
          >
            Show {suggestedUsers.length - 4} more suggestions
          </button>
        </div>
      )}
    </div>
  );
};

export default SuggestedUsersSection;
