import express from 'express';
import { addMarks, getExistingMarks } from '../controllers/studentControllers/marks.controllers.js';
import { addStudent } from '../controllers/studentControllers/addStudent.controllers.js';
import { getExistingMarksByStudentId, getStudentAttendanceByStudentId, getStudentById, getStudentListByClass } from '../controllers/studentControllers/studentListByClass.controllers.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { getEnrolledSubjects } from '../controllers/studentControllers/studentListByClass.controllers.js';
import {Subject} from '../models/Subject.models.js'; 
import { getClassDetailsWithAttendance } from '../controllers/studentControllers/studentattd.controllers.js';
import { addStudentAttendance } from '../controllers/studentControllers/studentattd.controllers.js';
import {getTodaysAttendanceReport} from '../controllers/studentControllers/studentattd.controllers.js';
const router = express.Router();


router.post('/addStudent', addStudent); 
// router.post('/addMarks', addMarks);  
router.route('/addMarks').post(verifyJWT, addMarks); 
router.route('/getExistingMarks').get(verifyJWT, getExistingMarks);
router.post('/getStudentListByClass', getStudentListByClass);
router.post('/getAttendanceByClass', getClassDetailsWithAttendance)
router.get('/getEnrolledSubjects/:studentId', getEnrolledSubjects); 

router.get('/subjects', async (req, res) => {
    try {
        console.log("CAME FOR TH$E SUBJEVTS"); 
        const subjects = await Subject.find(); 
        
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/addMarks', addMarks);
router.post("/getstudents",getStudentListByClass)
router.post("/addattendance",addStudentAttendance)
router.get('/getTodaysAttendanceReport', getTodaysAttendanceReport)
router.get('/getStudentById/:studentId',getStudentById)
router.get('/getExistingMarksByStudentId/:studentId',getExistingMarksByStudentId)
router.get('/getStudentAttendanceByStudentId/:studentId',getStudentAttendanceByStudentId)
export default router;