import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Pencil, 
  Save, 
  X, 
  Book, 
  Calendar, 
  Clock,
  Check,
  MoreVertical,
  Trash2,
  Copy,
  Download,
  Plus,
  Archive,
  List,
  Paperclip
} from 'lucide-react';
import axios from 'axios';
const baseurl1 = import.meta.env.VITE_BASE_URL;

const ExpandableLessonPlan = ({ plan, onStatusChange, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [formData, setFormData] = useState(plan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animateExpand, setAnimateExpand] = useState(false);

  const axiosInstance = axios.create({
    baseURL: baseurl1,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  const statusOptions = [
    { value: 'Draft', color: 'bg-gray-100 text-gray-700', badge: 'border-gray-300 bg-gray-50' },
    { value: 'Pending', color: 'bg-amber-100 text-amber-700', badge: 'border-amber-300 bg-amber-50' },
    { value: 'Approved', color: 'bg-emerald-100 text-emerald-700', badge: 'border-emerald-300 bg-emerald-50' },
    { value: 'Completed', color: 'bg-blue-100 text-blue-700', badge: 'border-blue-300 bg-blue-50' },
    { value: 'Cancelled', color: 'bg-red-100 text-red-700', badge: 'border-red-300 bg-red-50' }
  ];

  const handleExpandClick = (e) => {
    if (e.target.closest('.action-button') || e.target.closest('.status-dropdown')) {
      return;
    }
    setAnimateExpand(true);
    setIsExpanded(!isExpanded);
    setTimeout(() => setAnimateExpand(false), 300);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch(`/lessonPlans/${plan._id}/status`, {
        status: newStatus
      });
      
      if (response.data.statusCode === 200) {
        onStatusChange(plan._id, newStatus);
        setShowStatusDropdown(false);
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleBasicFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.patch(
        `/lessonPlans/${plan._id}`,
        formData
      );
      
      if (response.data.statusCode === 200) {
        onEdit(response.data.data);
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || 'Failed to update lesson plan');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lesson plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lesson plan?')) {
      try {
        setLoading(true);
        const response = await axiosInstance.delete(`/lessonPlans/${plan._id}`);
        
        if (response.data.statusCode === 200) {
          onDelete(plan._id);
        } else {
          throw new Error(response.data.message || 'Failed to delete lesson plan');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete lesson plan');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDuplicate = async () => {
    try {
      setLoading(true);
      const duplicateData = {
        ...formData,
        title: `${formData.title} (Copy)`,
        status: 'Draft'
      };
      delete duplicateData._id;
      delete duplicateData.createdAt;
      delete duplicateData.updatedAt;

      const response = await axiosInstance.post('/lessonPlans/create', duplicateData);
      
      if (response.data.statusCode === 201) {
        window.location.reload();
      } else {
        throw new Error(response.data.message || 'Failed to duplicate lesson plan');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to duplicate lesson plan');
    } finally {
      setLoading(false);
      setShowActions(false);
    }
  };

  const handleExport = () => {
    const content = `
      Title: ${plan.title}
      Subject: ${plan.subject}
      Grade: ${plan.grade}
      Section: ${plan.section}
      Date: ${new Date(plan.date).toLocaleDateString()}
      Duration: ${plan.duration}
      Status: ${plan.status}

      Learning Objectives:
      ${plan.learningObjectives?.join('\n')}

      Lesson Structure:
      
      Introduction:
      ${plan.lessonStructure?.introduction}

      Main Content:
      ${plan.lessonStructure?.mainContent}

      Conclusion:
      ${plan.lessonStructure?.conclusion}

      Assessment:
      ${plan.lessonStructure?.assessment}

      Materials:
      ${plan.materials?.join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowActions(false);
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return {
      text: option?.color || 'text-gray-700',
      badge: option?.badge || 'border-gray-300 bg-gray-50'
    };
  };

  return (
    <div 
      className={`overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md ${animateExpand ? 'scale-[1.01]' : ''}`}
    >
      <div 
        className="cursor-pointer p-6"
        onClick={handleExpandClick}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 flex-wrap">
              <h3 className="text-xl font-semibold text-gray-900">{plan.title}</h3>
              
              {/* Status Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusDropdown(!showStatusDropdown);
                    setShowActions(false);
                  }}
                  className={`status-dropdown inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm ${getStatusColor(plan.status).badge}`}
                >
                  <span className={`inline-block h-2 w-2 rounded-full ${getStatusColor(plan.status).text.replace('text', 'bg')}`}></span>
                  {plan.status}
                  <ChevronDown size={14} className="transition-transform duration-200" style={{ transform: showStatusDropdown ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                
                {showStatusDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fadeIn z-50"
                  >
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(option.value);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-100 focus:outline-none first:rounded-t-lg last:rounded-b-lg ${
                          plan.status === option.value ? 'bg-gray-50 font-medium' : ''
                        } transition-colors duration-150`}
                      >
                        <div className="flex items-center">
                          <span className={`inline-block h-2 w-2 rounded-full mr-2 ${option.color.replace('text', 'bg')}`}></span>
                          {option.value}
                          {plan.status === option.value && <Check size={14} className="ml-auto text-green-600" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Menu */}
              <div className="relative ml-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                    setShowStatusDropdown(false);
                  }}
                  className="action-button rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
                  aria-label="More options"
                >
                  <MoreVertical size={20} />
                </button>

                {showActions && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fadeIn z-50"
                  >
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditing(true);
                          setShowActions(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-100 focus:outline-none flex items-center gap-2 transition-colors duration-150"
                      >
                        <Pencil size={16} className="text-blue-600" />
                        <span>Edit Plan</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate();
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-100 focus:outline-none flex items-center gap-2 transition-colors duration-150"
                      >
                        <Copy size={16} className="text-indigo-600" />
                        <span>Duplicate</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExport();
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-100 focus:outline-none flex items-center gap-2 transition-colors duration-150"
                      >
                        <Download size={16} className="text-green-600" />
                        <span>Export</span>
                      </button>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 focus:bg-red-100 focus:outline-none flex items-center gap-2 text-red-600 transition-colors duration-150"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">Grade {plan.grade} | Section {plan.section}</p>
          </div>
          <div className={`ml-4 rounded-full p-2 transition-colors duration-200 ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="rounded-lg bg-blue-50 p-2 shadow-sm">
              <Book size={18} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium">{plan.subject}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <div className="rounded-lg bg-emerald-50 p-2 shadow-sm">
              <Calendar size={18} className="text-emerald-600" />
            </div>
            <span className="text-sm font-medium">
              {new Date(plan.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <div className="rounded-lg bg-purple-50 p-2 shadow-sm">
              <Clock size={18} className="text-purple-600" />
            </div>
            <span className="text-sm font-medium">{plan.duration}</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className={`border-t border-gray-200 p-6 bg-gray-50 rounded-b-xl animate-fadeIn`}>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Pencil size={16} className="text-blue-600" />
                  Edit Lesson Plan
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(plan);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Save size={16} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h5 className="text-md font-medium text-gray-900 mb-4">Basic Information</h5>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {['title', 'subject', 'grade', 'section', 'date', 'duration'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                        {field}
                      </label>
                      <input
                        type={field === 'date' ? 'date' : 'text'}
                        name={field}
                        value={field === 'date' ? formData[field]?.split('T')[0] : formData[field] || ''}
                        onChange={handleBasicFieldChange}
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h5 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <List size={16} className="text-blue-600" />
                  Learning Objectives
                </h5>
                <div className="space-y-3">
                  {formData.learningObjectives?.map((objective, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="bg-blue-100 text-blue-800 font-medium rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => handleArrayInputChange('learningObjectives', index, e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                        placeholder={`Objective ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
                          }));
                        }}
                        className="rounded-lg border border-gray-300 p-2 text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200"
                        aria-label="Remove objective"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        learningObjectives: [...(prev.learningObjectives || []), '']
                      }));
                    }}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Plus size={16} />
                    Add Objective
                  </button>
                </div>
              </div>

              {/* Lesson Structure */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h5 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Archive size={16} className="text-indigo-600" />
                  Lesson Structure
                </h5>
                <div className="space-y-4">
                  {['introduction', 'mainContent', 'conclusion', 'assessment'].map((field) => (
                    <div key={field} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <label className="block text-sm font-medium text-gray-700 capitalize mb-2 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          field === 'introduction' ? 'bg-green-500' :
                          field === 'mainContent' ? 'bg-blue-500' :
                          field === 'conclusion' ? 'bg-purple-500' : 'bg-amber-500'
                        }`}></div>
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <textarea
                        value={formData.lessonStructure?.[field] || ''}
                        onChange={(e) => handleNestedInputChange('lessonStructure', field, e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                        rows={4}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources and Materials */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h5 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Paperclip size={16} className="text-amber-600" />
                  Resources and Materials
                </h5>
                <div className="space-y-3">
                  {formData.materials?.map((material, index) => (
                    <div key={index} className="flex gap-2 items-center group">
                      <span className="bg-amber-100 text-amber-800 font-medium rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => handleArrayInputChange('materials', index, e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm group-hover:border-amber-300 transition-colors duration-200"
                        placeholder={`Material ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            materials: prev.materials.filter((_, i) => i !== index)
                          }));
                        }}
                        className="rounded-lg border border-gray-300 p-2 text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors duration-200"
                        aria-label="Remove material"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        materials: [...(prev.materials || []), '']
                      }));
                    }}
                    className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium mt-2 px-3 py-1 rounded-md hover:bg-amber-50 transition-colors duration-200"
                  >
                    <Plus size={16} />
                    Add Material
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Learning Objectives */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <List size={18} className="text-blue-600" />
                  Learning Objectives
                </h4>
                <ul className="space-y-2">
                  {plan.learningObjectives?.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <span className="bg-blue-100 text-blue-800 font-medium rounded-full w-6 h-6 flex items-center justify-center text-xs mt-0.5 shadow-sm">
                        {index + 1}
                      </span>
                      <span className="flex-1">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lesson Structure */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Archive size={18} className="text-indigo-600" />
                  Lesson Structure
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {['introduction', 'mainContent', 'conclusion', 'assessment'].map((field) => (
                    <div key={field} className={`border p-4 rounded-lg ${
                      field === 'introduction' ? 'bg-green-50 border-green-100' :
                      field === 'mainContent' ? 'bg-blue-50 border-blue-100' :
                      field === 'conclusion' ? 'bg-purple-50 border-purple-100' : 
                      'bg-amber-50 border-amber-100'
                    }`}>
                      <h5 className={`text-sm font-medium capitalize mb-2 ${
                        field === 'introduction' ? 'text-green-700' :
                        field === 'mainContent' ? 'text-blue-700' :
                        field === 'conclusion' ? 'text-purple-700' : 
                        'text-amber-700'
                      }`}>
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </h5>
                      <p className="text-gray-600 whitespace-pre-wrap text-sm">
                        {plan.lessonStructure?.[field]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources and Materials */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Paperclip size={18} className="text-amber-600" />
                  Resources and Materials
                </h4>
                {plan.materials && plan.materials.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {plan.materials?.map((material, index) => (
                      <li key={index} className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-center gap-2 text-gray-700 shadow-sm">
                        <span className="bg-amber-100 text-amber-800 font-medium rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-sm flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm line-clamp-2">{material}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No materials specified</p>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 animate-pulse">
              <div className="flex items-center gap-2">
                <X size={16} className="text-red-600" />
                {error}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Add these animations to your CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default ExpandableLessonPlan;