import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, UserCircle, Building } from 'lucide-react';


const baseurl = import.meta.env.VITE_BASE_URL;

function TeacherProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${baseurl}/users/getProfile`, {
          credentials: 'include',
        });
        const data = await response.json();
        setProfile(data.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${baseurl}/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const teacherInfo = [
    { 
      icon: <Building className="w-5 h-5" />, 
      label: "School", 
      value: "Govt. High School Bengaluru",
      badge: "bg-blue-100 text-blue-800" 
    },
    { 
      icon: <UserCircle className="w-5 h-5" />, 
      label: "Role", 
      value: "Teacher",
      badge: "bg-green-100 text-green-800"
    },
    { 
      icon: <Mail className="w-5 h-5" />, 
      label: "Email", 
      value: profile.email 
    },
    { 
      icon: <Phone className="w-5 h-5" />, 
      label: "Phone", 
      value: profile.Phone_no 
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-45 bg-gradient-to-r from-blue-600 to-blue-400">
            <div className="pt-7 pl-7">
              <div className="w-28 h-28 bg-white rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-blue-600">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-16 pb-8 px-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.name}
                </h1>
                <p className="text-gray-500 mt-1">Teacher ID: {profile.id || 'N/A'}</p>
              </div>
            </div>

            <div className="grid gap-6">
              {teacherInfo.map((info, index) => (
                <div 
                  key={index}
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white shadow-sm">
                    <div className="text-blue-600">{info.icon}</div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-500">{info.label}</p>
                    <p className="text-base font-medium text-gray-900">{info.value}</p>
                  </div>
                  {info.badge && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${info.badge}`}>
                      {info.value}
                    </span>
                  )}
                </div>
              ))}

              {profile.bio && (
                <div className="p-6 bg-gray-50 rounded-xl mt-4">
                  <h3 className="font-medium text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;