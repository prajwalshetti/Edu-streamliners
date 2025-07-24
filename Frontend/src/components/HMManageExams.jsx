import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Book, User, Trash2, Plus, Award, MapPin, Building, Phone,Download,Speaker } from "lucide-react";
import axios from "axios";

const baseurl = import.meta.env.VITE_BASE_URL;

function ManageExamsAndInstructors() {
  // State for exams
  const [exams, setExams] = useState([]);
  const [examFormData, setExamFormData] = useState({
    examType: "",
    subject: "",
    date: "",
    duration: "",
    class: "",
    section: ""
  });
  const [loadingExams, setLoadingExams] = useState(false);

  // State for invigilators
  const [invigilators, setInvigilators] = useState([]);
  const [invigilatorFormData, setInvigilatorFormData] = useState({
    name: "",
    faculty: "",
    department: "",
    assignedRoom: "",
    examDate: "",
    timeSlot: "",
    contactNumber: "",
    backupInvigilator: ""
  });
  const [faculties, setFaculties] = useState([]);
  const [facultyData, setFacultyData] = useState([]);

  const [message, setMessage] = useState("");

  // Sample data for dropdowns
  const timeSlots = ["Morning (9:00 AM - 12:00 PM)", "Afternoon (2:00 PM - 5:00 PM)"];
  const rooms = ["Room 101", "Room 102", "Room 103", "Room 201", "Room 202","Room 203","Room 301","Room 302","Room 303","Room 401","Room 402","Room 403","Room 501","Room 502","Room 503","Hall A","Hall B","Hall C"];
  const specalization=["Primary","Secondary","Higher Secondary"];
  const departments=["Science","English","Maths","Social","Computer","Physical Education"];
  const [announcements, setAnnouncements] = useState([]);
  const handleAnnouncement = async () => {
    if (exams.length === 0 && invigilators.length === 0) {
        setMessage("No exams or invigilators assigned to announce!");
        setTimeout(() => setMessage(""), 3000);
        return;
    }

    const newAnnouncements = [];

    exams.forEach((exam) => {
        newAnnouncements.push({
            title: `Exam Scheduled: ${exam.examType}`,
            description: `Subject: ${exam.subject}, Class: ${exam.class}${exam.section}, Date: ${new Date(exam.date).toLocaleDateString()}, Duration: ${exam.duration} hours.`,
            date: new Date(),
        });
    });

    invigilators.forEach((inv) => {
        newAnnouncements.push({
            title: `Invigilator Assigned: ${inv.name}`,
            description: `Assigned to ${inv.assignedRoom} on ${inv.examDate}, Time: ${inv.timeSlot}. Contact: ${inv.contactNumber}. Backup: ${inv.backupInvigilator || "None"}`,
            date: new Date(),
        });
    });

    // Update local state
    setAnnouncements([...announcements, ...newAnnouncements]);

    try {
       console.log(newAnnouncements);
        await axios.post(`${baseurl}/announcements`, newAnnouncements);
        setMessage("Announcements added successfully!");
        setTimeout(() => setMessage(""), 3000);
    } catch (error) {
        console.error("Error adding announcements:", error);
        setMessage("Failed to add announcements.");
        setTimeout(() => setMessage(""), 3000);
    }
};
  useEffect(() => {
    fetchFacultyData();
  }, []);
  
  const downloadExamsData = () => {
    // Create Excel-like CSV content
    let csvContent = "Exam Type,Subject,Class,Section,Date,Duration\n";
    
    exams.forEach(exam => {
      const row = [
        exam.examType,
        exam.subject,
        exam.class,
        exam.section,
        new Date(exam.date).toLocaleDateString(),
        exam.duration
      ].map(item => `"${item}"`).join(",");
      
      csvContent += row + "\n";
    });

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `exams_schedule_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadInvigilatorsData = () => {
    // Create Excel-like CSV content
    let csvContent = "Name,Faculty Specialization,Department,Assigned Room,Exam Date,Time Slot,Contact Number,Backup Invigilator\n";
    
    invigilators.forEach(inv => {
      const row = [
        inv.name,
        inv.faculty,
        inv.department,
        inv.assignedRoom,
        inv.examDate,
        inv.timeSlot,
        inv.contactNumber,
        inv.backupInvigilator
      ].map(item => `"${item}"`).join(",");
      
      csvContent += row + "\n";
    });

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `invigilators_schedule_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const fetchFacultyData = async () => {
    try {
      const response = await axios.get(`${baseurl}/teachers/getfaculty`);
      // Store complete faculty data
      setFacultyData(response.data.faculty);
      // Get unique faculty names
      const uniqueFaculties = [...new Set(response.data.faculty.map(faculty => faculty.name))];
      setFaculties(uniqueFaculties);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
      setFacultyData([]);
      setFaculties([]);
    }
  };


  // Fetch exams
  useEffect(() => {
    setLoadingExams(true);
    fetch(`${baseurl}/exams/getexam`)
      .then(response => response.json())
      .then(data => setExams(data))
      .catch(error => console.error("Error:", error))
      .finally(() => setLoadingExams(false));
  }, []);

  const handleExamChange = (e) => {
    setExamFormData({ ...examFormData, [e.target.name]: e.target.value });
  };

  const handleExamSubmit = (e) => {
    e.preventDefault();
    setExams([...exams, { ...examFormData, _id: Date.now() }]);
    setExamFormData({
      examType: "",
      subject: "",
      date: "",
      duration: "",
      class: "",
      section: ""
    });
    setMessage("Exam added successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleExamDelete = (examId) => {
    setExams(exams.filter(exam => exam._id !== examId));
    setMessage("Exam deleted successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleInvigilatorChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "name") {
      // Find the selected faculty's data
      const selectedFaculty = facultyData.find(faculty => faculty.name === value);
      
      // Update form with faculty's phone number if available
      setInvigilatorFormData(prev => ({
        ...prev,
        [name]: value,
        contactNumber: selectedFaculty ? selectedFaculty.Phone_no : prev.contactNumber
      }));
    } else {
      setInvigilatorFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleInvigilatorSubmit = (e) => {
    e.preventDefault();
    const isRoomOccupied = invigilators.some(
      inv => 
        inv.assignedRoom === invigilatorFormData.assignedRoom && 
        inv.examDate === invigilatorFormData.examDate &&
        inv.timeSlot === invigilatorFormData.timeSlot
    );

    if (isRoomOccupied) {
      setMessage("This room is already assigned for the selected date and time slot!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setInvigilators([...invigilators, { ...invigilatorFormData, _id: Date.now() }]);
    setInvigilatorFormData({
      name: "",
      faculty: "",
      department: "",
      assignedRoom: "",
      examDate: "",
      timeSlot: "",
      contactNumber: "",
      backupInvigilator: ""
    });
    setMessage("Invigilator assigned successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleInvigilatorDelete = (invigilatorId) => {
    setInvigilators(invigilators.filter(inv => inv._id !== invigilatorId));
    setMessage("Invigilator assignment removed successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          Exam Management System
        </h1>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-8 p-4 rounded-lg text-center font-medium shadow-sm ${
              message.includes("already assigned") 
                ? "bg-red-100 text-red-700" 
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Exam Management Section */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Manage Exams</h2>
              </div>
              {exams.length > 0 && (
                <div>
                <button
                  onClick={downloadExamsData}
                  className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition duration-200 mb-5"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Schedule
                </button>
                <button
                onClick={handleAnnouncement}
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition duration-200"
              >
                <Speaker className="w-4 h-4 mr-2" />
                Create the Announcement
                </button>
                </div>
                
              )
              }
            </div>

            <motion.form
              onSubmit={handleExamSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Type
                  </label>
                  <select
                    name="examType"
                    value={examFormData.examType}
                    onChange={handleExamChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Midterm">Midterm</option>
                    <option value="Final">Final</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={examFormData.subject}
                    onChange={handleExamChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Subject"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <input
                    type="text"
                    name="class"
                    value={examFormData.class}
                    onChange={handleExamChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Class"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section
                  </label>
                  <input
                    type="text"
                    name="section"
                    value={examFormData.section}
                    onChange={handleExamChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Section"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={examFormData.date}
                    onChange={handleExamChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={examFormData.duration}
                    onChange={handleExamChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2 hours"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Exam
              </button>
            </motion.form>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Scheduled Exams</h3>
              {loadingExams ? (
                <div className="text-center text-gray-600">Loading exams...</div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-4">
                    {exams.map((exam) => (
                      <motion.div
                        key={exam._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Book className="w-4 h-4 text-blue-600 mr-2" />
                              <span className="font-medium text-gray-900">{exam.subject}</span>
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {exam.examType}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(exam.date).toLocaleDateString()}
                              <Clock className="w-4 h-4 ml-4 mr-2" />
                              {exam.duration}
                            </div>
                            <div className="text-sm text-gray-600">
                              Class: {exam.class} | Section: {exam.section}
                            </div>
                          </div>
                          <button
                            onClick={() => handleExamDelete(exam._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition duration-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </section>

          {/* Invigilator Management Section */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <User className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Manage Invigilators</h2>
              </div>
              {invigilators.length > 0 && (
                <div>
                <button
                  onClick={downloadInvigilatorsData}
                  className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition duration-200 mb-5"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Schedule
                </button>
                <button
                onClick={handleAnnouncement}
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition duration-200"
              >
                <Speaker className="w-4 h-4 mr-2" />
                Create the Announcement
                </button>
                </div>
              )}
            </div>

            <motion.form
              onSubmit={handleInvigilatorSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faculty
                  </label>
                  <select
                    name="name"
                    value={invigilatorFormData.name}
                    onChange={handleInvigilatorChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map((faculty, index) => (
                      <option key={`${faculty}-${index}`} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faculty Specialization
                  </label>
                  <select
                    name="faculty"
                    value={invigilatorFormData.faculty}
                    onChange={handleInvigilatorChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Faculty</option>
                    {specalization.map((faculty, index) => (
                      <option key={`${faculty}-${index}`} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Subject
                  </label>
                  <select
                    name="department"
                    value={invigilatorFormData.department}
                    onChange={handleInvigilatorChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select the Department</option>
                    {departments.map((faculty, index) => (
                      <option key={`${faculty}-${index}`} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Room
                  </label>
                  <select
                    name="assignedRoom"
                    value={invigilatorFormData.assignedRoom}
                    onChange={handleInvigilatorChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    name="examDate"
                    value={invigilatorFormData.examDate}
                    onChange={handleInvigilatorChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Slot
                  </label>
                  <select
                    name="timeSlot"
                    value={invigilatorFormData.timeSlot}
                    onChange={handleInvigilatorChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Time Slot</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={invigilatorFormData.contactNumber}
                    onChange={handleInvigilatorChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter Contact Number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Invigilator
                  </label>
                  <input
                    type="text"
                    name="backupInvigilator"
                    value={invigilatorFormData.backupInvigilator}
                    onChange={handleInvigilatorChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter Backup Invigilator Name"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Assign Invigilator
              </button>
            </motion.form>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Current Assignments</h3>
              <AnimatePresence>
                <div className="space-y-4">
                  {invigilators.map((invigilator) => (
                    <motion.div
                      key={invigilator._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 w-full">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <User className="w-5 h-5 text-purple-600 mr-3" />
                              <span className="font-medium text-lg text-gray-900">
                                {invigilator.name}
                              </span>
                            </div>
                            <button
                              onClick={() => handleInvigilatorDelete(invigilator._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition duration-200"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Building className="w-4 h-4 mr-2" />
                              <span className="font-medium text-gray-700">Room:</span>
                              <span className="ml-2">{invigilator.assignedRoom}</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                              <Award className="w-4 h-4 mr-2" />
                              <span className="font-medium text-gray-700">Faculty:</span>
                              <span className="ml-2">{invigilator.faculty}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="ml-2">{invigilator.examDate}</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              <span className="ml-2">{invigilator.timeSlot}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-200">
                            <span className="flex items-center text-sm text-gray-600">
                              <Book className="w-4 h-4 mr-2" />
                              Backup: {invigilator.backupInvigilator}
                            </span>
                            <span className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 mr-2" />
                              {invigilator.contactNumber}
                            </span>
                          </div>

                          <div className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full inline-block">
                            {invigilator.department}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {invigilators.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-gray-500 py-8"
                    >
                      No invigilators assigned yet.
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ManageExamsAndInstructors;