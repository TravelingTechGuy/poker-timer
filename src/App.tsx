import { useState, useCallback, useRef, useEffect } from 'react';
import { TimerDisplay } from './components/TimerDisplay';
import { initAudio, playBeep, playWhomp } from './utils/audio';
import { requestWakeLock, releaseWakeLock } from './utils/wakeLock';
import './index.css';

function App() {
  const [initialTime, setInitialTime] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const timerRef = useRef<number | null>(null);

  // Refs for gesture handling
  const stateRef = useRef({ isRunning, isPaused, timeLeft, initialTime });
  const pressTimerRef = useRef<number | null>(null);
  const hasLongPressedRef = useRef(false);

  useEffect(() => {
    stateRef.current = { isRunning, isPaused, timeLeft, initialTime };
  }, [isRunning, isPaused, timeLeft, initialTime]);

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 0) return 0;

      const newTime = prev - 1;

      if (newTime > 0 && newTime <= 5) {
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
        releaseWakeLock();
      }

      return newTime;
    });
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only left click or touch
    if (e.button !== 0 && e.pointerType === 'mouse' && e.type !== 'pointerdown') return;

    // Don't register taps if we are interacting with settings
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
      return;
    }

    hasLongPressedRef.current = false;
    pressTimerRef.current = window.setTimeout(() => {
      hasLongPressedRef.current = true;
      handleLongPress();
    }, 750);
  };

  const handlePointerUp = () => {
    if (pressTimerRef.current !== null) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (!hasLongPressedRef.current) {
      handleSingleTap();
    }
  };

  const handlePointerCancel = () => {
    if (pressTimerRef.current !== null) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handleLongPress = () => {
    const { isRunning, isPaused } = stateRef.current;
    if (isRunning) {
      // Pause
      setIsPaused(true);
      setIsRunning(false);
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      releaseWakeLock();
    } else if (isPaused) {
      // Resume
      setIsPaused(false);
      setIsRunning(true);
      requestWakeLock();
      timerRef.current = window.setInterval(tick, 1000);
    }
  };

  const handleSingleTap = () => {
    const { isRunning, initialTime } = stateRef.current;
    if (isRunning) {
      // Next Player
      setTimeLeft(initialTime);
    }
  };

  const startNewHand = (e: React.MouseEvent) => {
    e.stopPropagation();
    initAudio();
    requestWakeLock();
    setTimeLeft(initialTime);
    setIsRunning(true);
    setIsPaused(false);

    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(tick, 1000);
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

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`app-container ${isPaused ? 'is-paused' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerCancel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Player's view (top, inverted) */}
      <div className="zone top-zone">
        <TimerDisplay time={timeLeft} inverted={true} />
      </div>

      {/* Dealer's view (bottom) */}
      <div className="zone bottom-zone">
        <TimerDisplay time={timeLeft} inverted={false} />
      </div>

      {/* Centered Controls Overlay */}
      {(!isRunning) && (
        <div className="center-controls-overlay">
          <button
            className="btn btn-primary btn-large main-action-btn"
            onClick={startNewHand}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
          >
            {isPaused ? 'Start New Hand' : (timeLeft === 0 ? 'Start New Hand' : 'Start Hand')}
          </button>
          {isPaused && (
            <div className="paused-indicator">
              <span>PAUSED</span>
              <span className="paused-subtext">(Long press to resume)</span>
            </div>
          )}
        </div>
      )}

      {/* Overlays */}
      <button
        className="add-time-btn"
        onClick={addTime}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
      >
        +30
      </button>

      <div
        className="settings-container"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
      >
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

      <div className="footer-label">
        All rights reserved Traveling Tech Guy LLC {new Date().getFullYear()}
      </div>
    </div>
  );
}

export default App;
