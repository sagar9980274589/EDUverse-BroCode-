import React from 'react';
import { BookOpen } from 'lucide-react';

const EmptyStateTab = ({ activeTab, user, setShowCreatePost }) => {
  // Determine the message based on the active tab
  const getMessage = () => {
    if (activeTab === "following") {
      return user.following && user.following.length > 0
        ? "The people you follow haven't posted anything yet"
        : "You're not following anyone yet. Follow some users to see their posts here!";
    } else if (activeTab === "skills") {
      return "No skill posts found. Share your skills with the community!";
    } else {
      return "Be the first to share something with the community";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-xl font-medium text-gray-800 mb-2">No posts found</h3>
      <p className="text-gray-600 mb-4">
        {getMessage()}
      </p>
      <button
        onClick={() => setShowCreatePost(true)}
        className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
      >
        Create a Post
      </button>
    </div>
  );
};

export default EmptyStateTab;
