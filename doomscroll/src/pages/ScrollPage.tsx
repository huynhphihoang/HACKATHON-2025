import React, { useState, useEffect, useRef } from 'react';

interface ScrollPageProps {
  onBack: () => void;
}

const ScrollPage: React.FC<ScrollPageProps> = ({ onBack }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const topVideoRef = useRef<HTMLVideoElement>(null);
  const bottomVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const screens = [
    {
      type: 'visual',
      content: 'Visual Learning'
    },
    {
      type: 'quiz',
      content: 'Quiz Time'
    }
  ];

  const quizData = {
    question: "Based on the video you saw earlier, what should be the solution of this question?",
    subtitle: "Which of these code prints the given statement 10 times in JavaScript?",
    options: [
      {
        id: 'a',
        code: 'for (let i = 1; i < 10; i++) {\n  console.log("This is a for loop")\n}',
        correct: false
      },
      {
        id: 'b',
        code: 'while (true) {\n  console.log("This is a for loop")\n}',
        correct: false
      },
      {
        id: 'c',
        code: 'while (i != 10){\n  console.log("This is a for loop")\n  i++\n}',
        correct: true
      }
    ]
  };

  const handleAnswerSelect = (optionId: string) => {
    if (selectedAnswer) return; // Prevent multiple selections
    
    setSelectedAnswer(optionId);
    setShowFeedback(true);
  };

  const getFeedbackMessage = (optionId: string) => {
    const option = quizData.options.find(opt => opt.id === optionId);
    if (option?.correct) {
      return "🎉 Excellent! You got it right!";
    } else {
      return "😅 Oops! That's not quite right. Try again!";
    }
  };

  const handlePausePlay = () => {
    if (topVideoRef.current && bottomVideoRef.current) {
      if (isPaused) {
        topVideoRef.current.play();
        bottomVideoRef.current.play();
      } else {
        topVideoRef.current.pause();
        bottomVideoRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const handleMuteToggle = () => {
    if (topVideoRef.current) {
      if (isMuted) {
        topVideoRef.current.volume = 1;
        topVideoRef.current.muted = false;
      } else {
        topVideoRef.current.volume = 0;
        topVideoRef.current.muted = true;
      }
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    if (topVideoRef.current) {
      if (currentScreen === 0) {
        topVideoRef.current.play();
      } else {
        topVideoRef.current.pause();
      }
    }
  }, [currentScreen]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0 && currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else if (e.deltaY < 0 && currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startY = touch.clientY;
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaY = touch.clientY - startY;
      
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentScreen > 0) {
          setCurrentScreen(currentScreen - 1);
        } else if (deltaY < 0 && currentScreen < screens.length - 1) {
          setCurrentScreen(currentScreen + 1);
        }
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' && currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else if (e.key === 'ArrowUp' && currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    } else if (e.key === 'Escape') {
      onBack();
    }
  };

  return (
    <div 
      className="h-screen overflow-hidden bg-black relative"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={containerRef}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
      >
        ← Back to Explore
      </button>

      {/* Screens Container */}
      <div className="h-full flex flex-col">
        {screens.map((screen, index) => (
          <div
            key={index}
            className={`h-full flex items-center justify-center transition-transform duration-500 ${
              index === currentScreen ? 'translate-y-0' : 
              index < currentScreen ? '-translate-y-full' : 'translate-y-full'
            }`}
          >
            {/* Mobile Screen Frame */}
            <div className="relative bg-black rounded-3xl p-2 shadow-2xl" style={{ aspectRatio: '9/16', height: '90vh', maxHeight: '90vh' }}>
              {/* Inner Mobile Screen */}
              <div className="bg-white rounded-2xl h-full overflow-hidden relative">
                
                {/* Top Overlay Bar */}
                <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-black to-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">FL</span>
                      </div>
                      <div>
                        <div className="text-white text-sm font-semibold">for loop</div>
                        <div className="text-gray-300 text-xs">2h ago</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-white text-sm font-semibold">Doom Scroll</div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="h-full pt-16 pb-20">
                  {screen.type === 'visual' ? (
                    <div className="h-full p-1 flex flex-col gap-1">
                      {/* Top Video - For Loop Tutorial */}
                      <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden relative">
                        <video
                          ref={topVideoRef}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted={false}
                          controls
                          style={{ aspectRatio: '16/9' }}
                        >
                          <source src="/src/assets/forloop1.mp4" type="video/mp4" />
                        </video>
                      </div>
                      
                      {/* Bottom Video - Minecraft Gameplay */}
                      <div className="h-24 bg-gray-900 rounded-lg overflow-hidden relative">
                        <video
                          ref={bottomVideoRef}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted={true}
                          style={{ aspectRatio: '16/9' }}
                        >
                          <source src="/src/assets/Minecraft Parkour Gameplay - NO COPYRIGHT (4K QUALITY).mp4" type="video/mp4" />
                        </video>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full p-6 flex flex-col justify-center">
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{quizData.question}</h2>
                        <p className="text-gray-600">{quizData.subtitle}</p>
                      </div>
                      
                      <div className="space-y-4">
                        {quizData.options.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleAnswerSelect(option.id)}
                            disabled={selectedAnswer !== null}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                              selectedAnswer === option.id
                                ? option.correct
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-red-500 bg-red-50'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div className="font-semibold text-gray-800 mb-2">
                              {option.id.toUpperCase()}.
                            </div>
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-100 p-2 rounded">
                              {option.code}
                            </pre>
                          </button>
                        ))}
                      </div>
                      
                      {showFeedback && selectedAnswer && (
                        <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${
                          quizData.options.find(opt => opt.id === selectedAnswer)?.correct
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getFeedbackMessage(selectedAnswer)}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Overlay Bar */}
                <div className="absolute bottom-0 left-0 right-0 z-50 p-4">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-white text-lg font-semibold">For Loop</div>
                    <span className="text-white text-sm bg-green-600 px-2 py-1 rounded-full">Beginner</span>
                    <span className="text-white text-sm">by @CodeMaster_42</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Buttons */}
            <div className="ml-8 flex flex-col items-center space-y-6">
              {/* Like Button */}
              <button className="flex flex-col items-center space-y-1 text-white hover:text-red-500 transition-colors duration-200">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs font-semibold">Like</span>
              </button>

              {/* Notes Button */}
              <button className="flex flex-col items-center space-y-1 text-white hover:text-yellow-500 transition-colors duration-200">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs font-semibold">Notes</span>
              </button>

              {/* Share Button */}
              <button className="flex flex-col items-center space-y-1 text-white hover:text-blue-500 transition-colors duration-200">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3 3 0 000-2.319l4.94-2.47A3 3 0 0015 8z" />
                  </svg>
                </div>
                <span className="text-xs font-semibold">Share</span>
              </button>

              {/* Mute Button */}
              <button 
                onClick={handleMuteToggle}
                className="flex flex-col items-center space-y-1 text-white hover:text-gray-400 transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    {isMuted ? (
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.617l3.766-2.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.617l3.766-2.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                    )}
                  </svg>
                </div>
                <span className="text-xs font-semibold">{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>

              {/* Pause Button */}
              <button 
                onClick={handlePausePlay}
                className="flex flex-col items-center space-y-1 text-white hover:text-gray-400 transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    {isPaused ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    )}
                  </svg>
                </div>
                <span className="text-xs font-semibold">{isPaused ? 'Play' : 'Pause'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollPage;
