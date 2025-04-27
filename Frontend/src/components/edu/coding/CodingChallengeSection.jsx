import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Award, Star, TrendingUp, ChevronRight } from 'lucide-react';
import CodingChallengeButton from './CodingChallengeButton';

const CodingChallengeSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sharpen Your Coding Skills
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Take on daily coding challenges, compete with other students, and climb the leaderboard to showcase your programming prowess.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Daily Challenge Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition">
            <div className="h-3 bg-green-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mb-4">
                <Code size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Daily Challenges</h3>
              <p className="text-gray-600 mb-4">
                Solve a new coding problem every day to build your skills and maintain your streak.
              </p>
              <Link
                to="/edu/coding/daily-challenge"
                className="text-green-600 font-medium flex items-center hover:text-green-700"
              >
                Today's Challenge <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>

          {/* Leaderboard Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition">
            <div className="h-3 bg-indigo-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Leaderboard</h3>
              <p className="text-gray-600 mb-4">
                Compete with other students and see where you rank based on problems solved.
              </p>
              <Link
                to="/edu/coding/leaderboard"
                className="text-indigo-600 font-medium flex items-center hover:text-indigo-700"
              >
                View Rankings <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>

          {/* Progress Tracking Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition">
            <div className="h-3 bg-purple-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-lg mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600 mb-4">
                Monitor your improvement over time with detailed statistics and insights.
              </p>
              <Link
                to="/edu/coding"
                className="text-purple-600 font-medium flex items-center hover:text-purple-700"
              >
                My Dashboard <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Challenge Preview */}
        <div className="mt-16 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center mb-2">
                  <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full mr-2">
                    Featured Challenge
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} className="text-gray-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Two Sum Problem</h3>
                <p className="text-gray-600 mb-4 max-w-2xl">
                  Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded mr-3">Easy</span>
                  <span>Solved by 2,345 students</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <CodingChallengeButton size="lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodingChallengeSection;
