import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Play, Save, RefreshCw, Check, X, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { CODING_API_URL } from './config';

// Import Monaco Editor
import Editor from '@monaco-editor/react';

const CodeEditor = ({ challenge, language, setLanguage, onSubmitSuccess }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [showTestResults, setShowTestResults] = useState(false);
  const user = useSelector((state) => state.data.userdata);

  // Language options
  const languageOptions = [
    { id: 'python', name: 'Python', extension: '.py' },
    { id: 'javascript', name: 'JavaScript', extension: '.js' },
    { id: 'java', name: 'Java', extension: '.java' },
    { id: 'cpp', name: 'C++', extension: '.cpp' },
    { id: 'c', name: 'C', extension: '.c' }
  ];

  // Monaco editor options
  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: 'on',
    automaticLayout: true,
    tabSize: 2,
  };

  // Set initial code based on selected language
  useEffect(() => {
    if (challenge && challenge.starterCode && challenge.starterCode[language]) {
      setCode(challenge.starterCode[language]);
    } else {
      // Default starter code if none is provided
      const defaultCode = {
        python: '# Write your code here\n\n',
        javascript: '// Write your code here\n\n',
        java: 'public class Solution {\n  public static void main(String[] args) {\n    // Write your code here\n  }\n}',
        cpp: '#include <iostream>\n\nint main() {\n  // Write your code here\n  return 0;\n}',
        c: '#include <stdio.h>\n\nint main() {\n  // Write your code here\n  return 0;\n}'
      };
      setCode(defaultCode[language] || '// Write your code here');
    }
  }, [challenge, language]);

  // Get language ID for Monaco editor
  const getMonacoLanguage = (lang) => {
    const map = {
      'python': 'python',
      'javascript': 'javascript',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c'
    };
    return map[lang] || 'plaintext';
  };

  // Run code with custom input
  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      setOutput('Running code...');

      const response = await axios.post(`${CODING_API_URL}/execute`, {
        code,
        language,
        input: customInput
      });

      if (response.data.success) {
        const result = response.data.result;

        if (result.status.id === 3) { // Accepted
          setOutput(result.stdout || 'No output');
        } else if (result.status.id === 6) { // Compilation Error
          setOutput(`Compilation Error:\n${result.compile_output || 'Unknown compilation error'}`);
        } else {
          setOutput(`Error: ${result.stderr || result.message || 'Unknown error'}`);
        }

      } else {
        setOutput(`Error: ${response.data.message || 'Failed to execute code'}`);
      }
    } catch (error) {
      console.error('Error running code:', error);
      setOutput(`Error: ${error.response?.data?.message || error.message || 'Failed to execute code'}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit solution
  const handleSubmitSolution = async () => {
    if (!user) {
      toast.error('Please log in to submit your solution');
      return;
    }

    try {
      setIsSubmitting(true);
      setTestResults([]);
      setShowTestResults(true);

      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await axios.post(
        `${CODING_API_URL}/submit`,
        {
          challengeId: challenge._id,
          code,
          language
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setTestResults(response.data.submission.testResults);

        if (response.data.submission.allTestsPassed) {
          // Get student ranking to check streak
          try {
            const rankingResponse = await axios.get(
              `${CODING_API_URL}/ranking`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            if (rankingResponse.data.success && rankingResponse.data.ranking) {
              const { streak } = rankingResponse.data.ranking;
              if (streak > 1) {
                toast.success(`🔥 All tests passed! Your coding streak is now ${streak} days! Keep it up!`);
              } else {
                toast.success('All tests passed! Solution submitted successfully. You started a new streak!');
              }
            } else {
              toast.success('All tests passed! Solution submitted successfully.');
            }

            // Check if there's a next challenge
            if (response.data.nextChallenge) {
              const nextChallenge = response.data.nextChallenge;

              // Show a toast with the next challenge
              toast.info(
                <div>
                  <p>Ready for your next challenge?</p>
                  <a
                    href={`/edu/coding/challenge/${nextChallenge._id}`}
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    {nextChallenge.title} ({nextChallenge.difficulty})
                  </a>
                </div>,
                {
                  autoClose: 10000, // Keep it open longer
                  closeOnClick: false
                }
              );
            }
          } catch (rankingError) {
            console.error('Error fetching streak info:', rankingError);
            toast.success('All tests passed! Solution submitted successfully.');
          }

          if (onSubmitSuccess) {
            onSubmitSuccess(response.data.nextChallenge);
          }
        } else {
          toast.warning('Some tests failed. Check the results below.');
        }

      } else {
        toast.error(response.data.message || 'Failed to submit solution');
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Editor header */}
      <div className="flex items-center justify-between bg-gray-800 text-white p-2 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
          >
            {languageOptions.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
          >
            {isRunning ? <RefreshCw className="animate-spin mr-1" size={16} /> : <Play size={16} className="mr-1" />}
            Run
          </button>
          <button
            onClick={handleSubmitSolution}
            disabled={isSubmitting}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
          >
            {isSubmitting ? <RefreshCw className="animate-spin mr-1" size={16} /> : <Save size={16} className="mr-1" />}
            Submit
          </button>
        </div>
      </div>

      {/* Code editor */}
      <div className="flex-grow border border-gray-300">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={setCode}
          theme="vs-dark"
          options={editorOptions}
        />
      </div>

      {/* Custom input section */}
      <div className="border-t border-gray-300">
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="flex items-center justify-between w-full bg-gray-100 p-2 text-sm font-medium text-gray-700"
        >
          <span>Custom Input</span>
          {showCustomInput ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showCustomInput && (
          <div className="p-2 bg-gray-50">
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full h-24 p-2 border border-gray-300 rounded font-mono text-sm"
              placeholder="Enter your custom input here..."
            />
          </div>
        )}
      </div>

      {/* Output section */}
      <div className="border-t border-gray-300">
        <div className="bg-gray-100 p-2 text-sm font-medium text-gray-700">Output</div>
        <pre className="p-3 bg-gray-50 font-mono text-sm h-32 overflow-auto whitespace-pre-wrap">
          {output}
        </pre>
      </div>

      {/* Test results */}
      {testResults.length > 0 && (
        <div className="border-t border-gray-300 mt-4">
          <button
            onClick={() => setShowTestResults(!showTestResults)}
            className="flex items-center justify-between w-full bg-gray-100 p-2 text-sm font-medium text-gray-700"
          >
            <span>Test Results</span>
            {showTestResults ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showTestResults && (
            <div className="p-2 bg-gray-50 max-h-64 overflow-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`mb-2 p-3 rounded-lg ${
                    result.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    {result.passed ? (
                      <Check size={16} className="text-green-500 mr-2" />
                    ) : (
                      <X size={16} className="text-red-500 mr-2" />
                    )}
                    <span className={`font-medium ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
                      Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Input:</div>
                      <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{result.input}</pre>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Expected Output:</div>
                      <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{result.expected_output}</pre>
                    </div>
                  </div>
                  {!result.passed && (
                    <div className="mt-2">
                      <div className="font-medium text-gray-700 mb-1">Your Output:</div>
                      <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
                        {result.actual_output !== null ? result.actual_output : 'No output'}
                      </pre>
                      {result.error && (
                        <div className="mt-2 flex items-start">
                          <AlertTriangle size={16} className="text-red-500 mr-2 mt-0.5" />
                          <pre className="text-red-600 whitespace-pre-wrap">{result.error}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
