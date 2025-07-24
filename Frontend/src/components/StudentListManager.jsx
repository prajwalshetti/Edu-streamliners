import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { X, Calendar, BookOpen, ChevronDown, AlertTriangle, Filter,Send } from 'lucide-react';

const baseurl = import.meta.env.VITE_BASE_URL; 
const StudentListManager = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentMarks, setStudentMarks] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedExamType, setSelectedExamType] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [studentStats, setStudentStats] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filterOptions = [
    { value: 'All', label: 'All Students', color: 'bg-gray-50' },
    { value: 'Critical', label: 'Critical (Marks < 40% & Attendance < 30%)', color: 'bg-red-50' },
    { value: 'LowMarks', label: 'Low Marks (< 40%)', color: 'bg-orange-50' },
    { value: 'LowAttendance', label: 'Low Attendance (< 30%)', color: 'bg-purple-50' },
    { value: 'Good', label: 'Good Standing', color: 'bg-green-50' }
  ];

  const getStudentCategory = (student) => {
    if (!student.stats) return 'All';
    
    const hasLowMarks = student.stats.averageMarks < 40;
    const hasLowAttendance = student.stats.attendancePercentage < 30;
    
    if (hasLowMarks && hasLowAttendance) return 'Critical';
    if (hasLowMarks) return 'LowMarks';
    if (hasLowAttendance) return 'LowAttendance';
    return 'Good';
  };

  const filteredStudents = students.filter(student => {
    if (selectedFilter === 'All') return true;
    return getStudentCategory(student) === selectedFilter;
  });

  const getRowColor = (student) => {
    if (!student.stats) return 'bg-gray-50';
    
    const hasLowMarks = student.stats.averageMarks < 40;
    const hasLowAttendance = student.stats.attendancePercentage < 30;
    
    if (hasLowMarks && hasLowAttendance) return 'bg-red-100 hover:bg-red-200';
    if (hasLowMarks) return 'bg-orange-100 hover:bg-orange-200';
    if (hasLowAttendance) return 'bg-purple-100 hover:bg-purple-200';
    return 'bg-green-100 hover:bg-green-200';
  };

  const getTextColor = (student) => {
    if (!student.stats) return 'text-gray-800';
    
    const hasLowMarks = student.stats.averageMarks < 40;
    const hasLowAttendance = student.stats.attendancePercentage < 30;
    
    if (hasLowMarks && hasLowAttendance) return 'text-red-800';
    if (hasLowMarks) return 'text-orange-800';
    if (hasLowAttendance) return 'text-purple-800';
    return 'text-green-800';
  };
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const examTypes = ['All', 'Unit Test', 'Mid Term', 'Final Term'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'];

                 const classOptions = Array.from({ length: 6 }, (_, i) => {
                  const grade = Math.floor((5 - i) / 2) + 8; // Reverse order of grades
                  const section = (5 - i) % 2 === 0 ? 'A' : 'B'; // Reverse order of sections
                  const value = `${grade}${section}`;
                  return { value, label: `Class ${value}` };
                });
              
                
  const fetchStudentDetails = async (studentId) => {
    try {
      // Fetch marks
      const marksResponse = await fetch(`${baseurl}/students/getExistingMarksByStudentId/${studentId}`);
      if (marksResponse.ok) {
        const marksData = await marksResponse.json();
        setStudentMarks(marksData);
      }

      // Fetch attendance
      const attendanceResponse = await fetch(`${baseurl}/students/getStudentAttendanceByStudentId/${studentId}`);
      if (attendanceResponse.ok) {
        const attendanceData = await attendanceResponse.json();
        setStudentAttendance(attendanceData);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  // New data transformation functions
  const getMonthlyAttendance = (month) => {
    return studentAttendance.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === month;
    });
  };

  const getExamTypeMarks = (examType) => {
    if (examType === 'All') return studentMarks;
    return studentMarks.filter(mark => mark.examType === examType);
  };

  const calculateSubjectAverages = (marks) => {
    const subjectMap = new Map();
    marks.forEach(mark => {
      if (!subjectMap.has(mark.subjectName)) {
        subjectMap.set(mark.subjectName, { total: 0, count: 0 });
      }
      const current = subjectMap.get(mark.subjectName);
      subjectMap.set(mark.subjectName, {
        total: current.total + mark.marks,
        count: current.count + 1
      });
    });

    return Array.from(subjectMap).map(([subject, data]) => ({
      subject,
      average: data.total / data.count
    }));
  };

  const calculateAttendanceStats = (attendance) => {
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'true').length;
    return [
      { name: 'Present', value: present },
      { name: 'Absent', value: total - present }
    ];
  };

    const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    await fetchStudentDetails(student._id);
    setShowModal(true);
  };

  const fetchStudentStats = async (studentId) => {
    try {
      // Fetch attendance
      const attendanceResponse = await fetch(`${baseurl}/students/getStudentAttendanceByStudentId/${studentId}`);
      const attendanceData = await attendanceResponse.json();
      
      // Fetch marks
      const marksResponse = await fetch(`${baseurl}/students/getExistingMarksByStudentId/${studentId}`);
      const marksData = await marksResponse.json();
      
      // Calculate attendance percentage
      const totalDays = attendanceData.length;
      const presentDays = attendanceData.filter(record => record.status === 'true').length;
      const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
      
      // Calculate marks percentage
      const averageMarks = marksData.length > 0 
        ? marksData.reduce((acc, curr) => acc + curr.marks, 0) / marksData.length 
        : 0;
      
      return {
        attendancePercentage,
        averageMarks
      };
    } catch (error) {
      console.error('Error fetching student stats:', error);
      return { attendancePercentage: 0, averageMarks: 0 };
    }
  };

  const fetchStudentsByClass = async (selectedClass) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${baseurl}/students/getStudentListByClass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ class: selectedClass }),
      });

      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      
      // Fetch stats for each student
      const studentsWithStats = await Promise.all(
        data.studentList.map(async (student) => {
          const stats = await fetchStudentStats(student._id);
          return { ...student, stats };
        })
      );
      
      setStudents(studentsWithStats);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // const getRowColor = (student) => {
  //   if (!student.stats) return 'bg-gray-50';
    
  //   const hasLowMarks = student.stats.averageMarks < 40;
  //   const hasLowAttendance = student.stats.attendancePercentage < 30;
    
  //   if (hasLowMarks && hasLowAttendance) return 'bg-red-50 hover:bg-red-100';
  //   if (hasLowMarks) return 'bg-orange-50 hover:bg-orange-100';
  //   if (hasLowAttendance) return 'bg-purple-50 hover:bg-purple-100';
  //   return 'bg-green-50 hover:bg-green-100';
  // };

  // const getTextColor = (student) => {
  //   if (!student.stats) return 'text-gray-800';
    
  //   const hasLowMarks = student.stats.averageMarks < 40;
  //   const hasLowAttendance = student.stats.attendancePercentance < 30;
    
  //   if (hasLowMarks && hasLowAttendance) return 'text-red-800';
  //   if (hasLowMarks) return 'text-orange-800';
  //   if (hasLowAttendance) return 'text-purple-800';
  //   return 'text-green-800';
  // };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-10">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Student List Manager</h2>
        <div className="mt-2 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span>Marks &lt; 40% and Attendance &lt; 30%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div>
            <span>Marks &lt; 40%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded"></div>
            <span>Attendance &lt; 30%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span>Good Standing</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Filter and Class Selection Row */}
        <div className="flex gap-4 items-center">
          {/* Class Dropdown */}
          <div className="relative w-64">
            <button
              className="w-full px-4 py-2 text-left bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedClass ? `Class ${selectedClass}` : "Select a class"}
              <ChevronDown className="absolute right-2 top-3 h-4 w-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                {classOptions.map((option) => (
                  <button
                    key={option.value}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                    onClick={() => {
                      setSelectedClass(option.value);
                      fetchStudentsByClass(option.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
  
          {/* Filter Dropdown */}
          <div className="relative w-80">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-3 h-4 w-4 text-gray-400" />
          </div>
  
          {/* Filter Statistics */}
          <div className="flex gap-4 ml-4 text-sm">
            <span className="text-gray-600">
              Showing: {filteredStudents.length} of {students.length} students
            </span>
          </div>
        </div>
  
        {/* Loading and Error States */}
        {loading && <div className="text-center py-4 text-gray-600">Loading students...</div>}
        {error && <div className="text-red-500 py-2">{error}</div>}
  
        {/* Students Table */}
        {!loading && !error && filteredStudents.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left border border-gray-200 font-semibold text-gray-700">Name</th>
                  <th className="p-3 text-left border border-gray-200 font-semibold text-gray-700">Roll Number</th>
                  <th className="p-3 text-left border border-gray-200 font-semibold text-gray-700">Email</th>
                  <th className="p-3 text-left border border-gray-200 font-semibold text-gray-700">Stats</th>
                  <th className="p-3 text-left border border-gray-200 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id} className={`${getRowColor(student)} transition-colors`}>
                    <td className={`p-3 border border-gray-200 ${getTextColor(student)}`}>{student.name}</td>
                    <td className={`p-3 border border-gray-200 ${getTextColor(student)}`}>{student.roll_no}</td>
                    <td className={`p-3 border border-gray-200 ${getTextColor(student)}`}>{student.email}</td>
                    <td className="p-3 border border-gray-200">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">
                          Attendance: {student.stats?.attendancePercentage.toFixed(1)}%
                        </span>
                        <span className="text-sm">
                          Avg. Marks: {student.stats?.averageMarks.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3 border border-gray-200">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        onClick={() => handleStudentSelect(student)}
                      >
                        View Details
                      </button>
                      
                    </td>

                    <td className="p-3 border border-gray-200">
                    <button 
                        className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 disabled:bg-gray-300"
                      >
                            <Send className="w-4 h-4" />
                            Send SMS
                      </button>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
  
        {!loading && !error && filteredStudents.length === 0 && selectedClass && (
          <div className="text-center py-4 text-gray-600">
            No students found matching the selected criteria.
          </div>
        )}
      </div>
  
      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Student Profile: {selectedStudent.name}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-4">Personal Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedStudent.name}</p>
                  <p><span className="font-medium">Roll No:</span> {selectedStudent.roll_no}</p>
                  <p><span className="font-medium">Email:</span> {selectedStudent.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedStudent.phone_no}</p>
                  <p><span className="font-medium">DOB:</span> {new Date(selectedStudent.dob).toLocaleDateString()}</p>
                  <p><span className="font-medium">Address:</span> {selectedStudent.address}</p>
                </div>
              </div>
  
              {/* Monthly Attendance Overview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Monthly Attendance</h4>
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="border rounded-md p-1"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index}>{month}</option>
                    ))}
                  </select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calculateAttendanceStats(getMonthlyAttendance(selectedMonth))}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {calculateAttendanceStats(getMonthlyAttendance(selectedMonth)).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
  
              {/* Academic Performance */}
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Academic Performance</h4>
                  <select 
                    value={selectedExamType}
                    onChange={(e) => setSelectedExamType(e.target.value)}
                    className="border rounded-md p-1"
                  >
                    {examTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getExamTypeMarks(selectedExamType)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subjectName" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="marks" fill="#3b82f6" name="Marks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Average Score</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {(studentMarks.reduce((acc, curr) => acc + curr.marks, 0) / studentMarks.length || 0).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Highest Score</p>
                    <p className="text-2xl font-bold text-green-700">
                      {Math.max(...studentMarks.map(m => m.marks), 0)}%
                    </p>
                  </div>
                </div>
              </div>
  
              {/* Subject-wise Performance */}
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <h4 className="font-semibold mb-4">Subject-wise Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {calculateSubjectAverages(studentMarks).map((subject, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow">
                      <h5 className="font-medium text-gray-700 mb-2">{subject.subject}</h5>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-indigo-600">
                          {subject.average.toFixed(1)}%
                        </span>
                        <span className="text-sm text-gray-500">average</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentListManager;