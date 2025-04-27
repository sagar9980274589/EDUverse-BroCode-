import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import {
  recordProjectActivity,
  getProjectStreakInfo,
  syncGitHubContributions,
  getContributionHeatmap
} from '../controller/project_streak.controller.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/record-activity', auth, recordProjectActivity);
router.get('/streak-info', auth, getProjectStreakInfo);
router.get('/streak-info/:userId', auth, getProjectStreakInfo);
router.post('/sync-github', auth, syncGitHubContributions);
router.get('/heatmap', auth, getContributionHeatmap);
router.get('/heatmap/:userId', auth, getContributionHeatmap);

export default router;
