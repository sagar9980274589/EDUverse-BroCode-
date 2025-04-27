import React, { useState, useEffect } from 'react';
import useGetmyprofile from '../hooks/getmyprofile';
import Editprofiledialogue from './Editprofiledialouge';

const Myprofile = () => {
  const { post, profile, loading, error, reloadProfile, bookmarkedPosts } = useGetmyprofile(); // Assuming you add bookmarkedPosts in your hook
  const [editOpen, setEditOpen] = useState(false);
  const [toggle, setToggle] = useState(false); // Added state for toggle

  // Always render hooks and conditionally render UI based on loading/error state
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleProfileUpdate = () => {
    reloadProfile(); // Trigger the reload after profile update
  };

  return (
    <>
      <Editprofiledialogue
        isOpen={editOpen}
        setIsOpen={setEditOpen}
        onProfileUpdate={handleProfileUpdate}
      />
      <div className="profile w-full h-screen">
        <div className="profile flex w-[80%] mx-auto border-b-2 border-slate-400 h-[50%]">
          {/* Profile Image */}
          <div className="image w-[40%] h-[80%] flex justify-center items-center">
            <div className="w-[40%] h-[58%] rounded-full overflow-hidden">
              <img
                src={profile.profile || 'default-avatar.jpg'} // Fallback to default image if profile is not set
                alt="Profile"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Profile Details */}
          <div className="details w-[60%]">
            <div className="names w-full h-[60%] flex flex-col justify-evenly">
              <div className="w-[50%] flex items-center justify-between">
                <span className="font-semibold text-2xl">{profile.username}</span>
                <button
                  onClick={() => { setEditOpen(true); }}
                  className="bg-slate-200 px-6 py-1 font-semibold rounded-md"
                >
                  Edit profile
                </button>
              </div>
              <div className="w-[40%] flex items-center font-semibold justify-between">
                <span>{profile.posts?.length} Posts</span>
                <span>{profile.following?.length} Following</span>
                <span>{profile.followers?.length} Followers</span>
              </div>
              <div>{profile.bio}</div>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="flex gap-8 justify-center my-4">
          <span
            onClick={() => setToggle(false)}
            className=" text-slate-600 cursor-ponter text-xl px-4 py-2 rounded-md"
          >
     Posts
          </span>
          <span
            onClick={() => setToggle(true)}
            className=" text-slate-600 cursor-ponter text-xl px-4 py-2 rounded-md"
          >
             Saved
          </span>
        </div>

        {/* Posts Section */}
        <div className="posts w-full h-[50%] overflow-y-scroll">
          {toggle ? (
            // Display Bookmarked Posts
            bookmarkedPosts?.length > 0 ? (
              <div className="grid grid-cols-3 w-[80%] h-[100%] overflow-y-scroll mx-auto gap-2 p-4">
                {bookmarkedPosts.map((p) => (
                  <div className="relative group h-[50vh] border-2 rounded-md" key={p._id}>
                    <img
                      className="w-full h-full object-contain"
                      src={p.image}
                      alt=""
                    />
                    {/* Likes and Comments (Visible on Hover) */}
                    <div className="absolute inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xl">🤍{p.likes.length} 💬{p.comments.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No bookmarked posts available.</p>
            )
          ) : (
            // Display Regular Posts
            profile.posts?.length > 0 ? (
              <div className="grid grid-cols-3 w-[80%] h-[100%] overflow-y-scroll mx-auto gap-2 p-4">
                {post.map((p) => (
                  <div className="relative group h-[50vh] border-2 rounded-md" key={p._id}>
                    <img
                      className="w-full h-full object-contain"
                      src={p.image}
                      alt=""
                    />
                    {/* Likes and Comments (Visible on Hover) */}
                    <div className="absolute inset-0 bg-black/60 bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xl">🤍{p.likes.length} 💬{p.comments.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No posts available.</p>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Myprofile;
