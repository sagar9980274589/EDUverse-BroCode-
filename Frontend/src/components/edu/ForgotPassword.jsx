import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Mail, ArrowLeft, Key, Lock } from "lucide-react";
import Navbar from "./Navbar";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const showSuccess = (message) => {
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

  const showError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  // Step 1: Request OTP
  const requestOTP = async (data) => {
    setIsSubmitting(true);
    setEmail(data.email);

    try {
      const response = await axios.post("http://localhost:3000/password/forgot-password", {
        email: data.email
      });

      if (response.data.success) {
        showSuccess("OTP sent to your email address. Please check your inbox.");
        setOtpSent(true);
        setStep(2);
        reset(); // Reset form for OTP input
      } else {
        showError(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      showError(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOTP = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:3000/password/verify-otp", {
        email: email,
        otp: data.otp
      });

      if (response.data.success) {
        showSuccess("OTP verified successfully");
        setOtpVerified(true);
        setStep(3);
        reset(); // Reset form for password input
      } else {
        showError(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showError(error.response?.data?.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Reset Password
  const resetPassword = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:3000/password/reset-password", {
        email: email,
        newPassword: data.password
      });

      if (response.data.success) {
        showSuccess("Password reset successfully");
        setTimeout(() => {
          navigate("/edu/login");
        }, 2000);
      } else {
        showError(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      showError(error.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    setIsSubmitting(true);

    try {
      const response = await axios.post("http://localhost:3000/password/resend-otp", {
        email: email
      });

      if (response.data.success) {
        showSuccess("OTP resent to your email address. Please check your inbox.");
      } else {
        showError(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      showError(error.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl p-8">
          <div className="text-center mb-8">
            <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              {step === 1 && <Mail size={32} className="text-indigo-600" />}
              {step === 2 && <Key size={32} className="text-indigo-600" />}
              {step === 3 && <Lock size={32} className="text-indigo-600" />}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Reset Password"}
            </h2>

            <p className="text-gray-600">
              {step === 1 && "Enter your email to receive a verification code"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Create a new password for your account"}
            </p>
          </div>

          {/* Step 1: Email Form */}
          {step === 1 && (
            <form onSubmit={handleSubmit(requestOTP)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: OTP Form */}
          {step === 2 && (
            <form onSubmit={handleSubmit(verifyOTP)} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code (OTP)
                </label>
                <input
                  {...register("otp", {
                    required: "OTP is required",
                    minLength: {
                      value: 6,
                      message: "OTP must be 6 digits",
                    },
                    maxLength: {
                      value: 6,
                      message: "OTP must be 6 digits",
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "OTP must contain only numbers",
                    },
                  })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter 6-digit OTP"
                />
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-600 hover:text-indigo-600 flex items-center"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={isSubmitting}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* Step 3: New Password Form */}
          {step === 3 && (
            <form onSubmit={handleSubmit(resetPassword)} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === watch("password") || "Passwords do not match",
                  })}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>

              <div className="flex items-center justify-start mt-4 text-sm">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-gray-600 hover:text-indigo-600 flex items-center"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Remember your password?{" "}
              <Link to="/edu/login" className="text-indigo-600 font-medium hover:text-indigo-800">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
