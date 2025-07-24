import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, UserPlus, User, BookOpen, GraduationCap } from 'lucide-react';

const baseurl = import.meta.env.VITE_BASE_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getUserProfile = async () => {
    try {
      const response = await axios.get(`${baseurl}/users/getProfile`, {
        withCredentials: true,
        headers: {
          "Content-Type": 'application/json'
        },
      });

      console.log(response.data);
      const userRole = response.data.data.user.role;

      // Redirect based on role
      if (userRole === "Headmaster") {
        navigate("/hm");
      } else if (userRole === "Teacher") {
        navigate("/teacher");
      }
      // Add other role redirections if needed

    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to fetch user profile");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(`${baseurl}/users/login`,
        { email, name, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": 'application/json'
          },
        }
      );

      setSuccess(response.data.message || "Logged in successfully!");
      console.log("User Data:", response.data.data.user);

      // After successful login, get user profile and redirect
      await getUserProfile();

    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-pink-600 to-yellow-600 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-10 right-10 text-white opacity-20">
          <GraduationCap className="w-32 h-32" />
        </div>
        <div className="absolute bottom-10 left-10 text-white opacity-20">
          <BookOpen className="w-24 h-24" />
        </div>
      </div>

      {/* Centered Form Container */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="relative z-10 w-full max-w-md p-8 bg-gray-800 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center transform hover:rotate-6 transition-transform duration-500">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">Sign In</h2>
            <p className="mt-2 text-sm text-gray-300">Access your Edu-StreamLiners portal</p>
          </div>

          {error && (
            <div className="flex items-center p-4 mb-4 bg-red-900 border-l-4 border-red-500 rounded-md">
              <div className="mr-3">
                <GraduationCap className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center p-4 mb-4 bg-green-900 border-l-4 border-green-500 rounded-md">
              <div className="mr-3">
                <GraduationCap className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200">Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:-translate-y-1"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-300">Don't have an account?</span>
            </div>
            <div className="mt-4 flex justify-center">
              <button 
                onClick={() => navigate("/register")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition transform hover:-translate-y-1"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
