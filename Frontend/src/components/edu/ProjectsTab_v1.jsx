import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Github, Heart, MessageSquare, Share2, Bookmark, User } from 'lucide-react';
import GitHubProjects from './GitHubProjects';
import api from '../../AxiosInstance';
import { toast } from 'react-toastify';

const ProjectsTab = ({ 
  user, 
  filteredPosts, 
  setShowCreatePost, 
  likeOrDislike, 
  toggleComments, 
  sharePost, 
  addBookmark 
}) => {
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');

  useEffect(() => {
    // If user has a GitHub username, set it in the state
    if (user && user.githubUsername) {
      setGithubUsername(user.githubUsername);
    }
  }, [user]);

  // Connect GitHub account
  const connectGithub = async () => {
    if (!githubUsername.trim()) {
      toast.error('Please enter a GitHub username', {
        position: 'top-center',
        autoClose: 3000
      });
      return;
    }

    setIsConnectingGithub(true);

    try {
      const response = await api.post('/user/connect-github', {
        githubUsername: githubUsername.trim()
      });

      if (response.data.success) {
        toast.success('GitHub account connected successfully!', {
          position: 'top-center',
          autoClose: 3000
        });
        
        // Refresh the page to update user data
        window.location.reload();
      } else {
        toast.error(response.data.message || 'Failed to connect GitHub account', {
          position: 'top-center',
          autoClose: 3000
        });
      }
    } catch (error) {
      console.error('Error connecting GitHub account:', error);
      toast.error('Failed to connect GitHub account. Please try again.', {
        position: 'top-center',
        autoClose: 3000
      });
    } finally {
      setIsConnectingGithub(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* GitHub Projects Section */}
      {user.githubUsername ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h3 className="font-medium text-gray-800 flex items-center">
              <Github className="mr-2 text-gray-700" size={18} />
              My GitHub Projects
            </h3>
          </div>
          <div className="p-6">
            <GitHubProjects userId={user._id} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center">
            <Github size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">Connect Your GitHub Account</h3>
            <p className="text-gray-600 mb-6">
              Connect your GitHub account to showcase your projects here!
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="flex mb-4">
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="Enter your GitHub username"
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={connectGithub}
                disabled={isConnectingGithub}
                className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isConnectingGithub ? 'Connecting...' : 'Connect'}
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              <p className="mb-2">
                <span className="font-medium">Note:</span> This will fetch your public repositories from GitHub.
              </p>
              <p>
                You can also update your GitHub username in your{' '}
                <Link to="/edu/profile" className="text-indigo-600 hover:underline">
                  profile settings
                </Link>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Project Posts Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h3 className="font-medium text-gray-800 flex items-center">
            <Code className="mr-2 text-gray-700" size={18} />
            Community Project Posts
          </h3>
        </div>

        {filteredPosts.filter(post => post.tags && post.tags.includes("project")).length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredPosts
              .filter(post => post.tags && post.tags.includes("project"))
              .map((post) => (
                <div key={post._id} className="p-6">
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
        ) : (
          <div className="p-8 text-center">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-800 mb-2">No project posts found</h3>
            <p className="text-gray-600 mb-4">
              Share your projects with the community!
            </p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
            >
              Create a Project Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsTab;
