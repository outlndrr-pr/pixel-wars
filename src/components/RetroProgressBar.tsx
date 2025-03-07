import React from 'react';

type RetroProgressBarProps = {
  progress: number; // Value between 0 and 100
  className?: string;
  label?: string;
};

const RetroProgressBar: React.FC<RetroProgressBarProps> = ({
  progress,
  className = '',
  label,
}) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`${className}`}>
      {label && <div className="mb-1 text-sm font-bold">{label}</div>}
      <div className="retro-progress">
        <div
          className="retro-progress-fill"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default RetroProgressBar; 