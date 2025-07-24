import React, { useState } from 'react';
import style from './Flag.module.css';
import wave from './wave.svg';
import wave2 from './wave2.svg';

const stroke = () => {
  const strokes = [];
  for (let index = 0; index < 24; index++) {
    let deg = 15 * index;
    strokes.push(
      <div
        key={index}
        className={style.stroke}
        style={{ transform: `translate(-50%, -100%) rotate(${deg}deg)` }}
      ></div>
    );
  }
  return strokes;
};

const IndianEmblem = () => (
  <div className={style.emblemContainer}>
    <div className={style.chakra}>
      <div className={style.chakraInner}>{stroke()}</div>
    </div>
  </div>
);

const PrimarySchoolProfile = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [showQuote, setShowQuote] = useState(false);

  const badges = [
    { name: 'Eco Kids', description: 'Environmental Awareness Club' },
    { name: 'Little Innovators', description: 'Science & Tech Explorers' },
    { name: 'Creative Arts', description: 'Art & Craft Club' },
    { name: 'Sports Champs', description: 'Physical Activity & Teamwork' }
  ];

  const achievements = [
    'Best Primary School Award 2023',
    'Excellence in Co-Curricular Activities',
    'Inter-School Sports Champions',
    'Innovative Learning Award'
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-gray-900 mt-8">
      {/* Header with Emblem */}
      <div className="flex items-center justify-center space-x-8 bg-gray-800 p-6 rounded-lg shadow-md">
        <IndianEmblem />
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-300">Satyameva Jayate</h1>
          <h2 className="text-2xl font-semibold text-orange-300">ಸತ್ಯಮೇವ ಜಯತೆ</h2>
          <p className="text-lg text-gray-400">Government of Karnataka</p>
        </div>
        <IndianEmblem />
      </div>

      {/* School Title Card */}
      <div
        className="bg-gray-800 rounded-lg shadow-md p-8 text-center transform transition-all duration-300 hover:shadow-xl"
        onMouseEnter={() => setShowQuote(true)}
        onMouseLeave={() => setShowQuote(false)}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-300 mb-4">
            Bengaluru Government Primary School
          </h1>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <span className="px-3 py-1 bg-blue-700 rounded-full text-blue-200">
              Est. 1980
            </span>
            <span className="px-3 py-1 bg-green-700 rounded-full text-green-200">
              Karnataka State Board
            </span>
            <span className="px-3 py-1 bg-purple-700 rounded-full text-purple-200">
              ISO 9001 Certified
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">
            Mr Prajwal M.Ed.
          </h2>
          <p className="text-xl text-gray-400">Principal</p>
          <div
            className={`transition-all duration-500 overflow-hidden ${
              showQuote ? 'h-20 opacity-100' : 'h-0 opacity-0'
            }`}
          >
            <p className="italic text-gray-400 mt-4">
              "Nurturing curiosity and creativity, building a better future - ಕುತೂಹಲ ಮತ್ತು ಸೃಜನಶೀಲತೆಯಿಂದ ಭವಿಷ್ಯ ನಿರ್ಮಾಣ"
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-gray-700 bg-gray-800 rounded-t-lg p-2">
        {['about', 'academics', 'activities', 'achievements', 'facilities'].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-6 rounded-full transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-400 hover:bg-blue-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Content Sections */}
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        {/* About Section */}
        <div
          className={`transition-all duration-500 ${
            activeTab === 'about' ? 'block' : 'hidden'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-900 to-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">
                Vision
              </h3>
              <p className="text-gray-300">
                To cultivate a lifelong love for learning and holistic development in every child.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-900 to-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold text-green-300 mb-4">
                Mission
              </h3>
              <p className="text-gray-300">
                To provide a nurturing, inclusive environment that fosters creativity, critical thinking, and social responsibility.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-900 to-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-300 mb-4">
                Values
              </h3>
              <p className="text-gray-300">
                Integrity, Respect, Curiosity, and Compassion.
              </p>
            </div>
          </div>
        </div>

        {/* Academics Section */}
        <div
          className={`transition-all duration-500 ${
            activeTab === 'academics' ? 'block' : 'hidden'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-300 mb-4">
                Academic Excellence
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">State Board Results: Over 95% pass rate</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Dedicated & Caring Teaching Staff</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Interactive Digital Classrooms</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">Holistic, Activity-based Learning</span>
                </li>
              </ul>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-300 mb-4">
                Curriculum Programs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-700 rounded-lg">
                  <h4 className="font-semibold text-blue-200">Language & Literacy</h4>
                  <p className="text-sm text-gray-300">
                    Emphasis on Kannada, English & Hindi
                  </p>
                </div>
                <div className="p-4 bg-green-700 rounded-lg">
                  <h4 className="font-semibold text-green-200">Mathematics</h4>
                  <p className="text-sm text-gray-300">
                    Concept-based learning & problem solving
                  </p>
                </div>
                <div className="p-4 bg-purple-700 rounded-lg">
                  <h4 className="font-semibold text-purple-200">Science & Environment</h4>
                  <p className="text-sm text-gray-300">
                    Hands-on experiments & outdoor learning
                  </p>
                </div>
                <div className="p-4 bg-orange-700 rounded-lg">
                  <h4 className="font-semibold text-orange-200">Social Studies</h4>
                  <p className="text-sm text-gray-300">
                    Exploring community & cultural heritage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div
          className={`transition-all duration-500 ${
            activeTab === 'activities' ? 'block' : 'hidden'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-300 mb-4">
                Student Organizations
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-blue-900 to-gray-800 rounded-lg transform transition-all duration-300 hover:scale-105"
                  >
                    <h4 className="font-semibold text-blue-300">{badge.name}</h4>
                    <p className="text-sm text-gray-300">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-300 mb-4">
                Co-Curricular Activities
              </h3>
              <ul className="space-y-3">
                {[
                  'Annual Sports Day',
                  'Art & Craft Exhibition',
                  'Science Fair & Fun Workshops',
                  'Cultural Day Celebrations'
                ].map((activity, index) => (
                  <li key={index} className="flex items-center p-2 rounded-lg transition-all duration-300 hover:bg-blue-900">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-gray-300">{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div
          className={`transition-all duration-500 ${
            activeTab === 'achievements' ? 'block' : 'hidden'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-300 mb-4">
                Recent Achievements
              </h3>
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-gradient-to-r from-blue-900 to-gray-800 rounded-lg transform transition-all duration-300 hover:scale-105"
                >
                  <span className="text-blue-300">{achievement}</span>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-300 mb-4">
                Student Highlights
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-green-900 to-gray-800 rounded-lg">
                  <h4 className="font-semibold text-green-300">
                    Young Innovators Award
                  </h4>
                  <p className="text-gray-300">Celebrating creative problem solving</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-900 to-gray-800 rounded-lg">
                  <h4 className="font-semibold text-purple-300">Art Contest Winners</h4>
                  <p className="text-gray-300">Recognizing excellence in creativity</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-900 to-gray-800 rounded-lg">
                  <h4 className="font-semibold text-orange-300">Sports Day Champions</h4>
                  <p className="text-gray-300">Outstanding performance in inter-school games</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-900 to-gray-800 rounded-lg">
                  <h4 className="font-semibold text-blue-300">Quiz Competition Winners</h4>
                  <p className="text-gray-300">Excellence in academic competitions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities Section */}
        <div
          className={`transition-all duration-500 ${
            activeTab === 'facilities' ? 'block' : 'hidden'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">
                Academic Facilities
              </h3>
              <ul className="space-y-2">
                {[
                  'Modern Classrooms with Smart Boards',
                  'Library with Kid-Friendly Books & Digital Resources',
                  'Interactive Learning Labs'
                ].map((item, index) => (
                  <li key={index} className="flex items-center p-2 hover:bg-blue-900 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">
                Sports Facilities
              </h3>
              <ul className="space-y-2">
                {[
                  'Spacious Playground',
                  'Indoor Games & Activity Area',
                  'Multipurpose Sports Field'
                ].map((item, index) => (
                  <li key={index} className="flex items-center p-2 hover:bg-blue-900 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-300 mb-4">
                Additional Facilities
              </h3>
              <ul className="space-y-2">
                {[
                  'Counseling & Guidance Center',
                  'Cafeteria with Nutritious Meals',
                  'Safe Transport Services',
                  'Parent-Teacher Meeting Rooms'
                ].map((item, index) => (
                  <li key={index} className="flex items-center p-2 hover:bg-blue-900 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimarySchoolProfile;
