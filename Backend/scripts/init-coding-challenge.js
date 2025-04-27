import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CodingChallenge } from '../model/coding_challenge.model.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample coding challenge data
const sampleChallenge = {
  title: 'Two Sum',
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
  </pre>
  
  <p><strong>Example 3:</strong></p>
  <pre>
  <strong>Input:</strong> nums = [3,3], target = 6
  <strong>Output:</strong> [0,1]
  </pre>
  
  <p><strong>Constraints:</strong></p>
  <ul>
    <li><code>2 <= nums.length <= 10<sup>4</sup></code></li>
    <li><code>-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup></code></li>
    <li><code>-10<sup>9</sup> <= target <= 10<sup>9</sup></code></li>
    <li><strong>Only one valid answer exists.</strong></li>
  </ul>`,
  difficulty: 'Easy',
  problemId: '1',
  slug: 'two-sum',
  link: 'https://leetcode.com/problems/two-sum/',
  tags: ['Array', 'Hash Table'],
  date: new Date(),
  source: 'LeetCode'
};

// Initialize database with sample challenge
const initDatabase = async () => {
  try {
    await connectDB();
    
    // Check if we already have challenges
    const existingChallenges = await CodingChallenge.countDocuments();
    
    if (existingChallenges > 0) {
      console.log(`Database already has ${existingChallenges} challenges. Skipping initialization.`);
    } else {
      // Create sample challenge
      const challenge = new CodingChallenge(sampleChallenge);
      await challenge.save();
      console.log('Sample coding challenge created successfully');
    }
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

// Run the initialization
initDatabase();
