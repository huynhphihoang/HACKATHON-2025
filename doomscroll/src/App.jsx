import React, { useState } from 'react';
import ExplorePage from './pages/ExplorePage';
import ScrollPage from './pages/ScrollPage';

function App() {
  const [showScrollPage, setShowScrollPage] = useState(false);

  const handleLoopsClick = () => {
    setShowScrollPage(true);
  };

  const handleBackToExplore = () => {
    setShowScrollPage(false);
  };

  if (showScrollPage) {
    return <ScrollPage onBack={handleBackToExplore} />;
  }

  return <ExplorePage onLoopsClick={handleLoopsClick} />;
}

export default App;
