import React from "react";
import { ArrowRight, BookOpen, Users, Award, Clock, Code } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Unlock Your Potential with <span className="text-indigo-300">EDUverse</span>
              </h1>
              <p className="mt-6 text-xl text-indigo-100 max-w-2xl">
                Welcome to EduVerse!
                The multiverse of Education 


                {/* Discover a world of knowledge with our comprehensive courses taught by industry experts.
                Learn at your own pace and take your skills to the next level. */}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/edu/courses"
                className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-lg font-semibold flex items-center transition"
              >
                Explore Courses <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link
                to="/edu/coding"
                className="bg-green-500 text-white hover:bg-green-600 px-6 py-3 rounded-lg font-semibold flex items-center transition"
              >
                Coding Challenges <Code size={18} className="ml-2" />
              </Link>
              <Link
                to="/edu/social"
                className="bg-indigo-500 text-white hover:bg-indigo-600 px-6 py-3 rounded-lg font-semibold flex items-center transition"
              >
                Educational Social <Users size={18} className="ml-2" />
              </Link>
              <Link
                to="/edu/signup"
                className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition"
              >
                Join for Free
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-indigo-200 text-sm">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50k+</div>
                <div className="text-indigo-200 text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">200+</div>
                <div className="text-indigo-200 text-sm">Instructors</div>
              </div>
            </div>
          </div>

          {/* Right column - Image or illustration */}
          <div className="relative hidden md:block">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-indigo-500 rounded-full filter blur-3xl opacity-30"></div>
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl opacity-30"></div>

            {/* Main image container with floating elements */}
            <div className="relative bg-gradient-to-br from-indigo-800/40 to-purple-800/40 rounded-2xl p-4 backdrop-blur-sm border border-white/10 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                alt="Students learning"
                className="rounded-xl w-full h-auto object-cover"
              />

              {/* Floating elements */}
              <div className="absolute -top-6 -left-6 bg-white text-indigo-800 rounded-lg p-3 shadow-lg flex items-center">
                <BookOpen className="mr-2" size={20} />
                <span className="font-semibold">Learn Anywhere</span>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white text-indigo-800 rounded-lg p-3 shadow-lg flex items-center">
                <Award className="mr-2" size={20} />
                <span className="font-semibold">Get Certified</span>
              </div>

              <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-white text-indigo-800 rounded-lg p-3 shadow-lg flex items-center">
                <Clock className="mr-2" size={20} />
                <span className="font-semibold">Learn at Your Pace</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
