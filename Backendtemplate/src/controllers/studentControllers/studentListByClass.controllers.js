import { Marks } from "../../models/Marks.models.js";
import { Student } from "../../models/student.models.js";
import { StudentAttendance } from "../../models/Studentattd.models.js";
import  studentEnrolledSubjects  from "../../models/studentEnrolledSubjects.models.js";

export const getStudentById = async (req, res) => {
    console.log("Fetching student by ID");
    
    try {
        const studentId = req.params.studentId;
        
        const studentInfo = await Student.findById(studentId); 

        if (!studentInfo) {
            return res.status(404).json({ message: "Student not found" });
        }

        console.log(studentInfo);
        
        res.status(200).json({ studentInfo }); 
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export const getStudentListByClass = async (req, res) => {
    console.log("came to getStudentListByClass");
    
    try {
        const { class: className } = req.body;  // Rename class to className
        if (!className) {
            return res.status(400).json({ message: "Class field is required" });
        }
        
        const studentList = await Student.find({ class: className }); 
        console.log(studentList);
        
        res.status(200).json({ studentList }); 
        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getEnrolledSubjects = async (req, res) => {
    console.log("came to enrolled subjects");
    
    try {
        const { studentId } = req.params;  
        const enrolled = await studentEnrolledSubjects.find({ Student_name: studentId });  
        
        if (!enrolled || enrolled.length === 0) {
            return res.status(404).json({ message: "No subjects found for this student" });
        }

        // Take the first entry's Subject_name array
        console.log(enrolled);
        
        const subjects = enrolled[0].Subject_name;
        console.log("Sending subjects for student:", subjects[0]);
        
        res.status(200).json({ subjects });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// In marks.controllers.js
export const getExistingMarksByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        const marks = await Marks.find({ studentId });

        if (!marks || marks.length === 0) {
            return res.status(404).json({ message: "No marks found for this student" });
        }

        res.status(200).json(marks);
    } catch (error) {
        console.error('Error fetching marks:', error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Create studentattd.controllers.js
export const getStudentAttendanceByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        const attendance = await StudentAttendance.find({ 
            studentId,
            // Get last 30 days attendance
            date: {
                $gte: new Date(new Date().setDate(new Date().getDate() - 30))
            }
        }).sort({ date: 1 }); // Sort by date ascending

        if (!attendance) {
            return res.status(404).json({ message: "No attendance records found" });
        }

        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};