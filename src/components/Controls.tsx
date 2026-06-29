

interface ControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  timeLeft: number;
  initialTime: number;
  onStart: () => void;
  onPauseResume: () => void;
  onReset: () => void;
  onTimeChange: (time: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isRunning,
  isPaused,
  timeLeft,
  initialTime,
  onStart,
  onPauseResume,
  onReset,
  onTimeChange
}) => {
  const isReset = !isRunning && timeLeft === initialTime;

  return (
    <div className="controls-container">
      {isReset && (
        <div className="settings-panel">
          {[15, 30, 45, 60].map(t => (
            <button 
              key={t} 
              className={`time-pill ${initialTime === t ? 'active' : ''}`}
              onClick={() => onTimeChange(t)}
            >
              {t}s
            </button>
          ))}
        </div>
      )}
      <div className="controls">
        {isReset ? (
          <button className="btn btn-primary btn-large" onClick={onStart}>
            Start
          </button>
        ) : (
        <>
          <button 
            className="btn btn-secondary" 
            onClick={onPauseResume}
            disabled={timeLeft === 0 && !isPaused}
          >
            {isPaused ? 'Continue' : 'Pause'}
          </button>
          
          <button className="btn btn-danger" onClick={onReset}>
            Reset
          </button>
        </>
      )}
      </div>
    </div>
  );
};
