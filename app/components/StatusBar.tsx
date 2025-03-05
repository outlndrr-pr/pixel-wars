'use client';

import { usePixelWar } from '../contexts/PixelWarContext';
import { EventType } from '../types';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Helper function to format time in MM:SS
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
                    <Badge variant="outline" className="ml-2">
                      You
                    </Badge>
                  )}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {percentage.toFixed(1)}%
              </span>
            </div>
            
            <Progress value={percentage} className="h-2" />
            
            <div className="text-xs text-muted-foreground">
              {pixelCount.toLocaleString()} pixels
            </div>
          </div>
        );
      })}

      {user?.teamId && (
        <div className="mt-6 pt-6 border-t">
          <div className="space-y-2">
            {canPlacePixel ? (
              <Badge variant="outline" className="w-full justify-center">
                Ready to place
              </Badge>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Cooldown</span>
                  <span className="text-xs font-medium">{formatTime(cooldownRemaining)}</span>
                </div>
                <Progress 
                  value={100 - (cooldownRemaining / 10000 * 100)} 
                  className="h-1"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {!user?.teamId && (
        <div className="mt-6 pt-6 border-t">
          <Badge variant="outline" className="w-full justify-center text-destructive">
            Join a team first
          </Badge>
        </div>
      )}
    </div>
  );
} 