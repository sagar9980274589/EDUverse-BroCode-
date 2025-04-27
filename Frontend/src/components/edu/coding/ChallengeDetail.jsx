import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  Clock,
  Tag,
  Award,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Code
} from 'lucide-react';
import Navbar from '../layout/Navbar';
import CodeEditor from './CodeEditor';
import { CODING_API_URL } from './config';

const ChallengeDetail = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isDailyChallenge = location.pathname === '/edu/coding/daily-challenge';
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('python');
  const [showDescription, setShowDescription] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);

        let response;

        // If it's the daily challenge route, fetch the daily challenge
        if (isDailyChallenge) {
          response = await axios.get(`${CODING_API_URL}/daily`);
        } else {
          // Fetch specific challenge by ID
          response = await axios.get(`${CODING_API_URL}/challenges/${challengeId}`);
        }

        if (response.data.success) {
          setChallenge(response.data.challenge);
        } else {
          setError('Failed to fetch challenge');
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
        setError('Failed to fetch challenge');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId, isDailyChallenge]);

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500 bg-green-50';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-50';
      case 'Hard':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  // Handle successful submission
  const handleSubmitSuccess = (nextChallenge) => {
    toast.success('Challenge completed successfully!');

    // If there's a next challenge, show a button to navigate to it
    if (nextChallenge) {
      // Create a button in the UI to navigate to the next challenge
      const nextChallengeButton = document.createElement('div');
      nextChallengeButton.className = 'fixed bottom-4 right-4 z-50';
      nextChallengeButton.innerHTML = `
        <button
          class="bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 hover:bg-indigo-700 transition"
          onclick="window.location.href='/edu/coding/challenge/${nextChallenge._id}'"
        >
          <span>Next Challenge: ${nextChallenge.title}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      `;

      // Add the button to the body
      document.body.appendChild(nextChallengeButton);

      // Remove the button after 30 seconds
      setTimeout(() => {
        if (document.body.contains(nextChallengeButton)) {
          document.body.removeChild(nextChallengeButton);
        }
      }, 30000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-28 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-center flex-col text-center py-6">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load challenge</h3>
                <p className="text-gray-600 mb-4">We couldn't load the coding challenge. Please try again later.</p>
                <button
                  onClick={() => navigate('/edu/coding')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Back to Challenges
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Challenge header */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/edu/coding')}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to {isDailyChallenge ? 'Dashboard' : 'Challenges'}
            </button>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{challenge.title}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>

                  <div className="flex items-center text-gray-600 text-sm">
                    <Clock size={14} className="mr-1" />
                    <span>{new Date(challenge.date).toLocaleDateString()}</span>
                  </div>

                  {challenge.source && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <Code size={14} className="mr-1" />
                      <span>{challenge.source}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left panel: Problem description */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="flex items-center justify-between w-full p-4 text-left"
                >
                  <div className="flex items-center">
                    <BookOpen size={18} className="text-indigo-600 mr-2" />
                    <h2 className="text-lg font-medium text-gray-900">Problem Description</h2>
                  </div>
                  {showDescription ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {showDescription && (
                <div className="p-4">
                  <div
                    className="prose prose-indigo max-w-none"
                    dangerouslySetInnerHTML={{ __html: challenge.description }}
                  />

                  {challenge.tags && challenge.tags.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Tag size={14} className="mr-1" />
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {challenge.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right panel: Code editor */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-250px)]">
              <CodeEditor
                challenge={challenge}
                language={language}
                setLanguage={setLanguage}
                onSubmitSuccess={handleSubmitSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
