import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import {
  recordLearningActivity,
  getLearningStreakInfo,
  getActivityHeatmap,
  getLearningStats
} from '../controller/learning_streak.controller.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/record-activity', auth, recordLearningActivity);
router.get('/streak-info', auth, getLearningStreakInfo);
router.get('/streak-info/:userId', auth, getLearningStreakInfo);
router.get('/heatmap', auth, getActivityHeatmap);
router.get('/heatmap/:userId', auth, getActivityHeatmap);
router.get('/stats', auth, getLearningStats);
router.get('/stats/:userId', auth, getLearningStats);

export default router;
