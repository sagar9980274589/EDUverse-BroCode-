import React, { useState } from "react";
import Post from "../assets/post.webp";
import api from "../AxiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { setpost } from "../PostSlice";

const Editprofiledialogue = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const allposts = useSelector((state) => state.posts.posts);
  
  const [file, setFile] = useState(null);
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  // Edit profile function
  async function editProfile(e) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("gender", gender);  // Corrected gender append
    if (file) formData.append("profile", file);

    try {
      const res = await api.post("/user/editprofile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (res.data.success) {
      
        
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setIsOpen(false);  // Close modal after success
      } else {
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${isOpen ? "flex" : "hidden"} items-center justify-center min-h-screen z-20`}>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center bg-black/60 justify-center bg-opacity-60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white flex flex-col items-center rounded-lg shadow-black h-[75vh] shadow-lg w-[33vw] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-12 flex justify-center items-center font-semibold border-b border-slate-400">
              Edit Profile
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-screen">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex items-center flex-col justify-center border w-full h-[80%]">
                <img className="w-[20%]" src={Post} alt="Profile preview" />
                <span className="text-lg font-semibold">Upload profile here</span>
                <input
                  type="file"
                  className="border p-2 rounded-md text-white bg-sky-500 w-[35%]"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <input
                  type="text"
                  className="p-1 border m-4 rounded-md"
                  placeholder="Enter bio..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <div className="gender flex m-4">
                  <span>Select Gender: </span>
                  <input
                    type="radio"
                    name="gender"
                    value="m"
                    checked={gender === "m"}
                    onChange={() => setGender("m")}
                  />
                  <label>Male</label>
                  <input
                    type="radio"
                    name="gender"
                    value="f"
                    checked={gender === "f"}
                    onChange={() => setGender("f")}
                  />
                  <label>Female</label>
                </div>
                <input
                  type="button"
                  value="Upload"
                  className="border font-semibold text-white p-2 w-[30%] m-4 rounded-md bg-red-600"
                  onClick={editProfile}
                  disabled={!file || !bio || !gender}  // Disable button if any field is empty
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Editprofiledialogue;
