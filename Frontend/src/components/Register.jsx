import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, GraduationCap, BookOpen } from 'lucide-react';
import axios from 'axios';

const baseurl = import.meta.env.VITE_BASE_URL;

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Teacher");
  const [message, setMessage] = useState(null);
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
      
      console.log("Profile data:", response.data);
      const userRole = response.data.data.user.role;
      
      if (userRole === "Headmaster") {
        navigate("/hm");
      } else if (userRole === "Teacher") {
        navigate("/teacher");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setMessage({
        type: "error",
        text: "Failed to fetch user profile"
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const userData = {
      name: username,
      email,
      Phone_no: phone,
      password,
      role
    };

    try {
      
      const response = await axios.post(
        `${baseurl}/users/register`,
        userData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": 'application/json'
          },
        }
      );
      
      if (response.status === 200 || response.status === 201) {
        setMessage({
          type: "success", 
          text: "Registration successful! Welcome to Edu-StreamLiners. Redirecting to your dashboard..."
        });
        console.log("Registration successful:", response.data);
        await getUserProfile();
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Registration failed. Please try again."
      });
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
      </div>

      {/* Education Related Logos */}
      <div className="absolute top-10 right-10 text-white opacity-20">
        <GraduationCap className="w-32 h-32" />
      </div>
      <div className="absolute bottom-10 left-10 text-white opacity-20">
        <BookOpen className="w-24 h-24" />
      </div>

      {/* Centered Form Container with extra margin */}
      <div className="flex items-center justify-center min-h-screen px-4 my-12">
        <div className="relative z-10 w-full max-w-md p-8 bg-gray-800 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center transform hover:rotate-6 transition-transform duration-500">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
            <p className="mt-2 text-sm text-gray-300">
              Register now to gain full access to the Edu-StreamLiners portal and simplify your school management tasks.
            </p>
          </div>

          {message && (
            <div className={`p-3 mb-4 rounded-md text-center ${message.type === "success" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-200">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-200">Phone</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                id="role"
                type="checkbox"
                checked={role === "Headmaster"}
                onChange={(e) => setRole(e.target.checked ? "Headmaster" : "Teacher")}
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-600 rounded"
              />
              <label htmlFor="role" className="text-sm font-medium text-gray-200">Register as Headmaster</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition transform hover:-translate-y-1"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-300">Already have an account?</span>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition transform hover:-translate-y-1"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
