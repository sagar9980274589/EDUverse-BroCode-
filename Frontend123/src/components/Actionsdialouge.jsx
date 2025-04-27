import React, { useEffect, useState } from "react";
import Post from "../assets/post.webp";
import api from "../AxiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { setpost } from "../PostSlice";

const Actionsdialogue = ({ isOpen, setIsOpen,userid,post }) => {
  const dispatch=useDispatch();
    const loggeduser=useSelector((state)=>state.data.userdata._id);
    const allposts=useSelector((state)=>state.posts.posts);

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
   

   async function follow(targetid) {
    try {
      const res = await api.get(`/user/followorunfollow/${targetid}`);
  
      if (res?.data?.success) {
        let newFollowing;
  
        // If the user is already following, unfollow them
        if (userdata.following.includes(targetid)) {
          newFollowing = userdata.following.filter((fol) => fol !== targetid); // Remove user from following
        } else {
          newFollowing = [...userdata.following, targetid]; // Add user to following
        }
  
        // Update the Redux state with the new following list
        dispatch(setuser({ ...userdata, following: newFollowing }));
  
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
        console.log(res?.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || 'Something went wrong', {
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
  



 async function deletepost(){

    try {
        const res = await api.get(`/user/deletepost/${post?._id||""}`);
        if (res.data.success) {
          
         
          const updatedpost = allposts.filter((elem)=>elem._id!=post?._id);
          dispatch(setpost(updatedpost));
          toast.success(res.data.message)
          setIsOpen(false);
         
        } else {
          console.log(res.data.message);
        }
      } catch (err) {
        console.log(err);
      }
      
 }
  return (
    <div
      className={` ${
        isOpen ? "flex" : "hidden"
      } items-center justify-center min-h-screen`}
    >
      {isOpen && (
        <div
          className="fixed inset-0 flex  items-center  bg-black/60  justify-center bg-opacity-60  "
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white flex flex-col items-center rounded-lg shadow-black h-[62vh] shadow-lg w-[26vw] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
{userid!=loggeduser&&<div onClick={follow} className="unfollow text-red-500 flex items-center justify-center border-b-1 border-slate-300 p-4 w-full font-semibold text-md">Unfollow</div>}
{userid==loggeduser&&<div onClick={deletepost} className=" text-red-500 flex items-center justify-center border-b-1 border-slate-300 p-4 w-full font-semibold text-md">Delete Post</div>}
<div onClick={addbookmark}  className=" text-slate-500 flex items-center justify-center border-b-1 border-slate-300 p-4 w-full font-semibold text-md">Add to Bookmarks</div>
           
           
          </div>
        </div>
      )}
    </div>
  );
};

export default Actionsdialogue;
