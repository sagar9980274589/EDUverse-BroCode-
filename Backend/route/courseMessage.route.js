import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { 
  getCourseMessages,
  sendCourseMessage
} from '../controller/courseMessage.controller.js';

const router = express.Router();

// Course message routes
router.get('/:courseId/messages', auth, getCourseMessages);
router.post('/:courseId/messages', auth, sendCourseMessage);

export default router;
