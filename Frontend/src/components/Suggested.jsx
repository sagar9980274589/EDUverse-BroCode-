import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { setuser } from '../UserSlice';
import api from '../AxiosInstance';

const Suggested = () => {
  const userdata = useSelector((state) => state.data.userdata);
  const dispatch = useDispatch();
  const [suggested, setsuggested] = useState([]);

  // Get suggested users
  async function getsuggested() {
    try {
      const res = await api.get('/user/getsuggested');
      if (res.data.success) {
        setsuggested(res.data.suggested);
      } else {
        console.log(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getsuggested();
  }, []);

  // Follow or unfollow a user
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

  return (
    <div className='w-[25%] min-h-screen'>
      <span className='text-slate-500 p-6'>Suggested for you</span>

      <div className="mt-1.5 box w-[80%] h-[80%]">
        {suggested.map((sug, idx) => {
          if (userdata._id !== sug._id) {
            return (
              <div key={idx} className="my-2 card w-full h-10 flex justify-between items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={sug.profile || null} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <span className='w-52 text-md font-medium flex justify-items-start'>{sug.username}</span>
                {userdata.following.includes(sug._id) ? (
                  <button 
                    onClick={() => follow(sug._id)} 
                    className='text-slate-500 font-semibold text-sm'>
                      Unfollow
                  </button>
                ) : (
                  <button 
                    onClick={() => follow(sug._id)} 
                    className='text-sky-500 font-semibold text-sm'>
                      Follow
                  </button>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Suggested;
