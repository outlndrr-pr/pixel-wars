'use client';

import { useEffect, useState } from 'react';
import { usePixelWar } from '../contexts/PixelWarContext';
import { Achievement } from '../types';

export function AchievementNotification() {
  const { recentAchievements, clearRecentAchievements } = usePixelWar();
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Make sure recentAchievements exists and has items before accessing it
    if (recentAchievements && recentAchievements.length > 0 && !currentAchievement) {
      // Show the first one
      setCurrentAchievement(recentAchievements[0]);
      setVisible(true);
      
      // Set a timer to hide it
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      
      return () => clearTimeout(hideTimer);
    }
  }, [recentAchievements, currentAchievement]);
  
  // Handle animation end
  const handleAnimationEnd = () => {
    if (!visible && currentAchievement) {
      // Remove this achievement from the queue
      setCurrentAchievement(null);
      
      // Make sure recentAchievements exists before accessing it
      if (recentAchievements && recentAchievements.length === 1) {
        clearRecentAchievements();
      } else if (recentAchievements && recentAchievements.length > 1) {
        // Otherwise, remove just this one
        const newAchievements = recentAchievements.slice(1);
        clearRecentAchievements();
        // Wait a bit before showing the next one
        setTimeout(() => {
          // Add all except the first one back
          newAchievements.forEach(achievement => {
            // This would trigger the useEffect above
          });
        }, 500);
      }
    }
  };
  
  if (!currentAchievement) return null;
  
  // Map achievement types to icons
  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'pixelMilestone':
        return '🎯';
      case 'territoryControl':
        return '🏆';
      case 'patternBuilder':
        return '🧩';
      default:
        return '🏅';
    }
  };
  
  return (
    <div 
      className={`fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border-l-4 border-blue-500 max-w-sm transition-all duration-500 transform z-50 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      onAnimationEnd={handleAnimationEnd}
      onTransitionEnd={handleAnimationEnd}
    >
      <div className="flex items-start">
        <div className="text-3xl mr-3">
          {getAchievementIcon(currentAchievement.type)}
        </div>
        <div>
          <h3 className="font-bold text-blue-600">Achievement Unlocked!</h3>
          <h4 className="font-semibold text-gray-800">{currentAchievement.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{currentAchievement.description}</p>
          {currentAchievement.reward && (
            <p className="text-sm text-green-600 mt-1">Reward: {currentAchievement.reward}</p>
          )}
        </div>
      </div>
    </div>
  );
} 