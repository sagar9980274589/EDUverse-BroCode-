import React, { useState } from 'react';
import { X, Image, Tag } from 'lucide-react';

const CreatePostModal = ({ 
  showCreatePost, 
  setShowCreatePost, 
  postCaption, 
  setPostCaption, 
  postImage, 
  setPostImage, 
  postTags, 
  setPostTags, 
  createPost, 
  loading,
  activeTab
}) => {
  const [tagInput, setTagInput] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPostImage(e.target.files[0]);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !postTags.includes(tagInput.trim())) {
      setPostTags([...postTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setPostTags(postTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Automatically add tag based on active tab
  const getAutoTag = () => {
    if (activeTab === "projects") {
      return "project";
    } else if (activeTab === "skills") {
      return "skill";
    }
    return null;
  };

  const autoTag = getAutoTag();

  return (
    showCreatePost && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-medium">Create a Post</h3>
            <button
              onClick={() => setShowCreatePost(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4">
            <textarea
              value={postCaption}
              onChange={(e) => setPostCaption(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-32"
            ></textarea>

            {postImage && (
              <div className="mt-3 relative">
                <img
                  src={URL.createObjectURL(postImage)}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
                <button
                  onClick={() => setPostImage(null)}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {autoTag && !postTags.includes(autoTag) && (
                  <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm flex items-center">
                    #{autoTag}
                    <span className="text-xs ml-1 text-indigo-600">(auto-added)</span>
                  </div>
                )}
                {postTags.map((tag) => (
                  <div key={tag} className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center">
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Add tags"
                  className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={addTag}
                  className="bg-gray-100 border border-l-0 rounded-r-lg px-3 text-gray-600 hover:bg-gray-200"
                >
                  <Tag size={16} />
                </button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center">
                <Image size={18} className="mr-2" />
                Add Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <button
                onClick={createPost}
                disabled={loading || (!postCaption.trim() && !postImage)}
                className={`bg-indigo-600 text-white py-2 px-6 rounded-lg ${
                  loading || (!postCaption.trim() && !postImage)
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-indigo-700"
                }`}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CreatePostModal;
