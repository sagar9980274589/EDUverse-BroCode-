import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { searchUsers } from '../controller/user_search.controller.js';

const router = express.Router();

// Search users by text and/or facial embeddings
router.post('/search', auth, searchUsers);

export default router;
