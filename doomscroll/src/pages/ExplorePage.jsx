import React, { useState } from 'react';
import CategoryCard from '../components/category/CategoryCard';
import LanguageDropdown from '../components/common/LanguageDropdown';
import ScrollPage from './ScrollPage';

const ExplorePage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [showScrollPage, setShowScrollPage] = useState(false);

  const categories = [
    {
      level: 'Beginners',
      topics: [
        'Data Types (int, float, bool, string)',
        'Operators (arithmetic, comparison, logical)',
        'Conditionals (if, else, switch)',
        'Loops (for, while, do-while)',
        'Functions (definition, parameters, return)',
        'Scope (local vs global variables)',
        'Type Casting (implicit vs explicit)',
        'Basic I/O (print, input, cin/cout, etc.)'
      ]
    },
    {
      level: 'Intermediate',
      topics: [
        'Arrays vs Linked Lists (advantages/disadvantages)',
        'Stacks & Queues (LIFO vs FIFO concepts)',
        'Hash Tables / Dictionaries / Maps',
        'Strings & String Manipulation',
        'Recursion (base case, call stack visualization)',
        'File Handling (read/write files)',
        'Exception Handling (try/catch/finally)',
        'Time Complexity (Big-O basics: O(1), O(n), O(log n))',
        'Memory Management (stack vs heap)'
      ]
    },
    {
      level: 'Advanced',
      topics: [
        'Abstract Data Types (sets, graphs, trees)',
        'Binary Trees vs Binary Search Trees',
        'Sorting Algorithms (bubble, quicksort, Mergesort)',
        'Searching Algorithms (linear, binary, BFS, DFS)',
        'Pointers & References (C/C++ focus)',
        'Object-Oriented Concepts (inheritance, polymorphism, encapsulation, abstraction)'
      ]
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleCategorySelect = (level, topic = null) => {
    if (topic) {
      console.log(`Selected level: ${level}, topic: ${topic}, language: ${selectedLanguage}`);

      // Check if it's "Loops" topic in Beginners level
      if (level === 'Beginners' && topic.includes('Loops')) {
        setShowScrollPage(true);
      }
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
    return <ScrollPage onBack={handleBackToExplore} />;
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
