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
      const res = await api.post(`/user/addcomment/${post._id || ""}`, data);
      if (res.data.success) {
        setcommentreload(!commentreload);  // Trigger the comment reload after posting
        console.log(res.data.message);
      } else {
        console.log(res.data.message);
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
      console.log("comments loaded");
      const res = await api.get(`/user/getcomments/${post?._id || ""}`);
      if (res.data.success) {
        setpostcomments(res.data.comments);
      } else {
        console.log(res.data.message);
      }
    } catch (err) {
      console.log(err);
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
                  {postcomments.map((com) => (
                    <div key={com._id} className="head m-6 w-full flex justify-start gap-4 items-start h-[6vh]">
                      <div className="flex w-[40%] justify-evenly">
                        <div className="profile w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={com.author.profile}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="username">{com.author.username}</div>
                      </div>
                      <div className="commentcontent flex flex-row items-start h-[100%] m-0 p-0">
                        <span className="h-full p-0">{com.comment}</span>
                      </div>
                    </div>
                  ))}
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
