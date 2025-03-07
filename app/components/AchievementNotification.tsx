'use client';

import { useEffect, useState } from 'react';
import { usePixelWar } from '../contexts/PixelWarContext';
import { ACHIEVEMENTS } from './AchievementsPanel';

export function AchievementNotification() {
  const { userAchievements } = usePixelWar();
  const [notification, setNotification] = useState<{ id: string; title: string } | null>(null);
  const [visible, setVisible] = useState(false);
  const [prevAchievements, setPrevAchievements] = useState<string[]>([]);

  useEffect(() => {
    if (!userAchievements) return;
    
    // Check if we have a new achievement
    if (prevAchievements.length < userAchievements.length) {
      // Get the newest achievement
      const newAchievementId = userAchievements.find(id => !prevAchievements.includes(id));
      
      if (newAchievementId) {
        const achievementData = ACHIEVEMENTS.find(a => a.id === newAchievementId);
        if (achievementData) {
          setNotification({
            id: newAchievementId,
            title: achievementData.title
          });
          setVisible(true);
          
          // Hide notification after 5 seconds
          setTimeout(() => {
            setVisible(false);
          }, 5000);
        }
      }
    }
    
    setPrevAchievements([...userAchievements]);
  }, [userAchievements, prevAchievements]);

  if (!notification || !visible) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full transform transition-all duration-500 ease-in-out">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-lg p-4 flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">Achievement Unlocked!</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{notification.title}</p>
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
} 