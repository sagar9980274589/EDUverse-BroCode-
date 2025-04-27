import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { BookOpen, BarChart2, Calendar, Award, Clock } from 'lucide-react';
import { LearningStreak, LearningStats } from './index';
import Navbar from '../layout/Navbar';

const LearningDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const user = useSelector((state) => state.data.userdata);
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <LearningStreak userId={user?._id} />
            <LearningStats userId={user?._id} />
          </div>
        );
      case 'streak':
        return <LearningStreak userId={user?._id} />;
      case 'stats':
        return <LearningStats userId={user?._id} />;
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
              <BookOpen className="mr-3 text-indigo-600" size={32} />
              Learning Dashboard
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Track your learning progress, maintain your streak, and analyze your study habits.
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
                <BarChart2 size={18} className="mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('streak')}
                className={`px-4 py-3 text-sm font-medium flex items-center whitespace-nowrap ${
                  activeTab === 'streak'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Award size={18} className="mr-2" />
                Learning Streak
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-4 py-3 text-sm font-medium flex items-center whitespace-nowrap ${
                  activeTab === 'stats'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart2 size={18} className="mr-2" />
                Learning Statistics
              </button>
            </div>
          </div>
          
          {/* Content */}
          {renderContent()}
          
          {/* Tips Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white mt-8">
            <div className="flex items-center mb-4">
              <Award size={24} className="mr-2" />
              <h3 className="text-lg font-medium">Tips to Maintain Your Learning Streak</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Clock size={18} className="mr-2 text-indigo-200" />
                  <h4 className="font-medium">Consistency is Key</h4>
                </div>
                <p className="text-sm text-indigo-100">
                  Set aside a specific time each day for learning. Even 15 minutes daily is better than several hours once a week.
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar size={18} className="mr-2 text-indigo-200" />
                  <h4 className="font-medium">Track Your Progress</h4>
                </div>
                <p className="text-sm text-indigo-100">
                  Check your learning dashboard regularly to stay motivated by seeing your streak grow.
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <BookOpen size={18} className="mr-2 text-indigo-200" />
                  <h4 className="font-medium">Mix It Up</h4>
                </div>
                <p className="text-sm text-indigo-100">
                  Vary your learning activities between videos, quizzes, and reading to keep engaged and build a well-rounded knowledge.
                </p>
              </div>
            </div>
            
            <p className="text-sm text-indigo-100">
              Remember: Learning is a marathon, not a sprint. Consistent daily effort leads to remarkable results over time!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningDashboard;
