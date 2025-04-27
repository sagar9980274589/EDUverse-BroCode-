import React, { useState, useEffect } from "react";
import logo from "../assets/memoria.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../AxiosInstance";
import { useDispatch } from "react-redux";
import { setuser } from "../UserSlice";
import Navbar from "./edu/Navbar";

const Login = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isEduPlatform, setIsEduPlatform] = useState(false);

  // Check if we're on the educational platform route
  useEffect(() => {
    if (location.pathname.startsWith('/edu')) {
      setIsEduPlatform(true);
    } else {
      setIsEduPlatform(false);
    }
  }, [location]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();

  const showSuccess = (message) => {
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

  const submitHandler = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/user/login",
        data
      );

      if (response.status === 200) {
        localStorage.setItem("token", response?.data?.token);

        try {
          const res = await api.get("/user/getprofile");
          if (res.data.success) {
            dispatch(setuser(res.data.user));
            showSuccess("Successfully logged in");

            // Redirect based on platform
            if (isEduPlatform) {
              navigate("/edu");
            } else {
              navigate("/");
            }
          } else {
            navigate(isEduPlatform ? "/edu/login" : "/login");
          }
        } catch (err) {
          console.log("Error fetching user:", err);
          navigate(isEduPlatform ? "/edu/login" : "/login");
        }
      } else {
        toast.error(response?.data?.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  // Render educational platform login
  if (isEduPlatform) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="pt-32 pb-20 px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-lg">
            <div className="md:flex">
              <div className="p-8 w-full">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                  <p className="text-gray-600 mt-1">Sign in to continue your learning journey</p>
                </div>

                <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      type="email"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      {...register("password", { required: "Password is required" })}
                      type="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="••••••••"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/edu/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Sign up
                    </Link>
                  </p>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6">

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render social platform login
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="form w-100% flex flex-col border-2 m-2 border-slate-200 lg:w-[25%] m-x-auto h-[97%] items-center p-0 justify-center">
        <img src={logo} className="w-[50%]" alt="Memoria logo" />
        <span className="w-[55%] text-center font-bold text-slate-500">
          Sign in to see photos and videos from your friends.
        </span>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="flex w-[100%] h-[40%] flex-col items-center justify-center"
        >
          <input
            {...register("email", { required: true })}
            name="email"
            className="mx-auto bg-sky-50 my-2 border-1 rounded-sm w-[80%] border-black p-2"
            required
            placeholder="Email"
            type="email"
          />
          <input
            {...register("password", { required: true })}
            name="password"
            className="mx-auto bg-sky-50 my-2 border-1 rounded-sm w-[80%] border-black p-2"
            required
            placeholder="Password"
            type="password"
          />

          <p className="text-center my-1 text-slate-400 text-sm w-[80%] m-x-auto">
            People who use our service may have uploaded your contact
            information to Memoria. Learn More By signing up, you agree to our
            Terms, Privacy Policy and Cookies Policy
          </p>

          <button
            disabled={isSubmitting}
            className="bg-blue-400 cursor-pointer my-1 text-white m-x-auto w-[80%] p-2 rounded-md"
            type="submit"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <span className="text-center text-black-400 text-sm w-[30%] m-x-auto">
          Don't have an account?
        </span>
        <span
          className="text-blue-400 cursor-pointer"
          onClick={() => {
            navigate("/register");
          }}
        >
          Register
        </span>

        <div className="mt-4">
          <Link to="/edu" className="text-blue-500 hover:text-blue-700">
            Visit our educational platform
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
