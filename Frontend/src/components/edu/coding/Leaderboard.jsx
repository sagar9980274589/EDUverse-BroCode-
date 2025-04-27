import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Award, ChevronRight, ChevronLeft, AlertCircle, Trophy, Medal, Star, Code, Flame } from 'lucide-react';
import { CODING_API_URL } from './config';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const user = useSelector((state) => state.data.userdata);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        try {
          const response = await axios.get(`${CODING_API_URL}/leaderboard?page=${currentPage}&limit=10`);

          if (response.data.success) {
            setLeaderboard(response.data.leaderboard || []);
            setTotalPages(response.data.totalPages || 1);
          } else {
            // Empty leaderboard is not an error
            setLeaderboard([]);
            setTotalPages(1);
          }
        } catch (error) {
          console.error('Error fetching leaderboard:', error);
          // If API returns 404, it means no leaderboard data yet
          if (error.response && error.response.status === 404) {
            setLeaderboard([]);
            setTotalPages(1);
          } else {
            setError('Failed to fetch leaderboard');
          }
        }
      } catch (error) {
        console.error('Error in leaderboard fetch process:', error);
        setError('Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Get rank icon based on position
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy size={20} className="text-yellow-500" />;
      case 2:
        return <Medal size={20} className="text-gray-400" />;
      case 3:
        return <Medal size={20} className="text-amber-700" />;
      default:
        return <span className="w-5 h-5 inline-flex items-center justify-center">{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 mb-4">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center flex-col text-center py-6">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load leaderboard</h3>
          <p className="text-gray-600 mb-4">We couldn't load the coding challenge leaderboard. Please try again later.</p>
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

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Award className="text-indigo-600 mr-2" size={24} />
            <h3 className="text-lg font-medium text-gray-900">Coding Challenge Leaderboard</h3>
          </div>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Code size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No rankings available yet. Start solving challenges to appear on the leaderboard!</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solved</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboard.map((entry) => {
                    const isCurrentUser = user && entry.student._id === user._id;

                    return (
                      <tr
                        key={entry._id}
                        className={`hover:bg-gray-50 ${isCurrentUser ? 'bg-indigo-50' : ''}`}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getRankIcon(entry.rank)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                              {entry.student.profile ? (
                                <img
                                  src={entry.student.profile}
                                  alt={entry.student.username}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                                  {entry.student.username.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {entry.student.fullname}
                                {isCurrentUser && <span className="ml-2 text-xs text-indigo-600">(You)</span>}
                              </div>
                              <div className="text-sm text-gray-500">@{entry.student.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            <Star size={16} className="text-yellow-500 mr-1" />
                            {entry.score} points
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {entry.totalSolved} challenges
                          </div>
                          <div className="text-xs text-gray-500">
                            {entry.easyCount} easy · {entry.mediumCount} medium · {entry.hardCount} hard
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Flame size={16} className="text-orange-500 mr-1" />
                            <span className="text-sm font-medium">{entry.streak} days</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
