import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";


const baseurl = import.meta.env.VITE_BASE_URL;

const HMManageTimeTable = () => {
  const [groupedTimetable, setGroupedTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [absentTeachers, setAbsentTeachers] = useState(new Set());
  const [substitutions, setSubstitutions] = useState({});
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [availableSubstitutes, setAvailableSubstitutes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await fetch(`${baseurl}/timetable/getTimetable`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Unexpected timetable data format:", data);
          setError("Invalid data format received from server");
          setLoading(false);
          return;
        }

        const groupedData = {};
        data.forEach((entry) => {
          const { className, day, periods } = entry;
          if (!groupedData[className]) {
            groupedData[className] = {};
          }
          groupedData[className][day] = periods;
        });

        // Add Saturday activities
        Object.keys(groupedData).forEach(className => {
          if (!groupedData[className]["Saturday"]) {
            groupedData[className]["Saturday"] = Array.from({ length: 6 }, (_, i) => ({
              periodNumber: i + 1,
              subject: (i + 1) % 2 === 0 ? "Sports" : "Rotational Activities",
              teacher: { name: "Coach Team" }
            }));
          }
        });

        setGroupedTimetable(groupedData);
        setActiveTab(Object.keys(groupedData)[0] || null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching timetable:", err);
        setError("Failed to load timetable data");
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const response = await axios.get(`${baseurl}/teachers/getfaculty`);
      const uniqueFaculties = [...new Set(response.data.faculty.map(faculty => faculty.name))];
      setAvailableSubstitutes(uniqueFaculties);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
      setAvailableSubstitutes([]);
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = [1, 2, 3, 4, 5, 6];

  const getSubjectColor = (subject, day) => {
    if (day === "Saturday") return "#f8d7da";
    
    const colorMap = {
      "Mathematics": "#d1ecf1",
      "Science": "#d4edda",
      "English": "#fff3cd",
      "History": "#f8d7da",
      "Geography": "#e2e3e5",
      "Computer": "#cce5ff",
      "Art": "#f5c6cb",
      "Music": "#c3e6cb",
      "Physical Education": "#ffeeba",
    };
    
    return colorMap[subject] || "#f8f9fa";
  };

  const handleTeacherClick = (teacher, day, period) => {
    if (day === "Saturday") return;
    
    setSelectedCell({ teacher, day, period });
    setShowSubModal(true);
  };

  const handleSubstitution = (substituteTeacher) => {
    if (!selectedCell) return;
    
    const { teacher, day, period } = selectedCell;
    const key = `${day}-${period}-${teacher.name}`;
    
    setAbsentTeachers(prev => {
      const newSet = new Set(prev);
      newSet.add(teacher.name);
      return newSet;
    });
    
    setSubstitutions(prev => ({
      ...prev,
      [key]: substituteTeacher
    }));
    
    setShowSubModal(false);
    setSelectedCell(null);
  };

  const SubstitutionModal = () => (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-xl font-bold mb-4 text-gray-800">Select Substitute Teacher</h3>
        <div className="max-h-60 overflow-y-auto">
          {availableSubstitutes.map(substitute => (
            <motion.button
              key={substitute}
              onClick={() => handleSubstitution(substitute)}
              className="w-full p-3 text-left hover:bg-gray-100 rounded-lg mb-2 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {substitute}
            </motion.button>
          ))}
        </div>
        <motion.button 
          onClick={() => setShowSubModal(false)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200 w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel
        </motion.button>
      </motion.div>
    </motion.div>
  );

  const handleAnnouncement = async () => {
    const substitutionEntries = Object.entries(substitutions);
    if (substitutionEntries.length === 0) return;

    const newAnnouncements = substitutionEntries.map(([key, substitute]) => {
      const [day, period, originalTeacher] = key.split('-');
      return {
        title: "Teacher Substitution",
        description: `${originalTeacher} will be substituted by ${substitute} for Period ${period} on ${day}`,
        date: new Date()
      };
    });

    try {
      await axios.post(`${baseurl}/announcements`, newAnnouncements);
      setMessage("Substitution announcements posted successfully!");
      
      // Clear substitutions after successful announcement
      setSubstitutions({});
      setAbsentTeachers(new Set());
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error adding announcements:", error);
      setMessage("Failed to post substitution announcements.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="timetable-management-container p-6">
      <motion.div 
        className="timetable-header text-center mb-8"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">School Timetable Management</h1>
        <p className="text-gray-600">View and manage class schedules</p>
      </motion.div>

      {loading && (
        <motion.div 
          className="flex items-center justify-center p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="loader"></div>
          <p className="ml-4 text-gray-600">Loading timetables...</p>
        </motion.div>
      )}
      
      {error && (
        <motion.div 
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </motion.div>
      )}

      {!loading && !error && (
        <motion.div 
          className="timetable-content"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="flex flex-wrap gap-2 mb-6" variants={itemVariants}>
            {Object.keys(groupedTimetable).map((className) => (
              <motion.button
                key={className}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  activeTab === className 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                onClick={() => setActiveTab(className)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Class {className}
              </motion.button>
            ))}
          </motion.div>

          {activeTab && (
            <motion.div 
              className="bg-white rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Class {activeTab} Weekly Schedule</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-3 bg-gray-50">Period</th>
                      {days.map((day) => (
                        <th 
                          key={day} 
                          className={`border p-3 ${day === "Saturday" ? "bg-red-50" : "bg-gray-50"}`}
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map((period) => (
                      <tr key={period}>
                        <td className="border p-3 font-medium bg-gray-50">Period {period}</td>
                        {days.map((day) => {
                          const periodData = groupedTimetable[activeTab][day]?.find(
                            (p) => p.periodNumber === period
                          );
                          const isSpecialDay = day === "Saturday";
                          const key = periodData ? `${day}-${period}-${periodData.teacher.name}` : null;
                          const substitute = key ? substitutions[key] : null;
                          
                          return (
                            <motion.td
                              key={`${activeTab}-${day}-${period}`}
                              className={`border p-3 ${isSpecialDay ? "bg-red-50" : ""} ${
                                substitute ? "bg-yellow-50" : ""
                              }`}
                              style={{ 
                                backgroundColor: getSubjectColor(periodData?.subject, day),
                                cursor: isSpecialDay ? "default" : "pointer"
                              }}
                              whileHover={{ 
                                scale: isSpecialDay ? 1 : 1.05,
                                boxShadow: isSpecialDay ? "none" : "0 5px 15px rgba(0,0,0,0.1)"
                              }}
                              onClick={() => periodData && handleTeacherClick(periodData.teacher, day, period)}
                            >
                              {periodData ? (
                                <div>
                                  <div className="font-medium">{periodData.subject}</div>
                                  <div className="text-sm text-gray-600">
                                    {substitute ? (
                                      <span className="text-green-600 font-medium">{substitute}</span>
                                    ) : (
                                      <span className={absentTeachers.has(periodData.teacher.name) ? "text-red-600" : ""}>
                                        {periodData.teacher.name}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-gray-500">Free Period</div>
                              )}
                            </motion.td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
      
      {showSubModal && <SubstitutionModal />}

      {message && (
        <motion.div
          className="fixed bottom-4 right-4 max-w-md mx-4 p-4 rounded-lg shadow-lg"
          style={{
            backgroundColor: message.includes("success") ? "#d4edda" : "#f8d7da",
            color: message.includes("success") ? "#155724" : "#721c24",
            border: `1px solid ${message.includes("success") ? "#c3e6cb" : "#f5c6cb"}`
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {message}
        </motion.div>
      )}

      {Object.keys(substitutions).length > 0 && (
        <motion.div 
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={handleAnnouncement}
            className="px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-lg flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            Post Substitution Announcements ({Object.keys(substitutions).length})
          </motion.button>
        </motion.div>
      )}

      <style jsx>{`
        .loader {
          border: 3px solid #f3f3f3;
          border-radius: 50%;
          border-top: 3px solid #3498db;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .timetable-management-container {
          min-height: 100vh;
          background-color: #f8f9fa;
        }

        .timetable td {
          transition: all 0.2s ease-in-out;
        }

        .timetable td:hover:not(.saturday-cell) {
          transform: scale(1.02);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .substitute-cell {
          position: relative;
        }

        .substitute-cell::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 12px 12px 0;
          border-color: transparent #4CAF50 transparent transparent;
        }

        @media (max-width: 768px) {
          .timetable-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .timetable {
            min-width: 800px;
          }

          .class-tabs {
            overflow-x: auto;
            white-space: nowrap;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default HMManageTimeTable;