import React, { useState, useEffect } from 'react';
import CategoryCard from '../components/category/CategoryCard';
import LanguageDropdown from '../components/common/LanguageDropdown';
import ScrollPage from './ScrollPage';
import { getLevels } from '../services/api';

const ExplorePage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [showScrollPage, setShowScrollPage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  // Replace hardcoded categories with API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        const levels = await getLevels();
         // Transform backend data to match existing format
         const transformedCategories = levels.map(level => ({
           level: level.level_title.charAt(0).toUpperCase() + level.level_title.slice(1).toLowerCase(),
           topics: level.types && level.types.length > 0
             ? level.types.map(type => type.type_title)
             : [] // Empty array for levels without populated types
         }));
        setCategories(transformedCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Show empty state if API fails
        setCategories([]);
      }
    };

    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleCategorySelect = (level, topic = null) => {
    if (topic) {
      console.log(`Selected level: ${level}, topic: ${topic}, language: ${selectedLanguage}`);

      // Navigate to any topic that has data
      setShowScrollPage(true);
      setSelectedLevel(level);
      setSelectedType(topic);
    } else {
      console.log(`Selected level: ${level} with language: ${selectedLanguage}`);
    }
    // TODO: Navigate to level content or start learning session
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    console.log(`Language changed to: ${language}`);
  };

  const handleBackToExplore = () => {
    setShowScrollPage(false);
  };

  if (showScrollPage) {
    return <ScrollPage onBack={handleBackToExplore} level={selectedLevel?.toLowerCase()} type={selectedType} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Greeting */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{getGreeting()}!</h1>
              <p className="text-gray-600">Ready to level up your coding skills?</p>
            </div>

            {/* Language Dropdown */}
            <LanguageDropdown
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            DoomScroll Your Way to Coding
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              level={category.level}
              topics={category.topics}
              onSelect={handleCategorySelect}
            />
          ))}
        </div>

      </main>
    </div>
  );
};

export default ExplorePage;