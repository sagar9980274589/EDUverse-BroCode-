import express from 'express';
import { addComment, getCommentsByPost, deleteComment, updateComment } from '../controller/comment.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Add a new comment
router.post('/add', auth, addComment);

// Get all comments for a post
router.get('/:postId', getCommentsByPost);

// Delete a comment
router.delete('/:commentId', auth, deleteComment);

// Update a comment
router.put('/:commentId', auth, updateComment);

export default router;
