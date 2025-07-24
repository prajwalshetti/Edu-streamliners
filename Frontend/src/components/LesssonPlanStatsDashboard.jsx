import React, { useState, useEffect } from "react";
import { 
  FileText, 
  CheckCircle2, 
  ClipboardList, 
  Layers, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react";
import { motion } from "framer-motion";
const baseurl = import.meta.env.VITE_BASE_URL;


const StatCard = ({ icon: Icon, title, value, trend, bgColor }) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className={`${bgColor} rounded-lg p-6 relative overflow-hidden`}
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="p-2 rounded-lg bg-white/50">
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
    </div>
    <div className="mt-4 flex items-center">
      {trend >= 0 ? (
        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
      )}
      <span className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend}% from last month
      </span>
    </div>
  </motion.div>
);

const StatsDashboard = () => {
  const [stats, setStats] = useState({
    total: 3,
    completed: 1,
    pending: 0,
    draft: 1,
    trends: {
      total: 0,
      completed: 100,
      pending: 0,
      draft: 100
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseurl}/lessonPlans/stats`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.statusCode === 200) {
        setStats(data.data.stats);
      } else {
        throw new Error(data.message || 'Failed to fetch stats');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error loading statistics: {error}
      </div>
    );
  }

  const cards = [
    {
      icon: FileText,
      title: "Total Plans",
      value: stats.total,
      trend: stats.trends.total,
      bgColor: "bg-blue-50"
    },
    {
      icon: CheckCircle2,
      title: "Completed",
      value: stats.completed,
      trend: stats.trends.completed,
      bgColor: "bg-green-50"
    },
    {
      icon: ClipboardList,
      title: "Pending",
      value: stats.pending,
      trend: stats.trends.pending,
      bgColor: "bg-yellow-50"
    },
    {
      icon: Layers,
      title: "Draft",
      value: stats.draft,
      trend: stats.trends.draft,
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <StatCard 
          key={index} 
          {...card} 
          // Add staggered animation delay for each card
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </div>
  );
};

export default StatsDashboard;