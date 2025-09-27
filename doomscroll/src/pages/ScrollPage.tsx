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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entry, setEntry] = useState<any | null>(null);
  
  const topVideoRef = useRef<HTMLVideoElement>(null);
  const bottomVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const STRAPI_URL = (import.meta as any).env?.VITE_STRAPI_URL || 'http://localhost:1337';
  const withBaseUrl = (url?: string | null) => {
    if (!url) return undefined;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${STRAPI_URL}${url}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching from:', `${STRAPI_URL}/collection1`);
        const res = await fetch(`${STRAPI_URL}/collection1`);
        console.log('Response status:', res.status);
        if (!res.ok) throw new Error(`Failed to load data (${res.status})`);
        const json = await res.json();
        console.log('API Response:', json);
        const first = json?.data?.[0] ?? null;
        console.log('First entry:', first);
        setEntry(first);
      } catch (e: any) {
        console.error('API Error:', e);
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFeedbackMessage = (answerId: string, isCorrect: boolean | undefined) => {
    if (answerId && isCorrect === true) {
      return { isCorrect: true, message: ' Excellent! You got it right!' };
    }
    if (answerId && isCorrect === false) {
      return { isCorrect: false, message: ' Not quite! Try again!' };
    }
    return { isCorrect: false, message: 'Try selecting an answer!' };
  };

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    setShowFeedback(true);
  };

  const primarySrc = withBaseUrl(entry?.videoPrimary?.url);
  const secondarySrc = withBaseUrl(entry?.videoSecondary?.url);
  const quizQuestion = entry?.quizQuestion;
  const quizOptionsRaw = entry?.quizOptions;

  const letters = ['a','b','c','d','e','f','g','h'];
  const rawArray = Array.isArray(quizOptionsRaw) ? quizOptionsRaw : [];
  const anyMarked = rawArray.some((o: any) => typeof o === 'object' && o && typeof o.isCorrect === 'boolean');

  const normalizedOptions: { id: string; code: string; isCorrect: boolean }[] = rawArray.map((opt: any, idx: number) => {
    const labelRaw = typeof opt === 'object' && opt ? (opt.label ?? opt.id) : undefined;
    const id = (labelRaw ? String(labelRaw) : letters[idx] || String(idx + 1)).toLowerCase();
    const code = typeof opt === 'string' ? opt : (opt?.code ?? opt?.text ?? JSON.stringify(opt));
    const isCorrectFromOption = (typeof opt === 'object' && opt && typeof opt.isCorrect === 'boolean') ? opt.isCorrect : undefined;
    return { id, code: String(code), isCorrect: isCorrectFromOption ?? Boolean(isCorrectFromOption) };
  });

  const screens = [
    {
      id: 'visual',
      title: 'Visual Learning',
      content: (
        <div className="h-full flex flex-col p-1 gap-1">
                  {/* Top Video - For Loop Tutorial (60%) */}
                  <div className="bg-black rounded-lg overflow-hidden flex-shrink-0" style={{ height: '60%' }}>
                    <video
                      ref={topVideoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted={isMuted}
                      loop
                      controls={false}
                      onLoadStart={() => console.log('Top video loading started')}
                      onLoadedData={() => console.log('Top video loaded')}
                      onError={(e) => console.error('Top video error:', e)}
                    >
                      <source src={primarySrc} type="video/mp4" />
                      <div className="text-white text-center p-4">
                        <p>For Loop Video</p>
                        <p className="text-sm text-gray-400">Video not available</p>
                      </div>
                    </video>
                  </div>
          
          {/* Bottom Video - Minecraft Gameplay (40%) */}
          <div className="bg-red-500 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ height: '40%' }}>
            <video
              ref={bottomVideoRef}
              className="w-full h-full object-cover"
              muted
              loop
              autoPlay
              preload="metadata"
              onLoadStart={() => console.log('Bottom video loading started')}
              onLoadedData={() => console.log('Bottom video loaded')}
              onError={(e) => console.error('Bottom video error:', e)}
            >
              <source src={secondarySrc} type="video/mp4" />
              <div className="text-white text-center p-4">
                <p>Minecraft Video</p>
                <p className="text-sm text-gray-400">Video not available</p>
              </div>
            </video>
          </div>
        </div>
      )
    },
    {
      id: 'quiz',
      title: 'Quiz Time',
      content: (
        <div className="h-full flex flex-col justify-center items-center p-8 bg-white">
          <div className="max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Based on the video you saw earlier, answer this question:</h2>
            <p className="text-lg text-gray-600 mb-8">{quizQuestion}</p>
            
            <div className="space-y-4">
              {(normalizedOptions.length ? normalizedOptions : [
                // Options from the quizOptionsRaw
                // Work in progress
                {
                  id: 'a',
                  code: 'Option A',
                  isCorrect: false
                },
                {
                  id: 'b',
                  code: 'Option B',
                  isCorrect: false
                },
                {
                  id: 'c',
                  code: 'Option C',
                  isCorrect: true
                }
              ]).map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                    selectedAnswer === option.id
                      ? option.isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-semibold">{option.id.toUpperCase()}.</span>
                    <pre className="text-sm bg-gray-100 p-2 rounded flex-1 overflow-x-auto">
                      {option.code}
                    </pre>
                  </div>
                </button>
              ))}
            </div>

            {showFeedback && selectedAnswer && (
              <div className={`mt-6 p-4 rounded-lg ${
                (normalizedOptions.find(o => o.id === selectedAnswer)?.isCorrect ? true : false)
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <p className="font-semibold">{
                  getFeedbackMessage(
                    selectedAnswer,
                    normalizedOptions.find(o => o.id === selectedAnswer)?.isCorrect
                  ).message
                }</p>
              </div>
            )}
          </div>
        </div>
      )
    }
  ];

  const handlePausePlay = () => {
    if (topVideoRef.current && bottomVideoRef.current) {
      if (isPaused) {
        // Play both videos
        topVideoRef.current.play().catch(console.error);
        bottomVideoRef.current.play().catch(console.error);
      } else {
        // Pause both videos
        topVideoRef.current.pause();
        bottomVideoRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const handleMuteToggle = () => {
    if (topVideoRef.current && bottomVideoRef.current) {
      const newMutedState = !isMuted;
      topVideoRef.current.muted = newMutedState;
      bottomVideoRef.current.muted = newMutedState;
      topVideoRef.current.volume = newMutedState ? 0 : 1;
      bottomVideoRef.current.volume = newMutedState ? 0 : 1;
      setIsMuted(newMutedState);
    }
  };

  // Handle scroll navigation with reel-like behavior
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const threshold = 50; // Minimum scroll distance
      
      if (Math.abs(e.deltaY) > threshold) {
        if (e.deltaY > 0 && currentScreen < screens.length - 1) {
          setCurrentScreen(prev => prev + 1);
        } else if (e.deltaY < 0 && currentScreen > 0) {
          setCurrentScreen(prev => prev - 1);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentScreen < screens.length - 1) {
        setCurrentScreen(prev => prev + 1);
      } else if (e.key === 'ArrowUp' && currentScreen > 0) {
        setCurrentScreen(prev => prev - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const startY = touch.clientY;
      
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
      };
      
      const handleTouchEnd = (e: TouchEvent) => {
        const touch = e.changedTouches[0];
        const endY = touch.clientY;
        const deltaY = startY - endY;
        const threshold = 50;
        
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0 && currentScreen < screens.length - 1) {
            setCurrentScreen(prev => prev + 1);
          } else if (deltaY < 0 && currentScreen > 0) {
            setCurrentScreen(prev => prev - 1);
          }
        }
        
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentScreen, screens.length]);

  // Control both videos together when scrolling between screens
  useEffect(() => {
    if (topVideoRef.current && bottomVideoRef.current) {
      if (currentScreen === 0) {
        // On visual screen, play both videos if not manually paused
        if (!isPaused) {
          topVideoRef.current.play().catch(console.error);
          bottomVideoRef.current.play().catch(console.error);
        }
      } else {
        // On quiz screen, pause both videos
        topVideoRef.current.pause();
        bottomVideoRef.current.pause();
      }
    }
  }, [currentScreen, isPaused]);

  // Ensure videos load and play on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (topVideoRef.current && bottomVideoRef.current && currentScreen === 0) {
        // Play both videos on initial load
        topVideoRef.current.play().catch(console.error);
        bottomVideoRef.current.play().catch(console.error);
      }
      
      // Ensure bottom video loads
      if (bottomVideoRef.current) {
        bottomVideoRef.current.load();
        console.log('Bottom video load() called');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={onBack}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
        >
          ← Back to Explore
        </button>
      </div>

      {/* Main Content Container - Reel-like Layout */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {/* Reel Container */}
        <div 
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{ 
            transform: `translateY(-${currentScreen * 100}vh)`,
            height: `${screens.length * 100}vh`
          }}
        >
          {screens.map((screen, index) => (
            <div
              key={screen.id}
              className="w-full h-screen flex flex-col items-center justify-center p-4"
              style={{ 
                height: '100vh',
                scrollSnapAlign: 'start'
              }}
            >
              {/* Mobile Card Container - Centered */}
              <div className="relative bg-black rounded-3xl p-2 shadow-2xl" style={{ aspectRatio: '9/16', height: '90vh', maxHeight: '90vh' }}>
              {/* Mobile Screen Content */}
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                {screen.content}
              </div>

              {/* Engagement Bar */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-20 z-50">
                <div className="flex flex-col space-y-6">
                  {/* Up Arrow */}
                  <button 
                    onClick={() => currentScreen > 0 && setCurrentScreen(currentScreen - 1)}
                    className={`bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm ${
                      currentScreen === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={currentScreen === 0}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  {/* Like Button */}
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>

                  {/* Notes Button */}
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {/* Share Button */}
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>

                  {/* Mute Button */}
                  <button 
                    onClick={handleMuteToggle}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                  >
                    {isMuted ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </button>

                  {/* Pause Button */}
                  <button 
                    onClick={handlePausePlay}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                  >
                    {isPaused ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                      </svg>
                    )}
                  </button>

                  {/* Down Arrow */}
                  <button 
                    onClick={() => currentScreen < screens.length - 1 && setCurrentScreen(currentScreen + 1)}
                    className={`bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm ${
                      currentScreen === screens.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={currentScreen === screens.length - 1}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
            
            {/* Bottom Text - Below Card */}
            <div className="mt-6 flex items-center justify-center space-x-4">
              <div className="text-white text-lg font-semibold">For Loop</div>
              <span className="text-white text-sm bg-green-600 px-3 py-1 rounded-full">Beginner</span>
              <span className="text-white text-sm">by @CodeMaster_42</span>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollPage;