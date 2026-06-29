import { useState, useCallback, useRef, useEffect } from 'react';
import { TimerDisplay } from './components/TimerDisplay';
import { Controls } from './components/Controls';
import { initAudio, playBeep, playWhomp } from './utils/audio';
import './index.css';

function App() {
  const [initialTime, setInitialTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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
        if (timerRef.current !== null) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
      
      return newTime;
    });
  }, []);

  const startTimer = () => {
    initAudio(); 
    setIsRunning(true);
    setIsPaused(false);
    
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }
    
    timerRef.current = window.setInterval(tick, 1000);
  };

  const pauseResumeTimer = () => {
    if (timeLeft === 0) return;
    
    if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
      timerRef.current = window.setInterval(tick, 1000);
    } else {
      setIsPaused(true);
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
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
  };

  const handleTimeChange = (newTime: number) => {
    setInitialTime(newTime);
    setTimeLeft(newTime);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="app-container">
      {/* Player's view (top, inverted) */}
      <div className="zone top-zone">
        <TimerDisplay time={timeLeft} inverted={true} />
      </div>

      {/* Controls view (middle) */}
      <div className="zone middle-zone">
        <Controls 
          isRunning={isRunning} 
          isPaused={isPaused} 
          timeLeft={timeLeft}
          initialTime={initialTime}
          onStart={startTimer}
          onPauseResume={pauseResumeTimer}
          onReset={resetTimer}
          onTimeChange={handleTimeChange}
        />
      </div>

      {/* Dealer's view (bottom) */}
      <div className="zone bottom-zone">
        <TimerDisplay time={timeLeft} inverted={false} />
      </div>
    </div>
  );
}

export default App;
