import express from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import {
    createLessonPlan,
    getLessonPlans,
    getLessonPlanById,
    updateLessonPlan,
    deleteLessonPlan,
    updateLessonPlanStatus,
    getLessonPlanStats
} from '../controllers/facultyControllers/lessonPlan.controller.js';

const router = express.Router();

// Apply authentication middleware to all routes
console.log("came to middleware lessonplan");

router.use(verifyJWT);

// Core CRUD routes
router.post('/create', createLessonPlan);
router.get('/list', getLessonPlans);
router.get('/stats', getLessonPlanStats);
router.get('/:id', getLessonPlanById);
router.patch('/:id', updateLessonPlan);
router.delete('/:id', deleteLessonPlan);
router.patch('/:id/status', updateLessonPlanStatus);

export default router;