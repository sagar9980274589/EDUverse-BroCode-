import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  BarChart2,
  Clock,
  BookOpen,
  Calendar,
  Video,
  FileText,
  Download,
  CheckCircle,
  MessageSquare,
  PenTool
} from 'lucide-react';
import { toast } from 'react-toastify';

const LearningStats = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.data.userdata);

  useEffect(() => {
    fetchLearningStats();
  }, [userId]);

  const fetchLearningStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        userId ? `http://localhost:3000/learning/stats/${userId}` : 'http://localhost:3000/learning/stats',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setStats(response.data.stats);
      } else {
        toast.error('Failed to fetch learning statistics');
      }
    } catch (error) {
      console.error('Error fetching learning statistics:', error);
      toast.error(error.response?.data?.message || 'Error fetching learning statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0 minutes';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  };

  const getActivityTypeIcon = (type) => {
    switch (type) {
      case 'course_view':
        return <BookOpen size={16} className="text-blue-500" />;
      case 'video_watch':
        return <Video size={16} className="text-green-500" />;
      case 'course_complete':
        return <CheckCircle size={16} className="text-purple-500" />;
      case 'section_complete':
        return <CheckCircle size={16} className="text-indigo-500" />;
      case 'material_download':
        return <Download size={16} className="text-orange-500" />;
      case 'quiz_attempt':
        return <FileText size={16} className="text-red-500" />;
      case 'assignment_submit':
        return <FileText size={16} className="text-teal-500" />;
      case 'note_create':
        return <PenTool size={16} className="text-yellow-500" />;
      case 'discussion_participate':
        return <MessageSquare size={16} className="text-pink-500" />;
      default:
        return <BookOpen size={16} className="text-gray-500" />;
    }
  };

  const getActivityTypeLabel = (type) => {
    switch (type) {
      case 'course_view':
        return 'Course Views';
      case 'video_watch':
        return 'Videos Watched';
      case 'course_complete':
        return 'Courses Completed';
      case 'section_complete':
        return 'Sections Completed';
      case 'material_download':
        return 'Materials Downloaded';
      case 'quiz_attempt':
        return 'Quizzes Attempted';
      case 'assignment_submit':
        return 'Assignments Submitted';
      case 'note_create':
        return 'Notes Created';
      case 'discussion_participate':
        return 'Discussion Participations';
      default:
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
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

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <BarChart2 className="text-indigo-500 mr-2" size={24} />
          <h3 className="text-lg font-medium text-gray-900">Learning Statistics</h3>
        </div>
        <div className="text-center py-8">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-800 mb-2">No Learning Activity Yet</h4>
          <p className="text-gray-600 mb-6">
            Start learning to see your statistics!
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
          <BarChart2 className="text-indigo-500 mr-2" size={20} />
          <h3 className="font-medium text-gray-800">Learning Statistics</h3>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <BookOpen className="text-indigo-500 mr-2" size={18} />
              <h4 className="font-medium text-gray-700">Total Activities</h4>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{stats.totalActivities}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="text-blue-500 mr-2" size={18} />
              <h4 className="font-medium text-gray-700">Total Time Spent</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatTime(stats.totalTimeSpent)}</p>
          </div>
        </div>

        {/* Activities by Type */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Activities by Type</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(stats.activitiesByType).map(([type, count]) => (
                <div key={type} className="flex items-center">
                  {getActivityTypeIcon(type)}
                  <span className="ml-2 text-gray-700">{getActivityTypeLabel(type)}:</span>
                  <span className="ml-auto font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activities by Course */}
        {stats.activitiesByCourse && stats.activitiesByCourse.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Most Active Courses</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                {stats.activitiesByCourse
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((course) => (
                    <div key={course.id} className="flex items-center">
                      <BookOpen size={16} className="text-indigo-500 mr-2" />
                      <span className="text-gray-700 truncate flex-1">{course.name}</span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2">{formatTime(course.timeSpent)}</span>
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          {course.count} activities
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Learning Patterns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activities by Day */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Activities by Day</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                {Object.entries(stats.activitiesByDay).map(([day, count]) => (
                  <div key={day} className="flex items-center">
                    <Calendar size={16} className="text-indigo-500 mr-2" />
                    <span className="text-gray-700">{day}</span>
                    <div className="ml-auto flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{
                            width: `${Math.min(100, (count / Math.max(...Object.values(stats.activitiesByDay).map(Number))) * 100)}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activities by Hour */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Peak Learning Hours</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="h-40 flex items-end justify-between space-x-1">
                {stats.activitiesByHour.map((count, hour) => {
                  const maxCount = Math.max(...stats.activitiesByHour);
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div key={hour} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-indigo-500 rounded-t"
                        style={{ height: `${height}%` }}
                        title={`${hour}:00 - ${count} activities`}
                      ></div>
                      {hour % 3 === 0 && (
                        <div className="text-xs text-gray-500 mt-1">{hour}</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-gray-500 text-center mt-2">Hour of Day</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningStats;
