import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Piston API configuration - free and open source code execution engine
const PISTON_API_URL = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston';

// Create axios instance for Piston API
const pistonApi = axios.create({
  baseURL: PISTON_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Get all available languages from Piston
 * @returns {Promise<Array>} List of supported languages
 */
export const getLanguages = async () => {
  try {
    const response = await pistonApi.get('/runtimes');
    return response.data;
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }
};

/**
 * Map our language names to Piston language names
 * @param {string} language Our language identifier
 * @returns {Object} Piston language details
 */
const mapLanguage = (language) => {
  const languageMap = {
    'python': { language: 'python', version: '3.10.0' },
    'javascript': { language: 'nodejs', version: '18.15.0' },
    'java': { language: 'java', version: '15.0.2' },
    'cpp': { language: 'c++', version: '10.2.0' },
    'c': { language: 'c', version: '10.2.0' }
  };
  
  return languageMap[language] || { language: 'python', version: '3.10.0' };
};

/**
 * Execute code using Piston API
 * @param {Object} submission Submission object with source_code, language_id, stdin
 * @returns {Promise<Object>} Execution result
 */
export const executeCode = async (submission) => {
  try {
    const { source_code, language_id, stdin = '' } = submission;
    
    // Map language_id to Piston language
    let language = '';
    switch (language_id) {
      case 71: language = 'python'; break;
      case 63: language = 'javascript'; break;
      case 62: language = 'java'; break;
      case 54: language = 'cpp'; break;
      case 50: language = 'c'; break;
      default: language = 'python';
    }
    
    const langDetails = mapLanguage(language);
    
    // Prepare request for Piston
    const pistonRequest = {
      language: langDetails.language,
      version: langDetails.version,
      files: [
        {
          name: `main.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'cpp'}`,
          content: source_code
        }
      ],
      stdin: stdin,
      args: [],
      compile_timeout: 10000,
      run_timeout: 5000,
      compile_memory_limit: -1,
      run_memory_limit: -1
    };
    
    // Execute code
    const response = await pistonApi.post('/execute', pistonRequest);
    
    // Map Piston response to our format
    return {
      stdout: response.data.run?.stdout || '',
      stderr: response.data.run?.stderr || '',
      compile_output: response.data.compile?.output || '',
      message: response.data.message || null,
      time: response.data.run?.time || 0,
      memory: 0, // Piston doesn't provide memory usage
      status: {
        id: response.data.run?.code === 0 ? 3 : 6, // 3 = Accepted, 6 = Error
        description: response.data.run?.code === 0 ? 'Accepted' : 'Error'
      }
    };
  } catch (error) {
    console.error('Error executing code with Piston:', error);
    
    // Return a formatted error
    return {
      stdout: '',
      stderr: error.response?.data?.message || error.message || 'Execution failed',
      compile_output: '',
      message: 'Execution failed',
      time: 0,
      memory: 0,
      status: {
        id: 6, // Error
        description: 'Error'
      }
    };
  }
};

export default {
  getLanguages,
  executeCode
};
