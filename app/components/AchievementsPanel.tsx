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

export function AchievementsPanel() {
  const { user } = usePixelWar();
  const [filter, setFilter] = useState<AchievementType | 'all'>('all');
  
  // Ensure achievements exist
  const achievements = user?.achievements || [];
  
  // Group achievements by type
  const achievementsByType = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.type]) {
      acc[achievement.type] = [];
    }
    acc[achievement.type].push(achievement);
    return acc;
  }, {} as Record<AchievementType, typeof achievements>);
  
  // Calculate overall progress
  const completedCount = achievements.filter(a => a.completed).length;
  const totalCount = achievements.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Achievements</h2>
      
      {/* Overall progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            Overall Progress: {completedCount}/{totalCount}
          </span>
          <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            filter === 'all' 
              ? 'bg-blue-100 text-blue-800 border border-blue-300' 
              : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        
        {Object.keys(achievementsByType).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as AchievementType)}
            className={`px-3 py-1 text-sm rounded-full transition-colors flex items-center ${
              filter === type 
                ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{typeIcons[type as AchievementType]}</span>
            {typeNames[type as AchievementType]}
          </button>
        ))}
      </div>
      
      {/* Achievement list */}
      <div className="space-y-4">
        {Object.entries(achievementsByType)
          .filter(([type]) => filter === 'all' || type === filter)
          .map(([type, achievements]) => (
            <div key={type} className="border rounded-md p-3">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                <span className="mr-2">{typeIcons[type as AchievementType]}</span>
                {typeNames[type as AchievementType]}
              </h3>
              
              <div className="space-y-3">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`p-2 rounded ${
                      achievement.completed ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-medium ${
                          achievement.completed ? 'text-green-700' : 'text-gray-700'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-0.5">{achievement.description}</p>
                        
                        {achievement.reward && (
                          <p className="text-xs text-green-600 mt-1">
                            Reward: {achievement.reward}
                          </p>
                        )}
                      </div>
                      
                      {achievement.completed ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Completed
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      )}
                    </div>
                    
                    {!achievement.completed && (
                      <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
} 