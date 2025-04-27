import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Flame, Award, Calendar, BarChart2, BookOpen, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ActivityHeatmap from './ActivityHeatmap';

const LearningStreak = ({ userId }) => {
  const user = useSelector((state) => state.data.userdata);
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchStreakData();
  }, [userId]);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        userId ? `http://localhost:3000/learning/streak-info/${userId}` : 'http://localhost:3000/learning/streak-info',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setStreakData(response.data.streakInfo);
        setRecentActivities(response.data.recentActivities || []);
      } else {
        toast.error('Failed to fetch streak data');
      }
    } catch (error) {
      console.error('Error fetching streak data:', error);
      toast.error(error.response?.data?.message || 'Error fetching streak data');
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

  const formatTime = (seconds) => {
    if (!seconds) return '0m';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case 'course_view':
        return <BookOpen size={16} className="text-blue-600" />;
      case 'video_watch':
        return <BookOpen size={16} className="text-green-600" />;
      case 'course_complete':
        return <Award size={16} className="text-purple-600" />;
      case 'section_complete':
        return <BookOpen size={16} className="text-indigo-600" />;
      case 'material_download':
        return <BookOpen size={16} className="text-orange-600" />;
      case 'quiz_attempt':
        return <BookOpen size={16} className="text-red-600" />;
      case 'assignment_submit':
        return <BookOpen size={16} className="text-teal-600" />;
      case 'note_create':
        return <BookOpen size={16} className="text-yellow-600" />;
      case 'discussion_participate':
        return <BookOpen size={16} className="text-pink-600" />;
      default:
        return <BookOpen size={16} className="text-gray-600" />;
    }
  };

  const getActivityLabel = (activity) => {
    switch (activity.activityType) {
      case 'course_view':
        return `Viewed course: ${activity.courseName || 'Unknown Course'}`;
      case 'video_watch':
        return `Watched video: ${activity.contentTitle || 'Unknown Video'}`;
      case 'course_complete':
        return `Completed course: ${activity.courseName || 'Unknown Course'}`;
      case 'section_complete':
        return `Completed section: ${activity.contentTitle || 'Unknown Section'}`;
      case 'material_download':
        return `Downloaded material: ${activity.contentTitle || 'Unknown Material'}`;
      case 'quiz_attempt':
        return `Attempted quiz: ${activity.contentTitle || 'Unknown Quiz'}`;
      case 'assignment_submit':
        return `Submitted assignment: ${activity.contentTitle || 'Unknown Assignment'}`;
      case 'note_create':
        return `Created note in: ${activity.courseName || 'Unknown Course'}`;
      case 'discussion_participate':
        return `Participated in discussion: ${activity.courseName || 'Unknown Course'}`;
      default:
        return `Learning activity in: ${activity.courseName || 'Unknown Course'}`;
    }
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
          <h3 className="text-lg font-medium text-gray-900">Learning Streak</h3>
        </div>
        <div className="text-center py-8">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-800 mb-2">No Learning Activity Yet</h4>
          <p className="text-gray-600 mb-6">
            Start learning to build your streak!
          </p>
          <a
            href="/courses"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Browse Courses
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
          <h3 className="font-medium text-gray-800">Learning Streak</h3>
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
            <p className="text-2xl font-bold text-indigo-600">{streakData.currentStreak} days</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="text-purple-500 mr-1" size={18} />
              <span className="text-sm font-medium text-gray-700">Longest Streak</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{streakData.longestStreak} days</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart2 className="text-blue-500 mr-1" size={18} />
              <span className="text-sm font-medium text-gray-700">Total Activities</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{streakData.totalActivities}</p>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Calendar className="text-gray-500 mr-1" size={16} />
            Learning Activity
          </h4>
          <ActivityHeatmap userId={userId} />
        </div>

        {/* Recent Activities */}
        {recentActivities.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activities</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity._id} className="flex items-center text-sm border-b border-gray-100 pb-2">
                  {getActivityIcon(activity.activityType)}
                  <div className="ml-2 flex-1">
                    <p className="text-gray-800">
                      {getActivityLabel(activity)}
                    </p>
                    {activity.activityDuration > 0 && (
                      <p className="text-xs text-gray-500">
                        Duration: {formatTime(activity.activityDuration)}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(activity.activityDate)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningStreak;
