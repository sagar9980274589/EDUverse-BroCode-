import React, { useState } from 'react';
import Commentdialogue from './Commentdialogue';
import Actionsdialogue from './Actionsdialouge';
import api from '../AxiosInstance';
import { toast } from "react-toastify";
import { useSelector, useDispatch } from 'react-redux';
import { reload, setpost } from '../PostSlice';
import "react-toastify/dist/ReactToastify.css";
import { useForm } from 'react-hook-form';

const Post = ({ post }) => {
  const loggeduserid = useSelector((state) => state.data.userdata._id);
  const posts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();
  const { handleSubmit, register, formState: { errors } } = useForm();

  const [isOpen, setIsOpen] = useState(false);
  const [actionModel, setActionModel] = useState(false);

async function  addbookmark() {
   try {
  
      const res = await api.get(`/user/bookmark/${post._id}`);
      if (res.data.success) {
       
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        
        
      } else {
      
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
       
      }
    } catch (err) {
      console.log(err);
      toast.error("Error while adding bookmark", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
}

  async function addcomment(data) {
    try {
      console.log(data);
      const res = await api.post(`/user/addcomment/${post._id || ""}`, data);
      if (res.data.success) {
        // Display success message to user
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        
        // Reload comments immediately after adding
        dispatch(reload());
      } else {
      
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        dispatch(reload());
      }
    } catch (err) {
      console.log(err);
      toast.error("Error while adding comment", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function likeOrDislike(postId) {
    try {
      const res = await api.get(`/user/like/${postId}`);
      if (res.data.success) {
        dispatch(reload()); // Trigger reload to refetch posts
toast.success(`${res.data.message}`)
        // Handle liked/disliked state
        if (res.data.message === 'liked') {
          const updatedPosts = posts.map((p) =>
            p._id === post._id ? { ...p, likes: [...p.likes, loggeduserid] } : p
          );
          dispatch(setpost(updatedPosts)); // Update posts in Redux
        } else if (res.data.message === 'disliked') {
          const updatedPosts = posts.map((p) =>
            p._id === post._id ? { ...p, likes: p.likes.filter(id => id !== loggeduserid) } : p
          );
          dispatch(setpost(updatedPosts)); // Update posts in Redux
        }

      } else {
        console.log(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Commentdialogue post={post} isOpen={isOpen} setIsOpen={setIsOpen} />
      <Actionsdialogue post={post} userid={post.author._id} isOpen={actionModel} setIsOpen={setActionModel} />
      
      <div className="card min-h-screen m-6 w-[60%] flex flex-col">
        <div className="head w-full flex justify-between items-center h-[6%]">
          <div className="flex w-[30%] justify-evenly">
            <div className="profile w-10 h-10 rounded-full overflow-hidden">
              <img
                src={post.author.profile || null}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="username">{post.author.username}</div>
          </div>
          <div onClick={() => { setActionModel(true) }} className="dots flex w-[10%] items-end justify-center">
            <span className="material-symbols-outlined">more_horiz</span>
          </div>
        </div>

        <div className="body mt-2 h-[80%]">
          <img
            className="w-full h-full object-contain rounded-sm"
            src={post.image}
          />
        </div>

        <div className="foot flex flex-col border-b-2 border-slate-500 items-center justify-start h-[24%]">
          <div className="w-full flex justify-between items-center p-2 h-[23%] interaction">
            <div className="flex gap-2">
              {post.likes.includes(loggeduserid) ? (
                <span onClick={() => { likeOrDislike(post._id) }} className="cursor-pointer h-6">❤️</span>
              ) : (
                <span onClick={() => { likeOrDislike(post._id) }} className="cursor-pointer material-symbols-outlined">
                  favorite
                </span>
              )}

              <span onClick={()=>{setIsOpen(true)}} className="material-symbols-outlined">mode_comment</span>
            </div>
            <div>
              <span onClick={addbookmark} className="material-symbols-outlined">bookmark</span>
            </div>
          </div>

          <div className="likes w-full h-[20%] flex items-center px-2">
            {post.likes.length} likes
          </div>

          <div className="caption w-full h-[20%] flex items-center px-2 gap-2">
            <span>{post.author.username}</span>
            <span>{post.caption}</span>
          </div>

          <div onClick={() => { setIsOpen(true) }} className="comments cursor-pointer w-full h-[15%] text-slate-600 flex px-2 items-center">
            view all {post.comments.length} comments
          </div>

          <div className="add comment w-full h-[15%] text-slate-600 flex justify-between px-2 items-center">
            <form onSubmit={handleSubmit(addcomment)}>
              <input
                {...register('comment', { required: "Comment is required" })}
                className="outline-0"
                type="text"
                placeholder="add a comment..."
              />
          
              <button type="submit" className="text-sky-500">send</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
