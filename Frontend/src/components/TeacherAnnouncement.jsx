import { useEffect, useState } from "react";
import { Megaphone, AlertCircle, ChevronRight, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";



const baseurl = import.meta.env.VITE_BASE_URL;

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${baseurl}/announcements`);
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setAnnouncements(data.data.reverse());
        } else {
          setError("Invalid response format from server.");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch announcements.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-6">
        <div className="space-y-6 w-full max-w-4xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-1">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse" />
              <div className="h-40 rounded-lg bg-gray-800/50" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-500/10 backdrop-blur-lg border border-red-500/20 text-red-400 px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 animate-pulse" />
        <div className="relative flex items-center gap-4 px-8 py-6 bg-gray-900/70 backdrop-blur-xl rounded-lg border border-gray-700/50 shadow-xl">
          <div className="p-3 bg-blue-500/10 rounded-full">
            <Megaphone className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Announcements
            </h2>
            <p className="text-gray-400 mt-1">Stay updated with the latest news and updates</p>
          </div>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-300" />
          <div className="relative bg-gray-900/70 backdrop-blur-xl rounded-lg p-8 text-center border border-gray-700/50 shadow-lg">
            <p className="text-gray-400">No announcements available at the moment.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map(({ _id, title, description, date }, index) => (
            <div
              key={_id}
              className="relative group"
              style={{
                animationDelay: `${index * 150}ms`,
                animation: "slideIn 0.6s ease-out forwards",
              }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-10 group-hover:opacity-25 transition duration-300" />
              <div className="relative bg-gray-900/70 backdrop-blur-xl rounded-lg p-6 border border-gray-700/50 transform transition-all duration-300 hover:scale-[1.02] group-hover:border-blue-500/30 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                    {title}
                  </h3>
                  <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transform transition-all duration-300 group-hover:translate-x-1" />
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">{description}</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all duration-300">
                    {formatDate(date)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Announcements;