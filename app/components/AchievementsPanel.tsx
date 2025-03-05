'use client';

import { useState } from 'react';
import { usePixelWar } from '../contexts/PixelWarContext';
import { AchievementType } from '../types';

// Map achievement types to human-readable names
const typeNames: Record<AchievementType, string> = {
  pixelMilestone: 'Pixel Milestones',
  territoryControl: 'Territory Control',
  patternBuilder: 'Pattern Builder'
};

// Map achievement types to icons
const typeIcons: Record<AchievementType, string> = {
  pixelMilestone: '🎯',
  territoryControl: '🏆',
  patternBuilder: '🧩'
};

interface Achievement {
  id: string;
  name: string;
  description: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_pixel',
    name: 'First Pixel',
    description: 'Place your first pixel on the canvas'
  },
  {
    id: 'team_player',
    name: 'Team Player',
    description: 'Join a team and contribute to their territory'
  },
  {
    id: 'pixel_master',
    name: 'Pixel Master',
    description: 'Place 100 pixels on the canvas'
  },
  {
    id: 'territory_defender',
    name: 'Territory Defender',
    description: 'Successfully defend your team\'s territory for 1 hour'
  }
];

export function AchievementsPanel() {
  const { user } = usePixelWar();
  const unlockedAchievementIds: string[] = user?.achievements || [];

  return (
    <div className="space-y-4">
      {ACHIEVEMENTS.map((achievement: Achievement) => {
        const isUnlocked = unlockedAchievementIds.includes(achievement.id);
        
        return (
          <div
            key={achievement.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              isUnlocked 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
            }`}>
              {isUnlocked ? '✓' : '?'}
            </div>
            
            <div>
              <h3 className="text-sm font-medium">
                {achievement.name}
                <span className={`ml-2 badge ${
                  isUnlocked ? 'badge-default' : 'badge-secondary'
                }`}>
                  {isUnlocked ? 'Unlocked' : 'Locked'}
                </span>
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {achievement.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
} 