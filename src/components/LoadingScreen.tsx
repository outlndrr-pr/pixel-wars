import React, { useState, useEffect } from 'react';
import RetroProgressBar from './RetroProgressBar';

type LoadingScreenProps = {
  onLoadComplete?: () => void;
  loadingTime?: number;
  className?: string;
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onLoadComplete,
  loadingTime = 3000, // Default loading time in ms
  className = '',
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          if (onLoadComplete) {
            setTimeout(() => {
              onLoadComplete();
            }, 500);
          }
          return 100;
        }
        return prevProgress + 100 / (loadingTime / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [loadingTime, onLoadComplete]);

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="text-2xl font-bold mb-6">Loading</div>
      <div className="w-full max-w-md">
        <RetroProgressBar progress={progress} />
      </div>
    </div>
  );
};

export default LoadingScreen; 