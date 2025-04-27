import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Calendar, Code, Award, Clock, ExternalLink, AlertCircle } from 'lucide-react';
import { CODING_API_URL } from './config';

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.data.userdata);

  useEffect(() => {
    const fetchDailyChallenge = async () => {
      try {
        setLoading(true);

        // First try to get the existing daily challenge
        try {
          const response = await axios.get(`${CODING_API_URL}/daily`);

          if (response.data.success) {
            setChallenge(response.data.challenge);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log('No existing daily challenge, trying to fetch a new one...');
        }

        // If no challenge exists, try to fetch a new one
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const fetchResponse = await axios.post(
              `${CODING_API_URL}/fetch-daily`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            if (fetchResponse.data.success) {
              setChallenge(fetchResponse.data.challenge);
            } else {
              setError('Failed to fetch daily challenge');
            }
          } catch (fetchError) {
            console.error('Error fetching new daily challenge:', fetchError);
            setError('Failed to fetch daily challenge');
          }
        } else {
          // If no token, show a placeholder challenge
          setChallenge({
            title: 'Sample Challenge: Two Sum',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            difficulty: 'Easy',
            problemId: 'SAMPLE-001',
            slug: 'two-sum',
            link: 'https://leetcode.com/problems/two-sum/',
            tags: ['Array', 'Hash Table'],
            date: new Date(),
            source: 'LeetCode'
          });
        }
      } catch (error) {
        console.error('Error in challenge fetch process:', error);
        setError('Failed to fetch daily challenge');
      } finally {
        setLoading(false);
      }
    };

    fetchDailyChallenge();
  }, []);

  // Function to get difficulty color
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center flex-col text-center py-6">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load daily challenge</h3>
          <p className="text-gray-600 mb-4">We couldn't load today's coding challenge. Please try again later.</p>
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calendar className="text-indigo-600 mr-2" size={20} />
            <h3 className="text-lg font-medium text-gray-900">Daily Coding Challenge</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
            {challenge.difficulty}
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-3">{challenge.title}</h2>

        <div className="mb-4 flex flex-wrap gap-2">
          {challenge.tags && challenge.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="prose prose-sm max-w-none mb-6">
          <div dangerouslySetInnerHTML={{ __html: challenge.description.slice(0, 300) + '...' }} />
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Code size={16} className="mr-1" />
            <span>Problem #{challenge.problemId}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-1" />
            <span>Posted {new Date(challenge.date).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/edu/coding/challenge/${challenge._id}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center"
          >
            <Code size={16} className="mr-2" />
            Solve Challenge
          </Link>

          {challenge.link && (
            <a
              href={challenge.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition flex items-center"
            >
              <ExternalLink size={16} className="mr-2" />
              View on {challenge.source}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;
