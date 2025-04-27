import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { upload } from '../service/multer.js';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getCoursesByMentor,
  getCoursesByStudent,
  updateCourse,
  deleteCourse,
  enrollCourse,
  rateCourse,
  togglePublishCourse
} from '../controller/course.controller.js';

const router = express.Router();

// Configure multer for course uploads
const courseUpload = upload.fields([
  { name: 'courseImage', maxCount: 1 },
  { name: 'materials', maxCount: 10 } // Allow up to 10 material files
]);

// Course creation and management
router.post('/create', auth, courseUpload, createCourse);
router.put('/:courseId', auth, courseUpload, updateCourse);
router.delete('/:courseId', auth, deleteCourse);

// Course retrieval - specific routes first
router.get('/mentor/:mentorId', getCoursesByMentor);
router.get('/student/:studentId', getCoursesByStudent);

// Course actions with courseId
router.post('/:courseId/publish', auth, togglePublishCourse);
router.post('/:courseId/enroll', auth, enrollCourse);
router.post('/:courseId/rate', auth, rateCourse);
router.get('/:courseId', getCourseById);

// General course retrieval
router.get('/', getAllCourses);

export default router;
