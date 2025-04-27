import React, { useEffect, useState } from "react";
import api from "../AxiosInstance";
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import { reload } from "../PostSlice";

const Commentdialogue = ({ post, isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const [commentreload, setcommentreload] = useState(false);
  const [postcomments, setpostcomments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { handleSubmit, register, formState: { errors } } = useForm();

  const commenthandler = async (data) => {
    setLoading(true);
    try {
      // Try the new endpoint first
      try {
        const res = await api.post('/comment/add', {
          postId: post._id,
          comment: data.comment
        });

        if (res.status === 201) {
          setcommentreload(!commentreload);  // Trigger the comment reload after posting
          console.log("Comment added successfully:", res.data.message);
          return; // Exit if successful
        }
      } catch (newApiError) {
        console.log("New endpoint failed, trying legacy endpoint:", newApiError);
      }

      // Fall back to the old endpoint if the new one fails
      const legacyRes = await api.post(`/user/addcomment/${post._id || ""}`, {
        comment: data.comment
      });

      if (legacyRes.data.success) {
        setcommentreload(!commentreload);  // Trigger the comment reload after posting
        console.log("Comment added successfully (legacy):", legacyRes.data.message);
      } else {
        console.log("Error adding comment (legacy):", legacyRes.data.message);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setLoading(false);
      dispatch(reload());  // Reload regardless of success or failure
      getcomments();  // Fetch the updated comments immediately after adding one
    }
  };

  // Fetch comments when the modal is open or when new comments are added
  const getcomments = async () => {
    try {
      console.log("Loading comments for post:", post?._id);

      // Try the new endpoint first
      try {
        const res = await api.get(`/comment/${post?._id || ""}`);

        if (res.status === 200) {
          console.log("Comments received from new endpoint:", res.data);
          setpostcomments(res.data.comments || []);
          return; // Exit if successful
        }
      } catch (newApiError) {
        console.log("New endpoint failed, trying legacy endpoint:", newApiError);
      }

      // Fall back to the old endpoint if the new one fails
      const legacyRes = await api.get(`/user/getcomments/${post?._id || ""}`);

      if (legacyRes.data.success) {
        console.log("Comments received from legacy endpoint:", legacyRes.data);
        setpostcomments(legacyRes.data.comments || []);
      } else {
        console.log("Error response from legacy endpoint:", legacyRes.data.message);
        setpostcomments([]);
      }
    } catch (err) {
      console.error("Error fetching comments from both endpoints:", err);
      // If there's a network error or other issue, set empty comments array
      setpostcomments([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getcomments();  // Fetch comments when the modal is opened
    }
  }, [isOpen, commentreload]); // Reload comments when the modal opens or after a new comment is added

  return (
    <div className={`${isOpen ? "flex" : "hidden"} items-center justify-center min-h-screen`}>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-opacity-60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white flex rounded-lg shadow-black h-[90vh] shadow-lg w-[50vw] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="left h-[80vh] my-auto w-[50%]">
              <img
                className="h-full w-full object-contain backdrop-blur-2xl"
                src={post.image}
                alt=""
              />
            </div>

            <div className="right w-[50%]">
              <div className="head mt-2 w-full flex justify-between items-center h-[6%]">
                <div className="flex w-[30%] justify-evenly">
                  <div className="profile w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={post.author.profile}
                      alt="Profile"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="username">{post.author.username}</div>
                </div>
                <div className="dots flex w-[10%] items-end justify-center">
                  <span className="material-symbols-outlined">more_horiz</span>
                </div>
              </div>
              <div className="body mt-2 h-[75%] overflow-x-hidden overflow-y-scroll">
                <div className="comments w-full">
                  {postcomments && postcomments.length > 0 ? (
                    postcomments.map((com) => (
                      <div key={com._id} className="head m-6 w-full flex justify-start gap-4 items-start h-[6vh]">
                        <div className="flex w-[40%] justify-evenly">
                          <div className="profile w-10 h-10 rounded-full overflow-hidden">
                            {com.author && com.author.profile ? (
                              <img
                                src={com.author.profile}
                                alt={com.author.username || "Profile"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <span className="material-symbols-outlined">person</span>
                              </div>
                            )}
                          </div>
                          <div className="username">{com.author ? com.author.username : "Unknown User"}</div>
                        </div>
                        <div className="commentcontent flex flex-row items-start h-[100%] m-0 p-0">
                          <span className="h-full p-0">{com.comment}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 text-gray-500">No comments yet</div>
                  )}
                </div>
              </div>
              <div className="foot flex flex-col border-slate-500 items-center justify-start h-[24%]">
                <div className="w-full flex justify-between items-center p-2 h-[23%] interaction">


                </div>
                <div className="likes w-full h-[20%] flex items-center px-2">
                  {post.likes.length} likes
                </div>

                <div className="add comment w-full h-[15%] text-slate-600 flex justify-between px-2 items-center">
                  <form onSubmit={handleSubmit(commenthandler)}>
                    <input
                      {...register('comment', { required: "Comment is required" })}
                      className="outline-0"
                      type="text"
                      placeholder="Add a comment..."
                    />
                    {errors.comment && <span className="text-red-500">{errors.comment.message}</span>}
                    <button className="text-sky-500" disabled={loading}>
                      {loading ? "Sending..." : "Send"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Commentdialogue;
