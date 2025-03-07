import React from 'react';
import RetroWindow from './RetroWindow';
import { useCanvas } from '@/context/CanvasContext';

type StatsProps = {
  className?: string;
};

const Stats: React.FC<StatsProps> = ({ className = '' }) => {
  const { canvasState, timeUntilNextPixel, formattedTime } = useCanvas();
  
  // You would get these from your backend in a real app
  const activeUsers = 30; // Placeholder
  const totalPixelsPlaced = Object.keys(canvasState.pixels).length;

  return (
    <RetroWindow title="Stats" className={className}>
      <div className="retro-stats">
        <div className="retro-stat-item">
          <span>Active Users</span>
          <span className="font-bold">{activeUsers}</span>
        </div>
        <div className="retro-stat-item">
          <span>Pixels Placed</span>
          <span className="font-bold">{totalPixelsPlaced}</span>
        </div>
        
        <div className="retro-cooldown mt-4">
          {timeUntilNextPixel() > 0 ? (
            <>
              <div className="mb-1">Cooldown:</div>
              <div className="text-xl font-bold">{formattedTime}</div>
            </>
          ) : (
            <div className="text-green-600">Ready to place!</div>
          )}
        </div>
      </div>
    </RetroWindow>
  );
};

export default Stats; 