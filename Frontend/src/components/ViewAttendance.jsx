import React, { useState, useEffect } from "react";
import { 
  Users, 
  Calendar as CalendarIcon, 
  Loader2,
  Search,
  CheckCircle,
  XCircle,
  Send,
  UserCheck,
  UserX
} from "lucide-react";

const baseurl = import.meta.env.VITE_BASE_URL;

const ViewAttendance = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sendingSMS, setSendingSMS] = useState({});
  const [toast, setToast] = useState(null);

  const classes = [
    { id: "1", name: "10A" },
    { id: "2", name: "10B" },
    { id: "3", name: "9A" },
    { id: "4", name: "9B" },
    { id: "5", name: "8A" },
    { id: "6", name: "8B" },
  ];

  const fetchAttendance = async () => {
    if (!selectedClass) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${baseurl}/students/getAttendanceByClass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className: selectedClass,
          date: selectedDate.toISOString().split('T')[0]
        })
      });

      const data = await response.json();
      
      if (data.students) {
        setStudents(data.students);
      } else {
        setError("No attendance records found");
      }
    } catch (error) {
      setError("Failed to fetch attendance. Please try again.");
      console.error("Error fetching attendance:", error);
    }
    
    setIsLoading(false);
  };

  // Updated sendSMS: use a unique key and show a toast instead of alerts
  const sendSMS = async (student) => {
    const key = student._id || student.roll_no;
    if (!student.phone_no) {
      setToast({ message: "Phone number not available for this student.", type: "error" });
      setTimeout(() => setToast(null), 2000);
      return;
    }

    setSendingSMS((prev) => ({ ...prev, [key]: true }));

    try {
      const response = await fetch(`${baseurl}/sms/send-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: student.phone_no,
          studentName: student.name,
          attendanceStatus: student.attendanceStatus === "true"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send SMS");
      }

      setToast({ message: `SMS sent successfully to ${student.phone_no}`, type: "success" });
      setTimeout(() => setToast(null), 2000);
    } catch (error) {
      console.error("Failed to send SMS:", error);
      setToast({ message: error.message || "Failed to send SMS. Please try again.", type: "error" });
      setTimeout(() => setToast(null), 2000);
    } finally {
      setSendingSMS((prev) => ({ ...prev, [key]: false }));
    }
  };

  const totalStudents = students.length;
  const presentStudents = students.filter(student => student.attendanceStatus === "true").length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">View Attendance</h1>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <select 
              className="flex-1 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSelectedClass(e.target.value)}
              value={selectedClass}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.name}>{cls.name}</option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button 
              onClick={fetchAttendance}
              disabled={!selectedClass || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  View
                </>
              )}
            </button>
          </div>

          {students.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-50">
                <div className="bg-blue-100 p-4 rounded-lg flex items-center justify-between hover:bg-blue-200">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="ml-2 text-blue-900">Total Students</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-900">{totalStudents}</span>
                </div>
                <div className="bg-green-100 p-4 rounded-lg flex items-center justify-between hover:bg-green-200">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    <span className="text-green-900">Present Students</span>
                  </div>
                  <span className="text-2xl font-bold text-green-900">{presentStudents}</span>
                </div>
              </div>

              {/* Additional options for sending SMS */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => {
                    // Send SMS to parents of absent students
                    students
                      .filter(student => student.attendanceStatus === "false")
                      .forEach(student => sendSMS(student));
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300 flex items-center gap-2 justify-center"
                >
                  <UserX className="w-5 h-5" />
                  Send SMS to Absent
                </button>
                <button 
                  onClick={() => {
                    // Send SMS to all students
                    students.forEach(student => sendSMS(student));
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 justify-center"
                >
                  <Send className="w-5 h-5" />
                  Send SMS to All
                </button>
              </div>

              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">Roll No: {student.roll_no}</p>
                      <p className="text-sm text-gray-600">Phone: {student.phone_no || "N/A"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                        student.attendanceStatus === "true" 
                          ? "bg-green-100 text-green-700" 
                          : student.attendanceStatus === "false"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {student.attendanceStatus === "true" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : student.attendanceStatus === "false" ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          "-"
                        )}
                        <span className="font-medium">
                          {student.attendanceStatus === "true" 
                            ? "Present" 
                            : student.attendanceStatus === "false"
                            ? "Absent"
                            : "Not Recorded"}
                        </span>
                      </div>
                      <button 
                        onClick={() => sendSMS(student)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 disabled:bg-gray-300"
                        disabled={sendingSMS[student._id || student.roll_no]}
                      >
                        {sendingSMS[student._id || student.roll_no] ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send SMS
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {toast && (
        <div className={`fixed bottom-4 right-4 ${toast.type === "success" ? "bg-green-600" : "bg-red-600"} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-[slideIn_0.3s_ease-out]`}>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;
