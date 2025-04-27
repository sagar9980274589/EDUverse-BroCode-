import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Flame, Award, Calendar, BarChart2, Github, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ContributionHeatmap from './ContributionHeatmap';

const ProjectStreak = ({ userId }) => {
  const user = useSelector((state) => state.data.userdata);
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchStreakData();
  }, [userId]);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        userId ? `http://localhost:3000/projects/streak-info/${userId}` : 'http://localhost:3000/projects/streak-info',
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

  const syncGitHubContributions = async () => {
    try {
      setSyncing(true);
      const response = await axios.post(
        'http://localhost:3000/projects/sync-github',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('GitHub contributions synced successfully');
        fetchStreakData(); // Refresh data
      } else {
        toast.error(response.data.message || 'Failed to sync GitHub contributions');
      }
    } catch (error) {
      console.error('Error syncing GitHub contributions:', error);
      toast.error(error.response?.data?.message || 'Error syncing GitHub contributions');
    } finally {
      setSyncing(false);
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

  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case 'commit':
        return <Github size={16} className="text-green-600" />;
      case 'push':
        return <Github size={16} className="text-blue-600" />;
      case 'pull_request':
        return <Github size={16} className="text-purple-600" />;
      case 'issue':
        return <Github size={16} className="text-orange-600" />;
      case 'repo_create':
        return <Github size={16} className="text-indigo-600" />;
      case 'repo_update':
        return <Github size={16} className="text-teal-600" />;
      case 'manual_update':
        return <Github size={16} className="text-gray-600" />;
      default:
        return <Github size={16} className="text-gray-600" />;
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
          <Flame className="text-orange-500 mr-2" size={24} />
          <h3 className="text-lg font-medium text-gray-900">Project Streak</h3>
        </div>
        <div className="text-center py-8">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-800 mb-2">No Streak Data Yet</h4>
          <p className="text-gray-600 mb-6">
            Start contributing to projects to build your streak!
          </p>
          {user && user.githubUsername && (
            <button
              onClick={syncGitHubContributions}
              disabled={syncing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center justify-center mx-auto"
            >
              {syncing ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Github size={16} className="mr-2" />
                  Sync GitHub Contributions
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Flame className="text-orange-500 mr-2" size={20} />
          <h3 className="font-medium text-gray-800">Project Streak</h3>
        </div>
        {user && user.githubUsername && (
          <button
            onClick={syncGitHubContributions}
            disabled={syncing}
            className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition flex items-center"
          >
            {syncing ? (
              <>
                <RefreshCw size={12} className="mr-1 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw size={12} className="mr-1" />
                Sync GitHub
              </>
            )}
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Streak Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className="text-orange-500 mr-1" size={18} />
              <span className="text-sm font-medium text-gray-700">Current Streak</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{streakData.currentStreak} days</p>
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
              <span className="text-sm font-medium text-gray-700">Total Contributions</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{streakData.totalContributions}</p>
          </div>
        </div>

        {/* Contribution Heatmap */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Calendar className="text-gray-500 mr-1" size={16} />
            Contribution Activity
          </h4>
          <ContributionHeatmap userId={userId} />
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
                      {activity.activityType === 'commit' ? (
                        <>
                          Commit to <span className="font-medium">{activity.githubRepoName}</span>
                          {activity.activityData?.message && (
                            <span className="text-gray-500 ml-1">
                              : {activity.activityData.message.length > 30
                                ? activity.activityData.message.substring(0, 30) + '...'
                                : activity.activityData.message}
                            </span>
                          )}
                        </>
                      ) : (
                        `${activity.activityType.replace('_', ' ')} on ${activity.githubRepoName || 'a project'}`
                      )}
                    </p>
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

export default ProjectStreak;
