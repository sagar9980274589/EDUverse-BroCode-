import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import {
  fetchDailyChallenge,
  getDailyChallenge,
  getAllChallenges,
  getChallengeById,
  executeCode,
  submitSolution,
  getStudentRanking,
  getLeaderboard,
  getStudentSubmissions
} from '../controller/coding_challenge.controller.js';

const router = express.Router();

// Public routes
router.get('/daily', getDailyChallenge);
router.get('/challenges', getAllChallenges);
router.get('/challenges/:challengeId', getChallengeById);
router.get('/leaderboard', getLeaderboard);

// Code execution routes
router.post('/execute', executeCode);

// Protected routes (require authentication)
router.post('/fetch-daily', auth, fetchDailyChallenge); // Admin only in a real app
router.post('/submit', auth, submitSolution);
router.get('/ranking', auth, getStudentRanking);
router.get('/submissions', auth, getStudentSubmissions);

export default router;
