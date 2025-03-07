'use client';

import { usePixelWar } from '../contexts/PixelWarContext';

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  reward?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_pixel',
    type: 'pixelMilestone',
    title: 'First Pixel',
    description: 'Place your first pixel on the canvas',
    icon: '🎨'
  },
  {
    id: 'team_player',
    type: 'territoryControl',
    title: 'Team Player',
    description: 'Join a team and contribute to their territory',
    icon: '👥'
  },
  {
    id: 'color_master',
    type: 'patternBuilder',
    title: 'Color Master',
    description: 'Use every available color',
    icon: '🌈'
  },
  {
    id: 'territory_king',
    type: 'territoryControl',
    title: 'Territory King',
    description: 'Help your team control 25% of the canvas',
    icon: '👑'
  },
  {
    id: 'pixel_century',
    type: 'pixelMilestone',
    title: 'Pixel Century',
    description: 'Place 100 pixels on the canvas',
    icon: '💯'
  },
  {
    id: 'strategic_eye',
    type: 'patternBuilder',
    title: 'Strategic Eye',
    description: 'Create a pattern of 10 pixels in a row',
    icon: '👁️'
  }
];

export function AchievementsPanel() {
  const { userAchievements = [] } = usePixelWar();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {ACHIEVEMENTS.map((achievement) => {
        const isUnlocked = userAchievements.includes(achievement.id);
        
        return (
          <div 
            key={achievement.id}
            className={`rounded-xl p-4 border transition-all ${
              isUnlocked 
                ? 'bg-white dark:bg-slate-800 border-blue-100 dark:border-blue-900' 
                : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 opacity-75'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium">{achievement.title}</h3>
                  <span 
                    className={`text-xs px-2 py-1 rounded-full ${
                      isUnlocked 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-gray-300'
                    }`}
                  >
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                {achievement.reward && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Reward: {achievement.reward}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 