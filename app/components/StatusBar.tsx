'use client';

import { usePixelWar } from '../contexts/PixelWarContext';
import { EventType } from '../types';

// Helper function to format time
function formatTime(ms: number): string {
  const seconds = Math.ceil(ms / 1000);
  return `${seconds}s`;
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
    <div className="space-y-6">
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
                <span className="text-sm font-medium">
                  {team.name}
                  {isUserTeam && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-slate-800">
                      You
                    </span>
                  )}
                </span>
              </div>
              <span className="text-sm text-slate-400">
                {percentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all" 
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: team.color 
                }}
              />
            </div>
            
            <div className="text-xs text-slate-400">
              {pixelCount.toLocaleString()} pixels
            </div>
          </div>
        );
      })}

      {user?.teamId && (
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="space-y-2">
            {canPlacePixel ? (
              <div className="text-center py-2 bg-slate-800 rounded-md text-white font-medium">
                Ready to place
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400">Cooldown</span>
                  <span className="text-xs font-medium">{formatTime(cooldownRemaining)}</span>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all" 
                    style={{ width: `${100 - (cooldownRemaining / 10000 * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!user?.teamId && (
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="text-center py-2 bg-red-900/30 rounded-md text-red-400 font-medium">
            Join a team first
          </div>
        </div>
      )}
    </div>
  );
} 