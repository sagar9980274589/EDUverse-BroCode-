import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Flame, Award, Calendar, Code, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import CodingHeatmap from './CodingHeatmap';

const CODING_API_URL = 'http://localhost:3000/coding';

const CodingStreak = () => {
  const user = useSelector((state) => state.data.userdata);
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (user && user._id) {
      fetchStreakData();
    }
  }, [user]);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication required');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(
        `${CODING_API_URL}/ranking`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setStreakData(response.data.ranking);
        
        // Fetch recent submissions
        const submissionsResponse = await axios.get(
          `${CODING_API_URL}/submissions?limit=5`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (submissionsResponse.data.success) {
          setSubmissions(submissionsResponse.data.submissions);
        }
      } else {
        console.error('Failed to fetch streak data');
      }
    } catch (error) {
      console.error('Error fetching streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!streakData) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <Flame className="text-indigo-500 mr-2" size={24} />
          <h3 className="text-lg font-medium text-gray-900">Coding Streak</h3>
        </div>
        <div className="text-center py-8">
          <Code size={48} className="mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-800 mb-2">No Coding Activity Yet</h4>
          <p className="text-gray-600 mb-6">
            Start solving coding challenges to build your streak!
          </p>
          <a
            href="/edu/coding"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Solve Today's Challenge
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex items-center">
          <Flame className="text-indigo-500 mr-2" size={20} />
          <h3 className="font-medium text-gray-800">Coding Streak</h3>
        </div>
      </div>

      <div className="p-6">
        {/* Streak Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="text-indigo-500 mr-1" size={18} />
              <span className="text-sm font-medium text-gray-700">Current Streak</span>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{streakData.streak} days</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="text-purple-500 mr-1" size={18} />
              <span className="text-sm font-medium text-gray-700">Longest Streak</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{streakData.longestStreak || streakData.streak} days</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="text-blue-500 mr-1" size={18} />
              <span className="text-sm font-medium text-gray-700">Problems Solved</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{streakData.totalSolved}</p>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Calendar className="text-gray-500 mr-1" size={16} />
            Coding Activity
          </h4>
          <CodingHeatmap activityData={streakData.activityHistory || {}} />
        </div>

        {/* Problem Difficulty Breakdown */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Difficulty Breakdown</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-500 mb-1">Easy</div>
                <div className="text-lg font-semibold text-green-600">{streakData.easyCount}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Medium</div>
                <div className="text-lg font-semibold text-yellow-600">{streakData.mediumCount}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Hard</div>
                <div className="text-lg font-semibold text-red-600">{streakData.hardCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        {submissions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Submissions</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {submissions.map((submission) => (
                <div key={submission._id} className="flex items-center text-sm border-b border-gray-100 pb-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${submission.status === 'Solved' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div className="flex-1">
                    <p className="text-gray-800">
                      {submission.challenge?.title || 'Unknown Challenge'}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-2">{submission.language}</span>
                      <span>{formatDate(submission.submittedAt)}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    submission.status === 'Solved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {submission.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingStreak;
