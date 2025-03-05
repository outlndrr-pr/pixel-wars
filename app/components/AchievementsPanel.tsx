'use client';

import { useState } from 'react';
import { usePixelWar } from '../contexts/PixelWarContext';
import { Achievement } from '../types';

// Map achievement types to human-readable names
const typeNames: Record<string, string> = {
  pixelMilestone: 'Pixel Milestones',
  territoryControl: 'Territory Control',
  patternBuilder: 'Pattern Builder'
};

// Map achievement types to icons
const typeIcons: Record<string, string> = {
  pixelMilestone: '🎯',
  territoryControl: '🏆',
  patternBuilder: '🧩'
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_pixel',
    type: 'pixelMilestone',
    title: 'First Pixel',
    description: 'Place your first pixel on the canvas',
    completed: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'team_player',
    type: 'territoryControl',
    title: 'Team Player',
    description: 'Join a team and contribute to their territory',
    completed: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'pixel_master',
    type: 'pixelMilestone',
    title: 'Pixel Master',
    description: 'Place 100 pixels on the canvas',
    completed: false,
    progress: 0,
    maxProgress: 100
  },
  {
    id: 'territory_defender',
    type: 'territoryControl',
    title: 'Territory Defender',
    description: 'Successfully defend your team\'s territory for 1 hour',
    completed: false,
    progress: 0,
    maxProgress: 1
  }
];

export function AchievementsPanel() {
  const { user } = usePixelWar();
  const unlockedAchievements: Achievement[] = user?.achievements || [];

  return (
    <div className="space-y-4">
      {ACHIEVEMENTS.map((achievement) => {
        const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id && a.completed);
        
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
                {achievement.title}
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