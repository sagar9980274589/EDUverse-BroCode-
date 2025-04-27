import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  User, 
  ArrowLeft,
  Send
} from "lucide-react";
import Navbar from "./Navbar";
import api from "../../AxiosInstance";
import { reload } from "../../PostSlice";
import { setuser } from "../../UserSlice";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.data.userdata);
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  
  // Fetch post details
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/user/getpostcontent/${postId}`);
        
        if (res.data.success) {
          setPost(res.data.post);
          
          // Fetch comments
          const commentsRes = await api.get(`/user/getcomments/${postId}`);
          if (commentsRes.data.success) {
            setComments(commentsRes.data.comments);
          }
        } else {
          toast.error("Failed to load post");
          navigate("/edu/social");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        toast.error("Failed to load post");
        navigate("/edu/social");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostDetails();
  }, [postId, navigate]);
  
  // Like or unlike post
  const likeOrDislike = async () => {
    if (!post) return;
    
    try {
      const res = await api.get(`/user/like/${postId}`);
      if (res.data.success) {
        // Update post locally
        setPost({
          ...post,
          likes: post.likes.includes(user._id)
            ? post.likes.filter(id => id !== user._id)
            : [...post.likes, user._id]
        });
        
        toast.success(post.likes.includes(user._id) ? "Post unliked" : "Post liked", {
          position: "top-center",
          autoClose: 1000,
        });
      }
    } catch (err) {
      console.error("Error liking/unliking post:", err);
      toast.error("Failed to like/unlike post");
    }
  };
  
  // Add bookmark
  const addBookmark = async () => {
    if (!post) return;
    
    try {
      const res = await api.get(`/user/bookmark/${postId}`);
      if (res.data.success) {
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error("Error bookmarking post:", err);
      toast.error("Error while adding bookmark");
    }
  };
  
  // Share post
  const sharePost = () => {
    // Create a shareable URL
    const shareUrl = window.location.href;
    
    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: `${post.author.username}'s post on EDUverse`,
        text: 'Check out this post on EDUverse!',
        url: shareUrl,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => {
          console.log('Error sharing:', error);
          // Fallback to clipboard
          copyToClipboard(shareUrl);
        });
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard(shareUrl);
    }
  };
  
  // Helper function to copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Link copied to clipboard!", {
          position: "top-center",
          autoClose: 2000,
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error("Failed to copy link");
      });
  };
  
  // Follow or unfollow user
  const follow = async (targetId) => {
    try {
      const res = await api.get(`/user/followorunfollow/${targetId}`);
      
      if (res?.data?.success) {
        // Update local user state to reflect the change immediately
        const isFollowing = user.following.includes(targetId);
        const updatedUser = {
          ...user,
          following: isFollowing 
            ? user.following.filter(id => id !== targetId) // Remove if already following
            : [...user.following, targetId] // Add if not following
        };
        
        // Update Redux state
        dispatch(setuser(updatedUser));
        
        toast.success(isFollowing ? "Unfollowed successfully" : "Following successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error("Error following/unfollowing:", err);
      toast.error("Failed to follow/unfollow user");
    }
  };
  
  // Add comment
  const addComment = async (e) => {
    e.preventDefault();
    
    if (!commentInput.trim()) return;
    
    try {
      const res = await api.post(`/user/addcomment/${postId}`, {
        comment: commentInput
      });
      
      if (res.data.success) {
        toast.success("Comment added successfully");
        
        // Add comment to local state
        const newComment = {
          _id: Date.now().toString(), // Temporary ID
          comment: commentInput,
          user: {
            _id: user._id,
            username: user.username,
            profile: user.profile
          },
          createdAt: new Date().toISOString()
        };
        
        setComments([...comments, newComment]);
        setCommentInput("");
        
        // Update post comment count
        setPost({
          ...post,
          comments: [...post.comments, newComment._id]
        });
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment");
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 px-4 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 px-4 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Post not found</h2>
          <Link 
            to="/edu/social" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Social Hub
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link 
              to="/edu/social" 
              className="text-indigo-600 hover:text-indigo-800 transition flex items-center"
            >
              <ArrowLeft size={18} className="mr-1" />
              Back to Social Hub
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Post Header */}
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-4">
                  {post.author.profile ? (
                    <img 
                      src={post.author.profile} 
                      alt={post.author.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <User size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{post.author.username}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {/* Follow Button (if not the current user) */}
              {post.author._id !== user._id && (
                <button 
                  onClick={() => follow(post.author._id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    user.following.includes(post.author._id)
                      ? "bg-gray-100 text-gray-800 hover:bg-red-100 hover:text-red-600 group"
                      : "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                  }`}
                >
                  {user.following.includes(post.author._id) ? (
                    <span>
                      <span className="group-hover:hidden">Following</span>
                      <span className="hidden group-hover:inline">Unfollow</span>
                    </span>
                  ) : "Follow"}
                </button>
              )}
            </div>
            
            {/* Post Content */}
            <div className="p-6">
              <p className="text-gray-800 mb-4">{post.caption}</p>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Post Image */}
              {post.image && (
                <div className="mb-6">
                  <img 
                    src={post.image} 
                    alt="Post" 
                    className="w-full h-auto rounded-lg max-h-[600px] object-contain bg-gray-50"
                  />
                </div>
              )}
              
              {/* Post Actions */}
              <div className="flex items-center justify-between py-4 border-t border-b border-gray-100">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={likeOrDislike}
                    className="flex items-center text-gray-600 hover:text-indigo-600 transition"
                    aria-label={post.likes.includes(user._id) ? "Unlike post" : "Like post"}
                  >
                    <Heart 
                      size={22} 
                      className={post.likes.includes(user._id) ? "fill-indigo-600 text-indigo-600" : ""} 
                    />
                    <span className="ml-2 text-sm font-medium">{post.likes.length} likes</span>
                  </button>
                  
                  <button 
                    className="flex items-center text-gray-600 hover:text-indigo-600 transition"
                    aria-label="View comments"
                  >
                    <MessageSquare size={22} />
                    <span className="ml-2 text-sm font-medium">{comments.length} comments</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={addBookmark}
                    className="text-gray-600 hover:text-indigo-600 transition"
                    aria-label="Bookmark post"
                  >
                    <Bookmark size={22} />
                  </button>
                  
                  <button 
                    onClick={sharePost}
                    className="text-gray-600 hover:text-indigo-600 transition"
                    aria-label="Share post"
                  >
                    <Share2 size={22} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Comments Section */}
            <div className="p-6 bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-4">Comments</h3>
              
              {/* Add Comment Form */}
              <form onSubmit={addComment} className="mb-6 flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {user.profile ? (
                    <img 
                      src={user.profile} 
                      alt={user.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={20} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full py-2 px-4 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
                    disabled={!commentInput.trim()}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
              
              {/* Comments List */}
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={comment._id || index} className="flex space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {comment.user.profile ? (
                          <img 
                            src={comment.user.profile} 
                            alt={comment.user.username} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={20} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-800">{comment.user.username}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <p className="text-gray-700">{comment.comment}</p>
                        </div>
                        
                        {/* Comment Actions */}
                        <div className="flex items-center space-x-4 mt-1 ml-2">
                          <button className="text-xs text-gray-500 hover:text-indigo-600">Like</button>
                          <button className="text-xs text-gray-500 hover:text-indigo-600">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
