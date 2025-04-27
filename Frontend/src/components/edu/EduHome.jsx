import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import { BookOpen, Users, Award, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EduHome = () => {
  // Sample featured courses data
  const featuredCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "John Smith",
      rating: 4.8,
      students: 12500,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
      category: "Programming",
      price: 89.99,
      discountPrice: 19.99,
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      instructor: "Sarah Johnson",
      rating: 4.9,
      students: 8300,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1164&q=80",
      category: "Design",
      price: 79.99,
      discountPrice: 16.99,
    },
    {
      id: 3,
      title: "Data Science and Machine Learning",
      instructor: "Michael Chen",
      rating: 4.7,
      students: 10200,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      category: "Data Science",
      price: 94.99,
      discountPrice: 24.99,
    },
    {
      id: 4,
      title: "Business Leadership & Management",
      instructor: "Emily Rodriguez",
      rating: 4.6,
      students: 7800,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      category: "Business",
      price: 69.99,
      discountPrice: 14.99,
    },
  ];

  // Sample categories
  const categories = [
    {
      name: "Programming",
      icon: <BookOpen size={24} />,
      courses: 120,
      color: "bg-blue-500",
    },
    {
      name: "Design",
      icon: <Star size={24} />,
      courses: 85,
      color: "bg-purple-500",
    },
    {
      name: "Business",
      icon: <Award size={24} />,
      courses: 75,
      color: "bg-green-500",
    },
    {
      name: "Personal Development",
      icon: <Users size={24} />,
      courses: 65,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />

      {/* Featured Courses Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Featured Courses</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Explore our most popular courses and start your learning journey today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {course.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mt-1">by {course.instructor}</p>
                
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{course.rating}</span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <div className="text-sm text-gray-600">{course.students.toLocaleString()} students</div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-indigo-600">${course.discountPrice}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">${course.price}</span>
                  </div>
                  <Link to={`/edu/course/${course.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/edu/courses"
            className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800"
          >
            View All Courses <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Browse Categories</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Explore courses by category and find the perfect match for your learning goals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/edu/category/${category.name.toLowerCase()}`}
                className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
                <p className="text-gray-600 mt-2">{category.courses} courses</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Become Instructor Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12 text-white">
              <h2 className="text-3xl font-bold">Become an Instructor</h2>
              <p className="mt-4 text-indigo-100">
                Share your knowledge with the world. Create courses and help students achieve their goals.
                Join our community of expert instructors and make a difference.
              </p>
              <Link
                to="/edu/become-instructor"
                className="mt-6 inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                Start Teaching Today
              </Link>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Become an instructor"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <BookOpen className="mr-2" size={24} />
              <span className="text-xl font-bold">EDUverse</span>
            </div>
            <p className="text-gray-400">
              Empowering learners worldwide with quality education and skills for the future.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/edu/courses" className="text-gray-400 hover:text-white">Courses</Link></li>
              <li><Link to="/edu/mentors" className="text-gray-400 hover:text-white">Mentors</Link></li>
              <li><Link to="/edu/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/edu/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/edu/category/programming" className="text-gray-400 hover:text-white">Programming</Link></li>
              <li><Link to="/edu/category/design" className="text-gray-400 hover:text-white">Design</Link></li>
              <li><Link to="/edu/category/business" className="text-gray-400 hover:text-white">Business</Link></li>
              <li><Link to="/edu/category/personal" className="text-gray-400 hover:text-white">Personal Development</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-gray-400 mb-4">Stay updated with our latest courses and offers</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-gray-800 text-white px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-lg">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 pt-8 mt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} EDUverse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default EduHome;
