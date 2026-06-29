

interface TimerDisplayProps {
  time: number;
  inverted?: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ time, inverted = false }) => {
  const isWarning = time <= 5;
  const isCritical = time === 0;

  return (
    <div className={`timer-display ${inverted ? 'inverted' : ''} ${isWarning && !isCritical ? 'warning' : ''} ${isCritical ? 'critical' : ''}`}>
      <div className="time-digits">
        {time.toString().padStart(2, '0')}
      </div>
    </div>
  );
};
