import express from "express";

import { Exam } from "../../models/Examschema.models.js";
const newexam=async (req, res) => {
    try {
      const exam = new Exam(req.body);
      await exam.save();
      res.status(201).json(exam);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  const getexam=async (req, res) => {
    const exams = await Exam.find();
    res.json(exams);
  };

  const deleteexam = async (req, res) => {
    try {
      const { examId } = req.params;
      const deletedExam = await Exam.findByIdAndDelete(examId);
  
      if (!deletedExam) {
        return res.status(404).json({ message: "Exam not found" });
      }
  
      res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
      console.error("Error deleting exam:", error);
      if (!res.headersSent) { // Prevent multiple responses
        res.status(500).json({ message: "Server error", error });
      }
    }
  };
  


  export {newexam,getexam,deleteexam};