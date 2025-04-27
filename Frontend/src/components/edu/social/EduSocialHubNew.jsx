import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Plus, Search, MessageSquare, X } from "lucide-react";
import SocialLayout from "./SocialLayout";
import ProjectsTab from "./ProjectsTab";
import EmptyStateTab from "./EmptyStateTab";
import PostsList from "./PostsList";
import CreatePostModal from "./CreatePostModal";
import SidebarLeft from "./SidebarLeft";
import SidebarRightWithSearch from "./SidebarRightWithSearch";
import ChatButton from "./ChatButton";
import ChatDrawer from "./ChatDrawer";
import FloatingSearchButton from "./FloatingSearchButton";
import AdvancedSearchModal from "./AdvancedSearchModal";
import SuggestedUsersSection from "./SuggestedUsersSection";
import useGetAllPosts from "../../hooks/getallpost";
import { reload } from "../../PostSlice";
import { setuser } from "../../UserSlice";
import api from "../../AxiosInstance";

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const EduSocialHub = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.data.userdata);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postCaption, setPostCaption] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [postTags, setPostTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  useGetAllPosts();
  const posts = useSelector((state) => state.posts.posts);
  const postsLoading = false; // We'll assume posts are loaded since we're using the selector

  // Create a new array of posts with formatted dates (to avoid mutating Redux state)
  const postsWithFormattedDates = Array.isArray(posts) ? posts.map(post => ({
    ...post,
    formattedDate: post?.createdAt ? formatDate(post.createdAt) : ''
  })) : [];

  // Filter posts based on active tab and search query
  const filteredPosts = postsWithFormattedDates.filter((post) => {
    // Skip posts with missing required data
    if (!post || !post.author) return false;

    const matchesSearch =
      searchQuery === "" ||
      (post.caption && post.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.author?.username && post.author.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.tags &&
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    if (activeTab === "all") {
      return matchesSearch;
    } else if (activeTab === "following") {
      return (
        matchesSearch &&
        user?.following &&
        Array.isArray(user.following) &&
        post.author?._id &&
        user.following.includes(post.author._id)
      );
    } else if (activeTab === "projects") {
      return (
        matchesSearch &&
        post.tags &&
        Array.isArray(post.tags) &&
        post.tags.includes("project")
      );
    } else if (activeTab === "skills") {
      return (
        matchesSearch &&
        post.tags &&
        Array.isArray(post.tags) &&
        post.tags.includes("skill")
      );
    }
    return false;
  });

  // Get suggested users
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await api.get("/user/getsuggested");
        if (response.data.success) {
          setSuggestedUsers(response.data.suggested);
        }
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };

    fetchSuggestedUsers();
  }, [user]);

  // Create post
  const createPost = async () => {
    if (!postCaption.trim() && !postImage) {
      toast.error("Please add a caption or image to your post", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("caption", postCaption);

      if (postImage) {
        formData.append("image", postImage);
      }

      // Add tags based on the active tab
      let tagsToAdd = [...postTags];

      // Automatically add the appropriate tag based on active tab
      if (activeTab === "projects" && !tagsToAdd.includes("project")) {
        tagsToAdd.push("project");
      } else if (activeTab === "skills" && !tagsToAdd.includes("skill")) {
        tagsToAdd.push("skill");
      }

      if (tagsToAdd.length > 0) {
        formData.append("tags", JSON.stringify(tagsToAdd));
      }

      const response = await api.post("/user/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Post created successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
        setPostCaption("");
        setPostImage(null);
        setPostTags([]);
        setShowCreatePost(false);
        dispatch(reload());
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Like or unlike a post
  const likeOrDislike = async (postId) => {
    try {
      const response = await api.get(`/user/like/${postId}`);
      if (response.data.success) {
        dispatch(reload());
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  // Follow or unfollow a user
  const followOrUnfollow = async (userId) => {
    try {
      const response = await api.get(`/user/followorunfollow/${userId}`);
      if (response.data.success) {
        // Update the user in Redux
        const userResponse = await api.get("/user/getprofile");
        if (userResponse.data.success) {
          dispatch(setuser(userResponse.data.user));
        }

        // Refresh suggested users
        const suggestedResponse = await api.get("/user/getsuggested");
        if (suggestedResponse.data.success) {
          setSuggestedUsers(suggestedResponse.data.suggested);
        }

        return true; // Return success for the UI handling
      }
      return false;
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      throw error; // Rethrow for UI error handling
    }
  };

  // Toggle comments visibility
  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Add a comment to a post
  const addComment = async (postId) => {
    if (!commentText[postId] || !commentText[postId].trim()) {
      return;
    }

    try {
      const response = await api.post(`/user/comment`, {
        postId: postId,
        comment: commentText[postId],
      });

      if (response.data.success) {
        setCommentText((prev) => ({ ...prev, [postId]: "" }));
        dispatch(reload());
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Share a post
  const sharePost = (postId, username) => {
    const url = `${window.location.origin}/edu/post/${postId}`;

    if (navigator.share) {
      navigator.share({
        title: `Post by ${username} on EDUverse`,
        text: `Check out this post by ${username} on EDUverse!`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  // Add a post to bookmarks
  const addBookmark = async (postId) => {
    try {
      const response = await api.get(`/user/bookmark/${postId}`);
      if (response.data.success) {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  return (
    <SocialLayout>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Left Sidebar */}
          <SidebarLeft
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Main Content */}
          <div className="flex-1">

            {/* Search Query Indicator */}
            {searchQuery && (
              <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3">
                      <Search size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-800">
                        Showing results for: <span className="font-semibold">{searchQuery}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-indigo-600 hover:text-indigo-800 p-1 hover:bg-indigo-100 rounded-full transition-colors"
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex justify-between items-center">
              <button
                onClick={() => setIsAdvancedSearchOpen(true)}
                className="bg-white border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 flex items-center"
                title="Advanced Search"
              >
                <Search size={18} className="mr-2" />
                Advanced Search
              </button>

              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
                title="Create a new post"
              >
                <Plus size={18} className="mr-2" />
                Create Post
              </button>
            </div>

            {/* Chat Access Button */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="text-indigo-600 mr-2" size={20} />
                  <h3 className="font-medium text-gray-800">Connect with your network</h3>
                </div>
                <button
                  onClick={() => setIsChatDrawerOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center"
                >
                  <MessageSquare size={16} className="mr-2" />
                  Chat with followers
                </button>
              </div>
            </div>

            {/* Suggested Users Section */}
            {!searchQuery && (
              <SuggestedUsersSection
                suggestedUsers={suggestedUsers}
                followOrUnfollow={followOrUnfollow}
                user={user}
                onUserSelect={(user) => {
                  if (!user || !user.username) return;
                  setSearchQuery(user.username);

                  toast.success(
                    <div className="flex items-center">
                      <div className="mr-3">
                        {user.profile ? (
                          <img
                            src={user.profile}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-bold text-lg">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Showing posts from {user.username}</p>
                        <p className="text-sm opacity-80">Click on their name to view profile</p>
                      </div>
                    </div>,
                    {
                      position: "top-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                    }
                  );

                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Mobile Tabs */}
            <div className="flex overflow-x-auto space-x-2 mb-6 lg:hidden">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                All Posts
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === "following"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                Following
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === "projects"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab("skills")}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  activeTab === "skills"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                Skills
              </button>
            </div>

            {/* Content based on active tab */}
            {postsLoading ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading posts...</p>
              </div>
            ) : (
              <>
                {activeTab === "projects" ? (
                  <ProjectsTab
                    user={user}
                    filteredPosts={filteredPosts}
                    setShowCreatePost={setShowCreatePost}
                    likeOrDislike={likeOrDislike}
                    toggleComments={toggleComments}
                    sharePost={sharePost}
                    addBookmark={addBookmark}
                    addComment={addComment}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    expandedComments={expandedComments}
                  />
                ) : filteredPosts.length > 0 ? (
                  <PostsList
                    posts={filteredPosts}
                    user={user}
                    likeOrDislike={likeOrDislike}
                    toggleComments={toggleComments}
                    sharePost={sharePost}
                    addBookmark={addBookmark}
                    addComment={addComment}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    expandedComments={expandedComments}
                  />
                ) : (
                  <EmptyStateTab
                    activeTab={activeTab}
                    user={user}
                    setShowCreatePost={setShowCreatePost}
                  />
                )}
              </>
            )}
          </div>

          {/* Right Sidebar with Search */}
          <SidebarRightWithSearch
            suggestedUsers={suggestedUsers}
            followOrUnfollow={followOrUnfollow}
            user={user}
            onUserSelect={(user) => {
              if (!user || !user.username) return;

              // Set search query to filter posts by this user
              setSearchQuery(user.username);

              // Show a more prominent notification
              toast.success(
                <div className="flex items-center">
                  <div className="mr-3">
                    {user.profile ? (
                      <img
                        src={user.profile}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-lg">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Showing posts from {user.username}</p>
                    <p className="text-sm opacity-80">Click on their name to view profile</p>
                  </div>
                </div>,
                {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                }
              );

              // Scroll to top to show the filtered posts
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onFilterChange={(value) => setSearchQuery(value)}
          />
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        showCreatePost={showCreatePost}
        setShowCreatePost={setShowCreatePost}
        postCaption={postCaption}
        setPostCaption={setPostCaption}
        postImage={postImage}
        setPostImage={setPostImage}
        postTags={postTags}
        setPostTags={setPostTags}
        createPost={createPost}
        loading={loading}
        activeTab={activeTab}
      />

      {/* Chat Button for mobile/floating access */}
      <ChatButton />

      {/* Floating Search Button for mobile */}
      <FloatingSearchButton
        onUserSelect={(user) => {
          if (!user || !user.username) return;
          setSearchQuery(user.username);

          toast.success(`Showing posts from ${user.username}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onFilterChange={(value) => setSearchQuery(value)}
      />

      {/* Chat Drawer */}
      <ChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
      />

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onUserSelect={(user) => {
          if (!user || !user.username) return;
          setSearchQuery(user.username);

          toast.success(
            <div className="flex items-center">
              <div className="mr-3">
                {user.profile ? (
                  <img
                    src={user.profile}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">Showing posts from {user.username}</p>
                <p className="text-sm opacity-80">Click on their name to view profile</p>
              </div>
            </div>,
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );

          window.scrollTo({ top: 0, behavior: 'smooth' });
          setIsAdvancedSearchOpen(false);
        }}
      />
    </SocialLayout>
  );
};

export default EduSocialHub;
