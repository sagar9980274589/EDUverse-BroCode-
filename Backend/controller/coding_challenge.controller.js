import axios from 'axios';
import { CodingChallenge, ChallengeSubmission, StudentRanking } from '../model/coding_challenge.model.js';
import User from '../model/user.model.js';
import pistonService from '../service/piston.service.js';

// HackerRank-like API for challenges
const CHALLENGE_API_URL = 'https://www.hackerrank.com/api/v2/challenges';

// Predefined challenges for our platform
const predefinedChallenges = [
  {
    title: "Two Sum",
    description: `<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
    <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
    <p>You can return the answer in any order.</p>

    <p><strong>Example 1:</strong></p>
    <pre>
    <strong>Input:</strong> nums = [2,7,11,15], target = 9
    <strong>Output:</strong> [0,1]
    <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
    </pre>

    <p><strong>Example 2:</strong></p>
    <pre>
    <strong>Input:</strong> nums = [3,2,4], target = 6
    <strong>Output:</strong> [1,2]
    </pre>`,
    difficulty: "Easy",
    problemId: "1",
    slug: "two-sum",
    tags: ["Array", "Hash Table"],
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        output: "[0,1]"
      },
      {
        input: "[3,2,4]\n6",
        output: "[1,2]"
      },
      {
        input: "[3,3]\n6",
        output: "[0,1]"
      }
    ],
    starterCode: {
      python: "def two_sum(nums, target):\n    # Your code here\n    pass\n\n# Example usage\nnums = list(map(int, input().strip('[]').split(',')))\ntarget = int(input())\nprint(two_sum(nums, target))",
      javascript: "function twoSum(nums, target) {\n    // Your code here\n}\n\n// Example usage\nconst nums = JSON.parse(readline());\nconst target = parseInt(readline());\nconsole.log(JSON.stringify(twoSum(nums, target)));"
    },
    solutionCode: {
      python: "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\n# Example usage\nnums = list(map(int, input().strip('[]').split(',')))\ntarget = int(input())\nprint(two_sum(nums, target))",
      javascript: "function twoSum(nums, target) {\n    const seen = {};\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (complement in seen) {\n            return [seen[complement], i];\n        }\n        seen[nums[i]] = i;\n    }\n    return [];\n}\n\n// Example usage\nconst nums = JSON.parse(readline());\nconst target = parseInt(readline());\nconsole.log(JSON.stringify(twoSum(nums, target)));"
    }
  },
  {
    title: "Palindrome Number",
    description: `<p>Given an integer <code>x</code>, return <code>true</code> if <code>x</code> is a <strong>palindrome</strong>, and <code>false</code> otherwise.</p>

    <p><strong>Example 1:</strong></p>
    <pre>
    <strong>Input:</strong> x = 121
    <strong>Output:</strong> true
    <strong>Explanation:</strong> 121 reads as 121 from left to right and from right to left.
    </pre>

    <p><strong>Example 2:</strong></p>
    <pre>
    <strong>Input:</strong> x = -121
    <strong>Output:</strong> false
    <strong>Explanation:</strong> From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
    </pre>`,
    difficulty: "Easy",
    problemId: "9",
    slug: "palindrome-number",
    tags: ["Math"],
    testCases: [
      {
        input: "121",
        output: "true"
      },
      {
        input: "-121",
        output: "false"
      },
      {
        input: "10",
        output: "false"
      }
    ],
    starterCode: {
      python: "def is_palindrome(x):\n    # Your code here\n    pass\n\n# Example usage\nx = int(input())\nprint(str(is_palindrome(x)).lower())",
      javascript: "function isPalindrome(x) {\n    // Your code here\n}\n\n// Example usage\nconst x = parseInt(readline());\nconsole.log(isPalindrome(x));"
    },
    solutionCode: {
      python: "def is_palindrome(x):\n    if x < 0:\n        return False\n    \n    original = x\n    reversed_num = 0\n    \n    while x > 0:\n        digit = x % 10\n        reversed_num = reversed_num * 10 + digit\n        x //= 10\n    \n    return original == reversed_num\n\n# Example usage\nx = int(input())\nprint(str(is_palindrome(x)).lower())",
      javascript: "function isPalindrome(x) {\n    if (x < 0) return false;\n    \n    const original = x;\n    let reversed = 0;\n    \n    while (x > 0) {\n        const digit = x % 10;\n        reversed = reversed * 10 + digit;\n        x = Math.floor(x / 10);\n    }\n    \n    return original === reversed;\n}\n\n// Example usage\nconst x = parseInt(readline());\nconsole.log(isPalindrome(x));"
    }
  }
];

// Fetch and store daily challenge
export const fetchDailyChallenge = async (req, res) => {
  try {
    // Check if we already have today's challenge
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingChallenge = await CodingChallenge.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingChallenge) {
      return res.status(200).json({
        success: true,
        message: "Today's challenge already exists",
        challenge: existingChallenge
      });
    }

    // Select a random challenge from our predefined list
    const randomIndex = Math.floor(Math.random() * predefinedChallenges.length);
    const challengeData = predefinedChallenges[randomIndex];

    // Create new challenge in our database
    const newChallenge = new CodingChallenge({
      title: challengeData.title,
      description: challengeData.description,
      difficulty: challengeData.difficulty,
      problemId: challengeData.problemId,
      slug: challengeData.slug,
      tags: challengeData.tags,
      testCases: challengeData.testCases,
      starterCode: challengeData.starterCode,
      solutionCode: challengeData.solutionCode,
      date: new Date(),
      source: "EDUverse"
    });

    await newChallenge.save();

    return res.status(201).json({
      success: true,
      message: "Daily challenge fetched and stored successfully",
      challenge: newChallenge
    });
  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch daily challenge",
      error: error.message
    });
  }
};

// Get today's challenge
export const getDailyChallenge = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const challenge = await CodingChallenge.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!challenge) {
      // If no challenge exists for today, create a new one
      try {
        // Select a random challenge from our predefined list
        const randomIndex = Math.floor(Math.random() * predefinedChallenges.length);
        const challengeData = predefinedChallenges[randomIndex];

        const newChallenge = new CodingChallenge({
          title: challengeData.title,
          description: challengeData.description,
          difficulty: challengeData.difficulty,
          problemId: challengeData.problemId,
          slug: challengeData.slug,
          tags: challengeData.tags,
          testCases: challengeData.testCases,
          starterCode: challengeData.starterCode,
          solutionCode: challengeData.solutionCode,
          date: new Date(),
          source: "EDUverse"
        });

        await newChallenge.save();

        return res.status(200).json({
          success: true,
          challenge: newChallenge
        });
      } catch (fetchError) {
        console.error("Error creating new daily challenge:", fetchError);
        return res.status(404).json({
          success: false,
          message: "No challenge found for today and failed to create a new one"
        });
      }
    }

    return res.status(200).json({
      success: true,
      challenge
    });
  } catch (error) {
    console.error("Error getting daily challenge:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get daily challenge",
      error: error.message
    });
  }
};

// Get all challenges
export const getAllChallenges = async (req, res) => {
  try {
    const { page = 1, limit = 10, difficulty } = req.query;

    const query = {};
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const challenges = await CodingChallenge.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await CodingChallenge.countDocuments(query);

    return res.status(200).json({
      success: true,
      challenges,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Error getting challenges:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get challenges",
      error: error.message
    });
  }
};

// Get challenge by ID
export const getChallengeById = async (req, res) => {
  try {
    const { challengeId } = req.params;

    if (!challengeId) {
      return res.status(400).json({
        success: false,
        message: "Challenge ID is required"
      });
    }

    const challenge = await CodingChallenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found"
      });
    }

    return res.status(200).json({
      success: true,
      challenge
    });
  } catch (error) {
    console.error("Error getting challenge by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get challenge",
      error: error.message
    });
  }
};

// Execute code (test run)
export const executeCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;

    // Validate required fields
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Map our language names to Judge0 language IDs
    const languageMap = {
      'python': 71, // Python 3
      'javascript': 63, // Node.js
      'java': 62, // Java
      'cpp': 54, // C++
      'c': 50 // C
    };

    const languageId = languageMap[language];
    if (!languageId) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language"
      });
    }

    // Prepare submission for Judge0
    const submission = {
      source_code: code,
      language_id: languageId,
      stdin: input || ''
    };

    try {
      // Execute code using Piston API
      const result = await pistonService.executeCode(submission);

      return res.status(200).json({
        success: true,
        result: {
          stdout: result.stdout,
          stderr: result.stderr,
          compile_output: result.compile_output,
          message: result.message,
          time: result.time,
          memory: result.memory,
          status: result.status
        }
      });
    } catch (apiError) {
      console.error("API execution error:", apiError);
      return res.status(500).json({
        success: false,
        message: "Failed to execute code",
        error: apiError.message
      });
    }
  } catch (error) {
    console.error("Error executing code:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to execute code",
      error: error.message
    });
  }
};

// Submit a solution
export const submitSolution = async (req, res) => {
  try {
    const userId = req.id;
    const { challengeId, code, language } = req.body;

    // Validate required fields
    if (!challengeId || !code || !language) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Check if challenge exists
    const challenge = await CodingChallenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found"
      });
    }

    // Map our language names to Judge0 language IDs
    const languageMap = {
      'python': 71, // Python 3
      'javascript': 63, // Node.js
      'java': 62, // Java
      'cpp': 54, // C++
      'c': 50 // C
    };

    const languageId = languageMap[language];
    if (!languageId) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language"
      });
    }

    // Run the code against all test cases
    let allTestsPassed = true;
    const testResults = [];

    try {
      for (const testCase of challenge.testCases) {
        // Prepare submission for Piston API
        const submission = {
          source_code: code,
          language_id: languageId,
          stdin: testCase.input
        };

        // Execute code using Piston API
        const result = await pistonService.executeCode(submission);

        // Check if execution was successful
        if (result.status.id !== 3) {
          allTestsPassed = false;
          testResults.push({
            input: testCase.input,
            expected_output: testCase.output,
            actual_output: null,
            status: result.status,
            passed: false,
            error: result.stderr || result.compile_output || result.message
          });
          continue;
        }

        // Compare output with expected output (trim whitespace)
        const actualOutput = (result.stdout || '').trim();
        const expectedOutput = testCase.output.trim();
        const passed = actualOutput === expectedOutput;

        if (!passed) {
          allTestsPassed = false;
        }

        testResults.push({
          input: testCase.input,
          expected_output: expectedOutput,
          actual_output: actualOutput,
          status: result.status,
          passed,
          error: null
        });
      }
    } catch (apiError) {
      console.error("API execution error:", apiError);
      throw apiError;
    }

    // Create submission
    const submission = new ChallengeSubmission({
      student: userId,
      challenge: challengeId,
      status: allTestsPassed ? "Solved" : "Failed",
      language,
      code,
      testResults,
      submittedAt: new Date()
    });

    await submission.save();

    // Update student ranking if solution is correct
    if (allTestsPassed) {
      let studentRanking = await StudentRanking.findOne({ student: userId });

      if (!studentRanking) {
        studentRanking = new StudentRanking({
          student: userId,
          totalSolved: 0,
          easyCount: 0,
          mediumCount: 0,
          hardCount: 0,
          streak: 0,
          score: 0,
          solvedChallenges: []
        });
      }

      // Check if this challenge is already solved by the student
      const alreadySolved = studentRanking.solvedChallenges.includes(challengeId);

      if (!alreadySolved) {
        // Update counts based on difficulty
        studentRanking.totalSolved += 1;

        if (challenge.difficulty === "Easy") {
          studentRanking.easyCount += 1;
          studentRanking.score += 1;
        } else if (challenge.difficulty === "Medium") {
          studentRanking.mediumCount += 1;
          studentRanking.score += 3;
        } else if (challenge.difficulty === "Hard") {
          studentRanking.hardCount += 1;
          studentRanking.score += 5;
        }

        // Add to solved challenges
        studentRanking.solvedChallenges.push(challengeId);
      }

      // Update streak
      const lastSolvedDate = studentRanking.lastSolvedDate;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (lastSolvedDate) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const lastSolved = new Date(lastSolvedDate);
        lastSolved.setHours(0, 0, 0, 0);

        if (lastSolved.getTime() === yesterday.getTime()) {
          // Solved yesterday, increment streak
          studentRanking.streak += 1;
        } else if (lastSolved.getTime() < yesterday.getTime()) {
          // Missed a day, reset streak
          studentRanking.streak = 1;
        }
        // If already solved today, streak remains the same
      } else {
        // First time solving, start streak
        studentRanking.streak = 1;
      }

      studentRanking.lastSolvedDate = new Date();

      await studentRanking.save();

      // Update rankings for all students
      await updateRankings();
    }

    return res.status(201).json({
      success: true,
      message: "Solution submitted successfully",
      submission: {
        id: submission._id,
        status: submission.status,
        testResults,
        allTestsPassed
      }
    });
  } catch (error) {
    console.error("Error submitting solution:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit solution",
      error: error.message
    });
  }
};

// Get student ranking
export const getStudentRanking = async (req, res) => {
  try {
    const userId = req.id;

    const ranking = await StudentRanking.findOne({ student: userId })
      .populate('student', 'username fullname profile userType');

    if (!ranking) {
      return res.status(404).json({
        success: false,
        message: "Ranking not found for this student"
      });
    }

    return res.status(200).json({
      success: true,
      ranking
    });
  } catch (error) {
    console.error("Error getting student ranking:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get student ranking",
      error: error.message
    });
  }
};

// Get leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const leaderboard = await StudentRanking.find()
      .sort({ score: -1, totalSolved: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('student', 'username fullname profile userType')
      .exec();

    const count = await StudentRanking.countDocuments();

    return res.status(200).json({
      success: true,
      leaderboard,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get leaderboard",
      error: error.message
    });
  }
};

// Get student submissions
export const getStudentSubmissions = async (req, res) => {
  try {
    const userId = req.id;
    const { page = 1, limit = 10 } = req.query;

    const submissions = await ChallengeSubmission.find({ student: userId })
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('challenge')
      .exec();

    const count = await ChallengeSubmission.countDocuments({ student: userId });

    return res.status(200).json({
      success: true,
      submissions,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Error getting student submissions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get student submissions",
      error: error.message
    });
  }
};

// Helper function to update rankings for all students
const updateRankings = async () => {
  try {
    // Get all student rankings sorted by score
    const rankings = await StudentRanking.find().sort({ score: -1, totalSolved: -1 });

    // Update rank for each student
    for (let i = 0; i < rankings.length; i++) {
      rankings[i].rank = i + 1;
      await rankings[i].save();
    }

    return true;
  } catch (error) {
    console.error("Error updating rankings:", error);
    return false;
  }
};

// Cron job function to fetch daily challenge
export const cronFetchDailyChallenge = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingChallenge = await CodingChallenge.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingChallenge) {
      console.log("Today's challenge already exists");
      return;
    }

    // Fetch daily challenge from LeetCode API
    const response = await axios.get(`${LEETCODE_API_URL}/daily`);
    const dailyData = response.data;

    // Create new challenge in our database
    const newChallenge = new CodingChallenge({
      title: dailyData.title,
      description: dailyData.content,
      difficulty: dailyData.difficulty,
      problemId: dailyData.questionId,
      slug: dailyData.titleSlug,
      link: `https://leetcode.com/problems/${dailyData.titleSlug}/`,
      tags: dailyData.topicTags?.map(tag => tag.name) || [],
      date: new Date(),
      source: "LeetCode"
    });

    await newChallenge.save();
    console.log("Daily challenge fetched and stored successfully");
  } catch (error) {
    console.error("Cron job error fetching daily challenge:", error);
  }
};
