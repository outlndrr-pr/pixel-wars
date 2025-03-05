'use client';

import { usePixelWar } from '../contexts/PixelWarContext';
import { EventType } from '../types';
import { Card, Badge, ProgressBar } from './ui';

// Helper function to format time in MM:SS
function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Event icons mapping
const eventIcons: Record<EventType, string> = {
  goldRush: '⭐',
  pixelStorm: '⚡',
  territoryWars: '🏆'
};

export function StatusBar() {
  const { 
    cooldownRemaining, 
    canPlacePixel, 
    user, 
    teams,
    getTeamPixelCount
  } = usePixelWar();
  
  const totalPixels = teams.reduce((acc, team) => acc + getTeamPixelCount(team.id), 0);
  
  return (
    <Card title="Teams Progress Bars" className="animate-fade-in">
      {/* Team progress bars */}
      <div className="space-y-4">
        {teams.map((team) => {
          const pixelCount = getTeamPixelCount(team.id);
          const percentage = totalPixels > 0 ? (pixelCount / totalPixels) * 100 : 0;
          const isUserTeam = user?.teamId === team.id;
          
          return (
            <div key={team.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: team.color }} 
                  />
                  <span className="text-sm font-medium" style={{ color: isUserTeam ? team.color : 'var(--color-text-primary)' }}>
                    {team.name}
                    {isUserTeam && (
                      <span className="ml-2 text-xs py-0.5 px-1.5 rounded bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
                        You
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: team.color,
                  }}
                />
              </div>
              
              <div className="text-xs text-[var(--color-text-tertiary)]">
                {pixelCount.toLocaleString()} pixels
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Cooldown status */}
      {user?.teamId && (
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            {canPlacePixel ? (
              <Badge variant="success" className="w-full py-1 flex justify-center">Ready to place pixels</Badge>
            ) : (
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-[var(--color-text-secondary)]">Cooldown</span>
                  <span className="text-xs font-medium text-[var(--color-warning)]">{formatTime(cooldownRemaining)}</span>
                </div>
                <div className="h-1.5 w-full bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--color-warning)] rounded-full transition-all duration-200"
                    style={{ width: `${100 - (cooldownRemaining / 10000 * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {!user?.teamId && (
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
          <Badge variant="error" className="w-full py-1 flex justify-center">Join a team first</Badge>
        </div>
      )}
    </Card>
  );
} 