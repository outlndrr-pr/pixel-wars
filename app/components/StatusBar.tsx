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
    events, 
    colorBombCooldown,
    territoryShieldCooldown,
    canUseColorBomb,
    canUseTerritoryShield,
    teams,
    getTeamPixelCount
  } = usePixelWar();
  
  // Format cooldown as seconds
  const cooldownSeconds = Math.ceil(cooldownRemaining / 1000);
  
  // Get upcoming events
  const upcomingEvents = events
    .filter(event => !event.active && event.nextOccurrence)
    .sort((a, b) => (a.nextOccurrence || 0) - (b.nextOccurrence || 0));
  
  // Get active events
  const activeEvents = events.filter(event => event.active);
  
  // Sort teams by pixel count (most pixels first)
  const sortedTeams = [...teams].sort((a, b) => {
    const countA = getTeamPixelCount(a.id);
    const countB = getTeamPixelCount(b.id);
    return countB - countA;
  });
  
  // Calculate pixel percentages for the progress bars
  const totalPixels = sortedTeams.reduce((sum, team) => sum + getTeamPixelCount(team.id), 0);
  
  return (
    <Card title="Teams Progress Bars" className="animate-fade-in">
      {/* Team progress bars */}
      <div className="space-y-3">
        {sortedTeams.map(team => {
          const pixelCount = getTeamPixelCount(team.id);
          const percentage = totalPixels === 0 ? 0 : Math.round((pixelCount / totalPixels) * 100);
          const isUserTeam = user?.teamId === team.id;
          
          return (
            <div key={team.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: team.color }} 
                  />
                  <span className="text-sm font-medium">{team.name}</span>
                  {isUserTeam && (
                    <Badge variant="accent" className="text-xs py-0 px-1">You</Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{percentage}%</span>
              </div>
              
              {/* Progress bar */}
              <ProgressBar 
                value={percentage} 
                max={100}
                size="sm"
                color={team.color}
              />
            </div>
          );
        })}
      </div>
      
      {/* Cooldown status */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          {user?.teamId ? (
            canPlacePixel ? (
              <Badge variant="success">Ready to place</Badge>
            ) : (
              <Badge variant="warning">Cooldown: {formatTime(cooldownRemaining)}</Badge>
            )
          ) : (
            <Badge variant="error">Join a team first</Badge>
          )}
        </div>
      </div>
    </Card>
  );
} 