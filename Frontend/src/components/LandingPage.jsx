import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  ClipboardList, 
  BarChart2, 
  Bell, 
  Users, 
  Calendar, 
  CheckSquare,
  BookOpenCheck,
  School,
  GraduationCap
} from 'lucide-react';
import shreyas from "../../public/shreays.jpg";
import somi from "../../public/somi.jpg";
import vishesh from "../../public/vishesh.jpg";
import prajwal from "../../public/prajwal.jpg";

import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for a smooth entrance
      staggerChildren: 0.1,
      when: "beforeChildren"
    } 
  }
};
const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header / Navigation Bar */}
      <header className="bg-gray-900 shadow-md py-4 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-400 mr-2" />
            <div>
              <h1 className="text-2xl font-bold text-blue-400">Edu-StreamLiners</h1>
              <p className="text-sm text-gray-400">Streamlining Educational Management</p>
            </div>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-8 items-center">
              <li>
                <a href="#features" className="text-gray-300 hover:text-blue-400 transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-gray-300 hover:text-blue-400 transition">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-blue-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-300 hover:text-blue-400 transition">
                  Testimonials
                </a>
              </li>
              <li>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-2 px-4 rounded-md transition">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <nav className="md:hidden bg-gray-900 px-6 py-4">
            <ul className="flex flex-col space-y-4">
              <li>
                <a href="#features" className="text-gray-300 hover:text-blue-400 transition" onClick={() => setIsMenuOpen(false)}>
                  Features
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-gray-300 hover:text-blue-400 transition" onClick={() => setIsMenuOpen(false)}>
                  Benefits
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-blue-400 transition" onClick={() => setIsMenuOpen(false)}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-300 hover:text-blue-400 transition" onClick={() => setIsMenuOpen(false)}>
                  Testimonials
                </a>
              </li>
              <li>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-2 px-4 rounded-md transition" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <motion.section
  className="py-16 md:py-24"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={sectionVariants}
>        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100 leading-tight mb-6">
              Empowering Teachers, Enhancing Education
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Reduce administrative burden and focus on what matters most – teaching and student engagement.
              Our comprehensive school management system streamlines attendance, performance tracking, and communication.
            </p>
            <div className="flex space-x-4">
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition">
                Get Started
              </Link>
              <a href="#features" className="bg-transparent border border-gray-500 hover:border-blue-600 text-gray-300 hover:text-blue-400 font-medium py-3 px-6 rounded-md transition">
                Learn More
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="http://bangalorenewsnetwork.com/newspics/2018/august/1caa45e1234260b64bf67be8aaeb2568/1caa4_Halasahalli.jpg" 
              alt="School Management System Dashboard" 
              className="rounded-lg shadow-xl object-cover max-w-full h-auto"
              style={{ maxHeight: '400px', width: 'auto' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg";
              }}
            />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
  id="features"
  className="py-16 bg-gray-800"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={sectionVariants}
>        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Comprehensive Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our School Management System automates critical tasks to save time and improve efficiency.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-700 rounded-lg p-8 transition hover:shadow-lg">
              <BarChart2 className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Student Performance Tracking</h3>
              <p className="text-gray-300">
                Comprehensive view of student progress, including attendance and marks, with shareable reports for parents.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-700 rounded-lg p-8 transition hover:shadow-lg">
              <CheckSquare className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Flexible Attendance Management</h3>
              <p className="text-gray-300">
                Mark attendance online or offline with Excel upload capability for areas with limited connectivity.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-700 rounded-lg p-8 transition hover:shadow-lg">
              <Bell className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Automated Notifications</h3>
              <p className="text-gray-300">
                Instant SMS alerts to parents for student absences, ensuring timely communication and improved safety.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-gray-700 rounded-lg p-8 transition hover:shadow-lg">
              <ClipboardList className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Marks Management</h3>
              <p className="text-gray-300">
                Easily record and track student marks, generate reports, and identify performance trends.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-gray-700 rounded-lg p-8 transition hover:shadow-lg">
              <BookOpenCheck className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Lesson Planning</h3>
              <p className="text-gray-300">
                Plan, track, and evaluate lessons efficiently, improving teaching quality and student outcomes.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-gray-700 rounded-lg p-8 transition hover:shadow-lg">
              <Calendar className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Timetable & Exam Management</h3>
              <p className="text-gray-300">
                Create and manage timetables, schedule exams, and assign substitute teachers with ease.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
  id="benefits"
  className="py-16 bg-gray-800"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={sectionVariants}
>        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Edu-StreamLiners?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our platform offers significant advantages for schools, teachers, and parents.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="bg-green-900 p-2 rounded-full mr-4">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Time-Saving Automation</h3>
                    <p className="text-gray-300">Reduces manual workload by 60%, saving up to 10 hours per week for teachers.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-900 p-2 rounded-full mr-4">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Enhanced Parent Engagement</h3>
                    <p className="text-gray-300">Real-time notifications and performance tracking foster better school-parent communication.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-900 p-2 rounded-full mr-4">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Works Offline</h3>
                    <p className="text-gray-300">Excel upload feature enables use in areas with limited internet connectivity.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gray-800 p-8 rounded-lg shadow-xl relative z-10">
                <h3 className="text-2xl font-bold text-blue-400 mb-4">Impact Statistics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">60%</p>
                    <p className="text-gray-300">Reduction in Administrative Work</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">10hrs</p>
                    <p className="text-gray-300">Weekly Time Saved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">85%</p>
                    <p className="text-gray-300">Increase in Parent Engagement</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-white">100%</p>
                    <p className="text-gray-300">Accurate Resource Allocation</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-blue-900 rounded-lg transform translate-x-4 translate-y-4"></div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* About Us Section - Team Photo Removed */}
      // About Us Section with Team Photos and Animations
      <motion.section
  id="about"
  className="py-16 bg-gray-800"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={sectionVariants}
>  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-white mb-4">About Edu-StreamLiners</h2>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
        Driven by student insights and technical passion to transform education management.
      </p>
    </div>
    <div className="flex flex-col items-center">
      <div className="w-full mb-12">
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">Our Mission</h3>
        <p className="text-gray-300 mb-8 text-center max-w-3xl mx-auto">
          At Edu-StreamLiners, we're passionate about freeing teachers from administrative burdens so they can focus on what they do best – inspiring and educating students. As students ourselves, we've witnessed the challenges educators face every day.
        </p>
        <p className="text-gray-300 mb-12 text-center max-w-3xl mx-auto">
          Our team combines our educational experiences with our technical studies in computer science to create practical solutions that could make a real difference in schools across diverse environments.
        </p>
      </div>
      
     {/* <h3 className="text-2xl font-semibold text-white mb-10 text-center">Meet Our Team</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
       
        <div 
          className="bg-gray-700 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl p-6 text-center"
        >
          <div className="mx-auto w-40 h-40 mb-6 relative overflow-hidden rounded-full border-4 border-blue-500">
            <img 
              src={`${prajwal}`} 
              alt="Prajwal P Shetti" 
              className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
            />
          </div>
          <h4 className="text-xl font-bold text-white">Prajwal P Shetti</h4>
<p className="text-blue-400 mb-4">Full-Stack Developer</p>
<p className="text-gray-300 text-sm">
Full-stack developer with strong problem-solving skills, building efficient web applications.
</p>

          <div className="flex mt-4 space-x-3 justify-center">
            <a href="https://www.instagram.com/prajwalshetti_8104" className="text-blue-400 hover:text-blue-300 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://github.com/prajwalshetti" className="text-blue-400 hover:text-blue-300 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/prajwal-shetti-b1aa2625a/" className="text-blue-400 hover:text-blue-300 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
              </svg>
            </a>
          </div>
        </div>
        
        
        <div 
          className="bg-gray-700 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl p-6 text-center"
        >
          <div className="mx-auto w-40 h-40 mb-6 relative overflow-hidden rounded-full border-4 border-blue-500">
            <img 
              src={`${shreyas}`}
              alt="Shreyas D K" 
              className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
            />
          </div>
          <h4 className="text-xl font-bold text-white">Shreyas D K</h4>
          <p className="text-blue-400 mb-4">Full-Stack Developer</p>
           <p className="text-gray-300 text-sm">
                 Combining full-stack development expertise with a deep interest in data analytics and statistics.
           </p>

           <div className="flex mt-4 space-x-3 justify-center">
  <a href="https://www.instagram.com/shreyasdk28" className="text-blue-400 hover:text-blue-300 transition-colors">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  </a>
  <a href="https://github.com/Shreyasdk28" className="text-blue-400 hover:text-blue-300 transition-colors">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  </a>
  <a href="https://www.linkedin.com/in/shreyas-d-k-341210257" className="text-blue-400 hover:text-blue-300 transition-colors">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  </a>
</div>
        </div>
        
       
        <div 
          className="bg-gray-700 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl p-6 text-center"
        >
          <div className="mx-auto w-40 h-40 mb-6 relative overflow-hidden rounded-full border-4 border-blue-500">
            <img 
              src={`${somi}`}
              alt="Somanath Mikali" 
              className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
            />
          </div>
          <h4 className="text-xl font-bold text-white">Somanath Mikali</h4>
<p className="text-blue-400 mb-4">Backend Developer</p>
<p className="text-gray-300 text-sm">
  Backend developer with a keen interest in Machine Learning and its real-world applications.
</p>


          <div className="flex mt-4 space-x-3 justify-center">
  <a href="https://www.instagram.com/somanna02/" className="text-blue-400 hover:text-blue-300 transition-colors">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  </a>
  <a href="https://github.com/Somanath2314" className="text-blue-400 hover:text-blue-300 transition-colors">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  </a>
  <a href="https://www.linkedin.com/in/somanath-mikali?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="text-blue-400 hover:text-blue-300 transition-colors">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  </a>
</div>
        </div>
        
     
        <div 
          className="bg-gray-700 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl p-6 text-center"
        >
          <div className="mx-auto w-40 h-40 mb-6 relative overflow-hidden rounded-full border-4 border-blue-500">
            <img 
              src={`${vishesh}`}
              alt="Vishesh P Gowda" 
              className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
            />
          </div>
          <h4 className="text-xl font-bold text-white">Vishesh P Gowda</h4>
<p className="text-blue-400 mb-4">Backend Developer</p>
<p className="text-gray-300 text-sm">
  Enthusiastic backend developer exploring Machine Learning and Deep Learning to build intelligent systems.
</p>


<div className="flex mt-4 space-x-3 justify-center">
  <a href="https://www.instagram.com/vishesh.1525/" className="text-blue-400 hover:text-blue-300 transition-colors">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  </a>
  <a href="https://github.com/Visheshpgowda" className="text-blue-400 hover:text-blue-300 transition-colors">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  </a>
  <a href="https://www.linkedin.com/in/vishesh-p-gowda/" className="text-blue-400 hover:text-blue-300 transition-colors">
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  </a>
</div>
        </div>
      </div>*/}
      
      {/* Core Values */}
      <div className="mt-20 w-full">
        <h3 className="text-2xl font-semibold text-white mb-10 text-center">Our Core Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div 
            className="bg-gray-700 rounded-lg p-6 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-t-4 border-blue-500"
          >
            <div className="bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Reliability</h4>
            <p className="text-gray-300">
              We aim to build systems that work consistently, even in challenging connectivity environments.
            </p>
          </div>
          
          <div 
            className="bg-gray-700 rounded-lg p-6 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-t-4 border-blue-500"
          >
            <div className="bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Efficiency</h4>
            <p className="text-gray-300">
              We're dedicated to exploring ways to save time for educators, maximizing their impact on student learning.
            </p>
          </div>
          
          <div 
            className="bg-gray-700 rounded-lg p-6 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-t-4 border-blue-500"
          >
            <div className="bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Collaboration</h4>
            <p className="text-gray-300">
              We believe in connecting all stakeholders in education to create better learning outcomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</motion.section>



      {/* Testimonials Section */}
      <motion.section
  id="testimonials"
  className="py-16 bg-gray-800"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={sectionVariants}
>        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">What Educators Are Saying</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Feedback from teachers and school administrators using our system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-700 p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Lakshmi Devi</h4>
                  <p className="text-gray-300">Headmistress, Govt. High School</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "The attendance and resource management features have transformed how we run our school. We now have accurate data for mid-day meal allocation, and the time saved on paperwork lets us focus on student needs."
              </p>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-700 p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Ramesh Kumar</h4>
                  <p className="text-gray-300">Science Teacher, Modern School</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "The lesson planning feature has made me a better teacher. I can track what works and what doesn't, and the automated attendance system gives me more time to prepare engaging lessons."
              </p>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-700 p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <School className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Priya Sharma</h4>
                  <p className="text-gray-300">Parent, Class 8 Student</p>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "As a working parent, I appreciate getting SMS updates about my child's attendance. The performance reports help me understand where my child needs support without waiting for parent-teacher meetings."
              </p>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your School's Management?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join schools across the country that are saving time, improving communication, and enhancing education quality.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register" className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-md transition">
              Register Now
            </Link>
            <Link to="/login" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 font-bold py-3 px-8 rounded-md transition">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Edu-StreamLiners</h3>
              <p className="text-gray-400">
                Streamlining educational management to empower teachers and enhance student learning.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#benefits" className="text-gray-400 hover:text-white transition">Benefits</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">Email: shettiprajwal04@gmail.com</p>
              <p className="text-gray-400">Phone: +91 9380005468</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Edu-StreamLiners. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
