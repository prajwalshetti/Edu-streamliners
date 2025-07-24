import React, { useState, useEffect } from "react";
import { 
  Plus, Book, Calendar, Clock, Edit, Trash2, AlertCircle, 
  CheckCircle2, ClipboardList, GraduationCap, Layers,
  ChevronDown, ChevronUp, Save, X, FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import CreateLessonPlan from "./CreateLessonPlan";
import ExpandableLessonPlan from "./ExpandableLessonPlan";
import StatsDashboard from "./LesssonPlanStatsDashboard";

const baseurl1 = import.meta.env.VITE_BASE_URL;

const TeacherLessonPlan = () => {
  const [lessonPlans, setLessonPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    subject: "",
    grade: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    draft: 0
  });

  const axiosInstance = axios.create({
    baseURL: baseurl1,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  const statusOptions = [
    { value: 'Draft', color: 'bg-gray-100 text-gray-700' },
    { value: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'Approved', color: 'bg-green-100 text-green-700' },
    { value: 'Completed', color: 'bg-blue-100 text-blue-700' },
    { value: 'Cancelled', color: 'bg-red-100 text-red-700' }
  ];

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/lessonPlans/stats');
      setStats(response.data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchLessonPlans = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      }).toString();

      const response = await axiosInstance.get(`/lessonPlans/list?${queryParams}`);
      setLessonPlans(response.data.data.lessonPlans);
      setPagination({
        ...pagination,
        total: response.data.data.pagination.total,
        pages: response.data.data.pagination.pages
      });
      setError(null);
    } catch (err) {
      setError("Failed to fetch lesson plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonPlans();
    fetchStats();
  }, [filters, pagination.page]);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/lessonPlans/${id}`);
      setLessonPlans(lessonPlans.filter(plan => plan._id !== id));
      setDeleteConfirm(null);
      fetchStats(); // Refresh stats after deletion
    } catch (err) {
      setError("Failed to delete lesson plan. Please try again.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axiosInstance.patch(`/lessonPlans/${id}/status`, {
        status: newStatus
      });
      setLessonPlans(lessonPlans.map(plan => 
        plan._id === id ? response.data.data : plan
      ));
      fetchStats(); // Refresh stats after status change
    } catch (err) {
      setError("Failed to update status. Please try again.");
    }
  };

  const handleCreateSuccess = async (newLessonPlan) => {
    setLessonPlans([newLessonPlan, ...lessonPlans]);
    setShowCreateModal(false);
    fetchStats(); // Refresh stats after creation
  };

  const handleEditSuccess = async (updatedPlan) => {
    setLessonPlans(lessonPlans.map(plan => 
      plan._id === updatedPlan._id ? updatedPlan : plan
    ));
    setShowEditModal(false);
    setSelectedPlan(null);
    fetchStats(); // Refresh stats after edit
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-8"
    >
      {/* Header Section */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lesson Plans</h1>
          <p className="mt-1 text-sm text-gray-500">Design and manage your teaching curriculum</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus size={18} />
          Create New Plan
        </motion.button>
      </motion.div>

      {/* Statistics Cards */}
      <StatsDashboard />

      {/* Filters Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 rounded-xl bg-white p-6 shadow-sm"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filter Plans</h2>
          <button 
            className="text-sm text-blue-600 hover:text-blue-700"
            onClick={() => setFilters({
              subject: "",
              grade: "",
              status: "",
              startDate: "",
              endDate: "",
            })}
          >
            Clear all
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <FilterInput
            placeholder="Subject"
            value={filters.subject}
            onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
            icon={<Book size={18} />}
          />
          <FilterInput
            placeholder="Grade"
            value={filters.grade}
            onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
            icon={<GraduationCap size={18} />}
          />
          <FilterSelect
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            options={statusOptions}
          />
          <FilterInput
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            icon={<Calendar size={18} />}
          />
          <FilterInput
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            icon={<Calendar size={18} />}
          />
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-red-700"
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Plans List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {lessonPlans.map((plan, index) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ExpandableLessonPlan 
                plan={plan} 
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onEdit={(plan) => {
                  setSelectedPlan(plan);
                  setShowEditModal(true);
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex justify-center gap-2"
        >
          {[...Array(pagination.pages)].map((_, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPagination({ ...pagination, page: i + 1 })}
              className={`h-8 min-w-[2rem] rounded px-3 text-sm transition-colors ${
                pagination.page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateLessonPlan
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* {showEditModal && selectedPlan && (
        <EditLessonPlan
          plan={selectedPlan}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPlan(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )} */}
    </motion.div>
  );
};

// Helper Components
const StatCard = ({ icon, title, value, trend, bgColor }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`rounded-xl ${bgColor} p-6`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <h3 className="mt-2 text-3xl font-bold">{value}</h3>
      </div>
      <div className="rounded-full bg-white p-3">
        {icon}
      </div>
    </div>
    <p className="mt-2 text-sm text-gray-600">
      {trend} from last month
    </p>
  </motion.div>
);

const FilterInput = ({ type = "text", placeholder, value, onChange, icon }) => (
  <div className="relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      {icon}
    </div>
    <input
      type={type}
      className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const FilterSelect = ({ value, onChange, options }) => (
  <select
    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    value={value}
    onChange={onChange}
  >
    <option value="">All Status</option>
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.value}
      </option>
    ))}
  </select>
);

export default TeacherLessonPlan;