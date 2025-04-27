import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Github, ExternalLink, Code, Star, GitFork, Calendar, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../AxiosInstance';

const GitHubConnect = () => {
  const user = useSelector((state) => state.data.userdata);
  const [githubUsername, setGithubUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sortBy, setSortBy] = useState('updated');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [languages, setLanguages] = useState([]);

  // Load GitHub username from user data
  useEffect(() => {
    if (user && user.githubUsername) {
      setGithubUsername(user.githubUsername);
      setIsConnected(true);
      fetchRepositories();
    } else {
      setIsConnected(false);
      setRepositories([]);
    }
  }, [user]);

  // Connect GitHub account
  const connectGitHub = async (e) => {
    e.preventDefault();

    if (!githubUsername.trim()) {
      toast.error('Please enter a GitHub username');
      return;
    }

    setIsConnecting(true);

    try {
      const response = await api.post('/user/connect-github', { githubUsername });

      if (response.data.success) {
        setIsConnected(true);
        setRepositories(response.data.repos);

        // Extract unique languages
        const langs = [...new Set(response.data.repos
          .map(repo => repo.language)
          .filter(lang => lang !== null))];
        setLanguages(langs);

        toast.success('GitHub account connected successfully!');
      } else {
        toast.error(response.data.message || 'Failed to connect GitHub account');
      }
    } catch (error) {
      console.error('Error connecting GitHub:', error);
      toast.error(error.response?.data?.message || 'GitHub username not found or API rate limit exceeded');
    } finally {
      setIsConnecting(false);
    }
  };

  // Fetch repositories
  const fetchRepositories = async () => {
    if (!user.githubUsername) return;

    setIsLoading(true);

    try {
      const response = await api.get('/user/github-repos');

      if (response.data.success) {
        setRepositories(response.data.repos);

        // Extract unique languages
        const langs = [...new Set(response.data.repos
          .map(repo => repo.language)
          .filter(lang => lang !== null))];
        setLanguages(langs);
      } else {
        toast.error(response.data.message || 'Failed to fetch repositories');
      }
    } catch (error) {
      console.error('Error fetching repositories:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch repositories');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get sorted and filtered repositories
  const getSortedAndFilteredRepos = () => {
    let filteredRepos = repositories;

    // Apply language filter
    if (filterLanguage) {
      filteredRepos = filteredRepos.filter(repo => repo.language === filterLanguage);
    }

    // Apply sorting
    return filteredRepos.sort((a, b) => {
      if (sortBy === 'stars') {
        return b.stargazers_count - a.stargazers_count;
      } else if (sortBy === 'forks') {
        return b.forks_count - a.forks_count;
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'created') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else { // updated
        return new Date(b.updated_at) - new Date(a.updated_at);
      }
    });
  };

  // Get language color
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      HTML: '#e34c26',
      CSS: '#563d7c',
      C: '#555555',
      'C++': '#f34b7d',
      'C#': '#178600',
      Ruby: '#701516',
      Go: '#00ADD8',
      PHP: '#4F5D95',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Rust: '#dea584',
      Dart: '#00B4AB',
    };

    return colors[language] || '#8257e5';
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <Github className="mr-2 text-gray-700" size={20} />
          GitHub Projects
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Connect your GitHub account to showcase your projects
        </p>
      </div>

      <div className="p-6">
        {!isConnected ? (
          <form onSubmit={connectGitHub} className="space-y-4">
            <div>
              <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700 mb-1">
                GitHub Username
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="githubUsername"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your GitHub username"
                />
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition flex items-center"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Connecting...
                    </>
                  ) : (
                    <>Connect</>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Github className="mr-2 text-gray-700" size={20} />
                <span className="font-medium text-gray-800">Connected to: </span>
                <a
                  href={`https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  {githubUsername}
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      const response = await api.get('/user/refresh-github');
                      if (response.data.success) {
                        setRepositories(response.data.repos);

                        // Extract unique languages
                        const langs = [...new Set(response.data.repos
                          .map(repo => repo.language)
                          .filter(lang => lang !== null))];
                        setLanguages(langs);

                        toast.success('GitHub repositories refreshed successfully!');
                      }
                    } catch (error) {
                      console.error('Error refreshing GitHub data:', error);
                      toast.error('Failed to refresh GitHub data');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>

                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to disconnect your GitHub account?')) {
                      try {
                        const response = await api.post('/user/disconnect-github');
                        if (response.data.success) {
                          setGithubUsername('');
                          setIsConnected(false);
                          setRepositories([]);
                          toast.success('GitHub account disconnected successfully!');
                        }
                      } catch (error) {
                        console.error('Error disconnecting GitHub:', error);
                        toast.error('Failed to disconnect GitHub account');
                      }
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Disconnect
                </button>
              </div>
            </div>

            {/* Filters and Sorting */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="updated">Recently Updated</option>
                  <option value="created">Recently Created</option>
                  <option value="stars">Stars</option>
                  <option value="forks">Forks</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="filterLanguage" className="text-sm font-medium text-gray-700">
                  Filter by language:
                </label>
                <select
                  id="filterLanguage"
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Languages</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Repositories List */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
              </div>
            ) : repositories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getSortedAndFilteredRepos().map((repo) => (
                  <div key={repo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-indigo-600 truncate">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center"
                        >
                          <Code size={16} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{repo.name}</span>
                        </a>
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Star size={14} className="mr-1" />
                          <span>{repo.stargazers_count}</span>
                        </div>
                        <div className="flex items-center">
                          <GitFork size={14} className="mr-1" />
                          <span>{repo.forks_count}</span>
                        </div>
                      </div>
                    </div>

                    {repo.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {repo.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {repo.language && (
                        <div className="flex items-center text-xs">
                          <span
                            className="w-3 h-3 rounded-full mr-1"
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          ></span>
                          <span>{repo.language}</span>
                        </div>
                      )}

                      {repo.topics && repo.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        <span>Created: {formatDate(repo.created_at)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        <span>Updated: {formatDate(repo.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No repositories found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubConnect;
