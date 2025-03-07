import React, { useEffect, useState } from 'react';
import { onUserCountUpdate, onPixelUpdate } from '@/lib/socket';
import { useSession } from 'next-auth/react';
import { useCanvas } from '@/context/CanvasContext';
import RetroWindow from './RetroWindow';
import RetroButton from './RetroButton';
import { useRouter } from 'next/navigation';

type StatsProps = {
  className?: string;
};

const Stats: React.FC<StatsProps> = ({ className = '' }) => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [pixelsPlaced, setPixelsPlaced] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { canvasState, timeUntilNextPixel, formattedTime, canPlacePixel } = useCanvas();
  
  useEffect(() => {
    // Listen for active user count updates
    const unsubscribeUserCount = onUserCountUpdate((count) => {
      setActiveUsers(count);
    });
    
    // Listen for pixel updates (to update total count)
    const unsubscribePixelUpdate = onPixelUpdate((pixelData) => {
      setPixelsPlaced(prev => prev + 1);
    });
    
    // Check if user is anonymous
    if (status === 'authenticated') {
      setIsAnonymous((session.user as any)?.isAnonymous || false);
    }
    
    return () => {
      unsubscribeUserCount();
      unsubscribePixelUpdate();
    };
  }, [session, status]);
  
  const handleSignIn = () => {
    router.push('/auth/signin');
  };
  
  return (
    <RetroWindow title="Stats" className={className}>
      <div className="p-4 retro-stats">
        <div className="retro-stat-item">
          <span>Active Users:</span>
          <span>{activeUsers}</span>
        </div>
        
        <div className="retro-stat-item">
          <span>Pixels Placed:</span>
          <span>{pixelsPlaced.toLocaleString()}</span>
        </div>
        
        <div className="retro-stat-item">
          <span>Pixel Rate:</span>
          <span>{isAnonymous ? '5' : '10'} per minute</span>
        </div>
        
        {/* Cooldown Timer */}
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
        
        {isAnonymous && status === 'authenticated' && (
          <div className="mt-4">
            <RetroButton onClick={handleSignIn} className="w-full text-sm">
              Sign In for More Pixels
            </RetroButton>
          </div>
        )}
      </div>
    </RetroWindow>
  );
};

export default Stats; 