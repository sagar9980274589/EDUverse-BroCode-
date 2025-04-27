import React, { useEffect, useState } from "react";
import Post from "../assets/post.webp";
import api from "../AxiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { setpost } from "../PostSlice";
const Createdialogue = ({ isOpen, setIsOpen }) => {
    const dispatch=useDispatch();
    const allposts=useSelector((state)=>state.posts.posts)
  const [file, setfile] = useState(null);
  const [caption, setcaption] = useState("");
  const [Loading, setLoading] = useState(false);

  async function uploadpost(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("caption", caption);

    file && formData.append("image", file);
    try {
      const res = await api.post("/user/uploadpost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        dispatch(setpost([res.data.post,...allposts]))
       
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
            setIsOpen(false);
      } else {
        toast.error(res.data.message, {
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
    } finally {
      setLoading(false);
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
          className="fixed inset-0 flex  items-center  bg-black/60  justify-center bg-opacity-60  backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white flex flex-col items-center rounded-lg shadow-black h-[75vh] shadow-lg w-[33vw] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-12 flex justify-center items-center font-semibold border-b border-slate-400">
              Create new post
            </div>
            {Loading ? (
              <div className="flex items-center justify-center h-screen">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex items-center flex-col justify-center border w-full h-[80%]">
                <img className="w-[20%]" src={Post} alt="" />
                <span className="text-lg font-semibold">
                  Upload photos here
                </span>
                <input
                  onChange={(e) => {
                    setfile(e.target.files[0]);
                  }}
                  type="file"
                  className="border p-2 rounded-md text-white bg-sky-500 w-[35%]"
                  placeholder="Select from device"
                />
                {file != null && (
                  <>
                    <input
                      onChange={(e) => {
                        setcaption(e.target.value);
                      }}
                      value={caption}
                      placeholder="Enter caption..."
                      className="p-1 border m-4 rounded:md"
                      type="text"
                    />
                    <input
                      required
                      onClick={uploadpost}
                      className="border font-semibold text-white p-2 w-[30%] m-4 rounded:md bg-red-600"
                      value="Upload"
                      type="button"
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Createdialogue;
