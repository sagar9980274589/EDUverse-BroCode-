import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import sagarImage from "../../assets/sagar.jpeg";
import karanImage from "../../assets/karan.jpeg";
import madanImage from "../../assets/madan.webp";
import afnanImage from "../../assets/afnan.jpg";
import {
  BookOpen,
  Users,
  Award,
  Code,
  Lightbulb,
  Mail,
  ExternalLink
} from "lucide-react";

const AboutPage = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Sagar H D",
      role: "Full Stack Developer",
      image: sagarImage,
      github: "https://github.com/sagarhd",
      linkedin: "https://linkedin.com/in/sagarhd",
      email: "sagar@example.com"
    },
    {
      name: "Karan S Gowda",
      role: "Frontend Developer",
      image: karanImage,
      github: "https://github.com/karansgowda",
      linkedin: "https://linkedin.com/in/karansgowda",
      email: "karan@example.com"
    },
    {
      name: "Madan K",
      role: "Backend Developer",
      image: madanImage,
      github: "https://github.com/madank",
      linkedin: "https://linkedin.com/in/madank",
      email: "madan@example.com"
    },
    {
      name: "Afnan",
      role: "UI/UX Designer",
      image: afnanImage,
      github: "https://github.com/afnan",
      linkedin: "https://linkedin.com/in/afnan",
      email: "afnan@example.com"
    }
  ];

  // Features data
  const features = [
    {
      icon: <BookOpen className="w-12 h-12 text-indigo-600" />,
      title: "Comprehensive Courses",
      description: "Access a wide range of courses created by experienced mentors across various domains."
    },
    {
      icon: <Users className="w-12 h-12 text-indigo-600" />,
      title: "Mentor-Student Interaction",
      description: "Direct communication between mentors and students through our integrated chat system."
    },
    {
      icon: <Award className="w-12 h-12 text-indigo-600" />,
      title: "Certification",
      description: "Earn certificates upon course completion to showcase your newly acquired skills."
    },
    {
      icon: <Code className="w-12 h-12 text-indigo-600" />,
      title: "Hands-on Learning",
      description: "Practice with real-world projects and assignments to reinforce your learning."
    },
    {
      icon: <Lightbulb className="w-12 h-12 text-indigo-600" />,
      title: "Personalized Learning",
      description: "Learn at your own pace with courses designed for different skill levels."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* About EDUverse */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              About <span className="text-indigo-600">EDU</span>verse
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              An innovative educational platform created by team 'BROcode' from Adichunchanagiri Institute of Technology.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-16">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-6">
                  To democratize education by providing a platform where knowledge can be shared freely between mentors and students,
                  breaking down barriers to quality education and fostering a community of lifelong learners.
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
                <p className="text-gray-600">
                  To create a world where quality education is accessible to everyone, regardless of their background or location,
                  empowering individuals to achieve their full potential through knowledge and skills.
                </p>
              </div>
              <div className="md:w-1/2 bg-indigo-600 p-8 md:p-12 text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">What Sets Us Apart</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p>Separate signup flows for mentors and students</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p>Course creation with YouTube video links, playlists, and uploadable materials</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p>Real-time chat functionality for enrolled students</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p>Intuitive user interface with direct navigation options</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p>Integrated AI chatbot for instant assistance</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Meet the Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center">
                  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-6 border-4 border-indigo-100 flex items-center justify-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-indigo-600 mb-4">{member.role}</p>
                  <div className="flex justify-center space-x-3">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Mail size={20} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* College Information */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-16">
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Adichunchanagiri Institute of Technology</h2>
              <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
                EDUverse was developed as a project at Adichunchanagiri Institute of Technology,
                a premier engineering institution committed to excellence in education and innovation.
              </p>
              <a
                href="https://aitckm.edu.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
              >
                Visit College Website <ExternalLink size={16} className="ml-1" />
              </a>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Ready to Start Learning?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/edu/signup"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Sign Up Now
              </Link>
              <Link
                to="/edu/courses"
                className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
