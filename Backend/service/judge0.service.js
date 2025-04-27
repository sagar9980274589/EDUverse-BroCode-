import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Judge0 API configuration
const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_API_HOST = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';

// Check if API key is configured
const isApiConfigured = JUDGE0_API_KEY && JUDGE0_API_KEY.length > 10;

// Create axios instance for Judge0 API
const judge0Api = axios.create({
  baseURL: JUDGE0_API_URL,
  headers: {
    'X-RapidAPI-Key': JUDGE0_API_KEY,
    'X-RapidAPI-Host': JUDGE0_API_HOST,
    'Content-Type': 'application/json'
  }
});

/**
 * Get all available languages from Judge0
 * @returns {Promise<Array>} List of supported languages
 */
export const getLanguages = async () => {
  try {
    const response = await judge0Api.get('/languages');
    return response.data;
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }
};

/**
 * Submit code for execution
 * @param {Object} submission Submission object with source_code, language_id, stdin
 * @returns {Promise<Object>} Submission token
 */
export const submitCode = async (submission) => {
  try {
    const response = await judge0Api.post('/submissions', submission, {
      params: { base64_encoded: 'false', wait: 'false' }
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting code:', error);
    throw error;
  }
};

/**
 * Get submission result
 * @param {string} token Submission token
 * @returns {Promise<Object>} Submission result
 */
export const getSubmissionResult = async (token) => {
  try {
    const response = await judge0Api.get(`/submissions/${token}`, {
      params: { base64_encoded: 'false' }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting submission result:', error);
    throw error;
  }
};

/**
 * Submit code and wait for result
 * @param {Object} submission Submission object with source_code, language_id, stdin
 * @returns {Promise<Object>} Submission result
 */
export const executeCode = async (submission) => {
  try {
    // Check if API is configured
    if (!isApiConfigured) {
      console.log('Judge0 API key not configured, using simulation mode');
      return simulateCodeExecution(submission);
    }

    // Submit code
    const { token } = await submitCode(submission);

    // Poll for result
    let result = null;
    let status = null;

    // Maximum number of attempts
    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
      // Wait for 1 second before checking
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get submission result
      result = await getSubmissionResult(token);
      status = result.status?.id;

      // If the submission is processed, return the result
      if (status !== 1 && status !== 2) {
        return result;
      }

      attempts++;
    }

    throw new Error('Execution timed out');
  } catch (error) {
    console.error('Error executing code:', error);

    // If error is related to API key, use simulation
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log('Judge0 API authentication failed, using simulation mode');
      return simulateCodeExecution(submission);
    }

    throw error;
  }
};

/**
 * Simulate code execution for when API is not available
 * @param {Object} submission Submission object with source_code, language_id, stdin
 * @returns {Object} Simulated execution result
 */
const simulateCodeExecution = (submission) => {
  const { source_code, language_id, stdin } = submission;

  // Simulate processing delay
  return new Promise(resolve => {
    setTimeout(() => {
      // Create a simulated output based on the code
      let output = '';

      // Python (language_id: 71)
      if (language_id === 71) {
        if (source_code.includes('print(')) {
          // Extract content from print statements (simple simulation)
          const printMatches = source_code.match(/print\((.*?)\)/g);
          if (printMatches) {
            output = printMatches
              .map(match => {
                const content = match.substring(6, match.length - 1);
                return content.replace(/['"]/g, ''); // Remove quotes
              })
              .join('\\n');
          }
        }
      }
      // JavaScript (language_id: 63)
      else if (language_id === 63) {
        if (source_code.includes('console.log(')) {
          // Extract content from console.log statements
          const logMatches = source_code.match(/console\.log\((.*?)\)/g);
          if (logMatches) {
            output = logMatches
              .map(match => {
                const content = match.substring(12, match.length - 1);
                return content.replace(/['"]/g, ''); // Remove quotes
              })
              .join('\\n');
          }
        }
      }
      // Other languages - generic simulation
      else {
        output = `Simulated output for code execution\\nInput: ${stdin || 'None'}`;
      }

      // Return simulated result
      resolve({
        stdout: output || 'No output',
        stderr: null,
        compile_output: null,
        message: null,
        time: "0.001",
        memory: 9216,
        status: {
          id: 3,
          description: "Accepted"
        }
      });
    }, 1000);
  });
};

export default {
  getLanguages,
  submitCode,
  getSubmissionResult,
  executeCode
};
