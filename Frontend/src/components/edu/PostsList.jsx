import React from 'react';
import { Heart, MessageSquare, Share2, Bookmark, User } from 'lucide-react';

const PostsList = ({ 
  posts, 
  user, 
  likeOrDislike, 
  toggleComments, 
  sharePost, 
  addBookmark 
}) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post._id} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {post.author.profile ? (
                <img
                  src={post.author.profile}
                  alt={post.author.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={16} className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{post.author.username}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-gray-700">{post.caption}</p>
              {post.image && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-auto"
                  />
                </div>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center space-x-4">
                <button
                  onClick={() => likeOrDislike(post._id)}
                  className="flex items-center text-gray-500 hover:text-indigo-600"
                >
                  <Heart
                    size={18}
                    className={`mr-1 ${
                      post.likes.includes(user._id) ? "fill-indigo-600 text-indigo-600" : ""
                    }`}
                  />
                  <span>{post.likes.length}</span>
                </button>
                <button
                  onClick={() => toggleComments(post._id)}
                  className="flex items-center text-gray-500 hover:text-indigo-600"
                >
                  <MessageSquare size={18} className="mr-1" />
                  <span>{post.comments.length}</span>
                </button>
                <button
                  onClick={() => sharePost(post._id, post.author.username)}
                  className="flex items-center text-gray-500 hover:text-indigo-600"
                >
                  <Share2 size={18} className="mr-1" />
                  <span>Share</span>
                </button>
                <button
                  onClick={() => addBookmark(post._id)}
                  className="flex items-center text-gray-500 hover:text-indigo-600"
                >
                  <Bookmark size={18} className="mr-1" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsList;
