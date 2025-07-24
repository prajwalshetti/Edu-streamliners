import express from "express";
import { newexam, getexam, deleteexam } from "../controllers/examcontrollers/exam.controller.js";

const router = express.Router();

router.post("/newexam", newexam); // Create a new exam
router.get("/getexam", getexam); // Retrieve all exams
router.delete("/:examId", deleteexam); // Delete an exam by ID

export default router;
