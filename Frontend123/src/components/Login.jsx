import React, { useState } from "react";
import logo from "../assets/memoria.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../AxiosInstance";
import { useDispatch } from "react-redux";
import { setuser } from "../UserSlice";
import Eduversa from "./edu/Eduversa";

const Login = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { isLoading },
  } = useForm();

  const sucess = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const navigate = useNavigate();

  async function submithandler(data) {
    try {
      const response = await axios.post(
        "http://localhost:3000/user/login",
        data
      );
      if (response.status == 200) {
        localStorage.setItem("token", response?.data?.token);

        (async function fetchUserData() {
          try {
            const res = await api.get("/user/getprofile");
            if (res.data.success) {
              dispatch(setuser(res.data.user));
             
            } else {
              navigate("/login");
            }
          } catch (err) {
            console.log("Error fetching user:", err);
            navigate("/login");
          } 
        })();

        if (!isLoading) {
          sucess("logged in");
          navigate("/");
        }

      } else {
        toast.error(response?.data?.message, {
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
      toast.error(err.response?.data?.message, {
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
    // <div className="w-full h-screen flex justify-center items-center ">
    //   <div className="form w-100% flex flex-col border-2 m-2  border-slate-200 lg:w-[25%] m-x-auto h-[97%] items-center p-0 justify-center">
    //     <img src={logo} className="w-[50%]" />
    //     <span className="w-[55%]  text-center font-bold text-slate-500">
    //       Sign in to see photos and videos from your friends.
    //     </span>
    //     <form
    //       onSubmit={handleSubmit(submithandler)}
    //       className="flex w-[100%] h-[40%] flex-col items-center justify-center "
    //     >
    //       <input
    //         {...register("email")}
    //         name="email"
    //         className="mx-auto bg-sky-50 my-2  border-1 rounded-sm w-[80%]  border-black p-2 "
    //         required
    //         placeholder="Email"
    //         type="email"
    //       />
    //       <input
    //         {...register("password")}
    //         name="password"
    //         className="mx-auto bg-sky-50 my-2  border-1 rounded-sm w-[80%]  border-black p-2 "
    //         required
    //         placeholder="password"
    //         type="password"
    //       />

    //       <p className="text-center my-1 text-slate-400 text-sm w-[80%] m-x-auto">
    //         People who use our service may have uploaded your contact
    //         information to Memoria. Learn More By signing up, you agree to our
    //         Terms , Privacy Policy and Cookies Policy
    //       </p>
    //       <button
    //         disabled={isLoading}
    //         className="bg-blue-400 cursor-pointer my-1 text-white m-x-auto w-[80%] p-2 rounded-md"
    //         type="submit"
    //       >
    //         {isLoading ? "Logging in..." : "Log in"}
    //       </button>
    //     </form>
    //     <span className="text-center text-black-400 text-sm w-[30%] m-x-auto">
    //       Dont have an account?
    //     </span>
    //     <span
    //       className="text-blue-400 cursor-pointer"
    //       onClick={() => {
    //         navigate("/register");
    //       }}
    //     >
    //       Register
    //     </span>
    //   </div>
    
    // </div>
      <Eduversa/>
  );
};

export default Login;
