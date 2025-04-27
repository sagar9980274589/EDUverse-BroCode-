import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  BarChart3,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  Flame,
  Star,
  TrendingUp,
  Code,
  Calendar
} from 'lucide-react';
import { CODING_API_URL } from './config';

const StudentProgress = () => {
  const [ranking, setRanking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.data.userdata);

  useEffect(() => {
    const fetchStudentRanking = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        try {
          const response = await axios.get(`${CODING_API_URL}/ranking`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data.success) {
            setRanking(response.data.ranking);
          } else {
            // No ranking data yet, not an error
            setRanking(null);
          }
        } catch (error) {
          console.error('Error fetching student ranking:', error);
          if (error.response && error.response.status === 404) {
            // No ranking yet, but not an error
            setRanking(null);
          } else {
            setError('Failed to fetch ranking data');
          }
        }
      } catch (error) {
        console.error('Error in ranking fetch process:', error);
        setError('Failed to fetch ranking data');
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) {
      fetchStudentRanking();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center flex-col text-center py-6">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load progress data</h3>
          <p className="text-gray-600 mb-4">We couldn't load your coding challenge progress. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If no ranking data yet
  if (!ranking) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <BarChart3 className="text-indigo-600 mr-2" size={24} />
          <h3 className="text-lg font-medium text-gray-900">Your Coding Progress</h3>
        </div>

        <div className="text-center py-8">
          <Code size={48} className="mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-800 mb-2">No Progress Yet</h4>
          <p className="text-gray-600 mb-6">Start solving daily coding challenges to track your progress and earn a spot on the leaderboard!</p>
          <a
            href="/edu/coding/challenges"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Start Solving
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BarChart3 className="text-indigo-600 mr-2" size={24} />
            <h3 className="text-lg font-medium text-gray-900">Your Coding Progress</h3>
          </div>
          <div className="flex items-center">
            <Award className="text-indigo-600 mr-2" size={20} />
            <span className="text-lg font-bold text-gray-900">Rank #{ranking.rank}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Solved */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-indigo-800">Total Solved</h4>
              <CheckCircle size={18} className="text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-indigo-900">{ranking.totalSolved}</p>
            <div className="mt-2 text-xs text-indigo-700">
              <span className="font-medium">{ranking.easyCount}</span> easy ·
              <span className="font-medium ml-1">{ranking.mediumCount}</span> medium ·
              <span className="font-medium ml-1">{ranking.hardCount}</span> hard
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-orange-800">Current Streak</h4>
              <Flame size={18} className="text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-900">{ranking.streak} days</p>
            {ranking.lastSolvedDate && (
              <div className="mt-2 text-xs text-orange-700">
                Last solved: {new Date(ranking.lastSolvedDate).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Total Score */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-yellow-800">Total Score</h4>
              <Star size={18} className="text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-yellow-900">{ranking.score} points</p>
            <div className="mt-2 text-xs text-yellow-700">
              Easy: 1pt · Medium: 3pts · Hard: 5pts
            </div>
          </div>
        </div>

        {/* Progress Chart (Placeholder) */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-700">Solving Progress</h4>
            <div className="text-xs text-gray-500">Last 30 days</div>
          </div>

          {/* This is a placeholder for a chart - in a real app, you'd use a charting library */}
          <div className="h-40 flex items-end justify-between space-x-1">
            {[...Array(14)].map((_, index) => {
              const height = Math.floor(Math.random() * 100);
              return (
                <div
                  key={index}
                  className="bg-indigo-500 rounded-t w-full"
                  style={{ height: `${height}%` }}
                ></div>
              );
            })}
          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>2 weeks ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center mb-4">
            <TrendingUp size={20} className="mr-2" />
            <h4 className="font-medium">Next Steps</h4>
          </div>

          <p className="mb-4 text-indigo-100">
            Keep solving daily challenges to improve your rank and maintain your streak!
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="/edu/coding/daily"
              className="px-4 py-2 bg-white text-indigo-700 rounded-md hover:bg-indigo-50 transition flex items-center"
            >
              <Calendar size={16} className="mr-2" />
              Today's Challenge
            </a>
            <a
              href="/edu/coding/leaderboard"
              className="px-4 py-2 bg-indigo-500 bg-opacity-30 text-white rounded-md hover:bg-opacity-40 transition flex items-center"
            >
              <Award size={16} className="mr-2" />
              View Leaderboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
