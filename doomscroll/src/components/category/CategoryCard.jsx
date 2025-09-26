import React from 'react';

const CategoryCard = ({ level, topics, onSelect }) => {
  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginners':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelIcon = (level) => {
    return ''; // Emojis removed
  };

  const getLevelBorderColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginners':
        return 'border-green-200';
      case 'intermediate':
        return 'border-yellow-200';
      case 'advanced':
        return 'border-red-200';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 ${getLevelBorderColor(level)} p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">{level}</h3>
        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getLevelColor(level)}`}>
          {level}
        </span>
      </div>

      {/* Sub-cards for topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer border border-gray-200"
            onClick={() => onSelect(level, topic)}
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-gray-700 text-sm font-medium">{topic}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;