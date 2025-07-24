import {StudentAttendance} from '../../models/Studentattd.models.js';
import { Student } from '../../models/student.models.js';

export const addStudentAttendance = async (req, res) => {
    try {
        console.log(req.body);
        const { classId, attendance } = req.body;  // Receive classId and attendance array

        if (!attendance || !Array.isArray(attendance)) {
            return res.status(400).json({ message: "Invalid attendance data" });
        }

        const attendanceRecords = attendance.map(({ studentId, date, isPresent }) => ({
            studentId,
            date,
            status: isPresent, // Ensuring consistent field naming
        }));

        await StudentAttendance.insertMany(attendanceRecords);

        res.status(201).json({ message: "Attendance recorded successfully", attendance: attendanceRecords });
    } catch (error) {
        res.status(500).json({ message: "Error saving attendance", error: error.message });
    }
};


export const getClassDetailsWithAttendance = async (req, res) => {
    try {
        console.log("Request received:", req.body);
        
        const { className, date } = req.body; // Get class name and date
        
        if (!className || !date) {
            return res.status(400).json({ message: "Class name and date are required" });
        }

        // Fetch students by class
        const studentList = await Student.find({ class: className })
            .select("-__v -createdAt -updatedAt");

        if (!studentList.length) {
            return res.status(404).json({ message: "No students found for the given class" });
        }
        console.log(studentList);
        
        const studentIds = studentList.map(student => student._id);

        // Fetch attendance records for the given date
        const attendanceRecords = await StudentAttendance.find({
            studentId: { $in: studentIds },
            date: new Date(date)
        }).select("studentId status");

        // Map attendance status to students
        const studentDataWithAttendance = studentList.map(student => {
            const attendance = attendanceRecords.find(record => record.studentId.equals(student._id));
            return {
                name: student.name,
                roll_no: student.roll_no,
                phone_no: student.phone_no,  // Include phone number
                attendanceStatus: attendance ? attendance.status : "Not Recorded"
            };
        });

        res.status(200).json({
            message: "Class details with attendance fetched successfully",
            students: studentDataWithAttendance,
        });
    } catch (error) {
        console.error("Error in getClassDetailsWithAttendance:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};  
export const getTodaysAttendanceReport = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const classes = ["8A", "8B", "9A", "9B", "10A", "10B"];
        let report = [];
        let totalStudents = 0;
        let totalPresent = 0;

        for (let cls of classes) {
            // Get all students in the class
            const students = await Student.find({ class: cls });
            const studentIds = students.map(student => student._id);

            // Get attendance records for today
            const presentStudents = await StudentAttendance.countDocuments({
                studentId: { $in: studentIds },
                date: { $gte: today, $lt: new Date(today.getTime() + 86400000) },
                status: "true"
            });

            totalStudents += students.length;
            totalPresent += presentStudents;

            report.push({
                class: cls,
                totalStudents: students.length,
                totalPresent: presentStudents
            });
        }

        res.status(200).json({ 
            success: true, 
            totalStudents, 
            totalPresent, 
            report 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};



export const getMonthlyStudentAttendance = async(req, res) => {
    try {
        const { studentId, month, year } = req.body;

        if (!studentId || !month || !year) {
            return res.status(400).json({
                message: "Student ID, month, and year are required"
            });
        }

        // Create date range for the specified month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const attendanceRecords = await StudentAttendance.find({
                studentId,
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).sort({ date: 1 })
            .populate('studentId', 'name roll_no'); // Assuming student model has these fields

        // Calculate statistics
        const stats = {
            totalDays: attendanceRecords.length,
            presentDays: attendanceRecords.filter(record => record.status === 'Present').length,
            absentDays: attendanceRecords.filter(record => record.status === 'Absent').length,
            lateDays: attendanceRecords.filter(record => record.status === 'Late').length,
            excusedDays: attendanceRecords.filter(record => record.status === 'Excused').length,
            attendancePercentage: (
                (attendanceRecords.filter(record => record.status === 'Present').length /
                    attendanceRecords.length) * 100
            ).toFixed(2)
        };

        res.status(200).json({
            month: startDate.toLocaleString('default', { month: 'long' }),
            year: year,
            studentInfo: attendanceRecords[0] ?  attendanceRecords[0].studentId : null,
            stats: stats,
            data: attendanceRecords
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching monthly attendance",
            error: error.message
        });
    }
};

export const getYearlyStudentAttendance = async(req, res) => {
    try {
        const { studentId, year } = req.body;

        if (!studentId || !year) {
            return res.status(400).json({
                message: "Student ID and year are required"
            });
        }

        // Create date range for the entire year
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);

        const attendanceRecords = await StudentAttendance.find({
                studentId,
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).sort({ date: 1 })
            .populate('studentId', 'name roll_no');

        // Calculate monthly statistics
        const monthlyStats = {};
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        months.forEach((month, index) => {
            const monthRecords = attendanceRecords.filter(record => {
                const recordDate = new Date(record.date);
                return recordDate.getMonth() === index;
            });

            monthlyStats[month] = {
                totalDays: monthRecords.length,
                presentDays: monthRecords.filter(record => record.status === 'Present').length,
                absentDays: monthRecords.filter(record => record.status === 'Absent').length,
                lateDays: monthRecords.filter(record => record.status === 'Late').length,
                excusedDays: monthRecords.filter(record => record.status === 'Excused').length,
                attendancePercentage: monthRecords.length ?
                    ((monthRecords.filter(record => record.status === 'Present').length /
                        monthRecords.length) * 100).toFixed(2) : 0
            };
        });

        // Calculate yearly totals
        const yearlyTotals = {
            totalDays: attendanceRecords.length,
            presentDays: attendanceRecords.filter(record => record.status === 'Present').length,
            absentDays: attendanceRecords.filter(record => record.status === 'Absent').length,
            lateDays: attendanceRecords.filter(record => record.status === 'Late').length,
            excusedDays: attendanceRecords.filter(record => record.status === 'Excused').length,
            yearlyAttendancePercentage: attendanceRecords.length ?
                ((attendanceRecords.filter(record => record.status === 'Present').length /
                    attendanceRecords.length) * 100).toFixed(2) : 0
        };

        res.status(200).json({
            year: year,
            studentInfo: attendanceRecords[0] ? attendanceRecords[0].studentId:null,
            yearlyTotals: yearlyTotals,
            monthlyStats: monthlyStats,
            data: attendanceRecords
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching yearly attendance",
            error: error.message
        });
    }
};

export const getAllStudentsAttendance = async(req, res) => {
    try {
        // Get all attendance records
        const allAttendanceRecords = await StudentAttendance.find()
            .populate('studentId', 'name roll_no');

        // Group records by student ID
        const studentStats = {};

        // Process each attendance record
        allAttendanceRecords.forEach(record => {
            if (!studentStats[record.studentId._id]) {
                studentStats[record.studentId._id] = {
                    studentId: record.studentId._id,
                    studentName: record.studentId.name,
                    rollNo: record.studentId.roll_no,
                    totalDays: 0,
                    presentDays: 0,
                    absentDays: 0,
                    lateDays: 0,
                    excusedDays: 0,
                    attendancePercentage: 0
                };
            }

            const stats = studentStats[record.studentId._id];
            stats.totalDays++;

            switch (record.status) {
                case 'Present':
                    stats.presentDays++;
                    break;
                case 'Absent':
                    stats.absentDays++;
                    break;
                case 'Late':
                    stats.lateDays++;
                    break;
                case 'Excused':
                    stats.excusedDays++;
                    break;
            }
        });

        // Calculate percentages and convert to array
        const studentStatsArray = Object.values(studentStats).map(stats => ({
            ...stats,
            attendancePercentage: stats.totalDays > 0 ?
                ((stats.presentDays / stats.totalDays) * 100).toFixed(2) : 0
        }));

        // Sort by attendance percentage in descending order
        studentStatsArray.sort((a, b) => b.attendancePercentage - a.attendancePercentage);

        res.status(200).json({
            totalStudents: studentStatsArray.length,
            stats: studentStatsArray
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching student attendance statistics",
            error: error.message
        });
    }
};