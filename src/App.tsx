import { useState, useCallback, useRef, useEffect } from 'react';
import { TimerDisplay } from './components/TimerDisplay';
import { initAudio, playBeep, playWhomp } from './utils/audio';
import './index.css';

function App() {
  const [initialTime, setInitialTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const timerRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 0) return 0;
      
      const newTime = prev - 1;
      
      if (newTime > 0 && newTime <= 5) {
        // intensity from 1 to 5
        const intensity = 6 - newTime; 
        playBeep(intensity);
      } else if (newTime === 0) {
        playWhomp();
      }
      
      if (newTime === 0) {
        setIsRunning(false);
        setIsPaused(false);
        if (timerRef.current !== null) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
      
      return newTime;
    });
  }, []);

  const handleMainAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeLeft === 0) {
      resetTimer();
      return;
    }
    
    if (!isRunning && timeLeft === initialTime) {
      // Start
      initAudio(); 
      setIsRunning(true);
      setIsPaused(false);
      
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
      
      timerRef.current = window.setInterval(tick, 1000);
    } else if (isRunning) {
      // Pause
      setIsPaused(true);
      setIsRunning(false);
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else if (isPaused) {
      // Continue
      setIsPaused(false);
      setIsRunning(true);
      timerRef.current = window.setInterval(tick, 1000);
    }
  };

  const resetTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(initialTime);
    setIsRunning(false);
    setIsPaused(false);
    setIsSettingsOpen(false);
  };

  const handleBackgroundClick = () => {
    resetTimer();
  };

  const addTime = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeLeft((prev) => prev + 30);
  };

  const toggleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSettingsOpen((prev) => !prev);
  };

  const handleTimeChange = (e: React.MouseEvent, newTime: number) => {
    e.stopPropagation();
    setInitialTime(newTime);
    setTimeLeft(newTime);
    setIsSettingsOpen(false);
  };

  const getMainButtonText = () => {
    if (timeLeft === 0) return 'Reset';
    if (!isRunning && timeLeft === initialTime) return 'Start';
    if (isRunning) return 'Pause';
    if (isPaused) return 'Continue';
    return 'Start';
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="app-container" onClick={handleBackgroundClick}>
      {/* Player's view (top, inverted) */}
      <div className="zone top-zone">
        <TimerDisplay time={timeLeft} inverted={true} />
      </div>

      {/* Controls view (middle) */}
      <div className="zone middle-zone">
        <button 
          className={`main-action-btn ${isRunning ? 'btn-secondary' : 'btn-primary'}`}
          onClick={handleMainAction}
        >
          {getMainButtonText()}
        </button>
      </div>

      {/* Dealer's view (bottom) */}
      <div className="zone bottom-zone">
        <TimerDisplay time={timeLeft} inverted={false} />
      </div>

      {/* Overlays */}
      <button className="add-time-btn" onClick={addTime}>
        +30
      </button>

      <div className="settings-container">
        {isSettingsOpen && (
          <div className="settings-menu">
            {[15, 30, 45, 60].map((t) => (
              <button 
                key={t} 
                className={`time-pill ${initialTime === t ? 'active' : ''}`}
                onClick={(e) => handleTimeChange(e, t)}
              >
                {t}s
              </button>
            ))}
          </div>
        )}
        <button className="gear-btn" onClick={toggleSettings}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
