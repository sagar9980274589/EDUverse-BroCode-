import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Github, Star, Code, RefreshCw, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

const GitHubProjects = ({ userId } = {}) => {
  const user = useSelector((state) => state.data.userdata);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('updated'); // 'updated', 'stars', 'name'
  const [filterLanguage, setFilterLanguage] = useState('');
  const [languages, setLanguages] = useState([]);

  const fetchRepos = async () => {
    if (!user.githubUsername) {
      setLoading(false);
      setError('No GitHub username found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://api.github.com/users/${user.githubUsername}/repos`, {
        params: {
          sort: sortBy === 'name' ? 'full_name' : sortBy,
          direction: sortBy === 'name' ? 'asc' : 'desc',
          per_page: 100
        }
      });

      // Extract unique languages
      const allLanguages = response.data
        .map(repo => repo.language)
        .filter(lang => lang !== null);
      
      const uniqueLanguages = [...new Set(allLanguages)];
      setLanguages(uniqueLanguages);
      
      setRepos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      setError('Failed to fetch repositories');
      setLoading(false);
      toast.error('Failed to fetch GitHub repositories', {
        position: 'top-center',
        autoClose: 3000
      });
    }
  };

  useEffect(() => {
    fetchRepos();
  }, [user.githubUsername, sortBy]);

  // Filter repos by language if a filter is set
  const filteredRepos = filterLanguage 
    ? repos.filter(repo => repo.language === filterLanguage) 
    : repos;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="updated">Recently Updated</option>
            <option value="stars">Stars</option>
            <option value="name">Name</option>
          </select>
        </div>

        {languages.length > 0 && (
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Languages</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={fetchRepos}
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
        >
          <RefreshCw size={14} className="mr-1" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-gray-500">
          <Github size={48} className="mx-auto text-gray-300 mb-4" />
          <p>{error}</p>
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Github size={48} className="mx-auto text-gray-300 mb-4" />
          <p>No repositories found</p>
          {filterLanguage && (
            <p className="mt-2 text-sm">
              Try removing the language filter or selecting a different language.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.map(repo => (
            <div key={repo.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-indigo-600 truncate">
                  <a 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center"
                  >
                    {repo.name}
                    <ExternalLink size={14} className="ml-1 inline-block" />
                  </a>
                </h3>
                <div className="flex items-center text-yellow-500">
                  <Star size={16} className="mr-1" />
                  <span className="text-sm">{repo.stargazers_count}</span>
                </div>
              </div>
              
              {repo.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{repo.description}</p>
              )}
              
              <div className="flex items-center mt-3 text-xs text-gray-500">
                {repo.language && (
                  <div className="flex items-center mr-4">
                    <Code size={14} className="mr-1" />
                    {repo.language}
                  </div>
                )}
                <div>Updated {new Date(repo.updated_at).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GitHubProjects;
