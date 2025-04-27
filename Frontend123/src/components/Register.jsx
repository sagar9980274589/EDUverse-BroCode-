import React from "react";
import logo from "../assets/memoria.png";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const successToast = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  function submitHandler(data) {
    // ✅ Store user data in localStorage
    localStorage.setItem("userData", JSON.stringify(data));

    // ✅ Navigate to Facial Data Capture
    navigate("/facialData");
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="form w-100% flex flex-col border-2 border-slate-200 lg:w-[25%] m-auto h-[97%] items-center p-0 justify-center">
        <img src={logo} className="w-[50%]" alt="Logo" />
        <span className="w-[55%] text-center font-bold text-slate-500">
          Sign up to see photos and videos from your friends.
        </span>
        <form onSubmit={handleSubmit(submitHandler)} className="flex w-[100%] h-[60%] flex-col items-center justify-center">
          <input {...register("email")} className="mx-auto bg-sky-50 my-2 w-[80%] p-2 border rounded-sm" required placeholder="Email" type="email" />
          <input {...register("password")} className="mx-auto bg-sky-50 my-2 w-[80%] p-2 border rounded-sm" required placeholder="Password" type="password" />
          <input {...register("username")} className="mx-auto bg-sky-50 my-2 w-[80%] p-2 border rounded-sm" required placeholder="Username" type="text" />
          <input {...register("fullname")} className="mx-auto bg-sky-50 my-2 w-[80%] p-2 border rounded-sm" required placeholder="Full Name" type="text" />
          <p className="text-center my-1 text-slate-400 text-sm w-[80%] mx-auto">
            By signing up, you agree to our Terms, Privacy Policy, and Cookies Policy.
          </p>
          <button disabled={isSubmitting} className="bg-blue-400 text-white my-1 w-[80%] p-2 rounded-md">
            {isSubmitting ? "Registering..." : "Next → Capture Face"}
          </button>
        </form>
        <span className="text-blue-400 cursor-pointer" onClick={() => navigate("/login")}>Log in</span>
      </div>
    </div>
  );
};

export default Register;
