import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Code, Award, BarChart3, Calendar, List, Search } from 'lucide-react';
import DailyChallenge from './DailyChallenge';
import Leaderboard from './Leaderboard';
import StudentProgress from './StudentProgress';
import Navbar from '../layout/Navbar';

const CodingDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const user = useSelector((state) => state.data.userdata);
  
  const isStudent = user && user.userType === 'student';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DailyChallenge />
            {isStudent && <StudentProgress />}
            <Leaderboard />
          </div>
        );
      case 'daily':
        return <DailyChallenge />;
      case 'progress':
        return isStudent ? <StudentProgress /> : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <Code size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">Progress tracking is only available for students.</p>
          </div>
        );
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <div>Invalid tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Code className="mr-3 text-indigo-600" size={32} />
              Coding Challenges
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Improve your coding skills by solving daily challenges and compete with other students on the leaderboard.
            </p>
          </div>
          
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-3 text-sm font-medium flex items-center whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 size={18} className="mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('daily')}
                className={`px-4 py-3 text-sm font-medium flex items-center whitespace-nowrap ${
                  activeTab === 'daily'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar size={18} className="mr-2" />
                Daily Challenge
              </button>
              {isStudent && (
                <button
                  onClick={() => setActiveTab('progress')}
                  className={`px-4 py-3 text-sm font-medium flex items-center whitespace-nowrap ${
                    activeTab === 'progress'
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 size={18} className="mr-2" />
                  My Progress
                </button>
              )}
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-4 py-3 text-sm font-medium flex items-center whitespace-nowrap ${
                  activeTab === 'leaderboard'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Award size={18} className="mr-2" />
                Leaderboard
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-3 text-sm font-medium flex items-center whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List size={18} className="mr-2" />
                All Challenges
              </button>
              
              {/* Search (placeholder for future implementation) */}
              <div className="ml-auto px-4 flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search challenges..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CodingDashboard;
