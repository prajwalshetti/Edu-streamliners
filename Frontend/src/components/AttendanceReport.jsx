import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  UserX, 
  BarChart3,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
    type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
  }`}>
    <span>{message}</span>
    <button onClick={onClose} className="p-1 hover:bg-red-200 rounded">
      <X className="h-4 w-4" />
    </button>
  </div>
);
const baseurl = import.meta.env.VITE_BASE_URL;

const AttendanceReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000); // Auto dismiss after 5 seconds
  };

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseurl}/students/getTodaysAttendanceReport`);
      setData(response.data);
      showToast('Data refreshed successfully', 'success');
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      showToast('Failed to fetch attendance data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
          <p className="text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 min-h-screen">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <motion.div
        initial="initial"
        animate="animate"
        className="max-w-7xl mx-auto"
      >
        <motion.div className="flex items-center justify-between mb-8">
          <motion.h1 
            {...fadeIn} 
            className="text-3xl font-bold text-white"
          >
            Today's Attendance Dashboard
          </motion.h1>
          <motion.button
            {...fadeIn}
            onClick={fetchAttendanceData}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Refresh Data
          </motion.button>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            {...fadeIn}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-800">{data.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Present Today</p>
                <p className="text-2xl font-bold text-green-600">{data.totalPresent}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div 
            {...fadeIn}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent Today</p>
                <p className="text-2xl font-bold text-red-600">
                  {data.totalStudents - data.totalPresent}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-500" />
            </div>
          </motion.div>
        </div>

        {/* Class-wise Report */}
        <motion.div 
          {...fadeIn}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-gray-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Class-wise Attendance</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Present
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.report.map((item, index) => (
                  <motion.tr 
                    key={item.class}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.totalStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.totalPresent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              (item.totalPresent / item.totalStudents) * 100 >= 75 
                                ? 'bg-green-500' 
                                : (item.totalPresent / item.totalStudents) * 100 >= 50 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${item.totalStudents ? (item.totalPresent / item.totalStudents) * 100 : 0}%` 
                            }}
                          />
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {item.totalStudents ? ((item.totalPresent / item.totalStudents) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Alert Section */}
        {data.report.some(item => (item.totalPresent / item.totalStudents) * 100 < 75) && (
          <motion.div 
            {...fadeIn}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4"
          >
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-700">
                Some classes have attendance below 75%. Please review and take necessary action.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AttendanceReport;