import React, { useEffect, useRef, useState } from "react";

import Suggested from "./Suggested";


import Post from "./Post";
import { useSelector } from "react-redux";
import useGetAllPosts from "../hooks/getallpost";

const Home = () => {
useGetAllPosts();
  const allposts=useSelector((state=>state.posts.posts))
 

  return (
    <>
    
      <div className="w-[55%] h-screen ">
        <div className="story w-full h-[15%] ">story</div>
        <div  className="feed w-full h-[85%]  flex flex-col items-center justify-start  overflow-y-scroll custom-scrollbar  ">
          {allposts.map((post) => {
            return (
            <Post key={post._id} post={post}/>
            );
          })}
        </div>
      </div>
      <Suggested />
    </>
  );
};

export default Home;
