import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { BookOpen, User, GraduationCap, ChevronLeft } from "lucide-react";
import Navbar from "./Navbar";

const Signup = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(""); // "student" or "mentor"
  const [step, setStep] = useState(1); // 1: User Type Selection, 2: Form, 3: Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
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

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    setStep(2);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Add user type to the data
      const userData = {
        ...data,
        userType: userType,
      };

      // Store user data in localStorage for facial recognition step
      localStorage.setItem("userData", JSON.stringify(userData));

      // Navigate to facial data capture
      navigate("/facialData");

    } catch (error) {
      console.error("Registration error:", error);
      showError(error.response?.data?.message || "Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Render user type selection step
  const renderUserTypeSelection = () => {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Join EDUverse</h2>
        <p className="text-gray-600 text-center mb-8">
          Choose how you want to use our platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="border border-gray-200 rounded-xl p-6 text-center hover:border-indigo-500 hover:shadow-md transition cursor-pointer"
            onClick={() => handleUserTypeSelection("student")}
          >
            <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <GraduationCap size={32} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Student</h3>
            <p className="text-gray-600 text-sm">
              Join as a student to access courses, connect with mentors, and track your learning progress.
            </p>
          </div>

          <div
            className="border border-gray-200 rounded-xl p-6 text-center hover:border-indigo-500 hover:shadow-md transition cursor-pointer"
            onClick={() => handleUserTypeSelection("mentor")}
          >
            <div className="bg-indigo-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <User size={32} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Mentor</h3>
            <p className="text-gray-600 text-sm">
              Join as a mentor to share your knowledge, create courses, and help students achieve their goals.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/edu/login" className="text-indigo-600 font-medium hover:text-indigo-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  };

  // Render student registration form
  const renderStudentForm = () => {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl p-8">
        <button
          onClick={() => setStep(1)}
          className="flex items-center text-indigo-600 mb-6 hover:text-indigo-800 transition"
        >
          <ChevronLeft size={16} />
          <span>Back</span>
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Student Registration</h2>
        <p className="text-gray-600 text-center mb-6">
          Create your student account to start learning
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                {...register("fullname", { required: "Full name is required" })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="John Doe"
              />
              {errors.fullname && (
                <p className="mt-1 text-sm text-red-600">{errors.fullname.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                {...register("username", { required: "Username is required" })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="johndoe123"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>
          </div>

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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
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
            <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Education Level
            </label>
            <select
              {...register("educationLevel", { required: "Education level is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select your education level</option>
              <option value="high_school">High School</option>
              <option value="undergraduate">Undergraduate</option>
              <option value="graduate">Graduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="professional">Professional</option>
            </select>
            {errors.educationLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.educationLevel.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
              Interests (Select at least one)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <input
                  {...register("interests", { required: "Select at least one interest" })}
                  type="checkbox"
                  value="programming"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="programming" className="ml-2 block text-sm text-gray-700">
                  Programming
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register("interests")}
                  type="checkbox"
                  value="design"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="design" className="ml-2 block text-sm text-gray-700">
                  Design
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register("interests")}
                  type="checkbox"
                  value="business"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="business" className="ml-2 block text-sm text-gray-700">
                  Business
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register("interests")}
                  type="checkbox"
                  value="marketing"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="marketing" className="ml-2 block text-sm text-gray-700">
                  Marketing
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register("interests")}
                  type="checkbox"
                  value="science"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="science" className="ml-2 block text-sm text-gray-700">
                  Science
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register("interests")}
                  type="checkbox"
                  value="languages"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="languages" className="ml-2 block text-sm text-gray-700">
                  Languages
                </label>
              </div>
            </div>
            {errors.interests && (
              <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              {...register("termsAccepted", { required: "You must accept the terms" })}
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-800">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-800">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="mt-1 text-sm text-red-600">{errors.termsAccepted.message}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              {isSubmitting ? "Creating Account..." : "Continue to Face Registration"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Render mentor registration form
  const renderMentorForm = () => {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl p-8">
        <button
          onClick={() => setStep(1)}
          className="flex items-center text-indigo-600 mb-6 hover:text-indigo-800 transition"
        >
          <ChevronLeft size={16} />
          <span>Back</span>
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Mentor Registration</h2>
        <p className="text-gray-600 text-center mb-6">
          Create your mentor account to start teaching
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                {...register("fullname", { required: "Full name is required" })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="John Doe"
              />
              {errors.fullname && (
                <p className="mt-1 text-sm text-red-600">{errors.fullname.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                {...register("username", { required: "Username is required" })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="johndoe123"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>
          </div>

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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
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
            <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">
              Qualifications
            </label>
            <input
              {...register("qualifications", { required: "Qualifications are required" })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., MSc Computer Science, Certified Teacher"
            />
            {errors.qualifications && (
              <p className="mt-1 text-sm text-red-600">{errors.qualifications.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <select
              {...register("experience", { required: "Experience is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select years of experience</option>
              <option value="0-1">Less than 1 year</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">More than 10 years</option>
            </select>
            {errors.experience && (
              <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
              Hourly Rate (USD)
            </label>
            <input
              {...register("hourlyRate", {
                required: "Hourly rate is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Please enter a valid number",
                },
              })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="25"
            />
            {errors.hourlyRate && (
              <p className="mt-1 text-sm text-red-600">{errors.hourlyRate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-1">
              Areas of Expertise (Select at least one)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <input
                  {...register("expertise", { required: "Select at least one area of expertise" })}
                  type="checkbox"
                  value="programming"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="programming" className="ml-2 block text-sm text-gray-700">
                  Programming
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register("expertise")}
                  type="checkbox"
                  value="design"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="design" className="ml-2 block text-sm text-gray-700">
                  Design
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register("expertise")}
                  type="checkbox"
                  value="business"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="business" className="ml-2 block text-sm text-gray-700">
                  Business
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register("expertise")}
                  type="checkbox"
                  value="marketing"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="marketing" className="ml-2 block text-sm text-gray-700">
                  Marketing
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register("expertise")}
                  type="checkbox"
                  value="science"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="science" className="ml-2 block text-sm text-gray-700">
                  Science
                </label>
              </div>
              <div className="flex items-center">
                <input
                  {...register("expertise")}
                  type="checkbox"
                  value="languages"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="languages" className="ml-2 block text-sm text-gray-700">
                  Languages
                </label>
              </div>
            </div>
            {errors.expertise && (
              <p className="mt-1 text-sm text-red-600">{errors.expertise.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio (Tell students about yourself)
            </label>
            <textarea
              {...register("bio", {
                required: "Bio is required",
                maxLength: {
                  value: 500,
                  message: "Bio cannot exceed 500 characters",
                },
              })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Share your teaching philosophy, experience, and what students can expect from your courses..."
            ></textarea>
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {watch("bio")?.length || 0}/500 characters
            </p>
          </div>

          <div className="flex items-center">
            <input
              {...register("termsAccepted", { required: "You must accept the terms" })}
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-800">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-800">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="mt-1 text-sm text-red-600">{errors.termsAccepted.message}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
              {isSubmitting ? "Creating Account..." : "Continue to Face Registration"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 px-4">
        {step === 1 && renderUserTypeSelection()}
        {step === 2 && userType === "student" && renderStudentForm()}
        {step === 2 && userType === "mentor" && renderMentorForm()}
      </div>
    </div>
  );
};

export default Signup;
